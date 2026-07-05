'use client'

import {
  type ReactNode,
  type KeyboardEvent,
  type ClipboardEvent,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
} from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { springSnappy, tweenSmooth } from '@/lib/motion'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface OTPInputProps {
  length?: number
  inputType?: 'numeric' | 'alphanumeric'
  /** Form field name — the joined code is posted via a hidden input. */
  name?: string
  value?: string
  onChange?: (value: string) => void
  onComplete?: (value: string) => void
  separator?: ReactNode | boolean
  groupSize?: number
  status?: 'idle' | 'error' | 'success'
  errorMessage?: string
  disabled?: boolean
  autoFocus?: boolean
  className?: string
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function OTPInput({
  length = 6,
  inputType = 'numeric',
  name,
  value: controlledValue,
  onChange,
  onComplete,
  separator = false,
  groupSize = 3,
  status = 'idle',
  errorMessage,
  disabled = false,
  autoFocus = false,
  className,
}: OTPInputProps) {
  const isControlled = controlledValue !== undefined
  const [internalValue, setInternalValue] = useState('')
  const chars = (isControlled ? controlledValue : internalValue).split('')

  const inputsRef = useRef<(HTMLInputElement | null)[]>([])
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null)
  const [shaking, setShaking] = useState(false)
  const errorId = useId()
  const hasErrorMessage = status === 'error' && !!errorMessage

  // Auto-focus first box
  useEffect(() => {
    if (autoFocus && !disabled) {
      inputsRef.current[0]?.focus()
    }
  }, [autoFocus, disabled])

  // Trigger shake on error
  useEffect(() => {
    if (status === 'error') {
      setShaking(true)
      const t = setTimeout(() => setShaking(false), 500)
      return () => clearTimeout(t)
    }
  }, [status])

  const updateValue = useCallback(
    (newChars: string[]) => {
      const val = newChars.join('').slice(0, length)
      if (!isControlled) setInternalValue(val)
      onChange?.(val)
      if (val.length === length) onComplete?.(val)
    },
    [isControlled, length, onChange, onComplete],
  )

  const isValidChar = useCallback(
    (ch: string): boolean => {
      if (inputType === 'numeric') return /^\d$/.test(ch)
      return /^[a-zA-Z0-9]$/.test(ch)
    },
    [inputType],
  )

  // ---- Handlers ----

  const distributeChars = useCallback(
    (raw: string) => {
      const validChars = raw.split('').filter(isValidChar).slice(0, length)
      if (validChars.length === 0) return

      const next = Array.from({ length }, (_, i) => validChars[i] ?? '')
      updateValue(next)

      const focusTarget = validChars.length < length ? validChars.length : length - 1
      setTimeout(() => inputsRef.current[focusTarget]?.focus(), 0)
    },
    [isValidChar, length, updateValue],
  )

  const handleChange = (index: number, rawValue: string) => {
    if (disabled) return

    // Multi-char input (e.g. SMS autofill dumps the whole code into one box) —
    // distribute the characters across the boxes, same as the paste path.
    if (rawValue.length > 1) {
      distributeChars(rawValue)
      return
    }

    const ch = rawValue.slice(-1)
    if (!ch || !isValidChar(ch)) return

    const next = [...chars]
    while (next.length < length) next.push('')
    next[index] = ch
    updateValue(next)

    if (index < length - 1) {
      inputsRef.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (disabled) return

    if (e.key === 'Backspace') {
      e.preventDefault()
      const next = [...chars]
      while (next.length < length) next.push('')

      if (next[index]) {
        next[index] = ''
        updateValue(next)
      } else if (index > 0) {
        next[index - 1] = ''
        updateValue(next)
        inputsRef.current[index - 1]?.focus()
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      e.preventDefault()
      inputsRef.current[index - 1]?.focus()
    } else if (e.key === 'ArrowRight' && index < length - 1) {
      e.preventDefault()
      inputsRef.current[index + 1]?.focus()
    }
  }

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    if (disabled) return
    e.preventDefault()
    distributeChars(e.clipboardData.getData('text').trim())
  }

  const handleFocus = (index: number) => {
    if (disabled) return
    setFocusedIndex(index)
    inputsRef.current[index]?.select()
  }

  const handleBlur = () => setFocusedIndex(null)

  // ---- Render helpers ----

  const needsSeparator = (index: number) => {
    if (!separator || groupSize <= 0) return false
    return index > 0 && index < length && index % groupSize === 0
  }

  const borderColor = (index: number) => {
    if (status === 'error') return 'border-red-500/70'
    if (status === 'success') return 'border-emerald-500/70'
    if (focusedIndex === index) return 'border-picks-fg/50'
    if (chars[index]) return 'border-picks-fg/20'
    return 'border-picks-fg/[0.08]'
  }

  return (
    <div className={cn('flex flex-col items-center gap-3', className)}>
      {/* Hidden input so the joined code posts in native forms */}
      {name && (
        <input
          type="hidden"
          name={name}
          value={isControlled ? controlledValue : internalValue}
        />
      )}

      {/* Boxes row — CSS entrance, Framer Motion only for shake */}
      <motion.div
        className="flex items-center gap-2"
        animate={shaking ? { x: [0, -6, 6, -6, 6, 0] } : { x: 0 }}
        transition={
          shaking
            ? { type: 'tween' as const, duration: 0.4, ease: 'easeInOut' }
            : springSnappy
        }
      >
        {Array.from({ length }).map((_, index) => {
          const char = chars[index] ?? ''
          const isFocused = focusedIndex === index
          const showCaret = isFocused && !char && status === 'idle'

          return (
            <div key={index} className="flex items-center gap-2">
              {/* Separator */}
              {needsSeparator(index) && (
                <span className="mx-1 select-none text-lg text-picks-fg/20">
                  {separator === true ? '–' : separator}
                </span>
              )}

              {/* Box — CSS entrance animation with stagger delay */}
              <motion.div
                className="relative animate-tl-scale-in"
                style={{ animationDelay: `${index * 50}ms` }}
                animate={
                  isFocused && status === 'idle'
                    ? { scale: 1.05 }
                    : { scale: 1 }
                }
                transition={springSnappy}
              >
                <input
                  ref={(el) => { inputsRef.current[index] = el }}
                  type="text"
                  inputMode={inputType === 'numeric' ? 'numeric' : 'text'}
                  maxLength={1}
                  value={char}
                  disabled={disabled}
                  autoComplete="one-time-code"
                  aria-label={`OTP digit ${index + 1}`}
                  aria-invalid={status === 'error' || undefined}
                  aria-describedby={hasErrorMessage ? errorId : undefined}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={handlePaste}
                  onFocus={() => handleFocus(index)}
                  onBlur={handleBlur}
                  className={cn(
                    'h-14 w-12 rounded-xl border-2 bg-picks-fg/[0.03] text-center text-xl font-semibold text-picks-fg/0 caret-transparent outline-none transition-colors',
                    'focus:bg-picks-fg/[0.06]',
                    borderColor(index),
                    disabled && 'cursor-not-allowed opacity-40',
                  )}
                />

                {/* Visible character overlay — AnimatePresence works because it triggers on user interaction, not mount */}
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                  <AnimatePresence mode="popLayout">
                    {char && status !== 'success' && (
                      <motion.span
                        key={`char-${index}-${char}`}
                        initial={{ opacity: 0, scale: 1.3 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.85 }}
                        transition={springSnappy}
                        className="text-xl font-semibold text-picks-fg"
                      >
                        {char}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>

                {/* Success checkmark overlay */}
                <AnimatePresence>
                  {status === 'success' && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.6 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ ...springSnappy, delay: index * 0.04 }}
                      className="pointer-events-none absolute inset-0 flex items-center justify-center rounded-xl border-2 border-emerald-500/70 bg-emerald-500/10"
                    >
                      <Check className="h-5 w-5 text-emerald-400" strokeWidth={3} />
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Custom blinking caret */}
                {showCaret && (
                  <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                    <motion.div
                      className="h-6 w-0.5 rounded-full bg-picks-fg"
                      animate={{ opacity: [1, 0, 1] }}
                      transition={{ ...tweenSmooth, duration: 1, repeat: Infinity }}
                    />
                  </div>
                )}
              </motion.div>
            </div>
          )
        })}
      </motion.div>

      {/* Error message */}
      <AnimatePresence>
        {status === 'error' && errorMessage && (
          <motion.p
            id={errorId}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={tweenSmooth}
            className="text-sm text-red-400"
          >
            {errorMessage}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  )
}
