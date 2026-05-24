import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import {
  getEntryHref,
  registry,
  type RegistryEntry,
} from '@/components/showcase/registry'

const READY_COUNT = registry.filter((e) => e.kind !== 'soon').length

export const metadata: Metadata = {
  title: 'Components — Browse the library',
  description: `Browse all ${READY_COUNT}+ animated React components in the Bahrawy library. Forms, overlays, scroll effects, GSAP sections, text animations, hero layouts, and more — all copy-paste-ready with Tailwind, Framer Motion, GSAP, and Radix.`,
  alternates: {
    canonical: '/components',
  },
  openGraph: {
    type: 'website',
    url: 'https://bahrawy.me/components',
    title: 'Components — Browse the Bahrawy library',
    description: `Browse all ${READY_COUNT}+ animated React components. Copy, paste, ship.`,
    images: ['/og-image.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Components — Browse the Bahrawy library',
    description: `Browse all ${READY_COUNT}+ animated React components. Copy, paste, ship.`,
    images: ['/og-image.png'],
  },
}

// ---------------------------------------------------------------------------
// Categorisation — same labels + order as the search palette.
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

// Subtle category-tinted gradients used as preview fallbacks.
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

interface SidebarGroup {
  category: string
  label: string
  entries: RegistryEntry[]
}

function groupByCategory(entries: RegistryEntry[]): SidebarGroup[] {
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
    .map(([category, entries]) => ({
      category,
      label: CATEGORY_LABEL[category] ?? category,
      entries,
    }))
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function ComponentsIndex() {
  const groups = groupByCategory(registry)

  return (
    <article className="flex flex-col gap-14">
      <header>
        <p className="text-xs uppercase tracking-[0.2em] text-white/40">
          {registry.length} components
        </p>
        <h1 className="mt-2 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
          The library
        </h1>
        <p className="mt-3 max-w-xl text-pretty text-sm leading-relaxed text-white/60">
          Copy-paste-ready React components for the modern web. Browse by
          category below or hit{' '}
          <kbd className="rounded border border-white/15 bg-white/[0.04] px-1.5 py-0.5 font-mono text-[10px] text-white/80">
            ⌘ K
          </kbd>{' '}
          to search.
        </p>
      </header>

      {groups.map((group) => (
        <section key={group.category} id={group.category} className="scroll-mt-32">
          <div className="mb-5 flex items-baseline justify-between gap-4 border-b border-white/[0.06] pb-3">
            <h2 className="text-base font-semibold tracking-tight text-white">
              {group.label}
            </h2>
            <span className="text-xs tabular-nums text-white/40">
              {group.entries.length}
            </span>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {group.entries.map((entry) => (
              <ComponentCard key={entry.slug} entry={entry} />
            ))}
          </div>
        </section>
      ))}
    </article>
  )
}

// ---------------------------------------------------------------------------
// Individual card — favorite-page style: preview at top, info below.
// ---------------------------------------------------------------------------

function ComponentCard({ entry }: { entry: RegistryEntry }) {
  if (entry.kind === 'soon') return <SoonCard entry={entry} />

  const href = getEntryHref(entry)
  if (!href) return <SoonCard entry={entry} />

  const Thumb = entry.kind === 'ready' ? entry.Thumbnail : undefined
  const accent = CATEGORY_ACCENT[entry.category] ?? '#A78BFA'

  return (
    <Link
      href={href}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] transition-all duration-300 hover:border-white/25 hover:bg-white/[0.04]"
    >
      {/* Preview */}
      <div className="relative aspect-[16/9] overflow-hidden border-b border-white/10 bg-black">
        {Thumb ? <Thumb /> : <PreviewFallback name={entry.name} accent={accent} />}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black via-black/40 to-transparent"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-transparent via-transparent to-white/[0.04] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        />
      </div>

      {/* Info */}
      <div className="relative flex flex-1 flex-col p-5">
        <div className="flex items-center gap-2">
          <span className="font-mono text-[11px] tabular-nums text-white/40">
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

        <div className="mt-auto flex items-center justify-between gap-3 pt-5">
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
          <span className="inline-flex items-center gap-1 text-xs font-medium text-white/60 transition-colors duration-300 group-hover:text-white">
            View
            <ArrowRight className="h-3 w-3 transition-transform duration-300 group-hover:translate-x-0.5" />
          </span>
        </div>
      </div>
    </Link>
  )
}

// ---------------------------------------------------------------------------
// Preview fallback — category-tinted gradient with the component's name
// rendered LARGE so the card still feels like an actual preview, not a
// placeholder.
// ---------------------------------------------------------------------------

function PreviewFallback({ name, accent }: { name: string; accent: string }) {
  return (
    <div
      className="relative flex h-full w-full items-center justify-center overflow-hidden p-6"
      style={{
        background: `radial-gradient(120% 100% at 30% 20%, ${accent}33 0%, transparent 60%), radial-gradient(120% 100% at 80% 90%, ${accent}1a 0%, transparent 55%), #0a0a0a`,
      }}
    >
      {/* Subtle dot grid */}
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
        style={{
          textShadow: `0 0 24px ${accent}55`,
        }}
      >
        {name}
      </span>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Disabled "coming soon" card
// ---------------------------------------------------------------------------

function SoonCard({ entry }: { entry: RegistryEntry }) {
  return (
    <div
      aria-disabled
      className="flex flex-col overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.015] opacity-60"
    >
      <div className="aspect-[16/9] border-b border-white/[0.08] bg-white/[0.02]" />
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center gap-2">
          <span className="font-mono text-[11px] tabular-nums text-white/30">
            {entry.id}
          </span>
          <span className="text-white/15">·</span>
          <span className="text-[11px] uppercase tracking-[0.18em] text-white/30">
            {entry.category}
          </span>
        </div>
        <h3 className="mt-2 text-lg font-semibold tracking-tight text-white/55">
          {entry.name}
        </h3>
        <span className="mt-auto inline-block w-fit rounded-md border border-white/10 px-2 py-0.5 text-[10px] uppercase tracking-wider text-white/40">
          soon
        </span>
      </div>
    </div>
  )
}
