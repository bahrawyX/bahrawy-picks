'use client'

/**
 * <GradientText />
 *
 * Text with an animated flowing gradient using CSS background-clip.
 * Choose from built-in presets or supply custom colors.
 *
 * @param children  - The text content to render.
 * @param preset    - Gradient preset name. Default "aurora".
 * @param colors    - Custom color array (used when preset is "custom").
 * @param duration  - Animation cycle duration in seconds. Default 4.
 * @param animated  - Whether the gradient animates. Default true.
 * @param as        - HTML element to render as. Default "span".
 * @param className - Additional classes.
 */

import * as React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type GradientPreset = 'aurora' | 'fire' | 'ocean' | 'candy' | 'gold' | 'rainbow' | 'custom'
type TextElement = 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span'

export interface GradientTextProps {
  /** The text content to render. */
  children: React.ReactNode
  /** Gradient preset name. */
  preset?: GradientPreset
  /** Custom color array (used when preset is "custom"). */
  colors?: string[]
  /** Animation cycle duration in seconds. */
  duration?: number
  /** Whether the gradient animates. */
  animated?: boolean
  /** HTML element to render as. */
  as?: TextElement
  /** Additional classes. */
  className?: string
}

// ---------------------------------------------------------------------------
// Presets
// ---------------------------------------------------------------------------

const GRADIENT_PRESETS: Record<Exclude<GradientPreset, 'custom'>, string[]> = {
  aurora: ['#a855f7', '#06b6d4', '#10b981'],
  fire: ['#ef4444', '#f59e0b', '#eab308'],
  ocean: ['#3b82f6', '#06b6d4', '#14b8a6'],
  candy: ['#ec4899', '#a855f7', '#3b82f6'],
  gold: ['#f59e0b', '#eab308', '#ffffff', '#f59e0b'],
  rainbow: ['#ef4444', '#f59e0b', '#eab308', '#22c55e', '#3b82f6', '#a855f7'],
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function resolveColors(preset: GradientPreset, customColors?: string[]): string[] {
  if (preset === 'custom') {
    return customColors && customColors.length >= 2
      ? customColors
      : GRADIENT_PRESETS.aurora
  }
  return GRADIENT_PRESETS[preset]
}

function buildGradient(colors: string[]): string {
  // Append the first color at the end for seamless looping
  const loopedColors = [...colors, colors[0]]
  return `linear-gradient(90deg, ${loopedColors.join(', ')})`
}

// ---------------------------------------------------------------------------
// Motion element map
// ---------------------------------------------------------------------------

const motionElements: Record<TextElement, React.ElementType> = {
  h1: motion.h1,
  h2: motion.h2,
  h3: motion.h3,
  h4: motion.h4,
  p: motion.p,
  span: motion.span,
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function GradientText({
  children,
  preset = 'aurora',
  colors,
  duration = 4,
  animated = true,
  as = 'span',
  className,
}: GradientTextProps) {
  const resolvedColors = resolveColors(preset, colors)
  const gradient = buildGradient(resolvedColors)

  const baseStyle: React.CSSProperties = {
    backgroundImage: gradient,
    backgroundClip: 'text',
    WebkitBackgroundClip: 'text',
    color: 'transparent',
    backgroundSize: '200% 200%',
  }

  const MotionTag = motionElements[as]

  if (!animated) {
    return (
      <MotionTag
        style={{ ...baseStyle, backgroundPosition: '0% 50%' }}
        className={cn(className)}
      >
        {children}
      </MotionTag>
    )
  }

  return (
    <MotionTag
      style={baseStyle}
      animate={{
        backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: 'linear',
      }}
      className={cn(className)}
    >
      {children}
    </MotionTag>
  )
}
