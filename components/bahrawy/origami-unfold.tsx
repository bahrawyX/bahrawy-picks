'use client'

/**
 * <OrigamiUnfold />
 *
 * A pinned scroll section centred on a folded paper square that
 * unfolds in 3D as you scroll. The paper starts as a compact tile;
 * four triangular flaps are folded inward over its centre, hiding
 * the contents. As scroll progresses each flap unfolds outward
 * sequentially (top → right → bottom → left), revealing the four
 * content quadrants underneath, then a final fade lights up a
 * headline + CTA above the unfolded sheet.
 *
 * Heavy bits:
 *  - The container uses `perspective` so the flap `rotateX` /
 *    `rotateY` reads as a true 3D fold.
 *  - Each flap has its `transform-origin` pinned to the EDGE it
 *    hinges from — top flap's origin at its bottom edge, right
 *    flap's origin at its left edge, etc. Animating rotateX/Y from
 *    0 → -180 unfolds the flap outward.
 *  - The flap "back face" (the one you see when folded in) has its
 *    own content; the "front face" (visible after unfold) shows the
 *    quadrant content. Both faces are siblings with
 *    `backface-visibility: hidden` and the back face is pre-rotated
 *    180° so it's the visible one in the folded state.
 *  - One scrubbed GSAP timeline animates the four flaps in order +
 *    fades in the per-quadrant content + lands the headline.
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

export interface OrigamiPanel {
  /** Tiny tag rendered above the title. */
  eyebrow?: React.ReactNode
  /** Headline for this quadrant. */
  title: React.ReactNode
  /** Sub-copy under the title. */
  body?: React.ReactNode
  /** Per-quadrant accent color. */
  accent?: string
}

export interface OrigamiCta {
  label: string
  href?: string
  onClick?: () => void
}

export interface OrigamiUnfoldProps {
  /**
   * Exactly four panels — one per quadrant. Order:
   *  [topLeft, topRight, bottomRight, bottomLeft]
   * (Counterclockwise as the flaps unfold in clockwise order top →
   * right → bottom → left.)
   */
  panels: [OrigamiPanel, OrigamiPanel, OrigamiPanel, OrigamiPanel]
  /** Tiny tag above the whole section. */
  eyebrow?: React.ReactNode
  /** Headline that fades in above the unfolded sheet at the end. */
  finalHeading?: React.ReactNode
  /** Optional CTA after the heading. */
  cta?: OrigamiCta
  /** Pin length in viewport heights. Default 3.5. */
  scrollLength?: number
  /** Paper background color. */
  paperColor?: string
  /** Accent color used as the ring + flap inner glow. */
  accentColor?: string
  className?: string
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

const FLAP_ORDER: ('top' | 'right' | 'bottom' | 'left')[] = [
  'top',
  'right',
  'bottom',
  'left',
]

export function OrigamiUnfold({
  panels,
  eyebrow,
  finalHeading,
  cta,
  scrollLength = 3.5,
  paperColor = '#fafaf7',
  accentColor = '#22D3EE',
  className,
}: OrigamiUnfoldProps) {
  const sectionRef = React.useRef<HTMLDivElement>(null)
  const pinRef = React.useRef<HTMLDivElement>(null)
  const flapRefs = React.useRef<(HTMLDivElement | null)[]>([])
  const panelRefs = React.useRef<(HTMLDivElement | null)[]>([])
  const eyebrowRef = React.useRef<HTMLDivElement>(null)
  const headingRef = React.useRef<HTMLDivElement>(null)
  const ctaRef = React.useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      if (!sectionRef.current || !pinRef.current) return

      // -- Initial states ---------------------------------------------
      if (eyebrowRef.current)
        gsap.set(eyebrowRef.current, { autoAlpha: 0, y: 10 })
      if (headingRef.current)
        gsap.set(headingRef.current, { autoAlpha: 0, y: 18 })
      if (ctaRef.current) gsap.set(ctaRef.current, { autoAlpha: 0, y: 14 })
      panelRefs.current.forEach((el) => {
        if (el) gsap.set(el, { autoAlpha: 0, scale: 0.92 })
      })
      // All four flaps start at 0 degrees (covering the quadrants).
      FLAP_ORDER.forEach((_, i) => {
        const el = flapRefs.current[i]
        if (!el) return
        gsap.set(el, { rotationX: 0, rotationY: 0 })
      })

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: () => `+=${scrollLength * window.innerHeight}`,
          pin: pinRef.current,
          scrub: 0.4,
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

      // -- Unfold each flap sequentially ------------------------------
      // top    → rotateX: -180 (flips backward, away from camera)
      // right  → rotateY: -180 (flips outward to the right)
      // bottom → rotateX: +180 (flips forward, downward)
      // left   → rotateY: +180 (flips outward to the left)
      const targets: Record<string, gsap.TweenVars> = {
        top: { rotationX: -180 },
        right: { rotationY: -180 },
        bottom: { rotationX: 180 },
        left: { rotationY: 180 },
      }
      FLAP_ORDER.forEach((dir, i) => {
        const el = flapRefs.current[i]
        if (!el) return
        const start = 0.04 + (i * 0.78) / 4
        tl.to(
          el,
          {
            ...targets[dir],
            duration: 0.16,
            ease: 'power2.inOut',
          },
          start,
        )
        // Reveal that quadrant's content once the flap is past 90°.
        if (panelRefs.current[i]) {
          tl.to(
            panelRefs.current[i],
            {
              autoAlpha: 1,
              scale: 1,
              duration: 0.08,
              ease: 'power2.out',
            },
            start + 0.1,
          )
        }
      })

      // -- Final heading + CTA ----------------------------------------
      if (headingRef.current) {
        tl.to(
          headingRef.current,
          { autoAlpha: 1, y: 0, duration: 0.07, ease: 'power2.out' },
          0.88,
        )
      }
      if (ctaRef.current) {
        tl.to(
          ctaRef.current,
          { autoAlpha: 1, y: 0, duration: 0.06, ease: 'power2.out' },
          0.94,
        )
      }
    },
    {
      scope: sectionRef,
      dependencies: [panels, scrollLength, accentColor, paperColor],
    },
  )

  // Quadrant rendering positions inside the paper square.
  const quadrantClasses = [
    // 0 — top-left
    'left-0 top-0',
    // 1 — top-right
    'right-0 top-0',
    // 2 — bottom-right
    'right-0 bottom-0',
    // 3 — bottom-left
    'left-0 bottom-0',
  ]

  return (
    <div
      ref={sectionRef}
      className={cn('relative w-full bg-[#0a0a14]', className)}
      style={{ height: `${(scrollLength + 1) * 100}vh` }}
    >
      <div ref={pinRef} className="relative h-screen w-full overflow-hidden">
        {/* Background — soft moody radial */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background: `radial-gradient(60% 60% at 50% 60%, ${accentColor}14 0%, transparent 65%), radial-gradient(120% 80% at 50% 100%, rgba(0,0,0,0.6) 0%, transparent 60%)`,
          }}
        />

        {/* Eyebrow at the top */}
        {eyebrow && (
          <div className="pointer-events-none absolute inset-x-0 top-0 z-10 flex justify-center px-6 pt-14 sm:pt-16">
            <div ref={eyebrowRef} className="pointer-events-auto">
              <div className="inline-flex items-center gap-2 whitespace-nowrap rounded-full border border-white/15 bg-white/[0.04] px-3 py-1 text-[11px] font-medium uppercase tracking-[0.22em] text-white/80 backdrop-blur">
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

        {/* Final heading + CTA — sits ABOVE the paper, fades in late */}
        {finalHeading && (
          <div className="pointer-events-none absolute inset-x-0 top-[14%] z-30 flex flex-col items-center px-6 text-center">
            <div ref={headingRef} className="max-w-2xl">
              <h2
                className="text-balance text-2xl font-semibold leading-tight tracking-tight text-white sm:text-3xl lg:text-4xl"
                style={{ textShadow: `0 0 30px ${accentColor}55` }}
              >
                {finalHeading}
              </h2>
            </div>
          </div>
        )}

        {/* The paper — centered, perspective + preserve-3d */}
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{ perspective: '1400px' }}
        >
          <div
            className="relative"
            style={{
              width: 'min(58vmin, 70vh)',
              height: 'min(58vmin, 70vh)',
              transformStyle: 'preserve-3d',
            }}
          >
            {/* The unfolded base sheet — visible at the end */}
            <div
              className="absolute inset-0 rounded-lg"
              style={{
                background: paperColor,
                boxShadow:
                  '0 30px 80px -20px rgba(0,0,0,0.6), inset 0 0 0 1px rgba(0,0,0,0.06)',
              }}
            >
              <PaperGrain />
              {/* Subtle accent ring around the edge */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-3 rounded-md border"
                style={{ borderColor: `${accentColor}40` }}
              />

              {/* Quadrant content — each panel pins its text to the
                  outer corner of the paper for a clean editorial look:
                  top-left  → align top + left
                  top-right → align top + right (text-right)
                  bottom-right → align bottom + right (text-right)
                  bottom-left  → align bottom + left
                  The little "01 / 04" number sits at the INNER corner
                  (toward the centre) so it never crowds the title. */}
              {panels.map((p, i) => {
                const accent = p.accent ?? accentColor
                // Per-corner layout class — controls justify/align +
                // text alignment + which corner the number sits in.
                const layout = [
                  {
                    // 0 — top-left
                    box: 'items-start justify-start text-left',
                    number: 'bottom-0 right-0',
                  },
                  {
                    // 1 — top-right
                    box: 'items-end justify-start text-right',
                    number: 'bottom-0 left-0',
                  },
                  {
                    // 2 — bottom-right
                    box: 'items-end justify-end text-right',
                    number: 'top-0 left-0',
                  },
                  {
                    // 3 — bottom-left
                    box: 'items-start justify-end text-left',
                    number: 'top-0 right-0',
                  },
                ][i]
                return (
                  <div
                    key={i}
                    ref={(el) => {
                      panelRefs.current[i] = el
                    }}
                    className={cn(
                      'absolute h-1/2 w-1/2 p-7 sm:p-8 lg:p-10',
                      quadrantClasses[i],
                    )}
                    style={{ willChange: 'transform, opacity' }}
                  >
                    <div
                      className={cn(
                        'relative flex h-full w-full flex-col gap-2',
                        layout.box,
                      )}
                    >
                      {/* Quadrant number — opposite corner, monospaced */}
                      <span
                        aria-hidden
                        className={cn(
                          'absolute font-mono text-[10px] tabular-nums tracking-[0.18em] text-black/35',
                          layout.number,
                        )}
                      >
                        {String(i + 1).padStart(2, '0')} / 04
                      </span>

                      {p.eyebrow && (
                        <p
                          className="inline-flex items-center gap-2 whitespace-nowrap text-[10px] font-medium uppercase tracking-[0.34em]"
                          style={{ color: `${accent}cc` }}
                        >
                          {/* hairline rule on the side closest to the
                              outer edge — flips for right-aligned text */}
                          {i === 1 || i === 2 ? null : (
                            <span
                              aria-hidden
                              className="block h-px w-5"
                              style={{ background: accent }}
                            />
                          )}
                          <span>{p.eyebrow}</span>
                          {i === 1 || i === 2 ? (
                            <span
                              aria-hidden
                              className="block h-px w-5"
                              style={{ background: accent }}
                            />
                          ) : null}
                        </p>
                      )}
                      <h3 className="max-w-[14ch] text-balance text-xl font-semibold leading-[1.1] tracking-[-0.01em] text-black sm:text-2xl lg:text-[1.65rem]">
                        {p.title}
                      </h3>
                      {p.body && (
                        <p className="max-w-[22ch] text-pretty text-xs leading-relaxed text-black/55 sm:text-sm">
                          {p.body}
                        </p>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>

            {/* The four flaps — each starts covering its half of the
                paper, hinged at the centre. */}
            {FLAP_ORDER.map((dir, i) => {
              const transformOriginByDir: Record<string, string> = {
                top: 'center bottom',
                right: 'left center',
                bottom: 'center top',
                left: 'right center',
              }
              const positionByDir: Record<string, string> = {
                top: 'absolute left-0 top-0 h-1/2 w-full',
                right: 'absolute right-0 top-0 h-full w-1/2',
                bottom: 'absolute left-0 bottom-0 h-1/2 w-full',
                left: 'absolute left-0 top-0 h-full w-1/2',
              }
              return (
                <div
                  key={dir}
                  ref={(el) => {
                    flapRefs.current[i] = el
                  }}
                  className={cn(positionByDir[dir])}
                  style={{
                    transformOrigin: transformOriginByDir[dir],
                    transformStyle: 'preserve-3d',
                    willChange: 'transform',
                    background: paperColor,
                    boxShadow:
                      'inset 0 0 0 1px rgba(0,0,0,0.05), 0 6px 16px -8px rgba(0,0,0,0.4)',
                  }}
                >
                  <PaperGrain />
                  {/* Fold-edge accent line at the hinge */}
                  <div
                    aria-hidden
                    className={cn(
                      'absolute opacity-60',
                      dir === 'top' && 'bottom-0 left-0 right-0 h-px',
                      dir === 'right' && 'left-0 top-0 bottom-0 w-px',
                      dir === 'bottom' && 'top-0 left-0 right-0 h-px',
                      dir === 'left' && 'right-0 top-0 bottom-0 w-px',
                    )}
                    style={{ background: `${accentColor}40` }}
                  />
                  {/* Centre seal — a small accent square in the middle
                      of the closed paper */}
                  {dir === 'top' && (
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 -translate-y-2 text-center">
                      <div
                        className="mx-auto mb-1.5 h-2 w-2 rounded-full"
                        style={{
                          background: accentColor,
                          boxShadow: `0 0 8px ${accentColor}`,
                        }}
                      />
                      <p className="whitespace-nowrap text-[9px] font-medium uppercase tracking-[0.28em]"
                         style={{ color: `${accentColor}aa` }}>
                        unfold to read
                      </p>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Final CTA — fades in beneath the paper */}
        {cta && (
          <div className="pointer-events-none absolute inset-x-0 bottom-16 z-30 flex justify-center px-6">
            <div ref={ctaRef} className="pointer-events-auto">
              <a
                href={cta.href ?? '#'}
                onClick={cta.onClick}
                className="group inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-black transition-colors hover:bg-white/90"
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
          className="pointer-events-none absolute bottom-5 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap text-[10px] font-medium uppercase tracking-[0.32em] text-white/45"
        >
          Scroll to unfold
        </div>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Paper grain — subtle SVG turbulence texture for the paper surfaces.
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
