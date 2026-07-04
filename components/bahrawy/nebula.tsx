'use client'

/**
 * <Nebula />
 *
 * A fullscreen OGL fragment shader that paints a cosmic dust cloud
 * with stars. Two parallax layers of 4-octave fbm noise create the
 * cloud density (each at a different scale + drift speed → the
 * deeper layer moves slower, giving real depth); density is mapped
 * through a 3-color gradient. A hash-on-grid-cells star field
 * twinkles on top with sin-based brightness variation.
 *
 * Drop in as a full-bleed background — auto-resizes to its parent.
 */

import * as React from 'react'
import { Renderer, Program, Mesh, Triangle, Color } from 'ogl'
import { cn } from '@/lib/utils'
import { usePrefersReducedMotion } from '@/lib/use-prefers-reduced-motion'

export interface NebulaProps {
  /** Three colors blended across the cloud density. */
  colors?: [string, string, string]
  /** Animation speed multiplier. Default 1. */
  speed?: number
  /** Star density 0..2. Default 1. */
  starDensity?: number
  /** Overall brightness. Default 1. */
  intensity?: number
  /** Cloud scale — higher = finer detail. Default 1. */
  scale?: number
  className?: string
}

const VERT = /* glsl */ `
attribute vec2 position;
varying vec2 vUv;
void main() {
  vUv = position * 0.5 + 0.5;
  gl_Position = vec4(position, 0.0, 1.0);
}
`

const FRAG = /* glsl */ `
precision highp float;

varying vec2 vUv;
uniform float uTime;
uniform vec2  uResolution;
uniform vec3  uC1;
uniform vec3  uC2;
uniform vec3  uC3;
uniform float uSpeed;
uniform float uStarDensity;
uniform float uIntensity;
uniform float uScale;

// 2D hash + value noise + fbm ----------------------------------------
vec2 hash22(vec2 p) {
  p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
  return fract(sin(p) * 43758.5453);
}
float hash21(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}
float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  float a = hash21(i);
  float b = hash21(i + vec2(1, 0));
  float c = hash21(i + vec2(0, 1));
  float d = hash21(i + vec2(1, 1));
  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}
float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 5; i++) {
    v += a * noise(p);
    p *= 2.03;
    a *= 0.5;
  }
  return v;
}

// Star field — hash per grid cell, brightness via small-distance gauss.
float starField(vec2 uv, float density, float time) {
  vec2 grid = uv * (160.0 + density * 80.0);
  vec2 cell = floor(grid);
  vec2 sub  = fract(grid);
  // Only roughly 1 in N cells holds a star, threshold via hash.
  float h = hash21(cell);
  float threshold = mix(0.992, 0.98, clamp(density, 0.0, 1.0));
  if (h < threshold) return 0.0;
  // Random in-cell position so stars aren't grid-locked.
  vec2 starPos = hash22(cell + 1.7);
  float d = distance(sub, starPos);
  // Twinkle phase per star.
  float twinkle = 0.55 + 0.45 * sin(time * 2.5 + h * 31.0);
  float bright = smoothstep(0.06, 0.0, d) * twinkle;
  // Brighter cores for a few lucky stars.
  if (h > 0.998) bright *= 2.4;
  return bright;
}

void main() {
  float t = uTime * uSpeed;
  vec2 uv = vUv;
  float aspect = uResolution.x / uResolution.y;
  vec2 p = vec2(uv.x * aspect, uv.y) * uScale;

  // Two parallax layers — far one moves slower + at coarser scale.
  float far  = fbm(p * 1.7 + vec2( t * 0.04, -t * 0.06));
  float near = fbm(p * 3.3 + vec2(-t * 0.10,  t * 0.08));

  // Combine: far provides the broad nebula, near adds wisps on top.
  float density = far * 0.65 + near * 0.55;
  density = smoothstep(0.30, 1.05, density);

  // 3-color gradient through density.
  vec3 base = mix(uC1, uC2, smoothstep(0.0, 0.6, density));
  vec3 col  = mix(base, uC3, smoothstep(0.55, 1.0, density));
  // Soften toward dark in low-density regions so the void reads.
  col = mix(vec3(0.012, 0.012, 0.025), col, density);

  // Stars (two octaves — small + bigger sparse).
  float s1 = starField(uv, uStarDensity * 1.0, t);
  float s2 = starField(uv * 0.7 + 9.3, uStarDensity * 0.6, t * 0.7);
  vec3 starCol = vec3(1.0, 0.96, 0.92);
  col += (s1 + s2) * starCol;

  // Hint of the brightest nebula colour around the densest patches.
  col += pow(density, 4.0) * uC3 * 0.18;

  col *= uIntensity;
  gl_FragColor = vec4(col, 1.0);
}
`

export function Nebula({
  colors = ['#1e1b4b', '#A78BFA', '#F472B6'],
  speed = 1,
  starDensity = 1,
  intensity = 1,
  scale = 1,
  className,
}: NebulaProps) {
  const mountRef = React.useRef<HTMLDivElement>(null)
  const reduced = usePrefersReducedMotion()

  React.useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    const renderer = new Renderer({
      dpr: Math.min(window.devicePixelRatio, 2),
      alpha: false,
    })
    const gl = renderer.gl
    gl.clearColor(0.005, 0.005, 0.01, 1)
    mount.appendChild(gl.canvas)
    gl.canvas.style.width = '100%'
    gl.canvas.style.height = '100%'
    gl.canvas.style.display = 'block'

    const c1 = new Color(colors[0])
    const c2 = new Color(colors[1])
    const c3 = new Color(colors[2])

    const geometry = new Triangle(gl)
    const program = new Program(gl, {
      vertex: VERT,
      fragment: FRAG,
      uniforms: {
        uTime: { value: 0 },
        uResolution: { value: [mount.clientWidth, mount.clientHeight] },
        uC1: { value: [c1.r, c1.g, c1.b] },
        uC2: { value: [c2.r, c2.g, c2.b] },
        uC3: { value: [c3.r, c3.g, c3.b] },
        uSpeed: { value: speed },
        uStarDensity: { value: starDensity },
        uIntensity: { value: intensity },
        uScale: { value: scale },
      },
    })
    const mesh = new Mesh(gl, { geometry, program })

    const resize = () => {
      const w = mount.clientWidth
      const h = mount.clientHeight
      if (w === 0 || h === 0) return
      renderer.setSize(w, h)
      program.uniforms.uResolution.value = [w, h]
      // Resizing clears the buffer — repaint the static frame.
      if (reduced) renderer.render({ scene: mesh })
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(mount)

    let raf = 0
    const start = performance.now()
    const animate = (time: number) => {
      program.uniforms.uTime.value = (time - start) / 1000
      renderer.render({ scene: mesh })
      raf = requestAnimationFrame(animate)
    }
    if (reduced) {
      // Reduced motion: draw a single static frame, skip the RAF loop.
      renderer.render({ scene: mesh })
    } else {
      raf = requestAnimationFrame(animate)
    }

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      if (gl.canvas.parentElement === mount) mount.removeChild(gl.canvas)
      const ext = gl.getExtension('WEBGL_lose_context')
      ext?.loseContext()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [colors[0], colors[1], colors[2], speed, starDensity, intensity, scale, reduced])

  return (
    <div
      ref={mountRef}
      className={cn('relative h-full w-full overflow-hidden', className)}
    />
  )
}
