'use client'

/**
 * <VinylPlayer />
 *
 * A pinned scroll section built around a turntable. As you scroll:
 *
 *  - The vinyl record spins continuously — many full rotations across
 *    the pin, so it feels like it's playing.
 *  - The tonearm rotates from its resting cradle on the right out
 *    over the record and steps through one position per track — each
 *    "drop" lands on a specific groove radius matching the track's
 *    spot on the record.
 *  - A waveform along the bottom highlights the active track and
 *    dims the rest.
 *  - A side panel shows the active track's title / artist / runtime
 *    with a clean crossfade between tracks.
 *
 * Everything is one scrubbed GSAP timeline so motion is locked to
 * scroll velocity — no auto-play.
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

export interface VinylTrack {
  id: string
  title: React.ReactNode
  artist?: React.ReactNode
  /** Optional runtime label e.g. "3:42". */
  runtime?: string
  /** Per-track accent color. */
  accent?: string
}

export interface VinylPlayerCta {
  label: string
  href?: string
  onClick?: () => void
}

export interface VinylPlayerProps {
  tracks: VinylTrack[]
  /** Tiny tag above the section. */
  eyebrow?: React.ReactNode
  /** Optional CTA at the end. */
  cta?: VinylPlayerCta
  /** Pin length in viewport heights. Default 3.5. */
  scrollLength?: number
  /** Total spins across the entire pin. Default 6. */
  spins?: number
  /** Accent color for the centre label + tonearm. */
  accentColor?: string
  className?: string
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function VinylPlayer({
  tracks,
  eyebrow,
  cta,
  scrollLength = 3.5,
  spins = 6,
  accentColor = '#F472B6',
  className,
}: VinylPlayerProps) {
  const sectionRef = React.useRef<HTMLDivElement>(null)
  const pinRef = React.useRef<HTMLDivElement>(null)
  const recordRef = React.useRef<HTMLDivElement>(null)
  const tonearmRef = React.useRef<HTMLDivElement>(null)
  const eyebrowRef = React.useRef<HTMLDivElement>(null)
  const trackRefs = React.useRef<(HTMLDivElement | null)[]>([])
  const barRefs = React.useRef<(HTMLDivElement | null)[]>([])
  const ctaRef = React.useRef<HTMLDivElement>(null)

  const N = tracks.length

  useGSAP(
    () => {
      if (!sectionRef.current || !pinRef.current) return

      // -- Initial states -----------------------------------------------
      if (eyebrowRef.current)
        gsap.set(eyebrowRef.current, { autoAlpha: 0, y: 10 })
      trackRefs.current.forEach((el, i) => {
        if (!el) return
        gsap.set(el, { autoAlpha: i === 0 ? 1 : 0, x: i === 0 ? 0 : 10 })
      })
      if (ctaRef.current) gsap.set(ctaRef.current, { autoAlpha: 0, y: 12 })
      if (recordRef.current)
        gsap.set(recordRef.current, { rotation: 0, transformOrigin: '50% 50%' })
      if (tonearmRef.current)
        gsap.set(tonearmRef.current, {
          rotation: 18, // rest position (off the record)
          transformOrigin: '85% 15%',
        })
      barRefs.current.forEach((el) => {
        if (el) gsap.set(el, { scaleY: 0.3, opacity: 0.4 })
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

      // -- Record spins -------------------------------------------------
      if (recordRef.current) {
        tl.fromTo(
          recordRef.current,
          { rotation: 0 },
          {
            rotation: spins * 360,
            duration: 1,
            ease: 'none',
          },
          0,
        )
      }

      // -- Tonearm walk -------------------------------------------------
      // The tonearm rotates from its resting cradle into a track on the
      // record. Per-track target angles are evenly spaced between
      // "outer groove" and "label edge".
      // - rest:     +18°  (off the side)
      // - track 1:  -8°   (outermost)
      // - track N:  +6°   (closest to label)
      const restAngle = 18
      const outermost = -8
      const innermost = 6
      tl.to(
        tonearmRef.current,
        {
          rotation: outermost,
          duration: 0.06,
          ease: 'power2.out',
        },
        0,
      )
      for (let i = 1; i < N; i++) {
        const transAt = i / (N - 1)
        const targetAngle =
          outermost + ((innermost - outermost) * i) / (N - 1)
        tl.to(
          tonearmRef.current,
          {
            rotation: targetAngle,
            duration: 0.05,
            ease: 'power3.inOut',
          },
          transAt - 0.04,
        )
      }
      // After last track, lift back up to cradle
      tl.to(
        tonearmRef.current,
        {
          rotation: restAngle,
          duration: 0.05,
          ease: 'power2.in',
        },
        0.97,
      )
      // Suppress unused-variable warning while keeping the constant near the math
      void restAngle

      // -- Track panels crossfade --------------------------------------
      if (N > 1) {
        for (let i = 1; i < N; i++) {
          const transAt = i / (N - 1)
          tl.to(
            trackRefs.current[i - 1],
            { autoAlpha: 0, x: -10, duration: 0.04, ease: 'power2.in' },
            transAt - 0.05,
          )
          tl.to(
            trackRefs.current[i],
            { autoAlpha: 1, x: 0, duration: 0.05, ease: 'power2.out' },
            transAt - 0.02,
          )
        }
      }

      // -- Waveform — bars in the active track segment scale up -------
      // Each track has a band of N bars (we render BARS_PER_TRACK each).
      // We boost bars whose index falls inside the active track's band.
      barRefs.current.forEach((el, i) => {
        if (!el) return
        const trackIdx = Math.floor((i / barRefs.current.length) * N)
        const active = trackIdx / Math.max(1, N - 1)
        tl.to(
          el,
          {
            scaleY: 0.4 + Math.random() * 1.2,
            opacity: 1,
            duration: 0.04,
            ease: 'power2.out',
          },
          Math.max(0, active - 0.04),
        )
        tl.to(
          el,
          {
            scaleY: 0.3,
            opacity: 0.4,
            duration: 0.06,
            ease: 'power2.in',
          },
          active + 0.08,
        )
      })

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
      dependencies: [tracks, scrollLength, spins, accentColor],
    },
  )

  // 56 waveform bars
  const BARS = 56

  return (
    <div
      ref={sectionRef}
      className={cn('relative w-full bg-[#0a0810]', className)}
      style={{ height: `${(scrollLength + 1) * 100}vh` }}
    >
      <div ref={pinRef} className="relative h-screen w-full overflow-hidden">
        {/* Background — warm record-shop tint */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background: `radial-gradient(60% 50% at 30% 50%, ${accentColor}1c 0%, transparent 60%), radial-gradient(120% 90% at 50% 100%, rgba(0,0,0,0.6) 0%, transparent 60%)`,
          }}
        />

        {/* Eyebrow */}
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

        {/* Two columns — turntable on the left, info on the right */}
        <div className="absolute inset-0 grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr]">
          {/* TURNTABLE ----------------------------------------- */}
          <div className="relative flex items-center justify-center">
            <Turntable
              recordRef={recordRef}
              tonearmRef={tonearmRef}
              accentColor={accentColor}
            />
          </div>

          {/* INFO PANEL --------------------------------------- */}
          <div className="relative flex items-center px-8 sm:px-12 lg:px-14">
            <div className="relative w-full">
              {/* Fixed-height stack — track panels overlay each other inside. */}
              <div className="relative min-h-[260px] sm:min-h-[300px]">
                {tracks.map((t, i) => {
                  const accent = t.accent ?? accentColor
                  return (
                    <div
                      key={t.id}
                      ref={(el) => {
                        trackRefs.current[i] = el
                      }}
                      className="absolute inset-0 flex flex-col items-start justify-center"
                    >
                      <p className="mb-3 inline-flex items-center gap-2 whitespace-nowrap text-[10px] font-medium uppercase tracking-[0.32em] text-white/55">
                        <span
                          aria-hidden
                          className="block h-1 w-6 rounded-full"
                          style={{ background: accent }}
                        />
                        Track {String(i + 1).padStart(2, '0')}
                        <span className="text-white/30">/</span>
                        {String(tracks.length).padStart(2, '0')}
                      </p>
                      <h2
                        className="max-w-md text-balance text-3xl font-semibold leading-[1.05] tracking-tight text-white sm:text-4xl lg:text-5xl"
                        style={{ textShadow: `0 0 30px ${accent}33` }}
                      >
                        {t.title}
                      </h2>
                      {t.artist && (
                        <p className="mt-3 text-sm font-medium uppercase tracking-[0.18em] text-white/65">
                          {t.artist}
                        </p>
                      )}
                      {t.runtime && (
                        <p className="mt-2 font-mono text-xs tabular-nums text-white/45">
                          {t.runtime}
                        </p>
                      )}
                    </div>
                  )
                })}
              </div>

              {/* CTA sits in natural flow below the track stack — no glow
                  bleeding behind the runtime text any more. */}
              {cta && (
                <div ref={ctaRef} className="mt-10">
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
              )}
            </div>
          </div>
        </div>

        {/* Waveform along the bottom */}
        <div className="pointer-events-none absolute inset-x-0 bottom-12 z-10 flex h-16 items-end justify-center gap-[3px] px-12">
          {Array.from({ length: BARS }).map((_, i) => (
            <div
              key={i}
              ref={(el) => {
                barRefs.current[i] = el
              }}
              className="origin-bottom rounded-sm"
              style={{
                width: '3px',
                height: '100%',
                background: `linear-gradient(to top, ${accentColor}, ${accentColor}55)`,
                willChange: 'transform, opacity',
              }}
            />
          ))}
        </div>

        <div
          aria-hidden
          className="pointer-events-none absolute bottom-3 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap text-[10px] font-medium uppercase tracking-[0.32em] text-white/45"
        >
          Scroll · drop the needle
        </div>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Turntable — circular deck + spinning record + tonearm
// ---------------------------------------------------------------------------

function Turntable({
  recordRef,
  tonearmRef,
  accentColor,
}: {
  recordRef: React.RefObject<HTMLDivElement | null>
  tonearmRef: React.RefObject<HTMLDivElement | null>
  accentColor: string
}) {
  return (
    <div className="relative" style={{ width: 'min(58vmin, 72vh)', height: 'min(58vmin, 72vh)' }}>
      {/* Deck plate — dark wooden tone */}
      <div
        className="absolute inset-0 rounded-[16%]"
        style={{
          background:
            'radial-gradient(circle at 30% 25%, #1a1622 0%, #0a0810 70%), linear-gradient(135deg, #1c1827 0%, #0a0810 100%)',
          boxShadow:
            '0 30px 80px -20px rgba(0,0,0,0.7), inset 0 0 0 1px rgba(255,255,255,0.04)',
        }}
      />

      {/* Platter — slightly raised */}
      <div className="absolute inset-[6%] rounded-full"
        style={{
          background: 'radial-gradient(circle at 50% 50%, #1a1620 0%, #0a0810 80%)',
          boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.04), inset 0 0 40px rgba(0,0,0,0.6)',
        }}
      />

      {/* Vinyl record */}
      <div
        ref={recordRef}
        className="absolute inset-[8%] rounded-full"
        style={{
          willChange: 'transform',
          // Concentric "grooves" — many fine rings
          background: `
            repeating-radial-gradient(circle at 50% 50%,
              #050505 0px,
              #0c0c0c 0.7px,
              #050505 1.4px,
              #050505 3px),
            radial-gradient(circle at 50% 50%, #0a0a0a 0%, #050505 100%)
          `,
          boxShadow:
            '0 12px 32px -8px rgba(0,0,0,0.7), inset 0 0 0 1px rgba(255,255,255,0.05)',
        }}
      >
        {/* Light catch — single bright streak that "moves" with rotation */}
        <div
          aria-hidden
          className="absolute inset-0 rounded-full"
          style={{
            background:
              'conic-gradient(from 0deg, transparent 0deg, rgba(255,255,255,0.08) 30deg, transparent 60deg, transparent 180deg, rgba(255,255,255,0.04) 200deg, transparent 220deg)',
            mixBlendMode: 'screen',
          }}
        />

        {/* Centre label */}
        <div
          className="absolute left-1/2 top-1/2 flex h-[28%] w-[28%] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full text-center"
          style={{
            background: `radial-gradient(circle at 30% 30%, ${accentColor} 0%, ${accentColor}aa 70%, ${accentColor}88 100%)`,
            boxShadow: `inset 0 0 0 2px rgba(0,0,0,0.2), inset 0 0 20px ${accentColor}aa`,
          }}
        >
          <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-white/90 sm:text-xs">
            33⅓ RPM
          </span>
        </div>

        {/* Centre spindle hole */}
        <div
          aria-hidden
          className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-black"
        />
      </div>

      {/* Tonearm — anchored top-right */}
      <div
        ref={tonearmRef}
        className="absolute"
        style={{
          // Position the pivot at the top-right of the deck
          left: '70%',
          top: '12%',
          width: '60%',
          height: '8%',
          transformOrigin: '85% 50%',
          willChange: 'transform',
        }}
      >
        {/* Pivot housing */}
        <div
          className="absolute right-0 top-1/2 h-8 w-8 -translate-y-1/2 rounded-full"
          style={{
            background: 'radial-gradient(circle, #2a2630 0%, #14101a 80%)',
            boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.1), 0 4px 10px rgba(0,0,0,0.6)',
          }}
        />
        {/* Arm */}
        <div
          className="absolute right-3 top-1/2 h-[3px] w-[88%] -translate-y-1/2 rounded-full"
          style={{
            background:
              'linear-gradient(to right, rgba(255,255,255,0.55), rgba(255,255,255,0.85))',
            boxShadow: '0 2px 4px rgba(0,0,0,0.4)',
          }}
        />
        {/* Headshell */}
        <div
          className="absolute left-0 top-1/2 h-5 w-7 -translate-y-1/2 rounded-sm"
          style={{
            background: 'linear-gradient(135deg, #2a2630 0%, #14101a 100%)',
            boxShadow:
              'inset 0 0 0 1px rgba(255,255,255,0.1), 0 4px 10px rgba(0,0,0,0.6)',
          }}
        >
          {/* Cartridge tip */}
          <div
            className="absolute left-0 top-1/2 h-1 w-1 -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{
              background: accentColor,
              boxShadow: `0 0 8px ${accentColor}`,
            }}
          />
        </div>
      </div>
    </div>
  )
}
