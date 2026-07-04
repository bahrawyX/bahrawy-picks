'use client'

/**
 * <CinemaReel />
 *
 * A pinned scroll section that unspools a horizontal film strip from
 * scroll. As the user scrolls vertically, the strip translates left
 * frame-by-frame, two reel hubs (one on each side of the viewport)
 * spin in opposite directions, and a center "playhead" indicator
 * highlights whichever frame is currently centered. Sprocket holes
 * line the top and bottom of the strip; the centered frame pops
 * forward + brightens, neighbours dim.
 *
 * Everything is driven by ONE scrubbed GSAP timeline plus a RAF loop
 * that reconciles per-frame brightness/scale against the current
 * scroll progress. No imperative state, no React re-renders during
 * scroll — just transform writes.
 */

import * as React from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowUpRight, Disc3 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { usePrefersReducedMotion } from '@/lib/use-prefers-reduced-motion'
import { useOnScreen } from '@/lib/use-on-screen'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface CinemaReelFrame {
  id: string
  /** Image fill for the frame. */
  image?: string
  /** Tiny tag rendered on the frame. */
  eyebrow?: string
  /** Headline rendered on the frame. */
  title: React.ReactNode
  /** Sub-copy under the title (kept short — frames are narrow). */
  body?: React.ReactNode
  /** Per-frame accent color used for the centered glow + label dot. */
  accent?: string
}

export interface CinemaReelCta {
  label: string
  href?: string
  onClick?: () => void
}

export interface CinemaReelProps {
  /** Frames laid out along the strip, left to right. */
  frames: CinemaReelFrame[]
  /** Tiny tag rendered above the strip. */
  eyebrow?: React.ReactNode
  /** Optional CTA that fades in after the last frame lands. */
  cta?: CinemaReelCta
  /** Pin duration in viewport heights. Default 4. */
  scrollLength?: number
  /** Width of each frame in vh units. Default 50. */
  frameWidth?: number
  /** Accent color used for sprocket glow + center playhead. */
  accentColor?: string
  className?: string
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function CinemaReel({
  frames,
  eyebrow,
  cta,
  scrollLength = 4,
  frameWidth = 50,
  accentColor = '#FBBF24',
  className,
}: CinemaReelProps) {
  const sectionRef = React.useRef<HTMLDivElement>(null)
  const pinRef = React.useRef<HTMLDivElement>(null)
  const stripRef = React.useRef<HTMLDivElement>(null)
  const sprocketTopRef = React.useRef<HTMLDivElement>(null)
  const sprocketBottomRef = React.useRef<HTMLDivElement>(null)
  const leftReelRef = React.useRef<HTMLDivElement>(null)
  const rightReelRef = React.useRef<HTMLDivElement>(null)
  const eyebrowRef = React.useRef<HTMLDivElement>(null)
  const ctaRef = React.useRef<HTMLDivElement>(null)
  const frameRefs = React.useRef<(HTMLDivElement | null)[]>([])

  // Mutable progress read inside the RAF loop.
  const progressRef = React.useRef(0)

  const N = frames.length
  const reduced = usePrefersReducedMotion()
  const onScreen = useOnScreen(sectionRef)
  // Refs let the offscreen gate start/stop the RAF loop without re-running
  // the GSAP setup (which would rebuild the pin + timeline).
  const onScreenRef = React.useRef(onScreen)
  const loopRef = React.useRef<{ start: () => void; stop: () => void } | null>(
    null,
  )

  useGSAP(
    () => {
      if (!sectionRef.current || !pinRef.current || !stripRef.current) return

      // ---- Initial states ------------------------------------------------
      if (eyebrowRef.current)
        gsap.set(eyebrowRef.current, { autoAlpha: 0, y: 10 })
      if (ctaRef.current) gsap.set(ctaRef.current, { autoAlpha: 0, y: 12 })

      // ---- The strip travel ---------------------------------------------
      // The strip starts with frame 0 centered (translateX = (viewport/2 −
      // frameW/2)) and ends with frame (N − 1) centered. Translate by
      // -(N − 1) × frameW.
      // We compute pixel translations in the RAF loop so resizes are
      // handled cleanly; here we just animate `progressRef.current` via
      // the timeline and apply transforms each frame.

      // ---- Reconciler -----------------------------------------------------
      // Reads `progressRef.current` and writes:
      //   - strip translateX
      //   - sprocket strip translateX (in sync with main strip)
      //   - per-frame scale + brightness + opacity based on distance from
      //     the centered "playhead" position
      //   - reel hub rotation (proportional to progress)
      // Runs as a RAF loop while the section is on screen; with reduced
      // motion it is invoked directly from scroll updates instead
      // (positions are set without a running animation loop, and the
      // decorative reel spin / frame scale are skipped).

      // Cached pin width — measured once here and again on ScrollTrigger
      // refresh (which also covers resizes) instead of per frame.
      let pinW = pinRef.current.getBoundingClientRect().width
      const measure = () => {
        if (pinRef.current) pinW = pinRef.current.getBoundingClientRect().width
      }
      ScrollTrigger.addEventListener('refresh', measure)

      let raf = 0
      const draw = () => {
        if (!stripRef.current || !pinRef.current) {
          if (!reduced) raf = requestAnimationFrame(draw)
          return
        }
        const p = progressRef.current

        const vw = pinW
        // Resolve frameWidth from vh units → px so resize keeps things
        // aligned. (frameWidth is in vh by convention.)
        const fW = (frameWidth / 100) * window.innerHeight

        // The center of frame `i` should land at vw/2 when this frame is
        // active. Frame i's center natural position (in strip coords,
        // assuming strip's left edge starts at 0) is i * fW + fW/2.
        // Translate the strip so that the ACTIVE frame's center maps to
        // vw/2 — i.e. translateX = vw/2 − (active × fW + fW/2).
        // `active` is a continuous value progress × (N − 1).
        const active = p * (Math.max(1, N - 1))
        const tx = vw / 2 - (active * fW + fW / 2)

        stripRef.current.style.transform = `translate3d(${tx}px, 0, 0)`

        // Sprocket strips move with the film strip horizontally.
        if (sprocketTopRef.current) {
          sprocketTopRef.current.style.transform = `translate3d(${tx}px, 0, 0)`
        }
        if (sprocketBottomRef.current) {
          sprocketBottomRef.current.style.transform = `translate3d(${tx}px, 0, 0)`
        }

        // Per-frame focus envelope — distance from "active" index.
        for (let i = 0; i < N; i++) {
          const el = frameRefs.current[i]
          if (!el) continue
          const dist = Math.abs(i - active)
          // 0 → 1 falloff over ~1 frame.
          const t = Math.max(0, 1 - dist)
          const scale = 0.92 + t * 0.08
          const opacity = 0.32 + t * 0.68
          if (!reduced) el.style.transform = `scale(${scale})`
          el.style.opacity = String(opacity)
        }

        // Reel hubs spin proportional to progress. The strip moves left,
        // so the left reel "pays out" (counter-clockwise from viewer) and
        // the right reel "takes up" (clockwise). Make it look like a real
        // projector. Skipped when reduced motion is preferred.
        if (!reduced) {
          const spin = p * 360 * Math.max(1, N) // amount of total rotation
          if (leftReelRef.current) {
            leftReelRef.current.style.transform = `rotate(${-spin}deg)`
          }
          if (rightReelRef.current) {
            rightReelRef.current.style.transform = `rotate(${-spin}deg)`
          }
        }

        if (!reduced) raf = requestAnimationFrame(draw)
      }

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: () => `+=${scrollLength * window.innerHeight}`,
          pin: pinRef.current,
          scrub: 0.35,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            progressRef.current = self.progress
            // No RAF loop with reduced motion — set positions directly.
            if (reduced) draw()
          },
        },
      })

      if (eyebrowRef.current) {
        tl.to(
          eyebrowRef.current,
          { autoAlpha: 1, y: 0, duration: 0.05, ease: 'power2.out' },
          0,
        )
      }
      if (ctaRef.current) {
        tl.to(
          ctaRef.current,
          { autoAlpha: 1, y: 0, duration: 0.06, ease: 'power2.out' },
          0.92,
        )
      }

      let running = false
      loopRef.current = {
        start: () => {
          if (running || reduced) return
          running = true
          raf = requestAnimationFrame(draw)
        },
        stop: () => {
          running = false
          cancelAnimationFrame(raf)
        },
      }
      if (reduced) {
        // Paint the current scroll position once; onUpdate handles the rest.
        draw()
      } else if (onScreenRef.current) {
        loopRef.current.start()
      }

      return () => {
        loopRef.current = null
        cancelAnimationFrame(raf)
        ScrollTrigger.removeEventListener('refresh', measure)
      }
    },
    {
      scope: sectionRef,
      dependencies: [frames, scrollLength, frameWidth, accentColor, reduced],
    },
  )

  // Pause the reconciler while scrolled offscreen or the tab is hidden —
  // the last written frame stays put; resume when visible.
  React.useEffect(() => {
    onScreenRef.current = onScreen
    if (onScreen) loopRef.current?.start()
    else loopRef.current?.stop()
  }, [onScreen])

  return (
    <div
      ref={sectionRef}
      className={cn('relative w-full bg-[#06070a]', className)}
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
            background: `radial-gradient(70% 60% at 50% 50%, ${accentColor}14 0%, transparent 65%), radial-gradient(120% 90% at 50% 100%, rgba(0,0,0,0.6) 0%, transparent 60%)`,
          }}
        />

        {/* Eyebrow at the very top */}
        {eyebrow && (
          <div className="pointer-events-none absolute inset-x-0 top-0 z-30 flex justify-center px-6 pt-14 sm:pt-16">
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

        {/* The reel hubs — fixed at left/right edges, vertically centered */}
        <ReelHub
          ref={leftReelRef}
          accentColor={accentColor}
          className="absolute left-[-12vh] top-1/2 z-20 -translate-y-1/2"
        />
        <ReelHub
          ref={rightReelRef}
          accentColor={accentColor}
          className="absolute right-[-12vh] top-1/2 z-20 -translate-y-1/2"
        />

        {/* The film strip — centered vertically; translated horizontally
            via the RAF loop. */}
        <div
          className="absolute inset-x-0 top-1/2 -translate-y-1/2"
          style={{ willChange: 'transform' }}
        >
          {/* Top sprocket holes */}
          <SprocketRow
            ref={sprocketTopRef}
            N={N}
            frameWidth={frameWidth}
            position="top"
            accentColor={accentColor}
          />

          {/* The actual strip of frames */}
          <div
            ref={stripRef}
            className="relative flex items-center"
            style={{
              willChange: 'transform',
              height: `${frameWidth * 0.62}vh`,
            }}
          >
            {frames.map((frame, i) => {
              const accent = frame.accent ?? accentColor
              return (
                <div
                  key={frame.id}
                  ref={(el) => {
                    frameRefs.current[i] = el
                  }}
                  className="relative shrink-0 overflow-hidden rounded-md border border-white/15"
                  style={{
                    width: `${frameWidth}vh`,
                    height: `${frameWidth * 0.6}vh`,
                    marginRight: `${frameWidth * 0.04}vh`,
                    background: '#0c0d12',
                    boxShadow: `0 18px 60px -20px rgba(0,0,0,0.7), 0 0 0 1px ${accent}1a inset`,
                    willChange: 'transform, opacity',
                  }}
                >
                  {frame.image && (
                    <>
                      <img
                        src={frame.image}
                        alt=""
                        aria-hidden
                        className="absolute inset-0 h-full w-full object-cover"
                        draggable={false}
                      />
                      <div
                        aria-hidden
                        className="absolute inset-0"
                        style={{
                          background:
                            'linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.7) 100%)',
                        }}
                      />
                    </>
                  )}
                  <div className="absolute inset-0 flex flex-col items-start justify-end p-5 sm:p-6">
                    {frame.eyebrow && (
                      <p className="mb-2 inline-flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.28em] text-white/75">
                        <span
                          aria-hidden
                          className="block h-1.5 w-1.5 rounded-full"
                          style={{
                            background: accent,
                            boxShadow: `0 0 6px ${accent}`,
                          }}
                        />
                        {frame.eyebrow}
                      </p>
                    )}
                    <h3
                      className="text-balance text-xl font-semibold leading-tight tracking-tight text-white sm:text-2xl"
                      style={{ textShadow: `0 0 18px rgba(0,0,0,0.6)` }}
                    >
                      {frame.title}
                    </h3>
                    {frame.body && (
                      <p className="mt-2 max-w-sm text-pretty text-xs leading-relaxed text-white/75 sm:text-sm">
                        {frame.body}
                      </p>
                    )}
                  </div>
                  {/* Frame number, top-right */}
                  <div className="absolute right-3 top-3 font-mono text-[10px] tabular-nums text-white/65">
                    {String(i + 1).padStart(3, '0')} ·{' '}
                    {String(N).padStart(3, '0')}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Bottom sprocket holes */}
          <SprocketRow
            ref={sprocketBottomRef}
            N={N}
            frameWidth={frameWidth}
            position="bottom"
            accentColor={accentColor}
          />
        </div>

        {/* Center playhead — a thin vertical line + "NOW PLAYING" badge */}
        <div className="pointer-events-none absolute inset-y-0 left-1/2 z-30 -translate-x-1/2">
          <div
            aria-hidden
            className="absolute inset-y-[18%] w-px"
            style={{
              background: `linear-gradient(to bottom, transparent, ${accentColor}88 20%, ${accentColor}88 80%, transparent)`,
              boxShadow: `0 0 12px ${accentColor}`,
            }}
          />
          <div
            className="absolute left-1/2 top-[15%] -translate-x-1/2 inline-flex whitespace-nowrap items-center rounded-full border border-white/15 bg-black/55 px-2.5 py-1 text-[9px] font-medium uppercase tracking-[0.28em] text-white/80 backdrop-blur"
          >
            <span
              aria-hidden
              className="mr-1.5 inline-block h-1.5 w-1.5 translate-y-[-1px] rounded-full"
              style={{
                background: accentColor,
                boxShadow: `0 0 8px ${accentColor}`,
              }}
            />
            now playing
          </div>
        </div>

        {/* CTA — bottom-centered */}
        {cta && (
          <div className="pointer-events-none absolute inset-x-0 bottom-20 z-30 flex justify-center px-6">
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

        {/* Scroll hint */}
        <div
          aria-hidden
          className="pointer-events-none absolute bottom-6 left-1/2 z-10 -translate-x-1/2 text-[10px] font-medium uppercase tracking-[0.32em] text-white/45"
        >
          Scroll to unspool
        </div>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Sprocket row — the punched holes that line the top and bottom of the
// film strip. Holes are spaced ~one-quarter of the frame width apart.
// ---------------------------------------------------------------------------

const SprocketRow = React.forwardRef<
  HTMLDivElement,
  {
    N: number
    frameWidth: number
    position: 'top' | 'bottom'
    accentColor: string
  }
>(function SprocketRow({ N, frameWidth, position }, ref) {
  // 4 sprocket holes per frame for a dense look.
  const HOLES_PER_FRAME = 4
  const totalHoles = Math.max(1, N * HOLES_PER_FRAME + HOLES_PER_FRAME * 2)
  const holeSpacing = frameWidth / HOLES_PER_FRAME

  return (
    <div
      ref={ref}
      aria-hidden
      className={cn(
        'relative flex items-center',
        position === 'top' ? 'mb-[-1px]' : 'mt-[-1px]',
      )}
      style={{
        height: `${frameWidth * 0.04}vh`,
        willChange: 'transform',
      }}
    >
      {Array.from({ length: totalHoles }).map((_, i) => (
        <span
          key={i}
          className="shrink-0 rounded-[2px]"
          style={{
            width: `${holeSpacing * 0.45}vh`,
            height: `${frameWidth * 0.025}vh`,
            background: '#000',
            marginRight: `${holeSpacing * 0.55}vh`,
            boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.08)',
          }}
        />
      ))}
    </div>
  )
})

// ---------------------------------------------------------------------------
// Reel hub — decorative round component at the left/right edges that spins
// as the strip moves. Uses lucide's `Disc3` for the spoke pattern.
// ---------------------------------------------------------------------------

const ReelHub = React.forwardRef<
  HTMLDivElement,
  { accentColor: string; className?: string }
>(function ReelHub({ accentColor, className }, ref) {
  return (
    <div
      className={cn(
        'pointer-events-none flex h-[24vh] w-[24vh] items-center justify-center',
        className,
      )}
      aria-hidden
    >
      <div
        className="relative h-full w-full rounded-full border border-white/10"
        style={{
          background:
            'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.04) 0%, transparent 70%)',
          boxShadow: `0 0 40px ${accentColor}26, inset 0 0 40px rgba(0,0,0,0.6)`,
        }}
      >
        <div
          ref={ref}
          className="absolute inset-[12%] flex items-center justify-center text-white/40"
          style={{
            willChange: 'transform',
            transformOrigin: '50% 50%',
          }}
        >
          <Disc3 strokeWidth={0.8} className="h-full w-full" />
        </div>
      </div>
    </div>
  )
})
