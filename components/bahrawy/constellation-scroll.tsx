'use client'

/**
 * <ConstellationScroll />
 *
 * A pinned scroll section. Inside, an SVG "constellation" diagram constructs
 * itself in five staged passes as the user scrolls. Heavy on coordination —
 * one GSAP timeline, scrubbed against the scroll position, controls every
 * node, edge, label, and pulse-dot in lock-step.
 *
 *   Stage 1 — Center node scales in with a back-ease pop.
 *   Stage 2 — Satellite nodes fade + pop in, staggered.
 *   Stage 3 — Each edge "inks in" via stroke-dashoffset animated from its
 *             own length down to 0 (true SVG path-draw).
 *   Stage 4 — Per-node text labels fade up.
 *   Stage 5 — Pulse-dots travel along each edge, center → satellite.
 *
 * Pure GSAP + raw SVG attributes — no extra plugins beyond ScrollTrigger.
 */

import * as React from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { cn } from '@/lib/utils'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ConstellationNode {
  id: string
  label: string
  /** Optional small icon shown inside the label pill. */
  icon?: React.ReactNode
  /** Position inside the 0–100 viewBox. */
  x: number
  y: number
  /** Center nodes render bigger + stay always-visible. */
  variant?: 'center' | 'satellite'
  /** Optional accent color (hex). */
  color?: string
}

export interface ConstellationScrollProps {
  eyebrow?: React.ReactNode
  title?: React.ReactNode
  description?: React.ReactNode
  nodes: ConstellationNode[]
  /**
   * Pairs of node IDs to draw edges between. If omitted, every satellite is
   * automatically connected to the first 'center' node.
   */
  edges?: Array<[string, string]>
  /**
   * Pin length in viewport heights. Tuned so the animation completes near
   * the end of the pin — too high and you get a "transparent dead zone"
   * after the constellation is fully built. Default 2.4.
   */
  scrollLength?: number
  /** Accent color for edges and pulses. Default #A78BFA. */
  accentColor?: string
  className?: string
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function ConstellationScroll({
  eyebrow = 'How it fits together',
  title = 'One library. Every piece in its place.',
  description = 'A small core, a wide surface. Every component is a node — connected, but standalone.',
  nodes,
  edges,
  scrollLength = 2.4,
  accentColor = '#A78BFA',
  className,
}: ConstellationScrollProps) {
  const sectionRef = React.useRef<HTMLDivElement>(null)
  const pinRef = React.useRef<HTMLDivElement>(null)
  const svgRef = React.useRef<SVGSVGElement>(null)
  const titleRef = React.useRef<HTMLDivElement>(null)
  const captionRef = React.useRef<HTMLDivElement>(null)

  const nodeRefs = React.useRef<(SVGGElement | null)[]>([])
  const edgeRefs = React.useRef<(SVGLineElement | null)[]>([])
  const pulseRefs = React.useRef<(SVGCircleElement | null)[]>([])
  const labelRefs = React.useRef<(HTMLDivElement | null)[]>([])

  // Resolve edges — default: connect every satellite to the first center node.
  const resolvedEdges = React.useMemo<Array<[string, string]>>(() => {
    if (edges && edges.length > 0) return edges
    const center = nodes.find((n) => n.variant === 'center') ?? nodes[0]
    return nodes
      .filter((n) => n.id !== center.id)
      .map((n) => [center.id, n.id] as [string, string])
  }, [nodes, edges])

  // Quick lookup
  const nodeById = React.useMemo(() => {
    const map = new Map<string, ConstellationNode>()
    for (const n of nodes) map.set(n.id, n)
    return map
  }, [nodes])

  useGSAP(
    () => {
      const section = sectionRef.current
      const pin = pinRef.current
      if (!section || !pin) return

      // ── initial states ───────────────────────────────────────────
      gsap.set(nodeRefs.current, { autoAlpha: 0, transformOrigin: '50% 50%', scale: 0.3 })
      gsap.set(labelRefs.current, { autoAlpha: 0, y: 8 })
      gsap.set(pulseRefs.current, { autoAlpha: 0 })

      // Prep each edge for the path-draw effect.
      edgeRefs.current.forEach((line) => {
        if (!line) return
        const len = line.getTotalLength()
        line.style.strokeDasharray = `${len}`
        line.style.strokeDashoffset = `${len}`
      })

      if (titleRef.current) gsap.set(titleRef.current, { autoAlpha: 0, y: 20 })
      if (captionRef.current) gsap.set(captionRef.current, { autoAlpha: 0, y: 12 })

      // ── timeline ────────────────────────────────────────────────
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: () => `+=${scrollLength * window.innerHeight}`,
          pin,
          scrub: 0.3,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      })

      // 0.00 — Title fades in over the first ~10%.
      if (titleRef.current) {
        tl.to(titleRef.current, { autoAlpha: 1, y: 0, duration: 0.1, ease: 'power2.out' }, 0)
      }

      // 0.04–0.16 — Center node (back-eased pop).
      const centerIdx = nodes.findIndex((n) => n.variant === 'center')
      if (centerIdx >= 0 && nodeRefs.current[centerIdx]) {
        tl.to(
          nodeRefs.current[centerIdx],
          { autoAlpha: 1, scale: 1, duration: 0.12, ease: 'back.out(1.7)' },
          0.04,
        )
      }

      // 0.18–0.36 — Satellites pop in, staggered.
      const satelliteIdxs = nodes
        .map((n, i) => (n.variant === 'center' ? -1 : i))
        .filter((i) => i >= 0)
      satelliteIdxs.forEach((idx, k) => {
        tl.to(
          nodeRefs.current[idx],
          { autoAlpha: 1, scale: 1, duration: 0.08, ease: 'back.out(1.5)' },
          0.18 + k * 0.025,
        )
      })

      // 0.38–0.62 — Edges ink themselves in, staggered.
      resolvedEdges.forEach((_, i) => {
        const line = edgeRefs.current[i]
        if (!line) return
        tl.to(
          line,
          { strokeDashoffset: 0, duration: 0.1, ease: 'power1.inOut' },
          0.38 + i * 0.03,
        )
      })

      // 0.64–0.78 — Labels fade up.
      nodes.forEach((_, i) => {
        const label = labelRefs.current[i]
        if (!label) return
        tl.to(
          label,
          { autoAlpha: 1, y: 0, duration: 0.06, ease: 'power2.out' },
          0.64 + i * 0.02,
        )
      })

      // 0.78–0.84 — Caption fades in.
      if (captionRef.current) {
        tl.to(captionRef.current, { autoAlpha: 1, y: 0, duration: 0.06, ease: 'power2.out' }, 0.78)
      }

      // 0.82–1.00 — Pulses fan outward from center along each edge.
      resolvedEdges.forEach((edge, i) => {
        const pulse = pulseRefs.current[i]
        if (!pulse) return
        const from = nodeById.get(edge[0])
        const to = nodeById.get(edge[1])
        if (!from || !to) return

        const at = 0.82 + i * 0.018
        // Snap pulse to the center node and flash on
        tl.set(pulse, { attr: { cx: from.x, cy: from.y } }, at)
        tl.to(pulse, { autoAlpha: 1, duration: 0.02 }, at)
        // Travel
        tl.to(
          pulse,
          { attr: { cx: to.x, cy: to.y }, duration: 0.12, ease: 'power2.inOut' },
          at,
        )
        // Fade out as it arrives
        tl.to(pulse, { autoAlpha: 0, duration: 0.03 }, at + 0.1)
      })

      // Pad timeline to exactly 1 unit so anything tied to overall progress
      // (none right now, but you know — future-you) maps cleanly.
      tl.to({}, { duration: Math.max(0.0001, 1 - tl.duration()) })
    },
    { dependencies: [nodes, resolvedEdges, scrollLength], scope: sectionRef },
  )

  return (
    <div
      ref={sectionRef}
      className={cn('relative w-full bg-black', className)}
      style={{ height: `${scrollLength * 100}vh` }}
    >
      <div ref={pinRef} className="relative h-screen w-full overflow-hidden">
        {/* Background glow */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background: `radial-gradient(ellipse 55% 55% at 50% 50%, ${accentColor}1a, transparent 65%)`,
          }}
        />

        {/* Subtle starfield */}
        <Starfield />

        {/* Header copy */}
        <div className="absolute inset-x-0 top-0 z-20 mx-auto flex w-full max-w-3xl flex-col items-center gap-3 px-6 pt-24 text-center sm:px-10">
          <div ref={titleRef} className="flex flex-col items-center gap-3">
            {eyebrow && (
              <span className="rounded-full border border-white/15 bg-white/[0.04] px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-white/80">
                {eyebrow}
              </span>
            )}
            {title && (
              <h2 className="text-balance text-3xl font-semibold leading-tight tracking-tight text-white sm:text-4xl md:text-5xl">
                {title}
              </h2>
            )}
          </div>
        </div>

        {/* The SVG canvas — full bleed within the pin */}
        <svg
          ref={svgRef}
          viewBox="0 0 100 100"
          preserveAspectRatio="xMidYMid meet"
          className="absolute inset-0 z-10 h-full w-full"
          aria-hidden
        >
          {/* Edges */}
          {resolvedEdges.map((edge, i) => {
            const from = nodeById.get(edge[0])
            const to = nodeById.get(edge[1])
            if (!from || !to) return null
            return (
              <line
                key={`edge-${i}`}
                ref={(el) => {
                  edgeRefs.current[i] = el
                }}
                x1={from.x}
                y1={from.y}
                x2={to.x}
                y2={to.y}
                stroke={accentColor}
                strokeWidth={0.18}
                strokeLinecap="round"
                opacity={0.55}
              />
            )
          })}

          {/* Pulses (one per edge) */}
          {resolvedEdges.map((edge, i) => {
            const from = nodeById.get(edge[0])
            if (!from) return null
            return (
              <circle
                key={`pulse-${i}`}
                ref={(el) => {
                  pulseRefs.current[i] = el
                }}
                cx={from.x}
                cy={from.y}
                r={0.55}
                fill={accentColor}
                style={{
                  filter: `drop-shadow(0 0 1px ${accentColor})`,
                }}
              />
            )
          })}

          {/* Nodes — smaller, denser than the labels next to them */}
          {nodes.map((node, i) => {
            const isCenter = node.variant === 'center'
            const r = isCenter ? 1.3 : 0.8
            const ringR = isCenter ? 2.4 : 1.6
            const color = node.color ?? '#FFFFFF'
            return (
              <g
                key={node.id}
                ref={(el) => {
                  nodeRefs.current[i] = el
                }}
                transform={`translate(${node.x} ${node.y})`}
              >
                {/* Glow ring */}
                <circle
                  cx={0}
                  cy={0}
                  r={ringR}
                  fill="none"
                  stroke={color}
                  strokeWidth={0.12}
                  opacity={0.35}
                />
                {/* Solid dot */}
                <circle cx={0} cy={0} r={r} fill={color} />
                {/* Tiny inner punch */}
                <circle cx={0} cy={0} r={r * 0.35} fill="rgba(0,0,0,0.5)" />
              </g>
            )
          })}
        </svg>

        {/* HTML labels — overlay so we get real text rendering + Tailwind */}
        <div className="pointer-events-none absolute inset-0 z-20">
          {nodes.map((node, i) => {
            const isCenter = node.variant === 'center'
            // Push the label radially outward from center (50, 50). For the
            // center node itself, sit it directly below the dot.
            const dx = node.x - 50
            const dy = node.y - 50
            const len = Math.max(0.01, Math.hypot(dx, dy))
            const nx = dx / len
            const ny = dy / len
            const offsetPct = isCenter ? 0 : 6 // % of viewBox outward
            const lx = isCenter ? 50 : node.x + nx * offsetPct
            const ly = isCenter ? 50 + 6 : node.y + ny * offsetPct
            return (
              <div
                key={node.id}
                ref={(el) => {
                  labelRefs.current[i] = el
                }}
                className="absolute -translate-x-1/2 -translate-y-1/2 whitespace-nowrap text-center"
                style={{ left: `${lx}%`, top: `${ly}%` }}
              >
                <span
                  className={cn(
                    'inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-black/70 px-2.5 py-1 backdrop-blur',
                    isCenter ? 'text-sm font-semibold text-white' : 'text-xs text-white/90',
                  )}
                >
                  {node.icon && (
                    <span
                      aria-hidden
                      className="inline-flex shrink-0 [&>svg]:h-3 [&>svg]:w-3"
                      style={{ color: node.color ?? '#FFFFFF' }}
                    >
                      {node.icon}
                    </span>
                  )}
                  {node.label}
                </span>
              </div>
            )
          })}
        </div>

        {/* Footer caption */}
        <div
          ref={captionRef}
          className="absolute inset-x-0 bottom-0 z-20 mx-auto flex w-full max-w-3xl flex-col items-center gap-3 px-6 pb-16 text-center sm:px-10"
        >
          {description && (
            <p className="text-pretty text-sm leading-relaxed text-white/65 sm:text-base">
              {description}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Subtle starfield — random tiny dots scattered behind the diagram. Uses a
// stable seeded layout so server + client agree (no hydration mismatch).
// ---------------------------------------------------------------------------

function Starfield() {
  // Pre-baked positions so SSR matches CSR without effort.
  const stars = STAR_POSITIONS
  return (
    <svg
      aria-hidden
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMid slice"
      className="pointer-events-none absolute inset-0 h-full w-full"
    >
      {stars.map((s, i) => (
        <circle
          key={i}
          cx={s.x}
          cy={s.y}
          r={s.r}
          fill="white"
          opacity={s.o}
        />
      ))}
    </svg>
  )
}

const STAR_POSITIONS: Array<{ x: number; y: number; r: number; o: number }> = [
  { x: 6, y: 11, r: 0.12, o: 0.6 },
  { x: 14, y: 76, r: 0.1, o: 0.5 },
  { x: 22, y: 32, r: 0.14, o: 0.45 },
  { x: 28, y: 88, r: 0.08, o: 0.55 },
  { x: 38, y: 17, r: 0.12, o: 0.4 },
  { x: 44, y: 68, r: 0.1, o: 0.5 },
  { x: 52, y: 8, r: 0.14, o: 0.55 },
  { x: 60, y: 92, r: 0.08, o: 0.45 },
  { x: 68, y: 26, r: 0.12, o: 0.5 },
  { x: 76, y: 74, r: 0.1, o: 0.6 },
  { x: 84, y: 14, r: 0.14, o: 0.4 },
  { x: 90, y: 56, r: 0.12, o: 0.5 },
  { x: 95, y: 88, r: 0.1, o: 0.45 },
  { x: 11, y: 48, r: 0.1, o: 0.45 },
  { x: 32, y: 54, r: 0.12, o: 0.4 },
  { x: 56, y: 60, r: 0.1, o: 0.4 },
  { x: 72, y: 44, r: 0.12, o: 0.5 },
  { x: 88, y: 32, r: 0.1, o: 0.55 },
  { x: 18, y: 24, r: 0.08, o: 0.5 },
  { x: 80, y: 84, r: 0.1, o: 0.4 },
]
