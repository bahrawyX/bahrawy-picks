'use client'

/**
 * <FloatingToolbar />  —  Notion/Linear-style selection action bar.
 *
 * Watches the text selection inside a wrapped editable surface
 * (passed via `targetRef`, or the surrounding container by default).
 * When the user highlights text, a vibrancy pill toolbar floats
 * above the selection. The pill auto-flips to below the selection
 * if there's no room above. Click any action → it fires with the
 * current selected text. Closes when selection is cleared / scrolls
 * away.
 *
 * Apple aesthetics: 14px corner radius, vibrancy `backdrop-blur-2xl`,
 * multi-layer shadow, SF indigo accent, group-divider hairlines,
 * tap-scale on buttons.
 */

import * as React from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { cn } from '@/lib/utils'

export interface FloatingToolbarAction {
  id: string
  /** Icon (e.g. <Bold className="h-3.5 w-3.5" />). */
  icon?: React.ReactNode
  /** Label (shown if no icon, or in tooltip). */
  label: string
  /** If true, render a vertical divider before this action. */
  divider?: boolean
  /** Whether the action is currently in an "on" state (toggle highlight). */
  active?: boolean
  /** Fires with the selected text + selection rect. */
  onClick?: (selectedText: string, rect: DOMRect) => void
}

export interface FloatingToolbarProps {
  actions: FloatingToolbarAction[]
  /** Container the toolbar listens to for selections. Defaults to document. */
  targetRef?: React.RefObject<HTMLElement | null>
  /** Distance in px above the selection. Default 10. */
  offset?: number
  /** Accent for `active` actions. Default SF indigo. */
  accent?: string
  /** Optional minimum selection length before showing. Default 1. */
  minLength?: number
  className?: string
}

const APPLE_SPRING = { type: 'spring' as const, stiffness: 480, damping: 32, mass: 0.55 }

export function FloatingToolbar({
  actions,
  targetRef,
  offset = 10,
  accent = '#5E5CE6',
  minLength = 1,
  className,
}: FloatingToolbarProps) {
  const [pos, setPos] = React.useState<{
    x: number
    y: number
    flipped: boolean
    text: string
    rect: DOMRect
  } | null>(null)
  const toolbarRef = React.useRef<HTMLDivElement>(null)

  const compute = React.useCallback(() => {
    const sel = window.getSelection()
    if (!sel || sel.isCollapsed) {
      setPos(null)
      return
    }
    const text = sel.toString()
    if (text.trim().length < minLength) {
      setPos(null)
      return
    }
    if (targetRef?.current) {
      // Ensure selection is inside target
      const anchorNode = sel.anchorNode
      if (anchorNode && !targetRef.current.contains(anchorNode)) {
        setPos(null)
        return
      }
    }
    const range = sel.getRangeAt(0)
    const rect = range.getBoundingClientRect()
    if (rect.width === 0 && rect.height === 0) {
      setPos(null)
      return
    }
    // Estimate toolbar size
    const tbWidth = toolbarRef.current?.offsetWidth ?? 240
    const tbHeight = toolbarRef.current?.offsetHeight ?? 36

    let flipped = false
    let y = rect.top + window.scrollY - tbHeight - offset
    if (y - window.scrollY < 8) {
      y = rect.bottom + window.scrollY + offset
      flipped = true
    }
    let x = rect.left + window.scrollX + rect.width / 2 - tbWidth / 2
    const minX = 8 + window.scrollX
    const maxX = window.innerWidth + window.scrollX - tbWidth - 8
    if (x < minX) x = minX
    if (x > maxX) x = maxX

    setPos({ x, y, flipped, text, rect })
  }, [minLength, offset, targetRef])

  React.useEffect(() => {
    const onUp = () => {
      // selection finalised on mouseup / keyup
      setTimeout(compute, 0)
    }
    const onScroll = () => {
      if (!pos) return
      compute()
    }
    document.addEventListener('mouseup', onUp)
    document.addEventListener('keyup', onUp)
    window.addEventListener('scroll', onScroll, true)
    window.addEventListener('resize', onScroll)
    return () => {
      document.removeEventListener('mouseup', onUp)
      document.removeEventListener('keyup', onUp)
      window.removeEventListener('scroll', onScroll, true)
      window.removeEventListener('resize', onScroll)
    }
  }, [compute, pos])

  // Escape dismisses the toolbar (and drops the selection so it doesn't
  // immediately re-show on keyup).
  React.useEffect(() => {
    if (!pos) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setPos(null)
        window.getSelection()?.removeAllRanges()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [pos])

  // Close on outside click of the toolbar (but selection itself is fine)
  React.useEffect(() => {
    if (!pos) return
    const onDown = (e: MouseEvent) => {
      if (toolbarRef.current?.contains(e.target as Node)) return
      // If clicking inside the target ref, selection is changing — let onUp handle it.
      if (targetRef?.current?.contains(e.target as Node)) return
      setPos(null)
      window.getSelection()?.removeAllRanges()
    }
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [pos, targetRef])

  if (typeof document === 'undefined') return null

  return createPortal(
    <AnimatePresence>
      {pos && (
        <motion.div
          ref={toolbarRef}
          role="toolbar"
          aria-label="Selection actions"
          initial={{
            opacity: 0,
            scale: 0.9,
            y: pos.flipped ? -6 : 6,
          }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{
            opacity: 0,
            scale: 0.94,
            y: pos.flipped ? -4 : 4,
          }}
          transition={APPLE_SPRING}
          style={{
            position: 'absolute',
            top: pos.y,
            left: pos.x,
            zIndex: 220,
            // Don't let dragging on the toolbar start a fresh text selection
            // that would compete with the one we're displaying actions for.
            userSelect: 'none',
            WebkitUserSelect: 'none',
          }}
          // Critical: keep the underlying text selection alive while the user
          // clicks toolbar buttons. Without this, mousedown on a button
          // collapses the selection → mouseup → compute() finds nothing →
          // toolbar unmounts before the button's onClick ever fires.
          onMouseDown={(e) => e.preventDefault()}
          onPointerDown={(e) => e.preventDefault()}
          className={cn(
            'flex items-center gap-0.5 rounded-[14px] border border-white/[0.08] p-1',
            className,
          )}
        >
          {/* Vibrancy background */}
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

          {/* Caret pointing toward selection */}
          <span
            aria-hidden
            className="absolute left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 border border-white/[0.08]"
            style={{
              top: pos.flipped ? -4 : undefined,
              bottom: pos.flipped ? undefined : -4,
              background: pos.flipped
                ? 'linear-gradient(135deg, rgba(40,40,46,0.85) 0%, rgba(40,40,46,0.85) 50%, transparent 50%)'
                : 'linear-gradient(315deg, rgba(22,22,26,0.9) 0%, rgba(22,22,26,0.9) 50%, transparent 50%)',
              backdropFilter: 'blur(40px) saturate(180%)',
              WebkitBackdropFilter: 'blur(40px) saturate(180%)',
              borderTop: pos.flipped ? '0.5px solid rgba(255,255,255,0.08)' : 'none',
              borderLeft: pos.flipped ? '0.5px solid rgba(255,255,255,0.08)' : 'none',
              borderRight: pos.flipped ? 'none' : '0.5px solid rgba(255,255,255,0.08)',
              borderBottom: pos.flipped ? 'none' : '0.5px solid rgba(255,255,255,0.08)',
            }}
          />

          {actions.map((action, i) => (
            <React.Fragment key={action.id}>
              {action.divider && i > 0 && (
                <span
                  aria-hidden
                  className="relative mx-0.5 h-5 w-px bg-white/[0.08]"
                />
              )}
              <motion.button
                type="button"
                // Belt-and-suspenders: even though the root toolbar already
                // calls preventDefault, some browsers still try to focus the
                // <button> on mousedown and that focus shift can clear the
                // selection. Stop it here too.
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => {
                  if (pos) action.onClick?.(pos.text, pos.rect)
                }}
                whileTap={{ scale: 0.9 }}
                transition={APPLE_SPRING}
                className={cn(
                  'relative inline-flex h-7 items-center justify-center gap-1 rounded-[8px] px-2 text-[12px] font-medium tracking-tight transition-colors',
                  action.active
                    ? 'text-white'
                    : 'text-white/75 hover:bg-white/[0.08] hover:text-white',
                )}
                style={
                  action.active
                    ? {
                        background: `linear-gradient(180deg, ${accent}40 0%, ${accent}26 100%)`,
                        boxShadow: `0 1px 0 rgba(255,255,255,0.08) inset, 0 0 0 0.5px ${accent}55`,
                      }
                    : undefined
                }
                aria-label={action.label}
                title={action.label}
              >
                {action.icon ? (
                  <span className="inline-flex [&>svg]:h-3.5 [&>svg]:w-3.5">
                    {action.icon}
                  </span>
                ) : (
                  <span>{action.label}</span>
                )}
              </motion.button>
            </React.Fragment>
          ))}
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  )
}
