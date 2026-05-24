'use client'

import { LiquidChrome } from '@/components/bahrawy/liquid-chrome'
import { CodeBlock } from '@/components/showcase/code-block'
import { DocsPage, DocsSection, DemoCard } from '@/components/showcase/docs-page'

const SNIPPET = `import { LiquidChrome } from '@/components/bahrawy/liquid-chrome'

<LiquidChrome
  size={480}
  amplitude={0.28}
  frequency={1.6}
  speed={0.45}
  colors={['#A78BFA', '#22D3EE', '#F472B6']}
/>`

export default function LiquidChromeDocs() {
  return (
    <DocsPage
      title="Liquid Chrome"
      slug="liquid-chrome"
      description="A high-poly icosphere whose every vertex is displaced along its normal by a 3D simplex-noise sample of (position * freq + time) — the surface morphs continuously like liquid metal. A custom fragment shader fakes a chrome environment without any cubemap texture: fresnel + reflection direction map through a 3-color iridescent gradient. Cursor movement modulates the noise sampling so moving the mouse subtly deforms the blob."
      category="58 · background"
    >
      <DocsSection title="Default (violet → cyan → pink)">
        <DemoCard className="min-h-[520px]">
          <LiquidChrome size={460} />
        </DemoCard>
      </DocsSection>

      <DocsSection title="Sunset (rose → amber → magenta), gentler waves">
        <DemoCard className="min-h-[520px]">
          <LiquidChrome
            size={460}
            amplitude={0.22}
            frequency={1.2}
            speed={0.35}
            colors={['#FB7185', '#FBBF24', '#A21CAF']}
          />
        </DemoCard>
      </DocsSection>

      <DocsSection title="High-frequency chrome (more turbulent)">
        <DemoCard className="min-h-[520px]">
          <LiquidChrome
            size={460}
            amplitude={0.34}
            frequency={2.6}
            speed={0.7}
            colors={['#22D3EE', '#34D399', '#A78BFA']}
          />
        </DemoCard>
      </DocsSection>

      <DocsSection title="Usage">
        <CodeBlock code={SNIPPET} language="tsx" />
      </DocsSection>

      <DocsSection title="Props">
        <ul className="grid gap-2 sm:grid-cols-2">
          {[
            ['size', 'Container size in px (square). Default 480.'],
            ['amplitude', 'Vertex displacement strength. Default 0.28.'],
            ['frequency', 'Noise frequency — higher = finer ripples. Default 1.6.'],
            ['speed', 'Time multiplier — controls morphing speed. Default 0.45.'],
            ['colors', '[A, B, C] — three hex colors blended across the surface.'],
            ['background', 'Background behind the blob. Default transparent.'],
            ['paused', 'Disable auto-rotation. Default false.'],
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
          {['three'].map((d) => (
            <code key={d} className="rounded-md border border-white/10 bg-white/[0.04] px-2 py-1 font-mono text-xs text-white/80">
              {d}
            </code>
          ))}
        </div>
      </DocsSection>
    </DocsPage>
  )
}
