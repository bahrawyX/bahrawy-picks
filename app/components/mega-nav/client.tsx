'use client'

import { useState } from 'react'
import { Apple, Search, ShoppingBag } from 'lucide-react'
import { MegaNav, type MegaNavItem } from '@/components/bahrawy/mega-nav'
import { CodeBlock } from '@/components/showcase/code-block'
import { DocsPage, DocsSection, DemoCard } from '@/components/showcase/docs-page'
import {
  ControlPanel,
  SelectControl,
  SliderControl,
} from '@/components/showcase/control-panel'

/* ------------------------------------------------------------------ */
/*  Apple-themed demo nav                                              */
/* ------------------------------------------------------------------ */

const ITEMS: MegaNavItem[] = [
  { label: 'Store', href: '#store' },
  {
    label: 'Mac',
    sections: [
      {
        heading: 'Explore Mac',
        links: [
          { label: 'MacBook Air' },
          { label: 'MacBook Pro' },
          { label: 'iMac' },
          { label: 'Mac mini' },
          { label: 'Mac Studio' },
          { label: 'Mac Pro' },
          { label: 'Displays' },
          { label: 'Compare Mac' },
        ],
      },
      {
        heading: 'Shop Mac',
        links: [
          { label: 'Shop Mac' },
          { label: 'Help Me Choose' },
          { label: 'Mac Accessories' },
          { label: 'Apple Trade In' },
          { label: 'Financing' },
        ],
      },
      {
        heading: 'More from Mac',
        links: [
          { label: 'Mac Support' },
          { label: 'AppleCare+ for Mac' },
          { label: 'macOS Sequoia' },
          { label: 'Apps by Apple' },
          { label: 'Continuity' },
          { label: 'iCloud+' },
        ],
      },
    ],
  },
  {
    label: 'iPad',
    sections: [
      {
        heading: 'Explore iPad',
        links: [
          { label: 'iPad Pro' },
          { label: 'iPad Air' },
          { label: 'iPad' },
          { label: 'iPad mini' },
          { label: 'Apple Pencil' },
          { label: 'Compare iPad' },
        ],
      },
      {
        heading: 'Shop iPad',
        links: [
          { label: 'Shop iPad' },
          { label: 'iPad Accessories' },
          { label: 'Apple Trade In' },
          { label: 'Financing' },
        ],
      },
      {
        heading: 'More from iPad',
        links: [
          { label: 'iPad Support' },
          { label: 'AppleCare+ for iPad' },
          { label: 'iPadOS 18' },
          { label: 'iCloud+' },
        ],
      },
    ],
  },
  {
    label: 'iPhone',
    sections: [
      {
        heading: 'Explore iPhone',
        links: [
          { label: 'iPhone 15 Pro' },
          { label: 'iPhone 15' },
          { label: 'iPhone 14' },
          { label: 'iPhone SE' },
          { label: 'Compare iPhone' },
          { label: 'Switch from Android' },
        ],
      },
      {
        heading: 'Shop iPhone',
        links: [
          { label: 'Shop iPhone' },
          { label: 'iPhone Accessories' },
          { label: 'Apple Trade In' },
          { label: 'Carrier Deals at Apple' },
        ],
      },
      {
        heading: 'More from iPhone',
        links: [
          { label: 'iPhone Support' },
          { label: 'AppleCare+ for iPhone' },
          { label: 'iOS 18' },
          { label: 'Apple Intelligence' },
        ],
      },
    ],
  },
  {
    label: 'Watch',
    sections: [
      {
        heading: 'Explore Watch',
        links: [
          { label: 'Apple Watch Series 9' },
          { label: 'Apple Watch Ultra 2' },
          { label: 'Apple Watch SE' },
          { label: 'Apple Watch Nike' },
          { label: 'Apple Watch Hermès' },
          { label: 'Compare Watch' },
        ],
      },
      {
        heading: 'Shop Watch',
        links: [
          { label: 'Shop Apple Watch' },
          { label: 'Apple Watch Studio' },
          { label: 'Bands' },
          { label: 'Apple Watch Accessories' },
        ],
      },
    ],
  },
  {
    label: 'AirPods',
    sections: [
      {
        heading: 'Explore AirPods',
        links: [
          { label: 'AirPods Pro (2nd gen)' },
          { label: 'AirPods (3rd gen)' },
          { label: 'AirPods (2nd gen)' },
          { label: 'AirPods Max' },
          { label: 'Compare AirPods' },
        ],
      },
      {
        heading: 'Shop AirPods',
        links: [
          { label: 'Shop AirPods' },
          { label: 'AirPods Accessories' },
        ],
      },
    ],
  },
  {
    label: 'TV & Home',
    sections: [
      {
        heading: 'Explore TV & Home',
        links: [
          { label: 'Apple TV 4K' },
          { label: 'HomePod' },
          { label: 'HomePod mini' },
          { label: 'AirTag' },
          { label: 'Siri' },
        ],
      },
      {
        heading: 'Apps & Services',
        links: [
          { label: 'Apple TV+' },
          { label: 'Apple Music' },
          { label: 'Apple Arcade' },
          { label: 'Apple Fitness+' },
          { label: 'Apple One' },
        ],
      },
    ],
  },
  { label: 'Support', href: '#support' },
]

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function MegaNavDocs() {
  const [position, setPosition] = useState<'sticky' | 'fixed' | 'relative'>('sticky')
  const [scrollThreshold, setScrollThreshold] = useState(24)

  const SNIPPET = `import { MegaNav } from '@/components/bahrawy/mega-nav'
import { Apple, Search, ShoppingBag } from 'lucide-react'

const items = [
  { label: 'Store', href: '/store' },
  {
    label: 'Mac',
    sections: [
      {
        heading: 'Explore Mac',
        links: [
          { label: 'MacBook Air' },
          { label: 'MacBook Pro' },
          { label: 'iMac' },
        ],
      },
    ],
  },
  // … iPad / iPhone / Watch / AirPods / TV & Home
  { label: 'Support', href: '/support' },
]

<MegaNav
  logo={<Apple className="h-4 w-4" />}
  items={items}
  position="${position}"
  scrollThreshold={${scrollThreshold}}
  actions={
    <>
      <button><Search className="h-3.5 w-3.5" /></button>
      <button><ShoppingBag className="h-3.5 w-3.5" /></button>
    </>
  }
/>`

  return (
    <DocsPage
      title="Mega Nav"
      slug="mega-nav"
      description="A floating top navigation bar with a frosted-glass backdrop and hover-driven mega-menus. Backdrop deepens on scroll, content crossfades when moving between items, mobile collapses to a stacked sheet. Demo themed in Apple's style — store nav with Mac / iPad / iPhone / Watch / AirPods / TV & Home / Support categories."
      category="115 · navigation"
    >
      <DocsSection
        title="Live demo"
        description="Hover Mac / iPad / iPhone / Watch / AirPods / TV & Home to drop the mega-menu. Move between items — the surface stays open and the content crossfades. Press Escape to close."
      >
        <DemoCard className="min-h-[520px] items-stretch overflow-hidden p-0">
          <div className="relative h-full w-full">
            <MegaNav
              logo={
                <span className="inline-flex items-center text-white">
                  <Apple className="h-[18px] w-[18px]" strokeWidth={1.8} fill="currentColor" />
                </span>
              }
              items={ITEMS}
              position="relative"
              scrollThreshold={scrollThreshold}
              actions={
                <>
                  <button
                    type="button"
                    aria-label="Search apple.com"
                    className="inline-flex h-8 w-8 items-center justify-center rounded-full text-white/85 transition-colors hover:text-white"
                  >
                    <Search className="h-4 w-4" strokeWidth={2} />
                  </button>
                  <button
                    type="button"
                    aria-label="Shopping bag"
                    className="inline-flex h-8 w-8 items-center justify-center rounded-full text-white/85 transition-colors hover:text-white"
                  >
                    <ShoppingBag className="h-4 w-4" strokeWidth={2} />
                  </button>
                </>
              }
            />
            <div className="mx-auto max-w-3xl px-6 py-16 text-center">
              <p className="text-xs font-medium uppercase tracking-[0.22em] text-white/40">
                Page content below the bar
              </p>
              <p className="mt-3 text-balance text-base leading-relaxed text-white/55">
                Hover any category to drop its mega-menu. Move between items — the surface stays
                open and the content crossfades. Press Escape to close.
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
            ['actions', 'Right-side slot. Pass any nodes (search button, shopping bag, sign-in link, cart, etc.).'],
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
