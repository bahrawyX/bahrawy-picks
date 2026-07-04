'use client'

import {
  type ChangeEvent,
  type KeyboardEvent,
  type ClipboardEvent,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
} from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Eye, EyeOff } from 'lucide-react'
import { cn } from '@/lib/utils'
import { springSnappy, tweenSmooth } from '@/lib/motion'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface PinInputProps {
  length?: number
  /** Form field name — forwarded to the real (invisible) input so it posts in native forms. */
  name?: string
  /** Forwarded to the real input for `<label htmlFor>` wiring. */
  id?: string
  value?: string
  onChange?: (value: string) => void
  onComplete?: (value: string) => void
  mask?: boolean
  maskChar?: string
  shape?: 'square' | 'circle'
  size?: 'sm' | 'md' | 'lg'
  error?: boolean | string
  disabled?: boolean
  autoFocus?: boolean
  placeholder?: string
  className?: string
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const sizeMap = {
  sm: { box: 'h-9 w-9 text-sm', gap: 'gap-2' },
  md: { box: 'h-11 w-11 text-base', gap: 'gap-2.5' },
  lg: { box: 'h-14 w-14 text-lg', gap: 'gap-3' },
} as const

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function PinInput({
  length = 4,
  name,
  id,
  value: controlledValue,
  onChange,
  onComplete,
  mask: initialMask = true,
  maskChar = '•',
  shape = 'square',
  size = 'md',
  error = false,
  disabled = false,
  autoFocus = false,
  placeholder = '',
  className,
}: PinInputProps) {
  const isControlled = controlledValue !== undefined
  const [internalValue, setInternalValue] = useState('')
  const currentValue = isControlled ? controlledValue : internalValue
  const [focused, setFocused] = useState(false)
  const [masked, setMasked] = useState(initialMask)
  const [shaking, setShaking] = useState(false)

  const inputRef = useRef<HTMLInputElement>(null)

  const sizeStyle = sizeMap[size]
  const hasError = !!error
  const errorId = useId()
  const hasErrorMessage = typeof error === 'string' && !!error

  // Build fixed-length digits array for rendering
  const digits: string[] = []
  for (let i = 0; i < length; i++) {
    digits.push(currentValue[i] ?? '')
  }

  // The "active" box index is the position of the next digit to type
  const activeIndex = Math.min(currentValue.length, length - 1)

  // ---- Value management ----

  const commitValue = useCallback(
    (newVal: string) => {
      // Only keep digits, clamped to length
      const cleaned = newVal.replace(/\D/g, '').slice(0, length)
      if (!isControlled) setInternalValue(cleaned)
      onChange?.(cleaned)
      if (cleaned.length === length) {
        onComplete?.(cleaned)
      }
    },
    [isControlled, onChange, onComplete, length],
  )

  // Auto-focus
  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus()
    }
  }, [autoFocus])

  // Shake on error
  useEffect(() => {
    if (hasError) {
      setShaking(true)
      const t = setTimeout(() => setShaking(false), 500)
      return () => clearTimeout(t)
    }
  }, [hasError, error])

  // ---- Handlers ----

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      commitValue(e.target.value)
    },
    [commitValue],
  )

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (disabled) return
      // Backspace when at the end removes last digit
      if (e.key === 'Backspace' && currentValue.length > 0) {
        e.preventDefault()
        commitValue(currentValue.slice(0, -1))
      }
    },
    [disabled, currentValue, commitValue],
  )

  const handlePaste = useCallback(
    (e: ClipboardEvent<HTMLInputElement>) => {
      e.preventDefault()
      if (disabled) return
      const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length)
      if (pasted) {
        commitValue(pasted)
      }
    },
    [disabled, length, commitValue],
  )

  return (
    <div className={cn('flex flex-col items-center gap-3', className)}>
      {/* Visual pin boxes */}
      <motion.div
        animate={shaking ? { x: [0, -6, 6, -6, 6, 0] } : { x: 0 }}
        transition={
          shaking
            ? { type: 'tween' as const, duration: 0.4, ease: 'easeInOut' }
            : springSnappy
        }
        className={cn('flex items-center', sizeStyle.gap)}
      >
        {/* Boxes wrapper — the hidden input sits inside here */}
        <div
          className="relative flex items-center gap-[inherit] cursor-pointer"
          onClick={() => inputRef.current?.focus()}
        >
          {/* Real input stretched over the boxes only */}
          <input
            ref={inputRef}
            type="text"
            name={name}
            id={id}
            inputMode="numeric"
            autoComplete="one-time-code"
            pattern="[0-9]*"
            maxLength={length}
            value={currentValue}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onPaste={handlePaste}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            disabled={disabled}
            className="absolute inset-0 z-10 cursor-pointer bg-transparent text-transparent caret-transparent outline-none selection:bg-transparent"
            aria-label="PIN input"
            aria-invalid={hasError || undefined}
            aria-describedby={hasErrorMessage ? errorId : undefined}
          />
          {digits.map((digit, i) => {
            const isFocused = focused && i === activeIndex
            const filled = !!digit

            return (
              <div
                key={i}
                className={cn(
                  'flex items-center justify-center border transition-colors',
                  sizeStyle.box,
                  shape === 'circle' ? 'rounded-full' : 'rounded-lg',
                  disabled
                    ? 'cursor-not-allowed border-white/[0.06] bg-white/[0.02] opacity-50'
                    : hasError
                      ? 'border-red-500/60 bg-red-500/[0.05]'
                      : isFocused
                        ? 'border-white/30 bg-white/[0.06]'
                        : filled
                          ? 'border-white/20 bg-white/[0.04]'
                          : 'border-white/[0.08] bg-white/[0.03]',
                )}
              >
                {filled ? (
                  <span
                    className={cn(
                      'select-none font-medium text-white',
                      masked && 'text-xl leading-none',
                    )}
                  >
                    {masked ? maskChar : digit}
                  </span>
                ) : isFocused ? (
                  <span className="inline-block h-5 w-0.5 animate-pulse rounded-full bg-white" />
                ) : placeholder ? (
                  <span className="select-none text-white/20">{placeholder}</span>
                ) : null}
              </div>
            )
          })}
        </div>

        {/* Show/hide toggle — OUTSIDE the input overlay */}
        {initialMask && (
          <button
            type="button"
            onClick={() => setMasked((m) => !m)}
            disabled={disabled}
            className={cn(
              'relative z-20 ml-1 rounded-md p-1.5 text-white/40 transition-colors hover:bg-white/[0.06] hover:text-white/70',
              disabled && 'cursor-not-allowed opacity-50',
            )}
            aria-label={masked ? 'Show PIN' : 'Hide PIN'}
          >
            {masked ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        )}
      </motion.div>

      {/* Error message */}
      <AnimatePresence>
        {typeof error === 'string' && error && (
          <motion.p
            id={errorId}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={tweenSmooth}
            className="text-sm text-red-400"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  )
}
