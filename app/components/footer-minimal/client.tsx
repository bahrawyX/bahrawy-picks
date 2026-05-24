'use client'

import { Github, Twitter } from 'lucide-react'
import { FooterMinimal, type FooterColumn } from '@/components/bahrawy/footer-minimal'
import { CodeBlock } from '@/components/showcase/code-block'
import { DocsPage, DocsSection } from '@/components/showcase/docs-page'

const COLUMNS: FooterColumn[] = [
  {
    heading: 'Product',
    links: [
      { label: 'Components', href: '#' },
      { label: 'Templates', href: '#' },
      { label: 'Pricing', href: '#' },
      { label: 'Changelog', href: '#' },
    ],
  },
  {
    heading: 'Resources',
    links: [
      { label: 'Documentation', href: '#' },
      { label: 'Examples', href: '#' },
      { label: 'Guides', href: '#' },
      { label: 'Community', href: '#' },
    ],
  },
  {
    heading: 'Company',
    links: [
      { label: 'About', href: '#' },
      { label: 'Blog', href: '#' },
      { label: 'Contact', href: '#' },
      { label: 'Privacy', href: '#' },
    ],
  },
]

const SNIPPET = `import { FooterMinimal } from '@/components/bahrawy/footer-minimal'

<FooterMinimal
  logo="Bahrawy"
  tagline="Beautifully crafted components."
  columns={[
    { heading: 'Product', links: [...] },
    { heading: 'Resources', links: [...] },
  ]}
  copyright="© 2026 Bahrawy."
/>`

export default function FooterMinimalDocs() {
  return (
    <DocsPage
      title="Footer Minimal"
      slug="footer-minimal"
      description="A clean text footer: logo on the left, link columns on the right, copyright row at the bottom. Light hover animations — each link reveals a small underline and shifts a few pixels right."
      category="93 · footer"
    >
      <DocsSection title="Live demo" description="Hover any link to see the underline grow.">
        <div className="overflow-hidden rounded-2xl border border-white/10">
          <FooterMinimal
            logo="Bahrawy"
            tagline="Beautifully crafted React components. Copy, paste, ship."
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
            ['logo', 'Logo node — wordmark, SVG, anything.'],
            ['tagline', 'Optional one-liner under the logo.'],
            ['columns', 'FooterColumn[] — { heading, links: { label, href, external? }[] }'],
            ['copyright', 'Bottom-row copyright text.'],
            ['bottomRight', 'Right-aligned bottom-row items (e.g. social icons).'],
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
