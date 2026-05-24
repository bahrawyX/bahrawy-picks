'use client'

import { useState, useEffect } from 'react'
import { ProgressRing } from '@/components/bahrawy/progress-ring'
import { CodeBlock } from '@/components/showcase/code-block'
import { DocsPage, DocsSection, DemoCard } from '@/components/showcase/docs-page'
import {
  ControlPanel,
  SliderControl,
  SelectControl,
  ToggleControl,
} from '@/components/showcase/control-panel'

const COLORS = {
  white: '#FFFFFF',
  red: '#EF2B2D',
  emerald: '#10B981',
  sky: '#38BDF8',
  amber: '#F59E0B',
}

export default function ProgressRingDocs() {
  const [value, setValue] = useState(72)
  const [size, setSize] = useState(120)
  const [stroke, setStroke] = useState(10)
  const [color, setColor] = useState<keyof typeof COLORS>('white')
  const [animate, setAnimate] = useState(false)

  // When animate is on, walk the value back and forth so the spring glides.
  useEffect(() => {
    if (!animate) return
    let dir = 1
    const id = setInterval(() => {
      setValue((v) => {
        if (v >= 95) dir = -1
        if (v <= 5) dir = 1
        return Math.max(0, Math.min(100, v + dir * 8))
      })
    }, 700)
    return () => clearInterval(id)
  }, [animate])

  const snippet = `import { ProgressRing } from '@/components/bahrawy/progress-ring'

<ProgressRing
  value={${value}}
  size={${size}}
  strokeWidth={${stroke}}
  color="${COLORS[color]}"
/>`

  return (
    <DocsPage
      title="Progress Ring"
      slug="progress-ring"
      description="Circular progress indicator. The stroke and the center label both spring smoothly to the new value — drag the slider or toggle Animate to watch."
      category="85 · ui"
    >
      <DocsSection title="Live demo">
        <DemoCard className="min-h-[280px]">
          <div className="flex flex-wrap items-center justify-center gap-10">
            <ProgressRing value={value} size={size} strokeWidth={stroke} color={COLORS[color]} />
            <ProgressRing value={Math.max(0, value - 30)} size={64} strokeWidth={6} color={COLORS[color]} />
            <ProgressRing value={Math.min(100, value + 15)} size={48} strokeWidth={5} color={COLORS[color]} showLabel={false} />
          </div>
        </DemoCard>

        <ControlPanel>
          <SliderControl label="Value" value={value} onChange={setValue} min={0} max={100} step={1} unit="%" />
          <SliderControl label="Size" value={size} onChange={setSize} min={48} max={200} step={4} unit="px" />
          <SliderControl label="Stroke" value={stroke} onChange={setStroke} min={2} max={20} step={1} unit="px" />
          <SelectControl
            label="Color"
            value={color}
            onChange={(v) => setColor(v as keyof typeof COLORS)}
            options={Object.keys(COLORS).map((k) => ({ label: k, value: k }))}
          />
          <ToggleControl label="Animate" checked={animate} onChange={setAnimate} />
        </ControlPanel>
      </DocsSection>

      <DocsSection title="Usage">
        <CodeBlock code={snippet} language="tsx" />
      </DocsSection>

      <DocsSection title="Props">
        <ul className="grid gap-2 sm:grid-cols-2">
          {[
            ['value', 'Progress 0–100 (clamped).'],
            ['size', 'Ring diameter in px. Default 96.'],
            ['strokeWidth', 'Stroke thickness. Default 8.'],
            ['color', 'Progress arc color. Default #FFFFFF.'],
            ['trackColor', 'Empty track color. Default white-10%.'],
            ['showLabel', 'Show "%" in the center. Default true.'],
            ['label', 'Custom center node (overrides %).'],
            ['className', 'Extra classes on the wrapper.'],
          ].map(([n, b]) => (
            <li key={n} className="rounded-lg border border-white/10 bg-white/[0.02] p-3">
              <code className="font-mono text-xs text-white">{n}</code>
              <p className="mt-1 text-xs text-white/60">{b}</p>
            </li>
          ))}
        </ul>
      </DocsSection>

      <DocsSection title="Dependencies">
        <div className="flex flex-wrap gap-2">
          <code className="rounded-md border border-white/10 bg-white/[0.04] px-2 py-1 font-mono text-xs text-white/80">framer-motion</code>
        </div>
      </DocsSection>
    </DocsPage>
  )
}
