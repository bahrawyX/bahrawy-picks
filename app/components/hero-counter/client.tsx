'use client'

import { HeroCounter } from '@/components/bahrawy/hero-counter'
import { CodeBlock } from '@/components/showcase/code-block'
import { DocsPage, DocsSection } from '@/components/showcase/docs-page'

const SNIPPET = `import { HeroCounter } from '@/components/bahrawy/hero-counter'

<HeroCounter
  eyebrow="By the numbers"
  title="Open-source. Production-grade."
  description="One library, every pattern you need."
  stat={{ value: 75, suffix: '+', label: 'Components shipped' }}
  features={[
    { title: 'Spring physics', body: 'Every interaction feels alive.' },
    { title: 'Copy & paste',  body: 'No npm install per component.' },
  ]}
  primaryCta={{ label: 'Browse all' }}
/>`

export default function HeroCounterDocs() {
  return (
    <DocsPage
      title="Hero Counter"
      slug="hero-counter"
      description="Hero layout where a giant stat counts up on mount alongside a column of feature blurbs. The number rides a spring on a motion value so the digits settle into place rather than tick linearly."
      category="67 · hero"
    >
      <DocsSection title="Live demo" description="The counter starts on mount — refresh to see it again.">
        <div className="overflow-hidden rounded-2xl border border-white/10">
          <HeroCounter
            eyebrow="By the numbers"
            title="Open-source. Production-grade."
            description="One library, every pattern you need. Type-safe, accessible, motion-rich."
            stat={{ value: 75, suffix: '+', label: 'Components shipped' }}
            features={[
              { title: 'Spring physics', body: 'Every interaction feels alive — not frame-locked.' },
              { title: 'Copy & paste', body: 'Drop a single file into your project. No npm install per component.' },
              { title: 'Type-safe', body: 'Every prop typed. Catch errors at compile time.' },
              { title: 'Accessible', body: 'Built on shadcn + Radix. Keyboard, screen reader, focus rings.' },
            ]}
            primaryCta={{ label: 'Browse all' }}
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
            ['eyebrow', 'Tag above the heading.'],
            ['title', 'Heading on the right column.'],
            ['description', 'Sub-copy below the heading.'],
            ['stat', '{ value, label, prefix?, suffix? }'],
            ['features', 'HeroCounterFeature[] — small blurbs under the heading.'],
            ['primaryCta', '{ label, href? }'],
            ['startDelay', 'ms before the count begins. Default 200.'],
            ['duration', 'ms the counter takes to settle. Default 1800.'],
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
