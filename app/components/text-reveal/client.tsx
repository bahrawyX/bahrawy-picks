'use client'

import { useState } from 'react'
import { TextReveal } from '@/components/bahrawy/animations'
import { CodeBlock } from '@/components/showcase/code-block'
import { DemoCard, DocsPage, DocsSection } from '@/components/showcase/docs-page'
import {
  ControlPanel,
  SelectControl,
  SliderControl,
  ToggleControl,
} from '@/components/showcase/control-panel'

export default function TextRevealDocs() {
  const [key, setKey] = useState(0)
  const [variant, setVariant] = useState<'words' | 'chars' | 'lines'>('words')
  const [duration, setDuration] = useState(0.6)
  const [stagger, setStagger] = useState(0.05)
  const [delay, setDelay] = useState(0)
  const [once, setOnce] = useState(false)

  const replay = () => setKey((k) => k + 1)

  const snippet = `<TextReveal
  text="Beautiful animations that reveal on scroll"
  variant="${variant}"
  duration={${duration}}
  stagger={${stagger}}
  delay={${delay}}
  once={${once}}
  as="h2"
  className="text-2xl font-bold text-white"
/>`

  return (
    <DocsPage
      title="Text Reveal"
      slug="text-reveal"
      description="Words, characters, or lines appear with a clip-mask reveal effect. Each text unit slides up from below, triggered when the element enters the viewport."
      category="60 · MOTION"
    >
      <DocsSection title="Preview" description="Adjust the controls below and hit Replay to see the animation again.">
        <DemoCard className="items-center justify-center min-h-[200px]">
          <TextReveal
            key={key}
            text="Beautiful animations that reveal on scroll"
            variant={variant}
            duration={duration}
            stagger={stagger}
            delay={delay}
            once={once}
            as="h2"
            className="text-2xl font-bold text-white"
          />
        </DemoCard>
        <ControlPanel onReplay={replay}>
          <SelectControl
            label="Variant"
            value={variant}
            onChange={(v) => { setVariant(v as 'words' | 'chars' | 'lines'); replay() }}
            options={[
              { label: 'Words', value: 'words' },
              { label: 'Characters', value: 'chars' },
              { label: 'Lines', value: 'lines' },
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
            label="Stagger"
            value={stagger}
            onChange={setStagger}
            min={0.01}
            max={0.2}
            step={0.01}
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
