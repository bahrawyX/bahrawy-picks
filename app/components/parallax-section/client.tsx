'use client'

import { useState } from 'react'
import { ParallaxSection } from '@/components/bahrawy/animations'
import { CodeBlock } from '@/components/showcase/code-block'
import { DemoCard, DocsPage, DocsSection } from '@/components/showcase/docs-page'
import {
  ControlPanel,
  SliderControl,
} from '@/components/showcase/control-panel'

export default function ParallaxSectionDocs() {
  const [key, setKey] = useState(0)
  const [speed, setSpeed] = useState(-0.3)

  const replay = () => setKey((k) => k + 1)

  const snippet = `<ParallaxSection speed={${speed}}>
  <h1>I move at a different speed on scroll</h1>
</ParallaxSection>`

  return (
    <DocsPage
      title="Parallax Section"
      slug="parallax-section"
      description="Scroll-driven parallax effect that moves children at a different speed relative to the viewport. Negative values move against the scroll direction, positive values move with it."
      category="64 · MOTION"
    >
      <DocsSection title="Preview" description="Scroll the page to see the parallax effect. Adjust speed to control intensity and direction.">
        <DemoCard className="flex-col items-center justify-center min-h-[250px] overflow-hidden">
          <ParallaxSection key={`a-${key}`} speed={speed}>
            <p className="text-3xl font-bold text-white/80">Slow layer</p>
          </ParallaxSection>
          <ParallaxSection key={`b-${key}`} speed={-speed}>
            <p className="text-lg text-white/40 mt-4">Opposite direction</p>
          </ParallaxSection>
        </DemoCard>
        <ControlPanel onReplay={replay}>
          <SliderControl
            label="Speed"
            value={speed}
            onChange={setSpeed}
            min={-1}
            max={1}
            step={0.1}
          />
        </ControlPanel>
        <CodeBlock code={snippet} language="tsx" />
      </DocsSection>

      <DocsSection title="Dependencies">
        <div className="flex flex-wrap gap-2">
          {['framer-motion'].map((d) => (
            <code key={d} className="rounded-md border border-white/10 bg-white/[0.04] px-2 py-1 font-mono text-xs text-white/80">{d}</code>
          ))}
        </div>
      </DocsSection>
    </DocsPage>
  )
}
