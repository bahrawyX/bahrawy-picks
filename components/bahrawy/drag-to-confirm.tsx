'use client'

/**
 * <DragToConfirm />
 *
 * The iOS slide-to-unlock pattern, modernised. A knob sits at the
 * left of a pill track; drag it to the right and a colored fill grows
 * behind it. If you release past the threshold (default 90%) it locks
 * to the right, fires `onConfirm`, and the label swaps to a confirmed
 * state with a check icon. If you release before the threshold, the
 * knob springs back to start and `onCancel` fires.
 *
 * Used for destructive or payment actions where a single click feels
 * too easy. The tactile gesture forces intent.
 */

import * as React from 'react'
import { motion, useMotionValue, useTransform, animate } from 'framer-motion'
import { Check, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface DragToConfirmProps {
  /** Idle label shown across the track. */
  label?: string
  /** Confirmed label shown after the user completes the slide. */
  confirmedLabel?: string
  /** Fires when the user drags past the threshold and releases. */
  onConfirm?: () => void
  /** Fires when the user releases before the threshold. */
  onCancel?: () => void
  /** Visual variant — default uses emerald, danger uses rose. */
  variant?: 'default' | 'danger' | 'custom'
  /** Custom accent (hex). Overrides variant accent. */
  accent?: string
  /** Reset the confirmed state back to idle (controlled). */
  confirmed?: boolean
  /** Threshold 0..1 — how far the knob must travel. Default 0.9. */
  threshold?: number
  /** Disable interaction. */
  disabled?: boolean
  /** Icon shown on the knob in the idle state. Default ChevronRight. */
  idleIcon?: React.ReactNode
  /** Track height in px. Default 52. */
  height?: number
  className?: string
}

const ACCENTS = {
  default: '#34D399', // emerald-400
  danger: '#FB7185',  // rose-400
}

const SPRING_BACK = { type: 'spring' as const, stiffness: 500, damping: 36, mass: 0.5 }
const SPRING_CONFIRM = { type: 'spring' as const, stiffness: 320, damping: 28 }

export function DragToConfirm({
  label = 'Slide to confirm',
  confirmedLabel = 'Confirmed',
  onConfirm,
  onCancel,
  variant = 'default',
  accent,
  confirmed: controlledConfirmed,
  threshold = 0.9,
  disabled = false,
  idleIcon,
  height = 52,
  className,
}: DragToConfirmProps) {
  const trackRef = React.useRef<HTMLDivElement>(null)
  const [trackWidth, setTrackWidth] = React.useState(0)
  const [confirmed, setConfirmed] = React.useState(false)
  const isControlled = controlledConfirmed !== undefined
  const isConfirmed = isControlled ? controlledConfirmed : confirmed

  const PADDING = 4
  const knobSize = height - PADDING * 2
  const maxX = Math.max(0, trackWidth - knobSize - PADDING * 2)

  const x = useMotionValue(0)
  const progress = useTransform(x, [0, Math.max(1, maxX)], [0, 1])
  // Fill width grows with progress, plus a bit extra so it pokes past the knob's edge.
  const fillWidth = useTransform(
    progress,
    [0, 1],
    [`${knobSize + PADDING * 2}px`, '100%'],
  )
  const labelOpacity = useTransform(progress, [0, 0.55], [1, 0])

  // Measure the track on mount and on resize.
  React.useEffect(() => {
    if (!trackRef.current) return
    const measure = () => {
      const w = trackRef.current?.getBoundingClientRect().width ?? 0
      setTrackWidth(w)
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(trackRef.current)
    return () => ro.disconnect()
  }, [])

  // If controlled `confirmed` flips back to false, snap the knob home.
  React.useEffect(() => {
    if (isControlled && !controlledConfirmed) {
      animate(x, 0, SPRING_BACK)
    }
  }, [controlledConfirmed, isControlled, x])

  const accentColor =
    accent ?? (variant === 'danger' ? ACCENTS.danger : ACCENTS.default)

  const handleEnd = () => {
    if (disabled || isConfirmed) return
    const pos = x.get()
    const reached = maxX > 0 && pos / maxX >= threshold
    if (reached) {
      animate(x, maxX, SPRING_CONFIRM)
      if (!isControlled) setConfirmed(true)
      onConfirm?.()
    } else {
      animate(x, 0, SPRING_BACK)
      onCancel?.()
    }
  }

  return (
    <div
      ref={trackRef}
      className={cn(
        'relative inline-flex w-full max-w-md select-none items-center overflow-hidden rounded-full border border-white/10 bg-white/[0.04]',
        disabled && 'cursor-not-allowed opacity-50',
        className,
      )}
      style={{ height }}
    >
      {/* Color fill */}
      <motion.div
        aria-hidden
        className="absolute inset-y-0 left-0 rounded-full"
        style={{
          width: fillWidth,
          background: `linear-gradient(90deg, ${accentColor}55, ${accentColor}cc)`,
        }}
      />

      {/* Idle label */}
      <motion.span
        aria-hidden
        style={{ opacity: isConfirmed ? 0 : labelOpacity }}
        className="pointer-events-none absolute inset-0 flex items-center justify-center text-[12.5px] font-semibold tracking-tight text-white/65"
      >
        <span className="inline-flex items-center gap-2">
          <motion.span
            animate={{ x: [0, 4, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
            className="opacity-50"
            aria-hidden
          >
            →
          </motion.span>
          {label}
        </span>
      </motion.span>

      {/* Confirmed label */}
      {isConfirmed && (
        <motion.span
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={SPRING_CONFIRM}
          className="pointer-events-none absolute inset-0 flex items-center justify-center text-[12.5px] font-semibold tracking-tight text-white"
        >
          <Check className="mr-1.5 h-3.5 w-3.5" strokeWidth={3} />
          {confirmedLabel}
        </motion.span>
      )}

      {/* Knob */}
      <motion.div
        drag={!disabled && !isConfirmed && maxX > 0 ? 'x' : false}
        dragConstraints={{ left: 0, right: maxX }}
        dragElastic={{ left: 0, right: 0.04 }}
        dragMomentum={false}
        onDragEnd={handleEnd}
        style={{ x, marginLeft: PADDING, width: knobSize, height: knobSize }}
        whileTap={{ scale: 0.95 }}
        className={cn(
          'relative z-10 flex shrink-0 items-center justify-center rounded-full bg-white text-zinc-900 shadow-lg shadow-black/40',
          !disabled && !isConfirmed && 'cursor-grab active:cursor-grabbing',
          disabled && 'cursor-not-allowed',
        )}
      >
        {isConfirmed ? (
          <Check className="h-4 w-4" strokeWidth={3} />
        ) : (
          (idleIcon ?? <ChevronRight className="h-4 w-4" strokeWidth={3} />)
        )}
      </motion.div>
    </div>
  )
}
