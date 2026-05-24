'use client'

import { ParticleField } from '@/components/bahrawy/particle-field'
import { CodeBlock } from '@/components/showcase/code-block'
import { DocsPage, DocsSection, DemoCard } from '@/components/showcase/docs-page'

const SNIPPET = `import { ParticleField } from '@/components/bahrawy/particle-field'

<div className="h-[480px] w-full">
  <ParticleField
    count={8000}
    color="#A78BFA"
    radius={1.6}
    strength={0.6}
  />
</div>`

export default function ParticleFieldDocs() {
  return (
    <DocsPage
      title="Particle Field"
      slug="particle-field"
      description="A real WebGL particle field rendered with Three.js. 8000 GL points sit in a grid; each frame the cursor is raycast onto a plane and any particle inside the influence radius gets pushed outward in proportion to (1 − dist/radius)². Particles spring back when the cursor leaves, with a tiny continuous Z-wave so the field stays alive on idle. Single draw call, custom point shader, additive blending."
      category="07 · background"
    >
      <DocsSection title="Move your cursor over the field">
        <DemoCard className="min-h-[520px] overflow-hidden p-0">
          <div className="h-[520px] w-full">
            <ParticleField count={8000} color="#A78BFA" radius={1.6} strength={0.6} />
          </div>
        </DemoCard>
      </DocsSection>

      <DocsSection title="Cyan, denser, weaker push">
        <DemoCard className="min-h-[420px] overflow-hidden p-0">
          <div className="h-[420px] w-full">
            <ParticleField count={12000} color="#22D3EE" radius={1.2} strength={0.35} size={1.2} />
          </div>
        </DemoCard>
      </DocsSection>

      <DocsSection title="Usage">
        <CodeBlock code={SNIPPET} language="tsx" />
      </DocsSection>

      <DocsSection title="Props">
        <ul className="grid gap-2 sm:grid-cols-2">
          {[
            ['count', 'Total particles. Default 8000.'],
            ['color', 'Particle base color. Default violet.'],
            ['radius', 'Cursor repulsion radius (world units). Default 1.6.'],
            ['strength', 'Repulsion strength multiplier. Default 0.6.'],
            ['size', 'Base point size. Default 1.6.'],
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
