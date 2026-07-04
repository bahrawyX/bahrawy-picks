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
import { cn } from '@/lib/utils'
import { usePrefersReducedMotion } from '@/lib/use-prefers-reduced-motion'
import { useOnScreen } from '@/lib/use-on-screen'

// Register the plugin once per module load (safe in client components).
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

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
  /**
   * Class applied to the giant background number — pass a display-font
   * class (e.g. from `next/font`) for the poster look. Defaults to the
   * inherited font.
   */
  fontClassName?: string
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
  fontClassName = '',
  className,
}: PinnedStoryProps) {
  const sectionRef = React.useRef<HTMLDivElement>(null)
  const pinRef = React.useRef<HTMLDivElement>(null)
  const stepRefs = React.useRef<(HTMLDivElement | null)[]>([])
  const imageRefs = React.useRef<(HTMLDivElement | null)[]>([])
  const tintRefs = React.useRef<(HTMLDivElement | null)[]>([])
  const numberRefs = React.useRef<(HTMLSpanElement | null)[]>([])
  const progressRef = React.useRef<HTMLDivElement>(null)
  const reduced = usePrefersReducedMotion()
  const onScreen = useOnScreen(sectionRef)
  // Scrubbed timeline progress, mirrored into a ref so the step counter
  // can derive its readout without per-frame getComputedStyle reads.
  const tlProgressRef = React.useRef(0)

  useGSAP(
    () => {
      const section = sectionRef.current
      const pin = pinRef.current
      if (!section || !pin) return

      const N = steps.length

      // Initial state — all but the first step start invisible and slightly
      // offset. We use autoAlpha (= opacity 0 + visibility hidden) so the
      // hidden panels are also pulled out of the accessibility tree.
      // With reduced motion the crossfades stay (they're scroll-scrubbed)
      // but drop their translate/scale drift — pure opacity fades.
      stepRefs.current.forEach((el, i) => {
        if (!el) return
        gsap.set(el, {
          autoAlpha: i === 0 ? 1 : 0,
          y: i === 0 || reduced ? 0 : 12,
        })
      })
      imageRefs.current.forEach((el, i) => {
        if (!el) return
        gsap.set(el, {
          autoAlpha: i === 0 ? 1 : 0,
          scale: i === 0 || reduced ? 1 : 1.04,
        })
      })
      tintRefs.current.forEach((el, i) => {
        if (!el) return
        gsap.set(el, { autoAlpha: i === 0 ? 1 : 0 })
      })
      numberRefs.current.forEach((el, i) => {
        if (!el) return
        gsap.set(el, { autoAlpha: i === 0 ? 0.08 : 0 })
      })

      if (progressRef.current) {
        gsap.set(progressRef.current, { scaleX: 0, transformOrigin: '0% 50%' })
      }

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: () => `+=${N * stepLength * window.innerHeight}`,
          pin,
          // A touch more scrub smoothing than before — gives the
          // crossfades a buttery, spring-like feel instead of being
          // perfectly locked to the scroll-wheel jitter.
          scrub: 0.5,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
        // Mirror the scrubbed playhead into a ref — the counter reads the
        // step from this instead of polling computed opacities.
        onUpdate: () => {
          tlProgressRef.current = tl.progress()
        },
      })

      // Continuous, generously overlapping crossfade. Each step transition
      // takes the full inter-segment window (rather than a tight 6% kiss)
      // and uses a power2.inOut curve, so opacity/y move smoothly with
      // scroll position. No more "snap at the boundary" — both layers
      // share the segment and exchange opacity gradually.
      for (let i = 1; i < N; i++) {
        const start = (i - 1) / N
        const dur = 1 / N

        // Outgoing — fades + drifts up across the entire segment.
        tl.to(
          stepRefs.current[i - 1],
          {
            autoAlpha: 0,
            y: reduced ? 0 : -12,
            duration: dur,
            ease: 'power2.inOut',
          },
          start,
        )
        tl.to(
          imageRefs.current[i - 1],
          {
            autoAlpha: 0,
            scale: reduced ? 1 : 0.98,
            duration: dur,
            ease: 'power2.inOut',
          },
          start,
        )
        tl.to(
          tintRefs.current[i - 1],
          { autoAlpha: 0, duration: dur, ease: 'power2.inOut' },
          start,
        )
        tl.to(
          numberRefs.current[i - 1],
          { autoAlpha: 0, duration: dur, ease: 'power2.inOut' },
          start,
        )

        // Incoming — fades + settles in across the SAME segment, fully
        // overlapping the outgoing. This is the key to a smooth ride:
        // there's no dead frame where the new step pops in after the old
        // one is already gone.
        tl.fromTo(
          stepRefs.current[i],
          { autoAlpha: 0, y: reduced ? 0 : 12 },
          { autoAlpha: 1, y: 0, duration: dur, ease: 'power2.inOut' },
          start,
        )
        tl.fromTo(
          imageRefs.current[i],
          { autoAlpha: 0, scale: reduced ? 1 : 1.04 },
          { autoAlpha: 1, scale: 1, duration: dur, ease: 'power2.inOut' },
          start,
        )
        tl.fromTo(
          tintRefs.current[i],
          { autoAlpha: 0 },
          { autoAlpha: 1, duration: dur, ease: 'power2.inOut' },
          start,
        )
        tl.fromTo(
          numberRefs.current[i],
          { autoAlpha: 0 },
          { autoAlpha: 0.08, duration: dur, ease: 'power2.inOut' },
          start,
        )
      }

      // Pad the timeline to exactly 1 unit of duration so the progress bar
      // below has a clean 0 → 1 range to map onto.
      tl.to({}, { duration: Math.max(0.0001, 1 - tl.duration()) })

      // Top progress bar — fills evenly across the entire pin.
      if (progressRef.current) {
        tl.to(progressRef.current, { scaleX: 1, ease: 'none' }, 0)
      }
    },
    { dependencies: [steps, stepLength, reduced], scope: sectionRef },
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
                  fontClassName,
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
                <CounterDisplay
                  total={steps.length}
                  progressRef={tlProgressRef}
                  reduced={reduced}
                  active={onScreen}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Tiny helper — derives the current step from the scrubbed timeline's
// progress (mirrored into a ref by the parent). Each step's crossfade
// occupies segment [(i−1)/N, i/N]; the incoming step overtakes the outgoing
// one at the segment midpoint, so the readout flips at (i−0.5)/N.
// ---------------------------------------------------------------------------

function CounterDisplay({
  total,
  progressRef,
  reduced,
  active,
}: {
  total: number
  progressRef: React.MutableRefObject<number>
  reduced: boolean
  active: boolean
}) {
  const [current, setCurrent] = React.useState(1)

  React.useEffect(() => {
    const compute = () => {
      const i = Math.floor(progressRef.current * total + 0.5)
      setCurrent(Math.min(total, Math.max(1, i + 1)))
    }

    // With reduced motion, skip the permanent RAF loop — recompute the
    // readout from scroll events instead.
    if (reduced) {
      compute()
      window.addEventListener('scroll', compute, { passive: true })
      return () => window.removeEventListener('scroll', compute)
    }

    // Offscreen (or hidden tab): hold the last readout — no RAF.
    if (!active) return

    let raf = 0
    const tick = () => {
      compute()
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [progressRef, reduced, active, total])

  return (
    <span>
      {String(current).padStart(2, '0')}{' '}
      <span className="text-white/40">/ {String(total).padStart(2, '0')}</span>
    </span>
  )
}
