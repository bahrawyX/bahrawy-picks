'use client'

import { useState } from 'react'
import { HoverCard } from '@/components/bahrawy/hover-card'
import { CodeBlock } from '@/components/showcase/code-block'
import { DocsPage, DocsSection, DemoCard } from '@/components/showcase/docs-page'
import {
  ControlPanel,
  SelectControl,
  SliderControl,
} from '@/components/showcase/control-panel'

export default function HoverCardDocs() {
  const [side, setSide] = useState<'top' | 'bottom'>('bottom')
  const [openDelay, setOpenDelay] = useState(200)

  const snippet = `import { HoverCard } from '@/components/bahrawy/hover-card'

<HoverCard
  side="${side}"
  openDelay={${openDelay}}
  trigger={<button className="underline">@bahrawy</button>}
>
  <div className="flex gap-3">
    <img src="/avatar.jpg" className="h-10 w-10 rounded-full" />
    <div>
      <p className="font-medium text-white">Abdelrahman</p>
      <p className="text-xs text-white/60">Designs &amp; ships components.</p>
    </div>
  </div>
</HoverCard>`

  return (
    <DocsPage
      title="Hover Card"
      slug="hover-card"
      description="A preview popup that appears with a configurable delay on hover. Spring-positioned, fades + scales in, dismisses on mouse leave."
      category="80 · overlay"
    >
      <DocsSection title="Live demo" description="Hover the underlined trigger to reveal the card.">
        <DemoCard className="min-h-[260px]">
          <div className="flex items-center gap-12 text-base text-white/80">
            <HoverCard
              side={side}
              openDelay={openDelay}
              trigger={
                <button type="button" className="underline-offset-4 hover:underline">
                  @bahrawy
                </button>
              }
            >
              <div className="flex w-72 items-start gap-3">
                <div className="h-10 w-10 shrink-0 rounded-full bg-purple-500 text-center text-base font-bold leading-10 text-white">A</div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-white">Abdelrahman</p>
                  <p className="text-xs text-white/50">@bahrawy</p>
                  <p className="mt-2 text-xs leading-relaxed text-white/70">
                    Designs and ships beautifully crafted components. Currently shipping Bahrawy — copy-paste UI for React.
                  </p>
                </div>
              </div>
            </HoverCard>

            <HoverCard
              side={side}
              openDelay={openDelay}
              trigger={
                <button type="button" className="underline-offset-4 hover:underline">
                  Hover me
                </button>
              }
            >
              <p className="max-w-xs text-xs leading-relaxed text-white/80">
                Tooltips work too — pass arbitrary content. The popup width fits the content up to <code className="rounded bg-white/10 px-1 font-mono">max-w-sm</code>.
              </p>
            </HoverCard>
          </div>
        </DemoCard>

        <ControlPanel>
          <SelectControl
            label="Side"
            value={side}
            onChange={(v) => setSide(v as 'top' | 'bottom')}
            options={[{ label: 'top', value: 'top' }, { label: 'bottom', value: 'bottom' }]}
          />
          <SliderControl
            label="Delay"
            value={openDelay}
            onChange={setOpenDelay}
            min={0}
            max={800}
            step={50}
            unit="ms"
          />
        </ControlPanel>
      </DocsSection>

      <DocsSection title="Usage">
        <CodeBlock code={snippet} language="tsx" />
      </DocsSection>

      <DocsSection title="Props">
        <ul className="grid gap-2 sm:grid-cols-2">
          {[
            ['trigger', 'The element users hover. Wrapped, not consumed.'],
            ['children', 'Popup content.'],
            ['side', '"top" | "bottom". Default "bottom".'],
            ['openDelay', 'ms before showing. Default 200.'],
            ['closeDelay', 'ms before hiding. Default 120.'],
            ['offset', 'px between trigger and popup. Default 8.'],
            ['className', 'Extra classes on the popup.'],
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
