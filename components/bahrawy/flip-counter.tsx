'use client'

/**
 * <FlipCounter />
 *
 * A mechanical split-flap (Solari-board) display. Each digit is a
 * physical card split horizontally across the middle — the TOP half
 * shows the current digit's upper portion, the BOTTOM half shows
 * the same digit's lower portion. When the value changes, the top
 * half flips DOWN and away (rotates -180° around the centre seam)
 * while a fresh top half with the NEW digit fades in beneath it.
 * Looks like the boards in old airports.
 *
 * Pass a `value` (number or string) and the counter animates from
 * the previous value with a per-digit cascade — earlier digits flip
 * first, later ones a tick behind, so multi-digit changes read as
 * a wave across the display.
 *
 * Controlled. `padStart` pads numeric values to a minimum length so
 * 0–9 still render as `0008` with `pad=4`.
 */

import * as React from 'react'
import { cn } from '@/lib/utils'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface FlipCounterProps {
  /** Current value. Numbers are padded by `pad`; strings render as-is. */
  value: number | string
  /** Pad-start length for numeric values. Default 0 (no pad). */
  pad?: number
  /** Card width in px. Default 56. */
  cellWidth?: number
  /** Card height in px. Default 80. */
  cellHeight?: number
  /** Card colour. Default a dark "departure board" navy. */
  cardColor?: string
  /** Glyph colour. Default warm white. */
  glyphColor?: string
  /** Delay between digit flips in ms — gives the wave effect. Default 60. */
  cascade?: number
  /** Duration of each single flip in ms. Default 600. */
  duration?: number
  className?: string
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function FlipCounter({
  value,
  pad = 0,
  cellWidth = 56,
  cellHeight = 80,
  cardColor = '#0e1320',
  glyphColor = '#f3f3e6',
  cascade = 60,
  duration = 600,
  className,
}: FlipCounterProps) {
  const str = React.useMemo(() => {
    const s = String(value)
    if (typeof value === 'number' && pad > 0) return s.padStart(pad, '0')
    return s
  }, [value, pad])

  return (
    <div
      className={cn('inline-flex items-stretch gap-1 select-none', className)}
    >
      {[...str].map((ch, i) => (
        <FlipDigit
          key={i}
          char={ch}
          cascadeDelay={i * cascade}
          width={cellWidth}
          height={cellHeight}
          cardColor={cardColor}
          glyphColor={glyphColor}
          duration={duration}
        />
      ))}
    </div>
  )
}

// ---------------------------------------------------------------------------
// FlipDigit — one mechanical character.
// ---------------------------------------------------------------------------

function FlipDigit({
  char,
  cascadeDelay,
  width,
  height,
  cardColor,
  glyphColor,
  duration,
}: {
  char: string
  cascadeDelay: number
  width: number
  height: number
  cardColor: string
  glyphColor: string
  duration: number
}) {
  // We render TWO stacked halves at any time:
  //  - `currentChar`   — what's CURRENTLY displayed.
  //  - `nextChar`      — what we're FLIPPING to.
  // When `char` (prop) changes, we kick off a flip and at the end
  // promote `nextChar` → `currentChar`.
  const [currentChar, setCurrentChar] = React.useState(char)
  const [nextChar, setNextChar] = React.useState<string | null>(null)
  const [flipping, setFlipping] = React.useState(false)
  const id = React.useId().replace(/:/g, '')

  React.useEffect(() => {
    if (char === currentChar || flipping) return
    setNextChar(char)
    // Wait the cascade then start the flip.
    const start = window.setTimeout(() => {
      setFlipping(true)
    }, cascadeDelay)
    return () => window.clearTimeout(start)
  }, [char, currentChar, flipping, cascadeDelay])

  // When the flip finishes, swap the values and reset the flipping flag.
  const onAnimationEnd = () => {
    if (!flipping || nextChar === null) return
    setCurrentChar(nextChar)
    setNextChar(null)
    setFlipping(false)
  }

  return (
    <div
      className="relative"
      style={{
        width,
        height,
        perspective: '700px',
        background: cardColor,
        borderRadius: 6,
        boxShadow:
          '0 10px 22px -6px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.06)',
      }}
    >
      {/* Glyph half — TOP STATIC (the upper half of currentChar) */}
      <Half
        char={currentChar}
        half="top"
        width={width}
        height={height}
        cardColor={cardColor}
        glyphColor={glyphColor}
      />

      {/* Glyph half — BOTTOM STATIC (the lower half of currentChar) */}
      <Half
        char={currentChar}
        half="bottom"
        width={width}
        height={height}
        cardColor={cardColor}
        glyphColor={glyphColor}
      />

      {/* NEXT char's top half — hidden BENEATH the flipping flap.
          As the flap rotates -90→-180, this is what gets revealed. */}
      {nextChar !== null && (
        <Half
          char={nextChar}
          half="top"
          width={width}
          height={height}
          cardColor={cardColor}
          glyphColor={glyphColor}
          // Sit BEHIND the flipping flap (which is z-30).
          z={10}
        />
      )}

      {/* NEXT char's bottom half — gets shown only AFTER the flap
          completes and we promote next → current via state. */}

      {/* The flipping flap — animates rotateX 0 → -180. It IS the top
          half of currentChar that "falls down". */}
      {flipping && nextChar !== null && (
        <div
          aria-hidden
          className={`bahrawy-flip-${id} absolute left-0 top-0 z-30`}
          style={{
            width,
            height: height / 2,
            transformOrigin: '50% 100%',
            transformStyle: 'preserve-3d',
            willChange: 'transform',
          }}
          onAnimationEnd={onAnimationEnd}
        >
          {/* Front of the flap — the OLD top half */}
          <Half
            char={currentChar}
            half="top"
            width={width}
            height={height}
            cardColor={cardColor}
            glyphColor={glyphColor}
            inFlap
          />
          {/* Back of the flap — the NEW bottom half, rotated 180 so it
              appears RIGHT-WAY-UP when the flap lands at -180°. */}
          <div
            className="absolute inset-0"
            style={{
              transform: 'rotateX(180deg)',
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
            }}
          >
            <Half
              char={nextChar}
              half="bottom"
              width={width}
              height={height}
              cardColor={cardColor}
              glyphColor={glyphColor}
              inFlap
            />
          </div>

          <style>{`
            .bahrawy-flip-${id} {
              animation: bahrawy-flip-${id}-kf ${duration}ms cubic-bezier(0.55, 0.05, 0.5, 1) forwards;
            }
            @keyframes bahrawy-flip-${id}-kf {
              from { transform: rotateX(0deg); }
              to   { transform: rotateX(-180deg); }
            }
          `}</style>
        </div>
      )}

      {/* The horizontal seam — thin shadow line across the centre */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-1/2 z-40 h-px"
        style={{
          background:
            'linear-gradient(to right, transparent, rgba(0,0,0,0.55) 20%, rgba(0,0,0,0.55) 80%, transparent)',
        }}
      />
    </div>
  )
}

// ---------------------------------------------------------------------------
// Half — renders either the top or bottom half of a character.
// We render the full character but clip to the relevant half.
// ---------------------------------------------------------------------------

function Half({
  char,
  half,
  width,
  height,
  cardColor,
  glyphColor,
  z = 0,
  inFlap = false,
}: {
  char: string
  half: 'top' | 'bottom'
  width: number
  height: number
  cardColor: string
  glyphColor: string
  z?: number
  inFlap?: boolean
}) {
  // If we're rendering inside the rotating flap, the flap is HALF the
  // total height already — so we shouldn't add the top/bottom 50%
  // positioning, only the glyph offset.
  return (
    <div
      className="absolute left-0 overflow-hidden"
      style={{
        width,
        height: inFlap ? height / 2 : height / 2,
        top: inFlap ? 0 : half === 'top' ? 0 : '50%',
        background: cardColor,
        borderRadius:
          half === 'top'
            ? '6px 6px 0 0'
            : '0 0 6px 6px',
        zIndex: z,
      }}
    >
      <span
        className="absolute left-1/2 font-mono font-semibold leading-none tabular-nums"
        style={{
          // Glyph anchored so that when half='top' we see its top half,
          // and half='bottom' we see its bottom half.
          top: half === 'top' ? '50%' : 'calc(50% - 100%)',
          // We "draw" the glyph at the FULL card height so when it's
          // clipped to a half, we get a real split.
          transform: 'translateX(-50%)',
          fontSize: height * 0.85,
          color: glyphColor,
          lineHeight: 1,
          // For the bottom half the text is anchored upward so it
          // visually continues into the next half-card.
          willChange: 'transform',
        }}
      >
        {char}
      </span>
    </div>
  )
}
