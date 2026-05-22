'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import * as React from 'react'
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  useTransition,
} from 'react'
import { useRouter } from 'next/navigation'
import { Box, ChevronDown, Heart } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useFavorites } from '@/hooks/use-favorites'
import { getEntryHref, registry, type RegistryEntry } from './registry'
import { SidebarSkeleton } from './sidebar-skeleton'

// ---------------------------------------------------------------------------
// Categorisation — group the long flat list by purpose. Display order
// is hand-tuned so the most-reached-for primitives sit at the top and
// the heavy "section" / GSAP work sits at the bottom.
// ---------------------------------------------------------------------------

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

interface SidebarGroup {
  category: string
  label: string
  entries: RegistryEntry[]
}

function groupRegistryByCategory(entries: RegistryEntry[]): SidebarGroup[] {
  const map = new Map<string, RegistryEntry[]>()
  for (const e of entries) {
    const list = map.get(e.category) ?? []
    list.push(e)
    map.set(e.category, list)
  }
  return Array.from(map.entries())
    .sort(([a], [b]) => {
      const ai = CATEGORY_ORDER.indexOf(a)
      const bi = CATEGORY_ORDER.indexOf(b)
      if (ai === -1 && bi === -1) return a.localeCompare(b)
      if (ai === -1) return 1
      if (bi === -1) return -1
      return ai - bi
    })
    .map(([category, list]) => ({
      category,
      label: CATEGORY_LABEL[category] ?? category,
      entries: list,
    }))
}

// ---------------------------------------------------------------------------
// Pending navigation context – lets sidebar highlight the *target* link
// IMMEDIATELY on click, before Next.js finishes the navigation.
// ---------------------------------------------------------------------------

const PendingPathContext = createContext<string | null>(null)

export function Sidebar() {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const id = requestAnimationFrame(() => setReady(true))
    return () => cancelAnimationFrame(id)
  }, [])

  if (!ready) return <SidebarSkeleton />
  return <SidebarContent />
}

function SidebarContent() {
  const pathname = usePathname()
  const router = useRouter()
  const { favorites } = useFavorites()
  const favCount = favorites.length

  const [isPending, startTransition] = useTransition()
  const [pendingPath, setPendingPath] = useState<string | null>(null)

  // Clear pending state when the actual pathname catches up
  useEffect(() => {
    setPendingPath(null)
  }, [pathname])

  /** Navigate with instant visual feedback */
  const navigate = useCallback(
    (href: string) => {
      if (href === pathname) return
      setPendingPath(href)
      startTransition(() => {
        router.push(href)
      })
    },
    [pathname, router, startTransition]
  )

  // The path to treat as "active" — either the pending target or the real pathname
  const displayPath = pendingPath ?? pathname

  const favoritesActive = displayPath === '/components/favorites'
  const allActive = displayPath === '/components'

  const groups = React.useMemo(() => groupRegistryByCategory(registry), [])

  return (
    <PendingPathContext.Provider value={pendingPath}>
      <div className="flex flex-col gap-5">
        <button
          type="button"
          disabled
          className="inline-flex w-fit items-center gap-1.5 text-sm font-medium text-white/70"
        >
          Grouped by type
          <ChevronDown className="h-3.5 w-3.5 text-white/40" strokeWidth={2.25} />
        </button>

        {/* Top-level shortcuts — All Components + Favorites */}
        <ul className="flex flex-col">
          <li>
            <button
              type="button"
              onClick={() => navigate('/components')}
              className="group flex w-full items-center gap-3 py-1.5 text-left"
            >
              <span
                className={cn(
                  'h-px shrink-0 transition-all duration-m3-enter ease-m3-enter',
                  allActive
                    ? 'w-12 bg-white'
                    : 'w-7 bg-white/20 group-hover:w-11 group-hover:bg-white/70'
                )}
              />
              <span
                className={cn(
                  'text-sm font-medium transition-colors duration-m3-enter ease-m3-enter',
                  allActive
                    ? 'text-white'
                    : 'text-white/80 group-hover:text-white'
                )}
              >
                All Components
              </span>
            </button>
          </li>
          <li>
            <button
              type="button"
              onClick={() => navigate('/components/favorites')}
              className="group flex w-full items-center gap-3 py-1.5 text-left"
            >
              <span
                className={cn(
                  'h-px shrink-0 transition-all duration-m3-enter ease-m3-enter',
                  favoritesActive
                    ? 'w-12 bg-rose-400'
                    : 'w-7 bg-white/20 group-hover:w-11 group-hover:bg-rose-300/80'
                )}
              />
              <span
                className={cn(
                  'inline-flex items-center gap-1.5 text-sm font-medium transition-colors duration-m3-enter ease-m3-enter',
                  favoritesActive
                    ? 'text-white'
                    : 'text-white/80 group-hover:text-white'
                )}
              >
                <Heart
                  className={cn(
                    'h-3.5 w-3.5 transition-all duration-m3-enter ease-m3-enter',
                    favoritesActive || favCount > 0
                      ? 'fill-rose-500 text-rose-500'
                      : 'text-white/50 group-hover:text-rose-300'
                  )}
                  strokeWidth={1.75}
                />
                Favorites
              </span>
              {favCount > 0 && (
                <span
                  className={cn(
                    'ml-auto rounded-full border px-1.5 py-0.5 text-[10px] font-medium tabular-nums transition-colors duration-m3-enter ease-m3-enter',
                    favoritesActive
                      ? 'border-rose-400/40 bg-rose-500/15 text-rose-200'
                      : 'border-white/10 bg-white/[0.04] text-white/60'
                  )}
                >
                  {favCount}
                </span>
              )}
            </button>
          </li>
        </ul>

        {/* Categorised groups — each one has a heading + its items */}
        {groups.map((group) => (
          <section key={group.category} className="flex flex-col gap-1">
            <h3 className="mb-0.5 px-0 text-[10px] font-medium uppercase tracking-[0.22em] text-white/35">
              {group.label}
            </h3>
            <ul className="flex flex-col">
              {group.entries.map((entry) => {
                const href = getEntryHref(entry)
                return (
                  <SidebarItem
                    key={entry.slug}
                    entry={entry}
                    href={href}
                    active={href !== null && displayPath === href}
                    onNavigate={navigate}
                  />
                )
              })}
            </ul>
          </section>
        ))}
      </div>
    </PendingPathContext.Provider>
  )
}

function SidebarItem({
  entry,
  href,
  active,
  onNavigate,
}: {
  entry: RegistryEntry
  href: string | null
  active: boolean
  onNavigate: (href: string) => void
}) {
  const isAvailable = entry.kind === 'ready' || entry.kind === 'docs'

  const lineClasses = cn(
    'h-px shrink-0 transition-all duration-m3-enter ease-m3-enter',
    active
      ? 'w-12 bg-white'
      : isAvailable
        ? 'w-6 bg-white/15 group-hover:w-10 group-hover:bg-white/60'
        : 'w-5 bg-white/[0.07]'
  )

  const labelClasses = cn(
    'text-sm transition-colors duration-m3-enter ease-m3-enter',
    active
      ? 'text-white'
      : isAvailable
        ? 'text-white/45 group-hover:text-white'
        : 'text-white/20'
  )

  const idClasses = cn(
    'tabular-nums transition-colors duration-m3-enter ease-m3-enter',
    active ? 'text-white/60' : 'text-white/30'
  )

  const hasOptions =
    (entry.kind === 'ready' || entry.kind === 'docs') && entry.hasOptions

  const inner = (
    <>
      <span className={lineClasses} />
      <span className={labelClasses}>
        <span className={idClasses}>{entry.id}</span> {entry.name}
      </span>
      {isAvailable && hasOptions && (
        <Box
          className={cn(
            'ml-auto h-3.5 w-3.5 transition-colors duration-m3-enter ease-m3-enter',
            active ? 'text-white/70' : 'text-white/25 group-hover:text-white/60'
          )}
          strokeWidth={1.75}
        />
      )}
      {!isAvailable && (
        <span className="ml-auto rounded-md border border-white/10 px-1.5 py-0.5 text-[10px] uppercase tracking-wider text-white/30">
          soon
        </span>
      )}
    </>
  )

  if (!isAvailable || !href) {
    return (
      <li
        aria-disabled
        className="group flex cursor-not-allowed items-center gap-3 py-1.5"
        title="Coming soon"
      >
        {inner}
      </li>
    )
  }

  return (
    <li>
      <button
        type="button"
        onClick={() => onNavigate(href)}
        className="group flex w-full items-center gap-3 py-1.5 text-left"
      >
        {inner}
      </button>
    </li>
  )
}
