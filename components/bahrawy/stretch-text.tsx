'use client'

/**
 * <StretchText />
 *
 * On hover, each character stretches horizontally via `transform:
 * scaleX(N)` with a staggered delay so the stretch reads as a wave
 * passing through the line. Pure CSS-driven via React state — one
 * boolean for hover, per-char transition delays for the stagger.
 */

import * as React from 'react'
import { cn } from '@/lib/utils'

export interface StretchTextProps {
  children: string
  /** Max horizontal scale at full stretch. Default 1.45. */
  stretch?: number
  /** Per-char transition duration in ms. Default 600. */
  duration?: number
  /** Per-char stagger in ms. Default 30. */
  stagger?: number
  className?: string
}

export function StretchText({
  children,
  stretch = 1.45,
  duration = 600,
  stagger = 30,
  className,
}: StretchTextProps) {
  const [hover, setHover] = React.useState(false)
  const chars = React.useMemo(() => [...children], [children])

  return (
    <span
      className={cn('inline-flex select-none', className)}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      aria-label={children}
    >
      {chars.map((ch, i) => (
        <span
          key={i}
          aria-hidden
          className="inline-block whitespace-pre"
          style={{
            transform: hover ? `scaleX(${stretch})` : 'scaleX(1)',
            transformOrigin: '50% 50%',
            transition: `transform ${duration}ms cubic-bezier(0.22, 1, 0.36, 1) ${i * stagger}ms`,
            willChange: 'transform',
          }}
        >
          {ch === ' ' ? ' ' : ch}
        </span>
      ))}
    </span>
  )
}
