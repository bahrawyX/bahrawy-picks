'use client'

import { useState } from 'react'
import { Switch } from '@/components/bahrawy/switch'
import { CodeBlock } from '@/components/showcase/code-block'
import { DocsPage, DocsSection, DemoCard } from '@/components/showcase/docs-page'
import {
  ControlPanel,
  SelectControl,
} from '@/components/showcase/control-panel'

const ACCENTS = {
  white: '#FFFFFF',
  red: '#EF2B2D',
  emerald: '#10B981',
  sky: '#38BDF8',
  amber: '#F59E0B',
}

export default function SwitchDocs() {
  const [size, setSize] = useState<'sm' | 'md' | 'lg'>('md')
  const [accent, setAccent] = useState<keyof typeof ACCENTS>('white')
  const [notifications, setNotifications] = useState(true)
  const [marketing, setMarketing] = useState(false)
  const [autoSave, setAutoSave] = useState(true)

  const snippet = `import { Switch } from '@/components/bahrawy/switch'

const [enabled, setEnabled] = useState(false)

<Switch
  checked={enabled}
  onChange={setEnabled}
  size="${size}"
  accentColor="${ACCENTS[accent]}"
  label="Enable notifications"
/>`

  return (
    <DocsPage
      title="Switch"
      slug="switch"
      description="An animated toggle switch with a spring thumb. Three sizes, controlled or uncontrolled, optional label."
      category="89 · form"
    >
      <DocsSection title="Live demo">
        <DemoCard className="min-h-[260px]">
          <div className="flex w-full max-w-sm flex-col gap-5">
            <Switch
              checked={notifications}
              onChange={setNotifications}
              size={size}
              accentColor={ACCENTS[accent]}
              label="Push notifications"
            />
            <Switch
              checked={marketing}
              onChange={setMarketing}
              size={size}
              accentColor={ACCENTS[accent]}
              label="Marketing emails"
            />
            <Switch
              checked={autoSave}
              onChange={setAutoSave}
              size={size}
              accentColor={ACCENTS[accent]}
              label="Auto-save drafts"
            />
            <Switch
              disabled
              defaultChecked
              size={size}
              accentColor={ACCENTS[accent]}
              label="Locked setting (disabled)"
            />
          </div>
        </DemoCard>

        <ControlPanel>
          <SelectControl
            label="Size"
            value={size}
            onChange={(v) => setSize(v as 'sm' | 'md' | 'lg')}
            options={[
              { label: 'sm', value: 'sm' },
              { label: 'md', value: 'md' },
              { label: 'lg', value: 'lg' },
            ]}
          />
          <SelectControl
            label="Accent"
            value={accent}
            onChange={(v) => setAccent(v as keyof typeof ACCENTS)}
            options={Object.keys(ACCENTS).map((k) => ({ label: k, value: k }))}
          />
        </ControlPanel>
      </DocsSection>

      <DocsSection title="Usage">
        <CodeBlock code={snippet} language="tsx" />
      </DocsSection>

      <DocsSection title="Props">
        <ul className="grid gap-2 sm:grid-cols-2">
          {[
            ['checked', 'Controlled checked state.'],
            ['defaultChecked', 'Initial state (uncontrolled).'],
            ['onChange', '(checked) => void.'],
            ['label', 'Optional label to the right.'],
            ['size', '"sm" | "md" | "lg". Default "md".'],
            ['accentColor', 'Background when on. Default #FFFFFF.'],
            ['disabled', 'Disable interaction.'],
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
