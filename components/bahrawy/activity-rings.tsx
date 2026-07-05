'use client'

/**
 * <ActivityRings />  —  Apple Watch–style concentric fitness rings.
 *
 * Each ring is an SVG circle stroked with a vivid SF gradient color,
 * laid on top of a faded trail of the same color. The visible arc
 * animates in via Framer Motion's `pathLength` so we don't have to
 * measure circumference manually. If a ring overshoots its goal,
 * a second pass draws on top of the first to evoke the Watch's
 * "double-ring" overachiever look.
 *
 *  - Vivid SF colors by default (Move pink, Exercise green, Stand cyan)
 *  - Soft glow per ring via a Gaussian-blur SVG filter
 *  - Optional center stat slot (e.g. day name + date)
 *  - Optional legend below with per-ring value / goal / %
 *  - Sized via `size`; ring thickness + inter-ring gap configurable
 */

import * as React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

export interface ActivityRing {
  /** Display name (e.g. "Move"). */
  label: string
  /** Current value (e.g. calories burned). */
  value: number
  /** Goal value. */
  goal: number
  /** Ring color. */
  color: string
  /** Optional unit suffix (e.g. " cal"). */
  unit?: string
}

export interface ActivityRingsProps {
  rings: ActivityRing[]
  /** Outer size in px. Default 240. */
  size?: number
  /** Stroke thickness per ring. Default 20. */
  thickness?: number
  /** Gap (px) between rings. Default 3. */
  gap?: number
  /** Show a legend with per-ring stats below the rings. Default true. */
  showLegend?: boolean
  /** Optional center label (e.g. "Today"). */
  centerLabel?: React.ReactNode
  /** Optional second line under the center label. */
  centerSubLabel?: React.ReactNode
  /** Accessible SVG <title>. Default "Activity rings". */
  title?: string
  /** Accessible SVG <desc>. Defaults to "Label: value of goal" per ring. */
  description?: string
  className?: string
}

const EASE = [0.22, 1, 0.36, 1] as const

export function ActivityRings({
  rings,
  size = 240,
  thickness = 20,
  gap = 3,
  showLegend = true,
  centerLabel,
  centerSubLabel,
  title,
  description,
  className,
}: ActivityRingsProps) {
  const reactId = React.useId().replace(/[^a-zA-Z0-9]/g, '')
  const titleId = `ar-title-${reactId}`
  const descId = `ar-desc-${reactId}`
  const cx = size / 2
  const cy = size / 2

  // Outer ring's stroke center is at (size/2 - thickness/2)
  const baseRadius = size / 2 - thickness / 2

  // Accessible name + per-ring summary ("Move: 412 of 600 cal").
  const a11yTitle = title ?? 'Activity rings'
  const a11yDescription =
    description ??
    rings
      .map(
        (r) =>
          `${r.label}: ${r.value.toLocaleString()} of ${r.goal.toLocaleString()}${r.unit ?? ''}`,
      )
      .join(', ')

  return (
    <div className={cn('inline-flex flex-col items-center gap-5', className)}>
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          role="img"
          aria-labelledby={`${titleId} ${descId}`}
        >
          <title id={titleId}>{a11yTitle}</title>
          <desc id={descId}>{a11yDescription}</desc>
          <defs>
            {rings.map((r, i) => (
              <linearGradient
                key={i}
                id={`ar-grad-${reactId}-${i}`}
                x1="0%"
                y1="0%"
                x2="0%"
                y2="100%"
              >
                <stop offset="0%" stopColor={r.color} stopOpacity={1} />
                <stop offset="100%" stopColor={r.color} stopOpacity={0.78} />
              </linearGradient>
            ))}
          </defs>

          {/* Rotate so 0% starts at 12 o'clock instead of 3 o'clock. */}
          <g transform={`rotate(-90 ${cx} ${cy})`}>
            {rings.map((r, i) => {
              const radius = baseRadius - i * (thickness + gap)
              if (radius <= 0) return null
              const fraction = Math.max(0, r.value / Math.max(1, r.goal))
              const firstPass = Math.min(1, fraction)
              const overshoot = Math.max(0, fraction - 1)
              const ringDelay = 0.12 + i * 0.18

              return (
                <g key={i}>
                  {/* Trail */}
                  <circle
                    cx={cx}
                    cy={cy}
                    r={radius}
                    fill="none"
                    stroke={r.color}
                    strokeOpacity={0.13}
                    strokeWidth={thickness}
                  />
                  {/* Filled arc — no glow filter, just flat ring */}
                  <motion.circle
                    cx={cx}
                    cy={cy}
                    r={radius}
                    fill="none"
                    stroke={`url(#ar-grad-${reactId}-${i})`}
                    strokeWidth={thickness}
                    strokeLinecap="round"
                    pathLength={1}
                    strokeDasharray={1}
                    initial={{ strokeDashoffset: 1 }}
                    animate={{ strokeDashoffset: 1 - firstPass }}
                    transition={{ duration: 1.05, delay: ringDelay, ease: EASE }}
                  />
                  {/* Overshoot pass (drawn on top, slightly brighter) */}
                  {overshoot > 0 && (
                    <motion.circle
                      cx={cx}
                      cy={cy}
                      r={radius}
                      fill="none"
                      stroke={r.color}
                      strokeOpacity={0.85}
                      strokeWidth={thickness * 0.62}
                      strokeLinecap="round"
                      pathLength={1}
                      strokeDasharray={1}
                      initial={{ strokeDashoffset: 1 }}
                      animate={{ strokeDashoffset: 1 - Math.min(1, overshoot) }}
                      transition={{
                        duration: 0.9,
                        delay: ringDelay + 1.05,
                        ease: EASE,
                      }}
                    />
                  )}
                </g>
              )
            })}
          </g>
        </svg>

        {/* Center label */}
        {(centerLabel || centerSubLabel) && (
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
            {centerLabel && (
              <p className="font-display text-[17px] font-semibold tracking-tight text-picks-fg">
                {centerLabel}
              </p>
            )}
            {centerSubLabel && (
              <p className="mt-0.5 text-[11.5px] tracking-tight text-picks-fg/55">
                {centerSubLabel}
              </p>
            )}
          </div>
        )}
      </div>

      {showLegend && (
        <ul className="grid w-full max-w-[280px] gap-1.5">
          {rings.map((r, i) => {
            const pct = Math.round(Math.max(0, r.value / Math.max(1, r.goal)) * 100)
            return (
              <li
                key={i}
                className="flex items-center justify-between gap-3 rounded-[8px] px-2 py-1.5 transition-colors hover:bg-picks-fg/[0.025]"
              >
                <div className="flex min-w-0 items-center gap-2">
                  <span
                    className="inline-block h-2 w-2 shrink-0 rounded-full"
                    style={{
                      background: r.color,
                    }}
                  />
                  <span className="truncate text-[12px] font-medium tracking-tight text-picks-fg/85">
                    {r.label}
                  </span>
                </div>
                <div className="flex shrink-0 items-baseline gap-1.5">
                  <span className="font-mono text-[12px] font-medium tabular-nums text-picks-fg/90">
                    {r.value.toLocaleString()}
                    <span className="text-picks-fg/45">
                      <span aria-hidden>/</span>
                      <span className="sr-only"> of </span>
                      {r.goal.toLocaleString()}
                      {r.unit ?? ''}
                    </span>
                  </span>
                  <span className="font-mono text-[10.5px] tabular-nums text-picks-fg/55">
                    {pct}%<span className="sr-only"> complete</span>
                  </span>
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
