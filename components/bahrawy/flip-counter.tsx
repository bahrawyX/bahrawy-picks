'use client'

/**
 * <FlipCounter />
 *
 * A mechanical split-flap (Solari-board) display. Each card is split
 * horizontally across the middle — the TOP half shows the current
 * content's upper portion, the BOTTOM half the lower portion. When
 * the content changes, the top half rotates -180° around the centre
 * seam to reveal a fresh card beneath. Multi-cell support comes with
 * a per-cell cascade so changes wave across the display like the
 * real boards in old airports.
 *
 * The `value` prop accepts THREE shapes:
 *  1. `number` — formatted via `pad`, then split into digits.
 *  2. `string` — split into characters.
 *  3. `(string | ReactNode)[]` — used directly; each entry becomes a
 *     single cell, so each flap can render an image, icon, emoji,
 *     short text label, anything you want.
 *
 * Use case examples:
 *  - score: <FlipCounter value={1234} pad={6} />
 *  - departure: <FlipCounter value="DUBAI" />
 *  - country switcher: <FlipCounter value={[<FlagFR/>, <FlagDE/>]} />
 */

import * as React from 'react'
import { cn } from '@/lib/utils'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type FlipCounterValue = number | string | (string | React.ReactNode)[]

export interface FlipCounterProps {
  /**
   * Current value. See file header for the three accepted shapes.
   */
  value: FlipCounterValue
  /** Pad-start length for numeric values. Default 0 (no pad). */
  pad?: number
  /** Card width in px. Default 56. */
  cellWidth?: number
  /** Card height in px. Default 80. */
  cellHeight?: number
  /** Card colour. Default a dark "departure board" navy. */
  cardColor?: string
  /** Glyph colour (only used for text content). Default warm white. */
  glyphColor?: string
  /** Delay between cell flips in ms — the wave. Default 60. */
  cascade?: number
  /** Duration of one flip in ms. Default 600. */
  duration?: number
  /** Gap between cells in px. Default 4. */
  gap?: number
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
  gap = 4,
  className,
}: FlipCounterProps) {
  // Resolve the value into an array of per-cell contents.
  const cells = React.useMemo<(string | React.ReactNode)[]>(() => {
    if (Array.isArray(value)) return value
    if (typeof value === 'number') {
      const s = pad > 0 ? String(value).padStart(pad, '0') : String(value)
      return [...s]
    }
    return [...String(value)]
  }, [value, pad])

  return (
    <div
      className={cn('inline-flex items-stretch select-none', className)}
      style={{ gap }}
    >
      {cells.map((content, i) => (
        <FlipCell
          key={i}
          // We use the cell INDEX as the key (not the content), so when
          // the same cell flips to a new value we don't unmount —
          // exactly what enables the flap animation.
          content={content}
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
// FlipCell — one mechanical card. Content can be a string or any React
// node (image / icon / emoji / short label).
// ---------------------------------------------------------------------------

function FlipCell({
  content,
  cascadeDelay,
  width,
  height,
  cardColor,
  glyphColor,
  duration,
}: {
  content: string | React.ReactNode
  cascadeDelay: number
  width: number
  height: number
  cardColor: string
  glyphColor: string
  duration: number
}) {
  // Currently-shown content.
  const [current, setCurrent] = React.useState<React.ReactNode>(content)
  // What we're flipping TO.
  const [pending, setPending] = React.useState<React.ReactNode | null>(null)
  const [flipping, setFlipping] = React.useState(false)
  const id = React.useId().replace(/:/g, '')

  // Compare by reference for nodes, value for primitives. If the prop
  // changes, kick off a flip after `cascadeDelay`.
  React.useEffect(() => {
    if (content === current || flipping) return
    setPending(content)
    const start = window.setTimeout(() => setFlipping(true), cascadeDelay)
    return () => window.clearTimeout(start)
  }, [content, current, flipping, cascadeDelay])

  const onAnimationEnd = () => {
    if (!flipping || pending === null) return
    setCurrent(pending)
    setPending(null)
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
      {/* TOP STATIC — upper half of the current content */}
      <Half
        content={current}
        half="top"
        width={width}
        height={height}
        cardColor={cardColor}
        glyphColor={glyphColor}
      />

      {/* BOTTOM STATIC — lower half of the current content */}
      <Half
        content={current}
        half="bottom"
        width={width}
        height={height}
        cardColor={cardColor}
        glyphColor={glyphColor}
      />

      {/* PENDING top half sits BENEATH the flap so it's revealed as
          the flap rotates past 90°. */}
      {pending !== null && (
        <Half
          content={pending}
          half="top"
          width={width}
          height={height}
          cardColor={cardColor}
          glyphColor={glyphColor}
          z={10}
        />
      )}

      {/* The rotating flap — front: current's top half, back: pending's
          bottom half (rotated 180° so it lands right-way-up at -180°). */}
      {flipping && pending !== null && (
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
          <Half
            content={current}
            half="top"
            width={width}
            height={height}
            cardColor={cardColor}
            glyphColor={glyphColor}
            inFlap
          />
          <div
            className="absolute inset-0"
            style={{
              transform: 'rotateX(180deg)',
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
            }}
          >
            <Half
              content={pending}
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

      {/* Centre seam */}
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
// Half — renders either the top or bottom half of a content cell.
//
// For text content we draw the full glyph and clip to a half so the
// two halves line up exactly across the seam. For ReactNode content
// we render the SAME node in both halves at the same intrinsic size,
// then clip — this gives the same split effect for arbitrary content
// (images, icons, etc).
// ---------------------------------------------------------------------------

function Half({
  content,
  half,
  width,
  height,
  cardColor,
  glyphColor,
  z = 0,
  inFlap = false,
}: {
  content: string | React.ReactNode
  half: 'top' | 'bottom'
  width: number
  height: number
  cardColor: string
  glyphColor: string
  z?: number
  inFlap?: boolean
}) {
  // Render strings via our optimised glyph layout; React nodes via a
  // generic split that draws the node centred at the FULL card height
  // inside the half.
  const isText = typeof content === 'string'

  return (
    <div
      className="absolute left-0 overflow-hidden"
      style={{
        width,
        height: height / 2,
        top: inFlap ? 0 : half === 'top' ? 0 : '50%',
        background: cardColor,
        borderRadius:
          half === 'top' ? '6px 6px 0 0' : '0 0 6px 6px',
        zIndex: z,
      }}
    >
      {isText ? (
        <span
          className="absolute left-1/2 font-mono font-semibold leading-none tabular-nums"
          style={{
            top: half === 'top' ? '50%' : 'calc(50% - 100%)',
            transform: 'translateX(-50%)',
            fontSize: height * 0.85,
            color: glyphColor,
            lineHeight: 1,
            willChange: 'transform',
          }}
        >
          {content}
        </span>
      ) : (
        <div
          className="absolute left-1/2 flex items-center justify-center"
          style={{
            // Same trick as the glyph: draw the node at the FULL card
            // height, then clip to the half.
            top: half === 'top' ? '50%' : 'calc(50% - 100%)',
            transform: 'translateX(-50%)',
            width,
            height,
            color: glyphColor,
          }}
        >
          {content}
        </div>
      )}
    </div>
  )
}
