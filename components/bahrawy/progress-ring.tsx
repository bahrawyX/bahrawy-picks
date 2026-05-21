'use client'

/**
 * <ProgressRing />
 *
 * Circular progress indicator with animated stroke-dashoffset. Optional
 * center label, configurable color + thickness + size.
 *
 * @param value       — Progress 0–100.
 * @param size        — Ring diameter in px. Default 96.
 * @param strokeWidth — Stroke thickness. Default 8.
 * @param color       — Stroke color of the progress arc. Default #FFFFFF.
 * @param trackColor  — Color of the empty track. Default rgba(255,255,255,0.1).
 * @param showLabel   — Show "%" in the center. Default true.
 * @param label       — Custom center content, overrides %.
 * @param className   — Extra classes for the wrapper.
 */

import * as React from 'react'
import { motion, useSpring, useTransform, useMotionValue } from 'framer-motion'
import { cn } from '@/lib/utils'

export interface ProgressRingProps {
  value: number
  size?: number
  strokeWidth?: number
  color?: string
  trackColor?: string
  showLabel?: boolean
  label?: React.ReactNode
  className?: string
}

export function ProgressRing({
  value,
  size = 96,
  strokeWidth = 8,
  color = '#FFFFFF',
  trackColor = 'rgba(255,255,255,0.10)',
  showLabel = true,
  label,
  className,
}: ProgressRingProps) {
  const clamped = Math.max(0, Math.min(100, value))
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius

  // Animate the value via a spring so jumps glide.
  const target = useMotionValue(clamped)
  const spring = useSpring(target, { stiffness: 160, damping: 26, mass: 0.6 })

  React.useEffect(() => {
    target.set(clamped)
  }, [clamped, target])

  const offset = useTransform(spring, (v) => circumference * (1 - v / 100))
  const rounded = useTransform(spring, (v) => `${Math.round(v)}`)

  return (
    <div
      className={cn(
        'relative inline-flex items-center justify-center',
        className,
      )}
      style={{ width: size, height: size }}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="-rotate-90"
        aria-hidden
      >
        {/* Empty track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={trackColor}
          strokeWidth={strokeWidth}
        />
        {/* Animated progress arc */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          style={{ strokeDashoffset: offset }}
        />
      </svg>

      {showLabel && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          {label ?? (
            <span className="flex items-baseline gap-0.5 text-sm font-semibold tabular-nums text-white">
              <motion.span>{rounded}</motion.span>
              <span className="text-xs text-white/50">%</span>
            </span>
          )}
        </div>
      )}
    </div>
  )
}
