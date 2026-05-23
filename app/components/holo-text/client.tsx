'use client'

import { HoloText } from '@/components/bahrawy/holo-text'
import { CodeBlock } from '@/components/showcase/code-block'
import { DocsPage, DocsSection, DemoCard } from '@/components/showcase/docs-page'

export default function HoloTextDocs() {
  return (
    <DocsPage
      title="Holo Text"
      slug="holo-text"
      description="Holographic text: a cyan layer and a magenta layer drift in opposite directions behind the white base layer, blending in `screen` mode so their overlap reads as white but their fringes glow."
      category="124 · text effect"
    >
      <DocsSection title="Default">
        <DemoCard className="min-h-[220px]">
          <h2 className="text-5xl font-semibold tracking-tight text-white sm:text-7xl">
            <HoloText>HOLOGRAPHIC</HoloText>
          </h2>
        </DemoCard>
      </DocsSection>

      <DocsSection title="More intense">
        <DemoCard className="min-h-[220px]">
          <h2 className="text-5xl font-semibold tracking-tight text-white sm:text-7xl">
            <HoloText intensity={8} duration={3}>VHS DREAMS</HoloText>
          </h2>
        </DemoCard>
      </DocsSection>

      <DocsSection title="Usage">
        <CodeBlock language="tsx" code={`<HoloText intensity={4} duration={4}>
  HOLOGRAPHIC
</HoloText>`} />
      </DocsSection>

      <DocsSection title="Props">
        <ul className="grid gap-2 sm:grid-cols-2">
          {[
            ['children', 'ReactNode — the text/nodes (required).'],
            ['intensity', 'Max chromatic offset in px. Default 4.'],
            ['duration', 'Drift cycle duration in seconds. Default 4.'],
            ['cyan', 'Cyan channel color. Default #22D3EE.'],
            ['magenta', 'Magenta channel color. Default #F472B6.'],
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
