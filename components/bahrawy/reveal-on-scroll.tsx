'use client'

/**
 * <RevealOnScroll />
 *
 * Animates children into view when they enter the viewport using
 * Framer Motion and IntersectionObserver (`whileInView`).
 *
 * @param children    — Content to reveal.
 * @param direction   — Slide direction: "up" | "down" | "left" | "right". Default "up".
 * @param distance    — Slide distance in pixels. Default 24.
 * @param duration    — Animation duration in seconds. Default 0.5.
 * @param delay       — Stagger delay in seconds. Default 0.
 * @param once        — Only animate once (don't re-animate on re-enter). Default true.
 * @param className   — Additional classes.
 */

import * as React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type RevealDirection = 'up' | 'down' | 'left' | 'right'

export interface RevealOnScrollProps {
  children: React.ReactNode
  /** Slide direction. */
  direction?: RevealDirection
  /** Slide distance in pixels. */
  distance?: number
  /** Animation duration in seconds. */
  duration?: number
  /** Stagger delay in seconds. */
  delay?: number
  /** Only animate the first time it enters the viewport. */
  once?: boolean
  /** Additional classes. */
  className?: string
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getOffset(direction: RevealDirection, distance: number) {
  switch (direction) {
    case 'up':
      return { x: 0, y: distance }
    case 'down':
      return { x: 0, y: -distance }
    case 'left':
      return { x: distance, y: 0 }
    case 'right':
      return { x: -distance, y: 0 }
  }
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function RevealOnScroll({
  children,
  direction = 'up',
  distance = 24,
  duration = 0.5,
  delay = 0,
  once = true,
  className,
}: RevealOnScrollProps) {
  const offset = getOffset(direction, distance)

  return (
    <motion.div
      initial={{ opacity: 0, ...offset }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once, margin: '-60px' }}
      transition={{
        duration,
        delay,
        ease: [0.25, 0.1, 0.25, 1],
      }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  )
}

// ---------------------------------------------------------------------------
// Stagger wrapper
// ---------------------------------------------------------------------------

export interface RevealStaggerProps {
  children: React.ReactNode
  /** Stagger delay between each child in seconds. */
  stagger?: number
  /** Only animate once. */
  once?: boolean
  /** Additional classes. */
  className?: string
}

export function RevealStagger({
  children,
  stagger = 0.08,
  once = true,
  className,
}: RevealStaggerProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: '-60px' }}
      variants={{
        visible: { transition: { staggerChildren: stagger } },
      }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  )
}

export interface RevealItemProps {
  children: React.ReactNode
  /** Slide direction. */
  direction?: RevealDirection
  /** Slide distance in pixels. */
  distance?: number
  /** Animation duration in seconds. */
  duration?: number
  /** Additional classes. */
  className?: string
}

export function RevealItem({
  children,
  direction = 'up',
  distance = 24,
  duration = 0.5,
  className,
}: RevealItemProps) {
  const offset = getOffset(direction, distance)

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, ...offset },
        visible: { opacity: 1, x: 0, y: 0, transition: { duration, ease: [0.25, 0.1, 0.25, 1] } },
      }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  )
}
