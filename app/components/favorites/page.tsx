'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { ArrowRight, Heart, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { FavoriteButton } from '@/components/favorite-button'
import { useFavorites } from '@/hooks/use-favorites'
import { registry, type RegistryEntry } from '@/components/showcase/registry'

// Anything we can actually link to — i.e. has a real demo page.
type LinkableEntry = Extract<RegistryEntry, { kind: 'ready' | 'docs' }>

// Category-tinted accents — kept in lockstep with the /components grid.
const CATEGORY_ACCENT: Record<string, string> = {
  form: '#22D3EE',
  overlay: '#A78BFA',
  card: '#F472B6',
  data: '#34D399',
  layout: '#60A5FA',
  navigation: '#FBBF24',
  hero: '#FB923C',
  section: '#A78BFA',
  pricing: '#F472B6',
  footer: '#94A3B8',
  text: '#22D3EE',
  motion: '#A78BFA',
  scroll: '#34D399',
  cursor: '#F472B6',
  'gsap-section': '#FB923C',
  background: '#60A5FA',
  decoration: '#FBBF24',
  ui: '#94A3B8',
}

export default function FavoritesPage() {
  const { favorites } = useFavorites()
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    setHydrated(true)
  }, [])

  // Show every favorited entry that has a real page — both `ready`
  // and `docs` kinds. (Previously this filtered to `ready` only,
  // which excluded ~99% of the library and made it look like
  // favorites was eating cards.)
  const entries = registry.filter(
    (e): e is LinkableEntry =>
      (e.kind === 'ready' || e.kind === 'docs') &&
      favorites.includes(e.slug),
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

// ---------------------------------------------------------------------------
// Card — renders a ready entry's <Thumbnail /> when one exists, falls
// back to a category-tinted preview for docs entries.
// ---------------------------------------------------------------------------

function FavoriteCard({ entry }: { entry: LinkableEntry }) {
  const Thumb = entry.kind === 'ready' ? entry.Thumbnail : undefined
  const accent = CATEGORY_ACCENT[entry.category] ?? '#A78BFA'

  return (
    <article className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] transition-all duration-m3-enter ease-m3-enter hover:border-white/25 hover:bg-white/[0.04]">
      {/* Heart sits outside the Link so we don't nest interactives */}
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
          {Thumb ? (
            <Thumb />
          ) : (
            <PreviewFallback name={entry.name} accent={accent} />
          )}
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
              {entry.dependencies.length === 0 && (
                <span className="self-center text-[10px] text-white/40">
                  no deps
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

// ---------------------------------------------------------------------------
// Preview fallback — category-tinted radial gradient + dot grid + name,
// same look as the /components grid so favorites match visually.
// ---------------------------------------------------------------------------

function PreviewFallback({ name, accent }: { name: string; accent: string }) {
  return (
    <div
      className="relative flex h-full w-full items-center justify-center overflow-hidden p-6"
      style={{
        background: `radial-gradient(120% 100% at 30% 20%, ${accent}33 0%, transparent 60%), radial-gradient(120% 100% at 80% 90%, ${accent}1a 0%, transparent 55%), #0a0a0a`,
      }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            'radial-gradient(rgba(255,255,255,0.08) 1px, transparent 1px)',
          backgroundSize: '18px 18px',
          maskImage:
            'radial-gradient(70% 60% at 50% 50%, black 0%, transparent 80%)',
          WebkitMaskImage:
            'radial-gradient(70% 60% at 50% 50%, black 0%, transparent 80%)',
        }}
      />
      <span
        className="relative text-center text-2xl font-semibold tracking-tight text-white/90 sm:text-3xl"
        style={{ textShadow: `0 0 24px ${accent}55` }}
      >
        {name}
      </span>
    </div>
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
