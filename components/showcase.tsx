'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Reveal } from '@/components/reveal'
import { registry, getEntryHref } from '@/components/showcase/registry'
import { cn } from '@/lib/utils'

const CATEGORIES: Record<string, string> = {
  form: 'Form',
  data: 'Data',
  ui: 'UI',
  motion: 'Motion',
  navigation: 'Navigation',
  card: 'Card',
  layout: 'Layout',
  overlay: 'Overlay',
  cursor: 'Cursor',
  background: 'Background',
}

const categoryOrder = ['form', 'data', 'ui', 'motion', 'navigation', 'background', 'overlay', 'cursor', 'card', 'layout']

export function Showcase() {
  const available = registry.filter((e) => e.kind === 'ready' || e.kind === 'docs')
  const grouped = categoryOrder
    .map((cat) => ({
      key: cat,
      label: CATEGORIES[cat] ?? cat,
      items: available.filter((e) => e.category === cat),
    }))
    .filter((g) => g.items.length > 0)

  return (
    <section id="showcase" className="relative overflow-hidden bg-black py-32 sm:py-40">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent"
      />

      <div className="mx-auto max-w-6xl px-6">
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-medium uppercase tracking-[0.18em] text-white/40">
              Showcase
            </p>
            <h2 className="mt-4 text-balance text-4xl font-semibold tracking-tight text-white sm:text-5xl">
              {available.length} components and growing.
            </h2>
            <p className="mt-5 text-pretty text-white/60">
              Browse the full library. Every component is production-ready, animated,
              and fully documented with live demos.
            </p>
          </div>
        </Reveal>

        <div className="mt-20 space-y-12">
          {grouped.map((group, gi) => (
            <Reveal key={group.key} delay={gi * 60}>
              <div>
                <h3 className="mb-4 text-xs font-medium uppercase tracking-[0.18em] text-white/40">
                  {group.label}
                </h3>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {group.items.map((entry) => {
                    const href = getEntryHref(entry)
                    const desc = entry.description

                    return (
                      <Link
                        key={entry.slug}
                        href={href ?? '/components'}
                        className={cn(
                          'group relative flex flex-col gap-1.5 rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 transition-all duration-200',
                          'hover:border-white/15 hover:bg-white/[0.04]',
                        )}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-white">
                            <span className="mr-1.5 text-white/30">
                              {entry.id}
                            </span>
                            {entry.name}
                          </span>
                          <ArrowRight className="h-3.5 w-3.5 text-white/20 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-white/50" />
                        </div>
                        {desc && (
                          <p className="line-clamp-2 text-xs leading-relaxed text-white/40">
                            {desc}
                          </p>
                        )}
                      </Link>
                    )
                  })}
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={200}>
          <div className="mt-16 text-center">
            <Link
              href="/components"
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-6 py-3 text-sm font-medium text-white transition-all hover:border-white/20 hover:bg-white/[0.08]"
            >
              Browse all components
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
