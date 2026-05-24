'use client'

import { StatusPill } from '@/components/bahrawy/status-pill'
import { CodeBlock } from '@/components/showcase/code-block'
import { DocsPage, DocsSection, DemoCard } from '@/components/showcase/docs-page'

export default function StatusPillDocs() {
  return (
    <DocsPage
      title="Status Pill"
      slug="status-pill"
      description="Compact status badge with intent presets and an optional pulsing dot. Five built-in intents plus 'custom'."
      category="118 · ui"
    >
      <DocsSection title="Live demo">
        <DemoCard className="min-h-[240px]">
          <div className="flex flex-wrap items-center justify-center gap-3">
            <StatusPill intent="online">Online</StatusPill>
            <StatusPill intent="away">Away</StatusPill>
            <StatusPill intent="busy">Busy</StatusPill>
            <StatusPill intent="offline" pulse={false}>Offline</StatusPill>
            <StatusPill intent="error">Failed</StatusPill>
            <StatusPill intent="custom" color="#A78BFA">Beta</StatusPill>
            <StatusPill intent="online" size="md">Live</StatusPill>
            <StatusPill intent="online" dot={false}>v2.0</StatusPill>
          </div>
        </DemoCard>
      </DocsSection>
      <DocsSection title="Usage">
        <CodeBlock code={`<StatusPill intent="online">Online</StatusPill>\n<StatusPill intent="custom" color="#A78BFA">Beta</StatusPill>`} language="tsx" />
      </DocsSection>
    </DocsPage>
  )
}
