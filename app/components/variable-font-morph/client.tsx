'use client'

import { VariableFontMorph } from '@/components/bahrawy/variable-font-morph'
import { CodeBlock } from '@/components/showcase/code-block'
import { DocsPage, DocsSection, DemoCard } from '@/components/showcase/docs-page'

export default function VariableFontMorphDocs() {
  return (
    <DocsPage
      title="Variable Font Morph"
      slug="variable-font-morph"
      description="Each character animates its `font-variation-settings: 'wght'` axis between two values with a staggered phase. Works with any variable font that has a weight axis (Inter does)."
      category="124 · text effect"
    >
      <DocsSection title="Breathing weight">
        <DemoCard className="min-h-[220px]">
          <h2 className="text-5xl font-semibold tracking-tight text-white sm:text-7xl">
            <VariableFontMorph>Breathe in. Out.</VariableFontMorph>
          </h2>
        </DemoCard>
      </DocsSection>

      <DocsSection title="Tighter range, faster">
        <DemoCard className="min-h-[220px]">
          <h2 className="text-5xl font-semibold tracking-tight text-white sm:text-7xl">
            <VariableFontMorph minWeight={300} maxWeight={700} duration={2.2}>Tighter beat.</VariableFontMorph>
          </h2>
        </DemoCard>
      </DocsSection>

      <DocsSection title="Usage">
        <CodeBlock language="tsx" code={`<VariableFontMorph minWeight={200} maxWeight={900} duration={4}>
  Breathe in. Out.
</VariableFontMorph>`} />
      </DocsSection>

      <DocsSection title="Props">
        <ul className="grid gap-2 sm:grid-cols-2">
          {[
            ['children', 'string — the text (required).'],
            ['minWeight', 'Lower bound of the wght axis. Default 200.'],
            ['maxWeight', 'Upper bound of the wght axis. Default 900.'],
            ['duration', 'Cycle duration in seconds. Default 4.'],
            ['stagger', 'Stagger per character in seconds. Default 0.06.'],
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
