'use client'

import {
  type KeyboardEvent,
  type ClipboardEvent,
  useCallback,
  useEffect,
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
  const digits = (isControlled ? controlledValue : internalValue).split('')
  const [focusIndex, setFocusIndex] = useState<number | null>(null)
  const [masked, setMasked] = useState(initialMask)
  const [shaking, setShaking] = useState(false)

  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  const sizeStyle = sizeMap[size]
  const hasError = !!error

  // ---- Value management ----

  const updateValue = useCallback(
    (newVal: string) => {
      const clamped = newVal.slice(0, length)
      if (!isControlled) setInternalValue(clamped)
      onChange?.(clamped)
      if (clamped.length === length) {
        onComplete?.(clamped)
      }
    },
    [isControlled, onChange, onComplete, length],
  )

  // ---- Focus helpers ----

  const focusAt = useCallback((index: number) => {
    const inp = inputRefs.current[index]
    if (inp) {
      inp.focus()
      inp.select()
    }
  }, [])

  // Auto-focus first input
  useEffect(() => {
    if (autoFocus && inputRefs.current[0]) {
      inputRefs.current[0].focus()
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

  const handleInput = useCallback(
    (index: number, char: string) => {
      if (disabled) return
      if (!/^\d$/.test(char)) return

      const arr = [...digits]
      // Pad array to index
      while (arr.length <= index) arr.push('')
      arr[index] = char
      updateValue(arr.join(''))

      // Move to next
      if (index < length - 1) {
        focusAt(index + 1)
      }
    },
    [digits, disabled, length, updateValue, focusAt],
  )

  const handleKeyDown = useCallback(
    (index: number, e: KeyboardEvent<HTMLInputElement>) => {
      if (disabled) return

      if (e.key === 'Backspace') {
        e.preventDefault()
        const arr = [...digits]
        if (arr[index]) {
          arr[index] = ''
          updateValue(arr.join(''))
        } else if (index > 0) {
          arr[index - 1] = ''
          updateValue(arr.join(''))
          focusAt(index - 1)
        }
        return
      }

      if (e.key === 'ArrowLeft' && index > 0) {
        e.preventDefault()
        focusAt(index - 1)
        return
      }

      if (e.key === 'ArrowRight' && index < length - 1) {
        e.preventDefault()
        focusAt(index + 1)
        return
      }

      if (e.key === 'Delete') {
        e.preventDefault()
        const arr = [...digits]
        arr[index] = ''
        updateValue(arr.join(''))
      }
    },
    [digits, disabled, length, updateValue, focusAt],
  )

  const handlePaste = useCallback(
    (e: ClipboardEvent<HTMLInputElement>) => {
      e.preventDefault()
      if (disabled) return
      const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length)
      if (pasted) {
        updateValue(pasted)
        focusAt(Math.min(pasted.length, length - 1))
      }
    },
    [disabled, length, updateValue, focusAt],
  )

  return (
    <div className={cn('flex flex-col items-center gap-3', className)}>
      {/* Pin boxes */}
      <motion.div
        animate={shaking ? { x: [0, -6, 6, -6, 6, 0] } : { x: 0 }}
        transition={
          shaking
            ? { type: 'tween' as const, duration: 0.4, ease: 'easeInOut' }
            : springSnappy
        }
        className={cn('flex items-center', sizeStyle.gap)}
      >
        {Array.from({ length }).map((_, i) => {
          const digit = digits[i] || ''
          const isFocused = focusIndex === i
          const filled = !!digit

          return (
            <div key={i} className="relative">
              <input
                ref={(el) => { inputRefs.current[i] = el }}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={1}
                value=""
                onChange={(e) => {
                  const val = e.target.value
                  if (val && /^\d$/.test(val)) {
                    handleInput(i, val)
                  }
                }}
                onKeyDown={(e) => handleKeyDown(i, e)}
                onPaste={handlePaste}
                onFocus={() => setFocusIndex(i)}
                onBlur={() => setFocusIndex(null)}
                disabled={disabled}
                className="absolute inset-0 z-10 cursor-pointer bg-transparent text-center text-transparent caret-transparent outline-none"
                aria-label={`PIN digit ${i + 1}`}
              />
              <motion.div
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
                animate={
                  filled
                    ? { scale: [0.85, 1.05, 1] }
                    : {}
                }
                transition={springSnappy}
              >
                <AnimatePresence mode="wait">
                  {filled ? (
                    <motion.span
                      key={masked ? 'masked' : 'digit'}
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.5 }}
                      transition={springSnappy}
                      className={cn(
                        'select-none font-medium text-white',
                        masked && 'text-xl leading-none',
                      )}
                    >
                      {masked ? maskChar : digit}
                    </motion.span>
                  ) : isFocused ? (
                    <motion.div
                      key="caret"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: [1, 0] }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        repeatType: 'reverse',
                        ease: 'easeInOut',
                      }}
                      className="h-5 w-0.5 rounded-full bg-white"
                    />
                  ) : placeholder ? (
                    <span className="select-none text-white/20">{placeholder}</span>
                  ) : null}
                </AnimatePresence>
              </motion.div>
            </div>
          )
        })}

        {/* Show/hide toggle */}
        {initialMask && (
          <button
            type="button"
            onClick={() => setMasked((m) => !m)}
            disabled={disabled}
            className={cn(
              'ml-1 rounded-md p-1.5 text-white/40 transition-colors hover:bg-white/[0.06] hover:text-white/70',
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
