'use client'

/**
 * <WaveText />
 *
 * A line of text where each character undulates in a sine wave with a
 * staggered phase, so the wave reads as a single curve travelling
 * through the word. Pure CSS keyframes — one animation per character,
 * each starting at a different `-Ns` delay.
 */

import * as React from 'react'
import { cn } from '@/lib/utils'

export interface WaveTextProps {
  children: string
  /** Wave amplitude in px. Default 8. */
  amplitude?: number
  /** Cycle duration in seconds. Default 2.4. */
  duration?: number
  /** Stagger per character in seconds. Default 0.05. */
  stagger?: number
  className?: string
}

export function WaveText({
  children,
  amplitude = 8,
  duration = 2.4,
  stagger = 0.05,
  className,
}: WaveTextProps) {
  const id = React.useId().replace(/:/g, '')
  const chars = [...children]
  return (
    <span className={cn('inline-flex select-none', className)} aria-label={children}>
      {chars.map((ch, i) => (
        <span
          key={i}
          aria-hidden
          className={`bahrawy-wave-${id} inline-block whitespace-pre`}
          style={{
            animationDelay: `${-i * stagger}s`,
            ['--amp' as string]: `${amplitude}px`,
            ['--dur' as string]: `${duration}s`,
          }}
        >
          {ch === ' ' ? ' ' : ch}
        </span>
      ))}
      <style>{`
        .bahrawy-wave-${id} {
          animation: bahrawy-wave-${id}-kf var(--dur) ease-in-out infinite;
          will-change: transform;
        }
        @keyframes bahrawy-wave-${id}-kf {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(calc(var(--amp) * -1)); }
        }
        @media (prefers-reduced-motion: reduce) {
          .bahrawy-wave-${id} { animation: none !important; }
        }
      `}</style>
    </span>
  )
}
