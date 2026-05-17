'use client'

/**
 * <NumberInput />
 *
 * Headless number input built on the shadcn-style <Input /> primitive. Supports
 * keyboard increment (arrow keys, shift = ×10), long-press on +/- buttons,
 * precision rounding, and Intl.NumberFormat formatting on blur.
 *
 * | Prop        | Type                       | Default | Description                                                |
 * | ----------- | -------------------------- | ------- | ---------------------------------------------------------- |
 * | value       | number \| null              | required | Controlled value. `null` represents an empty input.        |
 * | onChange    | (next: number \| null) => void | required | Fires on any value change (typing, buttons, keyboard).     |
 * | min         | number                     | -∞      | Minimum allowed value (inclusive).                         |
 * | max         | number                     | +∞      | Maximum allowed value (inclusive).                         |
 * | step        | number                     | 1       | Increment used by buttons + arrow keys.                    |
 * | precision   | number                     | 0       | Decimal places to clamp to.                                |
 * | prefix      | string                     | —       | Leading symbol (e.g. "$").                                 |
 * | suffix      | string                     | —       | Trailing symbol (e.g. "kg").                               |
 * | disabled    | boolean                    | false   | Disables all interaction.                                  |
 * | error       | boolean                    | false   | Renders error styling consistent with shadcn <Input />.    |
 * | placeholder | string                     | —       | Placeholder text shown when value is null.                 |
 * | locale      | string                     | 'en-US' | Intl.NumberFormat locale used for blur formatting.         |
 * | className   | string                     | —       | Outer wrapper class names.                                 |
 * | id          | string                     | —       | Forwarded to the underlying input for label htmlFor.       |
 */

import * as React from 'react'
import { Minus, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/input'

export interface NumberInputProps {
  value: number | null
  onChange: (next: number | null) => void
  min?: number
  max?: number
  step?: number
  precision?: number
  prefix?: string
  suffix?: string
  disabled?: boolean
  error?: boolean
  placeholder?: string
  locale?: string
  className?: string
  id?: string
  'aria-label'?: string
}

const LONG_PRESS_DELAY = 350
const LONG_PRESS_INTERVAL = 60

function clamp(n: number, min: number, max: number) {
  return Math.min(Math.max(n, min), max)
}

function roundTo(value: number, precision: number) {
  const factor = 10 ** precision
  return Math.round(value * factor) / factor
}

export function NumberInput({
  value,
  onChange,
  min = Number.NEGATIVE_INFINITY,
  max = Number.POSITIVE_INFINITY,
  step = 1,
  precision = 0,
  prefix,
  suffix,
  disabled = false,
  error = false,
  placeholder,
  locale = 'en-US',
  className,
  id,
  'aria-label': ariaLabel,
}: NumberInputProps) {
  const [raw, setRaw] = React.useState<string>(() =>
    value === null ? '' : String(value)
  )
  const [focused, setFocused] = React.useState(false)
  const longPressTimer = React.useRef<ReturnType<typeof setTimeout> | null>(
    null
  )
  const longPressInterval = React.useRef<ReturnType<typeof setInterval> | null>(
    null
  )

  // Sync external value → raw when not focused (avoid clobbering user input)
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

  const commit = (next: number | null) => {
    if (next === null) {
      onChange(null)
      return
    }
    const clamped = clamp(next, min, max)
    onChange(roundTo(clamped, precision))
  }

  const bump = (delta: number) => {
    const base = value ?? 0
    commit(base + delta)
  }

  const startLongPress = (delta: number) => {
    bump(delta)
    longPressTimer.current = setTimeout(() => {
      longPressInterval.current = setInterval(() => bump(delta), LONG_PRESS_INTERVAL)
    }, LONG_PRESS_DELAY)
  }

  const stopLongPress = () => {
    if (longPressTimer.current) clearTimeout(longPressTimer.current)
    if (longPressInterval.current) clearInterval(longPressInterval.current)
    longPressTimer.current = null
    longPressInterval.current = null
  }

  React.useEffect(() => stopLongPress, [])

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
      // Don't clamp on every keystroke — user may be mid-typing past min/max
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

  const atMax = value !== null && value >= max
  const atMin = value !== null && value <= min

  return (
    <div
      className={cn(
        'group relative inline-flex h-10 w-full items-stretch rounded-lg border border-white/10 bg-white/[0.03] text-sm text-white transition-colors duration-m3-enter ease-m3-enter',
        'focus-within:border-white/40 focus-within:bg-white/[0.05]',
        error &&
          'border-rose-500/60 bg-rose-500/[0.04] focus-within:border-rose-400',
        disabled && 'cursor-not-allowed opacity-50',
        className
      )}
    >
      <StepperButton
        direction="down"
        disabled={disabled || atMin}
        onPress={() => startLongPress(-step)}
        onRelease={stopLongPress}
      >
        <Minus className="h-3.5 w-3.5" />
      </StepperButton>

      <div className="relative flex flex-1 items-center">
        {prefix && (
          <span
            aria-hidden
            className="pointer-events-none pl-3 text-white/40"
          >
            {prefix}
          </span>
        )}
        <Input
          id={id}
          aria-label={ariaLabel}
          inputMode="decimal"
          value={raw}
          placeholder={placeholder}
          disabled={disabled}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className={cn(
            'h-full flex-1 border-0 bg-transparent px-3 text-center font-mono tabular-nums focus-visible:border-0 focus-visible:bg-transparent',
            prefix && 'pl-1',
            suffix && 'pr-1'
          )}
        />
        {suffix && (
          <span
            aria-hidden
            className="pointer-events-none pr-3 text-white/40"
          >
            {suffix}
          </span>
        )}
      </div>

      <StepperButton
        direction="up"
        disabled={disabled || atMax}
        onPress={() => startLongPress(step)}
        onRelease={stopLongPress}
      >
        <Plus className="h-3.5 w-3.5" />
      </StepperButton>
    </div>
  )
}

interface StepperButtonProps {
  direction: 'up' | 'down'
  disabled?: boolean
  onPress: () => void
  onRelease: () => void
  children: React.ReactNode
}

function StepperButton({
  direction,
  disabled,
  onPress,
  onRelease,
  children,
}: StepperButtonProps) {
  return (
    <button
      type="button"
      aria-label={direction === 'up' ? 'Increment' : 'Decrement'}
      disabled={disabled}
      onMouseDown={(e) => {
        e.preventDefault()
        if (!disabled) onPress()
      }}
      onMouseUp={onRelease}
      onMouseLeave={onRelease}
      onTouchStart={(e) => {
        e.preventDefault()
        if (!disabled) onPress()
      }}
      onTouchEnd={onRelease}
      className={cn(
        'inline-flex h-full w-10 shrink-0 items-center justify-center text-white/70 transition-colors duration-m3-enter ease-m3-enter',
        'hover:bg-white/[0.06] hover:text-white',
        'focus-visible:outline-none focus-visible:bg-white/[0.06] focus-visible:text-white',
        direction === 'down' ? 'rounded-l-lg border-r border-white/10' : 'rounded-r-lg border-l border-white/10',
        'disabled:cursor-not-allowed disabled:text-white/20 disabled:hover:bg-transparent'
      )}
    >
      {children}
    </button>
  )
}
