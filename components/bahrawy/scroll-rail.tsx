'use client'

/**
 * <ScrollRail />
 *
 * A pinned section whose children sit in a horizontal track and slide left as
 * the page scrolls down. The pin holds for `scrollLength` viewport heights, so
 * one short page scroll translates into a long, smooth horizontal travel.
 *
 * Scroll input is smoothed with a spring so the rail glides instead of
 * snapping frame-by-frame. The track is auto-measured, so the last item
 * always ends flush with the viewport's right edge — regardless of how many
 * children you pass or how wide they are.
 *
 * @param children            — Items in the rail (any JSX). They're laid out in
 *                              a single row with `gap` between them.
 * @param scrollLength        — Pin duration in viewport heights. Default 3.
 * @param gap                 — Px gap between items. Default 24.
 * @param startPadding        — CSS length, padding before the first item.
 * @param endPadding          — CSS length, padding after the last item.
 * @param stiffness/damping   — Spring smoothing of the rail movement.
 * @param showProgress        — Render a thin horizontal progress bar. Default true.
 * @param backgroundClassName — Tailwind bg class for the section. Default bg-zinc-950.
 * @param className           — Extra classes for the outer section.
 */

import * as React from 'react'
import { motion, useScroll, useSpring, useTransform } from 'framer-motion'
import { cn } from '@/lib/utils'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ScrollRailProps {
  children: React.ReactNode
  scrollLength?: number
  gap?: number
  startPadding?: string
  endPadding?: string
  stiffness?: number
  damping?: number
  showProgress?: boolean
  backgroundClassName?: string
  className?: string
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function ScrollRail({
  children,
  scrollLength = 3,
  gap = 24,
  startPadding = '8vw',
  endPadding = '8vw',
  stiffness = 260,
  damping = 38,
  showProgress = true,
  backgroundClassName = 'bg-zinc-950',
  className,
}: ScrollRailProps) {
  const sectionRef = React.useRef<HTMLDivElement>(null)
  const trackRef = React.useRef<HTMLDivElement>(null)
  const [travel, setTravel] = React.useState(0)

  // Measure how far the track must slide so its right edge ends at the
  // section's right edge when the pin completes. We measure against the
  // section's own clientWidth (not window.innerWidth) so the rail still
  // works when it's not full-bleed — e.g. inside a docs column with a
  // sidebar eating part of the viewport.
  React.useLayoutEffect(() => {
    const track = trackRef.current
    const section = sectionRef.current
    if (!track || !section) return
    const measure = () => {
      const trackW = track.scrollWidth
      const viewW = section.clientWidth
      setTravel(Math.max(0, trackW - viewW))
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(track)
    ro.observe(section)
    window.addEventListener('resize', measure)
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [])

  // Vertical scroll progress through the section.
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  })

  // Smooth the raw progress so the rail glides under finger or wheel input.
  // Tight spring + early-finish range ensures the last item is *already* parked
  // at the right edge before the user has a chance to scroll out of the pin,
  // so they never see the spring still catching up after the section ends.
  const smooth = useSpring(scrollYProgress, {
    stiffness,
    damping,
    mass: 0.22,
    restDelta: 0.001,
  })

  // Map [0, 0.94] → [0, -travel] (clamped). The last 6% of the pin holds the
  // rail at its final position so the smoothing can settle without lag.
  const x = useTransform(smooth, [0, 0.94, 1], [0, -travel, -travel])
  const progressScaleX = useTransform(scrollYProgress, [0, 1], [0, 1])

  return (
    <div
      ref={sectionRef}
      className={cn('relative', backgroundClassName, className)}
      style={{ height: `${scrollLength * 100}vh` }}
    >
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        {/* Edge masks — soften the in/out of items at the viewport edges */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-[inherit] to-transparent"
          style={{ background: 'linear-gradient(to right, rgb(9 9 11), transparent)' }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-[inherit] to-transparent"
          style={{ background: 'linear-gradient(to left, rgb(9 9 11), transparent)' }}
        />

        <motion.div
          ref={trackRef}
          className="flex shrink-0 items-center"
          style={{
            x,
            gap,
            paddingLeft: startPadding,
            paddingRight: endPadding,
          }}
        >
          {children}
        </motion.div>

        {showProgress && (
          <div className="pointer-events-none absolute inset-x-10 bottom-10 z-20 h-px overflow-hidden rounded-full bg-white/10">
            <motion.div
              aria-hidden
              style={{ scaleX: progressScaleX, transformOrigin: '0% 50%' }}
              className="h-full origin-left bg-white"
            />
          </div>
        )}
      </div>
    </div>
  )
}
