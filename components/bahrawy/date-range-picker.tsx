'use client'

/**
 * <DateRangePicker />
 *
 * Two-month range picker built on shadcn Calendar (react-day-picker v9).
 * Includes animated preset shortcuts, popover on desktop, drawer on mobile,
 * and a formatted trigger button.
 *
 * @param value - Currently selected date range (`DateRange | undefined`).
 * @param onChange - Callback fired when the selection changes.
 * @param minDate - Earliest selectable date. Dates before this are disabled.
 * @param maxDate - Latest selectable date. Dates after this are disabled.
 * @param disabledDates - Array of specific dates to disable.
 * @param presets - Quick-pick shortcuts shown alongside the calendar.
 *   Defaults to Today, Last 7 days, Last 30 days, and This month.
 * @param placeholder - Trigger text when nothing is selected. Defaults to "Select date range".
 * @param disabled - Disables the trigger button.
 * @param align - Popover alignment relative to trigger (`'start' | 'center' | 'end'`).
 * @param className - Additional class names applied to the trigger button.
 */

import * as React from 'react'
import {
  endOfMonth,
  format,
  isAfter,
  isBefore,
  startOfMonth,
  startOfToday,
  subDays,
} from 'date-fns'
import { motion } from 'framer-motion'
import { CalendarIcon } from 'lucide-react'
import type { DateRange } from 'react-day-picker'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { springSnappy } from '@/lib/motion'
import { cn } from '@/lib/utils'

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface DateRangePreset {
  label: string
  range: () => DateRange
}

export interface DateRangePickerProps {
  value: DateRange | undefined
  onChange: (value: DateRange | undefined) => void
  minDate?: Date
  maxDate?: Date
  disabledDates?: Date[]
  presets?: DateRangePreset[]
  placeholder?: string
  disabled?: boolean
  align?: 'start' | 'center' | 'end'
  className?: string
}

/* ------------------------------------------------------------------ */
/*  Default presets                                                     */
/* ------------------------------------------------------------------ */

const DEFAULT_PRESETS: DateRangePreset[] = [
  {
    label: 'Today',
    range: () => ({ from: startOfToday(), to: startOfToday() }),
  },
  {
    label: 'Last 7 days',
    range: () => ({ from: subDays(startOfToday(), 6), to: startOfToday() }),
  },
  {
    label: 'Last 30 days',
    range: () => ({ from: subDays(startOfToday(), 29), to: startOfToday() }),
  },
  {
    label: 'This month',
    range: () => ({
      from: startOfMonth(startOfToday()),
      to: endOfMonth(startOfToday()),
    }),
  },
]

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

/**
 * Formats a `DateRange` into human-readable text for the trigger button.
 * Omits the year on the "from" side when both dates share the same year.
 */
function formatRange(range: DateRange | undefined, placeholder: string): string {
  if (!range?.from) return placeholder
  if (!range.to) return format(range.from, 'MMM d, yyyy')
  const sameYear = range.from.getFullYear() === range.to.getFullYear()
  const fromPattern = sameYear ? 'MMM d' : 'MMM d, yyyy'
  return `${format(range.from, fromPattern)} – ${format(range.to, 'MMM d, yyyy')}`
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function DateRangePicker({
  value,
  onChange,
  minDate,
  maxDate,
  disabledDates,
  presets = DEFAULT_PRESETS,
  placeholder = 'Select date range',
  disabled = false,
  align = 'start',
  className,
}: DateRangePickerProps) {
  const [open, setOpen] = React.useState(false)

  // `mounted` keeps SSR and the first client render aligned (both render the
  // desktop Popover). After hydration we read the media query and may swap to
  // the Drawer — by then React no longer compares against server HTML.
  const [mounted, setMounted] = React.useState(false)
  const [isMobile, setIsMobile] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
    const mq = window.matchMedia('(max-width: 767px)')
    const update = () => setIsMobile(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  const disabledMatcher = React.useCallback(
    (date: Date) => {
      if (minDate && isBefore(date, minDate)) return true
      if (maxDate && isAfter(date, maxDate)) return true
      if (disabledDates) {
        return disabledDates.some(
          (d) => d.toDateString() === date.toDateString()
        )
      }
      return false
    },
    [minDate, maxDate, disabledDates]
  )

  const labelText = formatRange(value, placeholder)
  const hasSelection = !!value?.from

  /* ---- Trigger --------------------------------------------------- */

  const TriggerButton = (
    <Button
      variant="outline"
      disabled={disabled}
      className={cn(
        'w-full max-w-sm justify-start gap-2 text-left font-normal',
        !hasSelection && 'text-zinc-400',
        className
      )}
    >
      <CalendarIcon className="h-4 w-4" />
      <span className="truncate">{labelText}</span>
    </Button>
  )

  /* ---- Presets sidebar / strip ------------------------------------ */

  const PresetButtons = presets.length > 0 && (
    <div className="flex shrink-0 flex-wrap gap-1 border-b border-zinc-800 p-3 sm:w-36 sm:flex-col sm:flex-nowrap sm:border-b-0 sm:border-r">
      {presets.map((preset) => (
        <motion.button
          key={preset.label}
          type="button"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          transition={springSnappy}
          onClick={() => {
            onChange(preset.range())
            setOpen(false)
          }}
          className="rounded-md px-2 py-1.5 text-left text-xs text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-white"
        >
          {preset.label}
        </motion.button>
      ))}
    </div>
  )

  /* ---- Body (calendar + presets) ---------------------------------- */

  const Body = (
    <div className="flex flex-col sm:flex-row">
      {PresetButtons}
      <Calendar
        mode="range"
        selected={value}
        onSelect={onChange}
        numberOfMonths={isMobile ? 1 : 2}
        disabled={disabledMatcher}
        defaultMonth={value?.from ?? new Date()}
      />
    </div>
  )

  /* ---- Mobile: Drawer -------------------------------------------- */

  if (mounted && isMobile) {
    return (
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>{TriggerButton}</DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Select date range</DrawerTitle>
          </DrawerHeader>
          <div className="px-4 pb-6">{Body}</div>
        </DrawerContent>
      </Drawer>
    )
  }

  /* ---- Desktop: Popover ------------------------------------------ */

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>{TriggerButton}</PopoverTrigger>
      <PopoverContent className="w-auto p-0" align={align}>
        {Body}
      </PopoverContent>
    </Popover>
  )
}
