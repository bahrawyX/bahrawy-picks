'use client'

import { useState } from 'react'
import { LoaderDots } from '@/components/bahrawy/loader-dots'
import { CodeBlock } from '@/components/showcase/code-block'
import { DocsPage, DocsSection, DemoCard } from '@/components/showcase/docs-page'
import { ControlPanel, SliderControl, SelectControl } from '@/components/showcase/control-panel'

const COLORS = { white: '#FFFFFF', red: '#EF2B2D', emerald: '#10B981', sky: '#38BDF8', amber: '#F59E0B' }

export default function LoaderDotsDocs() {
  const [size, setSize] = useState(8)
  const [duration, setDuration] = useState(1.1)
  const [color, setColor] = useState<keyof typeof COLORS>('white')

  return (
    <DocsPage
      title="Loader Dots"
      slug="loader-dots"
      description="Three dots that pulse in sequence — the typing/loading indicator. Configurable size, color, speed."
      category="112 · motion"
    >
      <DocsSection title="Live demo">
        <DemoCard className="min-h-[260px]">
          <div className="flex flex-col items-center gap-10">
            <LoaderDots size={size} color={COLORS[color]} duration={duration} />
            <LoaderDots size={size} color={COLORS[color]} duration={duration} label="Sending message" />
          </div>
        </DemoCard>
        <ControlPanel>
          <SliderControl label="Size" value={size} onChange={setSize} min={4} max={20} step={1} unit="px" />
          <SliderControl label="Duration" value={duration} onChange={setDuration} min={0.4} max={2.4} step={0.1} unit="s" />
          <SelectControl
            label="Color"
            value={color}
            onChange={(v) => setColor(v as keyof typeof COLORS)}
            options={Object.keys(COLORS).map((k) => ({ label: k, value: k }))}
          />
        </ControlPanel>
      </DocsSection>
      <DocsSection title="Usage">
        <CodeBlock code={`<LoaderDots size={${size}} color="${COLORS[color]}" duration={${duration}} />`} language="tsx" />
      </DocsSection>
    </DocsPage>
  )
}
