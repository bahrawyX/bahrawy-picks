'use client'

/**
 * <Calendar />  —  Apple-style standalone month-grid date picker.
 *
 * Single-date selection by default; pass `mode="multiple"` to select
 * an array of dates. Month / year navigation in the header, today
 * highlight, locale-aware weekday names, layoutId-driven selection
 * indicator that glides between days.
 *
 * Keyboard: the day grid is a roving-tabindex ARIA grid — arrows move
 * day focus (±1 / ±7), Home / End jump to week start / end, PageUp /
 * PageDown change month, Enter / Space select the focused day.
 */

import * as React from 'react'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

type SingleProps = {
  mode?: 'single'
  value?: Date | null
  defaultValue?: Date | null
  onValueChange?: (next: Date | null) => void
}

type MultipleProps = {
  mode: 'multiple'
  value?: Date[]
  defaultValue?: Date[]
  onValueChange?: (next: Date[]) => void
}

export type CalendarProps = (SingleProps | MultipleProps) & {
  /** Initial visible month. */
  defaultMonth?: Date
  /** First day of the week: 0 = Sun, 1 = Mon … Default 0. */
  weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6
  /** Locale for day / month names. Default browser. */
  locale?: string
  /** Function returning `true` for dates that should be disabled. */
  isDateDisabled?: (date: Date) => boolean
  className?: string
}

const SPRING = { type: 'spring' as const, stiffness: 460, damping: 32, mass: 0.55 }

function startOfDay(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate())
}
function isSameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
}
function startOfMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), 1)
}
function addMonths(d: Date, n: number) {
  return new Date(d.getFullYear(), d.getMonth() + n, 1)
}
function addDays(d: Date, n: number) {
  const next = new Date(d)
  next.setDate(d.getDate() + n)
  return next
}
/** Same day-of-month `n` months away, clamped to the target month length. */
function addMonthsClamped(d: Date, n: number) {
  const lastDay = new Date(d.getFullYear(), d.getMonth() + n + 1, 0).getDate()
  return new Date(d.getFullYear(), d.getMonth() + n, Math.min(d.getDate(), lastDay))
}
function dayKey(d: Date) {
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`
}

function buildMonthGrid(view: Date, weekStartsOn: number): Date[] {
  const first = startOfMonth(view)
  const firstWeekday = first.getDay()
  const lead = (firstWeekday - weekStartsOn + 7) % 7
  // 6 weeks * 7 days = 42 cells
  const start = new Date(first)
  start.setDate(1 - lead)
  const days: Date[] = []
  for (let i = 0; i < 42; i++) {
    const d = new Date(start)
    d.setDate(start.getDate() + i)
    days.push(d)
  }
  return days
}

function weekdayHeaders(weekStartsOn: number, locale?: string) {
  const fmt = new Intl.DateTimeFormat(locale, { weekday: 'short' })
  const base = new Date(2024, 0, 7) // a Sunday
  const out: string[] = []
  for (let i = 0; i < 7; i++) {
    const d = new Date(base)
    d.setDate(base.getDate() + ((i + weekStartsOn) % 7))
    out.push(fmt.format(d).replace(/\.$/, ''))
  }
  return out
}

export function Calendar(props: CalendarProps) {
  const {
    defaultMonth,
    weekStartsOn = 0,
    locale,
    isDateDisabled,
    className,
  } = props
  const mode = props.mode ?? 'single'

  const [view, setView] = React.useState<Date>(
    startOfMonth(defaultMonth ?? new Date()),
  )

  // Controlled / uncontrolled state
  const [internal, setInternal] = React.useState<Date | null | Date[]>(() =>
    mode === 'multiple'
      ? ((props as MultipleProps).defaultValue ?? [])
      : ((props as SingleProps).defaultValue ?? null),
  )
  const controlled = (props as { value?: Date | null | Date[] }).value
  const value = controlled !== undefined ? controlled : internal

  const commit = (next: Date | null | Date[]) => {
    if (controlled === undefined) setInternal(next)
    if (mode === 'multiple') (props as MultipleProps).onValueChange?.(next as Date[])
    else (props as SingleProps).onValueChange?.(next as Date | null)
  }

  const isSelected = (d: Date) => {
    if (mode === 'multiple') {
      return (value as Date[]).some((x) => isSameDay(x, d))
    }
    return value ? isSameDay(value as Date, d) : false
  }

  const onPickDay = (d: Date) => {
    if (isDateDisabled?.(d)) return
    if (mode === 'multiple') {
      const cur = (value as Date[]) ?? []
      const has = cur.some((x) => isSameDay(x, d))
      const next = has ? cur.filter((x) => !isSameDay(x, d)) : [...cur, d]
      commit(next)
    } else {
      const cur = value as Date | null
      commit(cur && isSameDay(cur, d) ? null : startOfDay(d))
    }
  }

  const today = startOfDay(new Date())
  const monthName = new Intl.DateTimeFormat(locale, {
    month: 'long',
    year: 'numeric',
  }).format(view)
  const days = React.useMemo(
    () => buildMonthGrid(view, weekStartsOn),
    [view, weekStartsOn],
  )
  const dows = React.useMemo(
    () => weekdayHeaders(weekStartsOn, locale),
    [weekStartsOn, locale],
  )
  const weeks = React.useMemo(() => {
    const out: Date[][] = []
    for (let i = 0; i < days.length; i += 7) out.push(days.slice(i, i + 7))
    return out
  }, [days])
  const id = React.useId()

  // ---- Roving focus over the day grid ----
  // Exactly one day is tabbable; arrows move focus ±1 / ±7 days, Home /
  // End jump to week bounds, PageUp / PageDown move a month. Navigating
  // onto a day outside the visible month flips the view to follow.
  const [focusedDate, setFocusedDate] = React.useState<Date>(() =>
    startOfDay(defaultMonth ?? new Date()),
  )
  const dayRefs = React.useRef(new Map<string, HTMLButtonElement>())
  const pendingFocusRef = React.useRef(false)

  const tabbableDate = days.some((d) => isSameDay(d, focusedDate))
    ? focusedDate
    : startOfMonth(view)

  const moveFocus = (next: Date) => {
    const target = startOfDay(next)
    pendingFocusRef.current = true
    setFocusedDate(target)
    if (
      target.getMonth() !== view.getMonth() ||
      target.getFullYear() !== view.getFullYear()
    ) {
      setView(startOfMonth(target))
    }
  }

  React.useEffect(() => {
    if (!pendingFocusRef.current) return
    pendingFocusRef.current = false
    dayRefs.current.get(dayKey(focusedDate))?.focus()
  }, [focusedDate, view])

  const handleGridKeyDown = (e: React.KeyboardEvent) => {
    const weekOffset = (focusedDate.getDay() - weekStartsOn + 7) % 7
    let next: Date | null = null
    switch (e.key) {
      case 'ArrowRight':
        next = addDays(focusedDate, 1)
        break
      case 'ArrowLeft':
        next = addDays(focusedDate, -1)
        break
      case 'ArrowDown':
        next = addDays(focusedDate, 7)
        break
      case 'ArrowUp':
        next = addDays(focusedDate, -7)
        break
      case 'Home':
        next = addDays(focusedDate, -weekOffset)
        break
      case 'End':
        next = addDays(focusedDate, 6 - weekOffset)
        break
      case 'PageUp':
        next = addMonthsClamped(focusedDate, -1)
        break
      case 'PageDown':
        next = addMonthsClamped(focusedDate, 1)
        break
      default:
        return
    }
    e.preventDefault()
    moveFocus(next)
  }

  const dayLabelFmt = React.useMemo(
    () =>
      new Intl.DateTimeFormat(locale, {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      }),
    [locale],
  )

  return (
    <div
      className={cn(
        'inline-block rounded-2xl border border-picks-fg/[0.08] p-3 backdrop-blur-xl',
        className,
      )}
      style={{
        background:
          'linear-gradient(180deg, rgba(28,28,32,0.92) 0%, rgba(20,20,22,0.96) 100%)',
        boxShadow:
          '0 1px 0 rgba(255,255,255,0.05) inset, 0 0 0 0.5px rgba(255,255,255,0.04), 0 18px 40px -12px rgba(0,0,0,0.45)',
      }}
    >
      {/* Header */}
      <header className="mb-2 flex items-center justify-between px-1">
        <button
          type="button"
          onClick={() => setView((v) => addMonths(v, -1))}
          aria-label="Previous month"
          className="inline-flex h-7 w-7 items-center justify-center rounded-full text-picks-fg/65 transition-colors hover:bg-picks-fg/[0.06] hover:text-picks-fg"
        >
          <ChevronLeft className="h-3.5 w-3.5" strokeWidth={2.25} />
        </button>
        <span className="font-display text-[13px] font-semibold tracking-tight text-picks-fg">
          {monthName}
        </span>
        <button
          type="button"
          onClick={() => setView((v) => addMonths(v, 1))}
          aria-label="Next month"
          className="inline-flex h-7 w-7 items-center justify-center rounded-full text-picks-fg/65 transition-colors hover:bg-picks-fg/[0.06] hover:text-picks-fg"
        >
          <ChevronRight className="h-3.5 w-3.5" strokeWidth={2.25} />
        </button>
      </header>

      {/* Day grid — ARIA grid with weekday header row + 6 week rows */}
      <div role="grid" aria-label={monthName} onKeyDown={handleGridKeyDown}>
        {/* Weekday headers */}
        <div role="row" className="mb-1 grid grid-cols-7 px-0.5">
          {dows.map((d) => (
            <span
              key={d}
              role="columnheader"
              className="py-1 text-center text-[10.5px] font-medium uppercase tracking-[0.12em] text-picks-fg/35"
            >
              {d}
            </span>
          ))}
        </div>

        <div role="rowgroup" className="flex flex-col gap-0.5">
          {weeks.map((week) => (
            <div
              key={week[0].toISOString()}
              role="row"
              className="grid grid-cols-7 gap-0.5"
            >
              {week.map((d) => {
                const inMonth = d.getMonth() === view.getMonth()
                const selected = isSelected(d)
                const isToday = isSameDay(d, today)
                const disabled = isDateDisabled?.(d) ?? false
                const key = dayKey(d)
                return (
                  <button
                    key={key}
                    ref={(el) => {
                      if (el) dayRefs.current.set(key, el)
                      else dayRefs.current.delete(key)
                    }}
                    type="button"
                    role="gridcell"
                    onClick={() => onPickDay(d)}
                    onFocus={() => setFocusedDate(startOfDay(d))}
                    tabIndex={isSameDay(d, tabbableDate) ? 0 : -1}
                    aria-disabled={disabled || undefined}
                    aria-selected={selected}
                    aria-label={dayLabelFmt.format(d)}
                    className={cn(
                      'relative inline-flex h-9 w-9 items-center justify-center rounded-full text-[12.5px] tabular-nums tracking-tight transition-colors outline-none focus-visible:ring-2 focus-visible:ring-picks-fg/60',
                      disabled && 'cursor-not-allowed opacity-30',
                      !inMonth && 'text-picks-fg/25',
                      inMonth && !selected && !disabled && 'text-picks-fg/85 hover:bg-picks-fg/[0.06]',
                      selected && 'text-picks-fg',
                      isToday && !selected && 'text-[#5E5CE6]',
                    )}
                  >
                    {selected && (
                      <motion.span
                        // In multiple mode several selected days are visible at once,
                        // so a shared layoutId would animate one pill between them.
                        {...(mode === 'single' ? { layoutId: `calendar-selected-${id}` } : {})}
                        className="absolute inset-0 rounded-full"
                        style={{
                          background:
                            'linear-gradient(180deg, rgba(255,255,255,0.16) 0%, rgba(255,255,255,0.08) 100%)',
                          boxShadow:
                            '0 1px 0 rgba(255,255,255,0.18) inset, 0 0 0 0.5px rgba(255,255,255,0.15)',
                        }}
                        transition={SPRING}
                      />
                    )}
                    {isToday && !selected && (
                      <span
                        aria-hidden
                        className="absolute bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-[#5E5CE6]"
                      />
                    )}
                    <span className="relative">{d.getDate()}</span>
                  </button>
                )
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
