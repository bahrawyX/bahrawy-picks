'use client'

import * as React from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { DayPicker } from 'react-day-picker'
import { cn } from '@/lib/utils'

export type CalendarProps = React.ComponentProps<typeof DayPicker>

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn('p-3', className)}
      classNames={{
        months: 'flex flex-col sm:flex-row gap-6',
        month: 'flex flex-col gap-3',
        month_caption: 'flex items-center justify-center pt-1 relative h-8',
        caption_label: 'text-sm font-medium text-white',
        nav: 'flex items-center gap-1 absolute inset-x-0 top-1 justify-between px-1',
        button_previous: cn(
          'inline-flex h-7 w-7 items-center justify-center rounded-md border border-white/10 bg-white/[0.03] text-white/70 transition-colors duration-m3-enter ease-m3-enter hover:bg-white/[0.08] hover:text-white disabled:opacity-30'
        ),
        button_next: cn(
          'inline-flex h-7 w-7 items-center justify-center rounded-md border border-white/10 bg-white/[0.03] text-white/70 transition-colors duration-m3-enter ease-m3-enter hover:bg-white/[0.08] hover:text-white disabled:opacity-30'
        ),
        month_grid: 'w-full border-collapse',
        weekdays: 'flex',
        weekday:
          'w-9 text-center text-[11px] font-medium uppercase tracking-wider text-white/40',
        week: 'flex w-full mt-1.5',
        day: 'relative w-9 h-9 p-0 text-center text-sm focus-within:relative focus-within:z-20',
        day_button: cn(
          'inline-flex h-9 w-9 items-center justify-center rounded-md text-sm text-white/80 transition-colors duration-m3-enter ease-m3-enter',
          'hover:bg-white/[0.08] hover:text-white',
          'aria-selected:opacity-100',
          'disabled:pointer-events-none disabled:opacity-30'
        ),
        selected:
          'bg-white text-black hover:bg-white hover:text-black [&>button]:bg-white [&>button]:text-black [&>button]:hover:bg-white',
        today: 'text-rose-400 font-semibold',
        outside: 'text-white/20',
        disabled: 'text-white/15 line-through',
        range_start:
          'rounded-l-md bg-white text-black [&>button]:bg-white [&>button]:text-black [&>button]:rounded-l-md [&>button]:rounded-r-none',
        range_end:
          'rounded-r-md bg-white text-black [&>button]:bg-white [&>button]:text-black [&>button]:rounded-r-md [&>button]:rounded-l-none',
        range_middle:
          'bg-white/15 text-white [&>button]:bg-transparent [&>button]:text-white [&>button]:rounded-none',
        hidden: 'invisible',
        ...classNames,
      }}
      components={{
        Chevron: ({ orientation, ...rest }) =>
          orientation === 'left' ? (
            <ChevronLeft className="h-4 w-4" {...rest} />
          ) : (
            <ChevronRight className="h-4 w-4" {...rest} />
          ),
      }}
      {...props}
    />
  )
}
Calendar.displayName = 'Calendar'

export { Calendar }
