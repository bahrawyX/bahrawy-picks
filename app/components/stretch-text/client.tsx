'use client'

import { StretchText } from '@/components/bahrawy/stretch-text'
import { CodeBlock } from '@/components/showcase/code-block'
import { DocsPage, DocsSection, DemoCard } from '@/components/showcase/docs-page'

export default function StretchTextDocs() {
  return (
    <DocsPage
      title="Stretch Text"
      slug="stretch-text"
      description="Move the cursor across the line — each letter widens via Gaussian falloff against the cursor X, then springs back. Apple spring physics (stiffness 360, damping 28). Per-letter scaleX + letter-spacing so it works on any font."
      category="151 · text effect"
    >
      <DocsSection title="Move the cursor across the line">
        <DemoCard className="min-h-[240px]">
          <h2 className="font-display text-5xl font-semibold tracking-tight text-white sm:text-7xl">
            <StretchText>Stretch me out.</StretchText>
          </h2>
        </DemoCard>
      </DocsSection>

      <DocsSection title="Wider radius, more dramatic stretch">
        <DemoCard className="min-h-[240px]">
          <h2 className="font-display text-5xl font-semibold tracking-tight text-white sm:text-7xl">
            <StretchText radius={180} maxScale={1.7} maxSpacing={0.18}>
              Slow pull.
            </StretchText>
          </h2>
        </DemoCard>
      </DocsSection>

      <DocsSection title="Usage">
        <CodeBlock language="tsx" code={`<StretchText radius={120} maxScale={1.45}>
  Stretch me out.
</StretchText>`} />
      </DocsSection>

      <DocsSection title="Props">
        <ul className="grid gap-2 sm:grid-cols-2">
          {[
            ['children', 'string — the text (required).'],
            ['radius', 'Falloff radius in px. Letters within widen. Default 120.'],
            ['maxScale', 'Max horizontal scale at full proximity. Default 1.45.'],
            ['maxSpacing', 'Max letter-spacing bump in em. Default 0.12.'],
            ['className', 'Extra classes on the wrapper. Bricolage Grotesque by default.'],
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
