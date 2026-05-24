'use client'

/**
 * <BarChart />
 *
 * A single-series categorical bar chart. Each bar animates in from
 * the baseline on mount with a staggered spring; hover any bar to
 * lift it slightly and show a tooltip with the exact value. Optional
 * gridlines, value labels on top of bars, and per-bar color overrides.
 *
 * Vertical (default) or horizontal. SVG-driven so it scales cleanly,
 * sharp at any size.
 */

import * as React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

export interface BarChartDatum {
  label: string
  value: number
  /** Optional per-bar color override. */
  color?: string
}

export interface BarChartProps {
  data: BarChartDatum[]
  /** Vertical (default) puts categories on the X axis. */
  orientation?: 'vertical' | 'horizontal'
  /** Chart height in px (vertical) or per-bar thickness multiplier (horizontal). Default 240. */
  height?: number
  /** Default bar color. Default '#A78BFA'. */
  accent?: string
  /** Show horizontal gridlines + Y-axis labels (vertical). Default true. */
  showGrid?: boolean
  /** Print the value on top of each bar. Default false. */
  showValues?: boolean
  /** Format the value (for tooltip + labels). */
  formatValue?: (v: number) => string
  /** Optional max — if omitted, derived from the data. */
  max?: number
  className?: string
}

const SPRING = { type: 'spring' as const, stiffness: 240, damping: 28 }

export function BarChart({
  data,
  orientation = 'vertical',
  height = 240,
  accent = '#A78BFA',
  showGrid = true,
  showValues = false,
  formatValue = (v) => v.toLocaleString(),
  max,
  className,
}: BarChartProps) {
  const computedMax = max ?? Math.max(...data.map((d) => d.value), 0)
  // Round max up to a clean grid step (4 grid lines).
  const niceMax = niceCeil(computedMax)
  const gridLines = [0, 0.25, 0.5, 0.75, 1].map((t) => niceMax * t)
  const [hover, setHover] = React.useState<number | null>(null)

  if (orientation === 'horizontal') {
    return (
      <div
        className={cn(
          'w-full rounded-xl border border-white/[0.08] bg-white/[0.02] p-4',
          className,
        )}
      >
        <div className="space-y-2.5">
          {data.map((d, i) => {
            const pct = niceMax > 0 ? d.value / niceMax : 0
            const color = d.color ?? accent
            const isHover = hover === i
            return (
              <div
                key={i}
                className="grid grid-cols-[80px_1fr_auto] items-center gap-3"
                onMouseEnter={() => setHover(i)}
                onMouseLeave={() => setHover(null)}
              >
                <span className="truncate text-[11.5px] font-medium text-white/65">
                  {d.label}
                </span>
                <div className="relative h-5 overflow-hidden rounded-md bg-white/[0.04]">
                  <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: pct }}
                    transition={{ ...SPRING, delay: i * 0.05 }}
                    className="absolute inset-0 origin-left rounded-md"
                    style={{
                      background: `linear-gradient(90deg, ${color}aa, ${color})`,
                      boxShadow: isHover ? `0 0 16px ${color}66` : undefined,
                    }}
                  />
                </div>
                <span className="w-12 text-right font-mono text-[11px] tabular-nums text-white/60">
                  {formatValue(d.value)}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  // Vertical
  const padding = { top: showValues ? 24 : 12, right: 8, bottom: 28, left: showGrid ? 36 : 8 }
  const chartH = height - padding.top - padding.bottom
  const barGap = 0.25 // fraction of bar width

  return (
    <div
      className={cn(
        'w-full overflow-hidden rounded-xl border border-white/[0.08] bg-white/[0.02] p-4',
        className,
      )}
    >
      <svg
        viewBox={`0 0 100 ${height}`}
        width="100%"
        height={height}
        preserveAspectRatio="none"
        className="block"
      >
        {/* Gridlines + Y labels */}
        {showGrid &&
          gridLines.map((g, i) => {
            const y = padding.top + chartH * (1 - g / (niceMax || 1))
            return (
              <g key={i}>
                <line
                  x1={padding.left}
                  x2={100 - padding.right}
                  y1={y}
                  y2={y}
                  stroke="rgba(255,255,255,0.06)"
                  strokeWidth={0.3}
                  vectorEffect="non-scaling-stroke"
                />
                <text
                  x={padding.left - 4}
                  y={y + 3}
                  textAnchor="end"
                  fontSize={7}
                  fill="rgba(255,255,255,0.35)"
                  fontFamily="monospace"
                >
                  {formatValue(g)}
                </text>
              </g>
            )
          })}

        {/* Bars */}
        {data.map((d, i) => {
          const slot = (100 - padding.left - padding.right) / data.length
          const w = slot * (1 - barGap)
          const x = padding.left + slot * i + (slot - w) / 2
          const h = niceMax > 0 ? (d.value / niceMax) * chartH : 0
          const y = padding.top + chartH - h
          const color = d.color ?? accent
          const isHover = hover === i
          return (
            <g
              key={i}
              onMouseEnter={() => setHover(i)}
              onMouseLeave={() => setHover(null)}
              style={{ cursor: 'pointer' }}
            >
              <motion.rect
                initial={{ height: 0, y: padding.top + chartH }}
                animate={{ height: h, y }}
                transition={{ ...SPRING, delay: i * 0.05 }}
                x={x}
                width={w}
                rx={1.2}
                fill={`url(#bar-grad-${i})`}
                style={{
                  filter: isHover ? `drop-shadow(0 0 4px ${color}88)` : undefined,
                }}
              />
              <defs>
                <linearGradient id={`bar-grad-${i}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={color} />
                  <stop offset="100%" stopColor={`${color}99`} />
                </linearGradient>
              </defs>
              {/* Hover lift */}
              {isHover && (
                <motion.rect
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  x={x - 0.3}
                  y={y - 0.3}
                  width={w + 0.6}
                  height={h + 0.6}
                  rx={1.5}
                  fill="none"
                  stroke={color}
                  strokeWidth={0.4}
                  vectorEffect="non-scaling-stroke"
                />
              )}
              {/* Category label */}
              <text
                x={x + w / 2}
                y={padding.top + chartH + 12}
                textAnchor="middle"
                fontSize={7}
                fill={isHover ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.55)'}
                fontFamily="system-ui, sans-serif"
              >
                {d.label}
              </text>
              {/* Value on top */}
              {showValues && (
                <text
                  x={x + w / 2}
                  y={y - 3}
                  textAnchor="middle"
                  fontSize={6.5}
                  fill="rgba(255,255,255,0.8)"
                  fontFamily="monospace"
                >
                  {formatValue(d.value)}
                </text>
              )}
            </g>
          )
        })}
      </svg>

      {/* Tooltip */}
      {hover !== null && data[hover] && (
        <div className="mt-2 inline-flex items-center gap-2 rounded-md border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[11px]">
          <span
            aria-hidden
            className="block h-2 w-2 rounded-full"
            style={{ background: data[hover].color ?? accent }}
          />
          <span className="font-medium text-white/85">{data[hover].label}</span>
          <span className="font-mono tabular-nums text-white/55">
            {formatValue(data[hover].value)}
          </span>
        </div>
      )}
    </div>
  )
}

function niceCeil(v: number) {
  if (v <= 0) return 1
  const exp = Math.floor(Math.log10(v))
  const f = v / Math.pow(10, exp)
  let nice: number
  if (f <= 1) nice = 1
  else if (f <= 2) nice = 2
  else if (f <= 5) nice = 5
  else nice = 10
  return nice * Math.pow(10, exp)
}
