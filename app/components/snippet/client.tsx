'use client'

import { Heart } from 'lucide-react'
import { Snippet } from '@/components/bahrawy/snippet'
import { CodeBlock } from '@/components/showcase/code-block'
import { DocsPage, DocsSection, DemoCard } from '@/components/showcase/docs-page'

const SNIPPET = `import { Snippet } from '@/components/bahrawy/snippet'

<Snippet
  prefix="$ "
  tabs={[
    { label: 'npm',  code: 'npm install @bahrawy/queue' },
    { label: 'pnpm', code: 'pnpm add @bahrawy/queue' },
    { label: 'yarn', code: 'yarn add @bahrawy/queue' },
    { label: 'bun',  code: 'bun add @bahrawy/queue' },
  ]}
/>`

export default function SnippetDocs() {
  return (
    <DocsPage
      title="Snippet"
      slug="snippet"
      description="A copy-and-go code snippet. A tab bar at the top — npm / pnpm / yarn / bun, or any tabs you pass — with a spring-animated active pill. The code body crossfades when the active tab changes. A copy button on the right swaps to a checkmark on success."
      category="67 · ui"
    >
      <DocsSection title="Install command (with tabs)">
        <DemoCard className="min-h-[180px]">
          <div className="w-full max-w-xl">
            <Snippet
              prefix="$ "
              tabs={[
                { label: 'npm', code: 'npm install @bahrawy/queue' },
                { label: 'pnpm', code: 'pnpm add @bahrawy/queue' },
                { label: 'yarn', code: 'yarn add @bahrawy/queue' },
                { label: 'bun', code: 'bun add @bahrawy/queue' },
              ]}
            />
          </div>
        </DemoCard>
      </DocsSection>

      <DocsSection title="With icon tabs (kibo-ui style)">
        <DemoCard className="min-h-[180px]">
          <div className="w-full max-w-xl">
            <Snippet
              tabs={[
                {
                  label: 'kibo-ui',
                  code: 'npx kibo-ui@latest add snippet',
                  icon: <Heart className="h-3 w-3" strokeWidth={2.5} />,
                },
                {
                  label: 'shadcn',
                  code: 'npx shadcn@latest add https://bahrawy.me/r/snippet.json',
                },
              ]}
            />
          </div>
        </DemoCard>
      </DocsSection>

      <DocsSection title="Single line, no tabs">
        <DemoCard className="min-h-[120px]">
          <div className="w-full max-w-xl">
            <Snippet
              prefix="$ "
              tabs={[{ label: 'bash', code: 'curl -sSL https://bahrawy.me/install | sh' }]}
            />
          </div>
        </DemoCard>
      </DocsSection>

      <DocsSection title="Usage">
        <CodeBlock code={SNIPPET} language="tsx" />
      </DocsSection>

      <DocsSection title="Props">
        <ul className="grid gap-2 sm:grid-cols-2">
          {[
            ['tabs', 'Array of { label, code, icon? }. Single-tab hides the bar.'],
            ['defaultTab', 'Initial active tab label. Default = first tab.'],
            ['multiline', 'Render code as a wrapped block instead of one truncating line.'],
            ['prefix', 'Optional prefix to prepend to the code (e.g. "$ ").'],
            ['hideCopy', 'Hide the copy button. Default false.'],
            ['onCopy', '(tab) => void — fires after a successful copy.'],
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
