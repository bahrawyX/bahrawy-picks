'use client'

/**
 * <VariableFontMorph />
 *
 * Each character animates its `font-variation-settings: 'wght'` axis
 * between two values, with a staggered phase per character. Works with
 * any variable font that has a `wght` axis (Inter does). Pure CSS
 * keyframes — no JS animation loop.
 */

import * as React from 'react'
import { cn } from '@/lib/utils'

export interface VariableFontMorphProps {
  children: string
  /** Minimum weight in the cycle. Default 200. */
  minWeight?: number
  /** Maximum weight in the cycle. Default 900. */
  maxWeight?: number
  /** Cycle duration in seconds. Default 4. */
  duration?: number
  /** Stagger per character in seconds. Default 0.06. */
  stagger?: number
  className?: string
}

export function VariableFontMorph({
  children,
  minWeight = 200,
  maxWeight = 900,
  duration = 4,
  stagger = 0.06,
  className,
}: VariableFontMorphProps) {
  const id = React.useId().replace(/:/g, '')
  const chars = [...children]
  return (
    <span className={cn('inline-flex select-none', className)} aria-label={children}>
      {chars.map((ch, i) => (
        <span
          key={i}
          aria-hidden
          className={`bahrawy-vfm-${id} inline-block whitespace-pre`}
          style={{ animationDelay: `${-i * stagger}s` }}
        >
          {ch === ' ' ? ' ' : ch}
        </span>
      ))}
      <style>{`
        .bahrawy-vfm-${id} {
          animation: bahrawy-vfm-${id}-kf ${duration}s ease-in-out infinite;
          font-variation-settings: 'wght' ${minWeight};
        }
        @keyframes bahrawy-vfm-${id}-kf {
          0%, 100% { font-variation-settings: 'wght' ${minWeight}; }
          50%      { font-variation-settings: 'wght' ${maxWeight}; }
        }
        @media (prefers-reduced-motion: reduce) {
          .bahrawy-vfm-${id} { animation: none !important; }
        }
      `}</style>
    </span>
  )
}
