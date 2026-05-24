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
 * What changed (Apple polish pass):
 *  - NO neon. All text is plain white at varying opacities. No
 *    coloured `textShadow` glow, no coloured `boxShadow` on the CTA.
 *  - The raw scroll progress now feeds through a Framer spring
 *    (stiffness 100, damping 30, restDelta 0.001) before being
 *    written to the RAF reconciler. Scrolling back upward used to
 *    feel laggy because the GSAP scrub fought the user; the spring
 *    smooths it both directions.
 *  - The opacity envelope is now driven purely by each line's Z so
 *    it works identically forward / backward — no AnimatePresence,
 *    no exit transitions stuck mid-flight on scroll-back, and no
 *    chance of two lines overlapping at the same Z window.
 *  - Hairline borders + restrained Apple atmospherics replace the
 *    purple vignette.
 */

import * as React from 'react'
import { useGSAP } from '@gsap/react'
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

  // Raw progress 0→1 from ScrollTrigger.
  const rawProgress = useMotionValue(0)
  // Smoothed progress — the spring kills the "scroll-back lag" because
  // it filters both directions of motion identically.
  const smoothProgress = useSpring(rawProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  })

  useGSAP(
    () => {
      if (!sectionRef.current || !pinRef.current) return

      // -------- Initial states --------
      // Place every line at its base Z, fully transparent. The RAF
      // loop will write the real opacity on the first frame.
      lineRefs.current.forEach((el, i) => {
        if (!el) return
        const z0 = -i * spacing
        el.style.transform = `translate3d(-50%, -50%, ${z0}px)`
        el.style.opacity = '0'
      })
      if (finalRef.current)
        gsap.set(finalRef.current, { autoAlpha: 0, y: 18 })
      if (ctaRef.current) gsap.set(ctaRef.current, { autoAlpha: 0, y: 14 })

      // -------- Pin + scrubbed progress --------
      // Scrub 0 (instant) — the smoothing lives in the Framer spring
      // downstream, so GSAP just hands us the truth as fast as it can.
      const st = ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top top',
        end: () => `+=${scrollLength * window.innerHeight}`,
        pin: pinRef.current,
        scrub: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          rawProgress.set(self.progress)
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
      // We read the SMOOTHED progress every frame and write transform
      // + opacity. Because the envelope is a pure function of Z, it
      // works identically when the user scrolls back — no stale state,
      // no overlap, no stuck exits.
      const nearLimit = 220 // start fade-in this far behind the camera
      const closeLimit = 90 // start fade-out this far past the camera

      let raf = 0
      const draw = () => {
        const p = smoothProgress.get()
        const shift = p * travel
        for (let i = 0; i < lineRefs.current.length; i++) {
          const el = lineRefs.current[i]
          if (!el) continue
          const baseZ = -i * spacing
          const z = baseZ + shift
          // Cull lines far from the camera.
          if (z > closeLimit + 220 || z < -nearLimit * 1.4) {
            if (el.style.opacity !== '0') el.style.opacity = '0'
            el.style.transform = `translate3d(-50%, -50%, ${z}px)`
            continue
          }
          // Tight envelope — single line on screen at a time.
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
        raf = requestAnimationFrame(draw)
      }
      raf = requestAnimationFrame(draw)

      return () => {
        cancelAnimationFrame(raf)
        st.kill()
        finalTween?.scrollTrigger?.kill()
        ctaTween?.scrollTrigger?.kill()
      }
    },
    {
      scope: sectionRef,
      dependencies: [lines, finalLine, cta, scrollLength, travel, spacing],
    },
  )

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
                style={{ willChange: 'transform, opacity' }}
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
              <div ref={ctaRef} className="pointer-events-auto mt-8">
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
