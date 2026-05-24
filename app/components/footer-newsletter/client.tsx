'use client'

import { Github, Twitter } from 'lucide-react'
import { FooterNewsletter, type FooterNewsletterColumn } from '@/components/bahrawy/footer-newsletter'
import { CodeBlock } from '@/components/showcase/code-block'
import { DocsPage, DocsSection } from '@/components/showcase/docs-page'

const COLUMNS: FooterNewsletterColumn[] = [
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
      { label: 'Guides', href: '#' },
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

const SNIPPET = `import { FooterNewsletter } from '@/components/bahrawy/footer-newsletter'

<FooterNewsletter
  logo="Bahrawy"
  newsletterHeading="Get one short email a month."
  newsletterCopy="New components and the occasional rant."
  onSubmit={async (email) => {
    await fetch('/api/subscribe', {
      method: 'POST',
      body: JSON.stringify({ email }),
    })
  }}
  columns={[...]}
  copyright="© 2026 Bahrawy."
/>`

export default function FooterNewsletterDocs() {
  return (
    <DocsPage
      title="Footer Newsletter"
      slug="footer-newsletter"
      description="Footer with a prominent newsletter signup row at the top. On successful submit, the button morphs to a Subscribed! confirmation for a beat then resets. Wire up your real onSubmit to send to your provider."
      category="107 · footer"
    >
      <DocsSection title="Live demo" description="Type any email and click Subscribe.">
        <div className="overflow-hidden rounded-2xl border border-white/10">
          <FooterNewsletter
            logo="Bahrawy"
            tagline="Beautifully crafted React components. Copy, paste, ship."
            newsletterHeading="Get one short email a month."
            newsletterCopy="New components, behind-the-scenes builds, and the occasional rant. No spam, unsubscribe in one click."
            onSubmit={async () => {
              // Fake delay so users feel the loading state
              await new Promise((r) => setTimeout(r, 700))
            }}
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
            ['logo', 'Logo node.'],
            ['tagline', 'Optional one-liner under the logo.'],
            ['newsletterHeading', 'Headline above the input.'],
            ['newsletterCopy', 'Sub-copy under the headline.'],
            ['placeholder', 'Input placeholder. Default "your@email.com".'],
            ['onSubmit', '(email) => Promise<void> | void. Throw to surface "Try again".'],
            ['ctaLabel', 'Subscribe button text. Default "Subscribe".'],
            ['columns', 'Optional FooterNewsletterColumn[] for link columns.'],
            ['copyright', 'Bottom-row copyright text.'],
            ['bottomRight', 'Right-aligned bottom-row items.'],
            ['className', 'Extra classes.'],
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
            <code key={d} className="rounded-md border border-white/10 bg-white/[0.04] px-2 py-1 font-mono text-xs text-white/80">{d}</code>
          ))}
        </div>
      </DocsSection>
    </DocsPage>
  )
}
