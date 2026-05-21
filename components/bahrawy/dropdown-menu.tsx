'use client'

/**
 * <DropdownMenu />
 *
 * A lightweight animated dropdown. Pass a trigger and a list of items
 * (or separators). Supports keyboard navigation (↑/↓ and Enter), shortcuts,
 * dividers, and intent-colored danger items.
 */

import * as React from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { cn } from '@/lib/utils'

export interface DropdownMenuItem {
  id: string
  label: React.ReactNode
  icon?: React.ReactNode
  shortcut?: string
  onSelect?: () => void
  /** Render a red danger style. */
  danger?: boolean
  disabled?: boolean
}

export type DropdownEntry = DropdownMenuItem | { kind: 'separator'; id?: string }

export interface DropdownMenuProps {
  trigger: React.ReactNode
  items: DropdownEntry[]
  /** Align the menu to the trigger. */
  align?: 'start' | 'end'
  /** Width in px (the menu width). Default 220. */
  width?: number
  className?: string
}

function isItem(e: DropdownEntry): e is DropdownMenuItem {
  return (e as DropdownMenuItem).label !== undefined
}

const SPRING = { type: 'spring' as const, stiffness: 420, damping: 30, mass: 0.7 }

export function DropdownMenu({
  trigger,
  items,
  align = 'start',
  width = 220,
  className,
}: DropdownMenuProps) {
  const [open, setOpen] = React.useState(false)
  const [focusIndex, setFocusIndex] = React.useState(-1)
  const rootRef = React.useRef<HTMLDivElement>(null)
  const enabledIndexes = items
    .map((e, i) => (isItem(e) && !e.disabled ? i : -1))
    .filter((i) => i >= 0)

  // Close on outside click
  React.useEffect(() => {
    if (!open) return
    const onDoc = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [open])

  const onKey = (e: React.KeyboardEvent) => {
    if (!open) return
    if (e.key === 'Escape') setOpen(false)
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault()
      const dir = e.key === 'ArrowDown' ? 1 : -1
      const curIdx = enabledIndexes.indexOf(focusIndex)
      const nextIdx = (curIdx + dir + enabledIndexes.length) % enabledIndexes.length
      setFocusIndex(enabledIndexes[nextIdx])
    }
    if (e.key === 'Enter' && focusIndex >= 0) {
      const it = items[focusIndex]
      if (isItem(it) && !it.disabled) {
        it.onSelect?.()
        setOpen(false)
      }
    }
  }

  return (
    <div
      ref={rootRef}
      onKeyDown={onKey}
      className={cn('relative inline-block', className)}
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="inline-flex"
      >
        {trigger}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            role="menu"
            initial={{ opacity: 0, scale: 0.96, y: -6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -6 }}
            transition={SPRING}
            style={{ width }}
            className={cn(
              'absolute z-50 mt-2 origin-top overflow-hidden rounded-xl border border-white/10 bg-zinc-900/95 p-1 shadow-2xl shadow-black/40 backdrop-blur',
              align === 'end' ? 'right-0' : 'left-0',
            )}
          >
            {items.map((entry, i) => {
              if (!isItem(entry)) {
                return (
                  <div
                    key={entry.id ?? `sep-${i}`}
                    role="separator"
                    className="my-1 h-px bg-white/[0.06]"
                  />
                )
              }
              const focused = focusIndex === i
              return (
                <button
                  key={entry.id}
                  type="button"
                  role="menuitem"
                  disabled={entry.disabled}
                  onMouseEnter={() => setFocusIndex(i)}
                  onClick={() => {
                    if (entry.disabled) return
                    entry.onSelect?.()
                    setOpen(false)
                  }}
                  className={cn(
                    'flex w-full items-center gap-2.5 rounded-md px-2.5 py-1.5 text-left text-sm transition-colors',
                    entry.disabled
                      ? 'cursor-not-allowed text-white/30'
                      : entry.danger
                        ? 'text-rose-300 hover:bg-rose-500/15'
                        : 'text-white/85 hover:bg-white/[0.06]',
                    focused && !entry.disabled && !entry.danger && 'bg-white/[0.06]',
                    focused && entry.danger && 'bg-rose-500/15',
                  )}
                >
                  {entry.icon && (
                    <span className="shrink-0 text-white/60">{entry.icon}</span>
                  )}
                  <span className="min-w-0 flex-1 truncate">{entry.label}</span>
                  {entry.shortcut && (
                    <span className="shrink-0 font-mono text-[10px] text-white/40">
                      {entry.shortcut}
                    </span>
                  )}
                </button>
              )
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
