'use client'

/**
 * <ImageSwapText />
 *
 * A row of small avatar thumbnails over a giant headline. Hovering an avatar:
 *  - lifts that thumbnail,
 *  - slides a small accent-colored disc with an arrow under it (a "tracker"),
 *  - and swaps the headline to that avatar's word — old letters fan outward
 *    away from center while new letters punch in from the middle.
 *
 * @param items         — Array of `{ src, label, alt? }`. One per avatar.
 * @param defaultLabel  — Headline shown when nothing is hovered.
 * @param accentColor   — Color used for the active word + tracker disc.
 * @param thumbSize     — Avatar size in px. Default 56.
 * @param fontClassName — Class for the headline — pass a display-font class
 *                        (e.g. from `next/font`) for the poster look.
 * @param className     — Extra classes for the outer wrapper.
 */

import * as React from 'react'
import { AnimatePresence, motion, useMotionValue, useSpring } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { usePrefersReducedMotion } from '@/lib/use-prefers-reduced-motion'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ImageSwapItem {
  src: string
  label: string
  alt?: string
}

export interface ImageSwapTextProps {
  items: ImageSwapItem[]
  defaultLabel: string
  accentColor?: string
  thumbSize?: number
  /**
   * Class applied to the headline — pass a display-font class
   * (e.g. from `next/font`) for the poster look. Defaults to the
   * inherited font.
   */
  fontClassName?: string
  className?: string
}

// ---------------------------------------------------------------------------
// Springs
// ---------------------------------------------------------------------------

const TRACKER_SPRING = {
  type: 'spring' as const,
  stiffness: 460,
  damping: 32,
  mass: 0.9,
}

const LETTER_SPRING_IN = {
  type: 'spring' as const,
  stiffness: 380,
  damping: 22,
  mass: 0.8,
}

const LETTER_TWEEN_OUT = {
  duration: 0.32,
  ease: [0.6, 0, 0.7, 0.4] as [number, number, number, number],
}

const THUMB_SPRING = {
  type: 'spring' as const,
  stiffness: 420,
  damping: 26,
  mass: 0.8,
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function ImageSwapText({
  items,
  defaultLabel,
  accentColor = '#EF2B2D',
  thumbSize = 56,
  fontClassName = '',
  className,
}: ImageSwapTextProps) {
  const [active, setActive] = React.useState<number | null>(null)
  const rowRef = React.useRef<HTMLDivElement>(null)
  // Reduced motion: swaps become instant — no springs anywhere.
  const reduced = usePrefersReducedMotion()

  // x-position of the tracker disc, in pixels relative to the row's left edge.
  const trackerX = useMotionValue(0)
  const trackerSpring = useSpring(trackerX, TRACKER_SPRING)
  const trackerPos = reduced ? trackerX : trackerSpring

  const focusItem = React.useCallback(
    (i: number, target: HTMLElement) => {
      if (!rowRef.current) return
      setActive(i)
      const rowRect = rowRef.current.getBoundingClientRect()
      const r = target.getBoundingClientRect()
      trackerX.set(r.left + r.width / 2 - rowRect.left)
    },
    [trackerX],
  )

  const blurItem = React.useCallback(() => setActive(null), [])

  const displayText =
    active !== null && items[active] ? items[active].label : defaultLabel
  const isActive = active !== null
  const headlineColor = isActive ? accentColor : 'var(--picks-fg)'

  return (
    <div
      className={cn(
        'relative flex w-full flex-col items-center justify-center gap-12 py-12 sm:gap-16',
        className,
      )}
    >
      {/* Avatars + tracker --------------------------------------------- */}
      <div
        ref={rowRef}
        onMouseLeave={blurItem}
        onBlur={blurItem}
        className="relative flex items-center justify-center gap-2.5"
      >
        {items.map((item, i) => (
          <motion.button
            key={i}
            type="button"
            onMouseEnter={(e) => focusItem(i, e.currentTarget)}
            onFocus={(e) => focusItem(i, e.currentTarget)}
            animate={{
              scale: active === i ? 1.22 : 1,
              y: active === i ? -6 : 0,
            }}
            transition={reduced ? { duration: 0 } : THUMB_SPRING}
            style={{ width: thumbSize, height: thumbSize }}
            className={cn(
              'relative shrink-0 overflow-hidden rounded-2xl border border-picks-fg/15',
              'shadow-[0_10px_28px_-14px_rgba(0,0,0,0.7)]',
              'transition-shadow focus:outline-none focus-visible:ring-2 focus-visible:ring-picks-fg/40',
            )}
            aria-label={item.label}
          >
            <img
              src={item.src}
              alt={item.alt ?? item.label}
              className="h-full w-full object-cover"
              draggable={false}
            />
          </motion.button>
        ))}

        {/* Tracker disc with the arrow */}
        <motion.div
          aria-hidden
          style={{ x: trackerPos }}
          animate={{
            opacity: isActive ? 1 : 0,
            scale: isActive ? 1 : 0.4,
            y: isActive ? thumbSize * 0.55 : thumbSize * 0.25,
          }}
          transition={reduced ? { duration: 0 } : TRACKER_SPRING}
          className="pointer-events-none absolute left-0 top-full -translate-x-1/2"
        >
          <span
            className="flex items-center justify-center rounded-full text-picks-fg"
            style={{
              width: 52,
              height: 52,
              background: accentColor,
              boxShadow: `0 14px 32px -8px ${accentColor}aa, 0 0 0 1px rgba(255,255,255,0.06)`,
            }}
          >
            <ArrowUpRight className="h-6 w-6" strokeWidth={2.4} />
          </span>
        </motion.div>
      </div>

      {/* Headline ------------------------------------------------------ */}
      <div
        className="relative flex w-full items-center justify-center overflow-hidden"
        style={{ height: 'clamp(140px, 24vw, 320px)' }}
      >
        <AnimatePresence initial={false}>
          <SwapHeadline
            key={displayText}
            text={displayText}
            color={headlineColor}
            fontClassName={fontClassName}
            reduced={reduced}
          />
        </AnimatePresence>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// The headline with per-letter enter/exit animations
// ---------------------------------------------------------------------------

interface SwapHeadlineProps {
  text: string
  color: string
  fontClassName: string
  reduced: boolean
}

function SwapHeadline({ text, color, fontClassName, reduced }: SwapHeadlineProps) {
  // Split into individual characters so each can animate on its own.
  const letters = React.useMemo(() => Array.from(text), [text])
  const center = (letters.length - 1) / 2

  return (
    <motion.h2
      aria-label={text}
      // flex+row eliminates the whitespace gap inline-block siblings get.
      // -0.04em letter-spacing keeps the condensed look airtight.
      className={cn(
        'absolute inset-0 flex select-none items-center justify-center whitespace-nowrap text-center uppercase leading-[0.9]',
        fontClassName,
      )}
      style={{
        color,
        fontSize: 'clamp(110px, 22vw, 280px)',
        letterSpacing: '-0.015em',
      }}
    >
      {letters.map((char, i) => {
        // Signed distance from the visual center of the word.
        // Used to send each letter "outward" on exit, like a paper-fan.
        const offset = i - center
        const direction = offset === 0 ? 0 : offset / Math.abs(offset)
        const exitX = direction * Math.max(120, Math.abs(offset) * 110)

        return (
          <motion.span
            key={`${i}-${char}`}
            initial={reduced ? false : { opacity: 0, scale: 0.25, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={
              reduced
                ? { opacity: 0, transition: { duration: 0 } }
                : {
                    opacity: 0,
                    scale: 0.5,
                    x: exitX,
                    transition: LETTER_TWEEN_OUT,
                  }
            }
            transition={
              reduced
                ? { duration: 0 }
                : {
                    ...LETTER_SPRING_IN,
                    delay: i * 0.018,
                  }
            }
            style={{
              display: 'inline-block',
              willChange: 'transform',
            }}
            aria-hidden
          >
            {char === ' ' ? ' ' : char}
          </motion.span>
        )
      })}
    </motion.h2>
  )
}
