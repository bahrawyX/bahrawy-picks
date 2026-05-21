'use client'

import { Bell, Info, Settings } from 'lucide-react'
import { Tooltip } from '@/components/bahrawy/tooltip'
import { CodeBlock } from '@/components/showcase/code-block'
import { DocsPage, DocsSection, DemoCard } from '@/components/showcase/docs-page'

export default function TooltipDocs() {
  return (
    <DocsPage
      title="Tooltip"
      slug="tooltip"
      description="A small contextual hint on hover/focus. Lightweight version of HoverCard — for one-liners, not rich previews."
      category="91 · overlay"
    >
      <DocsSection title="Live demo" description="Hover any of the buttons.">
        <DemoCard className="min-h-[260px]">
          <div className="flex flex-wrap items-center justify-center gap-6">
            <Tooltip content="Toggle notifications">
              <button type="button" className="rounded-full border border-white/15 bg-white/[0.04] p-2.5 text-white/80 hover:bg-white/10 hover:text-white">
                <Bell className="h-4 w-4" />
              </button>
            </Tooltip>
            <Tooltip content="Open settings" side="right">
              <button type="button" className="rounded-full border border-white/15 bg-white/[0.04] p-2.5 text-white/80 hover:bg-white/10 hover:text-white">
                <Settings className="h-4 w-4" />
              </button>
            </Tooltip>
            <Tooltip content="This is helpful information" side="bottom">
              <button type="button" className="rounded-full border border-white/15 bg-white/[0.04] p-2.5 text-white/80 hover:bg-white/10 hover:text-white">
                <Info className="h-4 w-4" />
              </button>
            </Tooltip>
            <Tooltip content="Saved 2 minutes ago" side="left">
              <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-xs text-emerald-300">Saved</span>
            </Tooltip>
          </div>
        </DemoCard>
      </DocsSection>
      <DocsSection title="Usage">
        <CodeBlock code={`<Tooltip content="Toggle notifications" side="top">\n  <BellButton />\n</Tooltip>`} language="tsx" />
      </DocsSection>
    </DocsPage>
  )
}
