'use client'

import { MagneticText } from '@/components/bahrawy/magnetic-text'
import { CodeBlock } from '@/components/showcase/code-block'
import { DocsPage, DocsSection, DemoCard } from '@/components/showcase/docs-page'

export default function MagneticTextDocs() {
  return (
    <DocsPage
      title="Magnetic Text"
      slug="magnetic-text"
      description="Every character of the text has a magnetic pull toward the cursor. Within `radius` px the character is yanked along the cursor vector with strength `(1 − dist/radius) × strength`. Lerped per-frame for a spring-like feel."
      category="135 · text effect"
    >
      <DocsSection title="Move your cursor through it">
        <DemoCard className="min-h-[220px]">
          <h2 className="text-5xl font-semibold tracking-tight text-white sm:text-7xl">
            <MagneticText>Pull me closer.</MagneticText>
          </h2>
        </DemoCard>
      </DocsSection>

      <DocsSection title="Repel mode">
        <DemoCard className="min-h-[220px]">
          <h2 className="text-5xl font-semibold tracking-tight text-white sm:text-7xl">
            <MagneticText mode="repel" strength={28}>Stay back.</MagneticText>
          </h2>
        </DemoCard>
      </DocsSection>

      <DocsSection title="Usage">
        <CodeBlock language="tsx" code={`<MagneticText strength={18} radius={120}>
  Pull me closer.
</MagneticText>`} />
      </DocsSection>

      <DocsSection title="Props">
        <ul className="grid gap-2 sm:grid-cols-2">
          {[
            ['children', 'string — the text (required).'],
            ['strength', 'Max pull in px at the cursor centre. Default 18.'],
            ['radius', 'Influence radius in px. Default 120.'],
            ['lerp', 'Smoothing factor 0–1. Default 0.2.'],
            ['mode', "'attract' (default) or 'repel'."],
            ['className', 'Extra classes on the wrapper.'],
          ].map(([n, b]) => (
            <li key={n} className="rounded-lg border border-white/10 bg-white/[0.02] p-3">
              <code className="font-mono text-xs text-white">{n}</code>
              <p className="mt-1 text-xs text-white/60">{b}</p>
            </li>
          ))}
        </ul>
      </DocsSection>
    </DocsPage>
  )
}
