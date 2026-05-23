'use client'

import { useState } from 'react'
import { MagneticCursor } from '@/components/bahrawy/magnetic-cursor'
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

const SNIPPET = `import { MagneticCursor } from '@/components/bahrawy'

<MagneticCursor strength={0.35} radius={150}>
  <button className="rounded-full bg-white px-6 py-3 text-black">
    Hover me
  </button>
</MagneticCursor>`

export default function MagneticCursorDocs() {
  const [strength, setStrength] = useState(0.35)
  const [disabled, setDisabled] = useState(false)

  return (
    <DocsPage
      category="09 · cursor"
      title="Magnetic cursor"
      slug="magnetic-cursor"
      description="Wraps any element and makes it magnetically attract toward the cursor on hover. Spring-physics powered elastic snapping with configurable strength and radius."
    >
      <DocsSection title="Live demo">
        <DemoCard>
          <div className="flex flex-wrap items-center justify-center gap-8">
            <MagneticCursor strength={strength} disabled={disabled}>
              <button className="rounded-full bg-white px-6 py-3 text-sm font-medium text-black transition-shadow hover:shadow-lg hover:shadow-white/20">
                Hover me
              </button>
            </MagneticCursor>

            <MagneticCursor strength={strength} disabled={disabled}>
              <div className="flex h-16 w-16 items-center justify-center rounded-full border border-white/20 bg-white/5 text-2xl">
                🧲
              </div>
            </MagneticCursor>

            <MagneticCursor strength={strength} disabled={disabled}>
              <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-5 py-3 text-sm font-medium text-emerald-400">
                Magnetic card
              </div>
            </MagneticCursor>
          </div>
        </DemoCard>

        <ControlsRow>
          <ControlLabel>Strength</ControlLabel>
          {[0.15, 0.35, 0.6, 0.9].map((s) => (
            <Button
              key={s}
              size="sm"
              variant={strength === s ? 'default' : 'outline'}
              onClick={() => setStrength(s)}
            >
              {s}
            </Button>
          ))}
          <span className="mx-1 h-5 w-px bg-white/10" />
          <Button
            size="sm"
            variant={disabled ? 'default' : 'outline'}
            onClick={() => setDisabled((v) => !v)}
          >
            Disabled
          </Button>
        </ControlsRow>
      </DocsSection>

      <DocsSection title="Usage">
        <CodeBlock code={SNIPPET} language="tsx" />
      </DocsSection>

      <DocsSection title="Props">
        <PropsTable
          props={[
            { name: 'children', type: 'ReactNode', description: 'The element to apply the magnetic effect to.' },
            { name: 'strength', type: 'number', default: '0.35', description: 'How strongly the element follows the cursor (0–1).' },
            { name: 'radius', type: 'number', default: '150', description: 'Activation radius in pixels from the element center.' },
            { name: 'spring', type: '{ stiffness, damping, mass }', description: 'Framer Motion spring config override.' },
            { name: 'disabled', type: 'boolean', default: 'false', description: 'Disable the magnetic effect entirely.' },
            { name: 'className', type: 'string', description: 'Additional classes for the wrapper div.' },
          ]}
        />
      </DocsSection>

      <DocsSection title="Dependencies">
        <div className="flex flex-wrap gap-2">
          {['framer-motion'].map((d) => (
            <code
              key={d}
              className="rounded-md border border-white/10 bg-white/[0.04] px-2 py-1 font-mono text-xs text-white/80"
            >
              {d}
            </code>
          ))}
        </div>
      </DocsSection>
    </DocsPage>
  )
}
