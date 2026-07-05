'use client'

import { useState, useMemo, useCallback, useId, forwardRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Eye, EyeOff, Check, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { springSnappy, tweenSmooth } from '@/lib/motion'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface PasswordRequirement {
  label: string
  test: (pw: string) => boolean
}

export interface PasswordInputProps {
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
  showStrength?: boolean
  requirements?: PasswordRequirement[]
  disabled?: boolean
  /** Form field name — forwarded to the underlying `<input>`. */
  name?: string
  /** Forwarded to the underlying `<input>`. Default "current-password". */
  autoComplete?: string
  /** Error message rendered below, wired via aria-describedby. */
  error?: string
  className?: string
}

// ---------------------------------------------------------------------------
// Default requirements
// ---------------------------------------------------------------------------

const defaultRequirements: PasswordRequirement[] = [
  { label: 'At least 8 characters', test: (pw) => pw.length >= 8 },
  { label: 'One uppercase letter', test: (pw) => /[A-Z]/.test(pw) },
  { label: 'One lowercase letter', test: (pw) => /[a-z]/.test(pw) },
  { label: 'One number', test: (pw) => /\d/.test(pw) },
  { label: 'One special character', test: (pw) => /[^A-Za-z0-9]/.test(pw) },
]

// ---------------------------------------------------------------------------
// Strength calculation
// ---------------------------------------------------------------------------

type Strength = 'empty' | 'weak' | 'fair' | 'good' | 'strong'

function getStrength(password: string, reqs: PasswordRequirement[]): Strength {
  if (!password) return 'empty'
  const passed = reqs.filter((r) => r.test(password)).length
  const ratio = passed / reqs.length
  if (ratio <= 0.3) return 'weak'
  if (ratio <= 0.6) return 'fair'
  if (ratio < 1) return 'good'
  return 'strong'
}

const strengthConfig: Record<Exclude<Strength, 'empty'>, { label: string; color: string; width: string }> = {
  weak: { label: 'Weak', color: 'bg-red-500', width: 'w-1/4' },
  fair: { label: 'Fair', color: 'bg-orange-500', width: 'w-2/4' },
  good: { label: 'Good', color: 'bg-yellow-500', width: 'w-3/4' },
  strong: { label: 'Strong', color: 'bg-green-500', width: 'w-full' },
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  function PasswordInput(
    {
      value: controlledValue,
      onChange,
      placeholder = 'Enter password',
      showStrength = true,
      requirements = defaultRequirements,
      disabled = false,
      name,
      autoComplete = 'current-password',
      error,
      className,
    },
    ref,
  ) {
    const isControlled = controlledValue !== undefined
    const [internalValue, setInternalValue] = useState('')
    const password = isControlled ? controlledValue : internalValue
    const [visible, setVisible] = useState(false)
    const errorId = useId()

    const handleChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const v = e.target.value
        if (!isControlled) setInternalValue(v)
        onChange?.(v)
      },
      [isControlled, onChange],
    )

    const strength = useMemo(() => getStrength(password, requirements), [password, requirements])
    const config = strength !== 'empty' ? strengthConfig[strength] : null

    return (
      <div className={cn('flex w-full flex-col gap-2', className)}>
        {/* Input row */}
        <div className="relative">
          <input
            ref={ref}
            type={visible ? 'text' : 'password'}
            name={name}
            autoComplete={autoComplete}
            value={password}
            onChange={handleChange}
            placeholder={placeholder}
            disabled={disabled}
            aria-invalid={!!error || undefined}
            aria-describedby={error ? errorId : undefined}
            className={cn(
              'h-10 w-full rounded-lg border border-picks-fg/[0.08] bg-picks-fg/[0.03] px-3 pr-10 text-sm text-picks-fg outline-none transition-colors placeholder:text-picks-fg/25 focus:border-picks-fg/30',
              disabled && 'cursor-not-allowed opacity-50',
            )}
            aria-label="Password"
          />
          <button
            type="button"
            onClick={() => setVisible((v) => !v)}
            disabled={disabled}
            className={cn(
              'absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1 text-picks-fg/40 transition-colors hover:text-picks-fg/70',
              disabled && 'cursor-not-allowed opacity-50',
            )}
            aria-label={visible ? 'Hide password' : 'Show password'}
          >
            {visible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
          </button>
        </div>

        {/* Error message */}
        <AnimatePresence>
          {error && (
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

        {/* Strength meter */}
        {showStrength && password.length > 0 && config && (
          <div
            className="flex flex-col gap-1.5"
            role="status"
            aria-live="polite"
            aria-label="Password strength"
          >
            <div className="flex items-center justify-between">
              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-picks-fg/[0.06]">
                <motion.div
                  className={cn('h-full rounded-full', config.color)}
                  initial={{ width: '0%' }}
                  animate={{ width: config.width === 'w-1/4' ? '25%' : config.width === 'w-2/4' ? '50%' : config.width === 'w-3/4' ? '75%' : '100%' }}
                  transition={springSnappy}
                />
              </div>
              <span
                data-testid="strength-label"
                className={cn(
                  'ml-3 text-xs font-medium',
                  strength === 'weak' && 'text-red-400',
                  strength === 'fair' && 'text-orange-400',
                  strength === 'good' && 'text-yellow-400',
                  strength === 'strong' && 'text-green-400',
                )}
              >
                {config.label}
              </span>
            </div>
          </div>
        )}

        {/* Requirements checklist */}
        {requirements.length > 0 && password.length > 0 && (
          <ul className="flex flex-col gap-1" role="list" aria-label="Password requirements">
            {requirements.map((req) => {
              const passed = req.test(password)
              return (
                <motion.li
                  key={req.label}
                  className="flex items-center gap-2 text-xs"
                  initial={false}
                  animate={{ opacity: 1 }}
                  transition={tweenSmooth}
                >
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={passed ? 'check' : 'x'}
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.5, opacity: 0 }}
                      transition={springSnappy}
                    >
                      {passed ? (
                        <Check className="h-3.5 w-3.5 text-green-400" />
                      ) : (
                        <X className="h-3.5 w-3.5 text-picks-fg/25" />
                      )}
                    </motion.span>
                  </AnimatePresence>
                  <span className={cn(passed ? 'text-picks-fg/60' : 'text-picks-fg/30')}>
                    {req.label}
                  </span>
                </motion.li>
              )
            })}
          </ul>
        )}
      </div>
    )
  },
)
