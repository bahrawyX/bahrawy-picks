'use client'

/**
 * <ReceiptUnroll />
 *
 * A pinned scroll section that unrolls a paper receipt from a small
 * printer slot at the top of the viewport. The receipt is a tall
 * narrow strip with scalloped (zig-zag) top + bottom edges, a header
 * brand block, monospaced line items that type in one at a time as
 * scroll progresses, a subtotal/total row, and a barcode at the very
 * bottom.
 *
 * Heavy bits:
 *  - The strip is wrapped in a fixed-height "slot" with overflow
 *    hidden so the receipt appears to pull out from the printer.
 *  - The strip's `y` is tweened from `-(stripHeight)` (entirely hidden
 *    above) to `0` (fully revealed) over the pin.
 *  - Each line item has its own scroll-progress slot inside the
 *    timeline — typewriter-style fade-in + tiny x-offset so the
 *    items appear sequentially as the receipt unrolls.
 *  - Subtotal, total, and the barcode are the LAST things to come
 *    into view, with a brief "calculating…" beat where the total
 *    counts up.
 *
 * Pure decorative SVG for the scalloped edges + barcode bars; no
 * external libs beyond GSAP.
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

export interface ReceiptLine {
  id: string
  /** Left column — the item name. */
  label: React.ReactNode
  /** Right column — the price / value. */
  value: React.ReactNode
  /** Tiny note rendered under the label. */
  note?: React.ReactNode
}

export interface ReceiptUnrollCta {
  label: string
  href?: string
  onClick?: () => void
}

export interface ReceiptUnrollProps {
  /** Brand header — store name etc. */
  store?: React.ReactNode
  /** Subheader line — address / date / receipt number. */
  meta?: React.ReactNode
  /** Items printed on the receipt. */
  lines: ReceiptLine[]
  /** Pre-tax subtotal line — string or number. */
  subtotal?: React.ReactNode
  /** Tax line value. */
  tax?: React.ReactNode
  /** Final total. */
  total: React.ReactNode
  /** Tiny "thanks for stopping by" footer line. */
  footer?: React.ReactNode
  /** Eyebrow above the section. */
  eyebrow?: React.ReactNode
  /** Optional CTA after the receipt. */
  cta?: ReceiptUnrollCta
  /** Pin length in viewport heights. Default 4. */
  scrollLength?: number
  /** Paper color. Default a slightly off-white. */
  paperColor?: string
  /** Ink color. Default near-black. */
  inkColor?: string
  /** Accent used for printer slot + glow. */
  accentColor?: string
  className?: string
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function ReceiptUnroll({
  store = 'BAHRAWY · MERCANTILE',
  meta,
  lines,
  subtotal,
  tax,
  total,
  footer = 'thank you · come again',
  eyebrow,
  cta,
  scrollLength = 4,
  paperColor = '#f6f1e3',
  inkColor = '#1a1a1a',
  accentColor = '#22D3EE',
  className,
}: ReceiptUnrollProps) {
  const sectionRef = React.useRef<HTMLDivElement>(null)
  const pinRef = React.useRef<HTMLDivElement>(null)
  const stripRef = React.useRef<HTMLDivElement>(null)
  const headerRef = React.useRef<HTMLDivElement>(null)
  const lineRefs = React.useRef<(HTMLDivElement | null)[]>([])
  const subtotalRef = React.useRef<HTMLDivElement>(null)
  const totalRef = React.useRef<HTMLDivElement>(null)
  const footerRef = React.useRef<HTMLDivElement>(null)
  const eyebrowRef = React.useRef<HTMLDivElement>(null)
  const ctaRef = React.useRef<HTMLDivElement>(null)
  const reduced = usePrefersReducedMotion()

  useGSAP(
    () => {
      if (!sectionRef.current || !pinRef.current || !stripRef.current) return

      // -- Initial states ----------------------------------------------
      // With reduced motion the translate offsets are zeroed so all the
      // reveals are pure opacity fades.
      if (eyebrowRef.current)
        gsap.set(eyebrowRef.current, { autoAlpha: 0, y: reduced ? 0 : 10 })
      if (headerRef.current)
        gsap.set(headerRef.current, { autoAlpha: 0, y: reduced ? 0 : 8 })
      lineRefs.current.forEach((el) => {
        if (el) gsap.set(el, { autoAlpha: 0, y: reduced ? 0 : 8 })
      })
      if (subtotalRef.current)
        gsap.set(subtotalRef.current, { autoAlpha: 0, y: reduced ? 0 : 6 })
      if (totalRef.current)
        gsap.set(totalRef.current, { autoAlpha: 0, y: reduced ? 0 : 6 })
      if (footerRef.current)
        gsap.set(footerRef.current, { autoAlpha: 0, y: reduced ? 0 : 4 })
      if (ctaRef.current)
        gsap.set(ctaRef.current, { autoAlpha: 0, y: reduced ? 0 : 12 })

      // The strip starts above the viewport (hidden behind the printer
      // slot). We pull it down to its final position over the pin. With
      // reduced motion the strip sits fully unrolled from the start —
      // the line items still fade in sequentially with scroll.
      gsap.set(stripRef.current, { y: reduced ? '0%' : '-95%' })

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

      if (eyebrowRef.current) {
        tl.to(
          eyebrowRef.current,
          { autoAlpha: 1, y: 0, duration: 0.05, ease: 'power2.out' },
          0,
        )
      }

      // -- Strip unrolls -----------------------------------------------
      if (!reduced) {
        tl.to(
          stripRef.current,
          {
            y: '0%',
            duration: 1,
            ease: 'none',
          },
          0,
        )
      }

      // -- Header lands very early -------------------------------------
      if (headerRef.current) {
        tl.to(
          headerRef.current,
          { autoAlpha: 1, y: 0, duration: 0.05, ease: 'power2.out' },
          0.05,
        )
      }

      // -- Each line item types in ------------------------------------
      // Lines are revealed as the receipt scrolls past them. We use
      // a normalized window from 0.1 to 0.75 (so the header + footer
      // get their own segments).
      const lineWindow = 0.65
      const lineStart = 0.1
      const N = lines.length
      lines.forEach((_, i) => {
        const el = lineRefs.current[i]
        if (!el) return
        const at = lineStart + (i / Math.max(1, N - 1)) * lineWindow
        tl.to(
          el,
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.06,
            ease: 'power2.out',
          },
          at,
        )
      })

      // -- Subtotal, total, footer come in at the end -----------------
      if (subtotalRef.current) {
        tl.to(
          subtotalRef.current,
          { autoAlpha: 1, y: 0, duration: 0.05, ease: 'power2.out' },
          0.82,
        )
      }
      if (totalRef.current) {
        tl.to(
          totalRef.current,
          { autoAlpha: 1, y: 0, duration: 0.06, ease: 'back.out(2)' },
          0.88,
        )
      }
      if (footerRef.current) {
        tl.to(
          footerRef.current,
          { autoAlpha: 1, y: 0, duration: 0.05, ease: 'power2.out' },
          0.95,
        )
      }
      if (ctaRef.current) {
        tl.to(
          ctaRef.current,
          { autoAlpha: 1, y: 0, duration: 0.06, ease: 'power2.out' },
          0.97,
        )
      }
    },
    {
      scope: sectionRef,
      dependencies: [lines, scrollLength, paperColor, inkColor, accentColor, reduced],
    },
  )

  return (
    <div
      ref={sectionRef}
      className={cn('relative w-full bg-picks-surface', className)}
      style={{ height: `${(scrollLength + 1) * 100}vh` }}
    >
      <div ref={pinRef} className="relative h-screen w-full overflow-hidden">
        {/* Background */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background: `radial-gradient(60% 70% at 50% 60%, ${accentColor}1a 0%, transparent 65%), radial-gradient(120% 90% at 50% 100%, rgba(0,0,0,0.6) 0%, transparent 60%)`,
          }}
        />

        {/* Eyebrow */}
        {eyebrow && (
          <div className="pointer-events-none absolute inset-x-0 top-0 z-20 flex justify-center px-6 pt-14 sm:pt-16">
            <div ref={eyebrowRef} className="pointer-events-auto">
              <div className="inline-flex items-center gap-2 whitespace-nowrap rounded-full border border-picks-fg/15 bg-picks-fg/[0.04] px-3 py-1 text-[11px] font-medium uppercase tracking-[0.22em] text-picks-fg/80 backdrop-blur">
                <span
                  aria-hidden
                  className="block h-1.5 w-1.5 rounded-full"
                  style={{ background: accentColor, boxShadow: `0 0 8px ${accentColor}` }}
                />
                {eyebrow}
              </div>
            </div>
          </div>
        )}

        {/* CENTERED stage — printer slot sits ABOVE the receipt card,
            both vertically centered in the viewport. */}
        <div className="absolute inset-0 flex items-center justify-center px-4">
          <div className="flex w-full max-w-[420px] flex-col items-stretch">
            {/* Printer slot — sits just above the receipt */}
            <div className="pointer-events-none relative z-30 mx-auto w-full">
              <div
                className="h-8 w-full rounded-t-md rounded-b-xl border border-picks-fg/10"
                style={{
                  background:
                    'linear-gradient(180deg, #14151c 0%, #07080b 90%)',
                  boxShadow:
                    '0 6px 12px -4px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.05)',
                }}
              />
              <div
                aria-hidden
                className="absolute inset-x-6 top-[60%] h-px"
                style={{
                  background: `linear-gradient(to right, transparent, ${accentColor}aa 30%, ${accentColor}aa 70%, transparent)`,
                  boxShadow: `0 0 8px ${accentColor}`,
                }}
              />
            </div>

            {/* The receipt — clipped so it appears to come out of the slot */}
            <div
              className="relative w-full overflow-hidden"
              style={{
                height: 'min(72vh, 720px)',
                maskImage:
                  'linear-gradient(to bottom, transparent 0, black 28px, black 100%)',
                WebkitMaskImage:
                  'linear-gradient(to bottom, transparent 0, black 28px, black 100%)',
              }}
            >
            <div
              ref={stripRef}
              className="relative mx-auto w-full"
              style={{
                background: paperColor,
                color: inkColor,
                fontFamily:
                  'ui-monospace, SFMono-Regular, Menlo, Monaco, "Courier New", monospace',
                boxShadow:
                  '0 10px 24px -8px rgba(0,0,0,0.55), inset 0 0 0 1px rgba(0,0,0,0.04)',
                willChange: 'transform',
              }}
            >
              <ScallopEdge color={paperColor} position="top" />
              <PaperGrain />

              {/* Header --------------------------------------------- */}
              <div ref={headerRef} className="relative px-6 pt-6 text-center">
                <p className="text-[11px] font-semibold uppercase tracking-[0.32em]">
                  {store}
                </p>
                {meta && (
                  <p className="mt-1 text-[10px] uppercase tracking-[0.22em] opacity-65">
                    {meta}
                  </p>
                )}
                <div className="mt-4 border-t border-dashed border-black/30" />
              </div>

              {/* Line items --------------------------------------- */}
              <div className="relative px-6 py-4">
                {lines.map((line, i) => (
                  <div
                    key={line.id}
                    ref={(el) => {
                      lineRefs.current[i] = el
                    }}
                    className="mb-3 flex items-baseline justify-between gap-4 text-[12px]"
                    style={{ willChange: 'transform, opacity' }}
                  >
                    <div className="min-w-0 flex-1">
                      <div className="truncate font-medium uppercase tracking-[0.06em]">
                        {line.label}
                      </div>
                      {line.note && (
                        <div className="mt-0.5 truncate text-[10px] opacity-60">
                          {line.note}
                        </div>
                      )}
                    </div>
                    <div className="whitespace-nowrap font-semibold tabular-nums">
                      {line.value}
                    </div>
                  </div>
                ))}
              </div>

              {/* Totals --------------------------------------------- */}
              <div className="relative px-6 pb-4">
                <div className="border-t border-dashed border-black/30 pt-3">
                  {subtotal != null && (
                    <div
                      ref={subtotalRef}
                      className="mb-1.5 flex items-baseline justify-between text-[11px] uppercase tracking-[0.12em] opacity-70"
                    >
                      <span>Subtotal</span>
                      <span className="font-semibold tabular-nums">{subtotal}</span>
                    </div>
                  )}
                  {tax != null && (
                    <div className="mb-1.5 flex items-baseline justify-between text-[11px] uppercase tracking-[0.12em] opacity-70">
                      <span>Tax</span>
                      <span className="font-semibold tabular-nums">{tax}</span>
                    </div>
                  )}
                  <div
                    ref={totalRef}
                    className="mt-2 flex items-baseline justify-between border-t border-dashed border-black/40 pt-2 text-base"
                  >
                    <span className="font-bold uppercase tracking-[0.16em]">
                      Total
                    </span>
                    <span className="font-bold tabular-nums">{total}</span>
                  </div>
                </div>
              </div>

              {/* Footer + barcode --------------------------------- */}
              <div ref={footerRef} className="relative px-6 pb-6 text-center">
                <div className="mx-auto mt-2 flex h-12 items-end justify-center gap-[2px]">
                  {Array.from({ length: 48 }).map((_, i) => {
                    // Pseudo-random but stable widths/heights via index.
                    const hash = (i * 9301 + 49297) % 233280
                    const w = 1 + ((hash >> 3) % 3) // 1-3
                    const h = 70 + (hash % 30) // 70-100
                    return (
                      <span
                        key={i}
                        className="block"
                        style={{
                          width: `${w}px`,
                          height: `${h}%`,
                          background: inkColor,
                        }}
                      />
                    )
                  })}
                </div>
                <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.32em] opacity-60">
                  {footer}
                </p>
              </div>

              <ScallopEdge color={paperColor} position="bottom" />
            </div>
          </div>
          </div>
        </div>

        {/* CTA */}
        {cta && (
          <div className="pointer-events-none absolute inset-x-0 bottom-16 z-30 flex justify-center px-6">
            <div ref={ctaRef} className="pointer-events-auto">
              <a
                href={cta.href ?? '#'}
                onClick={cta.onClick}
                className="group inline-flex items-center gap-2 rounded-full bg-picks-fg px-5 py-2.5 text-sm font-semibold text-picks-surface transition-colors hover:bg-picks-fg/90"
                style={{
                  boxShadow: `0 0 26px ${accentColor}40, 0 0 60px ${accentColor}1f`,
                }}
              >
                {cta.label}
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </a>
            </div>
          </div>
        )}

        <div
          aria-hidden
          className="pointer-events-none absolute bottom-5 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap text-[10px] font-medium uppercase tracking-[0.32em] text-picks-fg/45"
        >
          Scroll to print
        </div>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Scalloped (zig-zag) edge for top + bottom of the receipt.
// ---------------------------------------------------------------------------

function ScallopEdge({
  color,
  position,
}: {
  color: string
  position: 'top' | 'bottom'
}) {
  // A row of triangles cut into the paper. Built via SVG so it scales
  // crisply to any width.
  const points = Array.from({ length: 28 })
    .map((_, i) => {
      const x = (i / 27) * 100
      const y = i % 2 === 0 ? 0 : 100
      return `${x},${y}`
    })
    .join(' ')

  return (
    <svg
      aria-hidden
      viewBox="0 0 100 6"
      preserveAspectRatio="none"
      className={cn(
        'absolute inset-x-0 h-2 w-full',
        position === 'top' ? 'top-0' : 'bottom-0 rotate-180',
      )}
      style={{ display: 'block' }}
    >
      <polygon points={`0,0 100,0 ${points}`} fill={color} />
    </svg>
  )
}

// ---------------------------------------------------------------------------
// Paper grain — subtle SVG turbulence over the receipt.
// ---------------------------------------------------------------------------

function PaperGrain() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 opacity-[0.18] mix-blend-multiply"
      style={{
        backgroundImage:
          "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='0.55'/></svg>\")",
      }}
    />
  )
}
