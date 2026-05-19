'use client'

import { useState } from 'react'
import { ScrollPathReveal } from '@/components/bahrawy/scroll-path-reveal'
import { CodeBlock } from '@/components/showcase/code-block'
import { DocsPage, DocsSection } from '@/components/showcase/docs-page'
import { ControlPanel, SelectControl } from '@/components/showcase/control-panel'

export default function ScrollPathRevealDocs() {
  const [variant, setVariant] = useState<'white' | 'aurora' | 'gold' | 'neon'>(
    'white'
  )
  const [key, setKey] = useState(0)

  const sections = [
    {
      id: 'step-1',
      title: 'Browse & Pick',
      pathPosition: 0.2,
      content: (
        <p>
          Explore 35+ production-ready components. Each one is polished,
          accessible, and ready for your project.
        </p>
      ),
    },
    {
      id: 'step-2',
      title: 'Copy the Code',
      pathPosition: 0.4,
      content: (
        <p>
          One-click copy. Every component is self-contained — no hidden
          dependencies or complex setup required.
        </p>
      ),
    },
    {
      id: 'step-3',
      title: 'Customize Everything',
      pathPosition: 0.6,
      content: (
        <p>
          Full TypeScript props, Tailwind styling, and Framer Motion animations.
          Make it yours in minutes.
        </p>
      ),
    },
    {
      id: 'step-4',
      title: 'Ship It',
      pathPosition: 0.8,
      content: (
        <p>
          Production-tested components that work on every browser and device.
          Build faster, ship with confidence.
        </p>
      ),
    },
  ]

  const snippet = `import { ScrollPathReveal } from '@/components/bahrawy/scroll-path-reveal'

<ScrollPathReveal
  variant="${variant}"
  sections={[
    { id: 'intro', title: 'Introduction', pathPosition: 0.2, content: <p>...</p> },
    { id: 'features', title: 'Features', pathPosition: 0.5, content: <p>...</p> },
    { id: 'cta', title: 'Get Started', pathPosition: 0.8, content: <p>...</p> },
  ]}
/>`

  return (
    <DocsPage
      category="15 · scroll"
      title="Scroll Path Reveal"
      slug="scroll-path-reveal"
      description="SVG bezier path that draws itself on scroll with a traveling orb and content sections that animate in as the path reaches them. Supports white, aurora, gold, and neon color variants."
    >
      <DocsSection
        title="Live demo"
        description="Scroll down to see the path draw itself and sections appear."
      >
        <ControlPanel
          onReplay={() => setKey((k) => k + 1)}
        >
          <SelectControl
            label="Variant"
            value={variant}
            onChange={(v) => {
              setVariant(v as typeof variant)
              setKey((k) => k + 1)
            }}
            options={[
              { label: 'White', value: 'white' },
              { label: 'Aurora', value: 'aurora' },
              { label: 'Gold', value: 'gold' },
              { label: 'Neon', value: 'neon' },
            ]}
          />
        </ControlPanel>
      </DocsSection>

      {/* The actual full-height demo */}
      <ScrollPathReveal
        key={key}
        variant={variant}
        sections={sections}
        className="rounded-xl border border-white/10"
      />

      <DocsSection title="Usage">
        <CodeBlock code={snippet} language="tsx" />
      </DocsSection>

      <DocsSection title="Dependencies">
        <div className="flex flex-wrap gap-2">
          {['gsap', '@gsap/react'].map((d) => (
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
