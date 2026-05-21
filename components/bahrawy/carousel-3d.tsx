'use client'

/**
 * <Carousel3D />
 *
 * A pinned 3D card carousel. As the user scrolls, an `activeIndex` advances
 * smoothly through the cards. Every card transforms based on its OFFSET from
 * the active position:
 *
 *   - `x`        — horizontal slot ( offset × SPACING )
 *   - `z`        — pulled back in 3D ( -|offset| × DEPTH )
 *   - `rotateY`  — tilted toward the viewer ( -offset × ANGLE )
 *   - `opacity`  — dims with distance from active
 *   - `scale`    — shrinks with distance from active
 *
 * Reads as a Cover Flow-style carousel where one card is always front-and-
 * centre, with the next/previous cards arcing off to either side. ScrollTrigger
 * is in `scrub` mode so the carousel is locked to scroll position — no auto-play.
 */

import * as React from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { cn } from '@/lib/utils'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface Carousel3DCard {
  id: string
  title: string
  /** Optional small uppercase tag above the title. */
  eyebrow?: string
  /** Optional sub-copy under the title. */
  description?: string
  /** Optional image (full-bleed inside the card). */
  image?: string
  /** Tailwind/CSS background string for cards without images (e.g. a gradient). */
  background?: string
  /** Foreground color for text. */
  foreground?: string
}

export interface Carousel3DProps {
  cards: Carousel3DCard[]
  /** Pin length in viewport heights. Default 3.5. */
  scrollLength?: number
  /** Horizontal spacing between adjacent cards (px). Default 320. */
  spacing?: number
  /** How far back side-cards sit in 3D (px). Default 200. */
  depth?: number
  /** Degrees of rotateY per card distance from active. Default 22. */
  angle?: number
  /** Eyebrow shown above the stage. */
  eyebrow?: React.ReactNode
  /** Heading shown above the stage. */
  heading?: React.ReactNode
  className?: string
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function Carousel3D({
  cards,
  scrollLength = 3.5,
  spacing = 320,
  depth = 200,
  angle = 22,
  eyebrow,
  heading,
  className,
}: Carousel3DProps) {
  const sectionRef = React.useRef<HTMLDivElement>(null)
  const pinRef = React.useRef<HTMLDivElement>(null)
  const cardRefs = React.useRef<(HTMLDivElement | null)[]>([])
  const counterRef = React.useRef<HTMLSpanElement>(null)
  const headingRef = React.useRef<HTMLDivElement>(null)

  /** Apply per-card transforms based on a continuous activeIndex (e.g. 2.4). */
  const layout = React.useCallback(
    (activeIndex: number) => {
      cardRefs.current.forEach((card, i) => {
        if (!card) return
        const offset = i - activeIndex
        const absOff = Math.abs(offset)
        gsap.set(card, {
          x: offset * spacing,
          z: -absOff * depth,
          rotationY: -offset * angle,
          opacity: Math.max(0.18, 1 - absOff * 0.32),
          scale: Math.max(0.78, 1 - absOff * 0.07),
          // Push closer cards above farther ones so the active card never
          // gets clipped by a side card's edge.
          zIndex: 100 - Math.round(absOff * 10),
        })
      })
      if (counterRef.current) {
        const display = Math.max(0, Math.min(cards.length - 1, Math.round(activeIndex)))
        counterRef.current.textContent = `${String(display + 1).padStart(2, '0')} / ${String(cards.length).padStart(2, '0')}`
      }
    },
    [angle, cards.length, depth, spacing],
  )

  useGSAP(
    () => {
      if (!sectionRef.current || !pinRef.current) return

      // Initial layout — first card centered.
      layout(0)
      gsap.set(headingRef.current, { autoAlpha: 0, y: 14 })

      const trigger = ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top top',
        end: () => `+=${scrollLength * window.innerHeight}`,
        pin: pinRef.current,
        scrub: 0.4,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          // Map scroll progress 0..1 to activeIndex 0..(cards.length-1).
          const activeIndex = self.progress * (cards.length - 1)
          layout(activeIndex)
        },
      })

      // Heading fades in once the section is engaged
      const headingTl = gsap.to(headingRef.current, {
        autoAlpha: 1,
        y: 0,
        duration: 0.5,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
          end: 'top 30%',
          scrub: 0.5,
        },
      })

      return () => {
        trigger.kill()
        headingTl.scrollTrigger?.kill()
      }
    },
    {
      scope: sectionRef,
      dependencies: [cards.length, scrollLength, spacing, depth, angle, layout],
    },
  )

  return (
    <div
      ref={sectionRef}
      className={cn('relative w-full bg-black', className)}
      style={{ height: `${(scrollLength + 1) * 100}vh` }}
    >
      <div ref={pinRef} className="relative h-screen w-full overflow-hidden">
        {/* Soft background glow that drifts toward whichever card is active */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_60%_at_50%_55%,rgba(167,139,250,0.18),transparent_65%)]"
        />

        {/* Optional heading on top */}
        {(eyebrow || heading) && (
          <div
            ref={headingRef}
            className="absolute inset-x-0 top-0 z-30 mx-auto flex max-w-3xl flex-col items-center gap-3 px-6 pt-20 text-center sm:px-10"
          >
            {eyebrow && (
              <span className="rounded-full border border-white/15 bg-white/[0.04] px-3 py-1 text-[11px] font-medium uppercase tracking-[0.2em] text-white/80 backdrop-blur">
                {eyebrow}
              </span>
            )}
            {heading && (
              <h2 className="text-balance text-3xl font-semibold leading-tight tracking-tight text-white sm:text-4xl">
                {heading}
              </h2>
            )}
          </div>
        )}

        {/* The stage — perspective applied, cards layered inside */}
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{ perspective: '1400px' }}
        >
          <div
            className="relative h-[60vh] w-[280px] sm:w-[320px] md:w-[360px]"
            style={{ transformStyle: 'preserve-3d' }}
          >
            {cards.map((card, i) => (
              <div
                key={card.id}
                ref={(el) => {
                  cardRefs.current[i] = el
                }}
                className="absolute inset-0 overflow-hidden rounded-2xl border border-white/10 shadow-[0_40px_80px_-30px_rgba(0,0,0,0.7)]"
                style={{
                  background: card.background ?? '#0f172a',
                  color: card.foreground ?? '#FFFFFF',
                  // Keep cards facing the camera even with rotateY so text stays readable
                  backfaceVisibility: 'hidden',
                }}
              >
                {card.image && (
                  <img
                    src={card.image}
                    alt={card.title}
                    className="absolute inset-0 h-full w-full object-cover"
                    draggable={false}
                  />
                )}
                <div
                  aria-hidden
                  className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-transparent"
                />
                <div className="absolute inset-x-0 bottom-0 p-6">
                  {card.eyebrow && (
                    <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-white/65">
                      {card.eyebrow}
                    </p>
                  )}
                  <h3 className="mt-2 text-balance text-2xl font-semibold leading-tight tracking-tight text-white sm:text-3xl">
                    {card.title}
                  </h3>
                  {card.description && (
                    <p className="mt-2 text-sm leading-relaxed text-white/80">
                      {card.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Counter + scroll hint */}
        <div className="absolute inset-x-0 bottom-10 z-30 flex flex-col items-center gap-1 text-[10px] font-medium uppercase tracking-[0.32em] text-white/55">
          <span ref={counterRef}>01 / {String(cards.length).padStart(2, '0')}</span>
          <span className="text-white/30">Scroll</span>
        </div>
      </div>
    </div>
  )
}
