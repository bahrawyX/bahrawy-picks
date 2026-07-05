'use client'

/**
 * <Slider />  —  Apple-style range slider.
 *
 * Supports single value or range (`[low, high]`). Optional ticks +
 * labeled steps, optional value tooltip on the active thumb,
 * keyboard nav (arrows / Home / End / PageUp / PageDown), Apple
 * spring on hover/drag scale, clean white disc handle.
 */

import * as React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

type SingleProps = {
  value?: number
  defaultValue?: number
  onValueChange?: (next: number) => void
  range?: false
}
type RangeProps = {
  value?: [number, number]
  defaultValue?: [number, number]
  onValueChange?: (next: [number, number]) => void
  range: true
}

export type SliderProps = (SingleProps | RangeProps) & {
  min?: number
  max?: number
  step?: number
  /** Tick marks under the track at every `step`. Default false. */
  ticks?: boolean
  /** Show a small value tooltip above the active thumb on hover/drag. Default true. */
  showValueTooltip?: boolean
  /** Format the tooltip value. */
  format?: (value: number) => string
  /** Accent color for the filled range + tooltip. Default SF indigo. */
  accent?: string
  /** Accessible label. */
  label?: string
  disabled?: boolean
  className?: string
}

const APPLE_SPRING = { type: 'spring' as const, stiffness: 420, damping: 32, mass: 0.6 }

function clamp(n: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, n))
}
function snap(n: number, step: number, min: number) {
  return Math.round((n - min) / step) * step + min
}

export function Slider(props: SliderProps) {
  const {
    min = 0,
    max = 100,
    step = 1,
    ticks = false,
    showValueTooltip = true,
    format = (v) => String(Math.round(v)),
    accent = '#5E5CE6',
    label = 'Slider',
    disabled = false,
    className,
  } = props
  const isRange = props.range === true

  const [internal, setInternal] = React.useState<number | [number, number]>(
    () =>
      isRange
        ? ((props as RangeProps).defaultValue ?? [min, max])
        : ((props as SingleProps).defaultValue ?? (min + max) / 2),
  )

  const controlled = (props as { value?: number | [number, number] }).value
  const value =
    controlled !== undefined ? controlled : internal

  const trackRef = React.useRef<HTMLDivElement>(null)
  const [active, setActive] = React.useState<'a' | 'b' | null>(null)
  const [hovered, setHovered] = React.useState<'a' | 'b' | null>(null)

  const lo = isRange ? (value as [number, number])[0] : (value as number)
  const hi = isRange ? (value as [number, number])[1] : (value as number)

  const pct = (v: number) => ((v - min) / (max - min)) * 100

  const commit = (next: number | [number, number]) => {
    if (controlled === undefined) setInternal(next)
    if (isRange) (props as RangeProps).onValueChange?.(next as [number, number])
    else (props as SingleProps).onValueChange?.(next as number)
  }

  const valueFromPointer = (clientX: number) => {
    const r = trackRef.current?.getBoundingClientRect()
    if (!r) return min
    const ratio = clamp((clientX - r.left) / r.width, 0, 1)
    return snap(min + ratio * (max - min), step, min)
  }

  const onPointerDown = (e: React.PointerEvent) => {
    if (disabled) return
    const v = valueFromPointer(e.clientX)
    if (!isRange) {
      setActive('a')
      commit(v)
      return
    }
    // Range: pick the nearer thumb
    const which = Math.abs(v - lo) <= Math.abs(v - hi) ? 'a' : 'b'
    setActive(which)
    if (which === 'a') commit([Math.min(v, hi), hi] as [number, number])
    else commit([lo, Math.max(v, lo)] as [number, number])
  }

  React.useEffect(() => {
    if (!active) return
    const onMove = (e: PointerEvent) => {
      const v = valueFromPointer(e.clientX)
      if (!isRange) {
        commit(v)
        return
      }
      if (active === 'a') commit([Math.min(v, hi), hi] as [number, number])
      else commit([lo, Math.max(v, lo)] as [number, number])
    }
    const onUp = () => setActive(null)
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
    window.addEventListener('pointercancel', onUp)
    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
      window.removeEventListener('pointercancel', onUp)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, lo, hi, min, max, step, isRange])

  const stepTo = (which: 'a' | 'b', next: number) => {
    const v = clamp(next, min, max)
    if (!isRange) {
      commit(v)
      return
    }
    if (which === 'a') commit([Math.min(v, hi), hi] as [number, number])
    else commit([lo, Math.max(v, lo)] as [number, number])
  }

  const onThumbKeyDown =
    (which: 'a' | 'b') => (e: React.KeyboardEvent) => {
      if (disabled) return
      const cur = which === 'a' ? lo : hi
      const big = Math.max(step, (max - min) / 10)
      let next: number | null = null
      switch (e.key) {
        case 'ArrowLeft':
        case 'ArrowDown':
          next = snap(cur - step, step, min)
          break
        case 'ArrowRight':
        case 'ArrowUp':
          next = snap(cur + step, step, min)
          break
        case 'PageDown':
          next = snap(cur - big, step, min)
          break
        case 'PageUp':
          next = snap(cur + big, step, min)
          break
        case 'Home':
          next = min
          break
        case 'End':
          next = max
          break
      }
      if (next !== null) {
        e.preventDefault()
        stepTo(which, next)
      }
    }

  const tickCount = ticks ? Math.floor((max - min) / step) + 1 : 0

  return (
    <div
      className={cn(
        'relative w-full select-none',
        disabled && 'opacity-50',
        className,
      )}
      aria-label={label}
    >
      <div
        ref={trackRef}
        onPointerDown={onPointerDown}
        className="relative flex h-5 w-full cursor-pointer items-center"
      >
        {/* Track */}
        <div className="h-[6px] w-full overflow-hidden rounded-full bg-picks-fg/[0.08]" />
        {/* Filled range */}
        <div
          className="pointer-events-none absolute inset-y-0 my-auto h-[6px] rounded-full"
          style={{
            left: `${pct(lo)}%`,
            width: `${pct(hi) - pct(lo)}%`,
            background: accent,
          }}
        />
        {/* Ticks */}
        {ticks && (
          <div className="pointer-events-none absolute inset-x-0 top-1/2 flex -translate-y-1/2 justify-between px-[3px]">
            {Array.from({ length: tickCount }).map((_, i) => (
              <span
                key={i}
                className="h-1 w-px bg-picks-fg/20"
              />
            ))}
          </div>
        )}
        {/* Thumb A (or single) */}
        <Thumb
          pct={pct(lo)}
          accent={accent}
          active={active === 'a'}
          hovered={hovered === 'a'}
          onHoverStart={() => setHovered('a')}
          onHoverEnd={() => setHovered(null)}
          showTooltip={showValueTooltip}
          tooltip={format(lo)}
          ariaLabel={isRange ? `${label} minimum` : label}
          min={min}
          max={isRange ? hi : max}
          value={lo}
          valueText={format(lo)}
          disabled={disabled}
          onKeyDown={onThumbKeyDown('a')}
        />
        {/* Thumb B (range only) */}
        {isRange && (
          <Thumb
            pct={pct(hi)}
            accent={accent}
            active={active === 'b'}
            hovered={hovered === 'b'}
            onHoverStart={() => setHovered('b')}
            onHoverEnd={() => setHovered(null)}
            showTooltip={showValueTooltip}
            tooltip={format(hi)}
            ariaLabel={`${label} maximum`}
            min={lo}
            max={max}
            value={hi}
            valueText={format(hi)}
            disabled={disabled}
            onKeyDown={onThumbKeyDown('b')}
          />
        )}
      </div>
    </div>
  )
}

function Thumb({
  pct,
  accent,
  active,
  hovered,
  onHoverStart,
  onHoverEnd,
  showTooltip,
  tooltip,
  ariaLabel,
  min,
  max,
  value,
  valueText,
  disabled,
  onKeyDown,
}: {
  pct: number
  accent: string
  active: boolean
  hovered: boolean
  onHoverStart: () => void
  onHoverEnd: () => void
  showTooltip: boolean
  tooltip: string
  ariaLabel: string
  min: number
  max: number
  value: number
  valueText: string
  disabled: boolean
  onKeyDown: (e: React.KeyboardEvent) => void
}) {
  const [focused, setFocused] = React.useState(false)
  const scale = active ? 1.15 : hovered || focused ? 1.08 : 1
  return (
    <motion.div
      role="slider"
      tabIndex={disabled ? -1 : 0}
      aria-label={ariaLabel}
      aria-valuemin={min}
      aria-valuemax={max}
      aria-valuenow={value}
      aria-valuetext={valueText}
      aria-disabled={disabled || undefined}
      aria-orientation="horizontal"
      onKeyDown={onKeyDown}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      onPointerEnter={onHoverStart}
      onPointerLeave={onHoverEnd}
      className="absolute top-1/2 h-4 w-4 rounded-full bg-picks-fg outline-none focus-visible:ring-2 focus-visible:ring-picks-fg/60 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
      style={{
        // Inset the X position so the disc stays fully on the track:
        // at pct=0 → left edge of handle on track's left; at pct=100 →
        // right edge of handle on track's right.
        left: `calc(${pct}% + ${8 - (pct / 100) * 16}px)`,
        // Compose the -50% centering into framer-motion's transform so
        // animate={{ scale }} doesn't blow away the translate.
        x: '-50%',
        y: '-50%',
        boxShadow: '0 0 0 0.5px rgba(0,0,0,0.06), 0 2px 6px rgba(0,0,0,0.25)',
      }}
      initial={false}
      animate={{ scale }}
      transition={APPLE_SPRING}
    >
      {showTooltip && (active || hovered || focused) && (
        <motion.span
          initial={{ opacity: 0, y: 4, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={APPLE_SPRING}
          className="pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 rounded-md px-1.5 py-0.5 font-mono text-[10.5px] font-semibold tabular-nums text-white"
          style={{ background: accent }}
        >
          {tooltip}
        </motion.span>
      )}
    </motion.div>
  )
}
