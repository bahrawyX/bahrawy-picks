'use client'

import { StatsGrid } from '@/components/bahrawy/stats-grid'
import { CodeBlock } from '@/components/showcase/code-block'
import { DocsPage, DocsSection } from '@/components/showcase/docs-page'

const SNIPPET = `import { StatsGrid } from '@/components/bahrawy/stats-grid'

<StatsGrid
  eyebrow="By the numbers"
  heading="A library that grew up fast."
  items={[
    { value: 95, suffix: '+', label: 'Components', tint: '#A78BFA' },
    { value: 12, suffix: 'K', label: 'Weekly downloads', tint: '#22D3EE' },
    { value: 99,  suffix: '%', label: 'Uptime', tint: '#34D399' },
    { value: 0,   prefix: '$', label: 'Forever', tint: '#FBBF24' },
  ]}
/>`

export default function StatsGridDocs() {
  return (
    <DocsPage
      title="Stats Grid"
      slug="stats-grid"
      description="A 4-tile section where every counter springs from 0 to its target value as the grid enters the viewport. Each tile can opt into a color tint without going loud."
      category="84 · section"
    >
      <DocsSection title="Live demo">
        <div className="overflow-hidden rounded-2xl border border-white/10">
          <StatsGrid
            eyebrow="By the numbers"
            heading="A library that grew up fast."
            description="Open source from day one. Still tiny in bundle size."
            items={[
              { value: 95, suffix: '+', label: 'Components', tint: '#A78BFA' },
              { value: 12, suffix: 'K', label: 'Weekly downloads', tint: '#22D3EE' },
              { value: 99, suffix: '%', label: 'Uptime', tint: '#34D399' },
              { value: 0, prefix: '$', label: 'Forever', tint: '#FBBF24' },
            ]}
          />
        </div>
      </DocsSection>

      <DocsSection title="Usage">
        <CodeBlock code={SNIPPET} language="tsx" />
      </DocsSection>

      <DocsSection title="Props">
        <ul className="grid gap-2 sm:grid-cols-2">
          {[
            ['items', 'StatsGridItem[] — { value, label, prefix?, suffix?, tint? }'],
            ['eyebrow', 'Optional tag above the heading.'],
            ['heading', 'Section heading.'],
            ['description', 'Sub-copy below the heading.'],
            ['className', 'Extra classes on the section.'],
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
