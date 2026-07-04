'use client'

/**
 * <TextScramble />
 *
 * Hacker terminal effect -- characters scramble through random chars
 * before resolving to the final text.
 *
 * @param text        -- The target string.
 * @param trigger     -- When to start: 'hover' | 'inView' | 'mount' | 'manual'. Default 'mount'.
 * @param isPlaying   -- External control for 'manual' trigger.
 * @param duration    -- Total resolve time in seconds. Default 1.5.
 * @param speed       -- Scramble cycles per second. Default 20.
 * @param charset     -- Preset name or custom string of characters. Default 'alphanumeric'.
 * @param stagger     -- Resolve characters left-to-right. Default true.
 * @param onComplete  -- Called once all characters have resolved.
 * @param className   -- Classes for the outer span.
 */

import * as React from 'react'
import { useInView } from 'framer-motion'
import { cn } from '@/lib/utils'
import { usePrefersReducedMotion } from '@/lib/use-prefers-reduced-motion'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type ScrambleTrigger = 'hover' | 'inView' | 'mount' | 'manual'

export type CharsetPreset =
  | 'alphanumeric'
  | 'symbols'
  | 'binary'
  | 'hex'
  | 'matrix'

export interface TextScrambleProps {
  text: string
  /** When to start the scramble animation. */
  trigger?: ScrambleTrigger
  /** External play control (used with trigger='manual'). */
  isPlaying?: boolean
  /** Total resolve time in seconds. */
  duration?: number
  /** Scramble cycles per second. */
  speed?: number
  /** Preset name or custom charset string. */
  charset?: CharsetPreset | string
  /** Resolve characters left-to-right. */
  stagger?: boolean
  /** Called when all characters have resolved. */
  onComplete?: () => void
  /** Classes for the outer wrapper. */
  className?: string
}

// ---------------------------------------------------------------------------
// Charset presets
// ---------------------------------------------------------------------------

const CHARSETS: Record<CharsetPreset, string> = {
  alphanumeric:
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
  symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?',
  binary: '01',
  hex: '0123456789ABCDEF',
  matrix:
    'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン',
}

function resolveCharset(input: CharsetPreset | string): string {
  if (input in CHARSETS) return CHARSETS[input as CharsetPreset]
  return input
}

function randomChar(chars: string): string {
  return chars[Math.floor(Math.random() * chars.length)]
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function TextScramble({
  text,
  trigger = 'mount',
  isPlaying = false,
  duration = 1.5,
  speed = 20,
  charset = 'alphanumeric',
  stagger = true,
  onComplete,
  className,
}: TextScrambleProps) {
  const chars = resolveCharset(charset)
  const ref = React.useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true })
  const reduced = usePrefersReducedMotion()

  const [displayedText, setDisplayedText] = React.useState<string[]>(() =>
    text.split(''),
  )
  const [active, setActive] = React.useState(false)
  const hasCompletedRef = React.useRef(false)

  // ---- Determine when to activate ----
  const startScramble = React.useCallback(() => {
    hasCompletedRef.current = false
    setActive(true)
  }, [])

  // Mount trigger
  React.useEffect(() => {
    if (trigger === 'mount') startScramble()
  }, [trigger, startScramble])

  // inView trigger
  React.useEffect(() => {
    if (trigger === 'inView' && isInView) startScramble()
  }, [trigger, isInView, startScramble])

  // Manual trigger
  React.useEffect(() => {
    if (trigger === 'manual' && isPlaying) startScramble()
  }, [trigger, isPlaying, startScramble])

  // ---- Animation loop ----
  React.useEffect(() => {
    // Reduced motion: skip scrambling entirely — show the final text and
    // never start the RAF loop.
    if (reduced) {
      if (active) {
        setActive(false)
        setDisplayedText(text.split(''))
        if (!hasCompletedRef.current) {
          hasCompletedRef.current = true
          onComplete?.()
        }
      }
      return
    }
    if (!active) return

    const textChars = text.split('')
    const intervalMs = 1000 / speed
    let startTime: number | null = null
    let lastScramble = -Infinity
    let rafId: number

    // Start fully scrambled
    let current = textChars.map((c) => (c === ' ' ? ' ' : randomChar(chars)))
    setDisplayedText(current)

    // Single RAF loop: resolution progress is checked every frame, but
    // unresolved characters only re-scramble every `intervalMs` so the
    // flicker rate actually follows the `speed` prop.
    function loop(timestamp: number) {
      if (startTime === null) startTime = timestamp
      const elapsed = (timestamp - startTime) / 1000
      const rescramble = timestamp - lastScramble >= intervalMs
      if (rescramble) lastScramble = timestamp

      const next: string[] = []
      let allResolved = true
      let changed = false

      for (let i = 0; i < textChars.length; i++) {
        const target = textChars[i]

        // Spaces always resolve immediately
        if (target === ' ') {
          next.push(' ')
          continue
        }

        const resolveAt = stagger
          ? (i / textChars.length) * duration
          : duration

        if (elapsed >= resolveAt) {
          next.push(target)
          if (current[i] !== target) changed = true
        } else {
          allResolved = false
          if (rescramble) {
            next.push(randomChar(chars))
            changed = true
          } else {
            next.push(current[i])
          }
        }
      }

      current = next
      if (changed) setDisplayedText(next)

      if (allResolved) {
        setActive(false)
        if (!hasCompletedRef.current) {
          hasCompletedRef.current = true
          onComplete?.()
        }
        return
      }

      rafId = requestAnimationFrame(loop)
    }

    rafId = requestAnimationFrame(loop)

    return () => cancelAnimationFrame(rafId)
  }, [reduced, active, text, duration, speed, chars, stagger, onComplete])

  // ---- Hover handlers ----
  const handleMouseEnter = React.useCallback(() => {
    if (trigger === 'hover') startScramble()
  }, [trigger, startScramble])

  const handleMouseLeave = React.useCallback(() => {
    if (trigger === 'hover') {
      setActive(false)
      setDisplayedText(text.split(''))
    }
  }, [trigger, text])

  return (
    <span
      ref={ref}
      className={cn(className)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {displayedText.map((char, i) => (
        <span
          key={i}
          style={{ display: 'inline-block', minWidth: char === ' ' ? '0.25em' : undefined }}
        >
          {char === ' ' ? ' ' : char}
        </span>
      ))}
    </span>
  )
}
