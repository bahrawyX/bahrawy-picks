'use client'

import { Github, Twitter } from 'lucide-react'
import {
  FooterBrandMark,
  type FooterBrandColumn,
} from '@/components/bahrawy/footer-brand-mark'
import { CodeBlock } from '@/components/showcase/code-block'
import { DocsPage, DocsSection } from '@/components/showcase/docs-page'

const COLUMNS: FooterBrandColumn[] = [
  {
    heading: 'Product',
    links: [
      { label: 'Components', href: '#' },
      { label: 'Templates', href: '#' },
      { label: 'Pricing', href: '#' },
    ],
  },
  {
    heading: 'Resources',
    links: [
      { label: 'Docs', href: '#' },
      { label: 'Examples', href: '#' },
      { label: 'Changelog', href: '#' },
    ],
  },
  {
    heading: 'Company',
    links: [
      { label: 'About', href: '#' },
      { label: 'Blog', href: '#' },
      { label: 'Contact', href: '#' },
    ],
  },
]

const SNIPPET = `import { FooterBrandMark } from '@/components/bahrawy/footer-brand-mark'

<FooterBrandMark
  brandMark="Bahrawy"
  tagline="Beautifully crafted components."
  columns={[...]}
  copyright="© 2026 Bahrawy."
/>`

export default function FooterBrandMarkDocs() {
  return (
    <DocsPage
      title="Footer Brand Mark"
      slug="footer-brand-mark"
      description="A bold footer with a giant wordmark stretched across the bottom. The wordmark starts dim and offset below, then drifts up and brightens as the section scrolls into view. Above it sit compact link columns + a copyright row."
      category="101 · footer"
    >
      <DocsSection title="Live demo" description="Scroll the page — watch the wordmark fade in from below.">
        <div className="overflow-hidden rounded-2xl border border-white/10">
          {/* Some breathing room so the user can actually scroll into the footer */}
          <div className="flex h-[300px] items-center justify-center bg-gradient-to-b from-black via-black to-zinc-950">
            <p className="text-sm text-white/40">↓ Keep scrolling…</p>
          </div>

          <FooterBrandMark
            brandMark="Bahrawy"
            markColor="#A78BFA"
            tagline="Beautifully crafted React components. Copy, paste, ship. 75 components and counting."
            columns={COLUMNS}
            copyright="© 2026 Bahrawy. MIT licensed."
            bottomRight={
              <>
                <a href="#" aria-label="GitHub" className="rounded-full p-1.5 transition-colors hover:bg-white/10 hover:text-white">
                  <Github className="h-4 w-4" />
                </a>
                <a href="#" aria-label="Twitter" className="rounded-full p-1.5 transition-colors hover:bg-white/10 hover:text-white">
                  <Twitter className="h-4 w-4" />
                </a>
              </>
            }
          />
        </div>
      </DocsSection>

      <DocsSection title="Usage">
        <CodeBlock code={SNIPPET} language="tsx" />
      </DocsSection>

      <DocsSection title="Props">
        <ul className="grid gap-2 sm:grid-cols-2">
          {[
            ['brandMark', 'The giant text — e.g. your brand name.'],
            ['tagline', 'Small tagline above the brand mark.'],
            ['columns', 'FooterBrandColumn[] — optional link columns.'],
            ['copyright', 'Bottom-row copyright text.'],
            ['bottomRight', 'Right-aligned bottom-row items.'],
            ['markColor', 'Color of the brand-mark text. Default #FFFFFF.'],
            ['className', 'Extra classes on the footer.'],
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
          <code className="rounded-md border border-white/10 bg-white/[0.04] px-2 py-1 font-mono text-xs text-white/80">framer-motion</code>
        </div>
      </DocsSection>
    </DocsPage>
  )
}
