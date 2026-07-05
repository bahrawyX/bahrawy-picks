'use client'

/**
 * <HabitHeatmap />
 *
 * A GitHub-style contribution grid. 7 rows (one per weekday) × N
 * columns (one per week). Each cell renders as a small rounded
 * square; its fill intensity scales with the cell's value through a
 * configurable accent ramp. Hover a cell to surface a tooltip with
 * the date + count.
 *
 * Two ways to feed data:
 *  1. `data: HeatmapCell[]` — array of { date, value }. The component
 *     bins them into the grid by week / weekday.
 *  2. `demo: true` — a stable pseudo-random demo grid is rendered for
 *     the last `weeks` weeks (default 26; same on every render).
 *
 * With no `data` and no `demo` flag, an empty state is rendered.
 *
 * Footer row: weekday axis on the left, month markers along the top
 * (rendered automatically from the date range), and a "Less → More"
 * legend on the right.
 */

import * as React from 'react'
import { cn } from '@/lib/utils'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface HeatmapCell {
  /** ISO date string (YYYY-MM-DD) — the cell's day. */
  date: string
  /** Activity count for that day. 0 → empty. */
  value: number
}

export interface HabitHeatmapProps {
  /** Data points. Omit (with `demo` unset) to render an empty state. */
  data?: HeatmapCell[]
  /** Render a stable generated demo grid when no data is supplied. Default false. */
  demo?: boolean
  /** Number of weeks to render in demo mode. Default 26. */
  weeks?: number
  /** Show the month axis above the grid. Default true. */
  showMonths?: boolean
  /** Show the weekday axis to the left of the grid. Default true. */
  showWeekdays?: boolean
  /** Show the "Less → More" legend. Default true. */
  showLegend?: boolean
  /** Accent color for filled cells. Default '#34D399'. */
  accentColor?: string
  /** Label shown above the grid. */
  title?: React.ReactNode
  /** Sub-label shown next to the title (e.g. "last 6 months"). */
  meta?: React.ReactNode
  /** Click handler — fires with the cell that was clicked. */
  onCellClick?: (cell: HeatmapCell) => void
  className?: string
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const WEEKDAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTH_LABELS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
]

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function pad(n: number) {
  return n < 10 ? `0${n}` : String(n)
}
function isoDate(d: Date) {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

/** Stable seeded RNG so the demo grid never reshuffles between renders. */
function seedRandom(seed: number) {
  let s = seed >>> 0
  return () => {
    s = (s * 9301 + 49297) % 233280
    return s / 233280
  }
}

/** Generate a demo dataset for the last `weeks` weeks ending today. */
function generateDemoData(weeks: number): HeatmapCell[] {
  const cells: HeatmapCell[] = []
  const today = new Date()
  const rand = seedRandom(weeks * 31 + 7)
  for (let w = weeks - 1; w >= 0; w--) {
    for (let d = 0; d < 7; d++) {
      const date = new Date(today)
      date.setDate(today.getDate() - (w * 7 + (6 - d)))
      // Heavier weights mid-week, lighter on Sundays — feels like
      // real human activity. Then a sparse jitter.
      const dayBias = [0.3, 0.7, 0.9, 0.95, 0.85, 0.7, 0.4][d]
      const roll = rand()
      let value = 0
      if (roll < dayBias * 0.6) value = Math.floor(rand() * 12) + 1
      else if (roll < dayBias * 0.85) value = Math.floor(rand() * 4) + 1
      cells.push({ date: isoDate(date), value })
    }
  }
  return cells
}

/** Bin cells into a weeks × 7 grid (column-major: grid[week][weekday]). */
function buildGrid(cells: HeatmapCell[]): {
  grid: (HeatmapCell | null)[][]
  firstDate: Date | null
} {
  if (cells.length === 0) return { grid: [], firstDate: null }
  const sorted = [...cells].sort((a, b) => a.date.localeCompare(b.date))
  const first = new Date(sorted[0].date)
  // Find the Sunday of the first cell's week.
  const start = new Date(first)
  start.setDate(first.getDate() - first.getDay())
  const last = new Date(sorted[sorted.length - 1].date)
  const totalWeeks = Math.ceil(
    (last.getTime() - start.getTime()) / (7 * 24 * 60 * 60 * 1000),
  ) + 1
  const byDate = new Map(sorted.map((c) => [c.date, c]))
  const grid: (HeatmapCell | null)[][] = []
  for (let w = 0; w < totalWeeks; w++) {
    const week: (HeatmapCell | null)[] = []
    for (let d = 0; d < 7; d++) {
      const date = new Date(start)
      date.setDate(start.getDate() + w * 7 + d)
      const key = isoDate(date)
      week.push(byDate.get(key) ?? null)
    }
    grid.push(week)
  }
  return { grid, firstDate: start }
}

/** Bucket a value into 0-4 intensity steps. */
function intensityFor(value: number, max: number): number {
  if (value <= 0) return 0
  if (max <= 1) return 4
  const ratio = value / max
  if (ratio < 0.2) return 1
  if (ratio < 0.45) return 2
  if (ratio < 0.75) return 3
  return 4
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function HabitHeatmap({
  data,
  demo = false,
  weeks = 26,
  showMonths = true,
  showWeekdays = true,
  showLegend = true,
  accentColor = '#34D399',
  title,
  meta,
  onCellClick,
  className,
}: HabitHeatmapProps) {
  // Resolve data (generate the demo set only when explicitly asked).
  const cells = React.useMemo(
    () => data ?? (demo ? generateDemoData(weeks) : []),
    [data, demo, weeks],
  )
  const { grid, firstDate } = React.useMemo(() => buildGrid(cells), [cells])
  const max = React.useMemo(
    () => cells.reduce((m, c) => Math.max(m, c.value), 0),
    [cells],
  )
  const total = React.useMemo(
    () => cells.reduce((s, c) => s + c.value, 0),
    [cells],
  )

  // Month markers — one per column where the month changes.
  const monthMarkers = React.useMemo(() => {
    if (!firstDate) return [] as { col: number; label: string }[]
    const markers: { col: number; label: string }[] = []
    let lastMonth = -1
    grid.forEach((week, col) => {
      // Use the first day of the week to detect month boundary.
      const day = new Date(firstDate)
      day.setDate(firstDate.getDate() + col * 7)
      if (day.getMonth() !== lastMonth) {
        markers.push({ col, label: MONTH_LABELS[day.getMonth()] })
        lastMonth = day.getMonth()
      }
      void week // mark as used to satisfy lint
    })
    return markers
  }, [grid, firstDate])

  // Cell colour — uses CSS color-mix where supported, falls back to
  // straight hex+alpha.
  const colorAt = (level: number) => {
    if (level === 0) return 'rgb(var(--picks-fg-rgb) / 0.05)'
    const stops = ['', '33', '66', 'aa', 'ee']
    return `${accentColor}${stops[level]}`
  }

  // Empty state — no data supplied and demo mode not requested.
  if (cells.length === 0) {
    return (
      <div className={cn('w-full', className)}>
        {(title || meta) && (
          <div className="mb-4 flex flex-wrap items-baseline gap-3">
            {title && (
              <h3 className="text-sm font-semibold tracking-tight text-picks-fg">
                {title}
              </h3>
            )}
            <p className="text-[11px] uppercase tracking-[0.22em] text-picks-fg/45">
              no activity
              {meta && (
                <>
                  <span className="mx-1.5 text-picks-fg/20">·</span>
                  {meta}
                </>
              )}
            </p>
          </div>
        )}
        <div className="flex h-28 items-center justify-center rounded-lg border border-dashed border-picks-fg/10 text-xs text-picks-fg/40">
          No activity data
        </div>
      </div>
    )
  }

  return (
    <div className={cn('w-full', className)}>
      {/* Header */}
      {(title || meta || showLegend) && (
        <div className="mb-4 flex flex-wrap items-baseline justify-between gap-3">
          <div className="flex flex-wrap items-baseline gap-3">
            {title && (
              <h3 className="text-sm font-semibold tracking-tight text-picks-fg">
                {title}
              </h3>
            )}
            <p className="text-[11px] uppercase tracking-[0.22em] text-picks-fg/45">
              {total > 0 ? `${total} contributions` : 'no activity'}
              {meta && (
                <>
                  <span className="mx-1.5 text-picks-fg/20">·</span>
                  {meta}
                </>
              )}
            </p>
          </div>
          {showLegend && (
            <div className="flex items-center gap-1.5 text-[10px] text-picks-fg/45">
              <span>Less</span>
              {[0, 1, 2, 3, 4].map((lvl) => (
                <span
                  key={lvl}
                  className="block h-2.5 w-2.5 rounded-[3px]"
                  style={{ background: colorAt(lvl) }}
                />
              ))}
              <span>More</span>
            </div>
          )}
        </div>
      )}

      <div className="flex gap-2">
        {/* Weekday axis */}
        {showWeekdays && (
          <div className="flex flex-col justify-between pt-[18px] text-[10px] text-picks-fg/35">
            {/* Only show every other weekday to avoid clutter */}
            {WEEKDAY_LABELS.map((d, i) => (
              <span
                key={d}
                className={cn(
                  'h-[10px] leading-[10px]',
                  i % 2 === 1 ? 'opacity-80' : 'opacity-0',
                )}
              >
                {d}
              </span>
            ))}
          </div>
        )}

        {/* Grid + month axis */}
        <div className="min-w-0 flex-1">
          {showMonths && (
            <div
              className="relative mb-1.5 h-[14px] text-[10px] text-picks-fg/45"
              aria-hidden
            >
              {monthMarkers.map((m) => (
                <span
                  key={`${m.col}-${m.label}`}
                  className="absolute top-0 whitespace-nowrap"
                  style={{ left: `${(m.col / Math.max(1, grid.length)) * 100}%` }}
                >
                  {m.label}
                </span>
              ))}
            </div>
          )}
          <div
            className="grid gap-[3px]"
            style={{
              gridTemplateColumns: `repeat(${grid.length}, minmax(0, 1fr))`,
              gridAutoFlow: 'column',
            }}
          >
            {grid.flatMap((week, wi) =>
              week.map((cell, di) => {
                const level = intensityFor(cell?.value ?? 0, max)
                const isFuture = cell === null && wi === grid.length - 1
                return (
                  <button
                    key={`${wi}-${di}`}
                    type="button"
                    onClick={() => cell && onCellClick?.(cell)}
                    disabled={!cell}
                    title={
                      cell
                        ? `${cell.date} — ${cell.value} contribution${cell.value === 1 ? '' : 's'}`
                        : ''
                    }
                    aria-label={
                      cell
                        ? `${cell.date} — ${cell.value} contribution${cell.value === 1 ? '' : 's'}`
                        : 'No data'
                    }
                    className={cn(
                      'aspect-square rounded-[3px] outline-none transition-colors',
                      cell ? 'cursor-pointer hover:ring-1' : 'cursor-default',
                      isFuture && 'opacity-30',
                    )}
                    style={
                      {
                        background: colorAt(level),
                        gridRow: di + 1,
                        gridColumn: wi + 1,
                        ['--tw-ring-color' as string]: accentColor,
                      } as React.CSSProperties
                    }
                  />
                )
              }),
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
