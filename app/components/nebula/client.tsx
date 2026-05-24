'use client'

import { Nebula } from '@/components/bahrawy/nebula'
import { CodeBlock } from '@/components/showcase/code-block'
import { DocsPage, DocsSection, DemoCard } from '@/components/showcase/docs-page'

const SNIPPET = `import { Nebula } from '@/components/bahrawy/nebula'

<div className="h-screen w-full">
  <Nebula
    colors={['#1e1b4b', '#A78BFA', '#F472B6']}
    speed={1}
    starDensity={1}
    intensity={1}
  />
</div>`

export default function NebulaDocs() {
  return (
    <DocsPage
      title="Nebula"
      slug="nebula"
      description="A cosmic dust cloud with stars, rendered in a single OGL fragment shader. Two parallax layers of 4-octave fbm noise — each at a different scale and drift speed — generate cloud density with real depth; the deeper layer moves slower. Density maps through a 3-color gradient. A hash-on-grid-cells star field twinkles on top with sin-based brightness variation."
      category="04 · background"
    >
      <DocsSection title="Default (deep indigo → violet → pink)">
        <DemoCard className="min-h-[480px] overflow-hidden p-0">
          <div className="h-[480px] w-full">
            <Nebula />
          </div>
        </DemoCard>
      </DocsSection>

      <DocsSection title="Emerald nebula">
        <DemoCard className="min-h-[420px] overflow-hidden p-0">
          <div className="h-[420px] w-full">
            <Nebula colors={['#022c22', '#10b981', '#a7f3d0']} speed={0.85} />
          </div>
        </DemoCard>
      </DocsSection>

      <DocsSection title="Red giant">
        <DemoCard className="min-h-[420px] overflow-hidden p-0">
          <div className="h-[420px] w-full">
            <Nebula
              colors={['#1a0a0a', '#dc2626', '#fbbf24']}
              speed={1.1}
              starDensity={1.4}
              scale={1.2}
            />
          </div>
        </DemoCard>
      </DocsSection>

      <DocsSection title="Sparse, cold (calm wallpaper)">
        <DemoCard className="min-h-[360px] overflow-hidden p-0">
          <div className="h-[360px] w-full">
            <Nebula
              colors={['#020617', '#1e40af', '#22D3EE']}
              speed={0.5}
              starDensity={0.6}
              scale={0.8}
              intensity={0.9}
            />
          </div>
        </DemoCard>
      </DocsSection>

      <DocsSection title="Usage">
        <CodeBlock code={SNIPPET} language="tsx" />
      </DocsSection>

      <DocsSection title="Props">
        <ul className="grid gap-2 sm:grid-cols-2">
          {[
            ['colors', 'Three hex colors: [void, mid-cloud, bright-core].'],
            ['speed', 'Animation speed multiplier. Default 1.'],
            ['starDensity', 'Star count multiplier (0..2). Default 1.'],
            ['scale', 'Cloud scale — higher = finer detail. Default 1.'],
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
