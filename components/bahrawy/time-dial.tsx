'use client'

/**
 * <TimeDial />
 *
 * A pinned scroll section built around a giant rotating dial — picture
 * the back of a film camera, a museum exhibit selector, or a vintage
 * radio's tuning ring. N chapters live around the perimeter at evenly-
 * spaced angles. As the user scrolls, the dial rotates clockwise so
 * each chapter passes under a fixed pointer at the top, and the
 * content panel on the right crossfades to that chapter's story.
 *
 * Heavy bits:
 *  - The dial is one element rotated as a whole via GSAP `rotation`
 *    inside a scrubbed ScrollTrigger timeline. Markers around it are
 *    positioned with the classic three-transform radial layout trick
 *    (`rotate(θ) translate(0,-r) rotate(-θ)`) so labels stay upright
 *    in their resting state; the dial's own rotation animates on top.
 *  - Ticks and numbers live in SVG inside the same rotating wrapper,
 *    so everything is consistent at any rotation.
 *  - Chapter panels are absolutely stacked and crossfaded as the dial
 *    passes each step — no React state, all timeline-driven so the
 *    motion is locked to scroll.
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
  /** Short label rendered around the dial (e.g. "01", "2019"). */
  label: string
  /** Headline shown in the right-hand content panel. */
  title: React.ReactNode
  /** Sub-copy under the title. */
  body?: React.ReactNode
  /** Optional eyebrow / tiny tag above the title. */
  eyebrow?: React.ReactNode
  /** Optional image used as the panel backdrop. */
  image?: string
  /** Per-chapter accent color used for the active marker glow. */
  accent?: string
}

export interface TimeDialCta {
  label: string
  href?: string
  onClick?: () => void
}

export interface TimeDialProps {
  /** Chapters laid out around the dial. Order = traversal order. */
  chapters: TimeDialChapter[]
  /** Tiny tag above the whole section. */
  eyebrow?: React.ReactNode
  /** Optional CTA that arrives at the very end. */
  cta?: TimeDialCta
  /** Pin duration in viewport heights. Default 3.5. */
  scrollLength?: number
  /** Default accent color used for unmarked chapters + ring glow. */
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
  const dialRef = React.useRef<HTMLDivElement>(null)
  const eyebrowRef = React.useRef<HTMLDivElement>(null)
  const chapterRefs = React.useRef<(HTMLDivElement | null)[]>([])
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
      if (ctaRef.current) gsap.set(ctaRef.current, { autoAlpha: 0, y: 12 })

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

      // ---- Eyebrow lands early ------------------------------------------
      if (eyebrowRef.current) {
        tl.to(
          eyebrowRef.current,
          { autoAlpha: 1, y: 0, duration: 0.05, ease: 'power2.out' },
          0,
        )
      }

      // ---- Dial rotation ------------------------------------------------
      // Chapter `i` sits at angle `i * 360 / N` from the top. To bring
      // chapter `i` to the pointer we rotate the dial by `-i * 360/N`.
      // Total rotation across the timeline = -(N − 1) * 360 / N.
      const maxRotation = -((N - 1) * 360) / N
      tl.fromTo(
        dialRef.current,
        { rotation: 0 },
        {
          rotation: maxRotation,
          duration: 1,
          ease: 'power2.inOut',
        },
        0,
      )

      // ---- Chapter panel crossfades -------------------------------------
      // Each transition between chapter i and i+1 happens around scroll
      // progress `i / (N − 1)`, with a small overlap so the outgoing
      // panel finishes fading before the next finishes coming in.
      if (N > 1) {
        for (let i = 1; i < N; i++) {
          const transAt = i / (N - 1)
          const halfWindow = 0.05
          // Out (previous)
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
          // In (current)
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
        }
      }

      // ---- CTA arrives at the end ---------------------------------------
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
      <div
        ref={pinRef}
        className="relative h-screen w-full overflow-hidden"
      >
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
              <div
                className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-3 py-1 text-[11px] font-medium uppercase tracking-[0.22em] text-white/80 backdrop-blur"
              >
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

        {/* Layout: dial on the left, content panel on the right */}
        <div className="absolute inset-0 grid grid-cols-1 lg:grid-cols-2">
          {/* DIAL ---------------------------------------------------- */}
          <div className="relative flex items-center justify-center">
            <Dial
              chapters={chapters}
              accentColor={accentColor}
              dialRef={dialRef}
            />
          </div>

          {/* CONTENT PANELS ----------------------------------------- */}
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
                    <p
                      className="mb-4 inline-flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.32em] text-white/55"
                    >
                      <span
                        aria-hidden
                        className="block h-1 w-6 rounded-full"
                        style={{ background: accent }}
                      />
                      {c.eyebrow ?? `Chapter ${String(i + 1).padStart(2, '0')}`}
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

              {/* CTA below the content panel — sits at chapter level */}
              {cta && (
                <div
                  ref={ctaRef}
                  className="pointer-events-none absolute inset-x-0 bottom-[-120px] sm:bottom-[-100px]"
                >
                  <a
                    href={cta.href ?? '#'}
                    onClick={cta.onClick}
                    className="pointer-events-auto group inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-black transition-colors hover:bg-white/90"
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

        {/* Tiny scroll hint */}
        <div
          aria-hidden
          className="pointer-events-none absolute bottom-6 left-1/2 z-10 -translate-x-1/2 text-[10px] font-medium uppercase tracking-[0.32em] text-white/45"
        >
          Scroll to spin
        </div>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Dial — the rotating thing.
// ---------------------------------------------------------------------------

function Dial({
  chapters,
  accentColor,
  dialRef,
}: {
  chapters: TimeDialChapter[]
  accentColor: string
  dialRef: React.RefObject<HTMLDivElement | null>
}) {
  const N = chapters.length
  // Number of decorative ticks around the dial.
  const TICK_COUNT = 60

  return (
    <div
      className="relative"
      style={{ width: 'min(56vmin, 72vh)', height: 'min(56vmin, 72vh)' }}
    >
      {/* Static pointer at 12 o'clock — sits OUTSIDE the rotating dial */}
      <div
        aria-hidden
        className="absolute left-1/2 top-0 z-20 -translate-x-1/2 -translate-y-3"
      >
        <div
          className="h-4 w-3"
          style={{
            background: accentColor,
            clipPath: 'polygon(50% 100%, 0 0, 100% 0)',
            filter: `drop-shadow(0 0 8px ${accentColor})`,
          }}
        />
      </div>

      {/* Soft halo around the dial */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-[-10%] rounded-full"
        style={{
          background: `radial-gradient(circle, ${accentColor}1a 0%, transparent 70%)`,
          filter: 'blur(24px)',
        }}
      />

      {/* The rotating dial itself */}
      <div
        ref={dialRef}
        className="relative h-full w-full"
        style={{ willChange: 'transform', transformOrigin: '50% 50%' }}
      >
        {/* Outer ring */}
        <div
          className="absolute inset-0 rounded-full border"
          style={{
            borderColor: `${accentColor}55`,
            boxShadow: `inset 0 0 40px ${accentColor}1a, 0 0 28px ${accentColor}33`,
          }}
        />
        {/* Middle ring */}
        <div
          className="absolute inset-[8%] rounded-full border border-white/10"
        />
        {/* Inner disc */}
        <div
          className="absolute inset-[26%] rounded-full border border-white/[0.08]"
          style={{
            background:
              'radial-gradient(circle, rgba(255,255,255,0.025) 0%, transparent 70%)',
          }}
        />
        {/* Tiny center dot */}
        <div
          className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{ background: accentColor, boxShadow: `0 0 10px ${accentColor}` }}
        />

        {/* Tick marks via SVG — fits the rotation cleanly */}
        <svg
          className="pointer-events-none absolute inset-0"
          viewBox="-50 -50 100 100"
          aria-hidden
        >
          {Array.from({ length: TICK_COUNT }).map((_, i) => {
            const angle = (i / TICK_COUNT) * 360
            const isLong = i % (TICK_COUNT / N) === 0
            const isMid = i % (TICK_COUNT / 12) === 0
            return (
              <line
                key={i}
                x1="0"
                y1={isLong ? -46 : isMid ? -47 : -47.5}
                x2="0"
                y2={isLong ? -42 : isMid ? -45 : -46}
                stroke={isLong ? accentColor : 'rgba(255,255,255,0.35)'}
                strokeWidth={isLong ? 0.4 : 0.18}
                strokeLinecap="round"
                transform={`rotate(${angle})`}
              />
            )
          })}
        </svg>

        {/* Chapter markers — positioned around the perimeter with the
            classic triple-rotate trick so labels sit upright at rest. */}
        {chapters.map((c, i) => {
          const angle = (i * 360) / N
          const accent = c.accent ?? accentColor
          return (
            <div
              key={c.id}
              className="absolute left-1/2 top-1/2 select-none"
              style={{
                transform: `rotate(${angle}deg) translate(0, -36%) rotate(${-angle}deg)`,
                transformOrigin: 'center',
              }}
            >
              <div
                className="flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full border bg-black/55 text-center font-mono text-[11px] font-medium text-white backdrop-blur sm:h-14 sm:w-14 sm:text-xs"
                style={{
                  borderColor: `${accent}55`,
                  boxShadow: `0 0 16px ${accent}33`,
                }}
              >
                {c.label}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
