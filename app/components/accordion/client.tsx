'use client'

import { useState } from 'react'
import { Sparkles, Zap, Layers, Palette } from 'lucide-react'
import { Accordion, type AccordionItem } from '@/components/bahrawy/accordion'
import { CodeBlock } from '@/components/showcase/code-block'
import { DocsPage, DocsSection, DemoCard } from '@/components/showcase/docs-page'
import {
  ControlPanel,
  SelectControl,
  SliderControl,
  ToggleControl,
} from '@/components/showcase/control-panel'

/* ------------------------------------------------------------------ */
/*  Demo content                                                       */
/* ------------------------------------------------------------------ */

const ITEMS: AccordionItem[] = [
  {
    id: 'one',
    title: 'What is Bahrawy?',
    icon: <Sparkles className="h-4 w-4" />,
    content:
      'A copy-paste library of polished React components — drop them in, tune them, ship them. No npm install per component, no lock-in.',
  },
  {
    id: 'two',
    title: 'How does the animation feel?',
    icon: <Zap className="h-4 w-4" />,
    content:
      'Every open and close runs a spring with a small overshoot. The panel bounces into place the way a real drawer would — there’s a tiny settle at the end. Tune the bounciness slider above to dial it in.',
  },
  {
    id: 'three',
    title: 'Can I open multiple at once?',
    icon: <Layers className="h-4 w-4" />,
    content:
      'Set type="multiple" and any number of rows can stay open together. The default type="single" closes the previous row when you open a new one.',
  },
  {
    id: 'four',
    title: 'Does it match my theme?',
    icon: <Palette className="h-4 w-4" />,
    content:
      'The container uses subtle white-tint backgrounds + a 1px border, so it blends into any dark surface. You can pass className to override the look completely.',
  },
]

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function AccordionDocs() {
  const [type, setType] = useState<'single' | 'multiple'>('single')
  const [bounciness, setBounciness] = useState(0.7)
  const [chevron, setChevron] = useState(true)
  const [key, setKey] = useState(0)

  const snippet = `import { Accordion } from '@/components/bahrawy/accordion'

const items = [
  { id: 'one', title: 'What is Bahrawy?', content: '...' },
  { id: 'two', title: 'How does it feel?', content: '...' },
]

<Accordion
  items={items}
  type="${type}"
  bounciness={${bounciness.toFixed(2)}}
  chevron={${chevron}}
/>`

  return (
    <DocsPage
      title="Accordion"
      slug="accordion"
      description="A minimal accordion with a bouncy spring open/close. Tap a row — the panel overshoots a touch, then settles. Configurable bounciness, single or multi-open, optional chevron."
      category="75 · ui"
    >
      <DocsSection
        title="Live demo"
        description="Tap a row. Drag the bounciness slider to feel the spring change."
      >
        <DemoCard className="min-h-[420px] items-start">
          <div className="w-full max-w-xl">
            <Accordion
              key={key}
              items={ITEMS}
              type={type}
              bounciness={bounciness}
              chevron={chevron}
              defaultOpen={['one']}
            />
          </div>
        </DemoCard>

        <ControlPanel onReplay={() => setKey((k) => k + 1)}>
          <SelectControl
            label="Mode"
            value={type}
            onChange={(v) => setType(v as 'single' | 'multiple')}
            options={[
              { label: 'single', value: 'single' },
              { label: 'multiple', value: 'multiple' },
            ]}
          />
          <SliderControl
            label="Bounce"
            value={bounciness}
            onChange={setBounciness}
            min={0}
            max={1}
            step={0.05}
          />
          <ToggleControl label="Chevron" checked={chevron} onChange={setChevron} />
        </ControlPanel>
      </DocsSection>

      <DocsSection title="Usage">
        <CodeBlock code={snippet} language="tsx" />
      </DocsSection>

      <DocsSection title="Props">
        <ul className="grid gap-2 sm:grid-cols-2">
          {[
            ['items', 'AccordionItem[] — { id, title, content, icon? }'],
            ['type', '"single" | "multiple" — how many can be open. Default "single".'],
            ['defaultOpen', 'string[] — ids that start expanded.'],
            ['chevron', 'Show the rotating chevron icon. Default true.'],
            ['bounciness', '0–1 — how springy the open/close is. Default 0.7.'],
            ['className', 'Extra classes on the outer wrapper.'],
          ].map(([name, body]) => (
            <li
              key={name}
              className="rounded-lg border border-white/10 bg-white/[0.02] p-3"
            >
              <code className="font-mono text-xs text-white">{name}</code>
              <p className="mt-1 text-xs text-white/60">{body}</p>
            </li>
          ))}
        </ul>
      </DocsSection>

      <DocsSection title="Dependencies">
        <div className="flex flex-wrap gap-2">
          {['framer-motion', 'lucide-react'].map((d) => (
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
