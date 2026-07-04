'use client'

import { useState } from 'react'
import { Sparkline } from '@/components/bahrawy/sparkline'
import { CodeBlock } from '@/components/showcase/code-block'
import { DocsPage, DocsSection, DemoCard } from '@/components/showcase/docs-page'
import { ControlPanel, SelectControl, SliderControl, ToggleControl } from '@/components/showcase/control-panel'

const COLORS = { white: '#FFFFFF', purple: '#A78BFA', cyan: '#22D3EE', emerald: '#10B981', rose: '#F472B6' }

const UP = [12, 15, 13, 17, 19, 22, 21, 26, 28, 30, 34, 38, 42, 44, 48]
const VOLATILE = [22, 28, 19, 30, 24, 36, 27, 33, 22, 40, 30, 44, 28, 50]
const DOWN = [48, 44, 42, 38, 34, 30, 28, 26, 21, 22, 19, 17, 13, 15, 12]

export default function SparklineDocs() {
  const [color, setColor] = useState<keyof typeof COLORS>('purple')
  const [stroke, setStroke] = useState(1.8)
  const [fillArea, setFillArea] = useState(true)
  const [showEndDot, setShowEndDot] = useState(true)

  return (
    <DocsPage
      title="Sparkline"
      slug="sparkline"
      description="A tiny SVG line chart that draws itself on mount. Optional area fill, optional end-point dot."
      category="127 · data"
    >
      <DocsSection title="Live demo">
        <DemoCard className="min-h-[280px]">
          <div className="grid w-full max-w-2xl grid-cols-1 gap-6 sm:grid-cols-3">
            {[
              { label: 'Up & to the right', data: UP },
              { label: 'Volatile', data: VOLATILE },
              { label: 'Falling', data: DOWN },
            ].map((set) => (
              <div key={set.label} className="rounded-lg border border-white/10 bg-white/[0.02] p-4">
                <p className="mb-2 text-[11px] uppercase tracking-[0.16em] text-white/40">{set.label}</p>
                <Sparkline
                  points={set.data}
                  color={COLORS[color]}
                  strokeWidth={stroke}
                  fillArea={fillArea}
                  showEndDot={showEndDot}
                  width={200}
                  height={60}
                  className="w-full"
                />
              </div>
            ))}
          </div>
        </DemoCard>
        <ControlPanel>
          <SelectControl
            label="Color"
            value={color}
            onChange={(v) => setColor(v as keyof typeof COLORS)}
            options={Object.keys(COLORS).map((k) => ({ label: k, value: k }))}
          />
          <SliderControl label="Stroke" value={stroke} onChange={setStroke} min={1} max={4} step={0.1} unit="px" />
          <ToggleControl label="Fill area" checked={fillArea} onChange={setFillArea} />
          <ToggleControl label="End dot" checked={showEndDot} onChange={setShowEndDot} />
        </ControlPanel>
      </DocsSection>
      <DocsSection title="Usage">
        <CodeBlock code={`<Sparkline points={[12, 15, 13, 17, 22]} color="${COLORS[color]}" fillArea />`} language="tsx" />
      </DocsSection>
      <DocsSection title="Props">
        <ul className="grid gap-2 sm:grid-cols-2">
          {[
            ['points', 'number[] — y values, evenly spaced on the x-axis.'],
            ['width / height', 'SVG size in px. Default 160 × 40.'],
            ['color', 'Stroke color. Default #FFFFFF.'],
            ['strokeWidth', 'Stroke width. Default 1.5.'],
            ['fillArea', 'Soft gradient fill under the line. Default false.'],
            ['showEndDot', 'Dot at the last point. Default true.'],
            ['duration', 'Draw duration in seconds. Default 0.9.'],
            ['responsive', 'Fill the container width (100%), scaling via the viewBox. Default false.'],
            ['label', 'Accessible label — switches the SVG from aria-hidden (decorative) to role="img".'],
            ['className', 'Extra classes on the SVG.'],
          ].map(([n, b]) => (
            <li key={n} className="rounded-lg border border-white/10 bg-white/[0.02] p-3">
              <code className="font-mono text-xs text-white">{n}</code>
              <p className="mt-1 text-xs text-white/60">{b}</p>
            </li>
          ))}
        </ul>
      </DocsSection>
    </DocsPage>
  )
}
