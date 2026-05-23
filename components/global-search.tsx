'use client'

/**
 * <GlobalSearch />
 *
 * The site-wide ⌘K palette. Mount it anywhere on the page (we put it
 * in the navbar). It renders a tiny trigger button + a portal-mounted
 * modal that filters the showcase registry as the user types and
 * navigates to the picked component on Enter.
 *
 * Behaviour:
 *   ⌘K / Ctrl+K  → toggle open
 *   Esc          → close
 *   ↑ / ↓        → move highlight (with wraparound)
 *   Enter        → navigate to highlighted result + close
 *   Click result → same as Enter
 *
 * Matching: case-insensitive substring search across `name`, `slug`,
 * `description`, and the friendly category label. Results are grouped
 * by category with the same labels the sidebar uses.
 */

import * as React from 'react'
import { createPortal } from 'react-dom'
import { useRouter, usePathname } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, CornerDownLeft, Search, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  getEntryHref,
  registry,
  type RegistryEntry,
} from '@/components/showcase/registry'

// ---------------------------------------------------------------------------
// Category labels — same as the sidebar so results group identically.
// ---------------------------------------------------------------------------

const CATEGORY_LABEL: Record<string, string> = {
  form: 'Form & Input',
  overlay: 'Overlay',
  card: 'Cards',
  data: 'Data',
  layout: 'Layout',
  navigation: 'Navigation',
  hero: 'Hero',
  section: 'Sections',
  pricing: 'Pricing',
  footer: 'Footers',
  text: 'Text Effects',
  motion: 'Motion',
  scroll: 'Scroll',
  cursor: 'Cursor',
  'gsap-section': 'GSAP Sections',
  background: 'Backgrounds',
  decoration: 'Decoration',
  ui: 'UI Primitives',
}

const CATEGORY_ORDER: readonly string[] = [
  'form',
  'overlay',
  'card',
  'data',
  'layout',
  'navigation',
  'hero',
  'section',
  'pricing',
  'footer',
  'text',
  'motion',
  'scroll',
  'cursor',
  'gsap-section',
  'background',
  'decoration',
  'ui',
] as const

// ---------------------------------------------------------------------------
// Trigger button — keeps the modal mounting concern local.
// ---------------------------------------------------------------------------

/**
 * Render this exactly ONCE per page — it owns the modal state and a
 * global ⌘K keydown listener. Mounting it twice (e.g. one desktop +
 * one mobile copy) means two opens at once and only one closes when
 * you pick a result. The trigger is responsive on its own.
 */
export function GlobalSearch() {
  const [open, setOpen] = React.useState(false)
  const [isMac, setIsMac] = React.useState(false)
  const pathname = usePathname()

  React.useEffect(() => {
    if (typeof navigator !== 'undefined') {
      setIsMac(/Mac|iPod|iPhone|iPad/.test(navigator.platform))
    }
  }, [])

  // Close on route change — covers any code path that navigates while
  // open (result click, in-app link, browser back, etc.).
  React.useEffect(() => {
    setOpen(false)
  }, [pathname])

  // Global keyboard listener — ⌘K / Ctrl+K toggle, Esc close.
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase()
      if (k === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((o) => !o)
      } else if (k === 'escape' && open) {
        e.preventDefault()
        setOpen(false)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Search the library"
        className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-2 py-1.5 text-sm text-white/70 transition-colors hover:bg-white/[0.08] hover:text-white md:px-3"
      >
        <Search className="h-3.5 w-3.5" />
        <span className="hidden md:inline">Search…</span>
        <kbd className="hidden items-center gap-0.5 rounded border border-white/10 bg-black/40 px-1.5 py-0.5 font-mono text-[10px] text-white/55 md:inline-flex">
          {isMac ? '⌘' : 'Ctrl'} K
        </kbd>
      </button>

      <SearchPalette open={open} setOpen={setOpen} />
    </>
  )
}

// ---------------------------------------------------------------------------
// Modal — separate so we can portal-mount it above everything.
// ---------------------------------------------------------------------------

function SearchPalette({
  open,
  setOpen,
}: {
  open: boolean
  setOpen: (v: boolean) => void
}) {
  const router = useRouter()
  const inputRef = React.useRef<HTMLInputElement>(null)
  const listRef = React.useRef<HTMLDivElement>(null)
  const [query, setQuery] = React.useState('')
  const [activeIdx, setActiveIdx] = React.useState(0)

  // Reset query + focus the input on open, restore body scroll on close.
  React.useEffect(() => {
    if (open) {
      setQuery('')
      setActiveIdx(0)
      const t = window.setTimeout(() => inputRef.current?.focus(), 30)
      // Lock body scroll while open so the page doesn't drift behind.
      document.body.style.overflow = 'hidden'
      return () => {
        window.clearTimeout(t)
        document.body.style.overflow = ''
      }
    }
  }, [open])

  // Filter + group the registry against the query.
  const groups = React.useMemo(() => {
    const q = query.trim().toLowerCase()
    const matches = registry.filter((e) => {
      if (!q) return true
      const label = CATEGORY_LABEL[e.category] ?? e.category
      const hay = [
        e.name,
        e.slug,
        (e as { description?: string }).description ?? '',
        e.category,
        label,
      ]
        .join(' ')
        .toLowerCase()
      return hay.includes(q)
    })
    // Group by category, preserve canonical order.
    const byCategory = new Map<string, RegistryEntry[]>()
    for (const m of matches) {
      const list = byCategory.get(m.category) ?? []
      list.push(m)
      byCategory.set(m.category, list)
    }
    return Array.from(byCategory.entries())
      .sort(([a], [b]) => {
        const ai = CATEGORY_ORDER.indexOf(a)
        const bi = CATEGORY_ORDER.indexOf(b)
        if (ai === -1 && bi === -1) return a.localeCompare(b)
        if (ai === -1) return 1
        if (bi === -1) return -1
        return ai - bi
      })
      .map(([category, entries]) => ({
        category,
        label: CATEGORY_LABEL[category] ?? category,
        entries,
      }))
  }, [query])

  // Flat list of selectable results (skip "soon" entries with no href).
  const flatResults = React.useMemo(() => {
    const list: { entry: RegistryEntry; href: string }[] = []
    for (const group of groups) {
      for (const entry of group.entries) {
        const href = getEntryHref(entry)
        if (href) list.push({ entry, href })
      }
    }
    return list
  }, [groups])

  // Clamp the active index when the result set shrinks.
  React.useEffect(() => {
    setActiveIdx((i) => Math.max(0, Math.min(i, flatResults.length - 1)))
  }, [flatResults.length])

  // Scroll the active result into view.
  React.useEffect(() => {
    if (!open) return
    const id = `bahrawy-search-result-${activeIdx}`
    const el = document.getElementById(id)
    el?.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
  }, [activeIdx, open])

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIdx((i) => (i + 1) % Math.max(1, flatResults.length))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIdx(
        (i) => (i - 1 + Math.max(1, flatResults.length)) % Math.max(1, flatResults.length),
      )
    } else if (e.key === 'Enter') {
      e.preventDefault()
      const pick = flatResults[activeIdx]
      if (pick) {
        router.push(pick.href)
        setOpen(false)
      }
    }
  }

  // Build a quick index → entry map so each result row knows its global
  // index without us re-walking the groups during render.
  let runningIdx = 0

  if (typeof document === 'undefined') return null

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          key="search-overlay"
          className="fixed inset-0 z-[100] flex items-start justify-center px-4 pt-[14vh] sm:pt-[18vh]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
        >
          {/* Backdrop */}
          <button
            type="button"
            aria-label="Close search"
            className="absolute inset-0 bg-black/70 backdrop-blur-md"
            onClick={() => setOpen(false)}
          />

          {/* Panel */}
          <motion.div
            key="search-panel"
            role="dialog"
            aria-modal="true"
            aria-label="Search components"
            className="relative w-full max-w-xl overflow-hidden rounded-2xl border border-white/10 bg-zinc-950/95 shadow-2xl shadow-black/60"
            initial={{ y: -10, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: -6, opacity: 0, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 380, damping: 28 }}
          >
            {/* Search input row */}
            <div className="flex items-center gap-3 border-b border-white/10 px-4">
              <Search className="h-4 w-4 shrink-0 text-white/50" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={onKey}
                placeholder="Search components, sections, text effects…"
                className="h-14 w-full bg-transparent text-base text-white placeholder:text-white/40 focus:outline-none"
                aria-label="Search query"
              />
              {query && (
                <button
                  type="button"
                  aria-label="Clear search"
                  onClick={() => setQuery('')}
                  className="rounded-full p-1.5 text-white/45 transition-colors hover:bg-white/[0.06] hover:text-white"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
              <button
                type="button"
                aria-label="Close"
                onClick={() => setOpen(false)}
                className="rounded-md border border-white/10 px-1.5 py-0.5 font-mono text-[10px] text-white/55 transition-colors hover:bg-white/[0.06] hover:text-white"
              >
                ESC
              </button>
            </div>

            {/* Results list */}
            <div
              ref={listRef}
              className="max-h-[60vh] overflow-y-auto px-2 py-2"
              data-lenis-prevent
            >
              {flatResults.length === 0 ? (
                <p className="px-3 py-10 text-center text-sm text-white/50">
                  No matches for{' '}
                  <span className="font-mono text-white/80">
                    &quot;{query}&quot;
                  </span>
                  .
                </p>
              ) : (
                groups.map((group) => (
                  <div key={group.category} className="mb-2 last:mb-0">
                    <p className="px-3 pb-1 pt-2 text-[10px] font-medium uppercase tracking-[0.22em] text-white/35">
                      {group.label}
                    </p>
                    <ul>
                      {group.entries.map((entry) => {
                        const href = getEntryHref(entry)
                        if (!href) {
                          return (
                            <li
                              key={entry.slug}
                              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-white/30"
                            >
                              <span className="font-mono text-xs text-white/20">
                                {entry.id}
                              </span>
                              <span className="flex-1 truncate">
                                {entry.name}
                              </span>
                              <span className="rounded-md border border-white/10 px-1.5 py-0.5 text-[10px] uppercase tracking-wider text-white/30">
                                soon
                              </span>
                            </li>
                          )
                        }
                        const idx = runningIdx++
                        const active = idx === activeIdx
                        return (
                          <li key={entry.slug}>
                            <button
                              id={`bahrawy-search-result-${idx}`}
                              type="button"
                              onMouseEnter={() => setActiveIdx(idx)}
                              onClick={() => {
                                router.push(href)
                                setOpen(false)
                              }}
                              className={cn(
                                'group flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors',
                                active
                                  ? 'bg-white/[0.08] text-white'
                                  : 'text-white/75 hover:bg-white/[0.04] hover:text-white',
                              )}
                            >
                              <span
                                className={cn(
                                  'font-mono text-xs tabular-nums',
                                  active ? 'text-white/65' : 'text-white/35',
                                )}
                              >
                                {entry.id}
                              </span>
                              <span className="flex-1 truncate font-medium">
                                {entry.name}
                              </span>
                              <span
                                className={cn(
                                  'hidden truncate text-xs sm:block',
                                  active ? 'text-white/55' : 'text-white/35',
                                )}
                              >
                                {(entry as { description?: string })
                                  .description?.slice(0, 60)}
                              </span>
                              <ArrowRight
                                className={cn(
                                  'h-3.5 w-3.5 shrink-0 transition-opacity',
                                  active ? 'opacity-90' : 'opacity-0',
                                )}
                              />
                            </button>
                          </li>
                        )
                      })}
                    </ul>
                  </div>
                ))
              )}
            </div>

            {/* Footer with keyboard hints */}
            <div className="flex items-center justify-between gap-3 border-t border-white/10 bg-black/40 px-4 py-2 text-[10px] text-white/45">
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center gap-1.5">
                  <kbd className="rounded border border-white/10 bg-black/60 px-1.5 py-0.5 font-mono text-[10px] text-white/65">
                    ↑↓
                  </kbd>
                  navigate
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <kbd className="inline-flex items-center gap-1 rounded border border-white/10 bg-black/60 px-1.5 py-0.5 font-mono text-[10px] text-white/65">
                    <CornerDownLeft className="h-2.5 w-2.5" />
                  </kbd>
                  open
                </span>
              </div>
              <span className="tabular-nums">
                {flatResults.length} of {registry.length}
              </span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  )
}
