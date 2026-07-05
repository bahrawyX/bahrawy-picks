'use client'

/**
 * <HeroScrollGrow />
 *
 * A pinned hero. The hero text shows on top of an inset image card; as the
 * user scrolls, a GSAP timeline:
 *
 *   1. Grows the image (`scale` 0.72 → 1) and dissolves its `border-radius`
 *      (28 → 0), so the card visually opens out to full-bleed.
 *   2. Fades + lifts the hero text out once the image is near full size.
 *   3. (Optional) fades an overlay caption in once the image takes over.
 *
 * The whole sequence is locked to scroll progress via ScrollTrigger.scrub,
 * so the speed is whatever the user's scroll feels like — never auto-runs.
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

export interface HeroScrollGrowProps {
  /** Small tag above the headline. */
  eyebrow?: React.ReactNode
  /** Main headline (any node — string or composed JSX). */
  title: React.ReactNode
  /** Sub-copy under the headline. */
  description?: React.ReactNode
  primaryCta?: { label: string; href?: string; onClick?: () => void }
  secondaryCta?: { label: string; href?: string; onClick?: () => void }
  /** Image src. */
  image: string
  /** Image alt. */
  alt?: string
  /**
   * Pin length in viewport heights. The animation spans the full pin, so
   * higher = slower / more deliberate. Default 2.5.
   */
  scrollLength?: number
  /** Starting scale of the image card before any scroll. Default 0.72. */
  initialScale?: number
  /** Starting border-radius (px) on the image card. Default 28. */
  initialRadius?: number
  /** Optional caption that fades in once the image is full-bleed. */
  overlayCaption?: React.ReactNode
  className?: string
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function HeroScrollGrow({
  eyebrow,
  title,
  description,
  primaryCta,
  secondaryCta,
  image,
  alt = '',
  scrollLength = 2.5,
  initialScale = 0.72,
  initialRadius = 28,
  overlayCaption,
  className,
}: HeroScrollGrowProps) {
  const sectionRef = React.useRef<HTMLDivElement>(null)
  const pinRef = React.useRef<HTMLDivElement>(null)
  const heroTextRef = React.useRef<HTMLDivElement>(null)
  const imageWrapRef = React.useRef<HTMLDivElement>(null)
  const overlayRef = React.useRef<HTMLDivElement>(null)

  // Per-element refs for the Apple-style intro stagger.
  const eyebrowRef = React.useRef<HTMLSpanElement>(null)
  const titleRef = React.useRef<HTMLHeadingElement>(null)
  const descRef = React.useRef<HTMLParagraphElement>(null)
  const ctaRef = React.useRef<HTMLDivElement>(null)

  // If the title is a plain string, split it into words so each can
  // stagger up on mount like the Apple product hero. Non-string JSX
  // titles fall back to a single fade-up.
  const titleIsString = typeof title === 'string'
  const titleWords = titleIsString ? (title as string).split(/(\s+)/) : null

  useGSAP(
    () => {
      if (!sectionRef.current || !pinRef.current) return

      const prefersReducedMotion =
        typeof window !== 'undefined' &&
        window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

      // ----------------------------------------------------------------
      // INTRO sequence (Apple-style mount):
      //   - The image arrives at its scroll-start size + fades in.
      //   - Eyebrow, title words (per-word stagger ~60ms), description,
      //     and CTAs fade up in a deliberate cascade.
      //   - The ScrollTrigger that grows the image is created AFTER the
      //     intro completes so the two tweens never fight for the
      //     transform.
      //
      // GSAP doesn't take spring configs or cubic-bezier tuples natively
      // via its TS types, so we use the named ease closest to the Apple
      // cubic-bezier(0.22, 1, 0.36, 1) — a smooth ease-out cubic.
      // ----------------------------------------------------------------
      const SPRING_BEZIER = 'power3.out'

      gsap.set(imageWrapRef.current, {
        scale: initialScale * 0.96,
        borderRadius: initialRadius,
        autoAlpha: 0,
        transformOrigin: '50% 50%',
      })

      if (eyebrowRef.current)
        gsap.set(eyebrowRef.current, { autoAlpha: 0, y: 10 })
      const wordEls = titleRef.current
        ? Array.from(titleRef.current.querySelectorAll('[data-word]'))
        : []
      if (wordEls.length) {
        gsap.set(wordEls, { autoAlpha: 0, y: 18 })
      } else if (titleRef.current) {
        gsap.set(titleRef.current, { autoAlpha: 0, y: 18 })
      }
      if (descRef.current) gsap.set(descRef.current, { autoAlpha: 0, y: 12 })
      if (ctaRef.current)
        gsap.set(ctaRef.current, { autoAlpha: 0, y: 10, scale: 0.95 })
      if (overlayRef.current)
        gsap.set(overlayRef.current, { autoAlpha: 0, y: 20 })

      let scrollTL: gsap.core.Timeline | null = null

      const buildScrollTimeline = () => {
        scrollTL = gsap.timeline({
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

        // 0 → 1.0: image grows + corners straighten back to full-bleed.
        scrollTL.to(
          imageWrapRef.current,
          {
            scale: 1,
            borderRadius: 0,
            ease: 'power2.out',
            duration: 1,
          },
          0,
        )

        // 0.55 → 0.85: hero text dissolves once the image fills.
        scrollTL.to(
          heroTextRef.current,
          {
            autoAlpha: 0,
            y: -32,
            ease: 'power2.in',
            duration: 0.3,
          },
          0.55,
        )

        // 0.75 → 1.0: overlay caption (if any) fades in.
        if (overlayRef.current) {
          scrollTL.to(
            overlayRef.current,
            {
              autoAlpha: 1,
              y: 0,
              ease: 'power2.out',
              duration: 0.25,
            },
            0.75,
          )
        }
      }

      if (prefersReducedMotion) {
        // Skip the intro — snap everything to its rest state and wire up
        // the scroll timeline.
        gsap.set(imageWrapRef.current, {
          scale: initialScale,
          borderRadius: initialRadius,
          autoAlpha: 1,
        })
        if (eyebrowRef.current)
          gsap.set(eyebrowRef.current, { autoAlpha: 1, y: 0 })
        if (wordEls.length) gsap.set(wordEls, { autoAlpha: 1, y: 0 })
        else if (titleRef.current)
          gsap.set(titleRef.current, { autoAlpha: 1, y: 0 })
        if (descRef.current) gsap.set(descRef.current, { autoAlpha: 1, y: 0 })
        if (ctaRef.current)
          gsap.set(ctaRef.current, { autoAlpha: 1, y: 0, scale: 1 })
        buildScrollTimeline()
        return () => {
          scrollTL?.scrollTrigger?.kill()
          scrollTL?.kill()
        }
      }

      const intro = gsap.timeline({ delay: 0.1 })

      // 1. Image settles in first — scale + fade.
      intro.to(
        imageWrapRef.current,
        {
          scale: initialScale,
          autoAlpha: 1,
          duration: 0.9,
          ease: SPRING_BEZIER,
        },
        0,
      )

      // 2. Eyebrow lands at ~0.15s.
      if (eyebrowRef.current) {
        intro.to(
          eyebrowRef.current,
          { autoAlpha: 1, y: 0, duration: 0.6, ease: SPRING_BEZIER },
          0.15,
        )
      }

      // 3. Title words stagger up — 60ms apart, starting at ~0.25s.
      if (wordEls.length) {
        intro.to(
          wordEls,
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.7,
            ease: SPRING_BEZIER,
            stagger: 0.06,
          },
          0.25,
        )
      } else if (titleRef.current) {
        intro.to(
          titleRef.current,
          { autoAlpha: 1, y: 0, duration: 0.7, ease: SPRING_BEZIER },
          0.25,
        )
      }

      // 4. Description fades in after the title (~0.4s after eyebrow).
      if (descRef.current) {
        intro.to(
          descRef.current,
          { autoAlpha: 1, y: 0, duration: 0.6, ease: SPRING_BEZIER },
          0.55,
        )
      }

      // 5. CTA pops in with a small spring-style scale.
      if (ctaRef.current) {
        intro.to(
          ctaRef.current,
          {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            duration: 0.7,
            ease: SPRING_BEZIER,
          },
          0.7,
        )
      }

      intro.eventCallback('onComplete', () => {
        buildScrollTimeline()
      })

      return () => {
        intro.kill()
        scrollTL?.scrollTrigger?.kill()
        scrollTL?.kill()
      }
    },
    {
      scope: sectionRef,
      dependencies: [scrollLength, initialScale, initialRadius],
    },
  )

  return (
    <div
      ref={sectionRef}
      className={cn('relative w-full bg-picks-surface', className)}
      // +1 viewport of "release room" past the pin so the next section can
      // ease into view instead of jump-cutting from the full-bleed image.
      style={{ height: `${(scrollLength + 1) * 100}vh` }}
    >
      <div ref={pinRef} className="relative h-screen w-full overflow-hidden">
        {/* Image wrap — fills the viewport at scale 1, sits inset at scale<1 */}
        <div
          ref={imageWrapRef}
          className="absolute inset-0 overflow-hidden bg-picks-panel shadow-[0_30px_80px_-20px_rgba(0,0,0,0.7)] ring-1 ring-picks-fg/[0.04]"
        >
          <img
            src={image}
            alt={alt}
            className="h-full w-full object-cover"
            draggable={false}
          />
          {/* Soft top-to-bottom gradient — keeps hero text legible while
              the image is still small AND when it goes full-bleed. */}
          <div
            aria-hidden
            className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/15 to-black/35"
          />
        </div>

        {/* Hero text — centered, fades out as scroll progresses */}
        <div
          ref={heroTextRef}
          className="pointer-events-none relative z-10 mx-auto flex h-full max-w-5xl flex-col items-center justify-center gap-6 px-6 text-center sm:px-10"
        >
          {eyebrow && (
            <span
              ref={eyebrowRef}
              className="pointer-events-auto rounded-full border border-picks-fg/[0.08] bg-picks-fg/[0.05] px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-picks-fg/85 backdrop-blur"
            >
              {eyebrow}
            </span>
          )}
          <h1
            ref={titleRef}
            className="font-display text-balance text-4xl font-semibold leading-tight tracking-tight text-picks-fg sm:text-5xl md:text-6xl"
          >
            {titleIsString && titleWords ? (
              titleWords.map((word, i) =>
                /^\s+$/.test(word) ? (
                  <span key={i}>{word}</span>
                ) : (
                  <span
                    key={i}
                    data-word
                    className="inline-block"
                    style={{ willChange: 'transform, opacity' }}
                  >
                    {word}
                  </span>
                ),
              )
            ) : (
              title
            )}
          </h1>
          {description && (
            <p
              ref={descRef}
              className="max-w-xl text-pretty text-base leading-relaxed text-picks-fg/80 sm:text-lg"
            >
              {description}
            </p>
          )}
          {(primaryCta || secondaryCta) && (
            <div
              ref={ctaRef}
              className="pointer-events-auto mt-2 flex flex-wrap items-center justify-center gap-3"
            >
              {primaryCta && (
                <a
                  href={primaryCta.href ?? '#'}
                  onClick={primaryCta.onClick}
                  className="group inline-flex items-center gap-2 rounded-full bg-picks-fg px-5 py-2.5 text-sm font-semibold text-picks-surface transition-colors hover:bg-picks-fg/90"
                >
                  {primaryCta.label}
                  <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </a>
              )}
              {secondaryCta && (
                <a
                  href={secondaryCta.href ?? '#'}
                  onClick={secondaryCta.onClick}
                  className="inline-flex items-center justify-center rounded-full border border-picks-fg/[0.08] bg-picks-fg/[0.04] px-5 py-2.5 text-sm font-medium text-picks-fg/90 backdrop-blur transition-colors hover:bg-picks-fg/10"
                >
                  {secondaryCta.label}
                </a>
              )}
            </div>
          )}
        </div>

        {/* Optional caption — sits over the full-bleed image at the end */}
        {overlayCaption && (
          <div
            ref={overlayRef}
            className="pointer-events-none absolute inset-x-0 bottom-20 z-20 mx-auto max-w-3xl px-6 text-center"
          >
            <p className="text-balance text-2xl font-semibold leading-tight text-picks-fg drop-shadow-lg sm:text-3xl">
              {overlayCaption}
            </p>
          </div>
        )}

        {/* Tiny "scroll" hint at the very bottom — only visible early */}
        <div
          aria-hidden
          className="pointer-events-none absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-1 text-[10px] font-medium uppercase tracking-[0.28em] text-picks-fg/55"
        >
          Scroll
          <span className="block h-3 w-px bg-picks-fg/40" />
        </div>
      </div>
    </div>
  )
}
