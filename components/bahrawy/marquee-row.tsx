'use client'

/**
 * <MarqueeRow />
 *
 * Infinite scrolling marquee that duplicates children for seamless looping.
 * Pure CSS animation — no JavaScript animation loop. Pauses on hover and
 * supports reverse direction.
 *
 * @param children    — Items to scroll (automatically duplicated for seamless loop).
 * @param speed       — Duration of one full loop in seconds. Default 30.
 * @param reverse     — Scroll right-to-left (false) or left-to-right (true). Default false.
 * @param pauseOnHover — Pause the marquee when hovered. Default true.
 * @param gap         — Gap between items in pixels. Default 24.
 * @param className   — Additional classes for the wrapper.
 */

import * as React from 'react'
import { cn } from '@/lib/utils'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface MarqueeRowProps {
  children: React.ReactNode
  /** Duration of one full loop in seconds. */
  speed?: number
  /** Scroll direction: false = left, true = right. */
  reverse?: boolean
  /** Pause on hover. */
  pauseOnHover?: boolean
  /** Gap between items in pixels. */
  gap?: number
  /** Additional classes for the outer container. */
  className?: string
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function MarqueeRow({
  children,
  speed = 30,
  reverse = false,
  pauseOnHover = true,
  gap = 24,
  className,
}: MarqueeRowProps) {
  return (
    <div
      className={cn(
        'group flex overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_5%,black_95%,transparent)]',
        className
      )}
    >
      {Array.from({ length: 2 }).map((_, i) => (
        <div
          key={i}
          aria-hidden={i === 1}
          className={cn(
            'flex shrink-0 animate-marquee',
            reverse && '[animation-direction:reverse]',
            pauseOnHover && 'group-hover:[animation-play-state:paused]'
          )}
          style={{
            gap,
            paddingRight: gap,
            animationDuration: `${speed}s`,
          }}
        >
          {children}
        </div>
      ))}
    </div>
  )
}
