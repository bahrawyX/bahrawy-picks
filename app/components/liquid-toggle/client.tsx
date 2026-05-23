'use client'

import * as React from 'react'
import { LiquidToggle } from '@/components/bahrawy/liquid-toggle'
import { CodeBlock } from '@/components/showcase/code-block'
import { DocsPage, DocsSection, DemoCard } from '@/components/showcase/docs-page'

const SNIPPET = `import { LiquidToggle } from '@/components/bahrawy/liquid-toggle'

const [on, setOn] = useState(false)

<LiquidToggle
  checked={on}
  onChange={setOn}
  color="#22D3EE"
  label="Notifications"
/>`

export default function LiquidToggleDocs() {
  const [a, setA] = React.useState(false)
  const [b, setB] = React.useState(true)
  return (
    <DocsPage
      title="Liquid Toggle"
      slug="liquid-toggle"
      description="A toggle switch whose handle is a fluid blob. The classic CSS-goo SVG filter (Gaussian blur + alpha-tightening colour matrix) is applied to the handle + small anchor dots at each end; as the handle moves, the blobs merge along a curved isoline, then settle at the destination."
      category="137 · form"
    >
      <DocsSection title="Live demo">
        <DemoCard className="min-h-[200px]">
          <div className="flex flex-wrap items-center justify-center gap-10">
            <div className="flex flex-col items-center gap-2">
              <LiquidToggle checked={a} onChange={setA} />
              <span className="text-[10px] uppercase tracking-[0.22em] text-white/55">
                {a ? 'on' : 'off'}
              </span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <LiquidToggle checked={b} onChange={setB} color="#F472B6" />
              <span className="text-[10px] uppercase tracking-[0.22em] text-white/55">
                pink · {b ? 'on' : 'off'}
              </span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <LiquidToggle defaultChecked color="#A3E635" width={120} height={56} />
              <span className="text-[10px] uppercase tracking-[0.22em] text-white/55">
                bigger
              </span>
            </div>
          </div>
        </DemoCard>
      </DocsSection>

      <DocsSection title="Usage"><CodeBlock code={SNIPPET} language="tsx" /></DocsSection>

      <DocsSection title="Props">
        <ul className="grid gap-2 sm:grid-cols-2">
          {[
            ['checked', 'Controlled value.'],
            ['defaultChecked', 'Uncontrolled initial value. Default false.'],
            ['onChange', '(next: boolean) => void — fires on toggle.'],
            ['width / height', 'Track size in px. Defaults 96 × 44.'],
            ['color', 'Blob colour (handle + anchors). Default #22D3EE.'],
            ['trackColor', 'Track background. Default dark zinc.'],
            ['label', 'Accessible label for the switch.'],
            ['className', 'Extra classes on the outer button.'],
          ].map(([n, b]) => (
            <li key={n} className="rounded-lg border border-white/10 bg-white/[0.02] p-3">
              <code className="font-mono text-xs text-white">{n}</code>
              <p className="mt-1 text-xs text-white/60">{b}</p>
            </li>
          ))}
        </ul>
      </DocsSection>

      <DocsSection title="Dependencies">
        <div className="text-xs text-white/55">No external runtime dependencies — just React + SVG.</div>
      </DocsSection>
    </DocsPage>
  )
}
