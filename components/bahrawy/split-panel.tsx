'use client'

/**
 * <SplitPanel />
 *
 * Two panes with a draggable divider between them — the Linear/Notion
 * editor pattern. Drag the divider to resize; if you try to cross
 * min/max, the panel rubber-bands. Optional snap points (provide
 * percentages 0..1) that the divider gently magnets toward. Works in
 * horizontal or vertical orientation.
 *
 * Children must be exactly two nodes — first is the leading pane
 * (left or top), second is the trailing pane (right or bottom).
 */

import * as React from 'react'
import { motion, animate } from 'framer-motion'
import { GripHorizontal, GripVertical } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface SplitPanelProps {
  /** Orientation. Default 'horizontal' (left / right). */
  direction?: 'horizontal' | 'vertical'
  /** Initial size of the leading pane, as a fraction 0..1. Default 0.5. */
  defaultSize?: number
  /** Minimum fraction for the leading pane. Default 0.15. */
  minSize?: number
  /** Maximum fraction for the leading pane. Default 0.85. */
  maxSize?: number
  /** Snap targets (fractions) the divider magnets toward. */
  snap?: number[]
  /** Tolerance (in fraction) for snap pull. Default 0.04. */
  snapTolerance?: number
  /** Fires while the user drags (debounced via rAF). */
  onResize?: (size: number) => void
  /** Two children — leading + trailing pane. */
  children: [React.ReactNode, React.ReactNode]
  className?: string
}

const SPRING = { type: 'spring' as const, stiffness: 280, damping: 30, mass: 0.6 }

export function SplitPanel({
  direction = 'horizontal',
  defaultSize = 0.5,
  minSize = 0.15,
  maxSize = 0.85,
  snap,
  snapTolerance = 0.04,
  onResize,
  children,
  className,
}: SplitPanelProps) {
  const containerRef = React.useRef<HTMLDivElement>(null)
  const [size, setSize] = React.useState(clamp(defaultSize, minSize, maxSize))
  const [dragging, setDragging] = React.useState(false)
  const dragStateRef = React.useRef<{ start: number; origin: number } | null>(null)
  // Latest pending fraction queued for the next rAF tick.
  const pendingRef = React.useRef<number | null>(null)
  const rafRef = React.useRef<number | null>(null)
  // Mirror of `size` accessible inside the rAF callback without re-creating handlers.
  const sizeRef = React.useRef(size)
  sizeRef.current = size
  const isHorizontal = direction === 'horizontal'

  const flushPending = React.useCallback(() => {
    rafRef.current = null
    const next = pendingRef.current
    pendingRef.current = null
    if (next != null) setSize(next)
  }, [])

  const cancelRaf = React.useCallback(() => {
    if (rafRef.current != null) {
      cancelAnimationFrame(rafRef.current)
      rafRef.current = null
    }
    pendingRef.current = null
  }, [])

  // Clean up any in-flight rAF on unmount.
  React.useEffect(() => () => cancelRaf(), [cancelRaf])

  // While dragging, lock the body cursor + suppress text selection so the
  // pointer feel matches native resize handles even when the pointer drifts
  // outside the thin divider hit-area.
  React.useEffect(() => {
    if (!dragging) return
    const prevCursor = document.body.style.cursor
    const prevSelect = document.body.style.userSelect
    document.body.style.cursor = isHorizontal ? 'col-resize' : 'row-resize'
    document.body.style.userSelect = 'none'
    return () => {
      document.body.style.cursor = prevCursor
      document.body.style.userSelect = prevSelect
    }
  }, [dragging, isHorizontal])

  const applySize = React.useCallback(
    (raw: number) => {
      const next = clamp(raw, minSize, maxSize)
      setSize(next)
      onResize?.(next)
    },
    [minSize, maxSize, onResize],
  )

  const onPointerDown = (e: React.PointerEvent) => {
    e.preventDefault()
    const container = containerRef.current
    if (!container) return
    const rect = container.getBoundingClientRect()
    const length = isHorizontal ? rect.width : rect.height
    dragStateRef.current = {
      start: isHorizontal ? e.clientX : e.clientY,
      origin: sizeRef.current * length,
    }
    setDragging(true)
    ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
  }

  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragStateRef.current) return
    const container = containerRef.current
    if (!container) return
    const rect = container.getBoundingClientRect()
    const length = isHorizontal ? rect.width : rect.height
    const delta = (isHorizontal ? e.clientX : e.clientY) - dragStateRef.current.start
    const rawPx = dragStateRef.current.origin + delta
    let frac = rawPx / length

    // Snap pull
    if (snap && snap.length > 0) {
      for (const target of snap) {
        if (Math.abs(frac - target) < snapTolerance) {
          frac = target
          break
        }
      }
    }

    // Rubber-band when crossing bounds
    const minPx = minSize
    const maxPx = maxSize
    if (frac < minPx) frac = minPx + (frac - minPx) * 0.25
    else if (frac > maxPx) frac = maxPx + (frac - maxPx) * 0.25

    // Batch via rAF — coalesces multiple pointermove events into one render
    // per frame, which is what makes the drag feel buttery.
    pendingRef.current = frac
    if (rafRef.current == null) {
      rafRef.current = requestAnimationFrame(flushPending)
    }
  }

  const onPointerUp = (e: React.PointerEvent) => {
    if (!dragStateRef.current) return
    dragStateRef.current = null
    setDragging(false)
    ;(e.target as HTMLElement).releasePointerCapture(e.pointerId)
    // Commit any frame that was queued but hadn't fired yet, then drop the rAF.
    const queued = pendingRef.current
    cancelRaf()
    const finalSize = queued ?? sizeRef.current
    // If we ended out-of-bounds (because of rubber band), spring to nearest valid.
    const clamped = clamp(finalSize, minSize, maxSize)
    if (clamped !== finalSize) {
      const start = finalSize
      setSize(start)
      animate(0, 1, {
        duration: 0.45,
        ease: [0.22, 1, 0.36, 1],
        onUpdate: (t) => setSize(start + (clamped - start) * t),
        onComplete: () => onResize?.(clamped),
      })
    } else {
      if (queued != null) setSize(clamped)
      onResize?.(clamped)
    }
  }

  const onKeyDown = (e: React.KeyboardEvent) => {
    const step = e.shiftKey ? 0.1 : 0.02
    if (isHorizontal ? e.key === 'ArrowLeft' : e.key === 'ArrowUp') {
      e.preventDefault()
      applySize(size - step)
    } else if (isHorizontal ? e.key === 'ArrowRight' : e.key === 'ArrowDown') {
      e.preventDefault()
      applySize(size + step)
    } else if (e.key === 'Home') {
      e.preventDefault()
      applySize(minSize)
    } else if (e.key === 'End') {
      e.preventDefault()
      applySize(maxSize)
    }
  }

  const leadingStyle = isHorizontal
    ? { width: `${size * 100}%` }
    : { height: `${size * 100}%` }

  return (
    <div
      ref={containerRef}
      className={cn(
        'relative flex h-full w-full overflow-hidden rounded-xl border border-white/[0.08] bg-zinc-950/40',
        isHorizontal ? 'flex-row' : 'flex-col',
        className,
      )}
    >
      <motion.div
        style={leadingStyle}
        transition={SPRING}
        className="relative min-w-0 min-h-0 overflow-auto"
      >
        {children[0]}
      </motion.div>

      {/* Divider */}
      <div
        role="separator"
        tabIndex={0}
        aria-orientation={isHorizontal ? 'vertical' : 'horizontal'}
        aria-valuenow={Math.round(size * 100)}
        aria-valuemin={Math.round(minSize * 100)}
        aria-valuemax={Math.round(maxSize * 100)}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onKeyDown={onKeyDown}
        className={cn(
          'group relative flex shrink-0 items-center justify-center transition-colors',
          isHorizontal
            ? 'w-1.5 cursor-col-resize hover:bg-violet-400/15'
            : 'h-1.5 cursor-row-resize hover:bg-violet-400/15',
          dragging && 'bg-violet-400/25',
          'outline-none focus-visible:bg-violet-400/30',
        )}
      >
        {/* Center hairline */}
        <span
          aria-hidden
          className={cn(
            'absolute bg-white/10 transition-colors',
            isHorizontal ? 'inset-y-0 left-1/2 w-px -translate-x-1/2' : 'inset-x-0 top-1/2 h-px -translate-y-1/2',
            (dragging || 'group-hover:bg-violet-400/60') && 'group-hover:bg-violet-400/60',
            dragging && 'bg-violet-400',
          )}
        />
        {/* Grip on hover */}
        <span
          aria-hidden
          className="pointer-events-none flex h-7 w-3 items-center justify-center rounded-md bg-white/[0.04] opacity-0 transition-opacity group-hover:opacity-100"
        >
          {isHorizontal ? (
            <GripVertical className="h-3 w-3 text-white/55" strokeWidth={2} />
          ) : (
            <GripHorizontal className="h-3 w-3 text-white/55" strokeWidth={2} />
          )}
        </span>
      </div>

      <motion.div
        style={isHorizontal ? { flex: 1 } : { flex: 1 }}
        className="relative min-w-0 min-h-0 overflow-auto"
      >
        {children[1]}
      </motion.div>
    </div>
  )
}

function clamp(v: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, v))
}
