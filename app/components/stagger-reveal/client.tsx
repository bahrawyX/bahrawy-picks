'use client'

import { useState } from 'react'
import { StaggerReveal } from '@/components/bahrawy/animations'
import { CodeBlock } from '@/components/showcase/code-block'
import { DemoCard, DocsPage, DocsSection } from '@/components/showcase/docs-page'
import {
  ControlPanel,
  SelectControl,
  SliderControl,
} from '@/components/showcase/control-panel'

export default function StaggerRevealDocs() {
  const [key, setKey] = useState(0)
  const [direction, setDirection] = useState('up')
  const [stagger, setStagger] = useState(0.1)
  const [duration, setDuration] = useState(0.5)
  const [distance, setDistance] = useState(30)
  const [delay, setDelay] = useState(0)

  const replay = () => setKey((k) => k + 1)

  const snippet = `<StaggerReveal
  direction="${direction}"
  stagger={${stagger}}
  duration={${duration}}
  delay={${delay}}
  distance={${distance}}
  once={false}
>
  {items.map((item) => (
    <div key={item}>{item}</div>
  ))}
</StaggerReveal>`

  return (
    <DocsPage
      title="Stagger Reveal"
      slug="stagger-reveal"
      description="Animate children into view one by one with configurable direction, stagger delay, and distance. Supports up, down, left, right, scale, and fade directions."
      category="56 · MOTION"
    >
      <DocsSection title="Preview" description="Tweak direction, timing, and distance, then hit Replay to see the animation.">
        <DemoCard className="items-start justify-center min-h-[200px]">
          <StaggerReveal
            key={key}
            direction={direction as 'up' | 'down' | 'left' | 'right' | 'scale' | 'fade'}
            stagger={stagger}
            duration={duration}
            delay={delay}
            distance={distance}
            once={false}
            className="flex flex-wrap gap-3 w-full justify-center"
          >
            {['Component', 'Library', 'Animations', 'Tailwind', 'React', 'Motion'].map((label) => (
              <div
                key={label}
                className="rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-medium text-white/70"
              >
                {label}
              </div>
            ))}
          </StaggerReveal>
        </DemoCard>
        <ControlPanel onReplay={replay}>
          <SelectControl
            label="Direction"
            value={direction}
            onChange={(v) => { setDirection(v); replay() }}
            options={[
              { label: 'Up', value: 'up' },
              { label: 'Down', value: 'down' },
              { label: 'Left', value: 'left' },
              { label: 'Right', value: 'right' },
              { label: 'Scale', value: 'scale' },
              { label: 'Fade', value: 'fade' },
            ]}
          />
          <SliderControl
            label="Stagger"
            value={stagger}
            onChange={setStagger}
            min={0.02}
            max={0.3}
            step={0.02}
            unit="s"
          />
          <SliderControl
            label="Duration"
            value={duration}
            onChange={setDuration}
            min={0.2}
            max={1.5}
            step={0.1}
            unit="s"
          />
          <SliderControl
            label="Distance"
            value={distance}
            onChange={setDistance}
            min={10}
            max={80}
            step={5}
            unit="px"
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
