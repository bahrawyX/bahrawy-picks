'use client'

/**
 * <DragToConfirm />  —  Apple Design System polish
 *
 * The iOS slide-to-unlock pattern, modernised. A knob sits at the
 * left of a pill track; drag it to the right and a soft white fill
 * grows behind it. If you release past the threshold (default 90%) it
 * locks to the right, fires `onConfirm`, the track briefly flashes
 * white, and the label swaps to a confirmed state with a check icon.
 * If you release before the threshold, the knob springs back to start
 * and `onCancel` fires.
 *
 * Used for destructive or payment actions where a single click feels
 * too easy. The tactile gesture forces intent.
 *
 * The accent drives the progress fill, the confirm flash and the
 * confirmed label: `variant="default"` is emerald, `variant="danger"`
 * is rose, and `accent` (any hex) overrides both.
 */

import * as React from 'react'
import { motion, useMotionValue, useTransform, animate } from 'framer-motion'
import { Check, ChevronsRight } from 'lucide-react'
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
  /** Custom accent (hex) — overrides the variant accent. */
  accent?: string
  /** Reset the confirmed state back to idle (controlled). */
  confirmed?: boolean
  /** Threshold 0..1 — how far the knob must travel. Default 0.9. */
  threshold?: number
  /** Disable interaction. */
  disabled?: boolean
  /** Icon shown on the knob in the idle state. Default ChevronsRight. */
  idleIcon?: React.ReactNode
  /** Track height in px. Default 52. */
  height?: number
  className?: string
}

// Apple springs — same physics across press, release, confirm.
const APPLE_SPRING = { type: 'spring' as const, stiffness: 420, damping: 32, mass: 0.6 }
const SPRING_BACK = { type: 'spring' as const, stiffness: 420, damping: 32, mass: 0.6 }
const SPRING_CONFIRM = { type: 'spring' as const, stiffness: 380, damping: 30, mass: 0.6 }

// Accent per variant — `accent` prop overrides.
const VARIANT_ACCENT: Record<NonNullable<DragToConfirmProps['variant']>, string> = {
  default: '#34D399', // emerald
  danger: '#FB7185', // rose
  custom: '#FFFFFF',
}

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
  const accentColor = accent ?? VARIANT_ACCENT[variant]

  const trackRef = React.useRef<HTMLDivElement>(null)
  const [trackWidth, setTrackWidth] = React.useState(0)
  const [confirmed, setConfirmed] = React.useState(false)
  const [flash, setFlash] = React.useState(false)
  const isControlled = controlledConfirmed !== undefined
  const isConfirmed = isControlled ? controlledConfirmed : confirmed

  const PADDING = 4
  const knobSize = height - PADDING * 2
  const maxX = Math.max(0, trackWidth - knobSize - PADDING * 2)

  const x = useMotionValue(0)
  const progress = useTransform(x, [0, Math.max(1, maxX)], [0, 1])
  // Fill width grows with the knob — covers the knob plus a little.
  const fillWidth = useTransform(
    progress,
    [0, 1],
    [`${knobSize + PADDING * 2}px`, '100%'],
  )
  const labelOpacity = useTransform(progress, [0, 0.5], [1, 0])

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
      setFlash(false)
    }
  }, [controlledConfirmed, isControlled, x])

  const fireConfirmFlash = React.useCallback(() => {
    setFlash(true)
    // Brief flash, then settle.
    window.setTimeout(() => setFlash(false), 320)
  }, [])

  const handleEnd = () => {
    if (disabled || isConfirmed) return
    const pos = x.get()
    const reached = maxX > 0 && pos / maxX >= threshold
    if (reached) {
      animate(x, maxX, SPRING_CONFIRM)
      if (!isControlled) setConfirmed(true)
      fireConfirmFlash()
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
        'relative isolate inline-flex w-full max-w-md select-none items-center overflow-hidden rounded-full border border-white/[0.06] backdrop-blur-xl',
        disabled && 'cursor-not-allowed opacity-50',
        className,
      )}
      style={{
        height,
        background:
          'linear-gradient(180deg, rgba(28,28,30,0.85) 0%, rgba(20,20,22,0.92) 100%)',
        boxShadow:
          'inset 0 1px 0 rgba(255,255,255,0.04), inset 0 0 0 0.5px rgba(255,255,255,0.04), 0 1px 2px rgba(0,0,0,0.4)',
      }}
    >
      {/* Progress fill — translucent accent, no gradient. */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-0 rounded-full"
        style={{
          width: fillWidth,
          background: `color-mix(in srgb, ${accentColor} 28%, transparent)`,
        }}
      />

      {/* Confirm flash overlay — brief solid accent. */}
      <motion.div
        aria-hidden
        initial={false}
        animate={{ opacity: flash ? 0.9 : 0 }}
        transition={APPLE_SPRING}
        className="pointer-events-none absolute inset-0 rounded-full"
        style={{ background: accentColor }}
      />

      {/* Idle label — fades out as the knob slides past. */}
      <motion.span
        aria-hidden
        style={{ opacity: isConfirmed ? 0 : labelOpacity }}
        className="pointer-events-none absolute inset-0 flex items-center justify-center font-display text-[13.5px] font-semibold tracking-tight text-white/70"
      >
        {label}
      </motion.span>

      {/* Confirmed label */}
      {isConfirmed && (
        <motion.span
          initial={{ opacity: 0, y: 2 }}
          animate={{ opacity: 1, y: 0 }}
          transition={SPRING_CONFIRM}
          className="pointer-events-none absolute inset-0 flex items-center justify-center font-display text-[13.5px] font-semibold tracking-tight"
          style={{ color: flash ? '#18181b' : accentColor }}
        >
          <Check className="mr-1.5 h-4 w-4" strokeWidth={2.75} />
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
        whileTap={{ scale: 0.96 }}
        transition={APPLE_SPRING}
        className={cn(
          'relative z-10 flex shrink-0 items-center justify-center rounded-full bg-white',
          !disabled && !isConfirmed && 'cursor-grab active:cursor-grabbing',
          disabled && 'cursor-not-allowed',
        )}
        // Multi-layer Apple knob shadow: inner top highlight, close drop, ambient.
        // eslint-disable-next-line react/forbid-component-props
        // (style merged inline so the dynamic x/width works alongside)
      >
        {/* Shadow layer — applied here so it doesn't fight the inline transform style. */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-full"
          style={{
            boxShadow:
              'inset 0 1px 0 rgba(255,255,255,0.5), 0 4px 12px -2px rgba(0,0,0,0.4), 0 1px 3px rgba(0,0,0,0.5)',
          }}
        />
        <span className="relative flex items-center justify-center text-black/65">
          {isConfirmed ? (
            <Check className="h-4 w-4" strokeWidth={2.75} />
          ) : (
            (idleIcon ?? <ChevronsRight className="h-4 w-4" strokeWidth={2.25} />)
          )}
        </span>
      </motion.div>
    </div>
  )
}
