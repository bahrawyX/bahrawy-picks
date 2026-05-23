'use client'

import { Terminal, type TerminalStep } from '@/components/bahrawy/terminal'
import { CodeBlock } from '@/components/showcase/code-block'
import { DocsPage, DocsSection, DemoCard } from '@/components/showcase/docs-page'

const SNIPPET = `import { Terminal } from '@/components/bahrawy/terminal'

<Terminal
  title="~/bahrawy"
  speed={42}
  loop
  steps={[
    { type: 'command', text: 'npm install @bahrawy/ui' },
    { type: 'output',  text: 'added 12 packages in 2.4s',     variant: 'muted' },
    { type: 'pause',   ms: 600 },
    { type: 'command', text: 'npm run build' },
    { type: 'output',  text: '✓ Compiled successfully',       variant: 'success' },
  ]}
/>`

const STEPS: TerminalStep[] = [
  { type: 'command', text: 'npm install @bahrawy/ui' },
  { type: 'output',  text: '⠋ Resolving dependencies…',          variant: 'muted' },
  { type: 'output',  text: 'added 12 packages in 2.4s',          variant: 'muted' },
  { type: 'pause',   ms: 500 },
  { type: 'command', text: 'npm run build' },
  { type: 'output',  text: '▲ Next.js 15.5.18',                  variant: 'accent' },
  { type: 'output',  text: '✓ Compiled successfully in 4.7s',    variant: 'success' },
  { type: 'output',  text: '✓ Generating static pages (152/152)',variant: 'success' },
  { type: 'pause',   ms: 400 },
  { type: 'command', text: 'git status' },
  { type: 'output',  text: 'On branch main',                     variant: 'muted' },
  { type: 'output',  text: 'nothing to commit, working tree clean', variant: 'success' },
  { type: 'pause',   ms: 700 },
  { type: 'command', text: 'npm run deploy --prod' },
  { type: 'output',  text: 'Uploading… ████████████ 100%',       variant: 'accent' },
  { type: 'output',  text: '✓ Deployed to https://bahrawy.me',   variant: 'success' },
  { type: 'pause',   ms: 1200 },
]

const ERROR_STEPS: TerminalStep[] = [
  { type: 'command', text: 'npm run test' },
  { type: 'output',  text: '> jest',                                 variant: 'muted' },
  { type: 'output',  text: 'FAIL  src/auth.test.ts',                 variant: 'error' },
  { type: 'output',  text: '  ● should reject expired tokens',       variant: 'error' },
  { type: 'output',  text: '    Expected 401, received 200',         variant: 'muted' },
  { type: 'output',  text: 'Tests: 1 failed, 23 passed, 24 total',   variant: 'warn' },
  { type: 'pause',   ms: 800 },
  { type: 'command', text: 'git diff src/auth.ts' },
  { type: 'output',  text: '- if (token.expiresAt > now())',         variant: 'error' },
  { type: 'output',  text: '+ if (token.expiresAt < now())',         variant: 'success' },
  { type: 'pause',   ms: 1000 },
]

export default function TerminalDocs() {
  return (
    <DocsPage
      title="Terminal"
      slug="terminal"
      description="A live-looking terminal that auto-types a scripted sequence — command, output, pause, command… — like the demo terminals on the Vercel and Stripe homepages. Blinking cursor, pause-on-hover so visitors can read mid-stream, and an optional play / pause / replay control in the title bar."
      category="49 · data"
    >
      <DocsSection title="Install + build + deploy (looping)">
        <DemoCard className="min-h-[420px] items-start py-8">
          <div className="w-full max-w-2xl">
            <Terminal title="~/bahrawy" steps={STEPS} speed={42} loop />
          </div>
        </DemoCard>
      </DocsSection>

      <DocsSection title="Test failure → fix">
        <DemoCard className="min-h-[380px] items-start py-8">
          <div className="w-full max-w-2xl">
            <Terminal title="bash" steps={ERROR_STEPS} speed={48} loop height="260px" />
          </div>
        </DemoCard>
      </DocsSection>

      <DocsSection title="Usage">
        <CodeBlock code={SNIPPET} language="tsx" />
      </DocsSection>

      <DocsSection title="Props">
        <ul className="grid gap-2 sm:grid-cols-2">
          {[
            ['steps', 'TerminalStep[] — { type: "command"|"output"|"pause", text?, prompt?, variant?, ms? }.'],
            ['title', 'Title-bar text. Default "bash".'],
            ['showHeader', 'Show the mac-style window header. Default true.'],
            ['showControls', 'Show play/pause/replay buttons. Default true.'],
            ['loop', 'Restart the sequence after it finishes. Default true.'],
            ['speed', 'Characters per second when typing. Default 38.'],
            ['pauseOnHover', 'Pause when the cursor is over the terminal. Default true.'],
            ['height', 'Container height. Default "320px".'],
            ['className', 'Extra classes on the outer container.'],
          ].map(([n, b]) => (
            <li key={n} className="rounded-lg border border-white/10 bg-white/[0.02] p-3">
              <code className="font-mono text-xs text-white">{n}</code>
              <p className="mt-1 text-xs text-white/60">{b}</p>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-xs text-white/45">
          Variants: <code className="font-mono">default · success · warn · error · muted · accent</code>
        </p>
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
