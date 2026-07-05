'use client'

/**
 * <ImageCompare />
 *
 * The "drag the handle to wipe between before/after" component every
 * redesign post uses. Two images stacked; the top image is clipped by
 * a CSS clip-path at the handle's position so the bottom image shows
 * through. Drag horizontally (or vertically) to move the wipe;
 * arrow keys nudge the handle by 4% (16% with Shift).
 *
 * Pass image URLs directly. Pass a `height` (number or string) since
 * the container needs to be sized so both images can fill it.
 */

import * as React from 'react'
import { motion } from 'framer-motion'
import { GripHorizontal, GripVertical } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface ImageCompareProps {
  /** URL of the "before" image (shown on the left/top side). */
  before: string
  /** URL of the "after" image (shown on the right/bottom side). */
  after: string
  /** Label rendered on top of the before image. */
  beforeLabel?: string
  /** Label rendered on top of the after image. */
  afterLabel?: string
  /** Wipe direction. Default 'horizontal'. */
  direction?: 'horizontal' | 'vertical'
  /** Initial handle position 0..1. Default 0.5. */
  defaultPosition?: number
  /** Container height. Default 360. */
  height?: number | string
  /** Container width. Default '100%'. */
  width?: number | string
  /** Disable interaction (handle still renders). */
  disabled?: boolean
  className?: string
}

export function ImageCompare({
  before,
  after,
  beforeLabel,
  afterLabel,
  direction = 'horizontal',
  defaultPosition = 0.5,
  height = 360,
  width = '100%',
  disabled = false,
  className,
}: ImageCompareProps) {
  const isHorizontal = direction === 'horizontal'
  const containerRef = React.useRef<HTMLDivElement>(null)
  const [pos, setPos] = React.useState(clamp(defaultPosition, 0, 1))
  const [dragging, setDragging] = React.useState(false)

  const updateFromPointer = (clientX: number, clientY: number) => {
    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) return
    const raw = isHorizontal
      ? (clientX - rect.left) / rect.width
      : (clientY - rect.top) / rect.height
    setPos(clamp(raw, 0, 1))
  }

  const onPointerDown = (e: React.PointerEvent) => {
    if (disabled) return
    e.preventDefault()
    setDragging(true)
    ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
    updateFromPointer(e.clientX, e.clientY)
  }
  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging) return
    updateFromPointer(e.clientX, e.clientY)
  }
  const onPointerUp = (e: React.PointerEvent) => {
    if (!dragging) return
    setDragging(false)
    ;(e.target as HTMLElement).releasePointerCapture(e.pointerId)
  }

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return
    const step = e.shiftKey ? 0.16 : 0.04
    const inc = isHorizontal
      ? e.key === 'ArrowRight'
        ? step
        : e.key === 'ArrowLeft'
          ? -step
          : 0
      : e.key === 'ArrowDown'
        ? step
        : e.key === 'ArrowUp'
          ? -step
          : 0
    if (inc !== 0) {
      e.preventDefault()
      setPos((p) => clamp(p + inc, 0, 1))
    } else if (e.key === 'Home') {
      e.preventDefault()
      setPos(0)
    } else if (e.key === 'End') {
      e.preventDefault()
      setPos(1)
    }
  }

  // Clip the top "before" image so only the visible portion shows.
  const clipPath = isHorizontal
    ? `inset(0 ${(1 - pos) * 100}% 0 0)`
    : `inset(0 0 ${(1 - pos) * 100}% 0)`

  return (
    <div
      ref={containerRef}
      className={cn(
        'relative select-none overflow-hidden rounded-2xl border border-picks-fg/[0.08] bg-picks-surface',
        !disabled && (isHorizontal ? 'cursor-ew-resize' : 'cursor-ns-resize'),
        className,
      )}
      style={{ width, height }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
    >
      {/* AFTER image — full-bleed, always visible. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={after}
        alt={afterLabel ?? 'After'}
        className="pointer-events-none absolute inset-0 h-full w-full object-cover"
        draggable={false}
      />

      {/* BEFORE image — clipped by handle position. */}
      <motion.div
        aria-hidden
        className="absolute inset-0"
        style={{ clipPath }}
        transition={{ type: 'spring', stiffness: 600, damping: 40 }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={before}
          alt={beforeLabel ?? 'Before'}
          className="pointer-events-none absolute inset-0 h-full w-full object-cover"
          draggable={false}
        />
      </motion.div>

      {/* Labels */}
      {beforeLabel && (
        <span
          className={cn(
            'pointer-events-none absolute rounded-full border border-picks-fg/15 bg-black/55 px-2.5 py-1 text-[10.5px] font-semibold uppercase tracking-[0.18em] text-picks-fg/90 backdrop-blur',
            isHorizontal ? 'left-3 top-3' : 'left-3 top-3',
          )}
        >
          {beforeLabel}
        </span>
      )}
      {afterLabel && (
        <span
          className={cn(
            'pointer-events-none absolute rounded-full border border-picks-fg/15 bg-black/55 px-2.5 py-1 text-[10.5px] font-semibold uppercase tracking-[0.18em] text-picks-fg/90 backdrop-blur',
            isHorizontal ? 'right-3 top-3' : 'right-3 bottom-3',
          )}
        >
          {afterLabel}
        </span>
      )}

      {/* Divider line */}
      <div
        aria-hidden
        className={cn(
          'pointer-events-none absolute bg-picks-fg/85 shadow-[0_0_20px_rgba(255,255,255,0.45)]',
          isHorizontal
            ? 'top-0 h-full w-[2px]'
            : 'left-0 w-full h-[2px]',
        )}
        style={
          isHorizontal
            ? { left: `${pos * 100}%`, transform: 'translateX(-1px)' }
            : { top: `${pos * 100}%`, transform: 'translateY(-1px)' }
        }
      />

      {/* Handle */}
      <button
        type="button"
        role="slider"
        aria-orientation={isHorizontal ? 'horizontal' : 'vertical'}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(pos * 100)}
        aria-label="Drag to compare"
        onKeyDown={onKeyDown}
        disabled={disabled}
        className={cn(
          'absolute z-10 flex h-10 w-10 items-center justify-center rounded-full bg-picks-fg text-picks-surface shadow-2xl ring-1 ring-black/10 transition-transform',
          dragging && 'scale-110',
          !disabled && (isHorizontal ? 'cursor-ew-resize' : 'cursor-ns-resize'),
        )}
        style={
          isHorizontal
            ? { top: '50%', left: `${pos * 100}%`, transform: 'translate(-50%, -50%)' }
            : { left: '50%', top: `${pos * 100}%`, transform: 'translate(-50%, -50%)' }
        }
      >
        {isHorizontal ? (
          <GripVertical className="h-4 w-4" strokeWidth={2.5} />
        ) : (
          <GripHorizontal className="h-4 w-4" strokeWidth={2.5} />
        )}
      </button>
    </div>
  )
}

function clamp(v: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, v))
}
