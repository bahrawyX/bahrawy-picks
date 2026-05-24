'use client'

import { useState } from 'react'
import {
  ScrollPathReveal,
  type ScrollPathRevealVariant,
} from '@/components/bahrawy/scroll-path-reveal'
import { CodeBlock } from '@/components/showcase/code-block'
import { DocsPage, DocsSection } from '@/components/showcase/docs-page'
import { ControlPanel, SelectControl } from '@/components/showcase/control-panel'

export default function ScrollPathRevealDocs() {
  const [variant, setVariant] = useState<ScrollPathRevealVariant>('primary')
  const [key, setKey] = useState(0)

  const snippet = `import { ScrollPathReveal } from '@/components/bahrawy/scroll-path-reveal'

<ScrollPathReveal variant="${variant}" />`

  return (
    <DocsPage
      category="70 · scroll"
      title="Scroll Path Reveal"
      slug="scroll-path-reveal"
      description="A signature calligraphic path that draws itself as you scroll. Powered by framer-motion's pathLength motion value — no JS animation loop, no layout reads, just GPU-driven stroke."
    >
      <DocsSection
        title="Live demo"
        description="Scroll through the section to draw the path. The stroke fills in lockstep with scroll position."
      >
        <ControlPanel onReplay={() => setKey((k) => k + 1)}>
          <SelectControl
            label="Variant"
            value={variant}
            onChange={(v) => {
              setVariant(v as ScrollPathRevealVariant)
              setKey((k) => k + 1)
            }}
            options={[
              { label: 'Primary', value: 'primary' },
              { label: 'Muted', value: 'muted' },
              { label: 'Warm', value: 'warm' },
              { label: 'Gradient', value: 'gradient' },
            ]}
          />
        </ControlPanel>
      </DocsSection>

      <ScrollPathReveal
        key={key}
        variant={variant}
        className="rounded-xl border border-white/10"
      />

      <DocsSection title="Usage">
        <CodeBlock code={snippet} language="tsx" />
      </DocsSection>

      <DocsSection title="Dependencies">
        <div className="flex flex-wrap gap-2">
          {['framer-motion'].map((d) => (
            <code
              key={d}
              className="rounded-md border border-white/10 bg-white/[0.04] px-2 py-1 font-mono text-xs text-white/80"
            >
              {d}
            </code>
          ))}
        </div>
      </DocsSection>
    </DocsPage>
  )
}
