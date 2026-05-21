'use client'

import { useState } from 'react'
import { StepProgress } from '@/components/bahrawy/step-progress'
import { CodeBlock } from '@/components/showcase/code-block'
import { DocsPage, DocsSection, DemoCard } from '@/components/showcase/docs-page'
import { ControlPanel, SelectControl, SliderControl } from '@/components/showcase/control-panel'

const ACCENTS = { white: '#FFFFFF', purple: '#A78BFA', cyan: '#22D3EE', emerald: '#10B981', amber: '#F59E0B' }
const STEPS = ['Account', 'Profile', 'Workspace', 'Invite', 'Done']

export default function StepProgressDocs() {
  const [current, setCurrent] = useState(2)
  const [accent, setAccent] = useState<keyof typeof ACCENTS>('purple')

  return (
    <DocsPage
      title="Step Progress"
      slug="step-progress"
      description="Horizontal numbered step indicator. Past steps fill with the accent + check, the active step pulses, upcoming steps stay outlined."
      category="93 · navigation"
    >
      <DocsSection title="Live demo">
        <DemoCard className="min-h-[260px] items-stretch">
          <div className="w-full max-w-2xl">
            <StepProgress steps={STEPS} current={current} accentColor={ACCENTS[accent]} />
          </div>
        </DemoCard>
        <ControlPanel>
          <SliderControl label="Current" value={current} onChange={setCurrent} min={0} max={STEPS.length - 1} step={1} />
          <SelectControl
            label="Accent"
            value={accent}
            onChange={(v) => setAccent(v as keyof typeof ACCENTS)}
            options={Object.keys(ACCENTS).map((k) => ({ label: k, value: k }))}
          />
        </ControlPanel>
      </DocsSection>
      <DocsSection title="Usage">
        <CodeBlock code={`<StepProgress steps={['Account', 'Profile', 'Done']} current={${current}} accentColor="${ACCENTS[accent]}" />`} language="tsx" />
      </DocsSection>
    </DocsPage>
  )
}
