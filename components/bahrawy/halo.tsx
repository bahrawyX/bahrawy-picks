'use client'

/**
 * <Halo />
 *
 * A cursor-reactive WebGL background. A dense grid of glowy spheres
 * (Three.js InstancedMesh) sits on a tilted plane. As the cursor
 * moves over the canvas:
 *
 *  - Each sphere's height is lifted in a custom vertex shader by
 *    a Gaussian falloff around the cursor's world-projected position,
 *    so a soft "halo" rises wherever you point.
 *  - The halo's center lags slightly behind the cursor by the
 *    cursor's velocity vector, giving it a fluid drag feel.
 *  - The whole scene tilts a little toward the cursor (camera
 *    parallax) for extra depth.
 *  - Spheres recolor on bump height — cool base → hot peak with
 *    rim fresnel for a soft glow.
 *
 *  When the cursor leaves the canvas, the halo strength smoothly
 *  fades out and the background breathes on its own via a slow sine
 *  wave across the plane.
 */

import * as React from 'react'
import * as THREE from 'three'
import { cn } from '@/lib/utils'

export interface HaloProps {
  /** Grid resolution (NxN). Default 56 (≈3,136 spheres). */
  density?: number
  /** Plane half-extent in world units. Default 6. */
  extent?: number
  /** Sphere radius. Default 0.07. */
  sphereRadius?: number
  /** Peak bump height under the cursor. Default 1.4. */
  strength?: number
  /** Falloff radius for the cursor halo (world units). Default 1.6. */
  radius?: number
  /** Base sphere color (low / no bump). Hex string. Default cool indigo. */
  baseColor?: string
  /** Peak color at the cursor halo summit. Default warm pink. */
  peakColor?: string
  /** Ambient bounce color in the rim glow. Default deep violet. */
  ambientColor?: string
  /** Background clear color. Default near-black violet. */
  background?: string
  /** Disable cursor interaction (still breathes). Default false. */
  paused?: boolean
  className?: string
}

const VERT = /* glsl */ `
attribute vec3 position;
attribute vec3 normal;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform mat3 normalMatrix;

uniform vec3  uCursor;     // world-space cursor on the plane y=0
uniform vec3  uCursorVel;  // world-space velocity (XZ)
uniform float uTime;
uniform float uRadius;     // halo falloff radius
uniform float uStrength;   // halo peak height

varying float vBump;
varying vec3  vNormal;

void main() {
  // Instance's world-space center (mesh's modelMatrix is identity).
  vec3 instanceWorld = (instanceMatrix * vec4(0.0, 0.0, 0.0, 1.0)).xyz;

  // Distance from this instance to the cursor, with velocity-lag offset
  // so the halo trails behind a moving cursor.
  vec2 toC = instanceWorld.xz - (uCursor.xz - uCursorVel.xz * 0.25);
  float d  = length(toC);

  // Soft Gaussian bump under the cursor.
  float falloff = exp(-(d * d) / max(0.0001, uRadius * uRadius));
  float bump    = falloff * uStrength;

  // Two-frequency ambient breathing — the field stays alive even
  // when the cursor is idle.
  float breath =
      sin(uTime * 0.55 + instanceWorld.x * 0.45 + instanceWorld.z * 0.4) * 0.045
    + sin(uTime * 0.3  - instanceWorld.x * 0.25 + instanceWorld.z * 0.55) * 0.035;

  // Build the world-space vertex, displace Y, then to view + clip.
  vec4 worldVertex = instanceMatrix * vec4(position, 1.0);
  worldVertex.y += bump + breath;

  gl_Position = projectionMatrix * modelViewMatrix * worldVertex;

  vBump  = bump;
  vNormal = normalize(normalMatrix * normal);
}
`

const FRAG = /* glsl */ `
precision highp float;

varying float vBump;
varying vec3  vNormal;

uniform vec3  uColorBase;
uniform vec3  uColorPeak;
uniform vec3  uColorAmbient;
uniform float uStrength;

void main() {
  // Faux directional light from above.
  float light = max(dot(vNormal, normalize(vec3(0.25, 1.0, 0.15))), 0.0) * 0.55 + 0.45;

  // Rim glow against the camera (view-space normal Z).
  float fresnel = pow(1.0 - max(vNormal.z, 0.0), 2.0);

  // Color: base → peak by normalised bump height.
  float t = clamp(vBump / max(0.0001, uStrength), 0.0, 1.0);
  vec3 base = mix(uColorBase, uColorPeak, t);

  vec3 col = base * light + uColorPeak * fresnel * 0.65 + uColorAmbient * 0.12;

  // Brighten the peaks for emphasis.
  col *= 1.0 + t * 1.6;

  gl_FragColor = vec4(col, 1.0);
}
`

// -- helpers ---------------------------------------------------------------

function hexToVec3(hex: string): [number, number, number] {
  const c = new THREE.Color(hex)
  return [c.r, c.g, c.b]
}
function clamp01(x: number) {
  return Math.max(0, Math.min(1, x))
}

// -- component -------------------------------------------------------------

export function Halo({
  density = 56,
  extent = 6,
  sphereRadius = 0.07,
  strength = 1.4,
  radius = 1.6,
  baseColor = '#1B1B4B',
  peakColor = '#FF6FA8',
  ambientColor = '#5E5CE6',
  background = '#06060C',
  paused = false,
  className,
}: HaloProps) {
  const mountRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    // ---- renderer ----
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: false,
      powerPreference: 'high-performance',
    })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setClearColor(new THREE.Color(background), 1)
    mount.appendChild(renderer.domElement)
    renderer.domElement.style.width = '100%'
    renderer.domElement.style.height = '100%'
    renderer.domElement.style.display = 'block'
    renderer.domElement.style.touchAction = 'none'

    // ---- scene + camera ----
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 60)
    camera.position.set(0, 5.6, 8.8)
    camera.lookAt(0, 0, 0)

    // ---- instanced mesh ----
    const sphereGeo = new THREE.SphereGeometry(sphereRadius, 12, 10)
    const material = new THREE.ShaderMaterial({
      vertexShader: VERT,
      fragmentShader: FRAG,
      uniforms: {
        uCursor: { value: new THREE.Vector3(0, 0, 0) },
        uCursorVel: { value: new THREE.Vector3(0, 0, 0) },
        uTime: { value: 0 },
        uRadius: { value: radius },
        uStrength: { value: strength },
        uColorBase: { value: hexToVec3(baseColor) },
        uColorPeak: { value: hexToVec3(peakColor) },
        uColorAmbient: { value: hexToVec3(ambientColor) },
      },
    })

    const total = density * density
    const mesh = new THREE.InstancedMesh(sphereGeo, material, total)
    mesh.frustumCulled = false

    // Build grid of instance matrices on XZ plane.
    const dummy = new THREE.Object3D()
    const step = (extent * 2) / (density - 1)
    let idx = 0
    for (let i = 0; i < density; i++) {
      for (let j = 0; j < density; j++) {
        const x = -extent + i * step
        const z = -extent + j * step
        dummy.position.set(x, 0, z)
        dummy.updateMatrix()
        mesh.setMatrixAt(idx++, dummy.matrix)
      }
    }
    mesh.instanceMatrix.needsUpdate = true
    scene.add(mesh)

    // ---- cursor tracking ----
    const ndc = new THREE.Vector2(0, 0)            // device coords -1..1
    const raycaster = new THREE.Raycaster()
    const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0)
    const cursorTarget = new THREE.Vector3()        // raycast result
    const cursorWorld = new THREE.Vector3()         // smoothed
    const cursorPrev = new THREE.Vector3()
    const cursorVel = new THREE.Vector3()
    let hovering = false
    let liveStrength = 0                            // eased toward target

    const onPointerMove = (e: PointerEvent) => {
      const rect = renderer.domElement.getBoundingClientRect()
      ndc.x = ((e.clientX - rect.left) / rect.width) * 2 - 1
      ndc.y = -((e.clientY - rect.top) / rect.height) * 2 + 1
      hovering = true
    }
    const onPointerLeave = () => {
      hovering = false
    }
    const onPointerEnter = () => {
      hovering = true
    }

    renderer.domElement.addEventListener('pointermove', onPointerMove, { passive: true })
    renderer.domElement.addEventListener('pointerenter', onPointerEnter)
    renderer.domElement.addEventListener('pointerleave', onPointerLeave)

    // ---- resize ----
    const resize = () => {
      const w = mount.clientWidth
      const h = mount.clientHeight
      if (w === 0 || h === 0) return
      renderer.setSize(w, h, false)
      camera.aspect = w / h
      camera.updateProjectionMatrix()
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(mount)

    // ---- animation loop ----
    let raf = 0
    const start = performance.now()
    let last = start

    const animate = (time: number) => {
      const dt = Math.min(0.05, (time - last) / 1000)
      last = time
      const t = (time - start) / 1000
      material.uniforms.uTime.value = t

      if (!paused) {
        // Raycast cursor → world plane.
        raycaster.setFromCamera(ndc, camera)
        if (raycaster.ray.intersectPlane(plane, cursorTarget)) {
          // Smooth toward target so the halo glides instead of snapping.
          const ease = 1 - Math.pow(0.001, dt) // ~independent of frame rate
          cursorWorld.lerp(cursorTarget, ease * 0.6)
        }

        // Velocity = (current - prev) / dt, smoothed via lerp.
        const inv = dt > 0 ? 1 / dt : 0
        const vx = (cursorWorld.x - cursorPrev.x) * inv
        const vz = (cursorWorld.z - cursorPrev.z) * inv
        cursorVel.lerp(new THREE.Vector3(vx, 0, vz), 0.18)
        cursorPrev.copy(cursorWorld)

        // Ease the strength up/down by hover state.
        const targetStrength = hovering ? strength : strength * 0.18
        liveStrength += (targetStrength - liveStrength) * Math.min(1, dt * 4)

        material.uniforms.uCursor.value.copy(cursorWorld)
        material.uniforms.uCursorVel.value.copy(cursorVel)
        material.uniforms.uStrength.value = liveStrength

        // Subtle camera parallax — tilt around origin based on cursor X / Y.
        const px = clamp01((ndc.x + 1) / 2) - 0.5
        const py = clamp01((ndc.y + 1) / 2) - 0.5
        const tx = 0 + px * 1.6
        const ty = 5.6 + py * 0.9
        camera.position.x += (tx - camera.position.x) * Math.min(1, dt * 2.5)
        camera.position.y += (ty - camera.position.y) * Math.min(1, dt * 2.5)
        camera.lookAt(0, 0, 0)
      }

      renderer.render(scene, camera)
      raf = requestAnimationFrame(animate)
    }
    raf = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      renderer.domElement.removeEventListener('pointermove', onPointerMove)
      renderer.domElement.removeEventListener('pointerenter', onPointerEnter)
      renderer.domElement.removeEventListener('pointerleave', onPointerLeave)
      sphereGeo.dispose()
      material.dispose()
      mesh.dispose()
      renderer.dispose()
      if (renderer.domElement.parentElement === mount) {
        mount.removeChild(renderer.domElement)
      }
      const gl = renderer.getContext()
      const lose = gl.getExtension('WEBGL_lose_context')
      lose?.loseContext()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    density,
    extent,
    sphereRadius,
    strength,
    radius,
    baseColor,
    peakColor,
    ambientColor,
    background,
    paused,
  ])

  return (
    <div
      ref={mountRef}
      className={cn('relative h-full w-full overflow-hidden', className)}
    />
  )
}
