'use client'

/**
 * <MoodSlider />
 *
 * A refined Apple-style slider. The track is a single hue-shifting
 * bar that runs from cool indigo (low) → warm pink (high). The handle
 * is a clean white disc that scales up on hover and again on drag.
 *
 * KEEPS:
 *  - The controlled `value` / `onChange` API
 *  - The per-step snap (snaps to the nearest tick during drag)
 *  - The animated mood word in the footer
 *  - The endpoint hue range so callers can swap palettes
 *
 * REMOVES:
 *  - Morphing SVG smiley face
 *  - <MoodFace /> export
 *  - Tear-drop / sparkle particles
 *  - Multi-layer glows / box-shadows
 */

import * as React from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { cn } from '@/lib/utils'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface MoodSliderProps {
  /** Controlled value 0–1. */
  value?: number
  /** Uncontrolled initial value. Default 0.5. */
  defaultValue?: number
  /** Fired as the value changes. */
  onChange?: (next: number) => void
  /**
   * Optional gradient endpoints — `[low, high]` as CSS color strings.
   * Defaults to a cool-indigo → warm-pink Apple-style sweep.
   */
  trackColors?: [string, string]
  /** Number of snap steps. Default 11 (10 segments). */
  steps?: number
  /** Accessible label. */
  label?: string
  /** Words rendered as the current mood. Index ramps with value. */
  moods?: string[]
  className?: string
}

// ---------------------------------------------------------------------------
// Defaults
// ---------------------------------------------------------------------------

const DEFAULT_MOODS = [
  'rough',
  'low',
  'meh',
  'fine',
  'good',
  'great',
  'glowing',
]

const COOL = '#5E5CE6' // Apple indigo
const WARM = '#FF6FA8' // Apple pink

// Apple-spring for handle scale / interpolation.
const APPLE_SPRING = { type: 'spring' as const, stiffness: 420, damping: 32 }

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function MoodSlider({
  value: controlled,
  defaultValue = 0.5,
  onChange,
  trackColors = [COOL, WARM],
  steps = 11,
  label = 'Mood',
  moods = DEFAULT_MOODS,
  className,
}: MoodSliderProps) {
  const [internal, setInternal] = React.useState(clamp01(defaultValue))
  const isControlled = controlled !== undefined
  const value = isControlled ? clamp01(controlled) : internal

  const trackRef = React.useRef<HTMLDivElement>(null)
  const [hovered, setHovered] = React.useState(false)
  const [dragging, setDragging] = React.useState(false)

  const setValue = (v: number) => {
    // Snap to nearest step for that "haptic" feel.
    const segs = Math.max(2, steps) - 1
    const snapped = Math.round(clamp01(v) * segs) / segs
    if (!isControlled) setInternal(snapped)
    onChange?.(snapped)
  }

  const setFromPointer = (clientX: number) => {
    const track = trackRef.current
    if (!track) return
    const r = track.getBoundingClientRect()
    setValue((clientX - r.left) / r.width)
  }

  React.useEffect(() => {
    if (!dragging) return
    const onMove = (e: PointerEvent) => setFromPointer(e.clientX)
    const onUp = () => setDragging(false)
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
    window.addEventListener('pointercancel', onUp)
    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
      window.removeEventListener('pointercancel', onUp)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dragging])

  const onPointerDown = (e: React.PointerEvent) => {
    setDragging(true)
    setFromPointer(e.clientX)
    ;(e.currentTarget as Element).setPointerCapture?.(e.pointerId)
  }

  // Mood word — discrete buckets across `moods`.
  const moodIdx = Math.min(
    moods.length - 1,
    Math.floor(value * moods.length),
  )
  const moodWord = moods[moodIdx]

  const [low, high] = trackColors
  const trackGradient = `linear-gradient(to right, ${low}, ${high})`

  // Scale: 1.0 idle → 1.1 hover → 1.15 dragging.
  const handleScale = dragging ? 1.15 : hovered ? 1.1 : 1

  return (
    <div
      className={cn(
        'relative w-full max-w-[460px] overflow-hidden rounded-3xl border border-white/[0.08] bg-white/[0.03] px-7 pt-7 pb-7 backdrop-blur-xl',
        className,
      )}
      aria-label={label}
    >
      {/* Header — label + value */}
      <div className="flex items-baseline justify-between">
        <span className="text-[10px] font-medium uppercase tracking-[0.32em] text-white/45">
          {label}
        </span>
        <span className="font-mono text-[11px] tabular-nums text-white/40">
          {Math.round(value * 100)}%
        </span>
      </div>

      {/* Mood word — morphs */}
      <div className="mt-6 flex items-baseline gap-2">
        <span className="text-[10px] font-medium uppercase tracking-[0.32em] text-white/35">
          feeling
        </span>
        <AnimatePresence mode="popLayout">
          <motion.span
            key={moodWord}
            initial={{ opacity: 0, y: 4, filter: 'blur(2px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -4, filter: 'blur(2px)' }}
            transition={{ duration: 0.18 }}
            className="font-display text-2xl font-semibold tracking-tight text-white"
          >
            {moodWord}
          </motion.span>
        </AnimatePresence>
      </div>

      {/* Track */}
      <div className="relative mt-7 pt-5">
        {/* Tick marks above the track */}
        <div className="pointer-events-none absolute inset-x-0 top-0 flex items-end justify-between px-[2px] text-white/15">
          {Array.from({ length: steps }).map((_, i) => (
            <span
              key={i}
              className="block w-px"
              style={{
                height: i % 5 === 0 ? 8 : 4,
                background: 'currentColor',
              }}
            />
          ))}
        </div>

        <div
          ref={trackRef}
          onPointerDown={onPointerDown}
          onPointerEnter={() => setHovered(true)}
          onPointerLeave={() => setHovered(false)}
          role="slider"
          tabIndex={0}
          aria-label={label}
          aria-valuemin={0}
          aria-valuemax={1}
          aria-valuenow={value}
          className="relative h-2 w-full cursor-grab rounded-full outline-none active:cursor-grabbing focus-visible:ring-2 focus-visible:ring-white/30"
          style={{
            background: trackGradient,
            boxShadow:
              'inset 0 0.5px 0 rgba(255,255,255,0.18), inset 0 -0.5px 0 rgba(0,0,0,0.35)',
          }}
          onKeyDown={(e) => {
            const segs = Math.max(2, steps) - 1
            const stepSize = 1 / segs
            if (e.key === 'ArrowLeft') setValue(value - stepSize)
            if (e.key === 'ArrowRight') setValue(value + stepSize)
            if (e.key === 'Home') setValue(0)
            if (e.key === 'End') setValue(1)
          }}
        >
          {/* Handle — clean white disc with Apple spring scale. */}
          <motion.div
            className="pointer-events-none absolute top-1/2 h-[18px] w-[18px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white"
            style={{
              left: `${value * 100}%`,
              boxShadow:
                '0 1px 2px rgba(0,0,0,0.18), 0 4px 12px rgba(0,0,0,0.32)',
            }}
            animate={{ scale: handleScale }}
            transition={APPLE_SPRING}
          />
        </div>

        {/* Endpoint labels */}
        <div className="mt-3 flex justify-between font-mono text-[10px] uppercase tracking-[0.22em] text-white/30">
          <span>worst</span>
          <span>best</span>
        </div>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Utilities
// ---------------------------------------------------------------------------

function clamp01(n: number) {
  return Math.max(0, Math.min(1, n))
}
