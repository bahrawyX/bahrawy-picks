'use client'

import { NeonPulse } from '@/components/bahrawy/neon-pulse'
import { CodeBlock } from '@/components/showcase/code-block'
import { DocsPage, DocsSection, DemoCard } from '@/components/showcase/docs-page'

export default function NeonPulseDocs() {
  return (
    <DocsPage
      title="Neon Pulse"
      slug="neon-pulse"
      description="A piece of text that wears a neon sign's glow: layered text-shadows at increasing radii, a gentle breathing pulse on opacity, and an occasional flicker that snaps brightness down for one beat."
      category="122 · text effect"
    >
      <DocsSection title="Cyan">
        <DemoCard className="min-h-[220px]">
          <h2 className="text-5xl font-semibold tracking-tight sm:text-7xl">
            <NeonPulse>OPEN ALL NIGHT</NeonPulse>
          </h2>
        </DemoCard>
      </DocsSection>

      <DocsSection title="Pink, faster flicker">
        <DemoCard className="min-h-[220px]">
          <h2 className="text-5xl font-semibold tracking-tight sm:text-7xl">
            <NeonPulse color="#F472B6" duration={1.8} flicker={0.9}>BAR · 24h</NeonPulse>
          </h2>
        </DemoCard>
      </DocsSection>

      <DocsSection title="Usage">
        <CodeBlock language="tsx" code={`<NeonPulse color="#22D3EE" duration={2.4} flicker={0.6}>
  OPEN ALL NIGHT
</NeonPulse>`} />
      </DocsSection>

      <DocsSection title="Props">
        <ul className="grid gap-2 sm:grid-cols-2">
          {[
            ['children', 'ReactNode — the text/nodes to glow (required).'],
            ['color', 'Neon color. Default cyan (#22D3EE).'],
            ['duration', 'Pulse cycle duration in seconds. Default 2.4.'],
            ['flicker', 'Strength of the occasional flicker, 0–1. Default 0.6.'],
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
