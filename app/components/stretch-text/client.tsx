'use client'

import { StretchText } from '@/components/bahrawy/stretch-text'
import { CodeBlock } from '@/components/showcase/code-block'
import { DocsPage, DocsSection, DemoCard } from '@/components/showcase/docs-page'

export default function StretchTextDocs() {
  return (
    <DocsPage
      title="Stretch Text"
      slug="stretch-text"
      description="On hover, each character stretches horizontally via `transform: scaleX(N)` with a staggered delay so the stretch reads as a wave passing through the line."
      category="150 · text effect"
    >
      <DocsSection title="Hover the line">
        <DemoCard className="min-h-[220px]">
          <h2 className="text-5xl font-semibold tracking-tight text-white sm:text-7xl">
            <StretchText>Stretch me out.</StretchText>
          </h2>
        </DemoCard>
      </DocsSection>

      <DocsSection title="Bigger stretch, slower wave">
        <DemoCard className="min-h-[220px]">
          <h2 className="text-5xl font-semibold tracking-tight text-white sm:text-7xl">
            <StretchText stretch={1.8} duration={900} stagger={50}>Slow pull.</StretchText>
          </h2>
        </DemoCard>
      </DocsSection>

      <DocsSection title="Usage">
        <CodeBlock language="tsx" code={`<StretchText stretch={1.45} duration={600} stagger={30}>
  Stretch me out.
</StretchText>`} />
      </DocsSection>

      <DocsSection title="Props">
        <ul className="grid gap-2 sm:grid-cols-2">
          {[
            ['children', 'string — the text (required).'],
            ['stretch', 'Max horizontal scale. Default 1.45.'],
            ['duration', 'Per-char transition duration in ms. Default 600.'],
            ['stagger', 'Per-char stagger delay in ms. Default 30.'],
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
