'use client'

import {
  CardStackScroll,
  type CardStackItem,
} from '@/components/bahrawy/card-stack-scroll'
import { CodeBlock } from '@/components/showcase/code-block'
import { DocsPage, DocsSection } from '@/components/showcase/docs-page'

/* ------------------------------------------------------------------ */
/*  Curated demo content                                               */
/* ------------------------------------------------------------------ */

const CARDS: CardStackItem[] = [
  {
    id: 'craft',
    eyebrow: 'Craft',
    title: 'Build with intent.\nEvery detail, considered.',
    body: 'Components composed from first principles — type, rhythm, motion. Nothing arbitrary.',
    background:
      'linear-gradient(135deg, #064E3B 0%, #0F766E 45%, #1E3A8A 100%)',
    meta: 'Atelier · 2025',
  },
  {
    id: 'motion',
    eyebrow: 'Motion',
    title: 'Spring into life.',
    body: 'Spring physics on every interaction — the difference between a UI you use and one you feel.',
    background:
      'linear-gradient(135deg, #1E1B4B 0%, #4338CA 40%, #7C3AED 100%)',
    meta: 'Framer Motion',
  },
  {
    id: 'refine',
    eyebrow: 'Refine',
    title: 'Pixel-perfect,\nby default.',
    body: 'The polish you would have applied last is the polish you get on day one.',
    background:
      'linear-gradient(135deg, #7F1D1D 0%, #C2410C 50%, #B45309 100%)',
    meta: 'Tailwind · React 19',
  },
  {
    id: 'ship',
    eyebrow: 'Ship',
    title: 'Ready for the world.',
    body: 'Production-tested in dark, in light, across browsers, on devices. Move fast without breaking taste.',
    background:
      'linear-gradient(135deg, #18181B 0%, #27272A 50%, #3F3F46 100%)',
    meta: 'Open source · MIT',
  },
]

/* ------------------------------------------------------------------ */
/*  Snippets                                                           */
/* ------------------------------------------------------------------ */

const SNIPPET = `import { CardStackScroll } from '@/components/bahrawy/card-stack-scroll'

const cards = [
  {
    id: 'craft',
    eyebrow: 'Craft',
    title: 'Build with intent.',
    body: 'Components composed from first principles.',
    background: 'linear-gradient(135deg, #064E3B 0%, #1E3A8A 100%)',
  },
  // ... more cards
]

<CardStackScroll cards={cards} />`

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function CardStackScrollDocs() {
  return (
    <DocsPage
      title="Card Stack Scroll"
      slug="card-stack-scroll"
      description="Sticky-stacked cards that layer over each other as you scroll. Each card scales gently as the next one slides up on top — the deck deepens as you go. Built with framer-motion's scroll progress, GPU-only transforms."
      category="79 · scroll"
    >
      <DocsSection
        title="Live demo"
        description="Scroll. The cards stack. The earlier ones shrink behind the later ones."
      >
        <p className="text-xs text-white/40">
          ↓ enter the stack
        </p>
      </DocsSection>

      <CardStackScroll cards={CARDS} />

      {/* Breathing room so the last card's exit feels intentional */}
      <div className="h-32" />

      <DocsSection title="Usage">
        <CodeBlock code={SNIPPET} language="tsx" />
      </DocsSection>

      <DocsSection title="Props">
        <ul className="grid gap-2 sm:grid-cols-2">
          {[
            ['cards', 'CardStackItem[] — id, title, body, background, image, meta, cta…'],
            ['topOffset', 'px from top where the first card pins. Default 80.'],
            ['topStep', 'px added per card index. >0 fans the deck. Default 0.'],
            ['scaleStep', 'how much each preceding card shrinks. Default 0.05.'],
            ['sectionVh', 'height of each scroll section in vh. Default 100.'],
            ['backgroundClassName', 'page bg between cards. Default bg-zinc-950.'],
          ].map(([name, body]) => (
            <li
              key={name}
              className="rounded-lg border border-white/10 bg-white/[0.02] p-3"
            >
              <code className="font-mono text-xs text-white">{name}</code>
              <p className="mt-1 text-xs text-white/60">{body}</p>
            </li>
          ))}
        </ul>
      </DocsSection>

      <DocsSection title="Dependencies">
        <div className="flex flex-wrap gap-2">
          {['framer-motion'].map((d) => (
            <code
              key={d}
              className="rounded-md border border-white/10 bg-white/[0.04] px-2 py-1 font-mono text-xs text-white/80"
            >
              {d}
            </code>
          ))}
        </div>
      </DocsSection>
    </DocsPage>
  )
}
