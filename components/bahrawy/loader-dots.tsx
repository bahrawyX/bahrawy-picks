'use client'

/**
 * <LoaderDots />
 *
 * Three dots that pulse in sequence — the classic typing/loading indicator.
 * Implemented with framer-motion keyframes so the dots ease cleanly instead
 * of jumping linearly.
 */

import * as React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { usePrefersReducedMotion } from '@/lib/use-prefers-reduced-motion'

export interface LoaderDotsProps {
  /** Dot diameter in px. Default 8. */
  size?: number
  /** Color (CSS). Default #FFFFFF. */
  color?: string
  /** Seconds for one full cycle. Lower = faster. Default 1.1. */
  duration?: number
  /** Optional label rendered next to the dots. */
  label?: React.ReactNode
  className?: string
}

export function LoaderDots({
  size = 8,
  color = '#FFFFFF',
  duration = 1.1,
  label,
  className,
}: LoaderDotsProps) {
  const reduced = usePrefersReducedMotion()

  return (
    <span
      role="status"
      aria-label={typeof label === 'string' ? label : 'Loading'}
      className={cn('inline-flex items-center gap-2', className)}
    >
      <span className="inline-flex items-center gap-1">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            initial={{ opacity: 0.25, y: 0 }}
            // Reduced motion: static dots — no infinite pulse.
            animate={
              reduced
                ? { opacity: 1, y: 0 }
                : { opacity: [0.25, 1, 0.25], y: [0, -size * 0.5, 0] }
            }
            transition={
              reduced
                ? { duration: 0 }
                : {
                    duration,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: i * (duration / 6),
                  }
            }
            style={{ width: size, height: size, background: color }}
            className="block rounded-full"
          />
        ))}
      </span>
      {label && <span className="text-xs text-white/65">{label}</span>}
    </span>
  )
}
