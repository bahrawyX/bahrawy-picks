'use client'

/**
 * <DateRangePicker />
 *
 * Two-month range picker built on react-day-picker v9. Includes preset
 * shortcuts, popover on desktop, drawer on mobile, and a formatted trigger.
 *
 * | Prop          | Type                              | Default                          | Description                                  |
 * | ------------- | --------------------------------- | -------------------------------- | -------------------------------------------- |
 * | value         | DateRange \| undefined            | required                         | Currently selected range.                    |
 * | onChange      | (value: DateRange \| undefined) => void | required                   | Fires when the selection changes.            |
 * | minDate       | Date                              | —                                | Earliest selectable date.                    |
 * | maxDate       | Date                              | —                                | Latest selectable date.                      |
 * | disabledDates | Date[]                            | []                               | Specific dates to disable.                   |
 * | presets       | DateRangePreset[]                 | Today / 7d / 30d / This month    | Quick-pick shortcuts shown in the side rail. |
 * | placeholder   | string                            | 'Select date range'              | Trigger text when nothing is selected.       |
 * | disabled      | boolean                           | false                            | Disable the trigger.                         |
 * | className     | string                            | —                                | Applied to the trigger button.               |
 * | align         | 'start' \| 'center' \| 'end'      | 'start'                          | Popover alignment relative to trigger.       |
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
import { CalendarIcon } from 'lucide-react'
import type { DateRange } from 'react-day-picker'
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
import { cn } from '@/lib/utils'

export interface DateRangePreset {
  label: string
  range: () => DateRange
}

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

export interface DateRangePickerProps {
  value: DateRange | undefined
  onChange: (value: DateRange | undefined) => void
  minDate?: Date
  maxDate?: Date
  disabledDates?: Date[]
  presets?: DateRangePreset[]
  placeholder?: string
  disabled?: boolean
  className?: string
  align?: 'start' | 'center' | 'end'
}

function formatRange(range: DateRange | undefined, placeholder: string) {
  if (!range?.from) return placeholder
  if (!range.to) return format(range.from, 'MMM d, yyyy')
  const sameYear = range.from.getFullYear() === range.to.getFullYear()
  const fromPattern = sameYear ? 'MMM d' : 'MMM d, yyyy'
  return `${format(range.from, fromPattern)} – ${format(range.to, 'MMM d, yyyy')}`
}

export function DateRangePicker({
  value,
  onChange,
  minDate,
  maxDate,
  disabledDates,
  presets = DEFAULT_PRESETS,
  placeholder = 'Select date range',
  disabled = false,
  className,
  align = 'start',
}: DateRangePickerProps) {
  const [open, setOpen] = React.useState(false)
  // `mounted` keeps SSR + first client render aligned (both render the
  // desktop Popover). After hydration we read the media query and may swap
  // to the Drawer — by then React no longer compares against server HTML.
  const [mounted, setMounted] = React.useState(false)
  const [isMobile, setIsMobile] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
    const mq = window.matchMedia('(max-width: 640px)')
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

  const Trigger = (
    <button
      type="button"
      disabled={disabled}
      aria-haspopup="dialog"
      aria-expanded={open}
      className={cn(
        'inline-flex h-10 w-full max-w-sm items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-3 text-left text-sm transition-colors duration-m3-enter ease-m3-enter',
        'hover:bg-white/[0.06] focus-visible:outline-none focus-visible:border-white/40',
        hasSelection ? 'text-white' : 'text-white/40',
        disabled && 'cursor-not-allowed opacity-50',
        className
      )}
    >
      <CalendarIcon className="h-4 w-4 text-white/50" />
      <span className="truncate">{labelText}</span>
    </button>
  )

  const Body = (
    <div className="flex flex-col sm:flex-row">
      {presets.length > 0 && (
        <div className="flex shrink-0 flex-wrap gap-1 border-b border-white/10 p-3 sm:flex-col sm:flex-nowrap sm:border-b-0 sm:border-r sm:w-36">
          {presets.map((preset) => (
            <button
              key={preset.label}
              type="button"
              onClick={() => {
                onChange(preset.range())
                setOpen(false)
              }}
              className="rounded-md px-2 py-1.5 text-left text-xs text-white/70 transition-colors duration-m3-enter ease-m3-enter hover:bg-white/[0.06] hover:text-white"
            >
              {preset.label}
            </button>
          ))}
        </div>
      )}
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

  if (mounted && isMobile) {
    return (
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>{Trigger}</DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Select date range</DrawerTitle>
          </DrawerHeader>
          <div className="px-4 pb-6">{Body}</div>
        </DrawerContent>
      </Drawer>
    )
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>{Trigger}</PopoverTrigger>
      <PopoverContent className="w-auto p-0" align={align}>
        {Body}
      </PopoverContent>
    </Popover>
  )
}
