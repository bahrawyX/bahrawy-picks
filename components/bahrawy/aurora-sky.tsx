'use client'

/**
 * <AuroraSky />
 *
 * A pinned scroll section that paints an aurora borealis across a
 * night sky. Three undulating SVG ribbons (green, violet, magenta by
 * default) sweep horizontally as you scroll — their `stroke-dashoffset`
 * draws them in left-to-right, while their hue and Y-position shift to
 * suggest the ribbons folding through the air. Behind them, hundreds
 * of stars twinkle on stable seeded positions; a few drift slowly. A
 * single tall headline + lines of body copy crossfade on the right
 * in step with the aurora.
 *
 * Heavy bits:
 *  - The ribbons are SVG `<path>` elements with cubic-bezier control
 *    points; each path has a unique drift cycle so they never overlay
 *    in lockstep.
 *  - Stars are placed by a stable seeded RNG so re-renders don't
 *    shuffle the field. ~180 of them, varying radius/opacity.
 *  - One scrubbed GSAP timeline draws the strokes via stroke-
 *    dashoffset, animates ribbon `translateY`, fades headlines.
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

export interface AuroraVerse {
  id: string
  /** Tiny tag above the line. */
  eyebrow?: React.ReactNode
  /** The headline for this verse. */
  title: React.ReactNode
  /** Optional sub-copy. */
  body?: React.ReactNode
}

export interface AuroraSkyCta {
  label: string
  href?: string
  onClick?: () => void
}

export interface AuroraSkyProps {
  /** Verses crossfaded on the right while the aurora paints. */
  verses: AuroraVerse[]
  /** Tiny tag above the whole section. */
  eyebrow?: React.ReactNode
  /** Optional CTA after the last verse. */
  cta?: AuroraSkyCta
  /** Pin length in viewport heights. Default 3.5. */
  scrollLength?: number
  /** Colors for the three ribbons (in paint order, back → front). */
  ribbonColors?: [string, string, string]
  className?: string
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function seedRandom(seed: number) {
  let s = seed >>> 0
  return () => {
    s = (s * 9301 + 49297) % 233280
    return s / 233280
  }
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function AuroraSky({
  verses,
  eyebrow,
  cta,
  scrollLength = 3.5,
  ribbonColors = ['#34D399', '#A78BFA', '#F472B6'],
  className,
}: AuroraSkyProps) {
  const sectionRef = React.useRef<HTMLDivElement>(null)
  const pinRef = React.useRef<HTMLDivElement>(null)
  const ribbonRefs = React.useRef<(SVGPathElement | null)[]>([])
  const ribbonWrapRefs = React.useRef<(SVGGElement | null)[]>([])
  const eyebrowRef = React.useRef<HTMLDivElement>(null)
  const verseRefs = React.useRef<(HTMLDivElement | null)[]>([])
  const ctaRef = React.useRef<HTMLDivElement>(null)

  // Stable star field — built once.
  const stars = React.useMemo(() => {
    const rand = seedRandom(1337)
    return Array.from({ length: 180 }).map(() => ({
      x: rand() * 100,
      y: rand() * 100,
      r: 0.5 + rand() * 1.4,
      o: 0.25 + rand() * 0.65,
      twinkle: 1.5 + rand() * 3,
      delay: -rand() * 4,
    }))
  }, [])

  // The three ribbon SVG paths. Each has a different baseline + curve.
  const RIBBONS = React.useMemo(
    () => [
      // Back ribbon — broad, low
      'M -5,60 C 18,40 32,70 50,55 S 78,30 105,50',
      // Mid ribbon — sweeping S
      'M -5,52 C 22,72 38,30 55,48 S 80,68 105,42',
      // Front ribbon — tighter wave near the top
      'M -5,40 C 20,20 38,55 52,38 S 80,18 105,30',
    ],
    [],
  )

  useGSAP(
    () => {
      if (!sectionRef.current || !pinRef.current) return

      // -- Initial ribbon dash setup ---------------------------------
      ribbonRefs.current.forEach((el) => {
        if (!el) return
        const len = el.getTotalLength?.() || 400
        el.style.strokeDasharray = String(len)
        el.style.strokeDashoffset = String(len)
        el.style.opacity = '0'
      })

      // -- Initial element states ------------------------------------
      if (eyebrowRef.current)
        gsap.set(eyebrowRef.current, { autoAlpha: 0, y: 10 })
      verseRefs.current.forEach((el, i) => {
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
          scrub: 0.45,
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

      // -- Ribbon paint-in -------------------------------------------
      // Stagger each ribbon's stroke-draw across the timeline.
      ribbonRefs.current.forEach((el, i) => {
        if (!el) return
        const start = i * 0.08
        tl.to(
          el,
          {
            opacity: 0.85,
            strokeDashoffset: 0,
            duration: 0.7,
            ease: 'power2.inOut',
          },
          start,
        )
      })

      // -- Ribbon drift — gentle Y wobble across the pin -------------
      ribbonWrapRefs.current.forEach((g, i) => {
        if (!g) return
        const amp = 3 + i * 1.2 // amplitude in SVG units
        tl.fromTo(
          g,
          { y: 0 },
          { y: amp, yoyo: true, repeat: 1, duration: 0.5, ease: 'sine.inOut' },
          0,
        )
      })

      // -- Verse crossfades ------------------------------------------
      const N = verses.length
      if (N > 1) {
        for (let i = 1; i < N; i++) {
          const at = (i + 0.3) / (N + 0.3)
          tl.to(
            verseRefs.current[i - 1],
            { autoAlpha: 0, y: -14, duration: 0.06, ease: 'power2.in' },
            at - 0.05,
          )
          tl.to(
            verseRefs.current[i],
            { autoAlpha: 1, y: 0, duration: 0.06, ease: 'power2.out' },
            at - 0.02,
          )
        }
      }

      if (ctaRef.current) {
        tl.to(
          ctaRef.current,
          { autoAlpha: 1, y: 0, duration: 0.06, ease: 'power2.out' },
          0.95,
        )
      }
    },
    {
      scope: sectionRef,
      dependencies: [verses, scrollLength, ribbonColors],
    },
  )

  return (
    <div
      ref={sectionRef}
      className={cn('relative w-full bg-[#03050a]', className)}
      style={{ height: `${(scrollLength + 1) * 100}vh` }}
    >
      <div ref={pinRef} className="relative h-screen w-full overflow-hidden">
        {/* Sky gradient backdrop */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'linear-gradient(180deg, #03050a 0%, #07101c 40%, #050810 100%), radial-gradient(70% 60% at 50% 30%, rgba(34, 211, 238, 0.06) 0%, transparent 70%)',
          }}
        />

        {/* Stars */}
        <svg
          className="pointer-events-none absolute inset-0 h-full w-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          aria-hidden
        >
          {stars.map((s, i) => (
            <circle
              key={i}
              cx={s.x}
              cy={s.y}
              r={s.r * 0.07} // viewBox units → small
              fill="#fff"
              opacity={s.o}
            >
              <animate
                attributeName="opacity"
                values={`${s.o};${s.o * 0.35};${s.o}`}
                dur={`${s.twinkle}s`}
                begin={`${s.delay}s`}
                repeatCount="indefinite"
              />
            </circle>
          ))}
        </svg>

        {/* Aurora ribbons */}
        <svg
          className="pointer-events-none absolute inset-0 h-full w-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          aria-hidden
        >
          <defs>
            {ribbonColors.map((color, i) => (
              <linearGradient
                key={i}
                id={`bahrawy-aurora-${i}`}
                x1="0"
                y1="0"
                x2="100%"
                y2="0"
              >
                <stop offset="0%" stopColor={color} stopOpacity="0" />
                <stop offset="50%" stopColor={color} stopOpacity="0.9" />
                <stop offset="100%" stopColor={color} stopOpacity="0" />
              </linearGradient>
            ))}
          </defs>
          {RIBBONS.map((d, i) => (
            <g
              key={i}
              ref={(el) => {
                ribbonWrapRefs.current[i] = el
              }}
              style={{ willChange: 'transform' }}
            >
              <path
                ref={(el) => {
                  ribbonRefs.current[i] = el
                }}
                d={d}
                fill="none"
                stroke={`url(#bahrawy-aurora-${i})`}
                strokeWidth={6 + i * 2}
                strokeLinecap="round"
                style={{
                  filter: `drop-shadow(0 0 4px ${ribbonColors[i]}) drop-shadow(0 0 14px ${ribbonColors[i]}aa)`,
                  willChange: 'stroke-dashoffset, opacity',
                  mixBlendMode: 'screen',
                }}
                vectorEffect="non-scaling-stroke"
              />
            </g>
          ))}
        </svg>

        {/* Faint horizon glow */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2"
          style={{
            background:
              'linear-gradient(to top, rgba(34, 211, 238, 0.07) 0%, transparent 70%)',
          }}
        />

        {/* Top eyebrow */}
        {eyebrow && (
          <div className="pointer-events-none absolute inset-x-0 top-0 z-10 flex justify-center px-6 pt-14 sm:pt-16">
            <div ref={eyebrowRef} className="pointer-events-auto">
              <div className="inline-flex items-center gap-2 whitespace-nowrap rounded-full border border-white/15 bg-white/[0.04] px-3 py-1 text-[11px] font-medium uppercase tracking-[0.22em] text-white/80 backdrop-blur">
                <span
                  aria-hidden
                  className="block h-1.5 w-1.5 rounded-full"
                  style={{ background: ribbonColors[0], boxShadow: `0 0 8px ${ribbonColors[0]}` }}
                />
                {eyebrow}
              </div>
            </div>
          </div>
        )}

        {/* Verse crossfade panel — centered on the lower half */}
        <div className="absolute inset-x-0 bottom-[12%] z-10 flex justify-center px-6 sm:bottom-[14%]">
          <div className="relative w-full max-w-2xl text-center">
            {verses.map((v, i) => (
              <div
                key={v.id}
                ref={(el) => {
                  verseRefs.current[i] = el
                }}
                className="absolute inset-0 flex flex-col items-center"
              >
                {v.eyebrow && (
                  <p className="mb-3 inline-flex items-center gap-2 whitespace-nowrap text-[10px] font-medium uppercase tracking-[0.32em] text-white/55">
                    <span
                      aria-hidden
                      className="block h-1 w-6 rounded-full"
                      style={{ background: ribbonColors[i % ribbonColors.length] }}
                    />
                    {v.eyebrow}
                  </p>
                )}
                <h2
                  className="text-balance text-3xl font-semibold leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl"
                  style={{
                    textShadow: `0 0 30px ${ribbonColors[i % ribbonColors.length]}55, 0 0 80px ${ribbonColors[i % ribbonColors.length]}33`,
                  }}
                >
                  {v.title}
                </h2>
                {v.body && (
                  <p className="mt-4 max-w-md text-pretty text-sm leading-relaxed text-white/65 sm:text-base">
                    {v.body}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        {cta && (
          <div className="pointer-events-none absolute inset-x-0 bottom-14 z-30 flex justify-center px-6">
            <div ref={ctaRef} className="pointer-events-auto">
              <a
                href={cta.href ?? '#'}
                onClick={cta.onClick}
                className="group inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-black transition-colors hover:bg-white/90"
                style={{
                  boxShadow: `0 0 26px ${ribbonColors[0]}40, 0 0 60px ${ribbonColors[0]}1f`,
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
          Scroll · let the lights paint
        </div>
      </div>
    </div>
  )
}
