'use client'

/**
 * <FlipText />
 *
 * Split-flap display effect -- each character flips in on the Y axis
 * like an airport departures board.
 *
 * @param text           -- The string to render.
 * @param stagger        -- Delay between each character (seconds). Default 0.06.
 * @param duration       -- Per-character flip duration (seconds). Default 0.3.
 * @param perspective    -- CSS perspective value in px. Default 400.
 * @param once           -- Only animate on first viewport entry. Default true.
 * @param className      -- Classes applied to the outer container.
 * @param charClassName  -- Classes applied to every character wrapper.
 */

import * as React from 'react'
import { motion, useInView, type Variants } from 'framer-motion'
import { cn } from '@/lib/utils'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface FlipTextProps {
  text: string
  /** Delay between each character in seconds. */
  stagger?: number
  /** Per-character flip duration in seconds. */
  duration?: number
  /** CSS perspective in px. */
  perspective?: number
  /** Only animate on first viewport entry. */
  once?: boolean
  /** Classes for the outer wrapper. */
  className?: string
  /** Classes for each character span. */
  charClassName?: string
}

// ---------------------------------------------------------------------------
// Variants
// ---------------------------------------------------------------------------

const containerVariants: Variants = {
  hidden: {},
  visible: (stagger: number) => ({
    transition: { staggerChildren: stagger },
  }),
}

const charVariants = (duration: number): Variants => ({
  hidden: {
    rotateX: -90,
    opacity: 0,
  },
  visible: {
    rotateX: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 30,
      duration,
    },
  },
})

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function FlipText({
  text,
  stagger = 0.06,
  duration = 0.3,
  perspective = 400,
  once = true,
  className,
  charClassName,
}: FlipTextProps) {
  const ref = React.useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once })

  const chars = text.split('')
  const variants = charVariants(duration)

  return (
    <motion.div
      ref={ref}
      className={cn('inline-flex flex-wrap', className)}
      variants={containerVariants}
      custom={stagger}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
    >
      {chars.map((char, i) => {
        if (char === ' ') {
          return (
            <span key={`space-${i}`} style={{ display: 'inline-block' }}>
              {' '}
            </span>
          )
        }

        return (
          <span
            key={`${char}-${i}`}
            style={{ display: 'inline-block', perspective }}
          >
            <motion.span
              className={cn('inline-block', charClassName)}
              style={{ transformOrigin: 'center bottom' }}
              variants={variants}
            >
              {char}
            </motion.span>
          </span>
        )
      })}
    </motion.div>
  )
}
