'use client'

/**
 * <StretchText />
 *
 * Apple-style cursor-proximity stretch. Each letter is its own span;
 * as the cursor moves along the X axis, every letter computes a
 * Gaussian falloff against its own center and animates a horizontal
 * scale + letter-spacing bump. Letters far from the cursor sit at
 * rest; letters under the cursor breathe wider.
 *
 * Why scaleX + letterSpacing instead of `font-variation-settings: wdth`:
 *   The `wdth` axis only exists on variable fonts that ship that axis
 *   (most don't, including Bricolage Grotesque's static cuts). scaleX
 *   + letterSpacing works on any font and feels just as alive.
 *
 * Motion: Apple spring (stiffness 360, damping 28). The springs are
 * created per-character via useSpring, then read each frame via the
 * MotionValue's transform — no setState, no re-render storm.
 */

import * as React from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { cn } from '@/lib/utils'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface StretchTextProps {
  /** The text to stretch. */
  children: string
  /** Falloff radius in px — letters within this distance widen. Default 120. */
  radius?: number
  /** Max scaleX bump at full proximity. Default 1.45. */
  maxScale?: number
  /** Max letterSpacing bump in em at full proximity. Default 0.12. */
  maxSpacing?: number
  /** Optional override for the wrapper class — Bricolage Grotesque by default. */
  className?: string
}

// Apple spring — snappy but cushioned.
const APPLE_SPRING = { stiffness: 360, damping: 28, mass: 0.6 }

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function StretchText({
  children,
  radius = 120,
  maxScale = 1.45,
  maxSpacing = 0.12,
  className,
}: StretchTextProps) {
  const wrapperRef = React.useRef<HTMLSpanElement>(null)
  // Cursor X relative to the wrapper. -1 = inactive (cursor outside).
  const cursorX = useMotionValue<number>(-1)

  const chars = React.useMemo(() => [...children], [children])

  const onPointerMove = (e: React.PointerEvent) => {
    const wrap = wrapperRef.current
    if (!wrap) return
    const r = wrap.getBoundingClientRect()
    cursorX.set(e.clientX - r.left)
  }
  const onPointerLeave = () => cursorX.set(-1)

  return (
    <span
      ref={wrapperRef}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      className={cn(
        'inline-flex select-none font-display',
        className,
      )}
      aria-label={children}
    >
      {chars.map((ch, i) => (
        <Letter
          key={`${i}-${ch}`}
          char={ch}
          index={i}
          total={chars.length}
          cursorX={cursorX}
          radius={radius}
          maxScale={maxScale}
          maxSpacing={maxSpacing}
        />
      ))}
    </span>
  )
}

// ---------------------------------------------------------------------------
// Per-letter — owns its own Gaussian → spring → CSS pipeline.
// ---------------------------------------------------------------------------

interface LetterProps {
  char: string
  index: number
  total: number
  cursorX: ReturnType<typeof useMotionValue<number>>
  radius: number
  maxScale: number
  maxSpacing: number
}

function Letter({
  char,
  cursorX,
  radius,
  maxScale,
  maxSpacing,
}: LetterProps) {
  const ref = React.useRef<HTMLSpanElement>(null)

  // Proximity ∈ [0, 1] — 1 means cursor is exactly on this letter.
  const proximity = useTransform(cursorX, (x) => {
    if (x < 0) return 0
    const el = ref.current
    if (!el) return 0
    // Letter's center, relative to the wrapper.
    const elRect = el.getBoundingClientRect()
    const parent = el.parentElement?.getBoundingClientRect()
    if (!parent) return 0
    const center = elRect.left - parent.left + elRect.width / 2
    const d = Math.abs(x - center)
    if (d >= radius) return 0
    // Gaussian falloff, normalized so d=0 → 1, d=radius → ≈ 0.
    // sigma = radius / 2.5 gives a smooth, full-bodied bell.
    const sigma = radius / 2.5
    return Math.exp(-(d * d) / (2 * sigma * sigma))
  })

  // Spring-smoothed proximity so the visual lag matches Apple's softness.
  const smooth = useSpring(proximity, APPLE_SPRING)

  // Map smoothed proximity → scaleX and letterSpacing.
  const scaleX = useTransform(smooth, (p) => 1 + (maxScale - 1) * p)
  const spacing = useTransform(smooth, (p) => `${p * maxSpacing}em`)

  return (
    <motion.span
      ref={ref}
      aria-hidden
      className="inline-block whitespace-pre"
      style={{
        scaleX,
        letterSpacing: spacing,
        transformOrigin: '50% 50%',
        willChange: 'transform, letter-spacing',
      }}
    >
      {char === ' ' ? ' ' : char}
    </motion.span>
  )
}
