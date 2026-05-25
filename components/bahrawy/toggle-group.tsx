'use client'

/**
 * <ToggleGroup />  —  Apple-style multi-select pill row.
 *
 * Cousin of <SegmentedControl /> but selection is a Set, not a single
 * value. Click toggles each item on/off. Two visual modes: 'pills'
 * (separate pills, lots of breathing room) or 'segmented' (joined
 * pill row like iOS Mail filter bar).
 */

import * as React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

export interface ToggleGroupOption<V extends string = string> {
  value: V
  label: React.ReactNode
  icon?: React.ReactNode
  disabled?: boolean
}

export interface ToggleGroupProps<V extends string = string> {
  options: ToggleGroupOption<V>[]
  /** Controlled selection. */
  value?: V[]
  /** Uncontrolled initial selection. */
  defaultValue?: V[]
  onValueChange?: (value: V[]) => void
  /** Visual variant. Default 'pills'. */
  variant?: 'pills' | 'segmented'
  /** Visual size. Default 'md'. */
  size?: 'sm' | 'md' | 'lg'
  /** Disable the whole group. */
  disabled?: boolean
  /** Force selecting at least one option. Default false. */
  required?: boolean
  className?: string
}

const SPRING = { type: 'spring' as const, stiffness: 420, damping: 32, mass: 0.6 }

const SIZE = {
  sm: 'h-7 px-2.5 text-[11.5px] gap-1 [&>svg]:h-3 [&>svg]:w-3',
  md: 'h-9 px-3.5 text-[13px] gap-1.5 [&>svg]:h-3.5 [&>svg]:w-3.5',
  lg: 'h-11 px-5 text-[14.5px] gap-2 [&>svg]:h-4 [&>svg]:w-4',
} as const

export function ToggleGroup<V extends string = string>({
  options,
  value: controlled,
  defaultValue,
  onValueChange,
  variant = 'pills',
  size = 'md',
  disabled = false,
  required = false,
  className,
}: ToggleGroupProps<V>) {
  const [internal, setInternal] = React.useState<V[]>(defaultValue ?? [])
  const value = controlled ?? internal

  const toggle = (v: V) => {
    if (disabled) return
    const has = value.includes(v)
    let next: V[]
    if (has) {
      if (required && value.length === 1) return
      next = value.filter((x) => x !== v)
    } else {
      next = [...value, v]
    }
    if (controlled === undefined) setInternal(next)
    onValueChange?.(next)
  }

  if (variant === 'pills') {
    return (
      <div
        role="group"
        className={cn(
          'inline-flex flex-wrap items-center gap-1.5',
          disabled && 'opacity-50',
          className,
        )}
      >
        {options.map((opt) => {
          const selected = value.includes(opt.value)
          return (
            <motion.button
              key={opt.value}
              type="button"
              role="checkbox"
              aria-checked={selected}
              disabled={opt.disabled || disabled}
              onClick={() => toggle(opt.value)}
              whileTap={{ scale: 0.97 }}
              transition={SPRING}
              className={cn(
                'inline-flex items-center rounded-full border font-medium tracking-tight backdrop-blur-xl transition-colors',
                SIZE[size],
                selected
                  ? 'border-white/15 bg-white/[0.1] text-white'
                  : 'border-white/[0.08] bg-white/[0.02] text-white/65 hover:bg-white/[0.06] hover:text-white',
              )}
            >
              {opt.icon}
              {opt.label}
            </motion.button>
          )
        })}
      </div>
    )
  }

  // segmented variant — joined pills
  return (
    <div
      role="group"
      className={cn(
        'inline-flex items-stretch overflow-hidden rounded-full border border-white/[0.08] backdrop-blur-xl',
        disabled && 'opacity-50',
        className,
      )}
      style={{
        background:
          'linear-gradient(180deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.015) 100%)',
      }}
    >
      {options.map((opt, i) => {
        const selected = value.includes(opt.value)
        return (
          <React.Fragment key={opt.value}>
            {i > 0 && (
              <span aria-hidden className="w-px self-stretch bg-white/[0.06]" />
            )}
            <motion.button
              type="button"
              role="checkbox"
              aria-checked={selected}
              disabled={opt.disabled || disabled}
              onClick={() => toggle(opt.value)}
              whileTap={{ scale: 0.97 }}
              transition={SPRING}
              className={cn(
                'inline-flex items-center font-medium tracking-tight transition-colors',
                SIZE[size],
                selected ? 'bg-white/[0.1] text-white' : 'text-white/65 hover:bg-white/[0.04] hover:text-white',
              )}
            >
              {opt.icon}
              {opt.label}
            </motion.button>
          </React.Fragment>
        )
      })}
    </div>
  )
}
