'use client'

import { Aurora } from '@/components/bahrawy/aurora'
import { CodeBlock } from '@/components/showcase/code-block'
import { DocsPage, DocsSection, DemoCard } from '@/components/showcase/docs-page'

const SNIPPET = `import { Aurora } from '@/components/bahrawy/aurora'

<div className="h-screen w-full">
  <Aurora
    colors={['#34D399', '#22D3EE', '#A78BFA']}
    speed={0.6}
    intensity={1}
  />
</div>`

export default function AuroraDocs() {
  return (
    <DocsPage
      title="Aurora"
      slug="aurora"
      description="A fullscreen OGL fragment shader that paints living aurora-style color bands. We layer four octaves of value-noise, warp the sampling coordinates with curl-ish offsets, then map the result through a 3-color gradient. A vertical mask fades the bottom out so the bands feel like they're hanging in the upper atmosphere."
      category="57 · background"
    >
      <DocsSection title="Green → cyan → violet (classic)">
        <DemoCard className="min-h-[480px] overflow-hidden p-0">
          <div className="h-[480px] w-full">
            <Aurora colors={['#34D399', '#22D3EE', '#A78BFA']} speed={0.6} intensity={1} />
          </div>
        </DemoCard>
      </DocsSection>

      <DocsSection title="Sunset (rose → amber → violet)">
        <DemoCard className="min-h-[420px] overflow-hidden p-0">
          <div className="h-[420px] w-full">
            <Aurora colors={['#FB7185', '#FBBF24', '#A78BFA']} speed={0.45} intensity={1.1} />
          </div>
        </DemoCard>
      </DocsSection>

      <DocsSection title="Calm (deep blue ramp)">
        <DemoCard className="min-h-[360px] overflow-hidden p-0">
          <div className="h-[360px] w-full">
            <Aurora colors={['#1e3a8a', '#3b82f6', '#22D3EE']} speed={0.3} scale={1.3} intensity={0.9} />
          </div>
        </DemoCard>
      </DocsSection>

      <DocsSection title="Usage">
        <CodeBlock code={SNIPPET} language="tsx" />
      </DocsSection>

      <DocsSection title="Props">
        <ul className="grid gap-2 sm:grid-cols-2">
          {[
            ['colors', 'Three hex colors blended across the bands.'],
            ['speed', 'Animation speed. Default 0.6.'],
            ['scale', 'Vertical scale of the bands. Default 1.'],
            ['intensity', 'Overall brightness. Default 1.'],
            ['className', 'Extra classes on the container.'],
          ].map(([n, b]) => (
            <li key={n} className="rounded-lg border border-white/10 bg-white/[0.02] p-3">
              <code className="font-mono text-xs text-white">{n}</code>
              <p className="mt-1 text-xs text-white/60">{b}</p>
            </li>
          ))}
        </ul>
      </DocsSection>

      <DocsSection title="Dependencies">
        <div className="flex flex-wrap gap-2">
          {['ogl'].map((d) => (
            <code key={d} className="rounded-md border border-white/10 bg-white/[0.04] px-2 py-1 font-mono text-xs text-white/80">
              {d}
            </code>
          ))}
        </div>
      </DocsSection>
    </DocsPage>
  )
}
