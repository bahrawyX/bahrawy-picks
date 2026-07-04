'use client'

/**
 * <BlurReveal />
 *
 * Content fades in from a heavy blur to sharp focus, like a camera
 * adjusting. Each child is staggered so they reveal sequentially.
 * Triggered when the element enters the viewport.
 *
 * @param children   - Content to reveal.
 * @param duration   - Animation duration in seconds. Default 0.8.
 * @param delay      - Delay before animation starts in seconds. Default 0.
 * @param stagger    - Stagger between children in seconds. Default 0.15.
 * @param blur       - Initial blur amount in px. Default 20.
 * @param direction  - Direction content slides from. Default "up".
 * @param once       - Only animate the first time in viewport. Default true.
 * @param className  - Additional classes for the container.
 */

import * as React from 'react'
import { motion, useInView, type Variants } from 'framer-motion'
import { cn } from '@/lib/utils'
import { usePrefersReducedMotion } from '@/lib/use-prefers-reduced-motion'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface BlurRevealProps {
  children: React.ReactNode
  /** Animation duration in seconds. */
  duration?: number
  /** Delay before animation starts in seconds. */
  delay?: number
  /** Stagger between children in seconds. */
  stagger?: number
  /** Initial blur amount in px. */
  blur?: number
  /** Direction content slides from. */
  direction?: 'up' | 'down' | 'left' | 'right' | 'center'
  /** Only animate the first time in viewport. */
  once?: boolean
  /** Additional classes for the container. */
  className?: string
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

type DirectionOffset = { x?: number; y?: number }

function getDirectionOffset(direction: BlurRevealProps['direction']): DirectionOffset {
  switch (direction) {
    case 'up':
      return { y: 30 }
    case 'down':
      return { y: -30 }
    case 'left':
      return { x: 30 }
    case 'right':
      return { x: -30 }
    case 'center':
    default:
      return {}
  }
}

// ---------------------------------------------------------------------------
// Variants
// ---------------------------------------------------------------------------

function getContainerVariants(stagger: number, delay: number): Variants {
  return {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: stagger,
        delayChildren: delay,
      },
    },
  }
}

function getItemVariants(blur: number, offset: DirectionOffset, duration: number): Variants {
  return {
    hidden: {
      opacity: 0,
      filter: `blur(${blur}px)`,
      ...(offset.x !== undefined ? { x: offset.x } : {}),
      ...(offset.y !== undefined ? { y: offset.y } : {}),
    },
    visible: {
      opacity: 1,
      filter: 'blur(0px)',
      x: 0,
      y: 0,
      transition: {
        duration,
        ease: [0.25, 0.1, 0.25, 1],
      },
    },
  }
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function BlurReveal({
  children,
  duration = 0.8,
  delay = 0,
  stagger = 0.15,
  blur = 20,
  direction = 'up',
  once = true,
  className,
}: BlurRevealProps) {
  const containerRef = React.useRef<HTMLDivElement>(null)
  const isInView = useInView(containerRef, { once, margin: '-60px' })
  const reduced = usePrefersReducedMotion()

  const offset = getDirectionOffset(direction)
  const containerVariants = getContainerVariants(
    reduced ? 0 : stagger,
    reduced ? 0 : delay,
  )
  // Reduced motion: collapse to the visible end state — no blur or offset.
  const itemVariants: Variants = reduced
    ? {
        hidden: { opacity: 1, filter: 'blur(0px)', x: 0, y: 0 },
        visible: {
          opacity: 1,
          filter: 'blur(0px)',
          x: 0,
          y: 0,
          transition: { duration: 0 },
        },
      }
    : getItemVariants(blur, offset, duration)

  const childArray = React.Children.toArray(children)
  const isSingle = childArray.length === 1

  if (isSingle) {
    return (
      <motion.div
        ref={containerRef}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
        variants={itemVariants}
        className={cn(className)}
      >
        {childArray[0]}
      </motion.div>
    )
  }

  return (
    <motion.div
      ref={containerRef}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={containerVariants}
      className={cn(className)}
    >
      {childArray.map((child, i) => (
        <motion.div key={i} variants={itemVariants}>
          {child}
        </motion.div>
      ))}
    </motion.div>
  )
}
