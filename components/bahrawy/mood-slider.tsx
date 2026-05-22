'use client'

/**
 * <MoodSlider />
 *
 * A slider whose handle is an SVG emoji face. Drag the handle from
 * left to right; the face morphs through expressions (sad → neutral
 * → happy) and the track gradient shifts through the matching hue
 * range (cool red → amber → green). Pure SVG, no images.
 *
 * The mouth + eyes are simple `<path>` and `<circle>` elements
 * whose attributes interpolate linearly from a value (0–1):
 *  - mouth curvature: -1 (frowning) → +1 (smiling)
 *  - eye height: closes a touch when very happy (≥ 0.8)
 *  - cheek "blush": fades in over 0.7+
 *
 * Controlled or uncontrolled. Returns 0–1.
 */

import * as React from 'react'
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
  /** Track width in px. Default 320. */
  width?: number
  /** Track height in px. Default 24. */
  height?: number
  /** Handle diameter in px. Default 56. */
  handleSize?: number
  /** Hue range for the track gradient (HSL degrees). Default [0, 130]. */
  hueRange?: [number, number]
  /** Accessible label. */
  label?: string
  className?: string
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function MoodSlider({
  value: controlled,
  defaultValue = 0.5,
  onChange,
  width = 320,
  height = 24,
  handleSize = 56,
  hueRange = [0, 130],
  label = 'Mood',
  className,
}: MoodSliderProps) {
  const [internal, setInternal] = React.useState(clamp01(defaultValue))
  const isControlled = controlled !== undefined
  const value = isControlled ? clamp01(controlled) : internal
  const trackRef = React.useRef<HTMLDivElement>(null)
  const draggingRef = React.useRef(false)

  const setValue = (v: number) => {
    const c = clamp01(v)
    if (!isControlled) setInternal(c)
    onChange?.(c)
  }

  // Convert pointer position → value
  const setFromPointer = (clientX: number) => {
    const track = trackRef.current
    if (!track) return
    const r = track.getBoundingClientRect()
    setValue((clientX - r.left) / r.width)
  }

  // Pointer handlers — drag + click-anywhere-to-set
  React.useEffect(() => {
    const onMove = (e: PointerEvent) => {
      if (!draggingRef.current) return
      setFromPointer(e.clientX)
    }
    const onUp = () => {
      draggingRef.current = false
    }
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
    window.addEventListener('pointercancel', onUp)
    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
      window.removeEventListener('pointercancel', onUp)
    }
    // setValue captured via closure — ok to recreate per render.
  })

  const onPointerDown = (e: React.PointerEvent) => {
    draggingRef.current = true
    setFromPointer(e.clientX)
    ;(e.currentTarget as Element).setPointerCapture?.(e.pointerId)
  }

  // Track gradient — HSL interpolation across the slider.
  const [hueLow, hueHigh] = hueRange
  const trackGradient = `linear-gradient(to right,
    hsl(${hueLow}, 75%, 55%),
    hsl(${(hueLow + hueHigh) / 2}, 80%, 55%),
    hsl(${hueHigh}, 75%, 55%)
  )`

  // Current handle hue — the colour the face wears.
  const handleHue = hueLow + (hueHigh - hueLow) * value

  // Convenience: lerp utilities
  const lerp = (a: number, b: number, t: number) => a + (b - a) * t

  // Mouth: a quadratic Bézier with one control point. As value goes
  // 0 → 1, the control's Y moves from BELOW the line (frown) to
  // ABOVE the line (smile). We work in a 100×100 viewBox.
  // Endpoint X: 28, 72. Y constant: 62 (slightly below centre).
  // Control X: 50 (mid). Control Y: 80 (frown) → 44 (smile).
  const mouthControlY = lerp(80, 44, value)

  // Eyes: round dots. At very happy (value > 0.8) the eyes "close"
  // slightly into squints (flattened circles).
  const eyeSquint = value > 0.8 ? Math.min(1, (value - 0.8) / 0.2) : 0
  const eyeRY = lerp(7, 2.5, eyeSquint)

  // Cheek "blush" — only when smiling.
  const blushOpacity = value > 0.65 ? Math.min(1, (value - 0.65) / 0.35) : 0

  // Eyebrow tilt — angry/sad to relaxed. At value 0 the inner
  // brows tilt DOWN; at 1 they're flat or slightly raised.
  const browInnerOffset = lerp(-3, 1, value)

  return (
    <div
      className={cn('relative select-none touch-none', className)}
      style={{ width }}
    >
      {/* The track */}
      <div
        ref={trackRef}
        onPointerDown={onPointerDown}
        role="slider"
        tabIndex={0}
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={1}
        aria-valuenow={value}
        className="relative w-full cursor-grab rounded-full outline-none active:cursor-grabbing focus-visible:ring-2 focus-visible:ring-white/30 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
        style={{
          height,
          background: trackGradient,
          boxShadow:
            'inset 0 1px 0 rgba(255,255,255,0.18), inset 0 -1px 0 rgba(0,0,0,0.4)',
        }}
        onKeyDown={(e) => {
          if (e.key === 'ArrowLeft') setValue(value - 0.05)
          if (e.key === 'ArrowRight') setValue(value + 0.05)
        }}
      />

      {/* Handle — sits ON the track, centred at the value position */}
      <div
        className="pointer-events-none absolute top-1/2"
        style={{
          left: `${value * 100}%`,
          transform: `translate(-50%, -50%)`,
          width: handleSize,
          height: handleSize,
        }}
      >
        <FaceHandle
          hue={handleHue}
          mouthControlY={mouthControlY}
          eyeRY={eyeRY}
          blushOpacity={blushOpacity}
          browInnerOffset={browInnerOffset}
        />
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// FaceHandle — the SVG smiley itself
// ---------------------------------------------------------------------------

function FaceHandle({
  hue,
  mouthControlY,
  eyeRY,
  blushOpacity,
  browInnerOffset,
}: {
  hue: number
  mouthControlY: number
  eyeRY: number
  blushOpacity: number
  browInnerOffset: number
}) {
  return (
    <svg
      viewBox="0 0 100 100"
      className="h-full w-full drop-shadow-[0_8px_18px_rgba(0,0,0,0.45)]"
      aria-hidden
    >
      <defs>
        <radialGradient id="bahrawy-mood-face" cx="35%" cy="30%" r="80%">
          <stop offset="0%" stopColor={`hsl(${hue}, 85%, 72%)`} />
          <stop offset="100%" stopColor={`hsl(${hue}, 75%, 50%)`} />
        </radialGradient>
      </defs>

      {/* Face */}
      <circle
        cx="50"
        cy="50"
        r="46"
        fill="url(#bahrawy-mood-face)"
        stroke="rgba(0,0,0,0.18)"
        strokeWidth="1"
      />

      {/* Cheeks — only visible at higher happiness */}
      <circle cx="28" cy="58" r="6" fill={`hsl(${hue}, 90%, 65%)`} opacity={blushOpacity * 0.7} />
      <circle cx="72" cy="58" r="6" fill={`hsl(${hue}, 90%, 65%)`} opacity={blushOpacity * 0.7} />

      {/* Eyebrows — tiny rotated lines that tilt inward when sad */}
      <line
        x1="29"
        y1={32 + browInnerOffset}
        x2="42"
        y2="34"
        stroke="rgba(0,0,0,0.7)"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <line
        x1="58"
        y1="34"
        x2="71"
        y2={32 + browInnerOffset}
        stroke="rgba(0,0,0,0.7)"
        strokeWidth="2.5"
        strokeLinecap="round"
      />

      {/* Eyes — slightly squinted at high happiness */}
      <ellipse cx="36" cy="46" rx="4" ry={eyeRY} fill="rgba(0,0,0,0.85)" />
      <ellipse cx="64" cy="46" rx="4" ry={eyeRY} fill="rgba(0,0,0,0.85)" />

      {/* Mouth — a quadratic Bezier whose control point Y morphs */}
      <path
        d={`M 28 62 Q 50 ${mouthControlY} 72 62`}
        fill="none"
        stroke="rgba(0,0,0,0.85)"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  )
}

function clamp01(n: number) {
  return Math.max(0, Math.min(1, n))
}
