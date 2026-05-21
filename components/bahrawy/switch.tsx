'use client'

/**
 * <Switch />
 *
 * Animated toggle switch with a spring thumb. Optional label, controlled or
 * uncontrolled.
 *
 * @param checked        — Controlled checked state.
 * @param defaultChecked — Initial state for uncontrolled mode.
 * @param onChange       — Called with the new checked value.
 * @param label          — Optional label rendered to the right of the switch.
 * @param size           — 'sm' | 'md' | 'lg'. Default 'md'.
 * @param accentColor    — Background color when on. Default #FFFFFF.
 * @param disabled       — Disable interaction.
 * @param className      — Extra classes for the wrapper.
 */

import * as React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

export interface SwitchProps {
  checked?: boolean
  defaultChecked?: boolean
  onChange?: (checked: boolean) => void
  label?: React.ReactNode
  size?: 'sm' | 'md' | 'lg'
  accentColor?: string
  disabled?: boolean
  className?: string
}

const SIZES = {
  sm: { w: 32, h: 18, thumb: 14, pad: 2 },
  md: { w: 42, h: 24, thumb: 18, pad: 3 },
  lg: { w: 52, h: 30, thumb: 24, pad: 3 },
}

const SPRING = { type: 'spring' as const, stiffness: 600, damping: 32, mass: 0.4 }

export function Switch({
  checked,
  defaultChecked = false,
  onChange,
  label,
  size = 'md',
  accentColor = '#FFFFFF',
  disabled = false,
  className,
}: SwitchProps) {
  const [internal, setInternal] = React.useState(defaultChecked)
  const isControlled = checked !== undefined
  const isOn = isControlled ? checked : internal

  const toggle = () => {
    if (disabled) return
    if (!isControlled) setInternal(!isOn)
    onChange?.(!isOn)
  }

  const { w, h, thumb, pad } = SIZES[size]
  const travel = w - thumb - pad * 2

  return (
    <label
      className={cn(
        'inline-flex items-center gap-3 select-none',
        disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer',
        className,
      )}
    >
      <button
        type="button"
        role="switch"
        aria-checked={isOn}
        disabled={disabled}
        onClick={toggle}
        className="relative shrink-0 rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
        style={{
          width: w,
          height: h,
          background: isOn ? accentColor : 'rgba(255,255,255,0.12)',
        }}
      >
        <motion.span
          aria-hidden
          animate={{ x: isOn ? travel : 0 }}
          transition={SPRING}
          style={{
            width: thumb,
            height: thumb,
            top: pad,
            left: pad,
            background: isOn ? '#0A0A0A' : '#FFFFFF',
          }}
          className="absolute rounded-full shadow-md"
        />
      </button>
      {label && <span className="text-sm text-white/80">{label}</span>}
    </label>
  )
}
