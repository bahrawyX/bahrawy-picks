'use client'

/**
 * <StaggerReveal />
 *
 * Container that automatically staggers the entrance animation of its
 * children when they scroll into view. Supports multiple reveal directions.
 *
 * @param children  - Elements to stagger-animate.
 * @param direction - Reveal direction: "up"|"down"|"left"|"right"|"scale"|"fade". Default "up".
 * @param stagger   - Delay between each child in seconds. Default 0.1.
 * @param duration  - Animation duration per child in seconds. Default 0.5.
 * @param delay     - Initial delay before the stagger sequence starts. Default 0.
 * @param distance  - Pixel travel distance for directional reveals. Default 30.
 * @param once      - Only animate the first time it enters viewport. Default true.
 * @param threshold - Fraction of the container visible to trigger (0-1). Default 0.1.
 * @param className - Additional classes.
 */

import * as React from 'react'
import { motion, useInView, type Variants } from 'framer-motion'
import { cn } from '@/lib/utils'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type Direction = 'up' | 'down' | 'left' | 'right' | 'scale' | 'fade'

export interface StaggerRevealProps {
  /** Elements to stagger-animate. */
  children: React.ReactNode
  /** Reveal direction. */
  direction?: Direction
  /** Delay between each child in seconds. */
  stagger?: number
  /** Animation duration per child in seconds. */
  duration?: number
  /** Initial delay before the stagger sequence starts in seconds. */
  delay?: number
  /** Pixel travel distance for directional reveals. */
  distance?: number
  /** Only animate the first time it enters the viewport. */
  once?: boolean
  /** Fraction of the container visible to trigger (0-1). */
  threshold?: number
  /** Additional classes. */
  className?: string
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getHiddenState(direction: Direction, distance: number): Record<string, number> {
  switch (direction) {
    case 'up':
      return { opacity: 0, y: distance }
    case 'down':
      return { opacity: 0, y: -distance }
    case 'left':
      return { opacity: 0, x: distance }
    case 'right':
      return { opacity: 0, x: -distance }
    case 'scale':
      return { opacity: 0, scale: 0.8 }
    case 'fade':
      return { opacity: 0 }
  }
}

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

function getItemVariants(direction: Direction, distance: number, duration: number): Variants {
  return {
    hidden: getHiddenState(direction, distance),
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      scale: 1,
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

export function StaggerReveal({
  children,
  direction = 'up',
  stagger = 0.1,
  duration = 0.5,
  delay = 0,
  distance = 30,
  once = true,
  threshold = 0.1,
  className,
}: StaggerRevealProps) {
  const containerRef = React.useRef<HTMLDivElement>(null)
  const isInView = useInView(containerRef, { once, amount: threshold })

  const containerVariants = getContainerVariants(stagger, delay)
  const itemVariants = getItemVariants(direction, distance, duration)

  return (
    <motion.div
      ref={containerRef}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={containerVariants}
      className={cn(className)}
    >
      {React.Children.map(children, (child, index) => (
        <motion.div key={index} variants={itemVariants}>
          {child}
        </motion.div>
      ))}
    </motion.div>
  )
}
