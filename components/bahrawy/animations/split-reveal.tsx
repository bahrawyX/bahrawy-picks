'use client'

/**
 * <SplitReveal />
 *
 * Two halves of a "front" layer split apart to reveal the "back"
 * content underneath -- like opening curtains. Supports horizontal
 * and vertical split directions with hover, click, scroll, or
 * manual triggers.
 *
 * @param front      - Content shown on the closed (covering) layer.
 * @param back       - Content revealed when the halves split open.
 * @param direction  - "horizontal" or "vertical". Default "horizontal".
 * @param trigger    - What opens the split: hover, click, inView, manual.
 * @param isOpen     - Controlled open state (used with trigger="manual").
 * @param duration   - Animation duration in seconds. Default 0.6.
 * @param gap        - Gap in px between halves when open. Default 8.
 * @param className  - Additional classes for the container.
 */

import * as React from 'react'
import { motion, useInView } from 'framer-motion'
import { cn } from '@/lib/utils'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface SplitRevealProps {
  /** Content shown on the closed (covering) layer. */
  front: React.ReactNode
  /** Content revealed when the halves split open. */
  back: React.ReactNode
  /** Split direction. */
  direction?: 'horizontal' | 'vertical'
  /** What opens the split. */
  trigger?: 'hover' | 'click' | 'inView' | 'manual'
  /** Controlled open state (used with trigger="manual"). */
  isOpen?: boolean
  /** Animation duration in seconds. */
  duration?: number
  /** Gap in px between halves when open. */
  gap?: number
  /** Additional classes for the container. */
  className?: string
}

// ---------------------------------------------------------------------------
// Clip paths
// ---------------------------------------------------------------------------

interface HalfClipPaths {
  first: string
  second: string
}

function getClipPaths(direction: 'horizontal' | 'vertical'): HalfClipPaths {
  if (direction === 'horizontal') {
    return {
      first: 'inset(0 50% 0 0)',   // left half
      second: 'inset(0 0 0 50%)',  // right half
    }
  }
  return {
    first: 'inset(0 0 50% 0)',   // top half
    second: 'inset(50% 0 0 0)',  // bottom half
  }
}

// ---------------------------------------------------------------------------
// Spring transition
// ---------------------------------------------------------------------------

const springTransition = (duration: number) => ({
  type: 'spring' as const,
  stiffness: 200,
  damping: 25,
  duration,
})

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function SplitReveal({
  front,
  back,
  direction = 'horizontal',
  trigger = 'hover',
  isOpen: controlledOpen,
  duration = 0.6,
  gap = 8,
  className,
}: SplitRevealProps) {
  const [internalOpen, setInternalOpen] = React.useState(false)
  const containerRef = React.useRef<HTMLDivElement>(null)
  const isInView = useInView(containerRef, { once: true, margin: '-60px' })

  // Resolve the revealed state
  const isRevealed = React.useMemo(() => {
    switch (trigger) {
      case 'manual':
        return controlledOpen ?? false
      case 'inView':
        return isInView
      default:
        return internalOpen
    }
  }, [trigger, controlledOpen, isInView, internalOpen])

  const clips = getClipPaths(direction)
  const transition = springTransition(duration)
  const halfGap = gap / 2

  // Framer-motion x/y accept percentage strings like "-50%" and will
  // interpolate them correctly. We add the gap as a separate numeric
  // value by combining percentage + px via CSS translateX/translateY
  // in the style prop, but the simplest robust approach is to track
  // the container width/height and compute pixel offsets.
  const [containerSize, setContainerSize] = React.useState({ w: 0, h: 0 })

  React.useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const observer = new ResizeObserver(([entry]) => {
      if (entry) {
        setContainerSize({
          w: entry.contentRect.width,
          h: entry.contentRect.height,
        })
      }
    })

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  // Open offsets for each half (pixel values for smooth interpolation)
  const firstAnimate = React.useMemo(() => {
    if (!isRevealed) return { x: 0, y: 0 }
    if (direction === 'horizontal') return { x: -(containerSize.w / 2 + halfGap) }
    return { y: -(containerSize.h / 2 + halfGap) }
  }, [isRevealed, direction, halfGap, containerSize])

  const secondAnimate = React.useMemo(() => {
    if (!isRevealed) return { x: 0, y: 0 }
    if (direction === 'horizontal') return { x: containerSize.w / 2 + halfGap }
    return { y: containerSize.h / 2 + halfGap }
  }, [isRevealed, direction, halfGap, containerSize])

  // Container interaction handlers
  const interactionProps = React.useMemo(() => {
    if (trigger === 'hover') {
      return {
        onMouseEnter: () => setInternalOpen(true),
        onMouseLeave: () => setInternalOpen(false),
      }
    }
    if (trigger === 'click') {
      return {
        onClick: () => setInternalOpen((prev) => !prev),
      }
    }
    return {}
  }, [trigger])

  return (
    <div
      ref={containerRef}
      className={cn('relative overflow-hidden', className)}
      {...interactionProps}
    >
      {/* Back content -- sits underneath */}
      <motion.div
        className="relative"
        initial={{ opacity: 0 }}
        animate={{ opacity: isRevealed ? 1 : 0 }}
        transition={{ duration: duration * 0.5, delay: isRevealed ? duration * 0.2 : 0 }}
      >
        {back}
      </motion.div>

      {/* First half (left or top) */}
      <motion.div
        className="absolute inset-0"
        style={{ clipPath: clips.first }}
        initial={{ x: 0, y: 0 }}
        animate={firstAnimate}
        transition={transition}
        aria-hidden
      >
        {front}
      </motion.div>

      {/* Second half (right or bottom) */}
      <motion.div
        className="absolute inset-0"
        style={{ clipPath: clips.second }}
        initial={{ x: 0, y: 0 }}
        animate={secondAnimate}
        transition={transition}
        aria-hidden
      >
        {front}
      </motion.div>
    </div>
  )
}
