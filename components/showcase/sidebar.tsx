'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Box, ChevronDown, Heart } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useFavorites } from '@/hooks/use-favorites'
import { getEntryHref, registry, type RegistryEntry } from './registry'
import { SidebarSkeleton } from './sidebar-skeleton'

export function Sidebar() {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    // Defer one frame so the skeleton renders before the real list swaps in,
    // giving a smooth perceived load when first entering /components.
    const id = requestAnimationFrame(() => setReady(true))
    return () => cancelAnimationFrame(id)
  }, [])

  if (!ready) return <SidebarSkeleton />
  return <SidebarContent />
}

function SidebarContent() {
  const pathname = usePathname()
  const { favorites } = useFavorites()
  const favCount = favorites.length
  const favoritesActive = pathname === '/components/favorites'

  return (
    <div className="flex animate-page-in flex-col gap-6">
      <button
        type="button"
        disabled
        className="inline-flex w-fit items-center gap-1.5 text-sm font-medium text-white/70"
      >
        Sorted by Id
        <ChevronDown className="h-3.5 w-3.5 text-white/40" strokeWidth={2.25} />
      </button>

      <ul className="flex flex-col">
        <li>
          <Link
            href="/components"
            className="group flex items-center gap-3 py-1.5"
          >
            <span
              className={cn(
                'h-px shrink-0 transition-all duration-m3-enter ease-m3-enter',
                pathname === '/components'
                  ? 'w-12 bg-white'
                  : 'w-7 bg-white/20 group-hover:w-11 group-hover:bg-white/70'
              )}
            />
            <span
              className={cn(
                'text-sm font-medium transition-colors duration-m3-enter ease-m3-enter',
                pathname === '/components'
                  ? 'text-white'
                  : 'text-white/80 group-hover:text-white'
              )}
            >
              All Components
            </span>
          </Link>
        </li>
        <li>
          <Link
            href="/components/favorites"
            className="group flex items-center gap-3 py-1.5"
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
          </Link>
        </li>

        <li aria-hidden className="my-2 h-px bg-white/[0.06]" />

        {registry.map((entry) => {
          const href = getEntryHref(entry)
          return (
            <SidebarItem
              key={entry.slug}
              entry={entry}
              href={href}
              active={href !== null && pathname === href}
            />
          )
        })}
      </ul>
    </div>
  )
}

function SidebarItem({
  entry,
  href,
  active,
}: {
  entry: RegistryEntry
  href: string | null
  active: boolean
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
      <Link
        href={href}
        className="group flex items-center gap-3 py-1.5"
      >
        {inner}
      </Link>
    </li>
  )
}
