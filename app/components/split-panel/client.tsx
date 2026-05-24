'use client'

import * as React from 'react'
import { SplitPanel } from '@/components/bahrawy/split-panel'
import { CodeBlock } from '@/components/showcase/code-block'
import { DocsPage, DocsSection, DemoCard } from '@/components/showcase/docs-page'

const SNIPPET = `import { SplitPanel } from '@/components/bahrawy/split-panel'

<div className="h-[400px]">
  <SplitPanel defaultSize={0.4} minSize={0.2} maxSize={0.7} snap={[0.25, 0.5, 0.75]}>
    <Editor />
    <Preview />
  </SplitPanel>
</div>`

function FilePane() {
  const files = [
    'README.md', 'package.json', 'tsconfig.json',
    'app/layout.tsx', 'app/page.tsx',
    'components/bahrawy/queue.tsx', 'components/bahrawy/aurora.tsx',
    'components/bahrawy/halo.tsx', 'lib/seo.ts', 'lib/utils.ts',
  ]
  return (
    <div className="h-full bg-white/[0.015] p-3 font-mono text-[12px] text-white/65">
      <p className="mb-2 px-1 text-[9.5px] uppercase tracking-[0.22em] text-white/35">
        Explorer
      </p>
      <ul className="space-y-0.5">
        {files.map((f) => (
          <li key={f} className="cursor-pointer rounded px-1.5 py-0.5 hover:bg-white/[0.04] hover:text-white">
            {f}
          </li>
        ))}
      </ul>
    </div>
  )
}

function EditorPane() {
  return (
    <div className="h-full overflow-auto bg-[#0a0a10] p-4 font-mono text-[12px] leading-relaxed text-white/85">
      <pre className="whitespace-pre">{`export function greet(name: string) {
  if (!name) return 'hello, stranger'
  return \`hello, \${name.trim()}\`
}

export async function fetchUser(id: string) {
  const res = await fetch(\`/api/users/\${id}\`)
  if (!res.ok) throw new Error('not found')
  return res.json() as Promise<User>
}

// Drag the divider →
// Cross min/max to feel the rubber-band.
// Snap points at 25 / 50 / 75 %.
`}</pre>
    </div>
  )
}

function TopPane() {
  return (
    <div className="flex h-full items-center justify-center bg-zinc-950/40">
      <div className="text-center">
        <p className="text-[10px] uppercase tracking-[0.22em] text-white/35">Preview</p>
        <h3 className="mt-2 text-2xl font-semibold text-white">Top pane</h3>
        <p className="mt-1 text-[12px] text-white/55">Drag the divider down to grow me.</p>
      </div>
    </div>
  )
}
function BottomPane() {
  return (
    <div className="flex h-full items-center justify-center bg-white/[0.02]">
      <div className="text-center">
        <p className="text-[10px] uppercase tracking-[0.22em] text-white/35">Logs</p>
        <h3 className="mt-2 text-2xl font-semibold text-white">Bottom pane</h3>
      </div>
    </div>
  )
}

export default function SplitPanelDocs() {
  return (
    <DocsPage
      title="Split Panel"
      slug="split-panel"
      description="Two panes with a draggable divider — the Linear/Notion editor pattern. Drag the divider to resize; cross min/max and the panel rubber-bands. Optional snap points magnet the divider toward specific sizes. Works horizontal or vertical. Keyboard: ←/→ (or ↑/↓) to nudge, Shift for big steps, Home/End to slam to min/max."
      category="71 · layout"
    >
      <DocsSection title="Horizontal (drag divider →)">
        <DemoCard className="min-h-[460px] overflow-hidden p-0">
          <div className="h-[440px] w-full">
            <SplitPanel
              defaultSize={0.32}
              minSize={0.18}
              maxSize={0.6}
              snap={[0.25, 0.4, 0.55]}
            >
              <FilePane />
              <EditorPane />
            </SplitPanel>
          </div>
        </DemoCard>
      </DocsSection>

      <DocsSection title="Vertical (drag divider ↓)">
        <DemoCard className="min-h-[460px] overflow-hidden p-0">
          <div className="h-[440px] w-full">
            <SplitPanel direction="vertical" defaultSize={0.55} minSize={0.25} maxSize={0.8}>
              <TopPane />
              <BottomPane />
            </SplitPanel>
          </div>
        </DemoCard>
      </DocsSection>

      <DocsSection title="Usage">
        <CodeBlock code={SNIPPET} language="tsx" />
      </DocsSection>

      <DocsSection title="Props">
        <ul className="grid gap-2 sm:grid-cols-2">
          {[
            ['children', 'Exactly two children — leading + trailing pane.'],
            ['direction', '"horizontal" (left/right) or "vertical" (top/bottom). Default "horizontal".'],
            ['defaultSize', 'Initial size of the leading pane as a fraction 0..1. Default 0.5.'],
            ['minSize / maxSize', 'Bounds for the leading pane (fractions). Defaults 0.15 / 0.85.'],
            ['snap', 'Snap targets (fractions) the divider magnets toward.'],
            ['snapTolerance', 'Pull-in distance for snap targets. Default 0.04.'],
            ['onResize', '(size: number) => void.'],
            ['className', 'Extra classes on the outer container.'],
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
          {['framer-motion', 'lucide-react'].map((d) => (
            <code key={d} className="rounded-md border border-white/10 bg-white/[0.04] px-2 py-1 font-mono text-xs text-white/80">
              {d}
            </code>
          ))}
        </div>
      </DocsSection>
    </DocsPage>
  )
}
