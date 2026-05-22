'use client'

/**
 * <DisperseText />
 *
 * Letters explode away from their resting position when the parent is
 * hovered, then settle back when the mouse leaves. Each character's
 * displacement is seeded by its index so the layout is deterministic
 * across renders but still looks chaotic.
 */

import * as React from 'react'
import { cn } from '@/lib/utils'

export interface DisperseTextProps {
  children: string
  /**
   * When the dispersion is active.
   *  - 'hover'  (default) → returns to rest when the cursor leaves
   *  - 'always'           → permanently dispersed
   */
  mode?: 'hover' | 'always'
  /** Maximum displacement in px. Default 64. */
  spread?: number
  /** Maximum rotation in degrees. Default 90. */
  rotate?: number
  className?: string
}

/** Tiny seeded RNG so the random offsets are stable per (length, seed). */
function seededRandom(seed: number) {
  let s = seed >>> 0
  return () => {
    s = (s * 9301 + 49297) % 233280
    return s / 233280
  }
}

export function DisperseText({
  children,
  mode = 'hover',
  spread = 64,
  rotate = 90,
  className,
}: DisperseTextProps) {
  const chars = React.useMemo(() => [...children], [children])
  const [hover, setHover] = React.useState(mode === 'always')

  const offsets = React.useMemo(() => {
    const rand = seededRandom(chars.length * 31 + 7)
    return chars.map(() => ({
      x: (rand() - 0.5) * spread,
      y: (rand() - 0.5) * spread,
      r: (rand() - 0.5) * rotate,
    }))
  }, [chars, spread, rotate])

  React.useEffect(() => {
    if (mode === 'always') setHover(true)
    else if (mode === 'hover') setHover(false)
  }, [mode])

  const active = hover || mode === 'always'

  return (
    <span
      className={cn('inline-flex select-none', className)}
      aria-label={children}
      onMouseEnter={mode === 'hover' ? () => setHover(true) : undefined}
      onMouseLeave={mode === 'hover' ? () => setHover(false) : undefined}
    >
      {chars.map((ch, i) => {
        const { x, y, r } = offsets[i]
        return (
          <span
            key={i}
            aria-hidden
            className="inline-block whitespace-pre"
            style={{
              transform: active
                ? `translate(${x}px, ${y}px) rotate(${r}deg)`
                : 'translate(0, 0) rotate(0)',
              opacity: active ? 0.55 : 1,
              transition: `transform 600ms cubic-bezier(0.22, 1, 0.36, 1) ${i * 14}ms, opacity 420ms ease-out ${i * 14}ms`,
              transformOrigin: '50% 50%',
              willChange: 'transform',
            }}
          >
            {ch === ' ' ? ' ' : ch}
          </span>
        )
      })}
    </span>
  )
}
