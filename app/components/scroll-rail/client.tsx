'use client'

import { useState } from 'react'
import { ArrowUpRight } from 'lucide-react'
import { ScrollRail } from '@/components/bahrawy/scroll-rail'
import { CodeBlock } from '@/components/showcase/code-block'
import { DocsPage, DocsSection } from '@/components/showcase/docs-page'
import {
  ControlPanel,
  SliderControl,
  ToggleControl,
} from '@/components/showcase/control-panel'

/* ------------------------------------------------------------------ */
/*  Demo content                                                       */
/* ------------------------------------------------------------------ */

const CARDS = [
  {
    eyebrow: '01 · Craft',
    title: 'Made by hand.',
    body: 'Every component is composed from first principles — type, rhythm, motion. Nothing arbitrary.',
    img: 'https://images.unsplash.com/photo-1604871000636-074fa5117945?w=1000&q=80&auto=format&fit=crop',
  },
  {
    eyebrow: '02 · Motion',
    title: 'Spring into life.',
    body: 'Spring physics on every interaction — the difference between a UI you use and one you feel.',
    img: 'https://images.unsplash.com/photo-1518806118471-f28b20a1d79d?w=1000&q=80&auto=format&fit=crop',
  },
  {
    eyebrow: '03 · Refine',
    title: 'Pixel-perfect.',
    body: 'The polish you would have applied last is the polish you get on day one.',
    img: 'https://images.unsplash.com/photo-1493246507139-91e8fad9978e?w=1000&q=80&auto=format&fit=crop',
  },
  {
    eyebrow: '04 · Ship',
    title: 'Ready for the world.',
    body: 'Production-tested in dark, in light, across browsers, on devices. Move fast without breaking taste.',
    img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=1000&q=80&auto=format&fit=crop',
  },
  {
    eyebrow: '05 · Open',
    title: 'Copy. Paste. Own.',
    body: 'No npm install per component. Drop the source into your project and tune every line.',
    img: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=1000&q=80&auto=format&fit=crop',
  },
  {
    eyebrow: '06 · Quiet',
    title: 'No noise. No bloat.',
    body: 'Minimal dependencies, no analytics, no callbacks home. Just the code, the way you want it.',
    img: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=1000&q=80&auto=format&fit=crop',
  },
  {
    eyebrow: '07 · Composed',
    title: 'Plays well with others.',
    body: 'Built on shadcn primitives and Tailwind. Drop a Bahrawy component into any React + Next project.',
    img: 'https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?w=1000&q=80&auto=format&fit=crop',
  },
]

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function ScrollRailDocs() {
  const [scrollLength, setScrollLength] = useState(3)
  const [gap, setGap] = useState(24)
  const [showProgress, setShowProgress] = useState(true)

  const snippet = `import { ScrollRail } from '@/components/bahrawy/scroll-rail'

<ScrollRail scrollLength={${scrollLength}} gap={${gap}} showProgress={${showProgress}}>
  {items.map((item) => (
    <div key={item.id} className="h-[60vh] w-[70vw] max-w-[640px]">
      {/* your card */}
    </div>
  ))}
</ScrollRail>`

  return (
    <DocsPage
      title="Scroll Rail"
      slug="scroll-rail"
      description="A pinned section whose children live in a horizontal track and glide left as the page scrolls down. The travel is auto-measured so the last card always lands flush at the right edge, and the motion is spring-smoothed so it feels analog — not frame-locked to scroll."
      category="78 · scroll"
    >
      <DocsSection
        title="Live demo"
        description="Scroll down the page. The rail of cards below pins and slides horizontally for the duration of the scroll section."
      >
        <ControlPanel>
          <SliderControl
            label="Length"
            value={scrollLength}
            onChange={setScrollLength}
            min={1.5}
            max={5}
            step={0.25}
            unit="×vh"
          />
          <SliderControl
            label="Gap"
            value={gap}
            onChange={setGap}
            min={8}
            max={64}
            step={2}
            unit="px"
          />
          <ToggleControl
            label="Progress"
            checked={showProgress}
            onChange={setShowProgress}
          />
        </ControlPanel>

        <p className="text-xs text-white/40">↓ Scroll into the rail.</p>
      </DocsSection>

      {/* The rail itself — full-bleed inside the page */}
      <ScrollRail
        scrollLength={scrollLength}
        gap={gap}
        showProgress={showProgress}
      >
        {CARDS.map((card, i) => (
          <article
            key={i}
            className="relative flex h-[64vh] w-[72vw] max-w-[640px] shrink-0 flex-col justify-end overflow-hidden rounded-3xl border border-white/10 bg-zinc-900 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.7)]"
          >
            <img
              src={card.img}
              alt={card.title}
              className="absolute inset-0 h-full w-full object-cover opacity-80"
              draggable={false}
            />
            <div
              aria-hidden
              className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent"
            />
            <div className="relative z-10 p-8 sm:p-10">
              <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-white/70">
                {card.eyebrow}
              </p>
              <h3 className="mt-3 text-balance text-3xl font-semibold leading-tight tracking-tight text-white sm:text-4xl">
                {card.title}
              </h3>
              <p className="mt-3 max-w-md text-sm leading-relaxed text-white/75 sm:text-base">
                {card.body}
              </p>
              <a
                href="#"
                onClick={(e) => e.preventDefault()}
                className="mt-5 inline-flex items-center gap-1.5 text-xs font-medium text-white/90 underline-offset-4 hover:underline"
              >
                Read more
                <ArrowUpRight className="h-3.5 w-3.5" />
              </a>
            </div>
          </article>
        ))}
      </ScrollRail>

      <div className="h-24" aria-hidden />

      <DocsSection title="Usage">
        <CodeBlock code={snippet} language="tsx" />
      </DocsSection>

      <DocsSection title="Props">
        <ul className="grid gap-2 sm:grid-cols-2">
          {[
            ['children', 'Any JSX — rendered as a single horizontal row.'],
            ['scrollLength', 'Pin duration in viewport heights. Default 3.'],
            ['gap', 'Gap between items in px. Default 24.'],
            ['startPadding', 'CSS length before the first item. Default "8vw".'],
            ['endPadding', 'CSS length after the last item. Default "8vw".'],
            ['stiffness', 'Spring stiffness on the rail motion. Default 140.'],
            ['damping', 'Spring damping on the rail motion. Default 30.'],
            ['showProgress', 'Show a thin horizontal progress bar. Default true.'],
            ['backgroundClassName', 'Tailwind bg class on the section. Default bg-zinc-950.'],
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
