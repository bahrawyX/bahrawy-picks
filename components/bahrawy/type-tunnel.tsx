'use client'

/**
 * <TypeTunnel />
 *
 * A pinned scroll section that turns a list of headlines into a
 * Z-axis tunnel. Each line lives at a different depth in 3D space;
 * scrolling moves the camera forward through them so they arrive
 * one by one from the vanishing point, swell to fill the viewport,
 * then keep going past the camera and exit behind your head.
 *
 * Implementation notes:
 *
 *  - Plain `useLayoutEffect(() => {…}, [])` instead of `useGSAP`.
 *    The latter wraps everything in a `gsap.context()` that gets
 *    reverted on every cleanup → in React StrictMode that meant the
 *    line transforms / opacities were briefly snapped back to their
 *    initial CSS between mounts, which read as a duplicated effect.
 *    A plain effect with empty deps + explicit refs gives us one
 *    setup, one teardown, and zero auto-revert surprises.
 *
 *  - The opacity envelope is a pure function of each line's Z, so it
 *    works identically on scroll-back. No AnimatePresence, no stuck
 *    exits, no overlapping lines.
 *
 *  - The final standing headline + CTA fade in via the same RAF as
 *    the 3D scene fades out — one source of truth means no chance
 *    of one trigger firing ahead of another.
 *
 *  - Camera `travel` auto-bumps so that the last line always clears
 *    the close-cull limit by p = 1, leaving the final headline alone
 *    on stage.
 */

import * as React from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowUpRight } from 'lucide-react'
import { useMotionValue, useSpring } from 'framer-motion'
import { cn } from '@/lib/utils'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface TypeTunnelLine {
  text: React.ReactNode
  eyebrow?: React.ReactNode
}

export interface TypeTunnelCta {
  label: string
  href?: string
  onClick?: () => void
}

export interface TypeTunnelProps {
  lines: TypeTunnelLine[]
  finalLine?: TypeTunnelLine
  cta?: TypeTunnelCta
  /** Pin duration in viewport heights. Default 4. */
  scrollLength?: number
  /** Total Z-axis travel distance in px. Default 2400. Auto-bumped to fit all lines. */
  travel?: number
  /** Spacing between lines along Z. Default 600. */
  spacing?: number
  className?: string
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function TypeTunnel({
  lines,
  finalLine,
  cta,
  scrollLength = 4,
  travel = 2400,
  spacing = 600,
  className,
}: TypeTunnelProps) {
  const sectionRef = React.useRef<HTMLDivElement>(null)
  const pinRef = React.useRef<HTMLDivElement>(null)
  const sceneRef = React.useRef<HTMLDivElement>(null)
  const lineRefs = React.useRef<(HTMLDivElement | null)[]>([])
  const finalRef = React.useRef<HTMLDivElement>(null)
  const ctaRef = React.useRef<HTMLDivElement>(null)

  // Ensure travel is large enough to push every line past the close
  // cull by p = 1.
  const computedTravel = Math.max(travel, (lines.length - 1) * spacing + 360)

  // Stash live prop values so the once-on-mount effect always reads
  // current numbers without forcing the heavy setup to re-run.
  const propsRef = React.useRef({
    travel: computedTravel,
    spacing,
    scrollLength,
  })
  propsRef.current = { travel: computedTravel, spacing, scrollLength }

  const rawProgress = useMotionValue(0)
  const smoothProgress = useSpring(rawProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  })

  React.useLayoutEffect(() => {
    if (!sectionRef.current || !pinRef.current) return

    // ---- Envelope constants ----
    const nearLimit = 220
    const closeLimit = 90

    // ---- The reconciler — pure function of smoothProgress ----
    const draw = () => {
      const p = smoothProgress.get()
      const tr = propsRef.current.travel
      const sp = propsRef.current.spacing
      const shift = p * tr

      // 3D lines
      const arr = lineRefs.current
      for (let i = 0; i < arr.length; i++) {
        const el = arr[i]
        if (!el) continue
        const baseZ = -i * sp
        const z = baseZ + shift

        // Cull lines too far from the camera.
        if (z > closeLimit + 220 || z < -nearLimit * 1.4) {
          el.style.opacity = '0'
          el.style.transform = `translate3d(-50%, -50%, ${z}px)`
          continue
        }

        let opacity = 0
        if (z > closeLimit) {
          const t = 1 - (z - closeLimit) / 180
          opacity = Math.max(0, t * t)
        } else if (z > -nearLimit) {
          const t = Math.min(1, (z + nearLimit) / (nearLimit * 0.55))
          opacity = t * t
        }
        el.style.opacity = String(opacity)
        el.style.transform = `translate3d(-50%, -50%, ${z}px)`
      }

      // 3D scene fade-out near the end so the final line can read clean.
      if (sceneRef.current) {
        const sceneA =
          p <= 0.78 ? 1 : p >= 0.9 ? 0 : 1 - (p - 0.78) / 0.12
        sceneRef.current.style.opacity = String(sceneA)
      }
      // Final line fades in p = 0.86 → 0.94.
      if (finalRef.current) {
        const t = Math.max(0, Math.min(1, (p - 0.86) / 0.08))
        finalRef.current.style.opacity = String(t)
        finalRef.current.style.transform = `translateY(${(1 - t) * 14}px)`
      }
      // CTA fades in p = 0.93 → 1.0.
      if (ctaRef.current) {
        const t = Math.max(0, Math.min(1, (p - 0.93) / 0.07))
        ctaRef.current.style.opacity = String(t)
        ctaRef.current.style.transform = `translateY(${(1 - t) * 10}px)`
      }
    }

    // Prime the very first frame synchronously so we don't show the
    // initial JSX opacity-0 state for even one paint.
    draw()

    // ---- ScrollTrigger pin + scrub ----
    const st = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: 'top top',
      end: () => `+=${propsRef.current.scrollLength * window.innerHeight}`,
      pin: pinRef.current,
      scrub: true,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        rawProgress.set(self.progress)
      },
    })

    // ---- RAF loop reads smoothProgress every frame ----
    let raf = 0
    let cancelled = false
    const tick = () => {
      if (cancelled) return
      draw()
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    return () => {
      cancelled = true
      cancelAnimationFrame(raf)
      st.kill()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div
      ref={sectionRef}
      className={cn('relative w-full bg-[#06070a]', className)}
      style={{ height: `${(scrollLength + 1) * 100}vh` }}
    >
      <div
        ref={pinRef}
        className="relative h-screen w-full overflow-hidden"
        style={{
          perspective: '1200px',
          perspectiveOrigin: '50% 50%',
        }}
      >
        {/* Subtle Apple atmosphere — neutral, no accent tint. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(60% 50% at 50% 50%, rgba(255,255,255,0.06) 0%, transparent 70%), radial-gradient(120% 80% at 50% 100%, rgba(0,0,0,0.6) 0%, transparent 60%)',
          }}
        />

        {/* Dot grid for depth perception */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              'radial-gradient(rgba(255,255,255,0.08) 1px, transparent 1px)',
            backgroundSize: '32px 32px',
            WebkitMaskImage:
              'radial-gradient(60% 60% at 50% 50%, black 0%, transparent 75%)',
            maskImage:
              'radial-gradient(60% 60% at 50% 50%, black 0%, transparent 75%)',
            opacity: 0.5,
          }}
        />

        {/* 3D scene — start visible, RAF fades it out at the end */}
        <div
          ref={sceneRef}
          className="absolute inset-0"
          style={{
            transformStyle: 'preserve-3d',
            willChange: 'opacity',
          }}
        >
          {lines.map((line, i) => (
            <div
              key={i}
              ref={(el) => {
                lineRefs.current[i] = el
              }}
              className="absolute left-1/2 top-1/2 text-center"
              style={{
                // Start at the base Z with opacity 0 so React's initial
                // paint matches what the RAF will compute on its first
                // tick — no first-frame flash even before JS runs.
                transform: `translate3d(-50%, -50%, ${-i * spacing}px)`,
                opacity: 0,
                transformStyle: 'preserve-3d',
                willChange: 'transform, opacity',
                width: 'max-content',
                maxWidth: '92vw',
              }}
            >
              {line.eyebrow && (
                <p className="mb-3 text-[10px] font-medium uppercase tracking-[0.32em] text-white/55">
                  {line.eyebrow}
                </p>
              )}
              <h2
                className="font-display text-balance font-semibold leading-[0.92] tracking-tight text-white"
                style={{
                  fontSize: 'clamp(48px, 10vw, 168px)',
                  letterSpacing: '-0.035em',
                }}
              >
                {line.text}
              </h2>
            </div>
          ))}
        </div>

        {/* Final standing line + CTA — live OUTSIDE the 3D scene */}
        {(finalLine || cta) && (
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
            {finalLine && (
              <div
                ref={finalRef}
                className="pointer-events-auto"
                style={{
                  opacity: 0,
                  transform: 'translateY(14px)',
                  willChange: 'transform, opacity',
                }}
              >
                {finalLine.eyebrow && (
                  <p className="mb-3 text-[10px] font-medium uppercase tracking-[0.32em] text-white/55">
                    {finalLine.eyebrow}
                  </p>
                )}
                <h2
                  className="font-display text-balance font-semibold leading-[0.92] tracking-tight text-white"
                  style={{
                    fontSize: 'clamp(48px, 9vw, 144px)',
                    letterSpacing: '-0.035em',
                  }}
                >
                  {finalLine.text}
                </h2>
              </div>
            )}
            {cta && (
              <div
                ref={ctaRef}
                className="pointer-events-auto mt-8"
                style={{
                  opacity: 0,
                  transform: 'translateY(10px)',
                  willChange: 'transform, opacity',
                }}
              >
                <a
                  href={cta.href ?? '#'}
                  onClick={cta.onClick}
                  className="group inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white px-5 py-2.5 text-sm font-semibold text-black transition-colors hover:bg-white/90"
                >
                  {cta.label}
                  <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </a>
              </div>
            )}
          </div>
        )}

        {/* Tiny hint at the bottom */}
        <div
          aria-hidden
          className="pointer-events-none absolute bottom-8 left-1/2 z-10 -translate-x-1/2 text-[10px] font-medium uppercase tracking-[0.32em] text-white/40"
        >
          Scroll forward
        </div>
      </div>
    </div>
  )
}
