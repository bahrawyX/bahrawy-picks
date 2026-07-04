'use client'

/**
 * <CharSpring />
 *
 * Each character of the headline springs up from below when the
 * element enters the viewport. The container has `overflow-hidden` so
 * the off-screen start state is genuinely hidden. Per-char delay gives
 * the line a satisfying typewriter-with-bounce feel.
 */

import * as React from 'react'
import { motion, useInView } from 'framer-motion'
import { cn } from '@/lib/utils'
import { usePrefersReducedMotion } from '@/lib/use-prefers-reduced-motion'

export interface CharSpringProps {
  children: string
  /** Stagger per character in seconds. Default 0.04. */
  stagger?: number
  /** Spring stiffness. Default 280. */
  stiffness?: number
  /** Spring damping. Default 22. */
  damping?: number
  /** Replay every time the element re-enters the viewport. Default true. */
  replay?: boolean
  className?: string
}

export function CharSpring({
  children,
  stagger = 0.04,
  stiffness = 280,
  damping = 22,
  replay = true,
  className,
}: CharSpringProps) {
  const ref = React.useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: !replay, amount: 0.5 })
  // Reduced motion: chars sit at their end state — no spring-up entrance.
  const reduced = usePrefersReducedMotion()
  const chars = [...children]

  return (
    <span
      ref={ref}
      className={cn(
        'inline-flex select-none overflow-hidden pb-1 leading-[1.1]',
        className,
      )}
      aria-label={children}
    >
      {chars.map((ch, i) => (
        <motion.span
          key={i}
          aria-hidden
          initial={reduced ? false : { y: '110%', opacity: 0 }}
          animate={
            reduced || inView ? { y: 0, opacity: 1 } : { y: '110%', opacity: 0 }
          }
          transition={
            reduced
              ? { duration: 0 }
              : {
                  type: 'spring',
                  stiffness,
                  damping,
                  mass: 0.6,
                  delay: i * stagger,
                }
          }
          className="inline-block whitespace-pre"
        >
          {ch === ' ' ? ' ' : ch}
        </motion.span>
      ))}
    </span>
  )
}
