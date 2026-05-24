'use client'

import { useState } from 'react'
import { FlipText } from '@/components/bahrawy/animations'
import { CodeBlock } from '@/components/showcase/code-block'
import {
  DemoCard,
  DocsPage,
  DocsSection,
} from '@/components/showcase/docs-page'
import {
  ControlPanel,
  SliderControl,
  ToggleControl,
} from '@/components/showcase/control-panel'

export default function FlipTextDocs() {
  const [key, setKey] = useState(0)
  const [stagger, setStagger] = useState(0.06)
  const [duration, setDuration] = useState(0.3)
  const [perspective, setPerspective] = useState(400)
  const [once, setOnce] = useState(true)

  const replay = () => setKey((k) => k + 1)

  const snippet = `<FlipText
  text="DEPARTURES"
  stagger={${stagger}}
  duration={${duration}}
  perspective={${perspective}}
  once={${once}}
  className="text-5xl font-bold tracking-widest text-white"
/>`

  return (
    <DocsPage
      title="Flip Text"
      slug="flip-text"
      description="3D flip animation that reveals text character by character with configurable stagger, duration, and perspective."
      category="63 · MOTION"
    >
      <DocsSection title="Preview" description="Each character flips into view with a staggered 3D rotation.">
        <DemoCard className="items-center justify-center min-h-[200px]">
          <FlipText
            key={key}
            text="DEPARTURES"
            className="text-5xl font-bold tracking-widest text-white"
            charClassName="text-white"
            stagger={stagger}
            duration={duration}
            perspective={perspective}
            once={false}
          />
        </DemoCard>
        <ControlPanel onReplay={replay}>
          <SliderControl
            label="Stagger"
            value={stagger}
            onChange={setStagger}
            min={0.02}
            max={0.2}
            step={0.01}
            unit="s"
          />
          <SliderControl
            label="Duration"
            value={duration}
            onChange={setDuration}
            min={0.1}
            max={1}
            step={0.05}
            unit="s"
          />
          <SliderControl
            label="Perspective"
            value={perspective}
            onChange={setPerspective}
            min={100}
            max={1000}
            step={50}
            unit="px"
          />
          <ToggleControl
            label="Once"
            checked={once}
            onChange={setOnce}
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
