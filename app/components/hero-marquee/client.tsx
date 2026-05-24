'use client'

import { HeroMarquee } from '@/components/bahrawy/hero-marquee'
import { CodeBlock } from '@/components/showcase/code-block'
import { DocsPage, DocsSection } from '@/components/showcase/docs-page'

const SNIPPET = `import { HeroMarquee } from '@/components/bahrawy/hero-marquee'

<HeroMarquee
  eyebrow="Components for makers"
  title="Built for taste."
  description="Beautiful, accessible, motion-rich. Open source."
  primaryCta={{ label: 'Get started' }}
  secondaryCta={{ label: 'Components' }}
/>`

export default function HeroMarqueeDocs() {
  return (
    <DocsPage
      title="Hero Marquee"
      slug="hero-marquee"
      description="Centered hero on top of multiple rows of scrolling words. The rows alternate direction and speed so the background never repeats visually. Hovering pauses every row at once."
      category="98 · hero"
    >
      <DocsSection title="Live demo" description="Hover anywhere to pause the marquee.">
        <div className="overflow-hidden rounded-2xl border border-white/10">
          <HeroMarquee
            eyebrow="Components for makers"
            title="Built for taste."
            description="Beautiful, accessible, motion-rich. Open source. Drop a Bahrawy component into any modern React project and ship the same day."
            primaryCta={{ label: 'Get started' }}
            secondaryCta={{ label: 'Browse 75 components' }}
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
            ['description', 'Sub-copy below the title.'],
            ['primaryCta', '{ label, href? } — solid button.'],
            ['secondaryCta', '{ label, href? } — outlined button.'],
            ['rows', 'HeroMarqueeRow[] — customize words, direction, speed per row.'],
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
