'use client'

/**
 * <Tooltip />
 *
 * A small contextual hint that appears on hover/focus. Lightweight version
 * of HoverCard — for one-liners, not rich previews.
 *
 * @param content    — The text/node shown in the tooltip.
 * @param children   — Trigger element. Wrapped, not consumed.
 * @param side       — 'top' | 'right' | 'bottom' | 'left'. Default 'top'.
 * @param delay      — Open delay in ms. Default 250.
 * @param className  — Extra classes on the tooltip itself.
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
  className?: string
}

const SPRING = { type: 'spring' as const, stiffness: 460, damping: 28, mass: 0.55 }

export function Tooltip({
  content,
  children,
  side = 'top',
  delay = 250,
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

  // Per-side positioning + entry offset
  const sideStyles: Record<TooltipSide, React.CSSProperties> = {
    top: { bottom: 'calc(100% + 8px)', left: '50%', x: '-50%' as never },
    bottom: { top: 'calc(100% + 8px)', left: '50%', x: '-50%' as never },
    left: { right: 'calc(100% + 8px)', top: '50%', y: '-50%' as never },
    right: { left: 'calc(100% + 8px)', top: '50%', y: '-50%' as never },
  }
  const enterOffset: Record<TooltipSide, { x?: number; y?: number }> = {
    top: { y: 4 },
    bottom: { y: -4 },
    left: { x: 4 },
    right: { x: -4 },
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
            style={sideStyles[side]}
            className={cn(
              'pointer-events-none absolute z-50 whitespace-nowrap rounded-md border border-white/10 bg-zinc-900 px-2 py-1 text-xs text-white shadow-lg shadow-black/40',
              className,
            )}
          >
            {content}
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  )
}
