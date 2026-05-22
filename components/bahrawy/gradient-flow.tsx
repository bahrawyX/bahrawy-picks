'use client'

/**
 * <GradientFlow />
 *
 * Text whose fill is a linear gradient. The gradient is sized at 300%
 * of the text width and animated to slide horizontally — the colors
 * flow through the letters end-to-end and loop. `background-clip: text`
 * is the magic that paints the gradient inside the glyphs only.
 */

import * as React from 'react'
import { cn } from '@/lib/utils'

export interface GradientFlowProps {
  children: React.ReactNode
  /** Color stops. The list is doubled internally so the loop seams. */
  colors?: string[]
  /** Cycle duration in seconds. Default 6. */
  duration?: number
  /** Gradient angle in degrees. Default 120. */
  angle?: number
  className?: string
}

export function GradientFlow({
  children,
  colors = ['#22D3EE', '#A78BFA', '#F472B6', '#FBBF24'],
  duration = 6,
  angle = 120,
  className,
}: GradientFlowProps) {
  const id = React.useId().replace(/:/g, '')
  // Repeating the palette twice produces a seamless animation loop.
  const stops = [...colors, ...colors]
  const gradient = `linear-gradient(${angle}deg, ${stops.join(', ')})`
  return (
    <span
      className={cn(
        `bahrawy-flow-${id} inline-block select-none bg-clip-text text-transparent`,
        className,
      )}
      style={{
        backgroundImage: gradient,
        backgroundSize: '300% 100%',
        backgroundPosition: '0% 50%',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
      }}
    >
      {children}
      <style>{`
        .bahrawy-flow-${id} {
          animation: bahrawy-flow-${id}-kf ${duration}s linear infinite;
        }
        @keyframes bahrawy-flow-${id}-kf {
          0%   { background-position: 0% 50%; }
          100% { background-position: 200% 50%; }
        }
        @media (prefers-reduced-motion: reduce) {
          .bahrawy-flow-${id} { animation: none !important; }
        }
      `}</style>
    </span>
  )
}
