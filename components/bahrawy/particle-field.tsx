'use client'

/**
 * <ParticleField />
 *
 * A grid of ~8000 GL points laid out in 3D space; each frame the
 * cursor is raycast onto a plane and any particle inside `radius`
 * gets pushed outward in proportion to (1 - dist/radius)². Particles
 * spring back when the cursor leaves, with a tiny continuous Z-wave
 * so the field is always alive even with no input.
 *
 * Rendered as a single THREE.Points draw call with a shader that
 * makes each vertex a soft-edged circle (no expensive texture lookup).
 */

import * as React from 'react'
import * as THREE from 'three'
import { cn } from '@/lib/utils'
import { usePrefersReducedMotion } from '@/lib/use-prefers-reduced-motion'

export interface ParticleFieldProps {
  /** Total particles. Default 8000. */
  count?: number
  /** Particle base color. Default '#A78BFA'. */
  color?: string
  /** Cursor repulsion radius in world units. Default 1.6. */
  radius?: number
  /** Repulsion strength multiplier. Default 0.6. */
  strength?: number
  /** Base point size. Default 1.6. */
  size?: number
  className?: string
}

const vertexShader = `
attribute float aSeed;
varying float vAlpha;
uniform float uSize;
uniform float uPixelRatio;

void main() {
  vec3 pos = position;
  vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
  // Soft fade based on depth so far particles don't dominate.
  vAlpha = clamp(1.0 - smoothstep(2.0, 8.0, -mvPosition.z), 0.0, 1.0);
  gl_Position = projectionMatrix * mvPosition;
  // Slight per-particle size variation for organic feel.
  float jitter = 0.7 + fract(aSeed * 3.0) * 0.6;
  gl_PointSize = uSize * uPixelRatio * jitter * (5.0 / -mvPosition.z);
}
`

const fragmentShader = `
varying float vAlpha;
uniform vec3 uColor;

void main() {
  // Distance from point center.
  vec2 uv = gl_PointCoord - 0.5;
  float d = length(uv);
  // Smooth soft-edged circle, alpha = 0 at d=0.5.
  float alpha = smoothstep(0.5, 0.0, d);
  if (alpha < 0.01) discard;
  gl_FragColor = vec4(uColor, alpha * vAlpha * 0.85);
}
`

export function ParticleField({
  count = 8000,
  color = '#A78BFA',
  radius = 1.6,
  strength = 0.6,
  size = 1.6,
  className,
}: ParticleFieldProps) {
  const mountRef = React.useRef<HTMLDivElement>(null)
  const reduced = usePrefersReducedMotion()

  React.useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    const W = mount.clientWidth
    const H = mount.clientHeight

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(60, W / H, 0.1, 50)
    camera.position.set(0, 0, 5)
    camera.lookAt(0, 0, 0)

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(W, H, false)
    renderer.setClearColor(0x000000, 0)
    mount.appendChild(renderer.domElement)
    renderer.domElement.style.width = '100%'
    renderer.domElement.style.height = '100%'
    renderer.domElement.style.display = 'block'

    // ── Geometry — grid of particles in a rectangular slab ────────
    const cols = Math.ceil(Math.sqrt(count * 1.6))
    const rows = Math.ceil(count / cols)
    const total = cols * rows
    const positions = new Float32Array(total * 3)
    const basePositions = new Float32Array(total * 3) // resting positions
    const seeds = new Float32Array(total)

    const W3 = 8 // world width
    const H3 = (W3 * H) / W

    for (let i = 0; i < total; i++) {
      const c = i % cols
      const r = Math.floor(i / cols)
      const x = (c / (cols - 1)) * W3 - W3 / 2
      const y = (r / (rows - 1)) * H3 - H3 / 2
      const z = 0
      positions[i * 3 + 0] = x
      positions[i * 3 + 1] = y
      positions[i * 3 + 2] = z
      basePositions[i * 3 + 0] = x
      basePositions[i * 3 + 1] = y
      basePositions[i * 3 + 2] = z
      seeds[i] = Math.random()
    }

    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute('aSeed', new THREE.BufferAttribute(seeds, 1))

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uColor: { value: new THREE.Color(color) },
        uSize: { value: size },
        uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
      },
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    })

    const points = new THREE.Points(geometry, material)
    scene.add(points)

    // ── Mouse → world ray ─────────────────────────────────────────
    const mouse = new THREE.Vector2(999, 999) // start off-canvas
    const target = new THREE.Vector3()
    const ray = new THREE.Raycaster()
    const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0)

    const onMove = (e: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect()
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1
    }
    const onLeave = () => {
      mouse.set(999, 999) // bail to far away → no influence
    }
    mount.addEventListener('mousemove', onMove)
    mount.addEventListener('mouseleave', onLeave)

    // ── Animation loop ────────────────────────────────────────────
    let raf = 0
    const animate = (time: number) => {
      const t = time / 1000

      ray.setFromCamera(mouse, camera)
      const hit = ray.ray.intersectPlane(plane, target)

      const posAttr = geometry.attributes.position as THREE.BufferAttribute
      const pos = posAttr.array as Float32Array
      for (let i = 0; i < total; i++) {
        const i3 = i * 3
        const bx = basePositions[i3]
        const by = basePositions[i3 + 1]
        const bz = basePositions[i3 + 2]

        // Subtle idle wave — uses seed for phase variation.
        const seed = seeds[i]
        const wave = Math.sin(t * 1.2 + seed * 8 + bx * 0.4) * 0.05

        let dx = 0
        let dy = 0
        let dz = wave

        if (hit) {
          const ddx = bx - target.x
          const ddy = by - target.y
          const dist = Math.sqrt(ddx * ddx + ddy * ddy)
          if (dist < radius) {
            const falloff = 1 - dist / radius
            const force = falloff * falloff * strength
            // Push outward + lift toward camera so it feels 3D.
            const nx = ddx / (dist || 1)
            const ny = ddy / (dist || 1)
            dx = nx * force * 0.6
            dy = ny * force * 0.6
            dz += force * 0.9
          }
        }

        // Lerp toward target for smoothness.
        pos[i3] += (bx + dx - pos[i3]) * 0.12
        pos[i3 + 1] += (by + dy - pos[i3 + 1]) * 0.12
        pos[i3 + 2] += (bz + dz - pos[i3 + 2]) * 0.12
      }
      posAttr.needsUpdate = true

      // Slow root rotation for depth interest.
      points.rotation.y = Math.sin(t * 0.18) * 0.18
      points.rotation.x = Math.cos(t * 0.13) * 0.05

      renderer.render(scene, camera)
      raf = requestAnimationFrame(animate)
    }
    if (reduced) {
      // Reduced motion: draw a single static frame (particles at rest),
      // skip the RAF loop.
      renderer.render(scene, camera)
    } else {
      raf = requestAnimationFrame(animate)
    }

    // ── Resize ────────────────────────────────────────────────────
    const ro = new ResizeObserver(() => {
      const w = mount.clientWidth
      const h = mount.clientHeight
      if (w === 0 || h === 0) return
      renderer.setSize(w, h, false)
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      // Resizing clears the buffer — repaint the static frame.
      if (reduced) renderer.render(scene, camera)
    })
    ro.observe(mount)

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
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
  }, [count, color, radius, strength, size, reduced])

  return (
    <div
      ref={mountRef}
      className={cn('relative h-full w-full', className)}
    />
  )
}
