'use client'

import {
  type ChangeEvent,
  type FocusEvent,
  useCallback,
  useEffect,
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
  value?: number
  onChange?: (value: number, currency: string) => void
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
  className,
}: CurrencyInputProps) {
  const isControlled = controlledValue !== undefined
  const isCurrencyControlled = controlledCurrency !== undefined

  const [internalValue, setInternalValue] = useState<number>(defaultValue ?? 0)
  const [internalCurrency, setInternalCurrency] = useState(defaultCurrency)
  const [focused, setFocused] = useState(false)
  const [displayValue, setDisplayValue] = useState('')
  const [shaking, setShaking] = useState(false)

  const inputRef = useRef<HTMLInputElement>(null)
  const numValue = isControlled ? controlledValue : internalValue
  const currencyCode = isCurrencyControlled ? controlledCurrency : internalCurrency

  const currencyInfo = useMemo(() => getCurrency(currencyCode), [currencyCode])

  // Sync display from value when not focused
  useEffect(() => {
    if (!focused) {
      if (numValue === 0 && !displayValue) {
        setDisplayValue('')
      } else if (numValue !== 0) {
        setDisplayValue(formatDisplayValue(String(numValue), currencyCode, locale))
      }
    }
  }, [numValue, currencyCode, locale, focused, displayValue])

  // ---- Handlers ----

  const updateValue = useCallback(
    (newVal: number) => {
      // Clamp
      let clamped = newVal
      if (min !== undefined && clamped < min) {
        clamped = min
        setShaking(true)
        setTimeout(() => setShaking(false), 500)
      }
      if (max !== undefined && clamped > max) {
        clamped = max
        setShaking(true)
        setTimeout(() => setShaking(false), 500)
      }
      if (!isControlled) setInternalValue(clamped)
      onChange?.(clamped, currencyCode)
    },
    [isControlled, onChange, currencyCode, min, max],
  )

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value

      // Allow empty input
      if (!raw) {
        setDisplayValue('')
        updateValue(0)
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
    // Format on blur
    if (numValue !== 0) {
      setDisplayValue(formatDisplayValue(String(numValue), currencyCode, locale))
    } else {
      setDisplayValue('')
    }
  }, [numValue, currencyCode, locale])

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
          inputMode="decimal"
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
