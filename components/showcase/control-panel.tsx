'use client'

import * as React from 'react'
import { RotateCcw } from 'lucide-react'
import { cn } from '@/lib/utils'

// ---------------------------------------------------------------------------
// Control Panel Container
// ---------------------------------------------------------------------------

interface ControlPanelProps {
  children: React.ReactNode
  onReplay?: () => void
}

export function ControlPanel({ children, onReplay }: ControlPanelProps) {
  return (
    <div className="mt-4 rounded-xl border border-white/[0.08] bg-white/[0.02] p-4 space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold text-white/70 tracking-wide">Customize</h4>
        {onReplay && (
          <button
            onClick={onReplay}
            className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/60 hover:bg-white/10 hover:text-white transition-colors"
          >
            <RotateCcw className="h-3 w-3" />
            Replay
          </button>
        )}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
        {children}
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Slider Control
// ---------------------------------------------------------------------------

interface SliderControlProps {
  label: string
  value: number
  onChange: (v: number) => void
  min: number
  max: number
  step?: number
  unit?: string
}

export function SliderControl({
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
  unit = '',
}: SliderControlProps) {
  return (
    <div className="flex items-center gap-2 overflow-hidden rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 py-2">
      <span className="text-xs text-white/50 whitespace-nowrap shrink-0">
        {label}
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="min-w-0 flex-1 h-1 appearance-none rounded-full bg-white/10 cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white/80 [&::-webkit-slider-thumb]:shadow-sm"
      />
      <span className="text-xs font-mono text-white/70 shrink-0 text-right whitespace-nowrap">
        {value}{unit}
      </span>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Toggle Control
// ---------------------------------------------------------------------------

interface ToggleControlProps {
  label: string
  checked: boolean
  onChange: (v: boolean) => void
}

export function ToggleControl({ label, checked, onChange }: ToggleControlProps) {
  return (
    <div className="flex items-center justify-between gap-2 overflow-hidden rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 py-2">
      <span className="text-xs text-white/50 truncate">{label}</span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={cn(
          'relative h-5 w-9 rounded-full transition-colors',
          checked ? 'bg-white/30' : 'bg-white/10',
        )}
      >
        <span
          className={cn(
            'absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-transform',
            checked && 'translate-x-4',
          )}
        />
      </button>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Select Control
// ---------------------------------------------------------------------------

interface SelectOption {
  label: string
  value: string
}

interface SelectControlProps {
  label: string
  value: string
  onChange: (v: string) => void
  options: SelectOption[]
}

export function SelectControl({ label, value, onChange, options }: SelectControlProps) {
  return (
    <div className="flex items-center justify-between gap-2 overflow-hidden rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 py-2">
      <span className="text-xs text-white/50 shrink-0">{label}</span>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="bg-transparent text-xs text-white/70 font-mono border-none outline-none cursor-pointer appearance-none text-right pr-4"
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-zinc-900 text-white">
              {opt.label}
            </option>
          ))}
        </select>
        <svg
          className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 h-3 w-3 text-white/40"
          viewBox="0 0 12 12"
          fill="none"
        >
          <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </div>
  )
}
