'use client'

/**
 * <PaperTear />
 *
 * Two sheets of "paper" stacked on top of each other. As you scroll
 * into the section, the top sheet tears off along an irregular
 * jagged edge and lifts away — revealing the bottom sheet underneath.
 *
 * How the torn edge works:
 *  - A deterministic seeded RNG generates a sequence of (x, y) points
 *    along the horizontal centre of the sheet. The "y" wobbles to give
 *    the edge its raggedness; the "x" advances in slightly random steps
 *    so the spacing isn't uniform.
 *  - Those points feed two SVG path strings: one that defines the
 *    bottom edge of the TOP sheet (everything ABOVE the line), and
 *    one that defines the top edge of the BOTTOM sheet (everything
 *    BELOW the line). Both are computed at module-build time as
 *    React state so re-renders are stable.
 *  - The sheets use the SVG path as a `clip-path: path(...)` — modern
 *    browsers support this directly. As scroll progresses, the top
 *    sheet is translated up + rotated slightly + faded; the bottom
 *    sheet is revealed at full opacity.
 *
 * A subtle paper-grain texture (SVG turbulence) lives on both halves
 * so the tear feels physical, not digital.
 */

import * as React from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowUpRight } from 'lucide-react'
import { cn } from '@/lib/utils'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface PaperTearScene {
  /** Tiny tag rendered above the title. */
  eyebrow?: React.ReactNode
  /** Main headline for this half of the tear. */
  title: React.ReactNode
  /** Sub-copy under the title. */
  subtitle?: React.ReactNode
  /** Background tint for this half (CSS color). */
  background?: string
  /** Optional accent color used in eyebrow dot etc. */
  accent?: string
}

export interface PaperTearCta {
  label: string
  href?: string
  onClick?: () => void
}

export interface PaperTearProps {
  /** Top sheet — visible at rest, tears off as you scroll in. */
  top: PaperTearScene
  /** Bottom sheet — revealed underneath. */
  bottom: PaperTearScene
  /** Optional CTA shown on the bottom sheet once the tear completes. */
  cta?: PaperTearCta
  /** Pin duration in viewport heights. Default 2.4. */
  scrollLength?: number
  /** Number of jagged points along the tear line. Default 36. */
  detail?: number
  /** Vertical wobble amplitude of the tear, in % of height. Default 4. */
  jitter?: number
  /** Random seed — change to get a different tear shape. Default 1. */
  seed?: number
  className?: string
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Tiny deterministic PRNG (mulberry32). */
function rng(seed: number) {
  let s = seed >>> 0
  return () => {
    s = (s + 0x6D2B79F5) >>> 0
    let t = s
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/**
 * Build two `path(...)` strings that share the same jagged centreline.
 *
 *   top    → polygon covering 0..tear% of the height
 *   bottom → polygon covering tear%..100% of the height
 *
 * We work in a 0..1000 × 0..1000 coordinate system so the path scales
 * cleanly with `preserveAspectRatio="none"` semantics (we'll embed it
 * via clip-path on a sized box).
 */
function buildTearPaths(detail: number, jitter: number, seed: number) {
  const rand = rng(seed)
  const W = 1000
  const H = 1000
  const midY = 500
  // Distribute X points with slightly uneven spacing.
  const xs: number[] = [0]
  for (let i = 1; i < detail; i++) {
    const baseX = (i / detail) * W
    const wobble = (rand() - 0.5) * (W / detail) * 0.6
    xs.push(Math.max(0, Math.min(W, baseX + wobble)))
  }
  xs.push(W)
  // Y values with a low-frequency drift + high-frequency teeth.
  const ys: number[] = []
  let drift = 0
  for (let i = 0; i < xs.length; i++) {
    drift += (rand() - 0.5) * 12
    drift = Math.max(-jitter * H * 0.6, Math.min(jitter * H * 0.6, drift))
    const tooth = (rand() - 0.5) * jitter * H
    ys.push(midY + drift + tooth)
  }
  // Top sheet: rectangle 0..1000 across, top side flat, bottom side jagged.
  const topPath = [
    `M 0 0`,
    `L ${W} 0`,
    `L ${xs[xs.length - 1].toFixed(1)} ${ys[ys.length - 1].toFixed(1)}`,
    ...xs
      .slice(0, -1)
      .reverse()
      .map((x, i) => `L ${x.toFixed(1)} ${ys[xs.length - 2 - i].toFixed(1)}`),
    `Z`,
  ].join(' ')
  // Bottom sheet: jagged top, flat bottom.
  const bottomPath = [
    `M ${xs[0].toFixed(1)} ${ys[0].toFixed(1)}`,
    ...xs
      .slice(1)
      .map((x, i) => `L ${x.toFixed(1)} ${ys[i + 1].toFixed(1)}`),
    `L ${W} ${H}`,
    `L 0 ${H}`,
    `Z`,
  ].join(' ')
  return { topPath, bottomPath }
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function PaperTear({
  top,
  bottom,
  cta,
  scrollLength = 2.4,
  detail = 36,
  jitter = 0.04,
  seed = 1,
  className,
}: PaperTearProps) {
  const sectionRef = React.useRef<HTMLDivElement>(null)
  const pinRef = React.useRef<HTMLDivElement>(null)
  const topRef = React.useRef<HTMLDivElement>(null)
  const bottomRef = React.useRef<HTMLDivElement>(null)
  const ctaRef = React.useRef<HTMLDivElement>(null)
  const bottomContentRef = React.useRef<HTMLDivElement>(null)

  const paths = React.useMemo(
    () => buildTearPaths(Math.max(8, Math.floor(detail)), jitter, seed),
    [detail, jitter, seed],
  )

  useGSAP(
    () => {
      if (!sectionRef.current || !pinRef.current) return

      // Bottom content starts dimmed — comes alive after the tear.
      if (bottomContentRef.current)
        gsap.set(bottomContentRef.current, { autoAlpha: 0.5, y: 18 })
      if (ctaRef.current) gsap.set(ctaRef.current, { autoAlpha: 0, y: 14 })

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: () => `+=${scrollLength * window.innerHeight}`,
          pin: pinRef.current,
          scrub: 0.35,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      })

      // The top sheet lifts up + tilts + fades.
      if (topRef.current) {
        tl.to(
          topRef.current,
          {
            y: '-110%',
            rotation: -3.5,
            duration: 1,
            ease: 'power3.in',
          },
          0,
        )
        tl.to(
          topRef.current,
          { autoAlpha: 0.85, duration: 1, ease: 'none' },
          0,
        )
      }
      // Bottom content reveals as the top clears.
      if (bottomContentRef.current) {
        tl.to(
          bottomContentRef.current,
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.5,
            ease: 'power3.out',
          },
          0.45,
        )
      }
      // CTA arrives last.
      if (ctaRef.current) {
        tl.to(
          ctaRef.current,
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.35,
            ease: 'power3.out',
          },
          0.78,
        )
      }
    },
    {
      scope: sectionRef,
      dependencies: [top, bottom, cta, scrollLength, paths],
    },
  )

  const topAccent = top.accent ?? '#F472B6'
  const bottomAccent = bottom.accent ?? '#A78BFA'

  return (
    <div
      ref={sectionRef}
      className={cn('relative w-full bg-black', className)}
      style={{ height: `${(scrollLength + 1) * 100}vh` }}
    >
      <div
        ref={pinRef}
        className="relative h-screen w-full overflow-hidden bg-black"
      >
        {/* BOTTOM sheet — flat below, jagged on top (revealed) */}
        <div
          ref={bottomRef}
          className="absolute inset-0"
          style={{
            clipPath: `path('${paths.bottomPath}')`,
            WebkitClipPath: `path('${paths.bottomPath}')`,
            background:
              bottom.background ??
              'linear-gradient(180deg, #0b0f1e 0%, #050810 100%)',
          }}
        >
          {/* paper grain */}
          <PaperGrain opacity={0.07} />

          {/* bottom content */}
          <div
            ref={bottomContentRef}
            className="absolute inset-0 flex flex-col items-center justify-end px-6 pb-24 text-center sm:px-10 sm:pb-28"
          >
            <div className="max-w-2xl">
              {bottom.eyebrow && (
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/50 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.24em] text-white/85 backdrop-blur">
                  <span
                    aria-hidden
                    className="block h-1.5 w-1.5 rounded-full"
                    style={{
                      background: bottomAccent,
                      boxShadow: `0 0 8px ${bottomAccent}`,
                    }}
                  />
                  {bottom.eyebrow}
                </div>
              )}
              <h2
                className="text-balance text-4xl font-semibold leading-tight tracking-tight text-white sm:text-6xl"
                style={{
                  letterSpacing: '-0.03em',
                  textShadow: `0 0 30px ${bottomAccent}55`,
                }}
              >
                {bottom.title}
              </h2>
              {bottom.subtitle && (
                <p className="mt-4 max-w-xl text-pretty text-sm leading-relaxed text-white/70 sm:text-base">
                  {bottom.subtitle}
                </p>
              )}
              {cta && (
                <div ref={ctaRef} className="mt-7">
                  <a
                    href={cta.href ?? '#'}
                    onClick={cta.onClick}
                    className="group inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-black transition-colors hover:bg-white/90"
                    style={{
                      boxShadow: `0 0 24px ${bottomAccent}40, 0 0 56px ${bottomAccent}1f`,
                    }}
                  >
                    {cta.label}
                    <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* TOP sheet — flat across the top, jagged on the bottom.
            Lifts off as scroll progresses. */}
        <div
          ref={topRef}
          className="absolute inset-0"
          style={{
            clipPath: `path('${paths.topPath}')`,
            WebkitClipPath: `path('${paths.topPath}')`,
            background:
              top.background ??
              'linear-gradient(180deg, #fafaf7 0%, #ede9dd 100%)',
            transformOrigin: '50% 100%',
            willChange: 'transform, opacity',
          }}
        >
          <PaperGrain opacity={0.18} dark />
          {/* Subtle inner shadow at the tear edge — sells the depth. */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                'linear-gradient(180deg, transparent 60%, rgba(0,0,0,0.15) 100%)',
            }}
          />

          {/* top content */}
          <div className="absolute inset-0 flex flex-col items-center justify-start px-6 pt-24 text-center sm:px-10 sm:pt-28">
            <div className="max-w-2xl">
              {top.eyebrow && (
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-black/15 bg-white/70 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.24em] text-black/70 backdrop-blur">
                  <span
                    aria-hidden
                    className="block h-1.5 w-1.5 rounded-full"
                    style={{
                      background: topAccent,
                      boxShadow: `0 0 8px ${topAccent}`,
                    }}
                  />
                  {top.eyebrow}
                </div>
              )}
              <h2
                className="text-balance text-4xl font-semibold leading-tight tracking-tight text-black/90 sm:text-6xl"
                style={{ letterSpacing: '-0.03em' }}
              >
                {top.title}
              </h2>
              {top.subtitle && (
                <p className="mt-4 max-w-xl text-pretty text-sm leading-relaxed text-black/55 sm:text-base">
                  {top.subtitle}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Hint */}
        <div
          aria-hidden
          className="pointer-events-none absolute bottom-6 left-1/2 z-10 -translate-x-1/2 text-[10px] font-medium uppercase tracking-[0.32em] text-white/45"
        >
          Scroll to tear
        </div>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Paper grain texture — small SVG turbulence layer.
// ---------------------------------------------------------------------------

function PaperGrain({
  opacity = 0.12,
  dark = false,
}: {
  opacity?: number
  dark?: boolean
}) {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0"
      style={{
        opacity,
        mixBlendMode: dark ? 'multiply' : 'overlay',
        backgroundImage:
          "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='0.55'/></svg>\")",
      }}
    />
  )
}
