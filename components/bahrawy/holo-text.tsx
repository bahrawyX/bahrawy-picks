'use client'

/**
 * <HoloText />
 *
 * Holographic text: a cyan layer and a magenta layer drift in opposite
 * directions behind the white base layer, blending in `screen` mode so
 * their overlap reads as white but their fringes glow. Think old VHS
 * + lenticular sticker.
 */

import * as React from 'react'
import { cn } from '@/lib/utils'

export interface HoloTextProps {
  children: React.ReactNode
  /** Max chromatic offset in px. Default 4. */
  intensity?: number
  /** Drift cycle duration in seconds. Default 4. */
  duration?: number
  /** Cyan channel color. */
  cyan?: string
  /** Magenta channel color. */
  magenta?: string
  className?: string
}

export function HoloText({
  children,
  intensity = 4,
  duration = 4,
  cyan = '#22D3EE',
  magenta = '#F472B6',
  className,
}: HoloTextProps) {
  const id = React.useId().replace(/:/g, '')
  return (
    <span className={cn('relative inline-block select-none', className)}>
      <span
        aria-hidden
        className={`bahrawy-holo-${id}-c absolute inset-0`}
        style={{ color: cyan }}
      >
        {children}
      </span>
      <span
        aria-hidden
        className={`bahrawy-holo-${id}-m absolute inset-0`}
        style={{ color: magenta }}
      >
        {children}
      </span>
      <span className="relative">{children}</span>
      <style>{`
        .bahrawy-holo-${id}-c {
          mix-blend-mode: screen;
          animation: bahrawy-holo-${id}-c-kf ${duration}s ease-in-out infinite;
          will-change: transform;
        }
        .bahrawy-holo-${id}-m {
          mix-blend-mode: screen;
          animation: bahrawy-holo-${id}-m-kf ${duration}s ease-in-out infinite;
          will-change: transform;
        }
        @keyframes bahrawy-holo-${id}-c-kf {
          0%, 100% { transform: translate(${-intensity * 0.5}px, ${-intensity * 0.25}px); }
          50%      { transform: translate(${-intensity}px, ${-intensity * 0.6}px); }
        }
        @keyframes bahrawy-holo-${id}-m-kf {
          0%, 100% { transform: translate(${intensity * 0.5}px, ${intensity * 0.25}px); }
          50%      { transform: translate(${intensity}px, ${intensity * 0.6}px); }
        }
        @media (prefers-reduced-motion: reduce) {
          .bahrawy-holo-${id}-c,
          .bahrawy-holo-${id}-m { animation: none !important; transform: none !important; }
        }
      `}</style>
    </span>
  )
}
