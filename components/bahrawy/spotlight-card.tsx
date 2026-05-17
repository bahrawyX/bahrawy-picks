'use client'

/**
 * <SpotlightCard />
 *
 * A card with a radial spotlight that follows the cursor. The spotlight
 * sits behind the card content as a border/background glow, creating a
 * premium interactive effect.
 *
 * @param children       — Card content.
 * @param color          — Spotlight color (CSS color string). Default "rgba(255,255,255,0.15)".
 * @param size           — Spotlight diameter in pixels. Default 300.
 * @param borderRadius   — Card border radius. Default "1rem".
 * @param className      — Additional classes for the card.
 */

import * as React from 'react'
import { cn } from '@/lib/utils'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface SpotlightCardProps {
  children: React.ReactNode
  /** Spotlight color (any CSS color). */
  color?: string
  /** Spotlight diameter in pixels. */
  size?: number
  /** Card border-radius (CSS value). */
  borderRadius?: string
  /** Additional classes for the outer card. */
  className?: string
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function SpotlightCard({
  children,
  color = 'rgba(255,255,255,0.15)',
  size = 300,
  borderRadius = '1rem',
  className,
}: SpotlightCardProps) {
  const cardRef = React.useRef<HTMLDivElement>(null)
  const [position, setPosition] = React.useState({ x: 0, y: 0 })
  const [opacity, setOpacity] = React.useState(0)

  const handleMouseMove = React.useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!cardRef.current) return
      const rect = cardRef.current.getBoundingClientRect()
      setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top })
    },
    []
  )

  const handleMouseEnter = React.useCallback(() => setOpacity(1), [])
  const handleMouseLeave = React.useCallback(() => setOpacity(0), [])

  return (
    <div
      ref={cardRef}
      className={cn(
        'relative overflow-hidden border border-white/10 bg-black/40',
        className
      )}
      style={{ borderRadius }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Spotlight glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-px transition-opacity duration-300"
        style={{
          borderRadius,
          opacity,
          background: `radial-gradient(${size}px circle at ${position.x}px ${position.y}px, ${color}, transparent 65%)`,
        }}
      />

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  )
}
