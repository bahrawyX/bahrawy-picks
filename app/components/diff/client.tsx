'use client'

import { Diff, type DiffLine } from '@/components/bahrawy/diff'
import { CodeBlock } from '@/components/showcase/code-block'
import { DocsPage, DocsSection, DemoCard } from '@/components/showcase/docs-page'

const LINES: DiffLine[] = [
  { type: 'context', content: 'export function greet(name: string) {', oldNumber: 1, newNumber: 1 },
  { type: 'removed', content: '  return "hello " + name', oldNumber: 2 },
  { type: 'removed', content: '}', oldNumber: 3 },
  { type: 'added',   content: '  if (!name) return "hello, stranger"',                     newNumber: 2 },
  { type: 'added',   content: '  return `hello, ${name.trim()}`',                          newNumber: 3 },
  { type: 'added',   content: '}',                                                         newNumber: 4 },
  { type: 'context', content: '',                                                          oldNumber: 4, newNumber: 5 },
  { type: 'context', content: 'export function farewell(name: string) {',                  oldNumber: 5, newNumber: 6 },
  { type: 'context', content: '  return `bye, ${name}`',                                   oldNumber: 6, newNumber: 7 },
  { type: 'context', content: '}',                                                         oldNumber: 7, newNumber: 8 },
]

const STYLE_LINES: DiffLine[] = [
  { type: 'context', content: '.button {',                                  oldNumber: 12, newNumber: 12 },
  { type: 'context', content: '  display: inline-flex;',                    oldNumber: 13, newNumber: 13 },
  { type: 'removed', content: '  background: #6366f1;',                     oldNumber: 14 },
  { type: 'added',   content: '  background: linear-gradient(135deg, #6366f1, #a855f7);', newNumber: 14 },
  { type: 'context', content: '  color: white;',                            oldNumber: 15, newNumber: 15 },
  { type: 'added',   content: '  transition: transform .15s ease-out;',                   newNumber: 16 },
  { type: 'context', content: '}',                                          oldNumber: 16, newNumber: 17 },
  { type: 'context', content: '',                                           oldNumber: 17, newNumber: 18 },
  { type: 'added',   content: '.button:hover { transform: translateY(-1px); }',           newNumber: 19 },
]

const SNIPPET = `import { Diff } from '@/components/bahrawy/diff'

<Diff
  filename="src/greet.ts"
  language="TypeScript"
  lines={[
    { type: 'context', content: 'export function greet(name: string) {', oldNumber: 1, newNumber: 1 },
    { type: 'removed', content: '  return "hello " + name', oldNumber: 2 },
    { type: 'added',   content: '  return \`hello, \${name.trim()}\`', newNumber: 2 },
    // …
  ]}
/>`

export default function DiffDocs() {
  return (
    <DocsPage
      title="Diff"
      slug="diff"
      description="A GitHub-style unified code diff. File header with the filename, optional language chip, and +N/−N stats. Body is monospace lines with old + new line numbers, a ± gutter glyph, and tinted row backgrounds — red for removed, green for added, neutral for context."
      category="47 · data"
    >
      <DocsSection title="TypeScript diff">
        <DemoCard className="min-h-[300px]">
          <div className="w-full max-w-2xl">
            <Diff filename="src/greet.ts" language="TypeScript" lines={LINES} />
          </div>
        </DemoCard>
      </DocsSection>

      <DocsSection title="CSS diff">
        <DemoCard className="min-h-[280px]">
          <div className="w-full max-w-2xl">
            <Diff filename="styles/button.css" language="CSS" lines={STYLE_LINES} />
          </div>
        </DemoCard>
      </DocsSection>

      <DocsSection title="Usage">
        <CodeBlock code={SNIPPET} language="tsx" />
      </DocsSection>

      <DocsSection title="Props">
        <ul className="grid gap-2 sm:grid-cols-2">
          {[
            ['filename', 'Path shown in the header.'],
            ['lines', 'DiffLine[] — { type: "context"|"added"|"removed", content, oldNumber?, newNumber? }.'],
            ['language', 'Optional language chip in the header (e.g. "TypeScript").'],
            ['hideStats', 'Hide the +N/−N badge. Default false.'],
            ['hideLineNumbers', 'Hide the line-number gutter. Default false.'],
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
          {['lucide-react'].map((d) => (
            <code key={d} className="rounded-md border border-white/10 bg-white/[0.04] px-2 py-1 font-mono text-xs text-white/80">
              {d}
            </code>
          ))}
        </div>
      </DocsSection>
    </DocsPage>
  )
}
