'use client'

/**
 * <LiveCursor /> + <LiveCursors />
 *
 * Figma/Vercel-style multiplayer cursors with chat bubbles. Each
 * cursor is a coloured arrow that springs to its (x, y) target, with
 * an optional bubble showing the user's @handle and a message. A
 * `typing` flag swaps the message body for three pulsing dots so you
 * can show "someone is typing" without a message yet.
 *
 *   <LiveCursors users={[...]} />
 *
 * Position is in pixels relative to the nearest positioned ancestor —
 * wrap in a `relative` container with a known size.
 */

import * as React from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { usePrefersReducedMotion } from '@/lib/use-prefers-reduced-motion'

export interface LiveCursorProps {
  /** Display name. The leading `@` is a convention, not enforced. */
  name?: string
  /** Brand colour for the cursor + bubble accent. Default '#60A5FA'. */
  color?: string
  /** Position in px relative to the positioned ancestor. */
  x: number
  y: number
  /** Bubble message. Bubble is hidden if both name and message are absent (and `typing` is false). */
  message?: string
  /** Show animated typing dots in the bubble instead of the message text. */
  typing?: boolean
  /** Spring stiffness for cursor movement. Default 320. */
  stiffness?: number
  /** Spring damping. Default 38. */
  damping?: number
  /** z-index for stacking. Default 30. */
  z?: number
  className?: string
}

const CURSOR_SIZE = 18

export function LiveCursor({
  name,
  color = '#60A5FA',
  x,
  y,
  message,
  typing = false,
  stiffness = 320,
  damping = 38,
  z = 30,
  className,
}: LiveCursorProps) {
  const spring = React.useMemo(
    () => ({ type: 'spring' as const, stiffness, damping, mass: 0.6 }),
    [stiffness, damping],
  )

  const showBubble = !!name || !!message || typing

  return (
    <motion.div
      aria-hidden
      className={cn(
        'pointer-events-none absolute left-0 top-0 select-none',
        className,
      )}
      style={{ zIndex: z }}
      animate={{ x, y }}
      transition={spring}
    >
      <CursorPointer color={color} />

      <AnimatePresence>
        {showBubble && (
          <motion.div
            key="bubble"
            initial={{ opacity: 0, y: -4, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.92 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            className={cn(
              'absolute origin-top-left whitespace-nowrap rounded-2xl rounded-tl-md bg-picks-fg px-3 py-1.5 shadow-lg shadow-black/40',
              'text-[12px] font-medium tracking-tight',
            )}
            style={{
              left: CURSOR_SIZE - 2,
              top: CURSOR_SIZE - 2,
            }}
          >
            {name && (
              <div
                className="text-[10.5px] leading-tight"
                style={{ color: withAlpha(color, 0.55) }}
              >
                {name}
              </div>
            )}
            {typing ? (
              <TypingDots color={color} />
            ) : (
              message && (
                <div className="leading-tight" style={{ color }}>
                  {message}
                </div>
              )
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// ---------------------------------------------------------------------------
// Cursor pointer SVG
// ---------------------------------------------------------------------------

function CursorPointer({ color }: { color: string }) {
  return (
    <svg
      width={CURSOR_SIZE}
      height={CURSOR_SIZE + 4}
      viewBox="0 0 18 22"
      fill="none"
      className="block drop-shadow-[0_1px_3px_rgba(0,0,0,0.5)]"
    >
      <path
        d="M2.5 1.5 L2.5 17 L6.5 13.5 L9 18 L11.2 17 L8.7 12.7 L14 12.7 Z"
        fill={color}
        stroke="rgba(0,0,0,0.85)"
        strokeWidth="1"
        strokeLinejoin="round"
      />
    </svg>
  )
}

// ---------------------------------------------------------------------------
// Typing dots
// ---------------------------------------------------------------------------

function TypingDots({ color }: { color: string }) {
  const reduced = usePrefersReducedMotion()

  // Reduced motion: static dots — the bubble still reads as "typing".
  if (reduced) {
    return (
      <span className="inline-flex items-center gap-1 py-1">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="block h-1.5 w-1.5 rounded-full opacity-60"
            style={{ backgroundColor: color }}
          />
        ))}
      </span>
    )
  }

  return (
    <span className="inline-flex items-center gap-1 py-1">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="block h-1.5 w-1.5 rounded-full"
          style={{ backgroundColor: color }}
          animate={{ opacity: [0.3, 1, 0.3], y: [0, -2, 0] }}
          transition={{
            duration: 0.9,
            delay: i * 0.16,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </span>
  )
}

// ---------------------------------------------------------------------------
// <LiveCursors /> — convenience plural
// ---------------------------------------------------------------------------

export interface LiveCursorsUser {
  id: string
  name?: string
  color?: string
  x: number
  y: number
  message?: string
  typing?: boolean
}

export interface LiveCursorsProps {
  users: LiveCursorsUser[]
  className?: string
}

export function LiveCursors({ users, className }: LiveCursorsProps) {
  return (
    <div className={cn('pointer-events-none absolute inset-0', className)}>
      {users.map((u) => (
        <LiveCursor key={u.id} {...u} />
      ))}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Returns the colour as #RRGGBBAA, clamping alpha to [0,1]. */
function withAlpha(hex: string, alpha: number): string {
  const a = Math.max(0, Math.min(1, alpha))
  const aHex = Math.round(a * 255)
    .toString(16)
    .padStart(2, '0')
  // If it already has an alpha channel, replace it; otherwise append.
  if (/^#[0-9a-fA-F]{8}$/.test(hex)) return hex.slice(0, 7) + aHex
  if (/^#[0-9a-fA-F]{6}$/.test(hex)) return hex + aHex
  return hex
}
