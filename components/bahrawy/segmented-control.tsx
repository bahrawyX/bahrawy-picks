'use client'

/**
 * <SegmentedControl />  —  iOS-style segmented picker.
 *
 * A pill of 2–N options with a sliding indicator that glides between
 * the active segment via Framer's `layoutId`. Supports icons + labels,
 * three sizes, controlled / uncontrolled, optional full-width.
 *
 * Apple aesthetics: vibrancy wrapper with inner shadow, soft white
 * indicator with multi-layer shadow, SF Pro weight transitions on
 * label as active state changes.
 */

import * as React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { useRovingTabindex } from '@/lib/use-roving-tabindex'

export interface SegmentedControlOption<V extends string = string> {
  value: V
  label: React.ReactNode
  /** Optional leading icon. */
  icon?: React.ReactNode
  /** Disable just this segment. */
  disabled?: boolean
}

export interface SegmentedControlProps<V extends string = string> {
  options: SegmentedControlOption<V>[]
  /** Controlled value. */
  value?: V
  /** Uncontrolled default value. */
  defaultValue?: V
  /** Fires on segment change. */
  onValueChange?: (value: V) => void
  /** Visual size. Default 'md'. */
  size?: 'sm' | 'md' | 'lg'
  /** Stretch to fill container width. */
  fullWidth?: boolean
  /** Disable the entire control. */
  disabled?: boolean
  /** Optional id for the indicator's layoutId (use when multiple controls share a page). */
  layoutId?: string
  className?: string
}

const APPLE_LAYOUT_SPRING = { type: 'spring' as const, stiffness: 480, damping: 36, mass: 0.5 }

const SIZE = {
  sm: {
    h: 'h-7',
    text: 'text-[11.5px]',
    px: 'px-2.5',
    gap: 'gap-1',
    iconWrap: '[&>svg]:h-3 [&>svg]:w-3',
    radius: 'rounded-[7px]',
    outerRadius: 'rounded-[9px]',
    p: 'p-[3px]',
  },
  md: {
    h: 'h-9',
    text: 'text-[13px]',
    px: 'px-3.5',
    gap: 'gap-1.5',
    iconWrap: '[&>svg]:h-3.5 [&>svg]:w-3.5',
    radius: 'rounded-[8px]',
    outerRadius: 'rounded-[10px]',
    p: 'p-[3px]',
  },
  lg: {
    h: 'h-11',
    text: 'text-[14.5px]',
    px: 'px-5',
    gap: 'gap-2',
    iconWrap: '[&>svg]:h-4 [&>svg]:w-4',
    radius: 'rounded-[10px]',
    outerRadius: 'rounded-[12px]',
    p: 'p-[4px]',
  },
} as const

export function SegmentedControl<V extends string = string>({
  options,
  value: valueProp,
  defaultValue,
  onValueChange,
  size = 'md',
  fullWidth = false,
  disabled = false,
  layoutId,
  className,
}: SegmentedControlProps<V>) {
  const [internal, setInternal] = React.useState<V>(
    defaultValue ?? options[0]?.value ?? ('' as V),
  )
  const value = valueProp ?? internal

  const id = React.useId()
  const indicatorLayoutId = layoutId ?? `segmented-control-indicator-${id}`

  const sz = SIZE[size]

  const select = (v: V) => {
    if (disabled) return
    if (valueProp === undefined) setInternal(v)
    onValueChange?.(v)
  }

  const selectedIndex = Math.max(0, options.findIndex((o) => o.value === value))

  const roving = useRovingTabindex({
    count: options.length,
    isDisabled: (index) => Boolean(options[index]?.disabled || disabled),
    focusIndex: selectedIndex,
    onNavigate: (index) => {
      const opt = options[index]
      if (opt && !opt.disabled) select(opt.value)
    },
  })

  return (
    <div
      role="radiogroup"
      aria-disabled={disabled}
      className={cn(
        'relative inline-flex shrink-0 items-stretch',
        sz.h,
        sz.p,
        sz.outerRadius,
        'border border-white/[0.06] backdrop-blur-xl',
        fullWidth && 'w-full',
        disabled && 'opacity-50',
        className,
      )}
      style={{
        background:
          'linear-gradient(180deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.015) 100%)',
        boxShadow:
          'inset 0 1px 0 rgba(255,255,255,0.04), inset 0 0 0 0.5px rgba(255,255,255,0.04)',
      }}
    >
      {options.map((opt, index) => {
        const active = opt.value === value
        return (
          <button
            key={opt.value}
            type="button"
            role="radio"
            aria-checked={active}
            aria-disabled={opt.disabled || disabled}
            disabled={opt.disabled || disabled}
            onClick={() => select(opt.value)}
            {...roving.getItemProps(index)}
            className={cn(
              'group relative inline-flex items-center justify-center transition-colors',
              sz.px,
              sz.gap,
              sz.text,
              sz.radius,
              'font-medium tracking-tight',
              fullWidth && 'flex-1',
              active ? 'text-white' : 'text-white/65 hover:text-white/85',
              (opt.disabled || disabled) && 'cursor-not-allowed',
            )}
          >
            {active && (
              <motion.span
                layoutId={indicatorLayoutId}
                className={cn('absolute inset-0', sz.radius)}
                style={{
                  background:
                    'linear-gradient(180deg, rgba(255,255,255,0.16) 0%, rgba(255,255,255,0.08) 100%)',
                  boxShadow:
                    '0 1px 0 rgba(255,255,255,0.18) inset, 0 0 0 0.5px rgba(255,255,255,0.12), 0 4px 12px -4px rgba(0,0,0,0.45)',
                }}
                transition={APPLE_LAYOUT_SPRING}
              />
            )}
            {opt.icon && (
              <span
                className={cn(
                  'relative inline-flex shrink-0 items-center justify-center transition-transform',
                  active && 'scale-[1.02]',
                  sz.iconWrap,
                )}
              >
                {opt.icon}
              </span>
            )}
            <span
              className={cn(
                'relative whitespace-nowrap transition-[font-weight]',
                active && 'font-semibold',
              )}
            >
              {opt.label}
            </span>
          </button>
        )
      })}
    </div>
  )
}
