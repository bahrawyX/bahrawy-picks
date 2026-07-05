'use client'

/**
 * <Popover />  —  Apple-styled anchored interactive popup.
 *
 * Distinct from <Tooltip /> (hover-only, non-interactive) and from
 * <DropdownMenu /> (menu-shaped). This is a general-purpose popup
 * anchored to a trigger element via ref, with fully interactive
 * content inside.
 *
 *  - Controlled open via `open` + `onOpenChange`
 *  - Anchored to `anchorRef` (any HTMLElement)
 *  - `side`: top | right | bottom | left
 *  - `align`: start | center | end
 *  - Auto-flips to the opposite side if there's no room
 *  - Vibrancy panel with multi-layer shadow
 *  - Optional `arrow` pointing at the anchor
 *  - Click-outside + ESC dismiss
 *  - Re-positions on scroll / resize
 */

import * as React from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { useFocusTrap } from '@/lib/use-focus-trap'

export type PopoverSide = 'top' | 'right' | 'bottom' | 'left'
export type PopoverAlign = 'start' | 'center' | 'end'

export interface PopoverProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** The element to anchor against. */
  anchorRef: React.RefObject<HTMLElement | null>
  /** Side of the anchor to place on. Default 'bottom'. */
  side?: PopoverSide
  /** Alignment along the anchor's edge. Default 'center'. */
  align?: PopoverAlign
  /** Distance in px between popover and anchor. Default 8. */
  offset?: number
  /** Show the small arrow pointing at the anchor. Default true. */
  arrow?: boolean
  /** Click outside dismisses. Default true. */
  closeOnOutsideClick?: boolean
  /** Esc dismisses. Default true. */
  closeOnEsc?: boolean
  className?: string
  children?: React.ReactNode
}

const APPLE_SPRING = { type: 'spring' as const, stiffness: 460, damping: 32, mass: 0.55 }

function flipSide(s: PopoverSide): PopoverSide {
  return s === 'top' ? 'bottom' : s === 'bottom' ? 'top' : s === 'left' ? 'right' : 'left'
}

interface PositionResult {
  top: number
  left: number
  side: PopoverSide
  arrow: { top?: number; left?: number; right?: number; bottom?: number }
}

function computePosition(
  anchor: DOMRect,
  pop: { width: number; height: number },
  preferredSide: PopoverSide,
  align: PopoverAlign,
  offset: number,
): PositionResult {
  const vp = { w: window.innerWidth, h: window.innerHeight }
  const margin = 8

  // Compute (top, left) for a given side.
  const positionForSide = (s: PopoverSide) => {
    let top = 0
    let left = 0
    if (s === 'top') {
      top = anchor.top - pop.height - offset
      if (align === 'start') left = anchor.left
      else if (align === 'end') left = anchor.right - pop.width
      else left = anchor.left + anchor.width / 2 - pop.width / 2
    } else if (s === 'bottom') {
      top = anchor.bottom + offset
      if (align === 'start') left = anchor.left
      else if (align === 'end') left = anchor.right - pop.width
      else left = anchor.left + anchor.width / 2 - pop.width / 2
    } else if (s === 'left') {
      left = anchor.left - pop.width - offset
      if (align === 'start') top = anchor.top
      else if (align === 'end') top = anchor.bottom - pop.height
      else top = anchor.top + anchor.height / 2 - pop.height / 2
    } else {
      left = anchor.right + offset
      if (align === 'start') top = anchor.top
      else if (align === 'end') top = anchor.bottom - pop.height
      else top = anchor.top + anchor.height / 2 - pop.height / 2
    }
    return { top, left }
  }

  // Does this side fit?
  const fits = (s: PopoverSide) => {
    const { top, left } = positionForSide(s)
    return (
      top >= margin &&
      left >= margin &&
      top + pop.height <= vp.h - margin &&
      left + pop.width <= vp.w - margin
    )
  }

  let side = preferredSide
  if (!fits(side) && fits(flipSide(side))) side = flipSide(side)

  let { top, left } = positionForSide(side)

  // Clamp to viewport.
  top = Math.max(margin, Math.min(top, vp.h - pop.height - margin))
  left = Math.max(margin, Math.min(left, vp.w - pop.width - margin))

  // Arrow centered on anchor's mid (clamped to popover bounds).
  let arrow: PositionResult['arrow'] = {}
  if (side === 'top') {
    const targetLeft = anchor.left + anchor.width / 2 - left - 6
    arrow = { bottom: -5, left: Math.max(12, Math.min(targetLeft, pop.width - 18)) }
  } else if (side === 'bottom') {
    const targetLeft = anchor.left + anchor.width / 2 - left - 6
    arrow = { top: -5, left: Math.max(12, Math.min(targetLeft, pop.width - 18)) }
  } else if (side === 'left') {
    const targetTop = anchor.top + anchor.height / 2 - top - 6
    arrow = { right: -5, top: Math.max(12, Math.min(targetTop, pop.height - 18)) }
  } else {
    const targetTop = anchor.top + anchor.height / 2 - top - 6
    arrow = { left: -5, top: Math.max(12, Math.min(targetTop, pop.height - 18)) }
  }

  return { top: top + window.scrollY, left: left + window.scrollX, side, arrow }
}

export function Popover({
  open,
  onOpenChange,
  anchorRef,
  side = 'bottom',
  align = 'center',
  offset = 8,
  arrow = true,
  closeOnOutsideClick = true,
  closeOnEsc = true,
  className,
  children,
}: PopoverProps) {
  const popRef = React.useRef<HTMLDivElement>(null)
  const [pos, setPos] = React.useState<PositionResult | null>(null)
  const panelId = React.useId()

  // Focus: move into the panel on open, Tab cycling, restore on close.
  useFocusTrap(popRef, open)

  // The trigger markup is the consumer's, so reflect the popup state on
  // the anchor element imperatively (aria-expanded + aria-controls).
  React.useEffect(() => {
    const anchor = anchorRef.current
    if (!anchor) return
    anchor.setAttribute('aria-expanded', open ? 'true' : 'false')
    if (open) anchor.setAttribute('aria-controls', panelId)
    else anchor.removeAttribute('aria-controls')
    return () => {
      anchor.removeAttribute('aria-expanded')
      anchor.removeAttribute('aria-controls')
    }
  }, [open, anchorRef, panelId])

  const reposition = React.useCallback(() => {
    const anchor = anchorRef.current?.getBoundingClientRect()
    const popEl = popRef.current
    if (!anchor || !popEl) return
    const popRect = { width: popEl.offsetWidth, height: popEl.offsetHeight }
    setPos(computePosition(anchor, popRect, side, align, offset))
  }, [anchorRef, side, align, offset])

  // Reposition on open + when content changes.
  React.useLayoutEffect(() => {
    if (!open) {
      setPos(null)
      return
    }
    // first measure on next frame so the popover has rendered with content
    const t = window.setTimeout(reposition, 0)
    return () => window.clearTimeout(t)
  }, [open, reposition, children])

  // Reposition on scroll/resize while open.
  React.useEffect(() => {
    if (!open) return
    const onScroll = () => reposition()
    window.addEventListener('scroll', onScroll, true)
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll, true)
      window.removeEventListener('resize', onScroll)
    }
  }, [open, reposition])

  // Outside click + ESC.
  React.useEffect(() => {
    if (!open) return
    const onDown = (e: MouseEvent) => {
      if (!closeOnOutsideClick) return
      if (popRef.current?.contains(e.target as Node)) return
      if (anchorRef.current?.contains(e.target as Node)) return
      onOpenChange(false)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && closeOnEsc) {
        e.preventDefault()
        onOpenChange(false)
      }
    }
    document.addEventListener('mousedown', onDown)
    window.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDown)
      window.removeEventListener('keydown', onKey)
    }
  }, [open, closeOnOutsideClick, closeOnEsc, anchorRef, onOpenChange])

  if (typeof document === 'undefined') return null

  // Initial offscreen position so we can measure before showing.
  const top = pos?.top ?? -9999
  const left = pos?.left ?? -9999
  const showSide = pos?.side ?? side

  // Arrow background depends on the side (we draw a small rotated square).
  const arrowBg =
    showSide === 'top'
      ? 'linear-gradient(135deg, rgba(40,40,46,0.85) 0%, rgba(40,40,46,0.85) 50%, transparent 50%)'
      : showSide === 'bottom'
      ? 'linear-gradient(315deg, rgba(22,22,26,0.9) 0%, rgba(22,22,26,0.9) 50%, transparent 50%)'
      : showSide === 'left'
      ? 'linear-gradient(45deg, rgba(40,40,46,0.85) 0%, rgba(40,40,46,0.85) 50%, transparent 50%)'
      : 'linear-gradient(225deg, rgba(22,22,26,0.9) 0%, rgba(22,22,26,0.9) 50%, transparent 50%)'

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          ref={popRef}
          id={panelId}
          role="dialog"
          tabIndex={-1}
          initial={{
            opacity: 0,
            scale: 0.94,
            x: showSide === 'left' ? 4 : showSide === 'right' ? -4 : 0,
            y: showSide === 'top' ? 4 : showSide === 'bottom' ? -4 : 0,
          }}
          animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
          exit={{
            opacity: 0,
            scale: 0.96,
            x: showSide === 'left' ? 2 : showSide === 'right' ? -2 : 0,
            y: showSide === 'top' ? 2 : showSide === 'bottom' ? -2 : 0,
          }}
          transition={APPLE_SPRING}
          style={{
            position: 'absolute',
            top,
            left,
            zIndex: 230,
            opacity: pos ? undefined : 0,
          }}
          className={cn(
            'rounded-[14px] border border-picks-fg/[0.08] outline-none backdrop-blur-2xl',
            className,
          )}
        >
          {/* Vibrancy fill */}
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-[14px]"
            style={{
              background:
                'linear-gradient(180deg, rgba(40,40,46,0.85) 0%, rgba(22,22,26,0.9) 100%)',
              backdropFilter: 'blur(40px) saturate(180%)',
              WebkitBackdropFilter: 'blur(40px) saturate(180%)',
              boxShadow: `
                0 1px 0 rgba(255,255,255,0.08) inset,
                0 0 0 0.5px rgba(255,255,255,0.05),
                0 12px 28px -8px rgba(0,0,0,0.6),
                0 24px 48px -16px rgba(0,0,0,0.4)
              `,
            }}
          />

          {/* Arrow */}
          {arrow && pos && (
            <span
              aria-hidden
              className="absolute h-3 w-3 rotate-45 border-picks-fg/[0.08]"
              style={{
                ...pos.arrow,
                background: arrowBg,
                backdropFilter: 'blur(40px) saturate(180%)',
                WebkitBackdropFilter: 'blur(40px) saturate(180%)',
                borderTopWidth: showSide === 'bottom' ? '0.5px' : 0,
                borderLeftWidth: showSide === 'right' ? '0.5px' : 0,
                borderRightWidth: showSide === 'left' ? '0.5px' : 0,
                borderBottomWidth: showSide === 'top' ? '0.5px' : 0,
                borderStyle: 'solid',
              }}
            />
          )}

          {/* Content */}
          <div className="relative">{children}</div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  )
}
