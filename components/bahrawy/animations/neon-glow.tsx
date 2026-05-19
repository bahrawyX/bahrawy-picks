'use client'

/**
 * <NeonGlow />
 *
 * Pulsing neon glow effect on text or elements with optional realistic flicker.
 *
 * @param children        -- Content to wrap in the glow.
 * @param color           -- Preset name or hex color. Default 'cyan'.
 * @param intensity       -- Glow strength 1-10. Default 5.
 * @param pulse           -- Smoothly oscillate glow. Default true.
 * @param flicker         -- Random brief dimming for realism. Default false.
 * @param flickerInterval -- Average ms between flickers. Default 5000.
 * @param as              -- HTML element to render. Default 'span'.
 * @param className       -- Additional classes.
 */

import * as React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type NeonElement = 'div' | 'span' | 'h1' | 'h2' | 'p'

export interface NeonGlowProps {
  children: React.ReactNode
  /** Preset color name or hex value. */
  color?: string
  /** Glow intensity from 1 to 10. */
  intensity?: number
  /** Smoothly pulse the glow. */
  pulse?: boolean
  /** Random brief flicker for realism. */
  flicker?: boolean
  /** Average ms between flicker events. */
  flickerInterval?: number
  /** HTML element to render as. */
  as?: NeonElement
  /** Additional classes. */
  className?: string
}

// ---------------------------------------------------------------------------
// Color presets
// ---------------------------------------------------------------------------

const COLOR_PRESETS: Record<string, string> = {
  cyan: '#06b6d4',
  pink: '#ec4899',
  purple: '#a855f7',
  green: '#22c55e',
  amber: '#f59e0b',
  red: '#ef4444',
  white: '#ffffff',
}

function resolveColor(input: string): string {
  return COLOR_PRESETS[input] ?? input
}

// ---------------------------------------------------------------------------
// Shadow builder
// ---------------------------------------------------------------------------

function buildTextShadow(hex: string, scale: number): string {
  return [
    `0 0 ${7 * scale}px ${hex}`,
    `0 0 ${10 * scale}px ${hex}`,
    `0 0 ${21 * scale}px ${hex}`,
    `0 0 ${42 * scale}px ${hex}`,
  ].join(', ')
}

// ---------------------------------------------------------------------------
// Motion element map
// ---------------------------------------------------------------------------

const MOTION_ELEMENTS = {
  div: motion.div,
  span: motion.span,
  h1: motion.h1,
  h2: motion.h2,
  p: motion.p,
} as const

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function NeonGlow({
  children,
  color = 'cyan',
  intensity = 5,
  pulse = true,
  flicker = false,
  flickerInterval = 5000,
  as = 'span',
  className,
}: NeonGlowProps) {
  const hex = resolveColor(color)
  const baseScale = intensity / 5

  // Pre-compute shadow strings for pulse keyframes
  const shadowHigh = buildTextShadow(hex, baseScale * 1.3)
  const shadowLow = buildTextShadow(hex, baseScale * 0.7)
  const shadowNormal = buildTextShadow(hex, baseScale)

  // Flicker state
  const [flickerActive, setFlickerActive] = React.useState(false)

  React.useEffect(() => {
    if (!flicker) return

    let timeoutId: ReturnType<typeof setTimeout>

    function scheduleFlicker() {
      // Add +/- 40% randomness to interval
      const jitter = flickerInterval * (0.6 + Math.random() * 0.8)
      timeoutId = setTimeout(() => {
        setFlickerActive(true)

        // Flicker lasts 80-150ms
        const flickerDuration = 80 + Math.random() * 70
        setTimeout(() => {
          setFlickerActive(false)
          scheduleFlicker()
        }, flickerDuration)
      }, jitter)
    }

    scheduleFlicker()

    return () => clearTimeout(timeoutId)
  }, [flicker, flickerInterval])

  // Resolve the motion component
  const MotionElement = MOTION_ELEMENTS[as]

  // Build animation props
  const animateProps = pulse
    ? {
        textShadow: [shadowHigh, shadowLow, shadowHigh],
      }
    : {
        textShadow: shadowNormal,
      }

  const transitionProps = pulse
    ? {
        duration: 2,
        repeat: Infinity,
        ease: 'easeInOut' as const,
      }
    : undefined

  return (
    <MotionElement
      className={cn(className)}
      style={{
        color: hex,
        display: as === 'span' ? 'inline-block' : undefined,
      }}
      animate={{
        ...animateProps,
        opacity: flickerActive ? 0.4 : 1,
      }}
      transition={{
        textShadow: transitionProps,
        opacity: { duration: 0.05 },
      }}
    >
      {children}
    </MotionElement>
  )
}
