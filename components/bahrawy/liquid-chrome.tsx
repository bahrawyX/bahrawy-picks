'use client'

/**
 * <LiquidChrome />
 *
 * A slowly-morphing organic blob rendered with Three.js. We start
 * with an icosphere (high subdivision count → smooth surface), then
 * the vertex shader displaces each vertex along its normal by a
 * 3D-simplex-noise sample of (position * freq + time). The result is
 * an animated metaball-ish form that breathes continuously.
 *
 * The fragment shader fakes an environment reflection without a
 * cubemap: it computes a fresnel term + the reflected view direction,
 * then samples a hand-mixed 3-color gradient based on the reflection
 * vector's direction. Cheap, no asset loading, and the chrome look
 * sells the depth.
 *
 * Cursor X/Y modulates the noise frequency so moving the mouse
 * subtly deforms the surface.
 */

import * as React from 'react'
import * as THREE from 'three'
import { cn } from '@/lib/utils'

export interface LiquidChromeProps {
  /** Container size in px. Default 480. */
  size?: number
  /** Displacement strength. Default 0.28. */
  amplitude?: number
  /** Noise frequency (higher = finer ripples). Default 1.6. */
  frequency?: number
  /** Time multiplier — controls morphing speed. Default 0.45. */
  speed?: number
  /** Three colour stops blended across the surface. */
  colors?: [string, string, string]
  /** Background colour behind the blob. Default transparent. */
  background?: string
  /** Disable rotation. Default false. */
  paused?: boolean
  className?: string
}

// ---------------------------------------------------------------------------
// GLSL — Ashima/McEwan simplex noise (3D) trimmed to essentials
// ---------------------------------------------------------------------------

const SIMPLEX = /* glsl */ `
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 permute(vec4 x) { return mod289(((x * 34.0) + 1.0) * x); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

float snoise(vec3 v) {
  const vec2 C = vec2(1.0/6.0, 1.0/3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
  vec3 i  = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);
  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;
  i = mod289(i);
  vec4 p = permute(permute(permute(
              i.z + vec4(0.0, i1.z, i2.z, 1.0))
            + i.y + vec4(0.0, i1.y, i2.y, 1.0))
            + i.x + vec4(0.0, i1.x, i2.x, 1.0));
  float n_ = 0.142857142857;
  vec3 ns = n_ * D.wyz - D.xzx;
  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);
  vec4 x = x_ * ns.x + ns.yyyy;
  vec4 y = y_ * ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);
  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);
  vec4 s0 = floor(b0) * 2.0 + 1.0;
  vec4 s1 = floor(b1) * 2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));
  vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
  p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
}
`

const VERT = /* glsl */ `
${SIMPLEX}

uniform float uTime;
uniform float uAmplitude;
uniform float uFrequency;
uniform vec2  uMouse;
varying vec3 vNormal;
varying vec3 vViewPosition;
varying float vNoise;

void main() {
  // Mouse offset shifts the noise sampling so movement deforms the surface.
  vec3 samplePos = position * uFrequency + vec3(uMouse * 0.6, uTime * 0.4);
  float n = snoise(samplePos);
  // A second octave for richer surface detail.
  float n2 = snoise(samplePos * 2.1 + 19.7) * 0.4;
  float displacement = (n + n2) * uAmplitude;

  vec3 displaced = position + normal * displacement;
  vec4 mvPosition = modelViewMatrix * vec4(displaced, 1.0);

  vNormal = normalize(normalMatrix * normal);
  vViewPosition = -mvPosition.xyz;
  vNoise = n;

  gl_Position = projectionMatrix * mvPosition;
}
`

const FRAG = /* glsl */ `
varying vec3 vNormal;
varying vec3 vViewPosition;
varying float vNoise;
uniform vec3 uColorA;
uniform vec3 uColorB;
uniform vec3 uColorC;
uniform float uTime;

void main() {
  vec3 N = normalize(vNormal);
  vec3 V = normalize(vViewPosition);
  // Fresnel — bright at grazing angles.
  float fresnel = pow(1.0 - max(dot(N, V), 0.0), 1.8);
  // Reflection direction → used as a cheap "env map".
  vec3 R = reflect(-V, N);

  // Iridescent banded environment: shift colour by reflection direction.
  float band = R.y * 0.5 + 0.5;
  float swirl = sin(R.x * 4.0 + uTime * 0.3) * 0.5 + 0.5;

  vec3 base = mix(uColorA, uColorB, band);
  vec3 chrome = mix(base, uColorC, swirl * 0.6);
  vec3 col = mix(chrome, uColorC, fresnel * 0.9);

  // Spec hit — a punchier highlight along R.y.
  float spec = pow(max(R.y, 0.0), 12.0) * 1.4;
  col += spec * vec3(1.0);

  // Subtle hint of the underlying noise so the morph reads on flat areas.
  col += vNoise * 0.04;

  gl_FragColor = vec4(col, 1.0);
}
`

// ---------------------------------------------------------------------------

export function LiquidChrome({
  size = 480,
  amplitude = 0.28,
  frequency = 1.6,
  speed = 0.45,
  colors = ['#A78BFA', '#22D3EE', '#F472B6'],
  background = 'transparent',
  paused = false,
  className,
}: LiquidChromeProps) {
  const mountRef = React.useRef<HTMLDivElement>(null)
  const pausedRef = React.useRef(paused)
  const speedRef = React.useRef(speed)
  React.useEffect(() => {
    pausedRef.current = paused
  }, [paused])
  React.useEffect(() => {
    speedRef.current = speed
  }, [speed])

  React.useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100)
    camera.position.set(0, 0, 3.6)
    camera.lookAt(0, 0, 0)

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: background === 'transparent',
    })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(size, size, false)
    if (background !== 'transparent') {
      renderer.setClearColor(new THREE.Color(background), 1)
    } else {
      renderer.setClearColor(0x000000, 0)
    }
    mount.appendChild(renderer.domElement)
    renderer.domElement.style.width = '100%'
    renderer.domElement.style.height = '100%'
    renderer.domElement.style.display = 'block'

    // High-subdivision icosahedron — smooth enough that displacement looks fluid.
    const geometry = new THREE.IcosahedronGeometry(1, 80)
    const cA = new THREE.Color(colors[0])
    const cB = new THREE.Color(colors[1])
    const cC = new THREE.Color(colors[2])
    const material = new THREE.ShaderMaterial({
      vertexShader: VERT,
      fragmentShader: FRAG,
      uniforms: {
        uTime: { value: 0 },
        uAmplitude: { value: amplitude },
        uFrequency: { value: frequency },
        uMouse: { value: new THREE.Vector2(0, 0) },
        uColorA: { value: cA },
        uColorB: { value: cB },
        uColorC: { value: cC },
      },
    })
    const blob = new THREE.Mesh(geometry, material)
    scene.add(blob)

    // Mouse → normalised [-1..1] inside the mount
    const mouse = new THREE.Vector2(0, 0)
    const onMove = (e: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect()
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1
    }
    const onLeave = () => {
      // Smoothly drift back to 0 (handled in loop)
    }
    mount.addEventListener('mousemove', onMove)
    mount.addEventListener('mouseleave', onLeave)

    let raf = 0
    const start = performance.now()
    let lastTime = start
    const animate = (time: number) => {
      const dt = (time - lastTime) / 1000
      lastTime = time

      if (!pausedRef.current) {
        blob.rotation.y += dt * 0.25
        blob.rotation.x += dt * 0.08
      }
      // Ease the shader's mouse uniform toward the live mouse — feels nicer
      // than snapping the deformation each frame.
      const target = material.uniforms.uMouse.value as THREE.Vector2
      target.x += (mouse.x - target.x) * 0.08
      target.y += (mouse.y - target.y) * 0.08

      material.uniforms.uTime.value = ((time - start) / 1000) * speedRef.current
      renderer.render(scene, camera)
      raf = requestAnimationFrame(animate)
    }
    raf = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(raf)
      mount.removeEventListener('mousemove', onMove)
      mount.removeEventListener('mouseleave', onLeave)
      geometry.dispose()
      material.dispose()
      renderer.dispose()
      if (renderer.domElement.parentElement === mount) {
        mount.removeChild(renderer.domElement)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [size, amplitude, frequency, colors[0], colors[1], colors[2], background])

  return (
    <div
      ref={mountRef}
      className={cn('relative inline-block', className)}
      style={{ width: size, height: size }}
    />
  )
}
