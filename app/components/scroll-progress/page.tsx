'use client'

import { useState } from 'react'
import { ScrollProgress } from '@/components/bahrawy'
import { CodeBlock } from '@/components/showcase/code-block'
import {
  DemoCard,
  DocsPage,
  DocsSection,
  ControlsRow,
  ControlLabel,
} from '@/components/showcase/docs-page'
import { PropsTable } from '@/components/showcase/props-table'

const BASIC_SNIPPET = `import { ScrollProgress } from '@/components/bahrawy'

<ScrollProgress />`

const CUSTOM_SNIPPET = `<ScrollProgress
  position="bottom"
  color="bg-blue-500"
  height={4}
  showPercentage
/>`

type Pos = 'top' | 'bottom' | 'left' | 'right'

export default function ScrollProgressDocs() {
  const [position, setPosition] = useState<Pos>('top')
  const [showPct, setShowPct] = useState(false)

  return (
    <DocsPage
      title="Scroll Progress"
      slug="scroll-progress"
      description="Fixed scroll progress bar with spring physics. Supports top, bottom, left, and right positions."
      category="10 · MOTION"
    >
      {/* Live demo – the bar is visible on this page */}
      <ScrollProgress position={position} showPercentage={showPct} />

      {/* Controls */}
      <DocsSection title="Interactive demo">
        <ControlsRow>
          <ControlLabel>Position</ControlLabel>
          {(['top', 'bottom', 'left', 'right'] as Pos[]).map((p) => (
            <button
              key={p}
              onClick={() => setPosition(p)}
              className={`rounded-md px-2.5 py-1 text-xs transition-colors ${
                position === p
                  ? 'bg-white/10 text-white'
                  : 'text-white/40 hover:text-white/70'
              }`}
            >
              {p}
            </button>
          ))}
          <ControlLabel>Percentage</ControlLabel>
          <button
            onClick={() => setShowPct((v) => !v)}
            className={`rounded-md px-2.5 py-1 text-xs transition-colors ${
              showPct
                ? 'bg-white/10 text-white'
                : 'text-white/40 hover:text-white/70'
            }`}
          >
            {showPct ? 'ON' : 'OFF'}
          </button>
        </ControlsRow>
        <p className="text-xs text-white/40">
          Scroll this page to see the progress bar in action.
        </p>
      </DocsSection>

      {/* Code */}
      <DocsSection title="Basic usage">
        <CodeBlock code={BASIC_SNIPPET} language="tsx" />
      </DocsSection>

      <DocsSection title="Customized">
        <CodeBlock code={CUSTOM_SNIPPET} language="tsx" />
      </DocsSection>

      {/* Spacer for scroll */}
      <div className="h-[60vh]" />

      {/* Props */}
      <DocsSection title="Props">
        <PropsTable
          props={[
            { name: 'position', type: "'top' | 'bottom' | 'left' | 'right'", default: "'top'", description: 'Bar position' },
            { name: 'color', type: 'string', default: "'bg-white'", description: 'Tailwind background color class' },
            { name: 'height', type: 'number', default: '3', description: 'Bar thickness in px' },
            { name: 'showPercentage', type: 'boolean', default: 'false', description: 'Show floating percentage badge' },
            { name: 'className', type: 'string', default: '—', description: 'Additional CSS classes' },
          ]}
        />
      </DocsSection>
    </DocsPage>
  )
}
