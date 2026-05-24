'use client'

import * as React from 'react'
import { DragToConfirm } from '@/components/bahrawy/drag-to-confirm'
import { CodeBlock } from '@/components/showcase/code-block'
import { DocsPage, DocsSection, DemoCard } from '@/components/showcase/docs-page'

const SNIPPET = `import { DragToConfirm } from '@/components/bahrawy/drag-to-confirm'

<DragToConfirm
  label="Slide to pay $129"
  confirmedLabel="Payment sent"
  onConfirm={() => chargeCard()}
/>`

export default function DragToConfirmDocs() {
  // Demo 1 — uncontrolled, auto-resets every 3s so the demo loops.
  const [resetKey1, setResetKey1] = React.useState(0)
  React.useEffect(() => {
    const t = setInterval(() => setResetKey1((k) => k + 1), 3500)
    return () => clearInterval(t)
  }, [])

  // Demo 2 — controlled state, with a manual reset button.
  const [confirmed, setConfirmed] = React.useState(false)
  const [count, setCount] = React.useState(0)

  return (
    <DocsPage
      title="Drag to Confirm"
      slug="drag-to-confirm"
      description="The iOS slide-to-unlock pattern, modernised. A knob sits at the left of a pill track; drag it right and a colored fill grows behind. Release past the threshold (default 90%) → fires onConfirm + locks to a confirmed state with a check. Release before → springs back to start. Used for destructive or payment actions where a single click feels too easy — the gesture forces intent."
      category="63 · form"
    >
      <DocsSection title="Default (emerald) — auto-resets so you can keep trying">
        <DemoCard className="min-h-[200px]">
          <div className="w-full max-w-md">
            <DragToConfirm
              key={resetKey1}
              label="Slide to confirm"
              confirmedLabel="Confirmed"
            />
            <p className="mt-3 text-center text-[10px] uppercase tracking-[0.22em] text-white/35">
              resets every 3.5s
            </p>
          </div>
        </DemoCard>
      </DocsSection>

      <DocsSection title="Danger — destructive action">
        <DemoCard className="min-h-[200px]">
          <div className="flex w-full max-w-md flex-col items-center gap-3">
            <DragToConfirm
              variant="danger"
              confirmed={confirmed}
              label="Slide to delete account"
              confirmedLabel="Account deleted"
              onConfirm={() => {
                setConfirmed(true)
                setCount((c) => c + 1)
              }}
            />
            {confirmed && (
              <button
                type="button"
                onClick={() => setConfirmed(false)}
                className="text-[11px] font-medium text-white/55 underline-offset-2 hover:text-white hover:underline"
              >
                undo (×{count})
              </button>
            )}
          </div>
        </DemoCard>
      </DocsSection>

      <DocsSection title="Custom accent + payment label">
        <DemoCard className="min-h-[200px]">
          <div className="w-full max-w-md">
            <DragToConfirm
              accent="#A78BFA"
              label="Slide to pay $129"
              confirmedLabel="Payment sent"
              onConfirm={() => console.log('charged')}
            />
          </div>
        </DemoCard>
      </DocsSection>

      <DocsSection title="Disabled">
        <DemoCard className="min-h-[140px]">
          <div className="w-full max-w-md">
            <DragToConfirm label="Locked" disabled />
          </div>
        </DemoCard>
      </DocsSection>

      <DocsSection title="Usage">
        <CodeBlock code={SNIPPET} language="tsx" />
      </DocsSection>

      <DocsSection title="Props">
        <ul className="grid gap-2 sm:grid-cols-2">
          {[
            ['label', 'Idle label across the track. Default "Slide to confirm".'],
            ['confirmedLabel', 'Label shown after success. Default "Confirmed".'],
            ['onConfirm', 'Fires when the user drags past the threshold and releases.'],
            ['onCancel', 'Fires when the user releases before the threshold.'],
            ['variant', '"default" | "danger" | "custom". Default uses emerald, danger uses rose.'],
            ['accent', 'Custom accent hex — overrides variant accent.'],
            ['confirmed', 'Controlled confirmed state. Useful for showing undo / reset.'],
            ['threshold', 'How far the knob must travel (0..1). Default 0.9.'],
            ['disabled', 'Disable the drag interaction.'],
            ['idleIcon', 'Icon on the knob in idle state. Default ChevronRight.'],
            ['height', 'Track height in px. Default 52.'],
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
          {['framer-motion', 'lucide-react'].map((d) => (
            <code key={d} className="rounded-md border border-white/10 bg-white/[0.04] px-2 py-1 font-mono text-xs text-white/80">
              {d}
            </code>
          ))}
        </div>
      </DocsSection>
    </DocsPage>
  )
}
