'use client'

/**
 * <BottomSheet />  —  iOS share-sheet-style drawer.
 *
 * A bottom-anchored vibrancy panel that opens with an Apple spring,
 * supports multiple "detents" (snap heights — e.g. peek 40%, full
 * 90%), drags between them with momentum, and dismisses when the
 * user flicks down past the smallest detent.
 *
 * Apple aesthetics: vibrancy backdrop with blur, generous 28px top
 * radius, small drag-handle pill, multi-layer shadow, ESC + backdrop
 * click to close (configurable).
 */

import * as React from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion, useMotionValue, useTransform, animate } from 'framer-motion'
import { cn } from '@/lib/utils'

export interface BottomSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** Snap heights as fractions of viewport height. Sorted small → large. Default [0.4, 0.92]. */
  detents?: number[]
  /** Index of the initial detent on open. Default 0. */
  defaultDetent?: number
  /** Fires when the user snaps to a different detent. */
  onDetentChange?: (idx: number) => void
  /** Show the small drag-handle pill at the top. Default true. */
  showHandle?: boolean
  /** Click on backdrop dismisses. Default true. */
  closeOnBackdropClick?: boolean
  /** Esc dismisses. Default true. */
  closeOnEsc?: boolean
  /** Optional title shown in the header bar. */
  title?: React.ReactNode
  /** Optional right-aligned header content (e.g. a Done button). */
  headerAction?: React.ReactNode
  className?: string
  children?: React.ReactNode
}

// Apple-style springs
const SPRING_SNAP = { type: 'spring' as const, stiffness: 420, damping: 36, mass: 0.7 }
const SPRING_OPEN = { type: 'spring' as const, stiffness: 360, damping: 34, mass: 0.7 }

export function BottomSheet({
  open,
  onOpenChange,
  detents = [0.4, 0.92],
  defaultDetent = 0,
  onDetentChange,
  showHandle = true,
  closeOnBackdropClick = true,
  closeOnEsc = true,
  title,
  headerAction,
  className,
  children,
}: BottomSheetProps) {
  const [vh, setVh] = React.useState(0)
  const sheetRef = React.useRef<HTMLDivElement>(null)
  const y = useMotionValue(0)
  const [currentDetent, setCurrentDetent] = React.useState(defaultDetent)

  // Track viewport height (rerun on resize)
  React.useEffect(() => {
    const measure = () => setVh(window.innerHeight)
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [])

  const sortedDetents = React.useMemo(
    () => [...detents].sort((a, b) => a - b),
    [detents],
  )
  const maxDetent = sortedDetents[sortedDetents.length - 1] ?? 0.9
  const sheetHeight = vh * maxDetent

  // Compute y-position for a given detent
  const yForDetent = React.useCallback(
    (idx: number) => sheetHeight - sortedDetents[idx] * vh,
    [sheetHeight, sortedDetents, vh],
  )

  // Backdrop opacity fades as sheet slides down
  const backdropOpacity = useTransform(
    y,
    [0, sheetHeight],
    [1, 0],
    { clamp: true },
  )

  // Open / close — animate y into / out of view.
  React.useEffect(() => {
    if (!vh) return
    if (open) {
      // Snap target detent in case prop changed while closed
      setCurrentDetent(defaultDetent)
      y.set(sheetHeight) // start hidden
      animate(y, yForDetent(defaultDetent), SPRING_OPEN)
    } else {
      animate(y, sheetHeight, SPRING_OPEN)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, vh, sheetHeight])

  const dismiss = React.useCallback(() => {
    animate(y, sheetHeight, SPRING_OPEN).then(() => onOpenChange(false))
  }, [y, sheetHeight, onOpenChange])

  // Esc
  React.useEffect(() => {
    if (!open || !closeOnEsc) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        dismiss()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, closeOnEsc, dismiss])

  // Lock body scroll while open
  React.useEffect(() => {
    if (!open) return
    const original = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = original
    }
  }, [open])

  const snapToNearest = (currentY: number, velocity: number) => {
    // Where the sheet would land if released to momentum.
    const projected = currentY + velocity * 0.18

    // Candidate y positions: every detent + dismissal point (sheetHeight).
    const detentYs = sortedDetents.map((_, i) => yForDetent(i))
    const candidates = [...detentYs, sheetHeight]

    let bestIdx = 0
    let bestDist = Infinity
    for (let i = 0; i < candidates.length; i++) {
      const d = Math.abs(projected - candidates[i])
      if (d < bestDist) {
        bestDist = d
        bestIdx = i
      }
    }

    if (bestIdx === candidates.length - 1) {
      dismiss()
      return
    }
    setCurrentDetent(bestIdx)
    onDetentChange?.(bestIdx)
    animate(y, yForDetent(bestIdx), SPRING_SNAP)
  }

  if (typeof document === 'undefined') return null

  return createPortal(
    <AnimatePresence>
      {open && vh > 0 && (
        <>
          {/* Backdrop */}
          <motion.div
            key="bs-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-[200]"
            style={{
              background:
                'radial-gradient(ellipse at center, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.82) 100%)',
              backdropFilter: 'blur(24px) saturate(140%)',
              WebkitBackdropFilter: 'blur(24px) saturate(140%)',
              opacity: backdropOpacity as unknown as number,
            }}
            onClick={closeOnBackdropClick ? dismiss : undefined}
          />

          {/* Sheet */}
          <motion.div
            key="bs-sheet"
            ref={sheetRef}
            role="dialog"
            aria-modal="true"
            drag="y"
            dragMomentum={false}
            dragConstraints={{ top: 0, bottom: sheetHeight }}
            dragElastic={{ top: 0.06, bottom: 0 }}
            onDragEnd={(_, info) => {
              const currentY = y.get()
              const v = info.velocity.y
              snapToNearest(currentY, v)
            }}
            style={{
              y,
              height: sheetHeight,
              background:
                'linear-gradient(180deg, rgba(36,36,40,0.92) 0%, rgba(22,22,26,0.96) 100%)',
              backdropFilter: 'blur(40px) saturate(180%)',
              WebkitBackdropFilter: 'blur(40px) saturate(180%)',
              boxShadow: `
                0 1px 0 rgba(255,255,255,0.08) inset,
                0 0 0 0.5px rgba(255,255,255,0.06),
                0 -8px 28px -8px rgba(0,0,0,0.55),
                0 -24px 60px -16px rgba(0,0,0,0.4)
              `,
            }}
            className={cn(
              'fixed inset-x-0 bottom-0 z-[201] flex flex-col overflow-hidden rounded-t-[28px] border-t border-white/[0.08]',
              className,
            )}
          >
            {/* Drag handle */}
            {showHandle && (
              <div className="flex shrink-0 justify-center pb-1 pt-2.5">
                <span
                  aria-hidden
                  className="block h-1 w-9 rounded-full bg-white/30"
                />
              </div>
            )}

            {/* Optional header bar */}
            {(title || headerAction) && (
              <header className="flex shrink-0 items-center justify-between gap-3 border-b border-white/[0.06] px-5 py-3">
                <div className="min-w-0 flex-1">
                  {title && (
                    <h2 className="truncate text-[15px] font-semibold tracking-tight text-white">
                      {title}
                    </h2>
                  )}
                </div>
                {headerAction && <div className="shrink-0">{headerAction}</div>}
              </header>
            )}

            {/* Content */}
            <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4" data-lenis-prevent>
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body,
  )
}
