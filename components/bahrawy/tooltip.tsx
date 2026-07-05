'use client'

/**
 * <Tooltip />
 *
 * A small contextual hint that appears on hover/focus. Lightweight version
 * of HoverCard — for one-liners, not rich previews.
 *
 * Apple-styled: vibrancy backdrop, hairline border, multi-layer shadow,
 * crisp little arrow that points at the trigger. Portal-mounted so it
 * never gets clipped by transformed/overflow-hidden parents and always
 * sits correctly relative to the trigger's screen rect.
 *
 * @param content    — The text/node shown in the tooltip.
 * @param children   — Trigger element. Wrapped, not consumed.
 * @param side       — 'top' | 'right' | 'bottom' | 'left'. Default 'top'.
 * @param delay      — Open delay in ms. Default 250.
 * @param showTail   — Render the small pointer arrow. Default true.
 * @param className  — Extra classes on the tooltip bubble.
 */

import * as React from 'react'
import { createPortal } from 'react-dom'
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

const APPLE_SPRING = { type: 'spring' as const, stiffness: 420, damping: 32, mass: 0.6 }
const OFFSET = 10 // px gap between trigger and bubble

interface Position {
  top: number
  left: number
  arrowTop?: number
  arrowLeft?: number
}

function computePosition(
  trigger: DOMRect,
  bubble: { width: number; height: number },
  side: TooltipSide,
): Position {
  const cx = trigger.left + trigger.width / 2
  const cy = trigger.top + trigger.height / 2
  let top = 0
  let left = 0

  if (side === 'top') {
    top = trigger.top - bubble.height - OFFSET
    left = cx - bubble.width / 2
  } else if (side === 'bottom') {
    top = trigger.bottom + OFFSET
    left = cx - bubble.width / 2
  } else if (side === 'left') {
    top = cy - bubble.height / 2
    left = trigger.left - bubble.width - OFFSET
  } else {
    top = cy - bubble.height / 2
    left = trigger.right + OFFSET
  }

  // Clamp horizontally to viewport (8px margin)
  const vp = { w: window.innerWidth, h: window.innerHeight }
  const margin = 8
  const clampedLeft = Math.max(margin, Math.min(left, vp.w - bubble.width - margin))
  const clampedTop = Math.max(margin, Math.min(top, vp.h - bubble.height - margin))

  // Arrow tracks the un-clamped center so it still points at the trigger.
  let arrowLeft: number | undefined
  let arrowTop: number | undefined
  if (side === 'top' || side === 'bottom') {
    arrowLeft = Math.max(10, Math.min(cx - clampedLeft - 5, bubble.width - 16))
  } else {
    arrowTop = Math.max(10, Math.min(cy - clampedTop - 5, bubble.height - 16))
  }

  return {
    top: clampedTop + window.scrollY,
    left: clampedLeft + window.scrollX,
    arrowLeft,
    arrowTop,
  }
}

export function Tooltip({
  content,
  children,
  side = 'top',
  delay = 250,
  showTail = true,
  className,
}: TooltipProps) {
  const [open, setOpen] = React.useState(false)
  const [pos, setPos] = React.useState<Position | null>(null)
  const triggerRef = React.useRef<HTMLSpanElement>(null)
  const bubbleRef = React.useRef<HTMLDivElement>(null)
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

  // Measure trigger + bubble and place the bubble.
  React.useLayoutEffect(() => {
    if (!open) {
      setPos(null)
      return
    }
    const measure = () => {
      const t = triggerRef.current?.getBoundingClientRect()
      const b = bubbleRef.current
      if (!t || !b) return
      setPos(computePosition(t, { width: b.offsetWidth, height: b.offsetHeight }, side))
    }
    // Next frame so the bubble has rendered with its intrinsic width.
    const id = window.setTimeout(measure, 0)
    return () => window.clearTimeout(id)
  }, [open, side, content])

  // Reposition on scroll/resize while open.
  React.useEffect(() => {
    if (!open) return
    const onScroll = () => {
      const t = triggerRef.current?.getBoundingClientRect()
      const b = bubbleRef.current
      if (!t || !b) return
      setPos(computePosition(t, { width: b.offsetWidth, height: b.offsetHeight }, side))
    }
    window.addEventListener('scroll', onScroll, true)
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll, true)
      window.removeEventListener('resize', onScroll)
    }
  }, [open, side])

  // Enter offset — a tiny lift FROM the trigger.
  const enterFrom: Record<TooltipSide, { x?: number; y?: number }> = {
    top: { y: 4 },
    bottom: { y: -4 },
    left: { x: 4 },
    right: { x: -4 },
  }

  // Arrow placement — anchored to the edge nearest the trigger.
  const arrowStyle: React.CSSProperties = {
    position: 'absolute',
    width: 10,
    height: 10,
    background:
      side === 'top'
        ? 'linear-gradient(135deg, transparent 0%, transparent 50%, rgba(28,28,32,0.92) 50%)'
        : side === 'bottom'
        ? 'linear-gradient(315deg, transparent 0%, transparent 50%, rgba(28,28,32,0.92) 50%)'
        : side === 'left'
        ? 'linear-gradient(225deg, transparent 0%, transparent 50%, rgba(28,28,32,0.92) 50%)'
        : 'linear-gradient(45deg, transparent 0%, transparent 50%, rgba(28,28,32,0.92) 50%)',
    backdropFilter: 'blur(40px) saturate(180%)',
    WebkitBackdropFilter: 'blur(40px) saturate(180%)',
    transform: 'rotate(45deg)',
    borderStyle: 'solid',
    borderColor: 'rgb(var(--picks-fg-rgb) / 0.08)',
    borderTopWidth: side === 'bottom' ? '0.5px' : 0,
    borderLeftWidth: side === 'right' ? '0.5px' : 0,
    borderRightWidth: side === 'left' ? '0.5px' : 0,
    borderBottomWidth: side === 'top' ? '0.5px' : 0,
  }

  if (side === 'top') {
    arrowStyle.bottom = -5
    arrowStyle.left = pos?.arrowLeft ?? 0
  } else if (side === 'bottom') {
    arrowStyle.top = -5
    arrowStyle.left = pos?.arrowLeft ?? 0
  } else if (side === 'left') {
    arrowStyle.right = -5
    arrowStyle.top = pos?.arrowTop ?? 0
  } else {
    arrowStyle.left = -5
    arrowStyle.top = pos?.arrowTop ?? 0
  }

  const portal =
    typeof document !== 'undefined'
      ? createPortal(
          <AnimatePresence>
            {open && (
              <motion.div
                ref={bubbleRef}
                role="tooltip"
                initial={{ opacity: 0, scale: 0.94, ...enterFrom[side] }}
                animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, ...enterFrom[side] }}
                transition={APPLE_SPRING}
                style={{
                  position: 'absolute',
                  top: pos?.top ?? -9999,
                  left: pos?.left ?? -9999,
                  zIndex: 240,
                  opacity: pos ? undefined : 0,
                }}
                className={cn(
                  'pointer-events-none rounded-[8px] border border-picks-fg/[0.08]',
                  className,
                )}
              >
                {/* Vibrancy fill */}
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-0 rounded-[8px]"
                  style={{
                    background:
                      'linear-gradient(180deg, rgba(40,40,46,0.88) 0%, rgba(22,22,26,0.92) 100%)',
                    backdropFilter: 'blur(40px) saturate(180%)',
                    WebkitBackdropFilter: 'blur(40px) saturate(180%)',
                    boxShadow: `
                      0 1px 0 rgba(255,255,255,0.06) inset,
                      0 0 0 0.5px rgba(255,255,255,0.04),
                      0 8px 20px -6px rgba(0,0,0,0.55),
                      0 16px 36px -12px rgba(0,0,0,0.4)
                    `,
                  }}
                />

                {/* Arrow */}
                {showTail && pos && <span aria-hidden style={arrowStyle} />}

                {/* Content */}
                <span className="relative block whitespace-nowrap px-2.5 py-1.5 text-[12px] font-medium leading-none text-picks-fg/95">
                  {content}
                </span>
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
        onMouseEnter={show}
        onMouseLeave={hide}
        onFocus={show}
        onBlur={hide}
        className="relative inline-flex"
      >
        {children}
      </span>
      {portal}
    </>
  )
}
