'use client'

/**
 * <Tooltip />
 *
 * A small contextual hint that appears on hover/focus. Lightweight version
 * of HoverCard — for one-liners, not rich previews.
 *
 * Styled like an iMessage bubble: rounded pill body, optional pointer
 * "tail" on the side that faces the trigger. Tail can be toggled via
 * `showTail` (default true).
 *
 * @param content    — The text/node shown in the tooltip.
 * @param children   — Trigger element. Wrapped, not consumed.
 * @param side       — 'top' | 'right' | 'bottom' | 'left'. Default 'top'.
 * @param delay      — Open delay in ms. Default 250.
 * @param showTail   — Render the iMessage-style pointer tail. Default true.
 * @param className  — Extra classes on the tooltip bubble.
 */

import * as React from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { cn } from '@/lib/utils'

export type TooltipSide = 'top' | 'right' | 'bottom' | 'left'

export interface TooltipProps {
  content: React.ReactNode
  children: React.ReactNode
  side?: TooltipSide
  delay?: number
  showTail?: boolean
  className?: string
}

const SPRING = { type: 'spring' as const, stiffness: 460, damping: 28, mass: 0.55 }

// Match the bubble background so the tail blends seamlessly.
const BUBBLE_BG = '#18181b' // zinc-900

export function Tooltip({
  content,
  children,
  side = 'top',
  delay = 250,
  showTail = true,
  className,
}: TooltipProps) {
  const [open, setOpen] = React.useState(false)
  const timer = React.useRef<number | null>(null)

  const show = () => {
    if (timer.current) window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => setOpen(true), delay)
  }
  const hide = () => {
    if (timer.current) window.clearTimeout(timer.current)
    setOpen(false)
  }

  React.useEffect(
    () => () => {
      if (timer.current) window.clearTimeout(timer.current)
    },
    [],
  )

  // ---- Bubble position (relative to the trigger) ----------------------
  // Note: framer-motion accepts `x`/`y` as transform values. They take
  // priority over the css transform we'd otherwise need for centring.
  const sideStyles: Record<TooltipSide, React.CSSProperties> = {
    top: { bottom: 'calc(100% + 10px)', left: '50%', x: '-50%' as never },
    bottom: { top: 'calc(100% + 10px)', left: '50%', x: '-50%' as never },
    left: { right: 'calc(100% + 10px)', top: '50%', y: '-50%' as never },
    right: { left: 'calc(100% + 10px)', top: '50%', y: '-50%' as never },
  }
  const enterOffset: Record<TooltipSide, { x?: number; y?: number }> = {
    top: { y: 4 },
    bottom: { y: -4 },
    left: { x: 4 },
    right: { x: -4 },
  }

  // ---- Tail geometry --------------------------------------------------
  // Classic CSS speech-bubble pattern: a small square rotated 45° so
  // its corner points at the trigger. The two visible sides of the
  // rotated square get the same 1px border as the bubble, giving a
  // tail with a crisp outlined point. The other two sides sit BEHIND
  // the bubble's body (overlap into the bubble) so the join is seamless.
  //
  // For each side, we pick the two un-rotated borders that, after the
  // 45° rotation, end up as the OUTSIDE-FACING edges of the tail:
  //  - top side    → right + bottom (pointing down-out)
  //  - bottom side → top   + left
  //  - left side   → top   + right
  //  - right side  → bottom + left
  const TAIL = 12 // un-rotated square edge length (px)
  const BORDER = '1px solid rgba(255,255,255,0.1)'
  const baseTail: React.CSSProperties = {
    position: 'absolute',
    width: TAIL,
    height: TAIL,
    background: BUBBLE_BG,
    transform: 'rotate(45deg)',
    // Soft drop-shadow on the outside of the tail to match the bubble's
    // shadow-lg shadow-black/50.
    boxShadow: '2px 2px 4px -2px rgba(0,0,0,0.4)',
  }
  // Half the rotated square's "outer" extent — equals TAIL × √2 / 4
  // ≈ TAIL × 0.354. We push the tail outside the bubble by this much
  // so the corner just barely touches the bubble edge.
  const OFFSET = Math.round(TAIL / 2)
  const tailStyles: Record<TooltipSide, React.CSSProperties> = {
    top: {
      ...baseTail,
      bottom: -OFFSET,
      left: '50%',
      marginLeft: -TAIL / 2,
      borderRight: BORDER,
      borderBottom: BORDER,
    },
    bottom: {
      ...baseTail,
      top: -OFFSET,
      left: '50%',
      marginLeft: -TAIL / 2,
      borderTop: BORDER,
      borderLeft: BORDER,
    },
    left: {
      ...baseTail,
      right: -OFFSET,
      top: '50%',
      marginTop: -TAIL / 2,
      borderTop: BORDER,
      borderRight: BORDER,
    },
    right: {
      ...baseTail,
      left: -OFFSET,
      top: '50%',
      marginTop: -TAIL / 2,
      borderBottom: BORDER,
      borderLeft: BORDER,
    },
  }

  return (
    <span
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={hide}
      className="relative inline-flex"
    >
      {children}
      <AnimatePresence>
        {open && (
          <motion.span
            role="tooltip"
            initial={{ opacity: 0, scale: 0.94, ...enterOffset[side] }}
            animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, ...enterOffset[side] }}
            transition={SPRING}
            style={{
              ...sideStyles[side],
              background: BUBBLE_BG,
            }}
            className={cn(
              'pointer-events-none absolute z-50 whitespace-nowrap rounded-[14px] border border-white/10 px-3 py-1.5 text-xs font-medium text-white shadow-lg shadow-black/50',
              className,
            )}
          >
            {content}
            {showTail && (
              <span
                aria-hidden
                // The 45° rotated square — position + borders all live
                // on `tailStyles[side]`. No extra classes needed.
                style={tailStyles[side]}
              />
            )}
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  )
}
