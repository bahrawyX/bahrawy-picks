'use client'

/**
 * <HoverCard />
 *
 * A preview popup that appears on hover (or focus) with a configurable delay.
 * Spring-positioned with a fade+scale entry. Flips to the side that fits.
 *
 * Portal-mounted to document.body (like <Tooltip />) so it never gets clipped
 * by transformed/overflow-hidden parents; positioned off the trigger's screen
 * rect, flipped to the opposite side when the preferred one doesn't fit, and
 * clamped to the viewport. Escape dismisses.
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
import { createPortal } from 'react-dom'
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
const MARGIN = 8 // px kept between the card and the viewport edge

interface Position {
  top: number
  left: number
  side: 'top' | 'bottom'
}

function computePosition(
  trigger: DOMRect,
  card: { width: number; height: number },
  preferredSide: 'top' | 'bottom',
  offset: number,
): Position {
  const vp = { w: window.innerWidth, h: window.innerHeight }

  const topFor = (s: 'top' | 'bottom') =>
    s === 'top' ? trigger.top - card.height - offset : trigger.bottom + offset

  // Collision flip: prefer the requested side, fall back to the opposite
  // one when the card would leave the viewport vertically.
  const fits = (s: 'top' | 'bottom') => {
    const t = topFor(s)
    return t >= MARGIN && t + card.height <= vp.h - MARGIN
  }
  const flipped: 'top' | 'bottom' = preferredSide === 'top' ? 'bottom' : 'top'
  const side = !fits(preferredSide) && fits(flipped) ? flipped : preferredSide

  const top = topFor(side)
  const left = Math.max(
    MARGIN,
    Math.min(
      trigger.left + trigger.width / 2 - card.width / 2,
      vp.w - card.width - MARGIN,
    ),
  )

  return { top: top + window.scrollY, left: left + window.scrollX, side }
}

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
  const [pos, setPos] = React.useState<Position | null>(null)
  const triggerRef = React.useRef<HTMLSpanElement>(null)
  const cardRef = React.useRef<HTMLDivElement>(null)
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

  const measure = React.useCallback(() => {
    const t = triggerRef.current?.getBoundingClientRect()
    const c = cardRef.current
    if (!t || !c) return
    setPos(computePosition(t, { width: c.offsetWidth, height: c.offsetHeight }, side, offset))
  }, [side, offset])

  // Measure trigger + card and place the card once it has rendered.
  React.useLayoutEffect(() => {
    if (!open) {
      setPos(null)
      return
    }
    const id = window.setTimeout(measure, 0)
    return () => window.clearTimeout(id)
  }, [open, measure, children])

  // Reposition on scroll/resize while open.
  React.useEffect(() => {
    if (!open) return
    window.addEventListener('scroll', measure, true)
    window.addEventListener('resize', measure)
    return () => {
      window.removeEventListener('scroll', measure, true)
      window.removeEventListener('resize', measure)
    }
  }, [open, measure])

  // Escape dismisses immediately.
  React.useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        clearTimers()
        setOpen(false)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  // Animate from the side the card actually rendered on.
  const shownSide = pos?.side ?? side
  const startY = shownSide === 'top' ? 6 : -6

  const portal =
    typeof document !== 'undefined'
      ? createPortal(
          <AnimatePresence>
            {open && (
              <motion.div
                ref={cardRef}
                role="tooltip"
                initial={{ opacity: 0, y: startY, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: startY, scale: 0.97 }}
                transition={SPRING}
                style={{
                  position: 'absolute',
                  top: pos?.top ?? -9999,
                  left: pos?.left ?? -9999,
                  zIndex: 220,
                  opacity: pos ? undefined : 0,
                }}
                onMouseEnter={show}
                onMouseLeave={hide}
                className={cn(
                  'w-max max-w-sm rounded-xl border border-white/10 bg-zinc-900 p-4 shadow-2xl shadow-black/40',
                  className,
                )}
              >
                {children}
              </motion.div>
            )}
          </AnimatePresence>,
          document.body,
        )
      : null

  return (
    <>
      <span
        ref={triggerRef}
        className="relative inline-block"
        onMouseEnter={show}
        onMouseLeave={hide}
        onFocus={show}
        onBlur={hide}
      >
        {trigger}
      </span>
      {portal}
    </>
  )
}
