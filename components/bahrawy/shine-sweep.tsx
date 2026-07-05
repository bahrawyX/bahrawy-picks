'use client'

/**
 * <ShineSweep />
 *
 * A bright "shine" stripe sweeps diagonally across the text on a
 * loop. The background is a `linear-gradient(currentColor, shine,
 * currentColor)` clipped to the glyphs via `background-clip: text`;
 * animating `background-position` slides the shine through.
 */

import * as React from 'react'
import { cn } from '@/lib/utils'

export interface ShineSweepProps {
  children: React.ReactNode
  /** Color of the shine band. Default near-white. */
  shineColor?: string
  /** Cycle duration in seconds. Default 3.5. */
  duration?: number
  /** Always-on or only on hover. Default 'always'. */
  mode?: 'always' | 'hover'
  className?: string
}

export function ShineSweep({
  children,
  shineColor = 'rgb(var(--picks-fg-rgb) / 0.85)',
  duration = 3.5,
  mode = 'always',
  className,
}: ShineSweepProps) {
  const id = React.useId().replace(/:/g, '')
  return (
    <span
      className={cn(
        `group bahrawy-shine-${id} inline-block select-none`,
        className,
      )}
      style={{
        backgroundImage: `linear-gradient(120deg, currentColor 30%, ${shineColor} 50%, currentColor 70%)`,
        backgroundSize: '300% 100%',
        backgroundPosition: '100% 50%',
        WebkitBackgroundClip: 'text',
        backgroundClip: 'text',
        // Fill is hidden via -webkit-text-fill-color only. Setting `color:
        // transparent` here would also blank the gradient's currentColor
        // stops, leaving the text invisible outside the shine band.
        WebkitTextFillColor: 'transparent',
      }}
    >
      {children}
      <style>{`
        .bahrawy-shine-${id} {
          ${mode === 'always' ? `animation: bahrawy-shine-${id}-kf ${duration}s linear infinite;` : ''}
        }
        ${mode === 'hover' ? `
          .bahrawy-shine-${id}:hover {
            animation: bahrawy-shine-${id}-kf ${duration}s linear infinite;
          }
        ` : ''}
        @keyframes bahrawy-shine-${id}-kf {
          0%   { background-position: 100% 50%; }
          100% { background-position: -100% 50%; }
        }
        @media (prefers-reduced-motion: reduce) {
          .bahrawy-shine-${id} { animation: none !important; background-position: 50% 50% !important; }
        }
      `}</style>
    </span>
  )
}
