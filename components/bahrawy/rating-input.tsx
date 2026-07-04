'use client'

import { useState, useCallback, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Star, Heart, ThumbsUp } from 'lucide-react'
import { cn } from '@/lib/utils'
import { springSnappy } from '@/lib/motion'
import { useRovingTabindex } from '@/lib/use-roving-tabindex'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type RatingVariant = 'star' | 'heart' | 'emoji' | 'thumb'

export interface RatingInputProps {
  value?: number
  onChange?: (value: number) => void
  max?: number
  variant?: RatingVariant
  allowHalf?: boolean
  size?: 'sm' | 'md' | 'lg'
  labels?: string[]
  disabled?: boolean
  readOnly?: boolean
  className?: string
}

// ---------------------------------------------------------------------------
// Icons & emojis
// ---------------------------------------------------------------------------

const sizeMap = {
  sm: 'h-4 w-4',
  md: 'h-5 w-5',
  lg: 'h-7 w-7',
} as const

const emojiList = ['😡', '😕', '😐', '🙂', '😍']

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function RatingInput({
  value: controlledValue,
  onChange,
  max = 5,
  variant = 'star',
  allowHalf = false,
  size = 'md',
  labels,
  disabled = false,
  readOnly = false,
  className,
}: RatingInputProps) {
  const isControlled = controlledValue !== undefined
  const [internalValue, setInternalValue] = useState(0)
  const currentValue = isControlled ? controlledValue : internalValue
  const [hoverValue, setHoverValue] = useState<number | null>(null)

  const displayValue = hoverValue ?? currentValue

  const handleSelect = useCallback(
    (val: number) => {
      if (disabled || readOnly) return
      // Toggle off if clicking same value
      const newVal = val === currentValue ? 0 : val
      if (!isControlled) setInternalValue(newVal)
      onChange?.(newVal)
    },
    [disabled, readOnly, currentValue, isControlled, onChange],
  )

  const activeLabel = useMemo(() => {
    if (!labels || labels.length === 0) return null
    const idx = Math.ceil(displayValue) - 1
    return labels[idx] ?? null
  }, [labels, displayValue])

  const interactive = !disabled && !readOnly

  // Roving tabindex: arrows move between stars (half-steps when allowHalf)
  // and selection follows focus.
  const useHalfSteps = allowHalf && variant !== 'emoji'
  const itemCount = useHalfSteps ? max * 2 : max
  const valueForIndex = useCallback(
    (i: number) => (useHalfSteps ? (i + 1) / 2 : i + 1),
    [useHalfSteps],
  )
  const indexForValue = (val: number) =>
    val <= 0 ? 0 : (useHalfSteps ? Math.round(val * 2) : Math.ceil(val)) - 1

  const roving = useRovingTabindex({
    count: itemCount,
    onNavigate: (i) => {
      if (!interactive) return
      const val = valueForIndex(i)
      if (!isControlled) setInternalValue(val)
      onChange?.(val)
    },
    focusIndex: Math.min(indexForValue(currentValue), itemCount - 1),
  })

  return (
    <div
      className={cn('flex items-center gap-2', className)}
      role="radiogroup"
      aria-label="Rating"
    >
      <div
        className="flex items-center gap-0.5"
        onMouseLeave={() => interactive && setHoverValue(null)}
      >
        {Array.from({ length: max }, (_, i) => {
          const starIndex = i + 1

          if (variant === 'emoji') {
            const emoji = emojiList[i] ?? emojiList[emojiList.length - 1]
            const isActive = displayValue >= starIndex
            return (
              <motion.button
                key={i}
                type="button"
                {...roving.getItemProps(i)}
                onClick={() => handleSelect(starIndex)}
                onMouseEnter={() => interactive && setHoverValue(starIndex)}
                disabled={disabled}
                whileTap={interactive ? { scale: 0.85 } : undefined}
                className={cn(
                  'flex items-center justify-center rounded-md p-1 transition-all',
                  interactive && 'cursor-pointer hover:bg-white/[0.06]',
                  disabled && 'cursor-not-allowed opacity-50',
                  readOnly && 'cursor-default',
                )}
                role="radio"
                aria-checked={currentValue === starIndex}
                aria-label={`${starIndex} of ${max}`}
              >
                <span
                  className={cn(
                    'transition-all',
                    size === 'sm' && 'text-base',
                    size === 'md' && 'text-xl',
                    size === 'lg' && 'text-2xl',
                    isActive ? 'scale-110 grayscale-0' : 'scale-90 grayscale opacity-40',
                  )}
                >
                  {emoji}
                </span>
              </motion.button>
            )
          }

          // Star / Heart / Thumb icon
          const IconComponent =
            variant === 'heart' ? Heart : variant === 'thumb' ? ThumbsUp : Star
          const iconSize = sizeMap[size]

          if (allowHalf) {
            const halfVal = starIndex - 0.5
            const isHalfActive = displayValue >= halfVal && displayValue < starIndex
            const isFullActive = displayValue >= starIndex

            return (
              <div
                key={i}
                className="relative"
                onMouseEnter={() => interactive && setHoverValue(starIndex)}
              >
                {/* Left half */}
                <button
                  type="button"
                  {...roving.getItemProps(i * 2)}
                  onClick={() => handleSelect(halfVal)}
                  onMouseEnter={(e) => {
                    e.stopPropagation()
                    interactive && setHoverValue(halfVal)
                  }}
                  disabled={disabled}
                  className={cn(
                    'absolute inset-0 z-10 w-1/2',
                    interactive ? 'cursor-pointer' : disabled ? 'cursor-not-allowed' : 'cursor-default',
                  )}
                  role="radio"
                  aria-checked={currentValue === halfVal}
                  aria-label={`${halfVal} of ${max}`}
                />
                {/* Right half */}
                <button
                  type="button"
                  {...roving.getItemProps(i * 2 + 1)}
                  onClick={() => handleSelect(starIndex)}
                  onMouseEnter={(e) => {
                    e.stopPropagation()
                    interactive && setHoverValue(starIndex)
                  }}
                  disabled={disabled}
                  className={cn(
                    'absolute inset-0 z-10 w-full',
                    interactive ? 'cursor-pointer' : disabled ? 'cursor-not-allowed' : 'cursor-default',
                  )}
                  style={{ clipPath: 'inset(0 0 0 50%)' }}
                  role="radio"
                  aria-checked={currentValue === starIndex}
                  aria-label={`${starIndex} of ${max}`}
                />
                {/* Visual icon with half-fill */}
                <div className="relative p-0.5">
                  {/* Background (empty) */}
                  <IconComponent
                    className={cn(iconSize, 'text-white/15')}
                    fill="currentColor"
                    strokeWidth={0}
                  />
                  {/* Fill overlay */}
                  {(isHalfActive || isFullActive) && (
                    <div
                      className="absolute inset-0 overflow-hidden p-0.5"
                      style={{ width: isFullActive ? '100%' : '50%' }}
                    >
                      <motion.div
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={springSnappy}
                      >
                        <IconComponent
                          className={cn(
                            iconSize,
                            variant === 'heart'
                              ? 'text-red-400'
                              : variant === 'thumb'
                                ? 'text-blue-400'
                                : 'text-amber-400',
                          )}
                          fill="currentColor"
                          strokeWidth={0}
                        />
                      </motion.div>
                    </div>
                  )}
                </div>
              </div>
            )
          }

          // Simple full-star mode
          const isActive = displayValue >= starIndex
          return (
            <motion.button
              key={i}
              type="button"
              {...roving.getItemProps(i)}
              onClick={() => handleSelect(starIndex)}
              onMouseEnter={() => interactive && setHoverValue(starIndex)}
              disabled={disabled}
              whileTap={interactive ? { scale: 0.8 } : undefined}
              className={cn(
                'rounded-md p-0.5 transition-colors',
                interactive && 'cursor-pointer hover:bg-white/[0.06]',
                disabled && 'cursor-not-allowed opacity-50',
                readOnly && 'cursor-default',
              )}
              role="radio"
              aria-checked={currentValue === starIndex}
              aria-label={`${starIndex} of ${max}`}
            >
              <motion.div
                initial={false}
                animate={isActive ? { scale: 1 } : { scale: 0.85 }}
                transition={springSnappy}
              >
                <IconComponent
                  className={cn(
                    iconSize,
                    isActive
                      ? variant === 'heart'
                        ? 'text-red-400'
                        : variant === 'thumb'
                          ? 'text-blue-400'
                          : 'text-amber-400'
                      : 'text-white/15',
                  )}
                  fill={isActive ? 'currentColor' : 'currentColor'}
                  strokeWidth={0}
                />
              </motion.div>
            </motion.button>
          )
        })}
      </div>

      {/* Label */}
      {activeLabel && (
        <motion.span
          key={activeLabel}
          initial={{ opacity: 0, x: -4 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-xs text-white/50"
        >
          {activeLabel}
        </motion.span>
      )}
    </div>
  )
}
