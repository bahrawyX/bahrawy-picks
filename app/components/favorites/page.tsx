'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { ArrowRight, Heart, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { FavoriteButton } from '@/components/favorite-button'
import { useFavorites } from '@/hooks/use-favorites'
import { registry } from '@/components/showcase/registry'

type ReadyEntry = Extract<(typeof registry)[number], { kind: 'ready' }>

export default function FavoritesPage() {
  const { favorites } = useFavorites()
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    setHydrated(true)
  }, [])

  const entries = registry.filter(
    (e): e is ReadyEntry => e.kind === 'ready' && favorites.includes(e.slug)
  )
  const count = entries.length

  return (
    <article className="flex flex-col gap-10">
      <header>
        <p className="text-xs uppercase tracking-[0.2em] text-white/40">
          Bookmarked
        </p>
        <h1 className="mt-2 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
          Your Favorites
        </h1>
        <p className="mt-3 text-sm text-white/60">
          {hydrated
            ? count === 0
              ? 'Nothing saved yet — click the heart on any component to keep it here.'
              : `${count} component${count === 1 ? '' : 's'} saved.`
            : 'Loading your saved components…'}
        </p>
      </header>

      {!hydrated ? (
        <FavoritesSkeleton />
      ) : count === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid gap-5 sm:grid-cols-2">
          {entries.map((entry) => (
            <FavoriteCard key={entry.slug} entry={entry} />
          ))}
        </div>
      )}
    </article>
  )
}

function FavoriteCard({ entry }: { entry: ReadyEntry }) {
  const Thumb = entry.Thumbnail

  return (
    <article className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] transition-all duration-m3-enter ease-m3-enter hover:border-white/25 hover:bg-white/[0.04]">
      {/* Heart overlays the whole card — placed outside the Link to avoid nested interactives */}
      <div className="absolute right-3 top-3 z-20">
        <FavoriteButton
          slug={entry.slug}
          size="sm"
          className="border-white/15 bg-black/55 backdrop-blur-md hover:bg-black/70"
        />
      </div>

      <Link href={`/components/${entry.slug}`} className="block">
        {/* Thumbnail / preview */}
        <div className="relative aspect-[16/9] overflow-hidden border-b border-white/10 bg-black">
          {Thumb ? <Thumb /> : <ThumbnailFallback />}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black via-black/40 to-transparent"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-transparent via-transparent to-white/[0.04] opacity-0 transition-opacity duration-m3-enter ease-m3-enter group-hover:opacity-100"
          />
        </div>

        {/* Info */}
        <div className="relative p-5">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[11px] text-white/40 tabular-nums">
              {entry.id}
            </span>
            <span className="text-white/20">·</span>
            <span className="text-[11px] uppercase tracking-[0.18em] text-white/40">
              {entry.category}
            </span>
          </div>
          <h3 className="mt-2 text-lg font-semibold tracking-tight text-white">
            {entry.name}
          </h3>
          <p className="mt-1.5 line-clamp-2 text-sm text-white/55">
            {entry.description}
          </p>

          <div className="mt-5 flex items-center justify-between gap-3">
            <div className="flex flex-wrap gap-1.5">
              {entry.dependencies.slice(0, 2).map((dep) => (
                <code
                  key={dep}
                  className="rounded-md border border-white/10 bg-white/[0.04] px-1.5 py-0.5 font-mono text-[10px] text-white/60"
                >
                  {dep}
                </code>
              ))}
              {entry.dependencies.length > 2 && (
                <span className="self-center text-[10px] text-white/40">
                  +{entry.dependencies.length - 2}
                </span>
              )}
            </div>
            <span className="inline-flex items-center gap-1 text-xs font-medium text-white/60 transition-colors duration-m3-enter ease-m3-enter group-hover:text-white">
              View
              <ArrowRight className="h-3 w-3 transition-transform duration-m3-enter ease-m3-enter group-hover:translate-x-0.5" />
            </span>
          </div>
        </div>
      </Link>
    </article>
  )
}

function ThumbnailFallback() {
  return (
    <div className="absolute inset-0 bg-gradient-to-br from-white/[0.05] via-transparent to-white/[0.02]" />
  )
}

function EmptyState() {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] px-6 py-16 text-center">
      <div className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/[0.04]">
        <Heart className="h-5 w-5 text-white/40" strokeWidth={1.5} />
      </div>
      <h2 className="mt-5 text-lg font-semibold text-white">No favorites yet</h2>
      <p className="mx-auto mt-2 max-w-sm text-sm text-white/50">
        Browse the library and tap the heart on anything you want to come back
        to.
      </p>
      <Button asChild size="sm" className="mt-6 gap-2">
        <Link href="/components">
          <Sparkles className="h-3.5 w-3.5" />
          Browse components
        </Link>
      </Button>
    </div>
  )
}

function FavoritesSkeleton() {
  return (
    <div className="grid animate-pulse gap-5 sm:grid-cols-2">
      {Array.from({ length: 2 }).map((_, i) => (
        <div
          key={i}
          className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02]"
        >
          <div className="aspect-[16/9] border-b border-white/10 bg-white/[0.04]" />
          <div className="space-y-3 p-5">
            <div className="h-3 w-32 rounded-full bg-white/10" />
            <div className="h-5 w-40 rounded-md bg-white/10" />
            <div className="h-3 w-full max-w-xs rounded-full bg-white/[0.07]" />
            <div className="mt-4 flex justify-between">
              <div className="h-5 w-16 rounded-md bg-white/[0.06]" />
              <div className="h-4 w-12 rounded-md bg-white/[0.06]" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
