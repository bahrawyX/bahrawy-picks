'use client'

import { useState } from 'react'
import {
  Atom,
  Boxes,
  Braces,
  CreditCard,
  Layers,
  Layout,
  LifeBuoy,
  Newspaper,
  Search,
  Sparkles,
  Triangle,
  Wind,
  Zap,
} from 'lucide-react'
import { MegaNav, type MegaNavItem } from '@/components/bahrawy/mega-nav'
import { CodeBlock } from '@/components/showcase/code-block'
import { DocsPage, DocsSection, DemoCard } from '@/components/showcase/docs-page'
import {
  ControlPanel,
  SelectControl,
  SliderControl,
} from '@/components/showcase/control-panel'

/* ------------------------------------------------------------------ */
/*  Demo items                                                         */
/* ------------------------------------------------------------------ */

const ITEMS: MegaNavItem[] = [
  {
    label: 'Components',
    sections: [
      {
        heading: 'Form',
        links: [
          { label: 'Phone Input', description: 'International with formatting.', icon: <Layout className="h-3.5 w-3.5" /> },
          { label: 'OTP Input', description: 'Six-digit one-time codes.', icon: <Layout className="h-3.5 w-3.5" /> },
          { label: 'Date Range', description: 'Two-month picker, presets.', icon: <Layout className="h-3.5 w-3.5" /> },
        ],
      },
      {
        heading: 'Motion',
        links: [
          { label: 'Scroll Rail', description: 'Horizontal scroll on vertical input.', icon: <Sparkles className="h-3.5 w-3.5" /> },
          { label: 'Pinned Story', description: '4-step cinematic narrative.', icon: <Sparkles className="h-3.5 w-3.5" /> },
          { label: 'Text Reveal', description: 'Word, char, or line entrance.', icon: <Sparkles className="h-3.5 w-3.5" /> },
        ],
      },
      {
        heading: 'Data',
        links: [
          { label: 'Data Table', description: 'TanStack-powered.', icon: <Layers className="h-3.5 w-3.5" /> },
          { label: 'Sparkline', description: 'Tiny SVG line chart.', icon: <Layers className="h-3.5 w-3.5" /> },
          { label: 'Stat Card', description: 'Number + delta + sparkline.', icon: <Layers className="h-3.5 w-3.5" /> },
        ],
      },
      {
        heading: 'Layout',
        links: [
          { label: 'Bento Grid', description: 'Mixed-size feature grid.', icon: <Boxes className="h-3.5 w-3.5" /> },
          { label: 'Card Stack', description: 'Sticky cards on scroll.', icon: <Boxes className="h-3.5 w-3.5" /> },
          { label: 'Mega Nav', description: 'This component.', icon: <Boxes className="h-3.5 w-3.5" /> },
        ],
      },
    ],
  },
  {
    label: 'Templates',
    sections: [
      {
        heading: 'Marketing',
        links: [
          { label: 'Landing', description: 'Hero, features, pricing, footer.', icon: <Triangle className="h-3.5 w-3.5" /> },
          { label: 'Changelog', description: 'Versioned timeline of releases.', icon: <Triangle className="h-3.5 w-3.5" /> },
        ],
      },
      {
        heading: 'App',
        links: [
          { label: 'Dashboard', description: 'Stats + charts + tables.', icon: <Atom className="h-3.5 w-3.5" /> },
          { label: 'Kanban', description: 'Drop-in task board.', icon: <Atom className="h-3.5 w-3.5" /> },
        ],
      },
    ],
    promo: (
      <a
        href="#"
        className="flex h-full flex-col justify-between gap-3 rounded-xl border border-white/10 bg-gradient-to-br from-violet-500/15 via-cyan-500/10 to-transparent p-4 transition-colors hover:from-violet-500/25"
      >
        <div className="flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-[0.18em] text-violet-300">
          <Sparkles className="h-3 w-3" />
          New
        </div>
        <div>
          <p className="text-sm font-semibold text-white">Bahrawy Studio</p>
          <p className="mt-1 text-xs leading-relaxed text-white/65">
            A starter kit assembling every template into one shippable Next.js app.
          </p>
        </div>
        <span className="text-xs font-medium text-violet-300">Open kit →</span>
      </a>
    ),
  },
  {
    label: 'Pricing',
    sections: [
      {
        heading: 'Plans',
        links: [
          { label: 'Free', description: 'Everything for personal use.', icon: <Wind className="h-3.5 w-3.5" /> },
          { label: 'Pro', description: 'Premium blocks + lifetime updates.', icon: <Zap className="h-3.5 w-3.5" /> },
          { label: 'Team', description: 'Five seats + Slack channel.', icon: <Braces className="h-3.5 w-3.5" /> },
        ],
      },
      {
        heading: 'Includes',
        links: [
          { label: 'All 99 components' },
          { label: 'Figma source files' },
          { label: 'Lifetime updates (Pro)' },
        ],
      },
    ],
  },
  {
    label: 'Docs',
    href: '#docs',
  },
  {
    label: 'Community',
    sections: [
      {
        heading: 'Connect',
        links: [
          { label: 'GitHub', description: 'Source, issues, PRs.', icon: <Newspaper className="h-3.5 w-3.5" />, external: true },
          { label: 'Discord', description: 'Live channels with the team.', icon: <LifeBuoy className="h-3.5 w-3.5" />, external: true },
        ],
      },
      {
        heading: 'Read',
        links: [
          { label: 'Changelog' },
          { label: 'Roadmap' },
          { label: 'Brand kit' },
        ],
      },
    ],
  },
]

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function MegaNavDocs() {
  const [position, setPosition] = useState<'sticky' | 'fixed' | 'relative'>('sticky')
  const [scrollThreshold, setScrollThreshold] = useState(24)

  const SNIPPET = `import { MegaNav } from '@/components/bahrawy/mega-nav'

const items = [
  {
    label: 'Components',
    sections: [
      { heading: 'Form',   links: [{ label: 'Phone Input', href: '/phone-input' }] },
      { heading: 'Motion', links: [{ label: 'Text Reveal', href: '/text-reveal' }] },
    ],
  },
  { label: 'Docs', href: '/docs' },
]

<MegaNav
  logo="Bahrawy"
  items={items}
  position="${position}"
  scrollThreshold={${scrollThreshold}}
  actions={
    <>
      <button>Search</button>
      <a href="/sign-in">Sign in</a>
    </>
  }
/>`

  return (
    <DocsPage
      title="Mega Nav"
      slug="mega-nav"
      description="A floating top navigation bar with a frosted-glass backdrop and hover-driven mega-menus. Backdrop deepens on scroll, content crossfades when moving between items, mobile collapses to a stacked sheet."
      category="98 · navigation"
    >
      <DocsSection
        title="Live demo"
        description="Hover Components / Templates / Pricing / Community to drop the mega-menu. Scroll down to watch the backdrop deepen."
      >
        <DemoCard className="min-h-[520px] items-stretch overflow-hidden p-0">
          <div className="relative h-full w-full">
            <MegaNav
              logo="Bahrawy"
              items={ITEMS}
              position="relative"
              scrollThreshold={scrollThreshold}
              actions={
                <>
                  <button
                    type="button"
                    aria-label="Search"
                    className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-white/85 transition-colors hover:bg-white/[0.08] hover:text-white"
                  >
                    <Search className="h-3.5 w-3.5" />
                  </button>
                  <a
                    href="#"
                    className="inline-flex items-center rounded-full bg-white px-3.5 py-1.5 text-xs font-semibold text-black transition-colors hover:bg-white/90"
                  >
                    Sign in
                    <CreditCard className="ml-1.5 h-3 w-3" />
                  </a>
                </>
              }
            />
            <div className="mx-auto max-w-3xl px-6 py-16 text-center">
              <p className="text-xs font-medium uppercase tracking-[0.22em] text-white/40">
                Page content below the bar
              </p>
              <p className="mt-3 text-balance text-base leading-relaxed text-white/55">
                Hover a menu item with sections to drop the mega-menu. Swap between menus
                — the surface stays open and the content crossfades. Press Escape to close.
              </p>
            </div>
          </div>
        </DemoCard>

        <ControlPanel>
          <SelectControl
            label="Position"
            value={position}
            onChange={(v) => setPosition(v as 'sticky' | 'fixed' | 'relative')}
            options={[
              { label: 'sticky', value: 'sticky' },
              { label: 'fixed', value: 'fixed' },
              { label: 'relative', value: 'relative' },
            ]}
          />
          <SliderControl
            label="Scroll thresh"
            value={scrollThreshold}
            onChange={setScrollThreshold}
            min={0}
            max={120}
            step={4}
            unit="px"
          />
        </ControlPanel>
      </DocsSection>

      <DocsSection title="Usage">
        <CodeBlock code={SNIPPET} language="tsx" />
      </DocsSection>

      <DocsSection title="Props">
        <ul className="grid gap-2 sm:grid-cols-2">
          {[
            ['logo', 'ReactNode — wordmark / SVG / anything.'],
            ['items', 'MegaNavItem[] — { label, href?, sections?, promo? }. Items with sections drop a mega-menu on hover.'],
            ['actions', 'Right-side slot. Pass any nodes (search button, sign-in link, cart, etc.).'],
            ['position', '"sticky" | "fixed" | "relative". Default "sticky".'],
            ['scrollThreshold', 'Px scrolled before the backdrop deepens. Default 24.'],
            ['className', 'Extra classes on the outer header.'],
          ].map(([n, b]) => (
            <li key={n} className="rounded-lg border border-white/10 bg-white/[0.02] p-3">
              <code className="font-mono text-xs text-white">{n}</code>
              <p className="mt-1 text-xs text-white/60">{b}</p>
            </li>
          ))}
        </ul>
      </DocsSection>

      <DocsSection title="How the motion works">
        <ul className="grid gap-2 sm:grid-cols-2">
          {[
            ['Frosted bar', 'A motion.div under the bar animates background-color + backdrop-filter between two "blur depths" — light at the top of the page, deeper once scrolled past `scrollThreshold`.'],
            ['Drawer height', 'The mega-menu wrapper uses framer-motion `{ height: "auto" }` so different menus with different content heights smoothly retarget when you hover between them.'],
            ['Content crossfade', 'An inner `AnimatePresence mode="wait"` keyed by the active index fades the menu contents in/out while the outer surface stays open. Reads as one continuous drawer, not flicker.'],
            ['Grace window', 'On mouse-leave a 120 ms timeout queues the close so cursor "gaps" between trigger and panel don\'t snap it shut. Entering either re-opens it.'],
            ['Mobile sheet', 'Under md, the desktop nav hides and a single Menu button toggles a stacked drawer with `<details>` rows — every section visible inline, no two-step nav.'],
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
          {['framer-motion', 'lucide-react'].map((d) => (
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
