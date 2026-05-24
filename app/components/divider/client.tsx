'use client'

import { useState } from 'react'
import { Divider } from '@/components/bahrawy/divider'
import { CodeBlock } from '@/components/showcase/code-block'
import { DocsPage, DocsSection, DemoCard } from '@/components/showcase/docs-page'
import { ControlPanel, SelectControl } from '@/components/showcase/control-panel'

export default function DividerDocs() {
  const [style, setStyle] = useState<'solid' | 'dashed' | 'gradient'>('solid')

  return (
    <DocsPage
      title="Divider"
      slug="divider"
      description="A thin horizontal rule that animates its width in on scroll. Optional centered label, three styles."
      category="101 · ui"
    >
      <DocsSection title="Live demo">
        <DemoCard className="min-h-[280px] items-stretch">
          <div className="flex w-full max-w-2xl flex-col gap-10">
            <Divider style={style} />
            <Divider style={style} label="Section break" />
            <Divider style={style} label="OR" />
          </div>
        </DemoCard>
        <ControlPanel>
          <SelectControl
            label="Style"
            value={style}
            onChange={(v) => setStyle(v as 'solid' | 'dashed' | 'gradient')}
            options={[
              { label: 'solid', value: 'solid' },
              { label: 'dashed', value: 'dashed' },
              { label: 'gradient', value: 'gradient' },
            ]}
          />
        </ControlPanel>
      </DocsSection>
      <DocsSection title="Usage">
        <CodeBlock code={`<Divider style="${style}" label="Section break" />`} language="tsx" />
      </DocsSection>
    </DocsPage>
  )
}
