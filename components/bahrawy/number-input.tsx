'use client'

/**
 * <NumberInput />
 *
 * Animated number input built on shadcn `<Input />` and `<Button />` primitives
 * with Framer Motion transitions. Supports keyboard increment (arrow keys,
 * Shift = x10), long-press on +/- buttons, precision rounding, and
 * `Intl.NumberFormat` formatting on blur.
 *
 * | Prop        | Type                              | Default | Description                                                 |
 * | ----------- | --------------------------------- | ------- | ----------------------------------------------------------- |
 * | value       | number \| null                     | required | Controlled value. `null` represents an empty input.         |
 * | onChange     | (value: number \| null) => void    | required | Fires on any value change (typing, buttons, keyboard).      |
 * | min         | number                            | -Infinity | Minimum allowed value (inclusive). Clamped on blur.          |
 * | max         | number                            | +Infinity | Maximum allowed value (inclusive). Clamped on blur.          |
 * | step        | number                            | 1       | Increment used by buttons and arrow keys.                   |
 * | precision   | number                            | 0       | Decimal places to round to.                                 |
 * | prefix      | string                            | —       | Leading symbol rendered inside the input (e.g. "$").        |
 * | suffix      | string                            | —       | Trailing symbol rendered inside the input (e.g. "kg").      |
 * | locale      | string                            | 'en-US' | `Intl.NumberFormat` locale used for blur formatting.        |
 * | disabled    | boolean                           | false   | Disables all interaction.                                   |
 * | error       | boolean                           | false   | Renders error styling and triggers a shake animation.       |
 * | placeholder | string                            | —       | Placeholder text shown when value is null.                  |
 * | id          | string                            | —       | Forwarded to the underlying `<input>` for label `htmlFor`.  |
 * | className   | string                            | —       | Additional class names for the outer wrapper.               |
 */

import * as React from 'react'
import { Minus, Plus } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { springSnappy, fadeUp } from '@/lib/motion'

/* -------------------------------- Props -------------------------------- */

export interface NumberInputProps {
  value: number | null
  onChange: (value: number | null) => void
  min?: number
  max?: number
  step?: number
  precision?: number
  prefix?: string
  suffix?: string
  locale?: string
  disabled?: boolean
  error?: boolean
  placeholder?: string
  id?: string
  className?: string
}

/* ------------------------------ Constants ------------------------------ */

const LONG_PRESS_DELAY = 350
const LONG_PRESS_INTERVAL = 60

const MotionButton = motion.create(Button)

/* ------------------------------ Helpers -------------------------------- */

function clamp(n: number, lo: number, hi: number) {
  return Math.min(Math.max(n, lo), hi)
}

function roundTo(value: number, precision: number) {
  const factor = 10 ** precision
  return Math.round(value * factor) / factor
}

/* ------------------------------ Component ------------------------------ */

export function NumberInput({
  value,
  onChange,
  min = Number.NEGATIVE_INFINITY,
  max = Number.POSITIVE_INFINITY,
  step = 1,
  precision = 0,
  prefix,
  suffix,
  locale = 'en-US',
  disabled = false,
  error = false,
  placeholder,
  id,
  className,
}: NumberInputProps) {
  const [raw, setRaw] = React.useState<string>(() =>
    value === null ? '' : String(value)
  )
  const [focused, setFocused] = React.useState(false)
  const longPressTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null)
  const longPressInterval = React.useRef<ReturnType<typeof setInterval> | null>(null)

  /* Keep an up-to-date ref of `value` so long-press intervals always read
     the latest value without needing to restart the interval. */
  const valueRef = React.useRef(value)
  React.useEffect(() => {
    valueRef.current = value
  }, [value])

  // Sync external value -> raw when not focused
  React.useEffect(() => {
    if (!focused) {
      setRaw(value === null ? '' : String(value))
    }
  }, [value, focused])

  const formatter = React.useMemo(
    () =>
      new Intl.NumberFormat(locale, {
        minimumFractionDigits: precision,
        maximumFractionDigits: precision,
      }),
    [locale, precision]
  )

  /* ----------------------------- Actions ------------------------------ */

  const commit = React.useCallback(
    (next: number | null) => {
      if (next === null) {
        onChange(null)
        return
      }
      const clamped = clamp(next, min, max)
      onChange(roundTo(clamped, precision))
    },
    [onChange, min, max, precision]
  )

  const bump = React.useCallback(
    (delta: number) => {
      const base = valueRef.current ?? 0
      commit(base + delta)
    },
    [commit]
  )

  const startLongPress = React.useCallback(
    (delta: number) => {
      bump(delta)
      longPressTimer.current = setTimeout(() => {
        longPressInterval.current = setInterval(
          () => bump(delta),
          LONG_PRESS_INTERVAL
        )
      }, LONG_PRESS_DELAY)
    },
    [bump]
  )

  const stopLongPress = React.useCallback(() => {
    if (longPressTimer.current) clearTimeout(longPressTimer.current)
    if (longPressInterval.current) clearInterval(longPressInterval.current)
    longPressTimer.current = null
    longPressInterval.current = null
  }, [])

  // Cleanup on unmount
  React.useEffect(() => stopLongPress, [stopLongPress])

  /* ----------------------------- Handlers ----------------------------- */

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const multiplier = e.shiftKey ? 10 : 1
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      bump(step * multiplier)
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      bump(-step * multiplier)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const next = e.target.value
    // Allow empty, leading minus, and partial decimals so users can type freely
    if (next === '' || next === '-' || next === '.') {
      setRaw(next)
      onChange(null)
      return
    }
    // Permit digits, single decimal, optional leading minus
    if (!/^-?\d*\.?\d*$/.test(next)) return
    setRaw(next)
    const parsed = Number(next)
    if (Number.isFinite(parsed)) {
      // Don't clamp on keystroke — user may be mid-typing past min/max
      onChange(roundTo(parsed, precision))
    }
  }

  const handleBlur = () => {
    setFocused(false)
    if (value === null) {
      setRaw('')
      return
    }
    const clamped = clamp(value, min, max)
    const rounded = roundTo(clamped, precision)
    if (rounded !== value) onChange(rounded)
    setRaw(formatter.format(rounded))
  }

  const handleFocus = () => {
    setFocused(true)
    if (value !== null) setRaw(String(value))
  }

  /* ------------------------------ Derived ----------------------------- */

  const atMax = value !== null && value >= max
  const atMin = value !== null && value <= min

  // Display value for the AnimatePresence overlay (only when unfocused)
  const displayValue =
    !focused && value !== null ? formatter.format(value) : null

  /* ------------------------------- JSX -------------------------------- */

  return (
    <motion.div
      animate={
        error
          ? { x: [0, -4, 4, -4, 4, 0] }
          : { x: 0 }
      }
      transition={springSnappy}
      className={cn(
        'group relative inline-flex h-10 w-full items-stretch rounded-lg border border-zinc-800 bg-transparent text-sm text-white transition-colors',
        'focus-within:ring-1 focus-within:ring-zinc-600',
        error && 'border-rose-500/60 ring-1 ring-rose-500/30',
        disabled && 'cursor-not-allowed opacity-50',
        className
      )}
    >
      {/* -------- Decrement button -------- */}
      <MotionButton
        type="button"
        variant="ghost"
        aria-label="Decrement"
        disabled={disabled || atMin}
        tabIndex={-1}
        whileTap={{ scale: 0.9 }}
        transition={springSnappy}
        onMouseDown={(e: React.MouseEvent) => {
          e.preventDefault()
          if (!disabled && !atMin) startLongPress(-step)
        }}
        onMouseUp={stopLongPress}
        onMouseLeave={stopLongPress}
        onTouchStart={(e: React.TouchEvent) => {
          e.preventDefault()
          if (!disabled && !atMin) startLongPress(-step)
        }}
        onTouchEnd={stopLongPress}
        className="h-full w-10 shrink-0 rounded-none rounded-l-lg border-r border-zinc-800 text-zinc-400 hover:text-white"
      >
        <Minus className="h-3.5 w-3.5" />
      </MotionButton>

      {/* -------- Input area -------- */}
      <div className="relative flex flex-1 items-center overflow-hidden">
        {prefix && (
          <span
            aria-hidden
            className="pointer-events-none select-none pl-3 text-zinc-500"
          >
            {prefix}
          </span>
        )}

        <div className="relative flex-1">
          <Input
            id={id}
            inputMode="decimal"
            value={raw}
            placeholder={placeholder}
            disabled={disabled}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onFocus={handleFocus}
            onBlur={handleBlur}
            className={cn(
              'h-full w-full border-0 bg-transparent text-center font-mono tabular-nums shadow-none',
              'focus-visible:ring-0',
              !focused && value !== null && 'text-transparent caret-transparent',
              prefix && 'pl-1',
              suffix && 'pr-1'
            )}
          />

          {/* Animated value overlay (shown when unfocused) */}
          {!focused && (
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 flex items-center justify-center font-mono tabular-nums"
            >
              <AnimatePresence mode="popLayout">
                {displayValue !== null && (
                  <motion.span
                    key={displayValue}
                    initial={fadeUp.initial}
                    animate={fadeUp.animate}
                    exit={fadeUp.exit}
                    transition={springSnappy}
                    className="text-white"
                  >
                    {displayValue}
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>

        {suffix && (
          <span
            aria-hidden
            className="pointer-events-none select-none pr-3 text-zinc-500"
          >
            {suffix}
          </span>
        )}
      </div>

      {/* -------- Increment button -------- */}
      <MotionButton
        type="button"
        variant="ghost"
        aria-label="Increment"
        disabled={disabled || atMax}
        tabIndex={-1}
        whileTap={{ scale: 0.9 }}
        transition={springSnappy}
        onMouseDown={(e: React.MouseEvent) => {
          e.preventDefault()
          if (!disabled && !atMax) startLongPress(step)
        }}
        onMouseUp={stopLongPress}
        onMouseLeave={stopLongPress}
        onTouchStart={(e: React.TouchEvent) => {
          e.preventDefault()
          if (!disabled && !atMax) startLongPress(step)
        }}
        onTouchEnd={stopLongPress}
        className="h-full w-10 shrink-0 rounded-none rounded-r-lg border-l border-zinc-800 text-zinc-400 hover:text-white"
      >
        <Plus className="h-3.5 w-3.5" />
      </MotionButton>
    </motion.div>
  )
}
