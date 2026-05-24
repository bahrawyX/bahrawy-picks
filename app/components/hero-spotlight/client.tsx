'use client'

import { HeroSpotlight } from '@/components/bahrawy/hero-spotlight'
import { CodeBlock } from '@/components/showcase/code-block'
import { DocsPage, DocsSection } from '@/components/showcase/docs-page'

const SNIPPET = `import { HeroSpotlight } from '@/components/bahrawy/hero-spotlight'

<HeroSpotlight
  eyebrow="New · v2.0"
  title="Ship beautiful interfaces, faster."
  description="Bahrawy is a copy-paste library of polished React components."
  primaryCta={{ label: 'Get started', href: '/docs' }}
  secondaryCta={{ label: 'Browse components', href: '/components' }}
/>`

export default function HeroSpotlightDocs() {
  return (
    <DocsPage
      title="Hero Spotlight"
      slug="hero-spotlight"
      description="Centered hero with a radial spotlight that follows your cursor across the section. Spring-smoothed so it glides instead of snapping. Use it as your landing page hero, or any moment that wants a calm, productive feel."
      category="84 · hero"
    >
      <DocsSection title="Live demo" description="Move your cursor across the section.">
        <div className="overflow-hidden rounded-2xl border border-white/10">
          <HeroSpotlight
            eyebrow="New · v2.0"
            title="Ship beautiful interfaces, faster."
            description="Bahrawy is a copy-paste library of polished React components. Drag a piece into your project, tweak it, and ship."
            primaryCta={{ label: 'Get started', href: '#' }}
            secondaryCta={{ label: 'Browse components', href: '#' }}
            minHeight="600px"
          />
        </div>
      </DocsSection>

      <DocsSection title="Usage">
        <CodeBlock code={SNIPPET} language="tsx" />
      </DocsSection>

      <DocsSection title="Props">
        <ul className="grid gap-2 sm:grid-cols-2">
          {[
            ['eyebrow', 'Tiny tag above the title.'],
            ['title', 'Main headline (ReactNode).'],
            ['description', 'Sub-copy below the title.'],
            ['primaryCta', '{ label, href?, onClick? } — solid button.'],
            ['secondaryCta', '{ label, href?, onClick? } — outlined button.'],
            ['spotlightClassName', 'Extra classes on the spotlight layer.'],
            ['minHeight', 'CSS min-height of the section. Default 100vh.'],
            ['className', 'Extra classes on the section.'],
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
