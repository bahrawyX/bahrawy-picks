'use client'

import { useState } from 'react'
import { SplitReveal } from '@/components/bahrawy/animations'
import { CodeBlock } from '@/components/showcase/code-block'
import { DemoCard, DocsPage, DocsSection } from '@/components/showcase/docs-page'
import {
  ControlPanel,
  SelectControl,
  SliderControl,
} from '@/components/showcase/control-panel'

export default function SplitRevealDocs() {
  const [key, setKey] = useState(0)
  const [direction, setDirection] = useState<'horizontal' | 'vertical'>('horizontal')
  const [trigger, setTrigger] = useState<'hover' | 'click' | 'inView' | 'manual'>('hover')
  const [duration, setDuration] = useState(0.6)
  const [gap, setGap] = useState(8)

  const replay = () => setKey((k) => k + 1)

  const snippet = `import { SplitReveal } from '@/components/bahrawy/animations'

<SplitReveal
  direction="${direction}"
  trigger="${trigger}"
  duration={${duration}}
  gap={${gap}}
  front={
    <div className="flex h-48 items-center justify-center rounded-xl bg-zinc-800 text-white/60">
      ${trigger === 'hover' ? 'Hover to reveal' : trigger === 'click' ? 'Click to reveal' : 'Watch it split'}
    </div>
  }
  back={
    <div className="flex h-48 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 text-white font-semibold text-lg">
      Hidden content!
    </div>
  }
/>`

  return (
    <DocsPage
      category="15 · motion"
      title="Split reveal"
      slug="split-reveal"
      description="Two halves of a front layer split apart to reveal content underneath, like opening curtains. Supports horizontal and vertical splits with hover, click, scroll, or manual triggers."
    >
      <DocsSection title="Live demo">
        <DemoCard className="items-center justify-center min-h-[250px]">
          <div className="w-full max-w-sm">
            <SplitReveal
              key={key}
              front={
                <div className="flex h-48 items-center justify-center rounded-xl bg-zinc-800 text-white/60">
                  {trigger === 'hover' ? 'Hover to reveal' : trigger === 'click' ? 'Click to reveal' : 'Watch it split'}
                </div>
              }
              back={
                <div className="flex h-48 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 text-white font-semibold text-lg">
                  Hidden content!
                </div>
              }
              direction={direction}
              trigger={trigger}
              duration={duration}
              gap={gap}
            />
          </div>
        </DemoCard>

        <ControlPanel onReplay={replay}>
          <SelectControl
            label="Direction"
            value={direction}
            onChange={(v) => setDirection(v as 'horizontal' | 'vertical')}
            options={[
              { label: 'Horizontal', value: 'horizontal' },
              { label: 'Vertical', value: 'vertical' },
            ]}
          />
          <SelectControl
            label="Trigger"
            value={trigger}
            onChange={(v) => setTrigger(v as 'hover' | 'click' | 'inView' | 'manual')}
            options={[
              { label: 'Hover', value: 'hover' },
              { label: 'Click', value: 'click' },
              { label: 'In View', value: 'inView' },
              { label: 'Manual', value: 'manual' },
            ]}
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
            label="Gap"
            value={gap}
            onChange={setGap}
            min={0}
            max={30}
            step={1}
            unit="px"
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
