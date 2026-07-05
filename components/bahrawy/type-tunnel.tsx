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
 *  - The stack sits inside a container with `perspective: 1200px`.
 *  - Each line is positioned absolutely at the centre with its own
 *    `translateZ(z)`. As `progress` (0→1) advances, every line's z
 *    is shifted by `progress × travel`, where `travel` is the total
 *    distance the camera moves over the pin.
 *  - Per-frame we also compute an opacity envelope: lines fade in
 *    as they approach (z > -nearLimit), peak at z ≈ 0, then fade
 *    out as they pass behind (z > closeLimit).
 *  - Scroll progress is read via `ScrollTrigger.onUpdate` and
 *    written to a ref; a tiny RAF reconciler writes the transforms.
 *    GSAP is only used for the pin + progress.
 *
 * The whole thing is one container, one RAF loop, N spans.
 */

import * as React from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowUpRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { usePrefersReducedMotion } from '@/lib/use-prefers-reduced-motion'
import { useOnScreen } from '@/lib/use-on-screen'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface TypeTunnelLine {
  /** The text for this layer. Short = better. */
  text: React.ReactNode
  /** Optional tiny eyebrow rendered above the line. */
  eyebrow?: React.ReactNode
}

export interface TypeTunnelCta {
  label: string
  href?: string
  onClick?: () => void
}

export interface TypeTunnelProps {
  /** Lines to fly through. Order = traversal order. */
  lines: TypeTunnelLine[]
  /** Final standing headline after the tunnel — fades in at the end. */
  finalLine?: TypeTunnelLine
  /** Optional CTA after the final line. */
  cta?: TypeTunnelCta
  /** Pin duration in viewport heights. Default 4. */
  scrollLength?: number
  /** Total Z-axis travel distance in px. Default 2400. */
  travel?: number
  /** Initial spacing between lines along Z. Default 600. */
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
  const lineRefs = React.useRef<(HTMLDivElement | null)[]>([])
  const finalRef = React.useRef<HTMLDivElement>(null)
  const ctaRef = React.useRef<HTMLDivElement>(null)

  // Progress 0→1 from ScrollTrigger.
  const progressRef = React.useRef(0)
  const reduced = usePrefersReducedMotion()
  const onScreen = useOnScreen(sectionRef)
  // Refs let the offscreen gate start/stop the RAF loop without re-running
  // the GSAP setup (which would rebuild the pin + triggers).
  const onScreenRef = React.useRef(onScreen)
  const loopRef = React.useRef<{ start: () => void; stop: () => void } | null>(
    null,
  )

  useGSAP(
    () => {
      if (!sectionRef.current || !pinRef.current) return

      // -------- Initial states --------
      // The further-back lines start invisible (out of focus).
      lineRefs.current.forEach((el, i) => {
        if (!el) return
        const z0 = -i * spacing - 200
        el.style.transform = `translate3d(-50%, -50%, ${z0}px)`
        // Hidden until the camera approaches.
        el.style.opacity = i === 0 ? '0.2' : '0'
      })
      if (finalRef.current)
        gsap.set(finalRef.current, { autoAlpha: 0, y: reduced ? 0 : 18 })
      if (ctaRef.current)
        gsap.set(ctaRef.current, { autoAlpha: 0, y: reduced ? 0 : 14 })

      // -------- Pin + scrubbed progress --------
      // Assigned below once the reconciler exists — the reduced-motion
      // path repaints directly on scroll updates instead of via RAF.
      let drawFrame: (() => void) | null = null
      const st = ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top top',
        end: () => `+=${scrollLength * window.innerHeight}`,
        pin: pinRef.current,
        scrub: 0.4,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          progressRef.current = self.progress
          if (reduced) drawFrame?.()
        },
      })

      // -------- Final line + CTA fades in at the end --------
      const finalTween = finalRef.current
        ? gsap.to(finalRef.current, {
            autoAlpha: 1,
            y: 0,
            duration: 0.4,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: () => `top+=${0.85 * scrollLength * window.innerHeight} top`,
              end: () => `top+=${0.97 * scrollLength * window.innerHeight} top`,
              toggleActions: 'play none none reverse',
            },
          })
        : null
      const ctaTween = ctaRef.current
        ? gsap.to(ctaRef.current, {
            autoAlpha: 1,
            y: 0,
            duration: 0.4,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: () => `top+=${0.92 * scrollLength * window.innerHeight} top`,
              end: () => `top+=${scrollLength * window.innerHeight} top`,
              toggleActions: 'play none none reverse',
            },
          })
        : null

      // -------- RAF reconciler — Z + opacity per line --------
      // The camera moves forward by `progress × travel` px each frame,
      // so each line's effective `z = baseZ + progressShift` where
      // `baseZ_i = -i * spacing`.
      //
      // The opacity envelope is TIGHT on purpose — only the closest
      // line to the camera should be visible at a time. With `spacing`
      // = 600 px and a visible band of ~300 px (-220 → +90), neighbour
      // lines never overlap on screen — the user reads one headline,
      // it dissolves, the next one arrives.
      const nearLimit = 220 // start fade-in this far behind the camera
      const closeLimit = 90 // start fade-out this far past the camera

      // With reduced motion the lines don't fly along Z — they hold a
      // static centered position and simply crossfade using the same
      // opacity envelope, repainted from scroll updates (no RAF loop).
      let raf = 0
      const draw = () => {
        const p = progressRef.current
        const shift = p * travel
        for (let i = 0; i < lineRefs.current.length; i++) {
          const el = lineRefs.current[i]
          if (!el) continue
          const baseZ = -i * spacing
          const z = baseZ + shift
          const transform = reduced
            ? 'translate3d(-50%, -50%, 0)'
            : `translate3d(-50%, -50%, ${z}px)`
          // Cull lines that are far from the camera so we skip layout
          // entirely.
          if (z > closeLimit + 220 || z < -nearLimit * 1.4) {
            el.style.opacity = '0'
            el.style.transform = transform
            continue
          }
          // Tight opacity envelope — fast in, fast out, single line on
          // screen at a time. Squared for a punchier curve.
          let opacity = 0
          if (z > closeLimit) {
            // Past the camera — quick exit.
            const t = 1 - (z - closeLimit) / 180
            opacity = Math.max(0, t * t)
          } else if (z > -nearLimit) {
            // Approaching — sharper fade-in than before.
            const t = Math.min(1, (z + nearLimit) / (nearLimit * 0.55))
            opacity = t * t
          }
          el.style.opacity = String(opacity)
          el.style.transform = transform
        }
        if (!reduced) raf = requestAnimationFrame(draw)
      }
      drawFrame = draw
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
        draw()
      } else if (onScreenRef.current) {
        loopRef.current.start()
      }

      return () => {
        loopRef.current = null
        cancelAnimationFrame(raf)
        st.kill()
        finalTween?.scrollTrigger?.kill()
        ctaTween?.scrollTrigger?.kill()
      }
    },
    {
      scope: sectionRef,
      dependencies: [lines, finalLine, cta, scrollLength, travel, spacing, reduced],
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
      className={cn('relative w-full bg-picks-surface', className)}
      style={{ height: `${(scrollLength + 1) * 100}vh` }}
    >
      <div
        ref={pinRef}
        className="relative h-screen w-full overflow-hidden"
        style={{
          // The container holds the 3D scene.
          perspective: '1200px',
          perspectiveOrigin: '50% 50%',
        }}
      >
        {/* Soft neutral vignette — gives the tunnel some atmosphere
            without any accent tint. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(60% 50% at 50% 50%, rgba(255,255,255,0.06) 0%, transparent 70%), radial-gradient(120% 80% at 50% 100%, rgba(0,0,0,0.6) 0%, transparent 60%)',
          }}
        />

        {/* Star-field-ish dot grid so the user can FEEL the depth */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              'radial-gradient(rgba(255,255,255,0.10) 1px, transparent 1px)',
            backgroundSize: '32px 32px',
            WebkitMaskImage:
              'radial-gradient(60% 60% at 50% 50%, black 0%, transparent 75%)',
            maskImage:
              'radial-gradient(60% 60% at 50% 50%, black 0%, transparent 75%)',
            opacity: 0.55,
          }}
        />

        {/* 3D scene */}
        <div
          className="absolute inset-0"
          style={{
            transformStyle: 'preserve-3d',
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
                transformStyle: 'preserve-3d',
                willChange: 'transform, opacity',
                width: 'max-content',
                maxWidth: '92vw',
              }}
            >
              {line.eyebrow && (
                <p className="mb-3 text-[10px] font-medium uppercase tracking-[0.32em] text-picks-fg/60">
                  {line.eyebrow}
                </p>
              )}
              <h2
                className="text-balance font-semibold leading-[0.92] tracking-tight text-picks-fg"
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

        {/* Final standing line + CTA — these live OUTSIDE the 3D scene
            so they don't get z-transformed. */}
        {(finalLine || cta) && (
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
            {finalLine && (
              <div
                ref={finalRef}
                className="pointer-events-auto"
                style={{ willChange: 'transform, opacity' }}
              >
                {finalLine.eyebrow && (
                  <p className="mb-3 text-[10px] font-medium uppercase tracking-[0.32em] text-picks-fg/60">
                    {finalLine.eyebrow}
                  </p>
                )}
                <h2
                  className="text-balance font-semibold leading-[0.92] tracking-tight text-picks-fg"
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
              <div ref={ctaRef} className="pointer-events-auto mt-8">
                <a
                  href={cta.href ?? '#'}
                  onClick={cta.onClick}
                  className="group inline-flex items-center gap-2 rounded-full bg-picks-fg px-5 py-2.5 text-sm font-semibold text-picks-surface transition-colors hover:bg-picks-fg/90"
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
          className="pointer-events-none absolute bottom-8 left-1/2 z-10 -translate-x-1/2 text-[10px] font-medium uppercase tracking-[0.32em] text-picks-fg/45"
        >
          Scroll forward
        </div>
      </div>
    </div>
  )
}
