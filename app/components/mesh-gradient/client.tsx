'use client'

import { MeshGradient } from '@/components/bahrawy/mesh-gradient'
import { CodeBlock } from '@/components/showcase/code-block'
import { DocsPage, DocsSection, DemoCard } from '@/components/showcase/docs-page'

const SNIPPET = `import { MeshGradient } from '@/components/bahrawy/mesh-gradient'

<div className="h-screen w-full">
  <MeshGradient
    colors={['#A78BFA', '#22D3EE', '#F472B6', '#FBBF24', '#34D399']}
    speed={1}
    blobSize={0.55}
    intensity={0.9}
  />
</div>`

export default function MeshGradientDocs() {
  return (
    <DocsPage
      title="Mesh Gradient"
      slug="mesh-gradient"
      description="A Stripe-homepage-style fluid mesh gradient rendered in a single OGL fragment shader. Five colored blobs drift around the canvas — each with a hand-tuned base position, per-blob orbit speed, and phase offset. Soft smoothstep falloff + chained mix() calls melt adjacent colors into each other rather than blocking out. Subtle film grain prevents banding on big flat blends."
      category="58 · background"
    >
      <DocsSection title="Default (violet / cyan / pink / amber / green)">
        <DemoCard className="min-h-[480px] overflow-hidden p-0">
          <div className="h-[480px] w-full">
            <MeshGradient />
          </div>
        </DemoCard>
      </DocsSection>

      <DocsSection title="Cool (deep blues + violet)">
        <DemoCard className="min-h-[420px] overflow-hidden p-0">
          <div className="h-[420px] w-full">
            <MeshGradient
              colors={['#1e3a8a', '#3b82f6', '#22D3EE', '#A78BFA', '#0c4a6e']}
              background="#040414"
              intensity={1}
              blobSize={0.6}
            />
          </div>
        </DemoCard>
      </DocsSection>

      <DocsSection title="Sunset (warm rose → amber)">
        <DemoCard className="min-h-[420px] overflow-hidden p-0">
          <div className="h-[420px] w-full">
            <MeshGradient
              colors={['#FB7185', '#FBBF24', '#F472B6', '#A21CAF', '#7C2D12']}
              background="#0e0508"
              intensity={1}
              speed={0.65}
              blobSize={0.6}
            />
          </div>
        </DemoCard>
      </DocsSection>

      <DocsSection title="Mono accent (single colour family)">
        <DemoCard className="min-h-[360px] overflow-hidden p-0">
          <div className="h-[360px] w-full">
            <MeshGradient
              colors={['#A78BFA', '#7C3AED', '#5B21B6', '#A78BFA', '#C4B5FD']}
              background="#0a0612"
              intensity={1}
              speed={0.5}
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
            ['colors', 'Up to 5 hex colors blended across the canvas. Extras ignored.'],
            ['background', 'Base background color. Default #050507.'],
            ['speed', 'Animation speed multiplier. Default 1.'],
            ['blobSize', 'Blob radius (0..1). Default 0.55.'],
            ['intensity', 'Blend intensity 0..1 — higher = more saturated. Default 0.9.'],
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
