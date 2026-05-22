'use client'

/**
 * <CometTrail />
 *
 * A pinned scroll section that flies a bright comet across a starfield
 * along a hand-drawn SVG path. As you scroll, the comet moves with the
 * scroll position (CSS `offset-path` on the comet head), the path
 * paints in behind it (animated `stroke-dashoffset`), and "waypoint"
 * stars along the trajectory light up in sequence — each waypoint
 * shows a piece of content next to itself.
 *
 * Heavy bits:
 *  - The path is built in a normalised 100×60 viewBox and the comet
 *    head rides it via `offset-path: path('M…')` + an `offset-distance`
 *    tween from 0% → 100%.
 *  - A second `<path>` with the same `d` paints behind it, animated
 *    by `stroke-dashoffset` so the trail draws progressively.
 *  - Waypoints are SVG groups positioned at fixed x/y on the path;
 *    each "lights up" via opacity + scale tweens at its scroll
 *    progress slot, with an HTML content card rendered next to it
 *    (positioned by the same coordinates as percentages of the
 *    canvas).
 *  - Twinkling stars in the background are stable-seeded.
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

export interface CometWaypoint {
  id: string
  /** Position along the path, 0–1 (0 = start, 1 = end). */
  at: number
  /** Where the waypoint dot sits in the canvas, percentages 0–100. */
  x: number
  y: number
  eyebrow?: React.ReactNode
  title: React.ReactNode
  body?: React.ReactNode
  /** Per-waypoint glow color. */
  accent?: string
}

export interface CometTrailCta {
  label: string
  href?: string
  onClick?: () => void
}

export interface CometTrailProps {
  /** Waypoints along the comet's path. Order = along the path. */
  waypoints: CometWaypoint[]
  /** Tiny tag above the whole section. */
  eyebrow?: React.ReactNode
  /** Optional CTA after the comet exits. */
  cta?: CometTrailCta
  /** Pin length in viewport heights. Default 3.8. */
  scrollLength?: number
  /** Trail color. Default '#22D3EE'. */
  accentColor?: string
  /**
   * The comet's SVG path `d` attribute in the canvas's 100×60 space.
   * The default sweeps from bottom-left up, across, and out the
   * upper-right with two soft S-curves.
   */
  pathD?: string
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

const DEFAULT_PATH =
  'M -5,55 C 18,58 22,30 38,28 S 60,52 70,30 S 92,8 105,12'

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function CometTrail({
  waypoints,
  eyebrow,
  cta,
  scrollLength = 3.8,
  accentColor = '#22D3EE',
  pathD = DEFAULT_PATH,
  className,
}: CometTrailProps) {
  const sectionRef = React.useRef<HTMLDivElement>(null)
  const pinRef = React.useRef<HTMLDivElement>(null)
  const trailRef = React.useRef<SVGPathElement>(null)
  const cometRef = React.useRef<HTMLDivElement>(null)
  const eyebrowRef = React.useRef<HTMLDivElement>(null)
  const waypointDotRefs = React.useRef<(SVGCircleElement | null)[]>([])
  const waypointCardRefs = React.useRef<(HTMLDivElement | null)[]>([])
  const ctaRef = React.useRef<HTMLDivElement>(null)

  // Stable starfield.
  const stars = React.useMemo(() => {
    const rand = seedRandom(42)
    return Array.from({ length: 220 }).map(() => ({
      x: rand() * 100,
      y: rand() * 100,
      r: 0.4 + rand() * 1.4,
      o: 0.2 + rand() * 0.7,
      twinkle: 1.5 + rand() * 3,
      delay: -rand() * 4,
    }))
  }, [])

  useGSAP(
    () => {
      if (!sectionRef.current || !pinRef.current) return

      // -- Initial states --------------------------------------------
      if (eyebrowRef.current)
        gsap.set(eyebrowRef.current, { autoAlpha: 0, y: 10 })
      if (ctaRef.current) gsap.set(ctaRef.current, { autoAlpha: 0, y: 12 })

      // Trail path: draw from end → start (offset = full length to 0).
      if (trailRef.current) {
        const len = trailRef.current.getTotalLength?.() || 200
        trailRef.current.style.strokeDasharray = String(len)
        trailRef.current.style.strokeDashoffset = String(len)
        trailRef.current.style.opacity = '0'
      }

      // Comet starts off-screen on the path (offset-distance 0%).
      if (cometRef.current) {
        cometRef.current.style.offsetPath = `path('${pathD}')`
        cometRef.current.style.offsetDistance = '0%'
        cometRef.current.style.offsetRotate = 'auto'
        gsap.set(cometRef.current, { autoAlpha: 0, scale: 0.6 })
      }

      // Waypoints — dots dim + small; cards hidden.
      waypointDotRefs.current.forEach((el) => {
        if (el) gsap.set(el, { opacity: 0.25, scale: 0.6, transformOrigin: 'center' })
      })
      waypointCardRefs.current.forEach((el) => {
        if (el) gsap.set(el, { autoAlpha: 0, y: 8 })
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

      // -- Comet appears, then rides the path ------------------------
      if (cometRef.current) {
        tl.to(
          cometRef.current,
          { autoAlpha: 1, scale: 1, duration: 0.06, ease: 'back.out(1.8)' },
          0,
        )
        // GSAP can't tween CSS `offset-distance` directly via shorthand
        // — but we can write it via an `onUpdate` from a numeric proxy.
        const cometProgress = { d: 0 }
        tl.to(
          cometProgress,
          {
            d: 100,
            duration: 0.95,
            ease: 'power1.inOut',
            onUpdate: () => {
              if (cometRef.current) {
                cometRef.current.style.offsetDistance = `${cometProgress.d}%`
              }
            },
          },
          0.02,
        )
        // Fade comet out at the end as it exits the canvas.
        tl.to(
          cometRef.current,
          { autoAlpha: 0, duration: 0.05, ease: 'power2.in' },
          0.96,
        )
      }

      // -- Trail draws in lock-step with the comet -------------------
      if (trailRef.current) {
        tl.to(
          trailRef.current,
          {
            opacity: 0.85,
            strokeDashoffset: 0,
            duration: 0.95,
            ease: 'power1.inOut',
          },
          0.02,
        )
      }

      // -- Waypoints light up + cards fade in -----------------------
      waypoints.forEach((w, i) => {
        const at = Math.max(0, Math.min(1, w.at))
        const dot = waypointDotRefs.current[i]
        const card = waypointCardRefs.current[i]
        if (dot) {
          tl.to(
            dot,
            {
              opacity: 1,
              scale: 1.4,
              duration: 0.05,
              ease: 'back.out(2)',
            },
            at - 0.02,
          )
          tl.to(
            dot,
            { scale: 1, duration: 0.05, ease: 'power2.out' },
            at + 0.04,
          )
        }
        if (card) {
          tl.to(
            card,
            { autoAlpha: 1, y: 0, duration: 0.05, ease: 'power2.out' },
            at - 0.01,
          )
        }
      })

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
      dependencies: [waypoints, scrollLength, accentColor, pathD],
    },
  )

  return (
    <div
      ref={sectionRef}
      className={cn('relative w-full bg-[#020310]', className)}
      style={{ height: `${(scrollLength + 1) * 100}vh` }}
    >
      <div ref={pinRef} className="relative h-screen w-full overflow-hidden">
        {/* Deep-space gradient */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(60% 50% at 30% 30%, rgba(34, 211, 238, 0.10) 0%, transparent 60%), radial-gradient(70% 60% at 70% 80%, rgba(167, 139, 250, 0.08) 0%, transparent 70%), #020310',
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
              r={s.r * 0.07}
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

        {/* Eyebrow */}
        {eyebrow && (
          <div className="pointer-events-none absolute inset-x-0 top-0 z-20 flex justify-center px-6 pt-14 sm:pt-16">
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

        {/* The path + waypoint dots */}
        <svg
          className="pointer-events-none absolute inset-0 h-full w-full"
          viewBox="0 0 100 60"
          preserveAspectRatio="none"
          aria-hidden
        >
          <defs>
            <linearGradient id="bahrawy-comet-trail-grad" x1="0" y1="0" x2="100%" y2="0">
              <stop offset="0%" stopColor={accentColor} stopOpacity="0" />
              <stop offset="40%" stopColor={accentColor} stopOpacity="0.9" />
              <stop offset="100%" stopColor={accentColor} stopOpacity="0.85" />
            </linearGradient>
          </defs>

          {/* The trail path */}
          <path
            ref={trailRef}
            d={pathD}
            fill="none"
            stroke="url(#bahrawy-comet-trail-grad)"
            strokeWidth="0.6"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
            style={{
              filter: `drop-shadow(0 0 4px ${accentColor}) drop-shadow(0 0 12px ${accentColor}88)`,
              mixBlendMode: 'screen',
              willChange: 'stroke-dashoffset, opacity',
            }}
          />

          {/* Waypoint dots */}
          {waypoints.map((w, i) => {
            const a = w.accent ?? accentColor
            // Position the dot in 100×60 space; user-provided x/y are
            // percentages of the canvas, so x maps to 0–100, y to 0–60.
            const cx = (w.x / 100) * 100
            const cy = (w.y / 100) * 60
            return (
              <g key={w.id}>
                {/* Soft outer halo */}
                <circle
                  cx={cx}
                  cy={cy}
                  r={1.6}
                  fill={a}
                  opacity={0.25}
                  style={{ filter: `drop-shadow(0 0 6px ${a})` }}
                />
                <circle
                  ref={(el) => {
                    waypointDotRefs.current[i] = el
                  }}
                  cx={cx}
                  cy={cy}
                  r={0.5}
                  fill="#fff"
                  style={{
                    filter: `drop-shadow(0 0 6px ${a}) drop-shadow(0 0 12px ${a}aa)`,
                    willChange: 'transform, opacity',
                  }}
                />
              </g>
            )
          })}
        </svg>

        {/* Waypoint content cards — HTML positioned via percentages */}
        {waypoints.map((w, i) => {
          const a = w.accent ?? accentColor
          // Offset the card so it doesn't sit on top of the dot. If the
          // dot is on the right half of the canvas, the card sits to
          // its LEFT; otherwise it sits to its RIGHT. Similarly for Y.
          const onRight = w.x > 50
          const onBottom = w.y > 50
          return (
            <div
              key={w.id}
              ref={(el) => {
                waypointCardRefs.current[i] = el
              }}
              className={cn(
                'pointer-events-none absolute z-10 w-[240px] max-w-[40vw] sm:w-[260px]',
              )}
              style={{
                left: `${w.x}%`,
                top: `${(w.y / 100) * 100 * 0.6 + 20}%`,
                transform: `translate(${onRight ? '-110%' : '10%'}, ${onBottom ? '-110%' : '20%'})`,
              }}
            >
              <div
                className="rounded-xl border bg-black/55 p-4 text-left backdrop-blur"
                style={{
                  borderColor: `${a}55`,
                  boxShadow: `0 0 22px ${a}33`,
                }}
              >
                {w.eyebrow && (
                  <p className="mb-1.5 inline-flex items-center gap-1.5 whitespace-nowrap text-[10px] font-medium uppercase tracking-[0.28em] text-white/65">
                    <span
                      aria-hidden
                      className="block h-1 w-4 rounded-full"
                      style={{ background: a }}
                    />
                    {w.eyebrow}
                  </p>
                )}
                <h3
                  className="text-balance text-base font-semibold leading-snug tracking-tight text-white sm:text-lg"
                  style={{ textShadow: `0 0 14px ${a}66` }}
                >
                  {w.title}
                </h3>
                {w.body && (
                  <p className="mt-1 text-pretty text-xs leading-relaxed text-white/70 sm:text-sm">
                    {w.body}
                  </p>
                )}
              </div>
            </div>
          )
        })}

        {/* The comet — rides the offset-path */}
        <div
          ref={cometRef}
          className="pointer-events-none absolute"
          style={{
            // The path is in a 100×60 viewBox stretched to full canvas
            // via `preserveAspectRatio="none"` — the offset-path math
            // uses the COMET's own containing block. We position the
            // comet relative to the viewport so its journey maps to the
            // full pin area.
            top: 0,
            left: 0,
            width: '100%',
            height: '60%', // matches the 60 of the 100x60 viewBox
            willChange: 'offset-distance',
            // offsetPath is applied imperatively via the ref so we can
            // use a runtime-built `path(...)` string.
          }}
        >
          {/* Comet head + immediate tail */}
          <div
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{ left: 0, top: 0 }}
          >
            <div
              className="h-2.5 w-2.5 rounded-full"
              style={{
                background: '#fff',
                boxShadow: `0 0 6px #fff, 0 0 14px ${accentColor}, 0 0 28px ${accentColor}aa, 0 0 60px ${accentColor}66`,
              }}
            />
            {/* Tail — a small streak behind the head */}
            <div
              aria-hidden
              className="absolute right-2 top-1/2 h-[2px] w-16 -translate-y-1/2"
              style={{
                background: `linear-gradient(to left, ${accentColor}cc, transparent)`,
                filter: `blur(0.5px) drop-shadow(0 0 6px ${accentColor})`,
                transformOrigin: 'right center',
              }}
            />
          </div>
        </div>

        {/* CTA */}
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
          Scroll · let it fly
        </div>
      </div>
    </div>
  )
}
