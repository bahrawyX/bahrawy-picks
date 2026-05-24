'use client'

import { TimeDial, type TimeDialChapter } from '@/components/bahrawy/time-dial'
import { CodeBlock } from '@/components/showcase/code-block'
import { DocsPage, DocsSection } from '@/components/showcase/docs-page'

const CHAPTERS: TimeDialChapter[] = [
  {
    id: 'sketch',
    label: '01',
    eyebrow: 'Phase 01 · Sketch',
    title: 'Pencil first.',
    body: "Every motion in the library started life as twenty bad pencil drawings. Most got thrown out.",
    accent: '#F472B6',
    image:
      'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=900&q=80&auto=format&fit=crop',
  },
  {
    id: 'wireframe',
    label: '02',
    eyebrow: 'Phase 02 · Wireframe',
    title: 'Then the cage.',
    body: 'Layout-first wireframes nail rhythm and density. No colors yet — just the bones.',
    accent: '#A78BFA',
  },
  {
    id: 'prototype',
    label: '03',
    eyebrow: 'Phase 03 · Prototype',
    title: 'Move it in code.',
    body: 'A live prototype turns the static into something with springs, lag, and intent.',
    accent: '#22D3EE',
  },
  {
    id: 'polish',
    label: '04',
    eyebrow: 'Phase 04 · Polish',
    title: 'Last 10% is 90%.',
    body: 'Easing curves, accent colors, copy. The work that makes good work feel made by hand.',
    accent: '#34D399',
  },
  {
    id: 'ship',
    label: '05',
    eyebrow: 'Phase 05 · Ship',
    title: 'Out the door.',
    body: 'Production-tested, accessibly checked, documented. Picked up, dropped in, used.',
    accent: '#FBBF24',
  },
]

const SNIPPET = `import { TimeDial } from '@/components/bahrawy/time-dial'

const chapters = [
  { id: 'sketch',    label: '01', title: 'Pencil first.',   body: '…', accent: '#F472B6' },
  { id: 'wireframe', label: '02', title: 'Then the cage.',  body: '…', accent: '#A78BFA' },
  { id: 'prototype', label: '03', title: 'Move it in code.',body: '…', accent: '#22D3EE' },
  // …
]

<TimeDial
  eyebrow="How we build"
  chapters={chapters}
  cta={{ label: 'See the work' }}
  scrollLength={3.5}
  accentColor="#A78BFA"
/>`

export default function TimeDialDocs() {
  return (
    <DocsPage
      title="Time Dial"
      slug="time-dial"
      description="A pinned scroll section built around a giant rotating dial — like the back of a film camera, a museum exhibit selector, or a vintage radio's tuning ring. Chapters sit around the perimeter at evenly-spaced angles; scroll rotates the dial clockwise so each chapter passes under a top pointer, and the content panel on the right crossfades to that chapter's story."
      category="151 · gsap-section"
    >
      <DocsSection
        title="Live demo"
        description="Scroll into the section — the dial spins clockwise, chapter markers pass under the pointer, the content panel on the right swaps in step."
      >
        <p className="text-xs text-white/40">↓ scroll to spin</p>
      </DocsSection>

      <TimeDial
        eyebrow="How we build"
        chapters={CHAPTERS}
        cta={{ label: 'See the work' }}
        scrollLength={3.5}
        accentColor="#A78BFA"
      />

      <div className="h-32" aria-hidden />

      <DocsSection title="Usage">
        <CodeBlock code={SNIPPET} language="tsx" />
      </DocsSection>

      <DocsSection title="How the motion works">
        <ul className="grid gap-2 sm:grid-cols-2">
          {[
            ['Dial rotation', "One scrubbed GSAP tween animates `rotation: 0 → -(N − 1) × 360/N` on the dial container. With 5 chapters that's -288° across the full scroll — each 72° step parks one marker under the top pointer."],
            ['Radial marker layout', "Each chapter marker is positioned with the classic three-transform radial trick: `rotate(θ) translate(0, -r) rotate(-θ)`. The first two place the marker at angle θ on the perimeter; the third counter-rotation keeps the label upright in its resting state. The dial's own rotation animates on top, so labels turn with the dial."],
            ['Static pointer', 'The pointer at 12 o\'clock lives OUTSIDE the rotating wrapper so it stays fixed while the markers rotate beneath it. Same accent color as the dial ring + a `drop-shadow` glow.'],
            ['Tick marks via SVG', "60 ticks rendered in a single inline SVG inside the rotating wrapper. Major ticks fall every 360/N degrees (the chapter positions) and pick up the accent color; minor ticks are softer white."],
            ['Content crossfades', "Chapter panels are absolutely stacked on the right side. The timeline schedules per-transition autoAlpha + y tweens at `i / (N − 1)` so each panel fades out as the next fades in. The very first panel starts visible, the last is the only one onscreen at progress = 1."],
            ['Halo + rings', "A soft radial halo sits behind the dial; outer + middle + inner concentric rings build depth without competing with the markers. Inner disc has a subtle radial gradient to read as polished metal."],
            ['Reduced motion', "All motion is GSAP-driven and scrubbed to scroll — works the same regardless of `prefers-reduced-motion` (the user is in control of the speed)."],
          ].map(([n, b]) => (
            <li key={n} className="rounded-lg border border-white/10 bg-white/[0.02] p-3">
              <code className="font-mono text-xs text-white">{n}</code>
              <p className="mt-1 text-xs text-white/60">{b}</p>
            </li>
          ))}
        </ul>
      </DocsSection>

      <DocsSection title="Props">
        <ul className="grid gap-2 sm:grid-cols-2">
          {[
            ['chapters', 'TimeDialChapter[] — each { id, label, title, body?, eyebrow?, image?, accent? }. Order = clockwise around the dial starting from the pointer.'],
            ['eyebrow', 'Tiny tag rendered at the top of the section.'],
            ['cta', '{ label, href?, onClick? } — final call-to-action that fades in at the end.'],
            ['scrollLength', 'Pin duration in viewport heights. Default 3.5.'],
            ['accentColor', 'Default accent for ring + pointer + markers. Default #A78BFA.'],
            ['className', 'Extra classes on the outer wrapper.'],
          ].map(([n, b]) => (
            <li key={n} className="rounded-lg border border-white/10 bg-white/[0.02] p-3">
              <code className="font-mono text-xs text-white">{n}</code>
              <p className="mt-1 text-xs text-white/60">{b}</p>
            </li>
          ))}
        </ul>
      </DocsSection>

      <DocsSection title="Dependencies">
        <div className="flex flex-wrap gap-2">
          {['gsap', '@gsap/react', 'lucide-react'].map((d) => (
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
