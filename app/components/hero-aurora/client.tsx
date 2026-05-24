'use client'

import { HeroAurora } from '@/components/bahrawy/hero-aurora'
import { CodeBlock } from '@/components/showcase/code-block'
import { DocsPage, DocsSection } from '@/components/showcase/docs-page'

const SNIPPET = `import { HeroAurora } from '@/components/bahrawy/hero-aurora'

<HeroAurora
  eyebrow="Made with care"
  title="A library that feels alive."
  description="Spring physics, scroll-driven motion, taste at every layer."
  primaryCta={{ label: 'Get started' }}
  secondaryCta={{ label: 'Read the docs' }}
/>`

export default function HeroAuroraDocs() {
  return (
    <DocsPage
      title="Hero Aurora"
      slug="hero-aurora"
      description="Centered hero with drifting blurred color blobs behind the text. Each blob slowly orbits along its own path so the bloom never repeats. Soft, brand-y, doesn't fight the type."
      category="100 · hero"
    >
      <DocsSection title="Live demo">
        <div className="overflow-hidden rounded-2xl border border-white/10">
          <HeroAurora
            eyebrow="Made with care"
            title="A library that feels alive."
            description="Spring physics, scroll-driven motion, taste at every layer. Drop it in, ship the same week."
            primaryCta={{ label: 'Get started' }}
            secondaryCta={{ label: 'Read the docs' }}
            minHeight="640px"
          />
        </div>
      </DocsSection>

      <DocsSection title="Usage">
        <CodeBlock code={SNIPPET} language="tsx" />
      </DocsSection>

      <DocsSection title="Props">
        <ul className="grid gap-2 sm:grid-cols-2">
          {[
            ['eyebrow', 'Optional tag above the title.'],
            ['title', 'Main headline.'],
            ['description', 'Sub-copy below.'],
            ['primaryCta', '{ label, href? }'],
            ['secondaryCta', '{ label, href? }'],
            ['blobs', 'HeroAuroraBlob[] — { color, size?, startX?, startY?, duration?, opacity? }'],
            ['blur', 'CSS blur. Default 120px.'],
            ['minHeight', 'CSS min-height. Default 100vh.'],
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
