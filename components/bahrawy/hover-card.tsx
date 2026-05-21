'use client'

/**
 * <HoverCard />
 *
 * A preview popup that appears on hover (or focus) with a configurable delay.
 * Spring-positioned with a fade+scale entry. Flips to the side that fits.
 *
 * @param trigger       — The element users hover. Wrapped, not consumed.
 * @param children      — Popup content.
 * @param side          — Preferred side: 'top' | 'bottom'. Default 'bottom'.
 * @param openDelay     — ms before showing. Default 200.
 * @param closeDelay    — ms before hiding. Default 120.
 * @param offset        — Px between trigger and popup. Default 8.
 * @param className     — Extra classes for the popup.
 */

import * as React from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { cn } from '@/lib/utils'

export interface HoverCardProps {
  trigger: React.ReactNode
  children: React.ReactNode
  side?: 'top' | 'bottom'
  openDelay?: number
  closeDelay?: number
  offset?: number
  className?: string
}

const SPRING = { type: 'spring' as const, stiffness: 400, damping: 28, mass: 0.7 }

export function HoverCard({
  trigger,
  children,
  side = 'bottom',
  openDelay = 200,
  closeDelay = 120,
  offset = 8,
  className,
}: HoverCardProps) {
  const [open, setOpen] = React.useState(false)
  const openTimer = React.useRef<number | null>(null)
  const closeTimer = React.useRef<number | null>(null)

  const clearTimers = () => {
    if (openTimer.current !== null) window.clearTimeout(openTimer.current)
    if (closeTimer.current !== null) window.clearTimeout(closeTimer.current)
    openTimer.current = null
    closeTimer.current = null
  }

  const show = () => {
    clearTimers()
    openTimer.current = window.setTimeout(() => setOpen(true), openDelay)
  }
  const hide = () => {
    clearTimers()
    closeTimer.current = window.setTimeout(() => setOpen(false), closeDelay)
  }

  React.useEffect(() => () => clearTimers(), [])

  // Position offsets
  const isTop = side === 'top'
  const startY = isTop ? 6 : -6
  const stylePosition = isTop
    ? { bottom: `calc(100% + ${offset}px)` }
    : { top: `calc(100% + ${offset}px)` }

  return (
    <span
      className="relative inline-block"
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={hide}
    >
      {trigger}

      <AnimatePresence>
        {open && (
          <motion.div
            role="tooltip"
            initial={{ opacity: 0, y: startY, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: startY, scale: 0.97 }}
            transition={SPRING}
            style={{ ...stylePosition, left: '50%', x: '-50%' }}
            className={cn(
              'absolute z-50 w-max max-w-sm rounded-xl border border-white/10 bg-zinc-900 p-4 shadow-2xl shadow-black/40',
              className,
            )}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </span>
  )
}
