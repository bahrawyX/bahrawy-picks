'use client'

/**
 * <ShiningBorder />
 *
 * A wrapper component that adds an animated glowing beam traveling around
 * its border continuously. The beam is a conic gradient that rotates 360
 * degrees infinitely using Framer Motion's useAnimationFrame.
 *
 * @param children          — Content to wrap.
 * @param variant           — Preset color scheme. Default "default".
 * @param colors            — Custom colors array (used with variant="custom").
 * @param borderWidth       — Border thickness in px. Default 2.
 * @param borderRadius      — Border radius in px. Default 12.
 * @param speed             — Rotation speed multiplier. Default 1.
 * @param beamCount         — Number of beams (1-3). Default 1.
 * @param showGlow          — Show soft glow behind beam. Default true.
 * @param pauseOnHover      — Pause rotation on hover. Default false.
 * @param innerBackground   — Tailwind class for inner bg. Default "bg-black".
 * @param className         — Additional classes for the outer wrapper.
 * @param innerClassName    — Additional classes for the inner content wrapper.
 */

import * as React from 'react'
import { motion, useAnimationFrame, useMotionValue, useMotionTemplate } from 'framer-motion'
import { cn } from '@/lib/utils'
import { fadeUp, springGentle } from '@/lib/motion'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ShiningBorderProps {
  children: React.ReactNode
  /** Preset color variant. */
  variant?: 'default' | 'rainbow' | 'aurora' | 'fire' | 'neon' | 'custom'
  /** Custom gradient colors (used when variant is "custom"). */
  colors?: string[]
  /** Border thickness in pixels. */
  borderWidth?: number
  /** Border radius in pixels. */
  borderRadius?: number
  /** Rotation speed multiplier. */
  speed?: number
  /** Number of beams (1-3). */
  beamCount?: number
  /** Show a soft glow behind the beam. */
  showGlow?: boolean
  /** Pause the animation on hover. */
  pauseOnHover?: boolean
  /** Tailwind class for the inner content background. */
  innerBackground?: string
  /** Additional classes for the outer wrapper. */
  className?: string
  /** Additional classes for the inner content wrapper. */
  innerClassName?: string
}

// ---------------------------------------------------------------------------
// Variant presets
// ---------------------------------------------------------------------------

const VARIANT_COLORS: Record<string, string[]> = {
  default: ['#ffffff', '#a8a8a8'],
  rainbow: ['#ff0000', '#ff8000', '#ffff00', '#00ff00', '#0080ff', '#8000ff'],
  aurora: ['#a78bfa', '#22d3ee', '#34d399', '#a78bfa'],
  fire: ['#ef4444', '#f59e0b', '#eab308', '#ef4444'],
  neon: ['#3b82f6', '#8b5cf6', '#ec4899'],
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function buildGradientStops(colors: string[]): string {
  if (colors.length === 1) return `${colors[0]} 50%`
  const stopStart = 30
  const stopEnd = 70
  const range = stopEnd - stopStart
  return colors
    .map((c, i) => `${c} ${stopStart + (range * i) / (colors.length - 1)}%`)
    .join(', ')
}

// ---------------------------------------------------------------------------
// Beam layer
// ---------------------------------------------------------------------------

function BeamLayer({
  angle,
  colors,
  blur,
  opacity,
  borderRadius,
}: {
  angle: ReturnType<typeof useMotionValue<number>>
  colors: string[]
  blur?: number
  opacity?: number
  borderRadius: number
}) {
  const stops = buildGradientStops(colors)
  const background = useMotionTemplate`conic-gradient(from ${angle}deg, transparent 20%, ${stops}, transparent 80%)`

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none absolute inset-0"
      style={{
        borderRadius,
        background,
        filter: blur ? `blur(${blur}px)` : undefined,
        opacity: opacity ?? 1,
      }}
    />
  )
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function ShiningBorder({
  children,
  variant = 'default',
  colors: customColors,
  borderWidth = 2,
  borderRadius = 12,
  speed = 1,
  beamCount = 1,
  showGlow = true,
  pauseOnHover = false,
  innerBackground = 'bg-black',
  className,
  innerClassName,
}: ShiningBorderProps) {
  const colors = variant === 'custom' ? (customColors ?? VARIANT_COLORS.default) : VARIANT_COLORS[variant]
  const clampedBeams = Math.max(1, Math.min(3, beamCount))

  // Create motion values for each beam
  const angle0 = useMotionValue(0)
  const angle1 = useMotionValue(clampedBeams >= 2 ? 360 / clampedBeams : 0)
  const angle2 = useMotionValue(clampedBeams >= 3 ? (360 / clampedBeams) * 2 : 0)
  const angles = [angle0, angle1, angle2]

  const angleRef = React.useRef(0)
  const paused = React.useRef(false)

  useAnimationFrame((_time, delta) => {
    if (!paused.current) {
      angleRef.current += delta * speed * 0.1
      const base = angleRef.current % 360
      angle0.set(base)
      if (clampedBeams >= 2) angle1.set((base + 360 / clampedBeams) % 360)
      if (clampedBeams >= 3) angle2.set((base + (360 / clampedBeams) * 2) % 360)
    }
  })

  const handleMouseEnter = React.useCallback(() => {
    if (pauseOnHover) paused.current = true
  }, [pauseOnHover])

  const handleMouseLeave = React.useCallback(() => {
    if (pauseOnHover) paused.current = false
  }, [pauseOnHover])

  const innerRadius = Math.max(0, borderRadius - borderWidth)

  return (
    <motion.div
      className={cn('relative', className)}
      style={{
        padding: borderWidth,
        borderRadius,
      }}
      variants={fadeUp}
      initial="initial"
      animate="animate"
      transition={springGentle}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Glow layers (behind beam, blurred) */}
      {showGlow &&
        Array.from({ length: clampedBeams }).map((_, i) => (
          <BeamLayer
            key={`glow-${i}`}
            angle={angles[i]}
            colors={colors}
            blur={8}
            opacity={0.6}
            borderRadius={borderRadius}
          />
        ))}

      {/* Beam layers */}
      {Array.from({ length: clampedBeams }).map((_, i) => (
        <BeamLayer
          key={`beam-${i}`}
          angle={angles[i]}
          colors={colors}
          borderRadius={borderRadius}
        />
      ))}

      {/* Inner content */}
      <div
        className={cn('relative z-10', innerBackground, innerClassName)}
        style={{ borderRadius: innerRadius }}
      >
        {children}
      </div>
    </motion.div>
  )
}
