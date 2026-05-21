'use client'

/**
 * <PhraseSlots />
 *
 * A pinned scroll section that reads like a slot machine for words.
 *
 *  - Each "slot" is a single-line window with a tall column of candidate
 *    words stacked behind it. Only one word is visible at a time.
 *  - The column scrolls vertically — fast at first, slowing as it lands —
 *    driven by a scrubbed GSAP timeline. The reel runs through every
 *    candidate (multiple cycles) before stopping on its target.
 *  - Each slot LANDS at a different scroll progress, so the sentence
 *    reveals left-to-right with a satisfying stagger.
 *  - Once every slot has landed, an accent underline draws across the
 *    full row, the description fades in, and a final CTA arrives.
 *
 * The end state is a complete sentence that *feels assembled* in front
 * of the reader, not just shown.
 */

import * as React from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Anton } from 'next/font/google'
import { ArrowUpRight } from 'lucide-react'
import { cn } from '@/lib/utils'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

const displayFont = Anton({
  subsets: ['latin'],
  weight: '400',
  display: 'swap',
})

// Each slot's column shows the option list this many times stacked, so the
// column can "spin" past every word a few times before stopping. Higher =
// more slot-reel energy, but more vertical DOM.
const CYCLES = 3

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface PhraseSlotConfig {
  /** Every candidate word that scrolls through this slot. */
  options: string[]
  /** The word the slot lands on. Must exist in `options`. */
  target: string
}

export interface PhraseSlotsCta {
  label: string
  href?: string
  onClick?: () => void
}

export interface PhraseSlotsProps {
  /** Each entry is one slot. Read left-to-right, they form the final sentence. */
  slots: PhraseSlotConfig[]
  /** Tiny tag rendered above the heading. */
  eyebrow?: React.ReactNode
  /** Optional heading shown above the slot row. */
  heading?: React.ReactNode
  /** Sub-copy that fades in once the sentence has landed. */
  description?: React.ReactNode
  /** CTA shown under the description, after everything lands. */
  cta?: PhraseSlotsCta
  /** Pin duration in viewport heights. Default 3.5. */
  scrollLength?: number
  /** Accent color (underline, glow, dot). Default #A78BFA. */
  accentColor?: string
  /** Slot height in px (also drives the font-size). Default 96. */
  slotHeight?: number
  className?: string
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function PhraseSlots({
  slots,
  eyebrow,
  heading,
  description,
  cta,
  scrollLength = 3.5,
  accentColor = '#A78BFA',
  slotHeight = 96,
  className,
}: PhraseSlotsProps) {
  const sectionRef = React.useRef<HTMLDivElement>(null)
  const pinRef = React.useRef<HTMLDivElement>(null)
  const columnRefs = React.useRef<(HTMLDivElement | null)[]>([])
  const underlineRef = React.useRef<HTMLDivElement>(null)
  const eyebrowRef = React.useRef<HTMLDivElement>(null)
  const headingRef = React.useRef<HTMLHeadingElement>(null)
  const descRef = React.useRef<HTMLParagraphElement>(null)
  const ctaRef = React.useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      if (!sectionRef.current || !pinRef.current) return

      // Initial states.
      if (eyebrowRef.current) gsap.set(eyebrowRef.current, { autoAlpha: 0, y: 10 })
      if (headingRef.current) gsap.set(headingRef.current, { autoAlpha: 0, y: 16 })
      if (underlineRef.current)
        gsap.set(underlineRef.current, { scaleX: 0, transformOrigin: '0% 50%' })
      if (descRef.current) gsap.set(descRef.current, { autoAlpha: 0, y: 12 })
      if (ctaRef.current) gsap.set(ctaRef.current, { autoAlpha: 0, y: 12 })

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: () => `+=${scrollLength * window.innerHeight}`,
          pin: pinRef.current,
          scrub: 0.3,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      })

      // Header — eyebrow + heading land early so the user knows what they're
      // about to read.
      if (eyebrowRef.current) {
        tl.to(eyebrowRef.current, { autoAlpha: 1, y: 0, duration: 0.06, ease: 'power2.out' }, 0)
      }
      if (headingRef.current) {
        tl.to(headingRef.current, { autoAlpha: 1, y: 0, duration: 0.08, ease: 'power2.out' }, 0.02)
      }

      // Each slot's column scrolls through, lands at its target. Staggered
      // landing scroll-progress per slot — earlier slots land first.
      const last = Math.max(1, slots.length - 1)
      slots.forEach((slot, i) => {
        const N = slot.options.length
        const targetIdx = Math.max(0, slot.options.indexOf(slot.target))
        // The cycled column has CYCLES × N items. Land on the target in the
        // FINAL cycle so the user sees a few spins worth of options first.
        const finalCycleStart = (CYCLES - 1) * N
        const offsetIndex = finalCycleStart + targetIdx
        const offsetPx = offsetIndex * slotHeight

        // Spread landings between 0.20 and 0.84 of the timeline.
        const landAt = 0.2 + (i / last) * 0.64

        tl.fromTo(
          columnRefs.current[i],
          { y: 0 },
          {
            y: -offsetPx,
            // power3.out feels like a slot reel slowing down at the end.
            ease: 'power3.out',
            duration: landAt,
          },
          0,
        )
      })

      // Underline draws once the last slot lands.
      if (underlineRef.current) {
        tl.to(
          underlineRef.current,
          { scaleX: 1, duration: 0.07, ease: 'power2.out' },
          0.86,
        )
      }

      // Description + CTA fade in after.
      if (descRef.current) {
        tl.to(
          descRef.current,
          { autoAlpha: 1, y: 0, duration: 0.06, ease: 'power2.out' },
          0.92,
        )
      }
      if (ctaRef.current) {
        tl.to(
          ctaRef.current,
          { autoAlpha: 1, y: 0, duration: 0.06, ease: 'power2.out' },
          0.95,
        )
      }
    },
    { scope: sectionRef, dependencies: [slots, scrollLength, slotHeight] },
  )

  // For SR users + crawlers: the meaningful content is the target sentence.
  const ariaLabel = slots.map((s) => s.target).join(' ')

  return (
    <div
      ref={sectionRef}
      className={cn('relative w-full bg-black', className)}
      style={{ height: `${(scrollLength + 1) * 100}vh` }}
    >
      <div ref={pinRef} className="relative h-screen w-full overflow-hidden">
        {/* Soft radial accent in the background */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background: `radial-gradient(55% 55% at 50% 45%, ${accentColor}1f, transparent 65%)`,
          }}
        />

        {/* A subtle horizontal "rail" lines through the slots so the active
            words feel anchored to a track. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-1/2 z-0 h-px -translate-y-1/2 bg-gradient-to-r from-transparent via-white/[0.06] to-transparent"
        />

        <div className="relative z-10 mx-auto flex h-full max-w-6xl flex-col items-center justify-center gap-10 px-6 text-center sm:px-10">
          {/* Eyebrow */}
          {eyebrow && (
            <div
              ref={eyebrowRef}
              className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-3 py-1 text-[11px] font-medium uppercase tracking-[0.22em] text-white/80 backdrop-blur"
            >
              <span
                aria-hidden
                className="block h-1.5 w-1.5 rounded-full"
                style={{ background: accentColor }}
              />
              {eyebrow}
            </div>
          )}

          {/* Heading */}
          {heading && (
            <h2
              ref={headingRef}
              className="text-balance text-xl font-medium leading-snug tracking-tight text-white/85 sm:text-2xl"
            >
              {heading}
            </h2>
          )}

          {/* Slots row */}
          <div className="relative" role="text" aria-label={ariaLabel}>
            <div className="flex items-baseline justify-center gap-3 sm:gap-5">
              {slots.map((slot, i) => {
                // Stack the options CYCLES times — gives the reel something to
                // spin through before it lands.
                const cycled: string[] = []
                for (let c = 0; c < CYCLES; c++) {
                  for (const w of slot.options) cycled.push(w)
                }
                return (
                  <div
                    key={i}
                    aria-hidden
                    className="relative overflow-hidden"
                    style={{
                      height: `${slotHeight}px`,
                      // Soft top/bottom fade so words tick into view from behind a haze.
                      WebkitMaskImage:
                        'linear-gradient(to bottom, transparent 0%, black 28%, black 72%, transparent 100%)',
                      maskImage:
                        'linear-gradient(to bottom, transparent 0%, black 28%, black 72%, transparent 100%)',
                    }}
                  >
                    <div
                      ref={(el) => {
                        columnRefs.current[i] = el
                      }}
                      className={cn(
                        'flex flex-col items-center uppercase tracking-tight text-white',
                        displayFont.className,
                      )}
                      style={{
                        fontSize: `${slotHeight}px`,
                        lineHeight: `${slotHeight}px`,
                        letterSpacing: '-0.02em',
                        // `will-change` so the browser keeps this on the
                        // compositor — smooth at high scroll velocity.
                        willChange: 'transform',
                      }}
                    >
                      {cycled.map((word, k) => (
                        <span key={k} className="block whitespace-nowrap px-2">
                          {word}
                        </span>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Accent underline — draws once the last slot lands */}
            <div
              ref={underlineRef}
              className="absolute -bottom-4 left-0 h-px w-full"
              style={{ background: accentColor }}
            />
          </div>

          {/* Description */}
          {description && (
            <p
              ref={descRef}
              className="max-w-xl text-pretty text-sm leading-relaxed text-white/65 sm:text-base"
            >
              {description}
            </p>
          )}

          {/* CTA */}
          {cta && (
            <div ref={ctaRef}>
              <a
                href={cta.href ?? '#'}
                onClick={cta.onClick}
                className="group inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-black transition-colors hover:bg-white/90"
              >
                {cta.label}
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </a>
            </div>
          )}
        </div>

        {/* Tiny scroll hint */}
        <div
          aria-hidden
          className="pointer-events-none absolute bottom-8 left-1/2 z-10 -translate-x-1/2 text-[10px] font-medium uppercase tracking-[0.32em] text-white/45"
        >
          Scroll
        </div>
      </div>
    </div>
  )
}
