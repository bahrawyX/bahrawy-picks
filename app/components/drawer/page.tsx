'use client'

import { useState } from 'react'
import { Drawer, type DrawerSide } from '@/components/bahrawy/drawer'
import { CodeBlock } from '@/components/showcase/code-block'
import { DocsPage, DocsSection, DemoCard } from '@/components/showcase/docs-page'
import { ControlPanel, SelectControl, SliderControl } from '@/components/showcase/control-panel'

export default function DrawerDocs() {
  const [open, setOpen] = useState(false)
  const [side, setSide] = useState<DrawerSide>('right')
  const [size, setSize] = useState(380)

  return (
    <DocsPage
      title="Drawer"
      slug="drawer"
      description="Slide-in panel from any of the four edges. Dim backdrop, Escape closes it, spring entry."
      category="89 · overlay"
    >
      <DocsSection title="Live demo" description="Click the button to open. Try changing the side.">
        <DemoCard className="min-h-[260px]">
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-black"
          >
            Open drawer
          </button>
          <Drawer open={open} onClose={() => setOpen(false)} side={side} size={size} title="Settings">
            <div className="space-y-4">
              <p>This is the drawer body. Drop any content in here — forms, lists, a checkout flow.</p>
              <p className="text-white/60">Click the backdrop, press Escape, or hit the X to dismiss.</p>
              <ul className="space-y-2 text-white/75">
                {['Profile', 'Notifications', 'Billing', 'Integrations'].map((s) => (
                  <li key={s} className="rounded-lg border border-white/10 bg-white/[0.02] px-3 py-2">
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          </Drawer>
        </DemoCard>
        <ControlPanel>
          <SelectControl
            label="Side"
            value={side}
            onChange={(v) => setSide(v as DrawerSide)}
            options={[
              { label: 'right', value: 'right' },
              { label: 'left', value: 'left' },
              { label: 'top', value: 'top' },
              { label: 'bottom', value: 'bottom' },
            ]}
          />
          <SliderControl label="Size" value={size} onChange={setSize} min={240} max={520} step={20} unit="px" />
        </ControlPanel>
      </DocsSection>
      <DocsSection title="Usage">
        <CodeBlock code={`const [open, setOpen] = useState(false)\n\n<Drawer open={open} onClose={() => setOpen(false)} side="right" title="Settings">\n  ...\n</Drawer>`} language="tsx" />
      </DocsSection>
    </DocsPage>
  )
}
