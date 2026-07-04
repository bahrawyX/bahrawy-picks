'use client'

import {
  type ChangeEvent,
  type FocusEvent,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { springSnappy, tweenSmooth } from '@/lib/motion'
import { getCurrency } from '@/lib/currency-data'
import { formatDisplayValue, parseCurrencyString } from '@/lib/currency-utils'
import { CurrencySelector } from './currency-selector'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface CurrencyInputProps {
  /** Controlled value. `null` represents an empty input (distinct from 0). */
  value?: number | null
  onChange?: (value: number | null, currency: string) => void
  defaultValue?: number
  currency?: string
  defaultCurrency?: string
  onCurrencyChange?: (currency: string) => void
  allowedCurrencies?: string[]
  showCurrencySelector?: boolean
  locale?: string
  min?: number
  max?: number
  placeholder?: string
  disabled?: boolean
  error?: string
  /** Form field name — forwarded to the underlying `<input>`. */
  name?: string
  /** Forwarded to the underlying `<input>` for label `htmlFor` wiring. */
  id?: string
  /** Renders a `<label>` above the input, wired via htmlFor. */
  label?: string
  className?: string
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function CurrencyInput({
  value: controlledValue,
  onChange,
  defaultValue,
  currency: controlledCurrency,
  defaultCurrency = 'USD',
  onCurrencyChange,
  allowedCurrencies,
  showCurrencySelector = true,
  locale,
  min,
  max,
  placeholder = '0.00',
  disabled = false,
  error,
  name,
  id,
  label,
  className,
}: CurrencyInputProps) {
  const isControlled = controlledValue !== undefined
  const isCurrencyControlled = controlledCurrency !== undefined

  const [internalValue, setInternalValue] = useState<number | null>(
    defaultValue ?? null,
  )
  const [internalCurrency, setInternalCurrency] = useState(defaultCurrency)
  const [focused, setFocused] = useState(false)
  const [displayValue, setDisplayValue] = useState('')
  const [shaking, setShaking] = useState(false)

  const inputRef = useRef<HTMLInputElement>(null)
  const numValue = isControlled ? controlledValue : internalValue
  const currencyCode = isCurrencyControlled ? controlledCurrency : internalCurrency

  const currencyInfo = useMemo(() => getCurrency(currencyCode), [currencyCode])

  const generatedId = useId()
  const inputId = id ?? generatedId
  const errorId = `${inputId}-error`

  // Sync display from value when not focused
  useEffect(() => {
    if (!focused) {
      if (numValue === null || numValue === undefined) {
        setDisplayValue('')
      } else {
        setDisplayValue(formatDisplayValue(String(numValue), currencyCode, locale))
      }
    }
  }, [numValue, currencyCode, locale, focused])

  // ---- Handlers ----

  const updateValue = useCallback(
    (newVal: number | null) => {
      // No clamping mid-typing — the value is clamped on blur instead
      if (!isControlled) setInternalValue(newVal)
      onChange?.(newVal, currencyCode)
    },
    [isControlled, onChange, currencyCode],
  )

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value

      // Allow empty input — empty is null, not 0
      if (!raw) {
        setDisplayValue('')
        updateValue(null)
        return
      }

      // Allow typing decimal values (e.g. "12." or "12.5")
      // Strip non-numeric except decimal point and minus
      const cleaned = raw.replace(/[^\d.-]/g, '')

      // Validate: only one dot, only leading minus
      const parts = cleaned.split('.')
      if (parts.length > 2) return // multiple dots

      // Limit decimal places
      const decimals = currencyInfo?.decimals ?? 2
      if (parts[1] !== undefined && parts[1].length > decimals) return

      setDisplayValue(raw.replace(/[^\d.,\-\s]/g, ''))
      const parsed = parseCurrencyString(cleaned)
      if (!isNaN(parsed)) {
        updateValue(parsed)
      }
    },
    [updateValue, currencyInfo],
  )

  const handleFocus = useCallback((e: FocusEvent<HTMLInputElement>) => {
    setFocused(true)
    // Show raw number on focus for easy editing
    e.target.select()
  }, [])

  const handleBlur = useCallback(() => {
    setFocused(false)
    if (numValue === null) {
      setDisplayValue('')
      return
    }
    // Clamp on blur (not per keystroke) and shake if out of range
    let clamped = numValue
    if (min !== undefined && clamped < min) clamped = min
    if (max !== undefined && clamped > max) clamped = max
    if (clamped !== numValue) {
      setShaking(true)
      setTimeout(() => setShaking(false), 500)
      updateValue(clamped)
    }
    // Format on blur
    setDisplayValue(formatDisplayValue(String(clamped), currencyCode, locale))
  }, [numValue, min, max, updateValue, currencyCode, locale])

  const handleCurrencyChange = useCallback(
    (code: string) => {
      if (!isCurrencyControlled) setInternalCurrency(code)
      onCurrencyChange?.(code)
      onChange?.(numValue, code)
    },
    [isCurrencyControlled, onCurrencyChange, onChange, numValue],
  )

  return (
    <div className={cn('w-full', className)}>
      {label && (
        <label
          htmlFor={inputId}
          className="mb-1.5 block text-sm font-medium text-white/70"
        >
          {label}
        </label>
      )}

      <motion.div
        animate={shaking ? { x: [0, -5, 5, -5, 5, 0] } : { x: 0 }}
        transition={
          shaking
            ? { type: 'tween' as const, duration: 0.4, ease: 'easeInOut' }
            : springSnappy
        }
        className={cn(
          'flex items-stretch rounded-lg border bg-white/[0.03] transition-colors',
          focused && !error ? 'border-white/30' : 'border-white/[0.08]',
          error && 'border-red-500/60',
          disabled && 'cursor-not-allowed opacity-50',
        )}
      >
        {/* Currency selector */}
        {showCurrencySelector && (
          <CurrencySelector
            value={currencyCode}
            onChange={handleCurrencyChange}
            allowedCurrencies={allowedCurrencies}
            disabled={disabled}
          />
        )}

        {/* Symbol prefix (when selector is hidden) */}
        {!showCurrencySelector && currencyInfo && (
          <div className="flex items-center border-r border-white/[0.08] px-3 text-sm text-white/50">
            {currencyInfo.symbol}
          </div>
        )}

        {/* Input */}
        <input
          ref={inputRef}
          type="text"
          name={name}
          id={inputId}
          inputMode="decimal"
          aria-invalid={!!error || undefined}
          aria-describedby={error ? errorId : undefined}
          value={displayValue}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          disabled={disabled}
          placeholder={placeholder}
          className="min-w-0 flex-1 bg-transparent px-3 py-2.5 text-right text-sm text-white outline-none placeholder:text-white/25"
        />
      </motion.div>

      {/* Error */}
      <AnimatePresence>
        {error && (
          <motion.p
            id={errorId}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={tweenSmooth}
            className="mt-1.5 text-sm text-red-400"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  )
}
