'use client'

import { RollingText, RollingButton } from '@/components/bahrawy/rolling-text'
import { CodeBlock } from '@/components/showcase/code-block'
import { DocsPage, DocsSection, DemoCard } from '@/components/showcase/docs-page'

export default function RollingTextDocs() {
  return (
    <DocsPage
      title="Rolling Text"
      slug="rolling-text"
      description="The agency-site button label roll. Two stacked copies of the label sit in an overflow-hidden window exactly one line tall; on hover the stack slides up 50% so the duplicate rolls into place. RollingButton is the ready-made pill with a contrasting arrow disc that un-rotates from -45° to 0°."
      category="177 · text effect"
    >
      <DocsSection title="Rolling Button" description="Hover the buttons — label rolls, arrow un-rotates.">
        <DemoCard className="min-h-[220px] gap-4">
          <div className="flex flex-wrap items-center justify-center gap-4">
            <RollingButton label="Book a strategy call" variant="light" />
            <RollingButton label="Start a project" variant="accent" />
            <RollingButton label="View our work" variant="dark" className="ring-1 ring-white/20" />
          </div>
        </DemoCard>
      </DocsSection>

      <DocsSection
        title="RollingText inside your own trigger"
        description="RollingText rolls whenever a parent with the `group` class is hovered — drop it in any button or link."
      >
        <DemoCard className="min-h-[180px]">
          <a
            href="#"
            onClick={(e) => e.preventDefault()}
            className="group flex items-center gap-2 text-lg font-medium text-white"
          >
            <RollingText text="Hover this link →" />
          </a>
        </DemoCard>
      </DocsSection>

      <DocsSection title="Usage">
        <CodeBlock
          language="tsx"
          code={`import { RollingText, RollingButton } from '@/components/bahrawy/rolling-text'

// Ready-made pill
<RollingButton label="Start a project" variant="accent" accentColor="#F26522" />

// Or roll any label inside your own group-hover trigger
<button className="group flex items-center gap-2">
  <RollingText text="Book a strategy call" />
</button>`}
        />
      </DocsSection>

      <DocsSection title="Props">
        <ul className="grid gap-2 sm:grid-cols-2">
          {[
            ['text', 'RollingText — the label, rendered twice (required).'],
            ['duration', 'Roll duration in seconds. Default 0.5.'],
            ['lineHeight', "Visible window height. Default '1.5em'."],
            ['label', 'RollingButton — button label (required).'],
            ['variant', "RollingButton — 'dark' | 'light' | 'accent'. Default 'dark'."],
            ['accentColor', "RollingButton — accent bg when variant='accent'. Default '#F26522'."],
            ['icon', 'RollingButton — icon in the disc. Default arrow-right.'],
            ['className', 'Extra classes on the wrapper.'],
          ].map(([n, b]) => (
            <li key={n} className="rounded-lg border border-white/10 bg-white/[0.02] p-3">
              <code className="font-mono text-xs text-white">{n}</code>
              <p className="mt-1 text-xs text-white/60">{b}</p>
            </li>
          ))}
        </ul>
      </DocsSection>
    </DocsPage>
  )
}
