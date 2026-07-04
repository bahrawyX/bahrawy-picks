'use client'

import { ArrowRight } from 'lucide-react'
import { ExpandButton } from '@/components/bahrawy/expand-button'
import { CodeBlock } from '@/components/showcase/code-block'
import { DocsPage, DocsSection, DemoCard } from '@/components/showcase/docs-page'

export default function ExpandButtonDocs() {
  return (
    <DocsPage
      title="Expand Button"
      slug="expand-button"
      description="A round icon chip that expands sideways on hover to reveal its label — the 'Learn more' pill that sits on portfolio project cards. The label animates via CSS grid 0fr→1fr so any length works with no width measurement; the icon un-rotates from -45° to 0° as it opens."
      category="178 · ui"
    >
      <DocsSection title="Self hover" description="Hover the chips themselves.">
        <DemoCard className="min-h-[200px]">
          <div className="flex flex-wrap items-center justify-center gap-4">
            <ExpandButton label="Learn more" />
            <ExpandButton
              label="View case study"
              tone="dark"
              className="ring-1 ring-white/20"
              icon={<ArrowRight size={14} />}
            />
          </div>
        </DemoCard>
      </DocsSection>

      <DocsSection
        title="Card hover"
        description="With expandOn='group' the chip opens when the whole parent card is hovered — the portfolio-card pattern."
      >
        <DemoCard className="min-h-[280px]">
          <div className="group relative aspect-[16/10] w-full max-w-md cursor-pointer overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-950 via-[#1a1d2e] to-neutral-900">
            <div className="absolute inset-0 flex items-center justify-center text-sm text-white/40">
              Hover this card
            </div>
            <div className="absolute bottom-4 left-4">
              <ExpandButton label="Learn more" expandOn="group" />
            </div>
          </div>
        </DemoCard>
      </DocsSection>

      <DocsSection title="Usage">
        <CodeBlock
          language="tsx"
          code={`import { ExpandButton } from '@/components/bahrawy/expand-button'

// Opens on its own hover
<ExpandButton label="Learn more" onClick={openProject} />

// Opens when the parent card (with \`group\`) is hovered
<div className="group relative cursor-pointer overflow-hidden rounded-2xl">
  <video src={preview} autoPlay muted loop playsInline />
  <div className="absolute bottom-4 left-4">
    <ExpandButton label="Learn more" expandOn="group" />
  </div>
</div>`}
        />
      </DocsSection>

      <DocsSection title="Props">
        <ul className="grid gap-2 sm:grid-cols-2">
          {[
            ['label', 'Text revealed on hover (required).'],
            ['icon', 'Icon in the collapsed circle. Default link icon.'],
            ['tone', "'light' (white chip) or 'dark'. Default 'light'."],
            ['expandOn', "'self' or 'group' (parent with `group` class). Default 'self'."],
            ['className', 'Extra classes on the button.'],
            ['...rest', 'All native button props (onClick, aria-*, etc.).'],
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
