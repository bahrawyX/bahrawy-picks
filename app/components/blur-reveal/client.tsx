'use client'

import { useState } from 'react'
import { BlurReveal } from '@/components/bahrawy/animations'
import { CodeBlock } from '@/components/showcase/code-block'
import {
  DemoCard,
  DocsPage,
  DocsSection,
} from '@/components/showcase/docs-page'
import {
  ControlPanel,
  SelectControl,
  SliderControl,
} from '@/components/showcase/control-panel'

export default function BlurRevealDocs() {
  const [key, setKey] = useState(0)
  const [direction, setDirection] = useState('up')
  const [duration, setDuration] = useState(0.8)
  const [blur, setBlur] = useState(20)
  const [stagger, setStagger] = useState(0.15)
  const [delay, setDelay] = useState(0)

  const replay = () => setKey((k) => k + 1)

  const snippet = `<BlurReveal
  direction="${direction}"
  duration={${duration}}
  blur={${blur}}
  stagger={${stagger}}
  delay={${delay}}
  once={false}
>
  <h3 className="text-3xl font-bold text-white">Coming into focus</h3>
  <p className="mt-2 text-lg text-white/50">Watch the blur dissolve away</p>
</BlurReveal>`

  return (
    <DocsPage
      category="82 · motion"
      title="Blur Reveal"
      slug="blur-reveal"
      description="Content fades in from a heavy blur to sharp focus, like a camera adjusting. Each child is staggered so they reveal sequentially."
    >
      <DocsSection title="Interactive demo">
        <DemoCard>
          <BlurReveal
            key={key}
            direction={direction as 'up' | 'down' | 'left' | 'right' | 'center'}
            blur={blur}
            stagger={stagger}
            duration={duration}
            delay={delay}
            once={false}
          >
            <h3 className="text-3xl font-bold text-white">Coming into focus</h3>
            <p className="mt-2 text-lg text-white/50">Watch the blur dissolve away</p>
          </BlurReveal>
        </DemoCard>

        <ControlPanel onReplay={replay}>
          <SelectControl
            label="Direction"
            value={direction}
            onChange={setDirection}
            options={[
              { label: 'Up', value: 'up' },
              { label: 'Down', value: 'down' },
              { label: 'Left', value: 'left' },
              { label: 'Right', value: 'right' },
              { label: 'Center', value: 'center' },
            ]}
          />
          <SliderControl
            label="Duration"
            value={duration}
            onChange={setDuration}
            min={0.2}
            max={2}
            step={0.1}
            unit="s"
          />
          <SliderControl
            label="Blur"
            value={blur}
            onChange={setBlur}
            min={5}
            max={40}
            step={1}
            unit="px"
          />
          <SliderControl
            label="Stagger"
            value={stagger}
            onChange={setStagger}
            min={0.05}
            max={0.5}
            step={0.05}
            unit="s"
          />
          <SliderControl
            label="Delay"
            value={delay}
            onChange={setDelay}
            min={0}
            max={2}
            step={0.1}
            unit="s"
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
