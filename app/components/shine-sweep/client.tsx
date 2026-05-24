'use client'

import { ShineSweep } from '@/components/bahrawy/shine-sweep'
import { CodeBlock } from '@/components/showcase/code-block'
import { DocsPage, DocsSection, DemoCard } from '@/components/showcase/docs-page'

export default function ShineSweepDocs() {
  return (
    <DocsPage
      title="Shine Sweep"
      slug="shine-sweep"
      description="A bright shine stripe sweeps diagonally across the text on a loop. The background is a linear-gradient(currentColor, shine, currentColor) clipped to the glyphs via background-clip: text; animating background-position slides the shine through."
      category="143 · text effect"
    >
      <DocsSection title="Always sweeping">
        <DemoCard className="min-h-[220px]">
          <h2 className="text-5xl font-semibold tracking-tight text-white sm:text-7xl">
            <ShineSweep>Polish.</ShineSweep>
          </h2>
        </DemoCard>
      </DocsSection>

      <DocsSection title="Hover only">
        <DemoCard className="min-h-[220px]">
          <h2 className="text-5xl font-semibold tracking-tight text-white sm:text-7xl">
            <ShineSweep mode="hover" duration={2.4}>Hover me.</ShineSweep>
          </h2>
        </DemoCard>
      </DocsSection>

      <DocsSection title="Usage">
        <CodeBlock language="tsx" code={`<ShineSweep shineColor="rgba(255,255,255,0.85)" duration={3.5}>
  Polish.
</ShineSweep>`} />
      </DocsSection>

      <DocsSection title="Props">
        <ul className="grid gap-2 sm:grid-cols-2">
          {[
            ['children', 'ReactNode — the text/nodes (required).'],
            ['shineColor', "Color of the shine band. Default rgba(255,255,255,0.85)."],
            ['duration', 'Cycle duration in seconds. Default 3.5.'],
            ['mode', "'always' (default) or 'hover'."],
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
