'use client'

import { useState } from 'react'
import { ColorPicker } from '@/components/bahrawy'
import { CodeBlock } from '@/components/showcase/code-block'
import {
  DemoCard,
  DocsPage,
  DocsSection,
} from '@/components/showcase/docs-page'
import { PropsTable } from '@/components/showcase/props-table'

// ---------------------------------------------------------------------------
// Snippets
// ---------------------------------------------------------------------------

const BASIC_SNIPPET = `import { ColorPicker } from '@/components/bahrawy'

<ColorPicker
  value={color}
  onChange={setColor}
/>`

const FORMAT_SNIPPET = `<ColorPicker
  value={color}
  onChange={setColor}
  format="rgb"
/>`

const SWATCHES_SNIPPET = `<ColorPicker
  value={color}
  onChange={setColor}
  showHistory={false}
/>`

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function ColorPickerDocs() {
  const [basic, setBasic] = useState('#3B82F6')
  const [rgb, setRgb] = useState('#EF4444')
  const [hsl, setHsl] = useState('#10B981')
  const [noHistory, setNoHistory] = useState('#8B5CF6')

  return (
    <DocsPage
      title="Color Picker"
      slug="color-picker"
      description="Full-featured color picker with saturation canvas, hue slider, swatches palette, format switching, and color history."
      category="44 · DATA"
    >
      {/* ---- Basic ---- */}
      <DocsSection title="Basic">
        <DemoCard>
          <div className="flex items-center gap-4">
            <ColorPicker value={basic} onChange={setBasic} />
            <span className="font-mono text-sm text-white/40">{basic}</span>
          </div>
        </DemoCard>
        <CodeBlock code={BASIC_SNIPPET} language="tsx" />
      </DocsSection>

      {/* ---- RGB format ---- */}
      <DocsSection title="RGB format">
        <DemoCard>
          <div className="flex items-center gap-4">
            <ColorPicker value={rgb} onChange={setRgb} format="rgb" />
            <span className="font-mono text-sm text-white/40">{rgb}</span>
          </div>
        </DemoCard>
        <CodeBlock code={FORMAT_SNIPPET} language="tsx" />
      </DocsSection>

      {/* ---- HSL format ---- */}
      <DocsSection title="HSL format">
        <DemoCard>
          <div className="flex items-center gap-4">
            <ColorPicker value={hsl} onChange={setHsl} format="hsl" />
            <span className="font-mono text-sm text-white/40">{hsl}</span>
          </div>
        </DemoCard>
      </DocsSection>

      {/* ---- Without history ---- */}
      <DocsSection title="Without history tab">
        <DemoCard>
          <div className="flex items-center gap-4">
            <ColorPicker value={noHistory} onChange={setNoHistory} showHistory={false} />
            <span className="font-mono text-sm text-white/40">{noHistory}</span>
          </div>
        </DemoCard>
        <CodeBlock code={SWATCHES_SNIPPET} language="tsx" />
      </DocsSection>

      {/* ---- Disabled ---- */}
      <DocsSection title="Disabled">
        <DemoCard>
          <ColorPicker value="#FF5733" disabled />
        </DemoCard>
      </DocsSection>

      {/* ---- Props ---- */}
      <DocsSection title="Props">
        <PropsTable
          props={[
            { name: 'value', type: 'string', default: '—', description: 'Controlled hex color value' },
            { name: 'onChange', type: '(hex: string) => void', default: '—', description: 'Called when color changes' },
            { name: 'defaultValue', type: 'string', default: "'#3B82F6'", description: 'Initial color for uncontrolled mode' },
            { name: 'format', type: "'hex' | 'rgb' | 'hsl'", default: "'hex'", description: 'Default format for the input display' },
            { name: 'showAlpha', type: 'boolean', default: 'false', description: 'Show alpha/opacity slider' },
            { name: 'swatches', type: 'string[]', default: 'Material 500', description: 'Custom preset color swatches' },
            { name: 'showSwatches', type: 'boolean', default: 'true', description: 'Show the swatches tab' },
            { name: 'showHistory', type: 'boolean', default: 'true', description: 'Show the history tab' },
            { name: 'disabled', type: 'boolean', default: 'false', description: 'Disable the picker' },
            { name: 'className', type: 'string', default: '—', description: 'Additional CSS classes' },
          ]}
        />
      </DocsSection>
    </DocsPage>
  )
}
