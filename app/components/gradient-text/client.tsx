'use client'

import { useState } from 'react'
import { GradientText } from '@/components/bahrawy/animations'
import { CodeBlock } from '@/components/showcase/code-block'
import { DemoCard, DocsPage, DocsSection } from '@/components/showcase/docs-page'
import {
  ControlPanel,
  SelectControl,
  SliderControl,
  ToggleControl,
} from '@/components/showcase/control-panel'

export default function GradientTextDocs() {
  const [key, setKey] = useState(0)
  const [preset, setPreset] = useState<'aurora' | 'fire' | 'ocean' | 'candy' | 'gold' | 'rainbow'>('aurora')
  const [duration, setDuration] = useState(4)
  const [animated, setAnimated] = useState(true)

  const replay = () => setKey((k) => k + 1)

  const snippet = `<GradientText
  preset="${preset}"
  duration={${duration}}
  animated={${animated}}
  as="h2"
  className="text-5xl font-bold tracking-tight"
>
  Gradient in motion
</GradientText>`

  return (
    <DocsPage
      title="Gradient Text"
      slug="gradient-text"
      description="Text with an animated flowing gradient using CSS background-clip. Choose from built-in presets like aurora, fire, ocean, and more."
      category="64 · MOTION"
    >
      <DocsSection title="Preview" description="Pick a preset and tweak the animation speed.">
        <DemoCard className="items-center justify-center min-h-[200px]">
          <GradientText
            key={key}
            preset={preset}
            duration={duration}
            animated={animated}
            as="h2"
            className="text-5xl font-bold tracking-tight"
          >
            Gradient in motion
          </GradientText>
        </DemoCard>
        <ControlPanel onReplay={replay}>
          <SelectControl
            label="Preset"
            value={preset}
            onChange={(v) => { setPreset(v as typeof preset); replay() }}
            options={[
              { label: 'Aurora', value: 'aurora' },
              { label: 'Fire', value: 'fire' },
              { label: 'Ocean', value: 'ocean' },
              { label: 'Candy', value: 'candy' },
              { label: 'Gold', value: 'gold' },
              { label: 'Rainbow', value: 'rainbow' },
            ]}
          />
          <SliderControl
            label="Cycle Duration"
            value={duration}
            onChange={setDuration}
            min={1}
            max={15}
            step={0.5}
            unit="s"
          />
          <ToggleControl
            label="Animated"
            checked={animated}
            onChange={setAnimated}
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
