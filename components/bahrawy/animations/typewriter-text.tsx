'use client'

/**
 * <TypewriterText />
 *
 * Classic typewriter effect with typing, deleting, looping, and a
 * blinking cursor. Cycles through an array of strings.
 *
 * @param strings        - Array of strings to type through.
 * @param speed          - Milliseconds per character when typing. Default 80.
 * @param deleteSpeed    - Milliseconds per character when deleting. Default 40.
 * @param pauseDuration  - Milliseconds to pause after typing a string. Default 1500.
 * @param loop           - Whether to loop through strings. Default true.
 * @param cursor         - Whether to show a cursor. Default true.
 * @param cursorChar     - Character used for the cursor. Default "|".
 * @param cursorClassName - Additional classes for the cursor element.
 * @param onStringComplete - Callback fired when a string finishes typing.
 * @param className       - Additional classes.
 */

import * as React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface TypewriterTextProps {
  /** Array of strings to type through. */
  strings: string[]
  /** Milliseconds per character when typing. */
  speed?: number
  /** Milliseconds per character when deleting. */
  deleteSpeed?: number
  /** Milliseconds to pause after typing a string. */
  pauseDuration?: number
  /** Whether to loop through strings. */
  loop?: boolean
  /** Whether to show a cursor. */
  cursor?: boolean
  /** Character used for the cursor. */
  cursorChar?: string
  /** Additional classes for the cursor element. */
  cursorClassName?: string
  /** Callback fired when a string finishes typing. */
  onStringComplete?: (index: number) => void
  /** Additional classes. */
  className?: string
}

// ---------------------------------------------------------------------------
// Phase state machine
// ---------------------------------------------------------------------------

type Phase = 'typing' | 'paused' | 'deleting' | 'done'

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function TypewriterText({
  strings,
  speed = 80,
  deleteSpeed = 40,
  pauseDuration = 1500,
  loop = true,
  cursor = true,
  cursorChar = '|',
  cursorClassName,
  onStringComplete,
  className,
}: TypewriterTextProps) {
  const [displayedText, setDisplayedText] = React.useState('')
  const [stringIndex, setStringIndex] = React.useState(0)
  const [charIndex, setCharIndex] = React.useState(0)
  const [phase, setPhase] = React.useState<Phase>('typing')

  // Stable ref for the callback so it doesn't reset the effect
  const onCompleteRef = React.useRef(onStringComplete)
  React.useEffect(() => {
    onCompleteRef.current = onStringComplete
  }, [onStringComplete])

  // Main typing loop
  React.useEffect(() => {
    if (phase === 'done') return

    const currentString = strings[stringIndex] ?? ''

    let timeout: ReturnType<typeof setTimeout>

    switch (phase) {
      case 'typing': {
        if (charIndex < currentString.length) {
          // Add slight random variation: speed +/- 20ms
          const variation = Math.floor(Math.random() * 40) - 20
          const delay = Math.max(10, speed + variation)

          timeout = setTimeout(() => {
            setDisplayedText(currentString.slice(0, charIndex + 1))
            setCharIndex((prev) => prev + 1)
          }, delay)
        } else {
          // String complete
          onCompleteRef.current?.(stringIndex)

          const isLastString = stringIndex === strings.length - 1

          if (!loop && isLastString) {
            setPhase('done')
          } else {
            setPhase('paused')
          }
        }
        break
      }

      case 'paused': {
        timeout = setTimeout(() => {
          setPhase('deleting')
        }, pauseDuration)
        break
      }

      case 'deleting': {
        if (charIndex > 0) {
          timeout = setTimeout(() => {
            setCharIndex((prev) => prev - 1)
            setDisplayedText(currentString.slice(0, charIndex - 1))
          }, deleteSpeed)
        } else {
          // Move to the next string
          const nextIndex = (stringIndex + 1) % strings.length
          setStringIndex(nextIndex)
          setCharIndex(0)
          setDisplayedText('')
          setPhase('typing')
        }
        break
      }
    }

    return () => {
      if (timeout) clearTimeout(timeout)
    }
  }, [phase, charIndex, stringIndex, strings, speed, deleteSpeed, pauseDuration, loop])

  const showBlinkingCursor = phase === 'paused' || phase === 'done'

  return (
    <span className={cn(className)}>
      {displayedText}
      {cursor && (
        <>
          {showBlinkingCursor ? (
            <motion.span
              animate={{ opacity: [1, 0, 1] }}
              transition={{
                duration: 0.8,
                repeat: Infinity,
                times: [0, 0.5, 1],
                ease: 'linear',
              }}
              className={cn(cursorClassName)}
              aria-hidden="true"
            >
              {cursorChar}
            </motion.span>
          ) : (
            <span className={cn(cursorClassName)} aria-hidden="true">
              {cursorChar}
            </span>
          )}
        </>
      )}
    </span>
  )
}
