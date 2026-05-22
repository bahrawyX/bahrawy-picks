'use client'

/**
 * <TimeDial />
 *
 * A pinned scroll section built like a real analog clock. The clock
 * face is static — twelve Roman-numeral hour markers, sixty minute
 * ticks, two metal hands, and a polished bezel. Scrolling sweeps the
 * hands (hour hand steps through chapter positions, minute hand
 * spins many times for that stopwatch energy) and the centre flips
 * to a fresh chapter number with every step. The content panel on
 * the right crossfades to the matching story.
 *
 * Heavy bits:
 *  - Static clock face built in inline SVG: 60 tick marks (12 hour
 *    ticks pick up the accent color, the rest are thin white), four
 *    Roman numerals at the cardinal points (XII / III / VI / IX),
 *    plus a thin numeric ring at the 1/2/4/5/7/8/10/11 positions.
 *  - Two hands (`hour` + `minute`) rotated each frame via the GSAP
 *    timeline — hour hand sweeps `(N-1)*360/N°`, minute hand spins
 *    a much higher multiplier for that "stopwatch winding down" feel.
 *  - Centre number: a stack of digit chips, one per chapter, cross-
 *    faded by the same timeline so the visible digit is always the
 *    chapter the hour hand is currently pointing at.
 *  - Content panel crossfades on the right.
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

export interface TimeDialChapter {
  id: string
  /** Short label rendered next to the centre digit (e.g. "phase one"). */
  label?: string
  /** Headline shown in the right-hand content panel. */
  title: React.ReactNode
  /** Sub-copy under the title. */
  body?: React.ReactNode
  /** Optional eyebrow shown above the title. */
  eyebrow?: React.ReactNode
  /** Optional image used as a small backdrop in the panel. */
  image?: string
  /** Per-chapter accent color for the centre digit + hour hand glow. */
  accent?: string
}

export interface TimeDialCta {
  label: string
  href?: string
  onClick?: () => void
}

export interface TimeDialProps {
  chapters: TimeDialChapter[]
  /** Tiny tag above the whole section. */
  eyebrow?: React.ReactNode
  /** Optional CTA that arrives at the very end. */
  cta?: TimeDialCta
  /** Pin duration in viewport heights. Default 3.5. */
  scrollLength?: number
  /** Default accent color used for ring + hour hand + active digit. */
  accentColor?: string
  className?: string
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function TimeDial({
  chapters,
  eyebrow,
  cta,
  scrollLength = 3.5,
  accentColor = '#A78BFA',
  className,
}: TimeDialProps) {
  const sectionRef = React.useRef<HTMLDivElement>(null)
  const pinRef = React.useRef<HTMLDivElement>(null)
  const hourHandRef = React.useRef<HTMLDivElement>(null)
  const minuteHandRef = React.useRef<HTMLDivElement>(null)
  const eyebrowRef = React.useRef<HTMLDivElement>(null)
  const chapterRefs = React.useRef<(HTMLDivElement | null)[]>([])
  const digitRefs = React.useRef<(HTMLDivElement | null)[]>([])
  const ctaRef = React.useRef<HTMLDivElement>(null)

  const N = chapters.length

  useGSAP(
    () => {
      if (!sectionRef.current || !pinRef.current) return

      // ---- Initial states ------------------------------------------------
      if (eyebrowRef.current)
        gsap.set(eyebrowRef.current, { autoAlpha: 0, y: 10 })
      chapterRefs.current.forEach((el, i) => {
        if (!el) return
        gsap.set(el, { autoAlpha: i === 0 ? 1 : 0, y: i === 0 ? 0 : 14 })
      })
      digitRefs.current.forEach((el, i) => {
        if (!el) return
        gsap.set(el, { autoAlpha: i === 0 ? 1 : 0, scale: i === 0 ? 1 : 0.85 })
      })
      if (ctaRef.current) gsap.set(ctaRef.current, { autoAlpha: 0, y: 12 })
      if (hourHandRef.current)
        gsap.set(hourHandRef.current, { rotation: 0, transformOrigin: '50% 100%' })
      if (minuteHandRef.current)
        gsap.set(minuteHandRef.current, {
          rotation: 0,
          transformOrigin: '50% 100%',
        })

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

      // ---- Hands -------------------------------------------------------
      // Hour hand: sweeps through N evenly-spaced positions on the dial
      // from 12 o'clock (0°) to (N-1) × 360/N°.
      const hourMax = ((N - 1) * 360) / N
      if (hourHandRef.current) {
        tl.fromTo(
          hourHandRef.current,
          { rotation: 0 },
          {
            rotation: hourMax,
            duration: 1,
            ease: 'power2.inOut',
          },
          0,
        )
      }
      // Minute hand: a few full rotations during the same scroll —
      // gives that stopwatch / fast-forward feel.
      if (minuteHandRef.current) {
        tl.fromTo(
          minuteHandRef.current,
          { rotation: 0 },
          {
            rotation: hourMax * 12, // 12× hour-hand-speed, like real clocks
            duration: 1,
            ease: 'power2.inOut',
          },
          0,
        )
      }

      // ---- Chapter panel + centre-digit crossfades ---------------------
      if (N > 1) {
        for (let i = 1; i < N; i++) {
          const transAt = i / (N - 1)
          const halfWindow = 0.05
          // Out
          tl.to(
            chapterRefs.current[i - 1],
            {
              autoAlpha: 0,
              y: -14,
              duration: halfWindow,
              ease: 'power2.in',
            },
            Math.max(0, transAt - halfWindow),
          )
          tl.to(
            digitRefs.current[i - 1],
            {
              autoAlpha: 0,
              scale: 0.85,
              duration: halfWindow,
              ease: 'power2.in',
            },
            Math.max(0, transAt - halfWindow),
          )
          // In
          tl.to(
            chapterRefs.current[i],
            {
              autoAlpha: 1,
              y: 0,
              duration: halfWindow,
              ease: 'power2.out',
            },
            transAt - halfWindow * 0.3,
          )
          tl.to(
            digitRefs.current[i],
            {
              autoAlpha: 1,
              scale: 1,
              duration: halfWindow,
              ease: 'back.out(2)',
            },
            transAt - halfWindow * 0.3,
          )
        }
      }

      if (ctaRef.current) {
        tl.to(
          ctaRef.current,
          { autoAlpha: 1, y: 0, duration: 0.06, ease: 'power2.out' },
          0.92,
        )
      }
    },
    {
      scope: sectionRef,
      dependencies: [chapters, scrollLength, accentColor],
    },
  )

  return (
    <div
      ref={sectionRef}
      className={cn('relative w-full bg-[#07080b]', className)}
      style={{ height: `${(scrollLength + 1) * 100}vh` }}
    >
      <div ref={pinRef} className="relative h-screen w-full overflow-hidden">
        {/* Background mood */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background: `radial-gradient(60% 50% at 25% 50%, ${accentColor}1a 0%, transparent 60%), radial-gradient(120% 90% at 50% 100%, rgba(0,0,0,0.55) 0%, transparent 60%)`,
          }}
        />

        {/* Top eyebrow */}
        {eyebrow && (
          <div className="pointer-events-none absolute inset-x-0 top-0 z-10 flex justify-center px-6 pt-14 sm:pt-16">
            <div ref={eyebrowRef} className="pointer-events-auto">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-3 py-1 text-[11px] font-medium uppercase tracking-[0.22em] text-white/80 backdrop-blur">
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

        {/* Two-column layout — clock on the left, content on the right */}
        <div className="absolute inset-0 grid grid-cols-1 lg:grid-cols-2">
          {/* CLOCK ------------------------------------------------- */}
          <div className="relative flex items-center justify-center">
            <ClockFace
              chapters={chapters}
              accentColor={accentColor}
              hourHandRef={hourHandRef}
              minuteHandRef={minuteHandRef}
              digitRefs={digitRefs}
            />
          </div>

          {/* CONTENT PANELS --------------------------------------- */}
          <div className="relative flex items-center px-8 sm:px-12 lg:px-16">
            <div className="relative w-full">
              {chapters.map((c, i) => {
                const accent = c.accent ?? accentColor
                return (
                  <div
                    key={c.id}
                    ref={(el) => {
                      chapterRefs.current[i] = el
                    }}
                    className="absolute inset-0 flex flex-col items-start justify-center"
                  >
                    <p className="mb-4 inline-flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.32em] text-white/55">
                      <span
                        aria-hidden
                        className="block h-1 w-6 rounded-full"
                        style={{ background: accent }}
                      />
                      {c.eyebrow ?? c.label ?? `Chapter ${String(i + 1).padStart(2, '0')}`}
                    </p>
                    <h2
                      className="max-w-md text-balance text-3xl font-semibold leading-[1.05] tracking-tight text-white sm:text-4xl lg:text-5xl"
                      style={{ textShadow: `0 0 30px ${accent}33` }}
                    >
                      {c.title}
                    </h2>
                    {c.body && (
                      <p className="mt-4 max-w-sm text-pretty text-sm leading-relaxed text-white/65 sm:text-base">
                        {c.body}
                      </p>
                    )}
                    {c.image && (
                      <div className="relative mt-6 h-32 w-48 overflow-hidden rounded-lg border border-white/10 sm:h-40 sm:w-64">
                        <img
                          src={c.image}
                          alt=""
                          aria-hidden
                          className="absolute inset-0 h-full w-full object-cover"
                          draggable={false}
                        />
                      </div>
                    )}
                  </div>
                )
              })}

              {cta && (
                <div
                  ref={ctaRef}
                  className="pointer-events-none absolute inset-x-0 bottom-[-120px] sm:bottom-[-100px]"
                >
                  <a
                    href={cta.href ?? '#'}
                    onClick={cta.onClick}
                    className="group pointer-events-auto inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-black transition-colors hover:bg-white/90"
                    style={{
                      boxShadow: `0 0 26px ${accentColor}40, 0 0 60px ${accentColor}1f`,
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

        <div
          aria-hidden
          className="pointer-events-none absolute bottom-6 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap text-[10px] font-medium uppercase tracking-[0.32em] text-white/45"
        >
          Scroll · time advances
        </div>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// ClockFace — static analog clock with hands + chapter digit at the centre.
// ---------------------------------------------------------------------------

const ROMAN: Record<number, string> = {
  1: 'I',
  2: 'II',
  3: 'III',
  4: 'IV',
  5: 'V',
  6: 'VI',
  7: 'VII',
  8: 'VIII',
  9: 'IX',
  10: 'X',
  11: 'XI',
  12: 'XII',
}

function ClockFace({
  chapters,
  accentColor,
  hourHandRef,
  minuteHandRef,
  digitRefs,
}: {
  chapters: TimeDialChapter[]
  accentColor: string
  hourHandRef: React.RefObject<HTMLDivElement | null>
  minuteHandRef: React.RefObject<HTMLDivElement | null>
  digitRefs: React.MutableRefObject<(HTMLDivElement | null)[]>
}) {
  const TICK_COUNT = 60

  return (
    <div
      className="relative"
      style={{ width: 'min(56vmin, 72vh)', height: 'min(56vmin, 72vh)' }}
    >
      {/* Outer halo */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-[-10%] rounded-full"
        style={{
          background: `radial-gradient(circle, ${accentColor}1a 0%, transparent 70%)`,
          filter: 'blur(28px)',
        }}
      />

      {/* Brushed bezel — outer dark ring */}
      <div
        aria-hidden
        className="absolute inset-0 rounded-full"
        style={{
          background: `radial-gradient(circle at 30% 25%, rgba(255,255,255,0.07), transparent 55%), conic-gradient(from 0deg, rgba(255,255,255,0.05), rgba(255,255,255,0.16), rgba(255,255,255,0.04), rgba(255,255,255,0.14), rgba(255,255,255,0.05))`,
          boxShadow: `inset 0 0 1px ${accentColor}aa, 0 0 30px ${accentColor}33`,
        }}
      />

      {/* Inner face */}
      <div
        className="absolute inset-[5%] overflow-hidden rounded-full"
        style={{
          background:
            'radial-gradient(circle at 50% 35%, #14161e 0%, #07080b 75%)',
          boxShadow:
            'inset 0 1px 2px rgba(255,255,255,0.08), inset 0 -20px 40px rgba(0,0,0,0.6)',
        }}
      >
        {/* Tick marks via SVG */}
        <svg
          className="absolute inset-0 h-full w-full"
          viewBox="-50 -50 100 100"
          aria-hidden
        >
          {Array.from({ length: TICK_COUNT }).map((_, i) => {
            const angle = (i / TICK_COUNT) * 360
            const isHour = i % 5 === 0
            return (
              <line
                key={i}
                x1="0"
                y1={isHour ? -45 : -45}
                x2="0"
                y2={isHour ? -41 : -43.5}
                stroke={isHour ? accentColor : 'rgba(255,255,255,0.32)'}
                strokeWidth={isHour ? 0.55 : 0.22}
                strokeLinecap="round"
                transform={`rotate(${angle})`}
                opacity={isHour ? 0.85 : 1}
              />
            )
          })}
        </svg>

        {/* Hour markers — Roman numerals at 12 / 3 / 6 / 9 placed by
            classic polar math so they land at the perimeter and stay
            upright. radius = % of dial half-size; angle in degrees
            clockwise from 12 o'clock. */}
        {[12, 3, 6, 9].map((h) => {
          const theta = ((h % 12) * 30 * Math.PI) / 180
          const r = 38
          const x = 50 + r * Math.sin(theta)
          const y = 50 - r * Math.cos(theta)
          return (
            <div
              key={h}
              className="absolute select-none font-semibold text-white/85"
              style={{
                left: `${x}%`,
                top: `${y}%`,
                fontSize: 'min(3.2vmin, 4vh)',
                letterSpacing: '0.08em',
                transform: 'translate(-50%, -50%)',
              }}
            >
              {ROMAN[h]}
            </div>
          )
        })}

        {/* Slim numeric labels at the in-between hours */}
        {[1, 2, 4, 5, 7, 8, 10, 11].map((h) => {
          const theta = ((h % 12) * 30 * Math.PI) / 180
          const r = 36
          const x = 50 + r * Math.sin(theta)
          const y = 50 - r * Math.cos(theta)
          return (
            <div
              key={h}
              className="absolute select-none font-mono text-white/40"
              style={{
                left: `${x}%`,
                top: `${y}%`,
                fontSize: 'min(1.6vmin, 2vh)',
                transform: 'translate(-50%, -50%)',
              }}
            >
              {h}
            </div>
          )
        })}

        {/* Subtle glass reflection */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-full"
          style={{
            background:
              'radial-gradient(60% 40% at 30% 20%, rgba(255,255,255,0.07) 0%, transparent 60%)',
          }}
        />

        {/* Hour hand — short + thick */}
        <div
          ref={hourHandRef}
          className="absolute left-1/2 top-1/2 origin-bottom"
          style={{
            width: '4px',
            height: '28%',
            transform: 'translate(-50%, -100%)',
            transformOrigin: '50% 100%',
            willChange: 'transform',
            background: `linear-gradient(to top, ${accentColor}, ${accentColor}cc)`,
            borderRadius: '4px 4px 1px 1px',
            boxShadow: `0 0 12px ${accentColor}99`,
          }}
        />
        {/* Minute hand — long + thin */}
        <div
          ref={minuteHandRef}
          className="absolute left-1/2 top-1/2 origin-bottom"
          style={{
            width: '2.5px',
            height: '40%',
            transform: 'translate(-50%, -100%)',
            transformOrigin: '50% 100%',
            willChange: 'transform',
            background:
              'linear-gradient(to top, rgba(255,255,255,0.95), rgba(255,255,255,0.65))',
            borderRadius: '3px 3px 1px 1px',
            boxShadow: '0 0 6px rgba(255,255,255,0.5)',
          }}
        />

        {/* Centre axle */}
        <div
          aria-hidden
          className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            background: '#fff',
            boxShadow: `0 0 8px ${accentColor}, 0 0 0 2px ${accentColor}33`,
          }}
        />

        {/* Chapter digit — stacked, one per chapter, crossfaded by the
            timeline above. Sits just below centre so it doesn't fight
            the clock hands at 12 o'clock. */}
        <div
          aria-hidden
          className="absolute left-1/2 top-[68%] -translate-x-1/2 -translate-y-1/2"
        >
          <div className="relative h-16 w-16 sm:h-20 sm:w-20">
            {chapters.map((c, i) => {
              const accent = c.accent ?? accentColor
              return (
                <div
                  key={c.id}
                  ref={(el) => {
                    digitRefs.current[i] = el
                  }}
                  className="absolute inset-0 flex flex-col items-center justify-center rounded-full border bg-black/55 backdrop-blur"
                  style={{
                    borderColor: `${accent}66`,
                    boxShadow: `0 0 18px ${accent}55, inset 0 0 12px ${accent}1a`,
                  }}
                >
                  <span
                    className="font-mono text-lg font-semibold tabular-nums text-white sm:text-xl"
                    style={{ textShadow: `0 0 10px ${accent}` }}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span
                    className="text-[8px] font-medium uppercase tracking-[0.28em] text-white/55 sm:text-[9px]"
                  >
                    of {String(chapters.length).padStart(2, '0')}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
