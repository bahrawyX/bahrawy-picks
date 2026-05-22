'use client'

import { HologramCard } from '@/components/bahrawy/hologram-card'
import { CodeBlock } from '@/components/showcase/code-block'
import { DocsPage, DocsSection, DemoCard } from '@/components/showcase/docs-page'

const SNIPPET = `import { HologramCard } from '@/components/bahrawy/hologram-card'

<HologramCard
  image="/portrait.jpg"
  eyebrow="Holographic"
  title="Card art"
  metaLeft="Bahrawy · Series 01"
  metaRight="042 / 250"
  tilt={16}
  foilStrength={0.55}
/>`

export default function HologramCardDocs() {
  return (
    <DocsPage
      title="Hologram Card"
      slug="hologram-card"
      description="A trading-card panel with a holographic-foil overlay. Cursor tilts the card in 3D and shifts an iridescent rainbow gradient across the surface, like real foil catching light from a moving source."
      category="126 · card"
    >
      <DocsSection title="Live demo" description="Move your cursor over the card. Tilt + iridescence track the cursor; specular sheen follows the pointer like a spotlight.">
        <DemoCard className="min-h-[520px]">
          <HologramCard
            image="https://images.unsplash.com/photo-1604881991720-f91add269bed?w=900&q=80&auto=format&fit=crop"
            eyebrow="Holographic"
            title="Card art"
            metaLeft="Bahrawy · Series 01"
            metaRight="042 / 250"
          />
        </DemoCard>
      </DocsSection>

      <DocsSection title="Usage"><CodeBlock code={SNIPPET} language="tsx" /></DocsSection>

      <DocsSection title="Props">
        <ul className="grid gap-2 sm:grid-cols-2">
          {[
            ['image', 'Card artwork (URL).'],
            ['title', 'Headline rendered top-left of the card.'],
            ['eyebrow', 'Tiny tag above the title.'],
            ['metaLeft / metaRight', 'Bottom-row meta lines (left / right aligned).'],
            ['tilt', 'Max tilt in degrees at the corners. Default 16.'],
            ['foilStrength', '0–1 iridescent overlay peak intensity. Default 0.55.'],
            ['aspect', 'CSS aspect-ratio. Default "2.5 / 3.5" (real trading card).'],
            ['className', 'Extra classes on the wrapper.'],
          ].map(([n, b]) => (
            <li key={n} className="rounded-lg border border-white/10 bg-white/[0.02] p-3">
              <code className="font-mono text-xs text-white">{n}</code>
              <p className="mt-1 text-xs text-white/60">{b}</p>
            </li>
          ))}
        </ul>
      </DocsSection>

      <DocsSection title="Dependencies">
        <div className="text-xs text-white/55">No external runtime dependencies — just React + CSS.</div>
      </DocsSection>
    </DocsPage>
  )
}
