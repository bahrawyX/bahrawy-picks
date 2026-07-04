'use client'

/**
 * <HeroSplit />
 *
 * A pinned hero. Two 50/50 columns of tall stacked content scroll in opposite
 * directions:
 *
 *   - Left column   →  slides UP   (its content rises away from the viewport)
 *   - Right column  →  slides DOWN (its content lowers into view from above)
 *
 * Both motions are locked to scroll via ScrollTrigger.scrub. Once the user
 * scrolls past `reveal` (default 0.7) of the pin, a centered card fades + scales
 * in over both halves with a backdrop-blur — the "meeting" reveal.
 *
 * Pass any number of `items` per column (4 each is the visual sweet-spot).
 */

import * as React from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowUpRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { usePrefersReducedMotion } from '@/lib/use-prefers-reduced-motion'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface HeroSplitItem {
  /** Image src. */
  image: string
  /** Optional alt. Defaults to caption. */
  alt?: string
  /** Tiny tag rendered on the image. */
  eyebrow?: string
  /** Headline rendered on the image. */
  caption: string
}

export interface HeroSplitRevealCta {
  label: string
  href?: string
  onClick?: () => void
}

export interface HeroSplitProps {
  /** Items rendered in the left column (stacks top → bottom). */
  left: HeroSplitItem[]
  /** Items rendered in the right column. */
  right: HeroSplitItem[]
  /** Pin duration in viewport heights. Default 3. */
  scrollLength?: number
  /** Scroll progress (0–1) at which the center reveal appears. Default 0.7. */
  reveal?: number
  /** Centre reveal content — heading + body + CTAs. */
  revealEyebrow?: React.ReactNode
  revealTitle?: React.ReactNode
  revealDescription?: React.ReactNode
  revealPrimaryCta?: HeroSplitRevealCta
  revealSecondaryCta?: HeroSplitRevealCta
  className?: string
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function HeroSplit({
  left,
  right,
  scrollLength = 3,
  reveal = 0.7,
  revealEyebrow,
  revealTitle = 'Two views. One library.',
  revealDescription,
  revealPrimaryCta,
  revealSecondaryCta,
  className,
}: HeroSplitProps) {
  const sectionRef = React.useRef<HTMLDivElement>(null)
  const pinRef = React.useRef<HTMLDivElement>(null)
  const leftColRef = React.useRef<HTMLDivElement>(null)
  const rightColRef = React.useRef<HTMLDivElement>(null)
  const centerRef = React.useRef<HTMLDivElement>(null)
  const dimmerRef = React.useRef<HTMLDivElement>(null)
  const reduced = usePrefersReducedMotion()

  useGSAP(
    () => {
      if (!sectionRef.current || !pinRef.current) return

      // Initial states:
      //  - Left column at y=0  → we see its TOP first
      //  - Right column at y=-100vh → we see its BOTTOM first (shifted up by a viewport)
      //  - Reveal layer hidden
      gsap.set(leftColRef.current, { yPercent: 0 })
      gsap.set(rightColRef.current, { yPercent: -50 })
      gsap.set(centerRef.current, {
        autoAlpha: 0,
        scale: reduced ? 1 : 0.94,
        y: reduced ? 0 : 14,
      })
      if (dimmerRef.current) {
        gsap.set(dimmerRef.current, { autoAlpha: 0 })
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
        },
        defaults: { ease: 'none' },
      })

      // Opposite-direction scroll — both run for the full pin.
      // The yPercent values are computed against each element's own height,
      // so a 200%-tall column moves 50% of itself = exactly one viewport.
      // With reduced motion the columns stay put — only the dimmer +
      // center card fade in below.
      if (!reduced) {
        tl.fromTo(
          leftColRef.current,
          { yPercent: 0 },
          { yPercent: -50, duration: 1 },
          0,
        )
        tl.fromTo(
          rightColRef.current,
          { yPercent: -50 },
          { yPercent: 0, duration: 1 },
          0,
        )
      }

      // Reveal — appears once enough scroll has happened to feel earned.
      if (dimmerRef.current) {
        tl.to(
          dimmerRef.current,
          { autoAlpha: 1, duration: 1 - reveal, ease: 'power2.out' },
          reveal,
        )
      }
      tl.to(
        centerRef.current,
        {
          autoAlpha: 1,
          scale: 1,
          y: 0,
          duration: 1 - reveal,
          ease: 'power2.out',
        },
        reveal,
      )
    },
    {
      scope: sectionRef,
      dependencies: [scrollLength, reveal, reduced],
    },
  )

  return (
    <div
      ref={sectionRef}
      className={cn('relative w-full bg-black', className)}
      style={{ height: `${(scrollLength + 1) * 100}vh` }}
    >
      <div ref={pinRef} className="relative h-screen w-full overflow-hidden">
        {/* Two columns, side by side, each containing tall stacked items */}
        <div className="absolute inset-0 grid grid-cols-2 gap-3 p-3 sm:gap-4 sm:p-4">
          {/* LEFT column — slides UP */}
          <div className="relative h-full overflow-hidden rounded-2xl">
            <div
              ref={leftColRef}
              className="absolute inset-x-0 top-0 flex flex-col gap-3 sm:gap-4"
              style={{
                // Make the column twice as tall as its viewport so it has
                // room to move by one viewport-height.
                height: '200%',
              }}
            >
              {left.map((item, i) => (
                <SplitTile key={i} item={item} />
              ))}
            </div>
          </div>

          {/* RIGHT column — slides DOWN */}
          <div className="relative h-full overflow-hidden rounded-2xl">
            <div
              ref={rightColRef}
              className="absolute inset-x-0 top-0 flex flex-col gap-3 sm:gap-4"
              style={{ height: '200%' }}
            >
              {right.map((item, i) => (
                <SplitTile key={i} item={item} />
              ))}
            </div>
          </div>
        </div>

        {/* Center reveal — backdrop dimmer + centered card */}
        <div
          ref={dimmerRef}
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-black/45 backdrop-blur-sm"
        />
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center px-6 sm:px-10">
          <div
            ref={centerRef}
            className="pointer-events-auto relative w-full max-w-xl rounded-2xl border border-white/10 bg-black/60 p-8 text-center shadow-[0_30px_80px_-20px_rgba(0,0,0,0.7)] backdrop-blur-xl sm:p-10"
          >
            {revealEyebrow && (
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-white/80">
                {revealEyebrow}
              </span>
            )}
            {revealTitle && (
              <h2 className="mt-4 text-balance text-3xl font-semibold leading-tight tracking-tight text-white sm:text-4xl">
                {revealTitle}
              </h2>
            )}
            {revealDescription && (
              <p className="mt-3 max-w-md text-pretty text-sm leading-relaxed text-white/65 sm:mx-auto sm:text-base">
                {revealDescription}
              </p>
            )}
            {(revealPrimaryCta || revealSecondaryCta) && (
              <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                {revealPrimaryCta && (
                  <a
                    href={revealPrimaryCta.href ?? '#'}
                    onClick={revealPrimaryCta.onClick}
                    className="group inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-black transition-colors hover:bg-white/90"
                  >
                    {revealPrimaryCta.label}
                    <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </a>
                )}
                {revealSecondaryCta && (
                  <a
                    href={revealSecondaryCta.href ?? '#'}
                    onClick={revealSecondaryCta.onClick}
                    className="inline-flex items-center justify-center rounded-full border border-white/20 px-5 py-2.5 text-sm font-medium text-white/90 transition-colors hover:bg-white/10"
                  >
                    {revealSecondaryCta.label}
                  </a>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Tiny scroll hint at the very top */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-6 z-30 mx-auto flex w-fit items-center gap-2 rounded-full border border-white/10 bg-black/40 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.28em] text-white/65 backdrop-blur"
        >
          <span className="block h-1 w-1 animate-pulse rounded-full bg-emerald-400 motion-reduce:animate-none" />
          Scroll
        </div>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// One tile inside a column
// ---------------------------------------------------------------------------

function SplitTile({ item }: { item: HeroSplitItem }) {
  return (
    <div className="relative h-[48vh] w-full shrink-0 overflow-hidden rounded-2xl border border-white/10 bg-zinc-900">
      <img
        src={item.image}
        alt={item.alt ?? item.caption}
        className="absolute inset-0 h-full w-full object-cover"
        draggable={false}
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"
      />
      <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
        {item.eyebrow && (
          <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-white/65">
            {item.eyebrow}
          </p>
        )}
        <p className="mt-2 text-balance text-lg font-semibold leading-tight text-white sm:text-xl">
          {item.caption}
        </p>
      </div>
    </div>
  )
}
