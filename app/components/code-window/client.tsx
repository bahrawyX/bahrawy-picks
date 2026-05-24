'use client'

import { CodeWindow } from '@/components/bahrawy/code-window'
import { CodeBlock } from '@/components/showcase/code-block'
import { DocsPage, DocsSection, DemoCard } from '@/components/showcase/docs-page'

const SNIPPET = `import { CodeWindow } from '@/components/bahrawy/code-window'

<CodeWindow
  language="tsx"
  filename="components/queue.tsx"
  highlight={[[3, 6]]}
  code={\`import { Queue } from '@/components/bahrawy/queue'

export function Example() {
  return (
    <Queue
      groups={[{ title: 'Todo', items: [{ id: '1', label: 'Ship it' }] }]}
    />
  )
}\`}
/>`

const TSX_CODE = `'use client'

import { useState } from 'react'
import { Queue } from '@/components/bahrawy/queue'

// Build a self-managing task board in under 10 lines.
export function Example() {
  const [done, setDone] = useState(0)

  return (
    <Queue
      groups={[
        {
          id: 'queued',
          title: 'Queued',
          items: [
            { id: '1', label: 'Ship the new component' },
            { id: '2', label: 'Write the docs' },
          ],
        },
      ]}
      onToggle={(_g, _i, checked) =>
        setDone((d) => d + (checked ? 1 : -1))
      }
    />
  )
}`

const CSS_CODE = `.button {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  height: 36px;
  padding: 0 16px;
  border-radius: 9999px;
  background: linear-gradient(135deg, #A78BFA, #22D3EE);
  color: white;
  font-weight: 600;
  transition: transform 0.18s ease-out;
}

.button:hover {
  transform: translateY(-1px) scale(1.03);
}`

const JSON_CODE = `{
  "name": "bahrawy",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start"
  },
  "dependencies": {
    "next": "^15.1.6",
    "react": "19.0.0",
    "framer-motion": "^12.38.0",
    "three": "^0.184.0",
    "ogl": "^1.0.11"
  }
}`

const BASH_CODE = `$ npm install @bahrawy/ui
added 12 packages in 2.4s

$ npm run build
▲ Next.js 15.5.18
✓ Compiled successfully in 4.7s
✓ Generating static pages (170/170)

$ npm run deploy --prod
✓ Deployed to https://bahrawy.me`

export default function CodeWindowDocs() {
  return (
    <DocsPage
      title="Code Window"
      slug="code-window"
      description="Static syntax-highlighted code in a mac-style window frame. Different from Code Editor (which is interactive Monaco) — this is a read-only 'screenshot in a window' for landing pages, docs, and marketing content. Traffic lights + filename + language chip in the chrome, line numbers + copy button in the body. Highlighting is a lightweight hand-rolled tokeniser for JS/TS/TSX/CSS/JSON/Bash — no Shiki, no Prism, no build-step dependency."
      category="23 · decoration"
    >
      <DocsSection title="TypeScript (with line highlights)">
        <DemoCard className="min-h-[520px]">
          <div className="w-full max-w-2xl">
            <CodeWindow
              language="tsx"
              filename="components/example.tsx"
              code={TSX_CODE}
              highlight={[[4, 4], [12, 17]]}
            />
          </div>
        </DemoCard>
      </DocsSection>

      <DocsSection title="CSS">
        <DemoCard className="min-h-[420px]">
          <div className="w-full max-w-2xl">
            <CodeWindow
              language="css"
              filename="styles/button.css"
              code={CSS_CODE}
              highlight={[8]}
              highlightAccent="#22D3EE"
            />
          </div>
        </DemoCard>
      </DocsSection>

      <DocsSection title="JSON (package.json)">
        <DemoCard className="min-h-[460px]">
          <div className="w-full max-w-2xl">
            <CodeWindow
              language="json"
              filename="package.json"
              code={JSON_CODE}
              showLineNumbers={false}
            />
          </div>
        </DemoCard>
      </DocsSection>

      <DocsSection title="Bash transcript">
        <DemoCard className="min-h-[320px]">
          <div className="w-full max-w-2xl">
            <CodeWindow
              language="bash"
              filename="bash"
              code={BASH_CODE}
              showLineNumbers={false}
              highlightAccent="#34D399"
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
            ['code', 'The code body as a string.'],
            ['language', '"tsx" | "ts" | "jsx" | "js" | "css" | "json" | "bash" | "text". Default "tsx".'],
            ['filename', 'Filename shown in the chrome header.'],
            ['showCopy', 'Show the copy button. Default true.'],
            ['showLineNumbers', 'Show line-number gutter. Default true.'],
            ['highlight', 'Lines to highlight — array of numbers or [start,end] ranges.'],
            ['highlightAccent', 'Highlight color. Default #A78BFA.'],
            ['bare', 'Hide the mac chrome — just code in a card. Default false.'],
            ['className', 'Extra classes on the outer frame.'],
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
