'use client'

/**
 * <CmdBar />  (Raycast-style command palette)
 *
 * The existing <CommandPalette /> is shadcn-flat. This is the upgrade:
 * a two-column layout with a filterable list on the left and a live
 * preview pane on the right. As the user arrow-keys through results,
 * the preview swaps to show context for the highlighted item — its
 * description, metadata, and any custom preview node you pass in.
 *
 * Open / close, search input, ↑↓ navigation, Enter to fire the
 * item's onSelect, Esc to close. Portal-mounted so it overlays
 * everything.
 */

import * as React from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { CornerDownLeft, Search, X } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface CmdBarItem {
  id: string
  /** Shown in the left list. */
  label: React.ReactNode
  /** Optional secondary label (e.g. category, path) shown beside it. */
  hint?: React.ReactNode
  /** Optional icon for the left list. */
  icon?: React.ReactNode
  /** Body shown in the preview pane when this item is highlighted. */
  preview?: React.ReactNode
  /** Optional metadata pairs in the preview footer. */
  meta?: { label: string; value: React.ReactNode }[]
  /** Keywords for filtering (in addition to label + hint). */
  keywords?: string[]
  /** Fires on Enter or click. */
  onSelect?: () => void
}

export interface CmdBarGroup {
  label?: string
  items: CmdBarItem[]
}

export interface CmdBarProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  groups: CmdBarGroup[]
  /** Placeholder text in the search input. */
  placeholder?: string
  /** Empty-state copy. */
  emptyMessage?: React.ReactNode
  /** Accent color for the highlighted-row pill + Enter chip. */
  accent?: string
}

function strFromNode(n: React.ReactNode): string {
  if (n == null || typeof n === 'boolean') return ''
  if (typeof n === 'string' || typeof n === 'number') return String(n)
  if (Array.isArray(n)) return n.map(strFromNode).join(' ')
  if (typeof n === 'object' && 'props' in (n as { props?: unknown })) {
    return strFromNode((n as { props: { children?: React.ReactNode } }).props.children)
  }
  return ''
}

export function CmdBar({
  open,
  onOpenChange,
  groups,
  placeholder = 'Search commands…',
  emptyMessage = 'No matches.',
  accent = '#A78BFA',
}: CmdBarProps) {
  const [query, setQuery] = React.useState('')
  const [activeIdx, setActiveIdx] = React.useState(0)
  const inputRef = React.useRef<HTMLInputElement>(null)
  const listRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    if (open) {
      setQuery('')
      setActiveIdx(0)
      const t = window.setTimeout(() => inputRef.current?.focus(), 30)
      const original = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      return () => {
        window.clearTimeout(t)
        document.body.style.overflow = original
      }
    }
  }, [open])

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase()
    return groups
      .map((g) => ({
        label: g.label,
        items: g.items.filter((it) => {
          if (!q) return true
          const hay = [
            strFromNode(it.label),
            strFromNode(it.hint),
            ...(it.keywords ?? []),
          ]
            .join(' ')
            .toLowerCase()
          return hay.includes(q)
        }),
      }))
      .filter((g) => g.items.length > 0)
  }, [groups, query])

  const flat = React.useMemo(() => filtered.flatMap((g) => g.items), [filtered])

  React.useEffect(() => {
    setActiveIdx((i) => Math.max(0, Math.min(i, Math.max(0, flat.length - 1))))
  }, [flat.length])

  React.useEffect(() => {
    if (!open) return
    const el = document.getElementById(`cmd-bar-item-${activeIdx}`)
    el?.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
  }, [activeIdx, open])

  React.useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        onOpenChange(false)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onOpenChange])

  const onInputKey = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIdx((i) => (i + 1) % Math.max(1, flat.length))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIdx(
        (i) => (i - 1 + Math.max(1, flat.length)) % Math.max(1, flat.length),
      )
    } else if (e.key === 'Enter') {
      e.preventDefault()
      const pick = flat[activeIdx]
      if (pick) {
        pick.onSelect?.()
        onOpenChange(false)
      }
    }
  }

  if (typeof document === 'undefined') return null
  const current = flat[activeIdx]
  let runningIdx = 0

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          key="cmdbar-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          className="fixed inset-0 z-[150] flex items-start justify-center px-4 pt-[10vh] sm:pt-[14vh]"
        >
          <button
            type="button"
            aria-label="Close"
            onClick={() => onOpenChange(false)}
            className="absolute inset-0 bg-black/70 backdrop-blur-md"
          />

          <motion.div
            key="cmdbar-panel"
            role="dialog"
            aria-modal="true"
            initial={{ y: -10, opacity: 0, scale: 0.97 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: -6, opacity: 0, scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 380, damping: 28 }}
            className="relative grid w-full max-w-3xl grid-cols-[1fr_280px] overflow-hidden rounded-2xl border border-white/10 bg-zinc-950/95 shadow-2xl shadow-black/60"
            style={{ height: 460 }}
          >
            {/* Left column — search + list */}
            <div className="flex min-h-0 flex-col border-r border-white/[0.06]">
              {/* Search */}
              <div className="flex items-center gap-3 border-b border-white/10 px-4">
                <Search className="h-4 w-4 shrink-0 text-white/50" />
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={onInputKey}
                  placeholder={placeholder}
                  className="h-12 w-full bg-transparent text-[14px] text-white placeholder:text-white/40 focus:outline-none"
                />
                {query && (
                  <button
                    type="button"
                    onClick={() => setQuery('')}
                    aria-label="Clear"
                    className="rounded-full p-1 text-white/45 transition-colors hover:bg-white/[0.06] hover:text-white"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>

              {/* List */}
              <div
                ref={listRef}
                className="flex-1 overflow-y-auto px-2 py-2"
                data-lenis-prevent
              >
                {flat.length === 0 ? (
                  <p className="px-3 py-10 text-center text-sm text-white/45">
                    {emptyMessage}
                  </p>
                ) : (
                  filtered.map((group, gi) => (
                    <div key={gi} className="mb-2 last:mb-0">
                      {group.label && (
                        <p className="px-3 pb-1 pt-1 text-[9.5px] font-medium uppercase tracking-[0.22em] text-white/35">
                          {group.label}
                        </p>
                      )}
                      <ul>
                        {group.items.map((item) => {
                          const idx = runningIdx++
                          const active = idx === activeIdx
                          return (
                            <li key={item.id}>
                              <button
                                id={`cmd-bar-item-${idx}`}
                                type="button"
                                onMouseEnter={() => setActiveIdx(idx)}
                                onClick={() => {
                                  item.onSelect?.()
                                  onOpenChange(false)
                                }}
                                className={cn(
                                  'group relative flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-[12.5px] transition-colors',
                                  active
                                    ? 'text-white'
                                    : 'text-white/70 hover:bg-white/[0.04] hover:text-white',
                                )}
                              >
                                {active && (
                                  <motion.span
                                    layoutId="cmd-bar-active"
                                    className="absolute inset-0 rounded-lg"
                                    style={{
                                      background: `${accent}1f`,
                                      border: `1px solid ${accent}33`,
                                    }}
                                    transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                                  />
                                )}
                                {item.icon && (
                                  <span className="relative inline-flex h-4 w-4 shrink-0 items-center justify-center [&>svg]:h-4 [&>svg]:w-4">
                                    {item.icon}
                                  </span>
                                )}
                                <span className="relative min-w-0 flex-1 truncate font-medium">
                                  {item.label}
                                </span>
                                {item.hint && (
                                  <span className="relative shrink-0 text-[11px] text-white/40">
                                    {item.hint}
                                  </span>
                                )}
                              </button>
                            </li>
                          )
                        })}
                      </ul>
                    </div>
                  ))
                )}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between gap-3 border-t border-white/10 bg-black/30 px-4 py-2 text-[10px] text-white/45">
                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center gap-1.5">
                    <Kbd>↑↓</Kbd>
                    navigate
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Kbd>
                      <CornerDownLeft className="h-2.5 w-2.5" />
                    </Kbd>
                    select
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Kbd>esc</Kbd>
                    close
                  </span>
                </div>
                <span className="tabular-nums">{flat.length}</span>
              </div>
            </div>

            {/* Right column — preview pane */}
            <div className="relative flex min-h-0 flex-col bg-white/[0.012]">
              <AnimatePresence mode="wait" initial={false}>
                {current ? (
                  <motion.div
                    key={current.id}
                    initial={{ opacity: 0, x: 6 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -6 }}
                    transition={{ duration: 0.16, ease: [0.22, 1, 0.36, 1] }}
                    className="flex h-full flex-col p-4"
                  >
                    <div className="flex items-center gap-2.5">
                      {current.icon && (
                        <span
                          className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-white/85 [&>svg]:h-3.5 [&>svg]:w-3.5"
                          style={{ background: `${accent}1f`, border: `1px solid ${accent}33` }}
                        >
                          {current.icon}
                        </span>
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[12.5px] font-semibold tracking-tight text-white">
                          {current.label}
                        </p>
                        {current.hint && (
                          <p className="truncate text-[10.5px] text-white/45">
                            {current.hint}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Preview body */}
                    <div className="mt-3 min-h-0 flex-1 overflow-auto rounded-lg border border-white/[0.06] bg-white/[0.02] p-3">
                      {current.preview ?? (
                        <p className="text-[11.5px] leading-relaxed text-white/55">
                          No additional preview for this action.
                        </p>
                      )}
                    </div>

                    {/* Meta footer */}
                    {current.meta && current.meta.length > 0 && (
                      <ul className="mt-3 divide-y divide-white/[0.05] rounded-md border border-white/[0.06] bg-white/[0.02]">
                        {current.meta.map((m, i) => (
                          <li
                            key={i}
                            className="flex items-center justify-between gap-3 px-2.5 py-1.5 text-[10.5px]"
                          >
                            <span className="text-white/40">{m.label}</span>
                            <span className="truncate font-mono text-white/75">
                              {m.value}
                            </span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </motion.div>
                ) : (
                  <div
                    key="empty"
                    className="flex h-full items-center justify-center p-6 text-center text-[11.5px] text-white/40"
                  >
                    Highlight a command to preview it.
                  </div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  )
}

function Kbd({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="inline-flex items-center gap-0.5 rounded border border-white/10 bg-black/40 px-1.5 py-0.5 font-mono text-[9.5px] text-white/65">
      {children}
    </kbd>
  )
}
