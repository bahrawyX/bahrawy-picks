'use client'

/**
 * <MoodSlider />
 *
 * A mood-rater card. A large SVG smiley sits at the top, morphing
 * its expression as the user drags the slider beneath it:
 *  - mouth curvature interpolates frown → smile
 *  - eyes squint at high happiness
 *  - eyebrows tilt down when sad
 *  - cheek blush fades in past the upbeat threshold
 *  - little tear-drops fall under the face when very sad
 *  - sparkles rise above the face when very happy
 *  - the face TILTS slightly in the direction of the mood — a happy
 *    face leans forward + bounces lightly; a sad face droops
 *  - the whole card's background carries a soft hue-tinted gradient
 *    that shifts in step
 *
 * Underneath: a clean track with subtle tick marks, a draggable
 * thumb, and an animated mood word in the footer.
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
  /** Hue range for the gradient (HSL degrees). Default [0, 130] = red → green. */
  hueRange?: [number, number]
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

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function MoodSlider({
  value: controlled,
  defaultValue = 0.5,
  onChange,
  hueRange = [0, 130],
  label = 'Mood',
  moods = DEFAULT_MOODS,
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

  const setFromPointer = (clientX: number) => {
    const track = trackRef.current
    if (!track) return
    const r = track.getBoundingClientRect()
    setValue((clientX - r.left) / r.width)
  }

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
  })

  const onPointerDown = (e: React.PointerEvent) => {
    draggingRef.current = true
    setFromPointer(e.clientX)
    ;(e.currentTarget as Element).setPointerCapture?.(e.pointerId)
  }

  // ---- Derived visuals ------------------------------------------------
  const [hueLow, hueHigh] = hueRange
  const hue = hueLow + (hueHigh - hueLow) * value

  const lerp = (a: number, b: number, t: number) => a + (b - a) * t
  // Mouth curvature: control-point Y goes frown (80) → smile (44).
  const mouthControlY = lerp(80, 44, value)
  // Eye squint past 0.8.
  const eyeSquint = value > 0.8 ? Math.min(1, (value - 0.8) / 0.2) : 0
  const eyeRY = lerp(7, 2.5, eyeSquint)
  // Cheek blush from 0.65 up.
  const blushOpacity = value > 0.65 ? Math.min(1, (value - 0.65) / 0.35) : 0
  // Eyebrows angle inward when sad.
  const browInnerOffset = lerp(-3, 1, value)
  // Face tilt — sad droop, happy lean.
  const faceTilt = lerp(-6, 6, value)

  // Mood word — discrete buckets across `moods`.
  const moodIdx = Math.min(
    moods.length - 1,
    Math.floor(value * moods.length),
  )
  const moodWord = moods[moodIdx]

  // Background hue gradient — soft, no glow.
  const cardBackground = `
    radial-gradient(120% 90% at 50% 0%, hsla(${hue}, 70%, 55%, 0.18) 0%, transparent 60%),
    linear-gradient(180deg, rgba(255,255,255,0.02), rgba(0,0,0,0.4))
  `

  // Track gradient — same hue range.
  const trackGradient = `linear-gradient(to right,
    hsl(${hueLow}, 75%, 55%),
    hsl(${(hueLow + hueHigh) / 2}, 80%, 55%),
    hsl(${hueHigh}, 75%, 55%)
  )`

  return (
    <div
      className={cn(
        'relative w-full max-w-[460px] overflow-hidden rounded-3xl border border-white/10 px-7 pt-8 pb-7 shadow-2xl shadow-black/40 backdrop-blur',
        className,
      )}
      style={{ background: cardBackground }}
      aria-label={label}
    >
      {/* Face + ambient particles */}
      <div className="relative mx-auto flex h-[140px] w-[140px] items-center justify-center">
        {/* Sparkles (happy) */}
        <AnimatePresence>
          {value > 0.82 && (
            <SparklesAbove
              key="sparkles"
              count={5}
              hue={hue}
              intensity={Math.min(1, (value - 0.82) / 0.18)}
            />
          )}
        </AnimatePresence>

        {/* Tear drops (sad) */}
        <AnimatePresence>
          {value < 0.18 && (
            <TearsBelow
              key="tears"
              count={3}
              intensity={Math.min(1, (0.18 - value) / 0.18)}
            />
          )}
        </AnimatePresence>

        {/* The face — subtle breathing + tilt with mood */}
        <motion.div
          className="relative h-full w-full"
          animate={{
            rotate: faceTilt,
            scale: [1, 1.015, 1],
          }}
          transition={{
            rotate: { type: 'spring', stiffness: 120, damping: 14 },
            scale: { duration: 3.4, repeat: Infinity, ease: 'easeInOut' },
          }}
        >
          <FaceSvg
            hue={hue}
            mouthControlY={mouthControlY}
            eyeRY={eyeRY}
            blushOpacity={blushOpacity}
            browInnerOffset={browInnerOffset}
          />
        </motion.div>
      </div>

      {/* Mood word — morphs */}
      <div className="mt-6 flex items-baseline justify-center gap-2">
        <span className="text-[10px] font-medium uppercase tracking-[0.32em] text-white/45">
          feeling
        </span>
        <AnimatePresence mode="popLayout">
          <motion.span
            key={moodWord}
            initial={{ opacity: 0, y: 6, filter: 'blur(2px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -6, filter: 'blur(2px)' }}
            transition={{ duration: 0.18 }}
            className="text-base font-semibold tracking-tight"
            style={{ color: `hsl(${hue}, 80%, 72%)` }}
          >
            {moodWord}
          </motion.span>
        </AnimatePresence>
        <span className="font-mono text-xs tabular-nums text-white/35">
          · {Math.round(value * 100)}%
        </span>
      </div>

      {/* Track + tick marks */}
      <div className="relative mt-5 pt-4">
        {/* Tick marks above the track */}
        <div className="pointer-events-none absolute inset-x-0 top-0 flex items-end justify-between px-[2px] text-white/20">
          {Array.from({ length: 11 }).map((_, i) => (
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
          role="slider"
          tabIndex={0}
          aria-label={label}
          aria-valuemin={0}
          aria-valuemax={1}
          aria-valuenow={value}
          className="relative h-3 w-full cursor-grab rounded-full outline-none active:cursor-grabbing focus-visible:ring-2 focus-visible:ring-white/30"
          style={{
            background: trackGradient,
            boxShadow:
              'inset 0 1px 0 rgba(255,255,255,0.2), inset 0 -1px 0 rgba(0,0,0,0.4)',
          }}
          onKeyDown={(e) => {
            if (e.key === 'ArrowLeft') setValue(value - 0.05)
            if (e.key === 'ArrowRight') setValue(value + 0.05)
            if (e.key === 'Home') setValue(0)
            if (e.key === 'End') setValue(1)
          }}
        >
          {/* Thumb */}
          <div
            className="pointer-events-none absolute top-1/2 h-7 w-7 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-zinc-900 shadow-lg shadow-black/40"
            style={{ left: `${value * 100}%` }}
          >
            <div
              className="absolute inset-[6px] rounded-full"
              style={{ background: `hsl(${hue}, 80%, 60%)` }}
            />
          </div>
        </div>

        {/* Endpoint labels */}
        <div className="mt-2 flex justify-between font-mono text-[10px] uppercase tracking-[0.22em] text-white/35">
          <span>worst</span>
          <span>best</span>
        </div>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Face SVG
// ---------------------------------------------------------------------------

function FaceSvg({
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
  const id = React.useId().replace(/:/g, '')
  return (
    <svg
      viewBox="0 0 100 100"
      className="h-full w-full drop-shadow-[0_10px_22px_rgba(0,0,0,0.4)]"
      aria-hidden
    >
      <defs>
        <radialGradient id={`bahrawy-mood-face-${id}`} cx="35%" cy="30%" r="80%">
          <stop offset="0%" stopColor={`hsl(${hue}, 90%, 78%)`} />
          <stop offset="60%" stopColor={`hsl(${hue}, 80%, 60%)`} />
          <stop offset="100%" stopColor={`hsl(${hue}, 70%, 42%)`} />
        </radialGradient>
      </defs>

      {/* Face */}
      <circle
        cx="50"
        cy="50"
        r="46"
        fill={`url(#bahrawy-mood-face-${id})`}
        stroke="rgba(0,0,0,0.18)"
        strokeWidth="1"
      />

      {/* Cheeks */}
      <circle
        cx="28"
        cy="58"
        r="6"
        fill={`hsl(${hue}, 95%, 70%)`}
        opacity={blushOpacity * 0.8}
      />
      <circle
        cx="72"
        cy="58"
        r="6"
        fill={`hsl(${hue}, 95%, 70%)`}
        opacity={blushOpacity * 0.8}
      />

      {/* Eyebrows */}
      <line
        x1="29"
        y1={32 + browInnerOffset}
        x2="42"
        y2="34"
        stroke="rgba(0,0,0,0.75)"
        strokeWidth="2.6"
        strokeLinecap="round"
      />
      <line
        x1="58"
        y1="34"
        x2="71"
        y2={32 + browInnerOffset}
        stroke="rgba(0,0,0,0.75)"
        strokeWidth="2.6"
        strokeLinecap="round"
      />

      {/* Eyes — round when not squinting, ellipse when happy */}
      <ellipse cx="36" cy="46" rx="4" ry={eyeRY} fill="rgba(0,0,0,0.88)" />
      <ellipse cx="64" cy="46" rx="4" ry={eyeRY} fill="rgba(0,0,0,0.88)" />

      {/* Mouth */}
      <path
        d={`M 28 62 Q 50 ${mouthControlY} 72 62`}
        fill="none"
        stroke="rgba(0,0,0,0.88)"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  )
}

// ---------------------------------------------------------------------------
// Particles
// ---------------------------------------------------------------------------

function SparklesAbove({
  count,
  hue,
  intensity,
}: {
  count: number
  hue: number
  intensity: number
}) {
  const items = React.useMemo(
    () =>
      Array.from({ length: count }).map((_, i) => ({
        // even-ish angular spread, biased upward
        x: (i / (count - 1)) * 110 - 55, // -55..55 px from centre
        delay: i * 0.18,
        scale: 0.6 + ((i * 137) % 60) / 100, // pseudo-random 0.6–1.2
      })),
    [count],
  )
  return (
    <>
      {items.map((s, i) => (
        <motion.span
          key={i}
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-1/2"
          style={{
            opacity: intensity,
          }}
          initial={{ x: s.x, y: -10, opacity: 0, scale: 0.4 }}
          animate={{
            x: s.x,
            y: -60,
            opacity: [0, intensity, 0],
            scale: [0.4, s.scale, 0.2],
          }}
          exit={{ opacity: 0 }}
          transition={{
            duration: 1.6,
            delay: s.delay,
            ease: 'easeOut',
            repeat: Infinity,
            repeatDelay: 0.4,
          }}
        >
          <SparkleSvg color={`hsl(${hue}, 90%, 72%)`} />
        </motion.span>
      ))}
    </>
  )
}

function SparkleSvg({ color }: { color: string }) {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" aria-hidden>
      <path
        d="M8 0 L9.2 6.8 L16 8 L9.2 9.2 L8 16 L6.8 9.2 L0 8 L6.8 6.8 Z"
        fill={color}
        opacity="0.95"
      />
    </svg>
  )
}

function TearsBelow({
  count,
  intensity,
}: {
  count: number
  intensity: number
}) {
  const items = React.useMemo(
    () =>
      Array.from({ length: count }).map((_, i) => ({
        x: (i / (count - 1)) * 60 - 30,
        delay: i * 0.4,
      })),
    [count],
  )
  return (
    <>
      {items.map((s, i) => (
        <motion.span
          key={i}
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-1/2"
          style={{ opacity: intensity }}
          initial={{ x: s.x, y: 20, opacity: 0, scale: 0.6 }}
          animate={{
            x: s.x,
            y: 90,
            opacity: [0, intensity, 0],
            scale: [0.6, 1, 0.6],
          }}
          exit={{ opacity: 0 }}
          transition={{
            duration: 1.8,
            delay: s.delay,
            ease: 'easeIn',
            repeat: Infinity,
            repeatDelay: 0.6,
          }}
        >
          <TearSvg />
        </motion.span>
      ))}
    </>
  )
}

function TearSvg() {
  return (
    <svg width="10" height="14" viewBox="0 0 10 14" aria-hidden>
      <path
        d="M5 0 C 7 4, 10 7, 10 10 C 10 12.5, 8 14, 5 14 C 2 14, 0 12.5, 0 10 C 0 7, 3 4, 5 0 Z"
        fill="#7dd3fc"
        opacity="0.85"
      />
    </svg>
  )
}

function clamp01(n: number) {
  return Math.max(0, Math.min(1, n))
}
