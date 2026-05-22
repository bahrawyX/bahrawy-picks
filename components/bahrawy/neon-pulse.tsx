'use client'

/**
 * <NeonPulse />
 *
 * A piece of text that wears a neon sign's glow: layered text-shadows
 * at increasing radii, a gentle breathing pulse on opacity, and an
 * occasional flicker that snaps the brightness down for one beat —
 * exactly the kind of misbehaviour you see in real signs at night.
 */

import * as React from 'react'
import { cn } from '@/lib/utils'

export interface NeonPulseProps {
  children: React.ReactNode
  /** Neon color. Default cyan (#22D3EE). */
  color?: string
  /** Pulse cycle duration in seconds. Default 2.4. */
  duration?: number
  /**
   * Strength of the occasional flicker, 0–1. 0 disables the flicker,
   * 1 punches the brightness all the way down for one frame. Default 0.6.
   */
  flicker?: number
  className?: string
}

export function NeonPulse({
  children,
  color = '#22D3EE',
  duration = 2.4,
  flicker = 0.6,
  className,
}: NeonPulseProps) {
  const id = React.useId().replace(/:/g, '')
  const flickerOpacity = Math.max(0.15, 1 - flicker * 0.85)
  return (
    <span
      className={cn(`bahrawy-neon-${id} inline-block select-none`, className)}
      style={{ color }}
    >
      {children}
      <style>{`
        .bahrawy-neon-${id} {
          text-shadow:
            0 0 6px ${color},
            0 0 14px ${color},
            0 0 28px ${color}99,
            0 0 56px ${color}55;
          animation:
            bahrawy-neon-${id}-pulse ${duration}s ease-in-out infinite
            ${flicker > 0 ? `, bahrawy-neon-${id}-flicker ${duration * 4.1}s steps(1, jump-end) infinite` : ''};
        }
        @keyframes bahrawy-neon-${id}-pulse {
          0%, 100% { opacity: 1; }
          50%      { opacity: 0.82; }
        }
        @keyframes bahrawy-neon-${id}-flicker {
          0%, 92%, 93.4%, 100% { opacity: 1; }
          92.4%                { opacity: ${flickerOpacity}; }
          92.8%                { opacity: 1; }
          93%                  { opacity: ${flickerOpacity * 0.7}; }
        }
        @media (prefers-reduced-motion: reduce) {
          .bahrawy-neon-${id} { animation: none !important; opacity: 1 !important; }
        }
      `}</style>
    </span>
  )
}
