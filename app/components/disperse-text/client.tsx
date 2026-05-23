'use client'

import { DisperseText } from '@/components/bahrawy/disperse-text'
import { CodeBlock } from '@/components/showcase/code-block'
import { DocsPage, DocsSection, DemoCard } from '@/components/showcase/docs-page'

export default function DisperseTextDocs() {
  return (
    <DocsPage
      title="Disperse Text"
      slug="disperse-text"
      description="Letters explode away from their resting position when the parent is hovered, then settle back when the cursor leaves. Per-character offsets seeded by index for stable layout."
      category="116 · text effect"
    >
      <DocsSection title="Hover the headline">
        <DemoCard className="min-h-[200px]">
          <h2 className="text-5xl font-semibold tracking-tight text-white sm:text-7xl">
            <DisperseText>Don't touch.</DisperseText>
          </h2>
        </DemoCard>
      </DocsSection>

      <DocsSection title="Always dispersed">
        <DemoCard className="min-h-[200px]">
          <h2 className="text-5xl font-semibold tracking-tight text-white sm:text-7xl">
            <DisperseText mode="always" spread={48} rotate={60}>Scattered.</DisperseText>
          </h2>
        </DemoCard>
      </DocsSection>

      <DocsSection title="Usage">
        <CodeBlock language="tsx" code={`<DisperseText mode="hover" spread={64} rotate={90}>
  Don't touch.
</DisperseText>`} />
      </DocsSection>

      <DocsSection title="Props">
        <ul className="grid gap-2 sm:grid-cols-2">
          {[
            ['children', 'string — the text (required).'],
            ['mode', "'hover' (default) or 'always'."],
            ['spread', 'Max displacement in px. Default 64.'],
            ['rotate', 'Max rotation in degrees. Default 90.'],
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
