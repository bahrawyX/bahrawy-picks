'use client'

/**
 * <Drawer />
 *
 * Slide-in panel from any of the four edges. Backdrop dims behind it,
 * Escape closes it, focus is trapped while open. Spring entry/exit so it
 * feels weight-y instead of CSS-flat.
 */

import * as React from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useFocusTrap } from '@/lib/use-focus-trap'

export type DrawerSide = 'left' | 'right' | 'top' | 'bottom'

export interface DrawerProps {
  open: boolean
  onClose: () => void
  side?: DrawerSide
  /** Pixel size on the perpendicular axis. Default 380. */
  size?: number
  /** Hide the close button. Default false. */
  hideClose?: boolean
  title?: React.ReactNode
  children: React.ReactNode
  className?: string
}

const SPRING = { type: 'spring' as const, stiffness: 360, damping: 32, mass: 0.7 }

export function Drawer({
  open,
  onClose,
  side = 'right',
  size = 380,
  hideClose = false,
  title,
  children,
  className,
}: DrawerProps) {
  const panelRef = React.useRef<HTMLElement>(null)

  // Focus: initial move-in, Tab cycling, restore on close.
  useFocusTrap(panelRef, open)

  // Close on Escape
  React.useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  // Body scroll lock.
  React.useEffect(() => {
    if (!open) return
    const original = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = original
    }
  }, [open])

  const isHorizontal = side === 'left' || side === 'right'
  const initialOffset =
    side === 'right'
      ? { x: '100%' }
      : side === 'left'
        ? { x: '-100%' }
        : side === 'top'
          ? { y: '-100%' }
          : { y: '100%' }

  const positionClass = cn(
    'fixed',
    side === 'right' && 'inset-y-0 right-0',
    side === 'left' && 'inset-y-0 left-0',
    side === 'top' && 'inset-x-0 top-0',
    side === 'bottom' && 'inset-x-0 bottom-0',
  )

  const sizeStyle = isHorizontal ? { width: size } : { height: size }

  if (typeof document === 'undefined') return null

  return createPortal(
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            aria-hidden
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          />

          <motion.aside
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            tabIndex={-1}
            initial={initialOffset}
            animate={{ x: 0, y: 0 }}
            exit={initialOffset}
            transition={SPRING}
            style={sizeStyle}
            className={cn(
              'z-50 flex max-h-screen max-w-full flex-col border-picks-fg/10 bg-picks-surface shadow-2xl outline-none',
              positionClass,
              isHorizontal ? 'border-l border-r' : 'border-t border-b',
              className,
            )}
          >
            {(title || !hideClose) && (
              <header className="flex items-center justify-between gap-3 border-b border-picks-fg/10 px-5 py-4">
                {title ? (
                  <h2 className="text-sm font-semibold text-picks-fg">{title}</h2>
                ) : (
                  <span />
                )}
                {!hideClose && (
                  <button
                    type="button"
                    onClick={onClose}
                    aria-label="Close drawer"
                    className="rounded-md p-1 text-picks-fg/50 transition-colors hover:bg-picks-fg/10 hover:text-picks-fg"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </header>
            )}
            <div className="flex-1 overflow-y-auto p-5 text-sm text-picks-fg/85">
              {children}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>,
    document.body,
  )
}
