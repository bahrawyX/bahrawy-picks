'use client'

import { GradientFlow } from '@/components/bahrawy/gradient-flow'
import { CodeBlock } from '@/components/showcase/code-block'
import { DocsPage, DocsSection, DemoCard } from '@/components/showcase/docs-page'

export default function GradientFlowDocs() {
  return (
    <DocsPage
      title="Gradient Flow"
      slug="gradient-flow"
      description="Text whose fill is a linear gradient sized 300% of the text width; animating background-position slides the colors through the glyphs in a seamless loop. `background-clip: text` is the magic that paints the gradient inside the glyphs only."
      category="129 · text effect"
    >
      <DocsSection title="Default palette">
        <DemoCard className="min-h-[220px]">
          <h2 className="text-5xl font-semibold tracking-tight sm:text-7xl">
            <GradientFlow>colors that drift</GradientFlow>
          </h2>
        </DemoCard>
      </DocsSection>

      <DocsSection title="Cooler / faster">
        <DemoCard className="min-h-[220px]">
          <h2 className="text-5xl font-semibold tracking-tight sm:text-7xl">
            <GradientFlow colors={['#22D3EE', '#60A5FA', '#A78BFA']} duration={3.2}>cool current</GradientFlow>
          </h2>
        </DemoCard>
      </DocsSection>

      <DocsSection title="Usage">
        <CodeBlock language="tsx" code={`<GradientFlow
  colors={['#22D3EE', '#A78BFA', '#F472B6', '#FBBF24']}
  duration={6}
>
  colors that drift
</GradientFlow>`} />
      </DocsSection>

      <DocsSection title="Props">
        <ul className="grid gap-2 sm:grid-cols-2">
          {[
            ['children', 'ReactNode — the text to fill (required).'],
            ['colors', 'Color stops. The list is doubled internally for a seamless loop.'],
            ['duration', 'Cycle duration in seconds. Default 6.'],
            ['angle', 'Gradient angle in degrees. Default 120.'],
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
