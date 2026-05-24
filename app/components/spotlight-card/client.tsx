'use client'

import { useState } from 'react'
import { SpotlightCard } from '@/components/bahrawy/spotlight-card'
import { Button } from '@/components/ui/button'
import { CodeBlock } from '@/components/showcase/code-block'
import {
  ControlLabel,
  ControlsRow,
  DemoCard,
  DocsPage,
  DocsSection,
} from '@/components/showcase/docs-page'
import { PropsTable } from '@/components/showcase/props-table'

const SNIPPET = `import { SpotlightCard } from '@/components/bahrawy'

<SpotlightCard color="rgba(120,119,198,0.3)" size={350}>
  <div className="p-8">
    <h3 className="text-lg font-bold text-white">Premium Card</h3>
    <p className="mt-2 text-sm text-white/60">
      Move your cursor around to see the spotlight effect.
    </p>
  </div>
</SpotlightCard>`

const COLORS: { label: string; value: string }[] = [
  { label: 'White', value: 'rgba(255,255,255,0.15)' },
  { label: 'Purple', value: 'rgba(120,119,198,0.3)' },
  { label: 'Emerald', value: 'rgba(16,185,129,0.25)' },
  { label: 'Rose', value: 'rgba(244,63,94,0.25)' },
]

export default function SpotlightCardDocs() {
  const [color, setColor] = useState(COLORS[0].value)
  const [size, setSize] = useState(300)

  return (
    <DocsPage
      category="34 · card"
      title="Spotlight card"
      slug="spotlight-card"
      description="A card with a radial spotlight glow that follows the cursor. Zero dependencies — pure CSS radial-gradient repositioned on mouse move."
    >
      <DocsSection title="Live demo">
        <DemoCard className="min-h-[360px]">
          <div className="grid w-full max-w-2xl gap-4 sm:grid-cols-2">
            <SpotlightCard color={color} size={size} className="p-6">
              <h3 className="text-base font-semibold text-white">
                Analytics
              </h3>
              <p className="mt-1.5 text-sm text-white/50">
                Real-time traffic insights with interactive charts and export.
              </p>
              <div className="mt-4 flex gap-4">
                <div>
                  <p className="text-2xl font-bold text-white">12.4k</p>
                  <p className="text-xs text-white/40">Visitors</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">3.2%</p>
                  <p className="text-xs text-white/40">Bounce</p>
                </div>
              </div>
            </SpotlightCard>

            <SpotlightCard color={color} size={size} className="p-6">
              <h3 className="text-base font-semibold text-white">
                Storage
              </h3>
              <p className="mt-1.5 text-sm text-white/50">
                Cloud storage management with drag-and-drop uploads.
              </p>
              <div className="mt-4">
                <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
                  <div className="h-full w-[68%] rounded-full bg-emerald-500" />
                </div>
                <p className="mt-1.5 text-xs text-white/40">68% of 50 GB used</p>
              </div>
            </SpotlightCard>
          </div>
        </DemoCard>

        <ControlsRow>
          <ControlLabel>Color</ControlLabel>
          {COLORS.map((c) => (
            <Button
              key={c.label}
              size="sm"
              variant={color === c.value ? 'default' : 'outline'}
              onClick={() => setColor(c.value)}
            >
              {c.label}
            </Button>
          ))}
        </ControlsRow>

        <ControlsRow>
          <ControlLabel>Size</ControlLabel>
          {[200, 300, 450].map((s) => (
            <Button
              key={s}
              size="sm"
              variant={size === s ? 'default' : 'outline'}
              onClick={() => setSize(s)}
            >
              {s}px
            </Button>
          ))}
        </ControlsRow>
      </DocsSection>

      <DocsSection title="Usage">
        <CodeBlock code={SNIPPET} language="tsx" />
      </DocsSection>

      <DocsSection title="Props">
        <PropsTable
          props={[
            { name: 'children', type: 'ReactNode', description: 'Card content.' },
            { name: 'color', type: 'string', default: '"rgba(255,255,255,0.15)"', description: 'Spotlight color (any CSS color).' },
            { name: 'size', type: 'number', default: '300', description: 'Spotlight diameter in pixels.' },
            { name: 'borderRadius', type: 'string', default: '"1rem"', description: 'Card border-radius (CSS value).' },
            { name: 'className', type: 'string', description: 'Additional classes for the outer card.' },
          ]}
        />
      </DocsSection>

      <DocsSection title="Dependencies">
        <div className="flex flex-wrap gap-2">
          <span className="text-sm text-white/40">No external dependencies.</span>
        </div>
      </DocsSection>
    </DocsPage>
  )
}
