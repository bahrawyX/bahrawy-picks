'use client'

import { useState } from 'react'
import { FloatingElements } from '@/components/bahrawy/animations'
import { CodeBlock } from '@/components/showcase/code-block'
import { DemoCard, DocsPage, DocsSection } from '@/components/showcase/docs-page'
import {
  ControlPanel,
  SliderControl,
  ToggleControl,
} from '@/components/showcase/control-panel'

export default function FloatingElementsDocs() {
  const [key, setKey] = useState(0)
  const [count, setCount] = useState(20)
  const [minSize, setMinSize] = useState(4)
  const [maxSize, setMaxSize] = useState(12)
  const [speed, setSpeed] = useState(1)
  const [mouseRepel, setMouseRepel] = useState(false)
  const [repelStrength, setRepelStrength] = useState(0.3)

  const replay = () => setKey((k) => k + 1)

  const snippet = `import { FloatingElements } from '@/components/bahrawy/animations'

<FloatingElements
  count={${count}}
  size={[${minSize}, ${maxSize}]}
  speed={${speed}}
  opacity={[0.1, 0.4]}
  color="white"
  mouseRepel={${mouseRepel}}
  repelStrength={${repelStrength}}
  className="absolute inset-0"
/>`

  return (
    <DocsPage
      category="69 · motion"
      title="Floating elements"
      slug="floating-elements"
      description="Ambient floating particles that drift smoothly across a container. Supports mouse repel, variable sizing, and configurable speed."
    >
      <DocsSection title="Live demo">
        <DemoCard className="relative items-center justify-center min-h-[300px] overflow-hidden">
          <FloatingElements
            key={key}
            count={count}
            size={[minSize, maxSize]}
            opacity={[0.1, 0.4]}
            speed={speed}
            color="white"
            mouseRepel={mouseRepel}
            repelStrength={repelStrength}
            className="absolute inset-0"
          />
          <p className="relative z-10 text-lg font-medium text-white/70">
            Particles floating around this text
          </p>
        </DemoCard>

        <ControlPanel onReplay={replay}>
          <SliderControl
            label="Count"
            value={count}
            onChange={setCount}
            min={5}
            max={50}
            step={1}
          />
          <SliderControl
            label="Min Size"
            value={minSize}
            onChange={setMinSize}
            min={2}
            max={20}
            step={1}
            unit="px"
          />
          <SliderControl
            label="Max Size"
            value={maxSize}
            onChange={setMaxSize}
            min={5}
            max={30}
            step={1}
            unit="px"
          />
          <SliderControl
            label="Speed"
            value={speed}
            onChange={setSpeed}
            min={0.2}
            max={3}
            step={0.1}
          />
          <ToggleControl
            label="Mouse Repel"
            checked={mouseRepel}
            onChange={setMouseRepel}
          />
          <SliderControl
            label="Repel Strength"
            value={repelStrength}
            onChange={setRepelStrength}
            min={0.1}
            max={1}
            step={0.1}
          />
        </ControlPanel>
      </DocsSection>

      <DocsSection title="Usage">
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
