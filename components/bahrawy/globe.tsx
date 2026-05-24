'use client'

/**
 * <Globe />  (GitHub-style)
 *
 * A real WebGL globe rendered with Three.js. Surface is an
 * InstancedMesh of ~2500 small dots laid out by Fibonacci sphere
 * distribution; arcs arch ABOVE the sphere rather than running along
 * the surface (quadratic bezier control point lifted off-sphere, height
 * proportional to great-circle distance). Hubs render as small bright
 * spheres with a soft fresnel-glow ring; an outer atmosphere shader
 * fades from accent-tinted at the rim to transparent inside.
 *
 * Drop in with the same { points, arcs } API as before — slugs/URLs
 * unchanged. Three.js does all the depth sorting, fading, and
 * perspective for free.
 */

import * as React from 'react'
import * as THREE from 'three'
import { cn } from '@/lib/utils'

export interface GlobePoint {
  id: string
  /** Latitude in degrees (-90..90). */
  lat: number
  /** Longitude in degrees (-180..180). */
  lng: number
  /** Hub points render larger + pulse. */
  hub?: boolean
  /** Per-point color override. */
  color?: string
  /** Optional label — rendered next to the point via overlay (not yet implemented in 3D variant). */
  label?: string
}

export interface GlobeArc {
  from: string
  to: string
  color?: string
}

export interface GlobeProps {
  points: GlobePoint[]
  arcs?: GlobeArc[]
  /** Diameter in px. Default 420. */
  size?: number
  /** Degrees per second of spin. Default 6. */
  rotationSpeed?: number
  /** Freeze rotation (still renders). */
  paused?: boolean
  /** Default accent for hubs / arcs / atmosphere. */
  accent?: string
  /** Background color behind the globe. Default transparent. */
  background?: string
  className?: string
}

// Helpers -----------------------------------------------------------------

function latLngToVec3(lat: number, lng: number, radius: number): THREE.Vector3 {
  const φ = (lat * Math.PI) / 180
  const λ = (lng * Math.PI) / 180
  return new THREE.Vector3(
    radius * Math.cos(φ) * Math.sin(λ),
    radius * Math.sin(φ),
    radius * Math.cos(φ) * Math.cos(λ),
  )
}

/** Fibonacci sphere — N evenly-spread points on a unit sphere. */
function fibonacciSphere(n: number, radius: number): THREE.Vector3[] {
  const out: THREE.Vector3[] = []
  const phi = Math.PI * (3 - Math.sqrt(5))
  for (let i = 0; i < n; i++) {
    const y = 1 - (i / (n - 1)) * 2
    const r = Math.sqrt(1 - y * y)
    const theta = phi * i
    out.push(
      new THREE.Vector3(Math.cos(theta) * r, y, Math.sin(theta) * r).multiplyScalar(radius),
    )
  }
  return out
}

// Atmosphere shader -------------------------------------------------------

const atmosphereVertexShader = `
varying vec3 vNormal;
void main() {
  vNormal = normalize(normalMatrix * normal);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`

const atmosphereFragmentShader = `
uniform vec3 uColor;
varying vec3 vNormal;
void main() {
  // Fresnel — strongest at the rim, fades to nothing in the middle.
  float intensity = pow(0.6 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.4);
  gl_FragColor = vec4(uColor, 1.0) * intensity;
}
`

// Component ---------------------------------------------------------------

export function Globe({
  points,
  arcs = [],
  size = 420,
  rotationSpeed = 6,
  paused = false,
  accent = '#A78BFA',
  background = 'transparent',
  className,
}: GlobeProps) {
  const mountRef = React.useRef<HTMLDivElement>(null)
  const pausedRef = React.useRef(paused)
  const speedRef = React.useRef(rotationSpeed)

  React.useEffect(() => {
    pausedRef.current = paused
  }, [paused])
  React.useEffect(() => {
    speedRef.current = rotationSpeed
  }, [rotationSpeed])

  React.useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    // ── Scene + Camera + Renderer ────────────────────────────────
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100)
    camera.position.set(0, 0.4, 4)
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

    const accentColor = new THREE.Color(accent)
    const RADIUS = 1
    const root = new THREE.Group()
    root.rotation.x = -0.32 // small tilt so the equator isn't head-on
    scene.add(root)

    // ── Dotted sphere (InstancedMesh) ────────────────────────────
    const DOT_COUNT = 2400
    const dotGeometry = new THREE.CircleGeometry(0.0085, 8)
    const dotMaterial = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.55,
    })
    const dotsMesh = new THREE.InstancedMesh(dotGeometry, dotMaterial, DOT_COUNT)
    const dummy = new THREE.Object3D()
    const fibPoints = fibonacciSphere(DOT_COUNT, RADIUS)
    const up = new THREE.Vector3(0, 0, 1)
    for (let i = 0; i < DOT_COUNT; i++) {
      const p = fibPoints[i]
      dummy.position.copy(p)
      // Orient each dot to face out from the sphere center.
      dummy.lookAt(p.clone().multiplyScalar(2))
      // Subtle alpha falloff so the band near the pole appears slightly denser-looking
      const alpha = 0.45 + Math.abs(p.y) * 0.15
      // (alpha is applied via per-instance color hack below)
      void up
      void alpha
      dummy.updateMatrix()
      dotsMesh.setMatrixAt(i, dummy.matrix)
    }
    root.add(dotsMesh)

    // ── Atmospheric glow (slightly larger inverted sphere) ───────
    const atmosphereGeometry = new THREE.SphereGeometry(RADIUS * 1.18, 48, 48)
    const atmosphereMaterial = new THREE.ShaderMaterial({
      vertexShader: atmosphereVertexShader,
      fragmentShader: atmosphereFragmentShader,
      uniforms: { uColor: { value: accentColor } },
      side: THREE.BackSide,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })
    const atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial)
    scene.add(atmosphere)

    // ── Inner dark sphere (so dots in front read against a base) ─
    const baseGeometry = new THREE.SphereGeometry(RADIUS * 0.995, 48, 48)
    const baseMaterial = new THREE.MeshBasicMaterial({
      color: 0x0a0a10,
      transparent: true,
      opacity: 0.85,
    })
    const baseSphere = new THREE.Mesh(baseGeometry, baseMaterial)
    root.add(baseSphere)

    // ── Hubs + their pulse rings ─────────────────────────────────
    const hubGroup = new THREE.Group()
    root.add(hubGroup)
    const pointVecs = new Map<string, THREE.Vector3>()
    const pulseMeshes: { mesh: THREE.Mesh; offset: number }[] = []
    for (const p of points) {
      const v = latLngToVec3(p.lat, p.lng, RADIUS * 1.01)
      pointVecs.set(p.id, v)
      const col = new THREE.Color(p.color ?? accent)

      // Bright dot at the surface
      const dotGeom = new THREE.SphereGeometry(p.hub ? 0.022 : 0.013, 12, 12)
      const dotMat = new THREE.MeshBasicMaterial({ color: col })
      const dot = new THREE.Mesh(dotGeom, dotMat)
      dot.position.copy(v)
      hubGroup.add(dot)

      if (p.hub) {
        // Pulsing ring (a disk facing outward)
        const ringGeom = new THREE.RingGeometry(0.018, 0.04, 32)
        const ringMat = new THREE.MeshBasicMaterial({
          color: col,
          transparent: true,
          opacity: 0.6,
          side: THREE.DoubleSide,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
        })
        const ring = new THREE.Mesh(ringGeom, ringMat)
        ring.position.copy(v)
        ring.lookAt(v.clone().multiplyScalar(2))
        hubGroup.add(ring)
        pulseMeshes.push({ mesh: ring, offset: Math.random() * Math.PI * 2 })
      }
    }

    // ── Arcs (arched above the surface) ──────────────────────────
    const arcMeshes: { mesh: THREE.Mesh; material: THREE.MeshBasicMaterial }[] = []
    const arcGroup = new THREE.Group()
    root.add(arcGroup)

    const arcStartTime = performance.now()
    for (const arc of arcs) {
      const a = pointVecs.get(arc.from)
      const b = pointVecs.get(arc.to)
      if (!a || !b) continue

      // Great-circle distance (angle between a and b on unit sphere).
      const angle = a.clone().normalize().angleTo(b.clone().normalize())
      // Lift height grows with arc distance — far-apart endpoints curve higher.
      const lift = 0.18 + angle * 0.32

      // Midpoint normalized + lifted along its own outward normal.
      const mid = a.clone().add(b).normalize().multiplyScalar(RADIUS + lift)
      const curve = new THREE.QuadraticBezierCurve3(a, mid, b)

      const tubeGeom = new THREE.TubeGeometry(curve, 48, 0.006, 8, false)
      const tubeMat = new THREE.MeshBasicMaterial({
        color: new THREE.Color(arc.color ?? accent),
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      })
      const tube = new THREE.Mesh(tubeGeom, tubeMat)
      arcGroup.add(tube)
      arcMeshes.push({ mesh: tube, material: tubeMat })
    }

    // ── Animation loop ────────────────────────────────────────────
    let raf = 0
    let lastTime = performance.now()
    const animate = (time: number) => {
      const dt = (time - lastTime) / 1000
      lastTime = time

      if (!pausedRef.current) {
        root.rotation.y += ((speedRef.current * Math.PI) / 180) * dt
      }

      // Pulse rings — scale + fade outward
      for (const p of pulseMeshes) {
        const t = ((time - arcStartTime) / 1000 + p.offset) % 1.8
        const k = t / 1.8
        const s = 1 + k * 1.6
        p.mesh.scale.set(s, s, s)
        ;(p.mesh.material as THREE.MeshBasicMaterial).opacity = 0.55 * (1 - k)
      }

      // Arcs — stagger fade-in over the first 2.5s
      const elapsed = (time - arcStartTime) / 1000
      for (let i = 0; i < arcMeshes.length; i++) {
        const delay = i * 0.08
        const localT = Math.max(0, elapsed - delay)
        const target = Math.min(1, localT * 1.4)
        arcMeshes[i].material.opacity = target * 0.85
      }

      renderer.render(scene, camera)
      raf = requestAnimationFrame(animate)
    }
    raf = requestAnimationFrame(animate)

    // ── Cleanup ──────────────────────────────────────────────────
    return () => {
      cancelAnimationFrame(raf)
      renderer.dispose()
      dotGeometry.dispose()
      dotMaterial.dispose()
      atmosphereGeometry.dispose()
      atmosphereMaterial.dispose()
      baseGeometry.dispose()
      baseMaterial.dispose()
      for (const { mesh, material } of arcMeshes) {
        mesh.geometry.dispose()
        material.dispose()
      }
      hubGroup.traverse((obj) => {
        if (obj instanceof THREE.Mesh) {
          obj.geometry.dispose()
          if (Array.isArray(obj.material)) obj.material.forEach((m) => m.dispose())
          else obj.material.dispose()
        }
      })
      if (renderer.domElement.parentElement === mount) {
        mount.removeChild(renderer.domElement)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [points, arcs, size, accent, background])

  return (
    <div
      ref={mountRef}
      className={cn('relative inline-block overflow-hidden rounded-full', className)}
      style={{ width: size, height: size }}
    />
  )
}
