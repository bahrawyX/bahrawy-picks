'use client'

/**
 * <Globe />
 *
 * A pure-SVG rotating sphere with great-circle arc lines connecting
 * geographic points. Each frame:
 *
 *   1. Each point's (lat, lng) → 3D position on a unit sphere.
 *   2. Apply a Y-axis rotation matrix (the spin) plus a small
 *      X-axis tilt so the equator isn't flat-on.
 *   3. Project orthographically — front-facing points (z > 0) render
 *      with full opacity, back-facing fade.
 *   4. Arcs slerp between two points and sample N waypoints, draw
 *      a path through the projected positions.
 *
 * Hubs are slightly larger and pulse softly. The whole thing animates
 * via rAF so the sphere actually rotates — not just CSS transforms.
 */

import * as React from 'react'
import { motion } from 'framer-motion'
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
  /** Optional label rendered next to the point when visible. */
  label?: string
}

export interface GlobeArc {
  from: string  // point id
  to: string    // point id
  color?: string
}

export interface GlobeProps {
  points: GlobePoint[]
  arcs?: GlobeArc[]
  /** Diameter in px. Default 360. */
  size?: number
  /** Degrees per second of spin. Default 6. */
  rotationSpeed?: number
  /** Stop the spin (still renders projected positions). */
  paused?: boolean
  /** Default accent for hubs / arcs. */
  accent?: string
  className?: string
}

// 3D vector helpers --------------------------------------------------------

type Vec3 = { x: number; y: number; z: number }

function latLngToVec3(lat: number, lng: number): Vec3 {
  const φ = (lat * Math.PI) / 180
  const λ = (lng * Math.PI) / 180
  return {
    x: Math.cos(φ) * Math.sin(λ),
    y: Math.sin(φ),
    z: Math.cos(φ) * Math.cos(λ),
  }
}

function rotateY(v: Vec3, angle: number): Vec3 {
  const c = Math.cos(angle)
  const s = Math.sin(angle)
  return { x: v.x * c + v.z * s, y: v.y, z: -v.x * s + v.z * c }
}

function rotateX(v: Vec3, angle: number): Vec3 {
  const c = Math.cos(angle)
  const s = Math.sin(angle)
  return { x: v.x, y: v.y * c - v.z * s, z: v.y * s + v.z * c }
}

function normalize(v: Vec3): Vec3 {
  const m = Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z) || 1
  return { x: v.x / m, y: v.y / m, z: v.z / m }
}

function slerp(a: Vec3, b: Vec3, t: number): Vec3 {
  const dot = Math.max(-1, Math.min(1, a.x * b.x + a.y * b.y + a.z * b.z))
  const ω = Math.acos(dot)
  if (ω < 1e-4) return a
  const s = Math.sin(ω)
  const k1 = Math.sin((1 - t) * ω) / s
  const k2 = Math.sin(t * ω) / s
  return {
    x: a.x * k1 + b.x * k2,
    y: a.y * k1 + b.y * k2,
    z: a.z * k1 + b.z * k2,
  }
}

// Component ---------------------------------------------------------------

const TILT_X = -0.32 // ~ -18° tilt so the equator isn't head-on

export function Globe({
  points,
  arcs = [],
  size = 360,
  rotationSpeed = 6,
  paused = false,
  accent = '#A78BFA',
  className,
}: GlobeProps) {
  const [angle, setAngle] = React.useState(0)
  const angleRef = React.useRef(0)
  const lastTimeRef = React.useRef(0)
  const rafRef = React.useRef(0)

  React.useEffect(() => {
    if (paused) return
    const speed = (rotationSpeed * Math.PI) / 180 // rad/sec
    const tick = (time: number) => {
      const last = lastTimeRef.current || time
      const dt = (time - last) / 1000
      lastTimeRef.current = time
      angleRef.current += speed * dt
      setAngle(angleRef.current)
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [paused, rotationSpeed])

  const R = size / 2 - 8
  const cx = size / 2
  const cy = size / 2

  const project = (v: Vec3) => {
    const ry = rotateY(v, angle)
    const rx = rotateX(ry, TILT_X)
    return { x: cx + rx.x * R, y: cy - rx.y * R, depth: rx.z }
  }

  // Pre-compute projected positions per render.
  const projectedPoints = React.useMemo(() => {
    return points.map((p) => {
      const v3 = latLngToVec3(p.lat, p.lng)
      const proj = project(v3)
      return { ...p, ...proj, v3 }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [points, angle])

  const pointById = React.useMemo(() => {
    const map = new Map(projectedPoints.map((p) => [p.id, p]))
    return map
  }, [projectedPoints])

  // Arc paths sampled along the great-circle.
  const arcPaths = React.useMemo(() => {
    return arcs.map((arc) => {
      const from = pointById.get(arc.from)
      const to = pointById.get(arc.to)
      if (!from || !to) return null
      const STEPS = 28
      const pts: { x: number; y: number; visible: boolean }[] = []
      for (let i = 0; i <= STEPS; i++) {
        const t = i / STEPS
        const v = slerp(from.v3, to.v3, t)
        const proj = project(normalize(v))
        pts.push({ x: proj.x, y: proj.y, visible: proj.depth > -0.1 })
      }
      // Build a piecewise path that breaks on far-side hops.
      let d = ''
      let drawing = false
      for (const p of pts) {
        if (!p.visible) {
          drawing = false
          continue
        }
        d += drawing ? ` L ${p.x.toFixed(1)} ${p.y.toFixed(1)}` : `M ${p.x.toFixed(1)} ${p.y.toFixed(1)}`
        drawing = true
      }
      return { id: `${arc.from}->${arc.to}`, d, color: arc.color ?? accent }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [arcs, pointById, angle, accent])

  return (
    <div
      className={cn('relative inline-block', className)}
      style={{ width: size, height: size }}
    >
      {/* Soft outer glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-full"
        style={{
          background: `radial-gradient(circle at 50% 50%, ${accent}1a 0%, transparent 60%)`,
        }}
      />

      <svg
        viewBox={`0 0 ${size} ${size}`}
        width={size}
        height={size}
        className="relative"
      >
        {/* Sphere base */}
        <defs>
          <radialGradient id="bahrawy-globe-grad" cx="35%" cy="30%" r="80%">
            <stop offset="0%" stopColor="#1a1525" />
            <stop offset="55%" stopColor="#0c0c12" />
            <stop offset="100%" stopColor="#050507" />
          </radialGradient>
          <radialGradient id="bahrawy-globe-rim" cx="50%" cy="50%" r="50%">
            <stop offset="92%" stopColor="rgba(255,255,255,0)" />
            <stop offset="100%" stopColor={`${accent}55`} />
          </radialGradient>
        </defs>
        <circle cx={cx} cy={cy} r={R} fill="url(#bahrawy-globe-grad)" />
        <circle cx={cx} cy={cy} r={R} fill="url(#bahrawy-globe-rim)" />

        {/* Faint equator + a couple meridians for depth cues */}
        <Wireframe size={size} R={R} cx={cx} cy={cy} angle={angle} />

        {/* Arcs */}
        {arcPaths.map((arc, i) =>
          arc ? (
            <motion.path
              key={arc.id}
              d={arc.d}
              fill="none"
              stroke={arc.color}
              strokeWidth={1.25}
              strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.85 }}
              transition={{
                duration: 1.6,
                delay: 0.05 * i,
                ease: [0.22, 1, 0.36, 1],
              }}
              style={{
                filter: `drop-shadow(0 0 4px ${arc.color}66)`,
              }}
            />
          ) : null,
        )}

        {/* Points */}
        {projectedPoints.map((p) => {
          const visible = p.depth > -0.05
          if (!visible) return null
          const opacity = Math.max(0.2, p.depth + 0.1)
          const r = p.hub ? 3.5 : 2
          const fill = p.color ?? accent
          return (
            <g key={p.id} opacity={opacity}>
              {p.hub && (
                <motion.circle
                  cx={p.x}
                  cy={p.y}
                  r={r + 2}
                  fill="none"
                  stroke={fill}
                  strokeWidth={1}
                  animate={{ r: [r + 2, r + 7], opacity: [0.6, 0] }}
                  transition={{ duration: 1.6, repeat: Infinity, ease: 'easeOut' }}
                />
              )}
              <circle
                cx={p.x}
                cy={p.y}
                r={r}
                fill={fill}
                stroke="rgba(0,0,0,0.4)"
                strokeWidth={0.5}
              />
              {p.label && p.depth > 0.4 && (
                <text
                  x={p.x + 6}
                  y={p.y - 4}
                  fontSize={9}
                  fill="rgba(255,255,255,0.55)"
                  style={{ paintOrder: 'stroke', stroke: 'rgba(0,0,0,0.5)', strokeWidth: 2 }}
                >
                  {p.label}
                </text>
              )}
            </g>
          )
        })}
      </svg>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Wireframe — equator + a few meridians as ellipses approximating their
// projected shape under the current rotation.
// ---------------------------------------------------------------------------

function Wireframe({
  size,
  R,
  cx,
  cy,
  angle,
}: {
  size: number
  R: number
  cx: number
  cy: number
  angle: number
}) {
  // Equator: orthographic projection of a unit circle rotated by TILT_X
  // becomes an ellipse with ry = R * cos(TILT_X), centered on cy.
  const ry = R * Math.cos(TILT_X)
  // Three meridians at lng = 0, 60, 120 — their visible width depends on
  // the spin so they pulse naturally as the globe turns.
  const meridians = [0, Math.PI / 3, (2 * Math.PI) / 3]

  return (
    <g aria-hidden opacity={0.18}>
      <ellipse cx={cx} cy={cy} rx={R} ry={ry} fill="none" stroke="white" strokeWidth={0.5} />
      {meridians.map((offset, i) => {
        const localAngle = (angle + offset) % (Math.PI * 2)
        const rx = Math.abs(R * Math.sin(localAngle))
        if (rx < 1) return null
        return (
          <ellipse
            key={i}
            cx={cx}
            cy={cy}
            rx={rx}
            ry={R}
            fill="none"
            stroke="white"
            strokeWidth={0.5}
          />
        )
      })}
    </g>
  )
}
