'use client'

/**
 * <PinnedStory />
 *
 * A scroll-pinned, cinema-style "feature story" section. The container pins
 * while the user scrolls through N steps; a scrubbed GSAP timeline cross-
 * fades:
 *
 *   - the active step's text block (eyebrow / title / body)
 *   - the active image (with a slight scale + y-pan during its own segment)
 *   - a giant background step number (00, 01, 02 …)
 *   - a soft radial-gradient tint behind everything
 *   - a top progress bar that fills 0 → 1 across the pin
 *   - a side guide dot that travels top → bottom along a vertical rail
 *
 * Heavy on coordination, light on raw output — driven by `gsap.timeline()` +
 * `ScrollTrigger` with `scrub` so every animation is locked to the user's
 * actual scroll velocity (not a fire-and-forget tween).
 */

import * as React from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Anton } from 'next/font/google'
import { cn } from '@/lib/utils'

// Register the plugin once per module load (safe in client components).
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

const displayFont = Anton({ subsets: ['latin'], weight: '400', display: 'swap' })

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface PinnedStoryStep {
  id: string
  eyebrow?: string
  title: string
  body: string
  image: string
  /** Optional per-step accent color for the giant number + radial tint. */
  accent?: string
}

export interface PinnedStoryProps {
  steps: PinnedStoryStep[]
  /** Length of each step in viewport heights. More = slower per step. Default 1.2. */
  stepLength?: number
  /** Render the giant 00/01/02… number behind everything. Default true. */
  showBigNumber?: boolean
  /** Color used by the progress bar + side dot + default tint. */
  accentColor?: string
  className?: string
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function PinnedStory({
  steps,
  stepLength = 1.2,
  showBigNumber = true,
  accentColor = '#A78BFA',
  className,
}: PinnedStoryProps) {
  const sectionRef = React.useRef<HTMLDivElement>(null)
  const pinRef = React.useRef<HTMLDivElement>(null)
  const stepRefs = React.useRef<(HTMLDivElement | null)[]>([])
  const imageRefs = React.useRef<(HTMLDivElement | null)[]>([])
  const tintRefs = React.useRef<(HTMLDivElement | null)[]>([])
  const numberRefs = React.useRef<(HTMLSpanElement | null)[]>([])
  const progressRef = React.useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const section = sectionRef.current
      const pin = pinRef.current
      if (!section || !pin) return

      const N = steps.length

      // Initial state — everything past the first step is hidden via
      // autoAlpha (= opacity 0 + visibility hidden) so they don't render
      // as a faint ghost layer behind the active one.
      gsap.set(stepRefs.current.slice(1), { autoAlpha: 0, y: 24 })
      gsap.set(imageRefs.current.slice(1), { autoAlpha: 0, scale: 1.15 })
      gsap.set(tintRefs.current.slice(1), { autoAlpha: 0 })
      gsap.set(numberRefs.current.slice(1), { autoAlpha: 0 })

      // Make sure the first step's elements are at their resting values.
      gsap.set(stepRefs.current[0], { autoAlpha: 1, y: 0 })
      gsap.set(imageRefs.current[0], { autoAlpha: 1, scale: 1 })
      gsap.set(tintRefs.current[0], { autoAlpha: 1 })
      gsap.set(numberRefs.current[0], { autoAlpha: 0.08 })

      if (progressRef.current) {
        gsap.set(progressRef.current, { scaleX: 0, transformOrigin: '0% 50%' })
      }

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: () => `+=${N * stepLength * window.innerHeight}`,
          pin,
          // Lower scrub = snappier sync between scroll and timeline. Avoids
          // the "two steps visible during the slide" ghost.
          scrub: 0.2,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      })

      // Crisp, mostly-sequential transitions. Each transition happens in a
      // 6% window centered on the segment boundary — outgoing fades out
      // first, incoming fades in right after, with a tiny 2% kiss in the
      // middle so it doesn't feel like a hard cut.
      const TRANS = 0.06 / N // width of the transition (in normalized time)

      steps.forEach((_, i) => {
        const segStart = i / N

        // Per-segment parallax on the active image — gentle vertical drift.
        // Duration is the full segment minus the transition windows.
        if (imageRefs.current[i]) {
          tl.fromTo(
            imageRefs.current[i],
            { yPercent: -3 },
            { yPercent: 3, duration: 1 / N, ease: 'none' },
            segStart,
          )
        }

        if (i > 0) {
          // Outgoing — runs FIRST, finishes before incoming starts.
          const outAt = segStart - TRANS
          tl.to(
            stepRefs.current[i - 1],
            { autoAlpha: 0, y: -16, duration: TRANS * 0.7, ease: 'power2.in' },
            outAt,
          )
          tl.to(
            imageRefs.current[i - 1],
            { autoAlpha: 0, scale: 0.94, duration: TRANS * 0.7, ease: 'power2.in' },
            outAt,
          )
          tl.to(
            tintRefs.current[i - 1],
            { autoAlpha: 0, duration: TRANS * 0.7, ease: 'power2.in' },
            outAt,
          )
          tl.to(
            numberRefs.current[i - 1],
            { autoAlpha: 0, duration: TRANS * 0.7, ease: 'power2.in' },
            outAt,
          )

          // Incoming — starts slightly after outgoing begins, so there's
          // only a tiny visual overlap, never two full-opacity layers.
          const inAt = segStart - TRANS * 0.3
          tl.to(
            stepRefs.current[i],
            { autoAlpha: 1, y: 0, duration: TRANS * 0.7, ease: 'power2.out' },
            inAt,
          )
          tl.to(
            imageRefs.current[i],
            { autoAlpha: 1, scale: 1, duration: TRANS * 0.7, ease: 'power2.out' },
            inAt,
          )
          tl.to(
            tintRefs.current[i],
            { autoAlpha: 1, duration: TRANS * 0.7, ease: 'power2.out' },
            inAt,
          )
          tl.to(
            numberRefs.current[i],
            { autoAlpha: 0.08, duration: TRANS * 0.7, ease: 'power2.out' },
            inAt,
          )
        }
      })

      // Pad the timeline to exactly 1 unit of duration so the progress bar
      // and side dot tweens below have a clean 0 → 1 range to map onto.
      tl.to({}, { duration: Math.max(0.0001, 1 - tl.duration()) })

      // Top progress bar — fills evenly across the entire pin.
      if (progressRef.current) {
        tl.to(progressRef.current, { scaleX: 1, ease: 'none' }, 0)
      }
    },
    { dependencies: [steps, stepLength], scope: sectionRef },
  )

  return (
    <div
      ref={sectionRef}
      className={cn('relative w-full bg-black', className)}
    >
      <div
        ref={pinRef}
        className="relative h-screen w-full overflow-hidden"
      >
        {/* Giant step numbers behind everything ----------------------- */}
        {showBigNumber && (
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden"
          >
            {steps.map((step, i) => (
              <span
                key={step.id}
                ref={(el) => {
                  numberRefs.current[i] = el
                }}
                className={cn(
                  'absolute select-none leading-none tracking-tighter',
                  displayFont.className,
                )}
                style={{
                  fontSize: 'clamp(280px, 60vw, 720px)',
                  color: step.accent ?? accentColor,
                  opacity: 0,
                }}
              >
                {String(i + 1).padStart(2, '0')}
              </span>
            ))}
          </div>
        )}

        {/* Per-step radial tints (crossfade) -------------------------- */}
        <div aria-hidden className="pointer-events-none absolute inset-0">
          {steps.map((step, i) => (
            <div
              key={step.id}
              ref={(el) => {
                tintRefs.current[i] = el
              }}
              className="absolute inset-0"
              style={{
                background: `radial-gradient(ellipse 60% 60% at 75% 35%, ${
                  step.accent ?? accentColor
                }33, transparent 65%)`,
              }}
            />
          ))}
        </div>

        {/* Top progress bar ------------------------------------------ */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-10 top-10 z-30 h-px overflow-hidden rounded-full bg-white/10 sm:inset-x-16 lg:inset-x-24"
        >
          <div
            ref={progressRef}
            className="h-full origin-left"
            style={{ background: accentColor }}
          />
        </div>

        {/* Content grid --------------------------------------------- */}
        <div className="relative z-20 mx-auto grid h-full max-w-6xl grid-cols-1 gap-12 px-10 pb-20 pt-28 sm:px-16 lg:grid-cols-[1fr_1.1fr] lg:items-center lg:gap-24 lg:px-24">
          {/* Left — overlapping step text blocks */}
          <div className="relative flex h-full min-h-[420px] items-center">
            <div className="relative w-full">
              {steps.map((step, i) => (
                <div
                  key={step.id}
                  ref={(el) => {
                    stepRefs.current[i] = el
                  }}
                  className={cn(
                    'flex max-w-md flex-col gap-3',
                    i === 0 ? 'relative' : 'absolute inset-0 right-auto',
                  )}
                >
                  {step.eyebrow && (
                    <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-white/60">
                      <span className="font-mono tabular-nums text-white/40">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <span className="mx-2 text-white/20">·</span>
                      {step.eyebrow}
                    </p>
                  )}
                  <h3 className="text-balance text-4xl font-semibold leading-tight tracking-tight text-white sm:text-5xl">
                    {step.title}
                  </h3>
                  <p className="text-pretty text-base leading-relaxed text-white/65 sm:text-lg">
                    {step.body}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Right — overlapping image cards */}
          <div className="relative flex items-center justify-center">
            <div className="relative aspect-[3/4] w-full max-w-md overflow-hidden rounded-2xl border border-white/10 bg-zinc-900 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.7)]">
              {steps.map((step, i) => (
                <div
                  key={step.id}
                  ref={(el) => {
                    imageRefs.current[i] = el
                  }}
                  // Image wrap is 8% taller than the card on each side so
                  // the parallax tween (±3%) never reveals a black gap at
                  // the top or bottom. The card's `overflow-hidden` clips
                  // the overflow cleanly.
                  className="absolute left-0 right-0"
                  style={{
                    top: '-8%',
                    bottom: '-8%',
                    opacity: i === 0 ? 1 : 0,
                  }}
                >
                  <img
                    src={step.image}
                    alt={step.title}
                    className="h-full w-full object-cover"
                    draggable={false}
                  />
                  {/* Bottom-gradient so the next-step indicator is readable */}
                  <div
                    aria-hidden
                    className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"
                  />
                </div>
              ))}

              {/* Step counter inside the image card */}
              <div className="pointer-events-none absolute bottom-5 left-5 text-xs font-mono tabular-nums text-white/85">
                <span className="text-white/55">Step</span>{' '}
                <CounterDisplay total={steps.length} stepRefs={stepRefs} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Tiny helper — derives the current step from which step-block has highest
// opacity. Keeps the readout snappy without subscribing to scroll directly.
// ---------------------------------------------------------------------------

function CounterDisplay({
  total,
  stepRefs,
}: {
  total: number
  stepRefs: React.MutableRefObject<(HTMLDivElement | null)[]>
}) {
  const [current, setCurrent] = React.useState(1)

  React.useEffect(() => {
    let raf = 0
    const tick = () => {
      let bestI = 0
      let bestO = -1
      for (let i = 0; i < stepRefs.current.length; i++) {
        const el = stepRefs.current[i]
        if (!el) continue
        const o = parseFloat(getComputedStyle(el).opacity)
        if (o > bestO) {
          bestO = o
          bestI = i
        }
      }
      setCurrent(bestI + 1)
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [stepRefs])

  return (
    <span>
      {String(current).padStart(2, '0')}{' '}
      <span className="text-white/40">/ {String(total).padStart(2, '0')}</span>
    </span>
  )
}
