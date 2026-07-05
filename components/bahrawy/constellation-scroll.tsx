'use client'

/**
 * <ConstellationScroll />
 *
 * A pinned scroll section that opens with every node stacked at the
 * exact same point in the centre of the canvas. As the user scrolls,
 * the nodes fan outward into a perfect circular constellation — each
 * node rides its own radial vector with a `power3.out` ease so the
 * spread starts fast and lands soft. Connecting lines between adjacent
 * nodes draw in once the ring has settled, completing the shape.
 *
 * The whole motion is driven by ONE tweened progress value (0 → 1)
 * fed by a scrubbed GSAP timeline. Per frame we compute each node's
 * `(x, y) = R × progress × (cos θᵢ, sin θᵢ)` where θᵢ is its evenly-
 * spaced slot on the ring. No DOM thrash — just transform writes on
 * a fixed set of refs.
 */

import * as React from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowUpRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { usePrefersReducedMotion } from '@/lib/use-prefers-reduced-motion'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ConstellationNode {
  /** Stable id (used for React keys). */
  id: string
  /** Optional icon rendered inside the circle. */
  icon?: React.ReactNode
  /** Optional label shown below the node once it's in position. */
  label?: React.ReactNode
  /** Per-node accent color for the ring + icon glow. */
  accent?: string
}

export interface ConstellationScrollCta {
  label: string
  href?: string
  onClick?: () => void
}

export interface ConstellationScrollProps {
  /** Nodes — stacked at the centre at the start, fan out into a ring. */
  nodes: ConstellationNode[]
  /** Tiny tag above the heading. */
  eyebrow?: React.ReactNode
  /** Heading shown above the constellation. */
  heading?: React.ReactNode
  /** Sub-copy that fades in alongside the heading. */
  description?: React.ReactNode
  /** Optional CTA that appears once the constellation has settled. */
  cta?: ConstellationScrollCta
  /** Optional final headline that lands at the very end of the scroll. */
  finale?: React.ReactNode
  /** Pin duration in viewport heights. Default 2.4. */
  scrollLength?: number
  /**
   * Final radius of the ring as a fraction of the available space.
   *  - 0.5 fills tight, 0.7 fills wide. Default 0.62.
   */
  radius?: number
  /** Diameter of each node in px. Default 64. */
  nodeSize?: number
  /** Draw connecting lines between adjacent nodes after settling. Default true. */
  drawLinks?: boolean
  /** Default accent used for nodes that don't set their own. */
  accentColor?: string
  className?: string
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Given an evenly-spaced node index `i` and total `n`, return the angle
 * (radians) that lands at the TOP of the ring for the first node and
 * walks clockwise. -π/2 puts node 0 straight up; +2π/n steps each
 * subsequent slot.
 */
function ringAngle(i: number, n: number): number {
  return -Math.PI / 2 + (i / n) * Math.PI * 2
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function ConstellationScroll({
  nodes,
  eyebrow,
  heading,
  description,
  cta,
  finale,
  scrollLength = 2.4,
  radius = 0.62,
  nodeSize = 64,
  drawLinks = true,
  accentColor = '#A78BFA',
  className,
}: ConstellationScrollProps) {
  const sectionRef = React.useRef<HTMLDivElement>(null)
  const pinRef = React.useRef<HTMLDivElement>(null)
  const stageRef = React.useRef<HTMLDivElement>(null)
  const boxRef = React.useRef<HTMLDivElement>(null)
  const nodeRefs = React.useRef<(HTMLDivElement | null)[]>([])
  const labelRefs = React.useRef<(HTMLDivElement | null)[]>([])
  const linkRefs = React.useRef<(SVGLineElement | null)[]>([])
  const headerRef = React.useRef<HTMLDivElement>(null)
  const descRef = React.useRef<HTMLDivElement>(null)
  const ctaRef = React.useRef<HTMLDivElement>(null)
  const finaleRef = React.useRef<HTMLDivElement>(null)

  const progress = React.useRef({ value: 0 })
  const dims = React.useRef({ w: 0, h: 0, r: 0 })
  const reduced = usePrefersReducedMotion()

  useGSAP(
    () => {
      if (!sectionRef.current || !pinRef.current || !stageRef.current) return

      const N = nodes.length

      // ----------------------------------------------------------------
      // Resize handler — recompute the ring radius from the stage box.
      // ----------------------------------------------------------------
      const measure = () => {
        if (!stageRef.current) return
        const rect = stageRef.current.getBoundingClientRect()
        dims.current.w = rect.width
        dims.current.h = rect.height
        // Use the smaller dimension so the ring fits regardless of
        // landscape vs portrait viewports, less half a node so the
        // outermost edge of the node hugs the bounding box.
        const limit = Math.min(rect.width, rect.height) / 2 - nodeSize / 2 - 24
        dims.current.r = Math.max(0, limit * (radius / 0.62))
        dims.current.r = Math.min(dims.current.r, limit)
        // Keep the SVG link endpoints glued to the actual node radius:
        // convert the px radius into viewBox units (100 units per side
        // of the square stage box) and rewrite the line endpoints.
        const box = boxRef.current?.getBoundingClientRect()
        if (box && box.width > 0) {
          const unitR = (dims.current.r / box.width) * 100
          linkRefs.current.forEach((el, i) => {
            if (!el) return
            const a1 = ringAngle(i, N)
            const a2 = ringAngle((i + 1) % N, N)
            el.setAttribute('x1', String(unitR * Math.cos(a1)))
            el.setAttribute('y1', String(unitR * Math.sin(a1)))
            el.setAttribute('x2', String(unitR * Math.cos(a2)))
            el.setAttribute('y2', String(unitR * Math.sin(a2)))
          })
        }
      }
      measure()
      window.addEventListener('resize', measure)

      // ----------------------------------------------------------------
      // Initial states — every node sits at the centre, slightly scaled
      // down so the stack reads as a single dot, and labels are hidden.
      // ----------------------------------------------------------------
      // With reduced motion the nodes start (and stay) at their final
      // ring positions — no fan-out translate. Reveals become pure
      // opacity fades (offsets zeroed), still scrubbed by scroll.
      progress.current.value = reduced ? 1 : 0
      nodeRefs.current.forEach((el) => {
        if (!el) return
        gsap.set(el, {
          x: 0,
          y: 0,
          scale: 0.78,
          autoAlpha: 1,
        })
      })
      labelRefs.current.forEach((el) => {
        if (el) gsap.set(el, { autoAlpha: 0, y: reduced ? 0 : 6 })
      })
      linkRefs.current.forEach((el) => {
        if (!el) return
        const len = el.getTotalLength?.() || 200
        el.style.strokeDasharray = String(len)
        // No line-drawing motion when reduced — links just fade in.
        el.style.strokeDashoffset = reduced ? '0' : String(len)
        el.style.opacity = '0'
      })
      if (headerRef.current)
        gsap.set(headerRef.current, { autoAlpha: 0, y: reduced ? 0 : 12 })
      if (descRef.current)
        gsap.set(descRef.current, { autoAlpha: 0, y: reduced ? 0 : 10 })
      if (ctaRef.current)
        gsap.set(ctaRef.current, { autoAlpha: 0, y: reduced ? 0 : 10 })
      if (finaleRef.current)
        gsap.set(finaleRef.current, { autoAlpha: 0, y: reduced ? 0 : 16 })

      // ----------------------------------------------------------------
      // Apply per-node positions for the current progress value.
      // ----------------------------------------------------------------
      const applyPositions = () => {
        const p = progress.current.value
        const r = dims.current.r
        for (let i = 0; i < N; i++) {
          const el = nodeRefs.current[i]
          if (!el) continue
          const a = ringAngle(i, N)
          const x = r * p * Math.cos(a)
          const y = r * p * Math.sin(a)
          el.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${0.78 + p * 0.22})`
        }
      }
      applyPositions()

      // ----------------------------------------------------------------
      // Scrubbed timeline. Higher scrub value = the timeline LERPs more
      // toward the scroll position over time, eliminating the jumpy
      // frame-by-frame feel and giving Apple-style smoothness.
      // ----------------------------------------------------------------
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: () => `+=${scrollLength * window.innerHeight}`,
          pin: pinRef.current,
          scrub: 1.1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      })

      // Header — lands very early so the user has something to read.
      if (headerRef.current) {
        tl.to(
          headerRef.current,
          { autoAlpha: 1, y: 0, duration: 0.08, ease: 'power2.out' },
          0,
        )
      }
      if (descRef.current) {
        tl.to(
          descRef.current,
          { autoAlpha: 1, y: 0, duration: 0.08, ease: 'power2.out' },
          0.04,
        )
      }

      // Constellation fan-out — one tween on a shared `progress.value`,
      // eased so the spread starts fast and lands soft. Skipped when
      // reduced motion is preferred (nodes already sit on the ring).
      if (!reduced) {
        tl.to(
          progress.current,
          {
            value: 1,
            duration: 0.55,
            ease: 'power3.out',
            onUpdate: applyPositions,
          },
          0.05,
        )
      }

      // Labels — fade in once the nodes are MOSTLY settled.
      const labelEls = labelRefs.current.filter(
        (el): el is HTMLDivElement => Boolean(el),
      )
      if (labelEls.length) {
        tl.to(
          labelEls,
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.12,
            stagger: 0.018,
            ease: 'power2.out',
          },
          0.55,
        )
      }

      // Connecting links — draw in starting from the top, walking
      // clockwise around the ring.
      if (drawLinks) {
        linkRefs.current.forEach((el, i) => {
          if (!el) return
          tl.to(
            el,
            {
              strokeDashoffset: 0,
              opacity: 0.5,
              duration: 0.12,
              ease: 'power2.out',
            },
            0.6 + i * 0.005,
          )
        })
      }

      // CTA fades in once everything's drawn.
      if (ctaRef.current) {
        tl.to(
          ctaRef.current,
          { autoAlpha: 1, y: 0, duration: 0.18, ease: 'power2.out' },
          0.78,
        )
      }

      // FINAL settle — at the very end of scroll, ensure progress is
      // pinned to 1 (no overshoot residue), bump link opacity slightly,
      // and bring in the optional finale headline. This gives the
      // animation a clear "done" state instead of trailing off.
      if (!reduced) {
        tl.to(
          progress.current,
          {
            value: 1,
            duration: 0.05,
            ease: 'none',
            onUpdate: applyPositions,
          },
          0.92,
        )
      }
      if (drawLinks && linkRefs.current.length) {
        tl.to(
          linkRefs.current.filter(Boolean),
          { opacity: 0.7, duration: 0.18, ease: 'power2.out' },
          0.92,
        )
      }
      if (finaleRef.current) {
        tl.to(
          finaleRef.current,
          { autoAlpha: 1, y: 0, duration: 0.25, ease: 'power2.out' },
          0.9,
        )
      }

      // On resize we re-measure and re-apply positions so the ring
      // keeps fitting the viewport.
      const onResize = () => {
        measure()
        applyPositions()
        ScrollTrigger.refresh()
      }
      window.addEventListener('resize', onResize)

      return () => {
        window.removeEventListener('resize', measure)
        window.removeEventListener('resize', onResize)
      }
    },
    {
      scope: sectionRef,
      dependencies: [
        nodes,
        scrollLength,
        radius,
        nodeSize,
        drawLinks,
        accentColor,
        reduced,
      ],
    },
  )

  const N = nodes.length

  return (
    <div
      ref={sectionRef}
      className={cn('relative w-full bg-picks-surface', className)}
      style={{ height: `${(scrollLength + 1) * 100}vh` }}
    >
      <div ref={pinRef} className="relative h-screen w-full overflow-hidden">
        {/* Background mood — restrained: a single soft radial wash, no
            colored neon halo. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(60% 50% at 50% 50%, rgba(255,255,255,0.04) 0%, transparent 70%), radial-gradient(120% 80% at 50% 100%, rgba(0,0,0,0.5) 0%, transparent 60%)',
          }}
        />

        {/* Header — sits at the TOP */}
        <div className="pointer-events-none absolute inset-x-0 top-0 z-10 flex flex-col items-center px-6 pt-16 text-center sm:pt-20">
          {(eyebrow || heading) && (
            <div ref={headerRef} className="max-w-2xl">
              {eyebrow && (
                <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-picks-fg/[0.08] bg-picks-fg/[0.04] px-3 py-1 text-[11px] font-medium uppercase tracking-[0.22em] text-picks-fg/80 backdrop-blur">
                  <span
                    aria-hidden
                    className="block h-1.5 w-1.5 rounded-full"
                    style={{ background: accentColor }}
                  />
                  {eyebrow}
                </div>
              )}
              {heading && (
                <h2 className="font-display text-balance text-2xl font-semibold leading-tight tracking-tight text-picks-fg sm:text-3xl">
                  {heading}
                </h2>
              )}
            </div>
          )}
          {description && (
            <div ref={descRef} className="mt-3 max-w-xl">
              <p className="text-pretty text-sm leading-relaxed text-picks-fg/65 sm:text-base">
                {description}
              </p>
            </div>
          )}
        </div>

        {/* Stage — centred area that hosts the constellation */}
        <div
          ref={stageRef}
          className="absolute inset-0 flex items-center justify-center"
        >
          <div
            ref={boxRef}
            className="relative"
            style={{ width: '70vmin', height: '70vmin' }}
          >
            {/* Connecting SVG lines */}
            {drawLinks && (
              <svg
                aria-hidden
                className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
                viewBox="-50 -50 100 100"
                preserveAspectRatio="none"
              >
                {nodes.map((node, i) => {
                  const a1 = ringAngle(i, N)
                  const a2 = ringAngle((i + 1) % N, N)
                  // Pre-measure estimate of the ring radius in viewBox
                  // units, scaled by the radius prop (38 ↔ the default
                  // 0.62). `measure()` rewrites the endpoints from the
                  // real px radius as soon as the stage is measured.
                  const R = 38 * (radius / 0.62)
                  const x1 = R * Math.cos(a1)
                  const y1 = R * Math.sin(a1)
                  const x2 = R * Math.cos(a2)
                  const y2 = R * Math.sin(a2)
                  return (
                    <line
                      key={node.id}
                      ref={(el) => {
                        linkRefs.current[i] = el
                      }}
                      x1={x1}
                      y1={y1}
                      x2={x2}
                      y2={y2}
                      // Plain white at low opacity — no per-node colored
                      // glow. Apple-style restraint.
                      stroke="rgb(var(--picks-fg-rgb) / 0.55)"
                      strokeWidth="0.3"
                      vectorEffect="non-scaling-stroke"
                      strokeLinecap="round"
                    />
                  )
                })}
              </svg>
            )}

            {/* Nodes — every one is absolutely centred at (0, 0) and
                gets translated outward via GSAP. */}
            {nodes.map((node, i) => {
              const accent = node.accent ?? accentColor
              return (
                <div
                  key={node.id}
                  className="absolute left-1/2 top-1/2"
                  style={{
                    width: nodeSize,
                    height: nodeSize,
                    marginLeft: -nodeSize / 2,
                    marginTop: -nodeSize / 2,
                  }}
                >
                  <div
                    ref={(el) => {
                      nodeRefs.current[i] = el
                    }}
                    className="relative h-full w-full"
                    style={{ willChange: 'transform' }}
                  >
                    {/* Apple-style node: vibrancy backdrop-blur card,
                        hairline white border at ~8% opacity, deep but
                        non-colored drop shadow. The accent only shows
                        up in the tiny dot inside, never as a glow. */}
                    <div className="relative flex h-full w-full items-center justify-center rounded-full border border-picks-fg/[0.08] bg-picks-fg/[0.04] text-picks-fg shadow-[0_10px_30px_-12px_rgba(0,0,0,0.6)] backdrop-blur-xl">
                      <span className="relative">
                        {node.icon ?? (
                          <span
                            className="block h-2 w-2 rounded-full"
                            style={{ background: accent }}
                          />
                        )}
                      </span>
                    </div>
                    {node.label && (
                      <div
                        ref={(el) => {
                          labelRefs.current[i] = el
                        }}
                        className="absolute left-1/2 top-full mt-2 -translate-x-1/2 whitespace-nowrap text-[11px] font-medium uppercase tracking-[0.18em] text-picks-fg/70"
                        style={{ willChange: 'transform, opacity' }}
                      >
                        {node.label}
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* CTA at the bottom */}
        {cta && (
          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex flex-col items-center gap-4 pb-14">
            {finale && (
              <div ref={finaleRef} className="max-w-xl px-6 text-center">
                <p className="font-display text-balance text-base font-semibold leading-snug text-picks-fg sm:text-lg">
                  {finale}
                </p>
              </div>
            )}
            <div ref={ctaRef} className="pointer-events-auto">
              <a
                href={cta.href ?? '#'}
                onClick={cta.onClick}
                className="group inline-flex items-center gap-2 rounded-full bg-picks-fg px-5 py-2.5 text-sm font-semibold text-picks-surface transition-colors hover:bg-picks-fg/90"
              >
                {cta.label}
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </a>
            </div>
          </div>
        )}

        {/* If there's a finale headline but no CTA, render the headline
            on its own at the bottom. */}
        {finale && !cta && (
          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex justify-center pb-16">
            <div ref={finaleRef} className="max-w-xl px-6 text-center">
              <p className="font-display text-balance text-base font-semibold leading-snug text-picks-fg sm:text-lg">
                {finale}
              </p>
            </div>
          </div>
        )}

        {/* Scroll hint */}
        <div
          aria-hidden
          className="pointer-events-none absolute bottom-6 left-1/2 z-10 -translate-x-1/2 text-[10px] font-medium uppercase tracking-[0.32em] text-picks-fg/45"
        >
          Scroll to form
        </div>
      </div>
    </div>
  )
}
