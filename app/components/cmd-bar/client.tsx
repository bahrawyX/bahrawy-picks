'use client'

import * as React from 'react'
import {
  Calendar,
  Code2,
  FileText,
  GitBranch,
  Inbox,
  Search,
  Settings,
  Sparkles,
  User,
  Zap,
} from 'lucide-react'
import { CmdBar, type CmdBarGroup } from '@/components/bahrawy/cmd-bar'
import { CodeBlock } from '@/components/showcase/code-block'
import { DocsPage, DocsSection, DemoCard } from '@/components/showcase/docs-page'

const SNIPPET = `import { CmdBar } from '@/components/bahrawy/cmd-bar'

const [open, setOpen] = useState(false)

<CmdBar
  open={open}
  onOpenChange={setOpen}
  groups={[
    {
      label: 'Actions',
      items: [
        {
          id: 'inbox',
          label: 'Open inbox',
          icon: <Inbox />,
          hint: 'I',
          preview: <p>Jump to your inbox to triage threads.</p>,
          meta: [{ label: 'Shortcut', value: '⌘ I' }],
          onSelect: () => router.push('/inbox'),
        },
      ],
    },
  ]}
/>`

export default function CmdBarDocs() {
  const [open, setOpen] = React.useState(false)

  const groups: CmdBarGroup[] = [
    {
      label: 'Actions',
      items: [
        {
          id: 'inbox',
          icon: <Inbox />,
          label: 'Open inbox',
          hint: '⌘ I',
          keywords: ['mail', 'messages', 'threads'],
          preview: (
            <div>
              <p className="text-[11.5px] leading-relaxed text-white/65">
                Jump to your inbox to triage threads, archive what's done, and
                snooze the rest.
              </p>
              <div className="mt-3 rounded-md border border-white/[0.06] bg-white/[0.02] p-2.5 font-mono text-[10.5px] text-white/55">
                <p>
                  <span className="text-amber-300">12</span> unread ·{' '}
                  <span className="text-emerald-300">3</span> needs reply
                </p>
              </div>
            </div>
          ),
          meta: [
            { label: 'Shortcut', value: '⌘ I' },
            { label: 'Section', value: 'Mail' },
          ],
        },
        {
          id: 'new-doc',
          icon: <FileText />,
          label: 'New document',
          hint: '⌘ N',
          preview: (
            <p className="text-[11.5px] leading-relaxed text-white/65">
              Create a blank document. Templates available from the menu after
              you start.
            </p>
          ),
          meta: [
            { label: 'Shortcut', value: '⌘ N' },
            { label: 'Type', value: 'Document' },
          ],
        },
        {
          id: 'search',
          icon: <Search />,
          label: 'Search everything',
          hint: '⌘ K',
          preview: (
            <p className="text-[11.5px] leading-relaxed text-white/65">
              Full-text search across docs, threads, and people. Operators:{' '}
              <code className="font-mono text-white/85">from:@user</code>,{' '}
              <code className="font-mono text-white/85">in:#channel</code>.
            </p>
          ),
        },
      ],
    },
    {
      label: 'Navigate',
      items: [
        {
          id: 'profile',
          icon: <User />,
          label: 'View profile',
          hint: 'G P',
          preview: (
            <div className="flex items-center gap-3">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-violet-400/45 to-rose-400/45 text-[12px] font-semibold text-white">
                AB
              </span>
              <div className="min-w-0">
                <p className="truncate text-[12px] font-semibold text-white">
                  Abdelrahman Bahrawy
                </p>
                <p className="truncate text-[10.5px] text-white/45">
                  bahrawy.me
                </p>
              </div>
            </div>
          ),
        },
        {
          id: 'settings',
          icon: <Settings />,
          label: 'Settings',
          hint: 'G S',
          preview: (
            <p className="text-[11.5px] leading-relaxed text-white/65">
              Account, theme, keyboard shortcuts, integrations, and billing.
            </p>
          ),
        },
        {
          id: 'calendar',
          icon: <Calendar />,
          label: 'Calendar',
          hint: 'G C',
          preview: (
            <p className="text-[11.5px] leading-relaxed text-white/65">
              Today: 3 meetings, 2 focus blocks. Next up at 3:00 PM.
            </p>
          ),
        },
      ],
    },
    {
      label: 'Developer',
      items: [
        {
          id: 'gh',
          icon: <GitBranch />,
          label: 'Switch branch',
          hint: '⇧ B',
          preview: (
            <div>
              <p className="text-[11.5px] text-white/65">Pick a branch:</p>
              <ul className="mt-2 space-y-1 font-mono text-[11px]">
                <li className="text-violet-300">* main</li>
                <li className="text-white/55">feat/audio-player</li>
                <li className="text-white/55">fix/avatar-clipping</li>
              </ul>
            </div>
          ),
        },
        {
          id: 'snippet',
          icon: <Code2 />,
          label: 'Insert snippet',
          hint: '⇧ I',
          preview: (
            <pre className="overflow-x-auto rounded-md bg-black/40 p-2 font-mono text-[10.5px] text-emerald-300">
              {`const greet = (n) =>\n  \`hello, \${n}\``}
            </pre>
          ),
        },
        {
          id: 'ai',
          icon: <Sparkles />,
          label: 'Ask AI',
          hint: '⌘ J',
          preview: (
            <p className="text-[11.5px] leading-relaxed text-white/65">
              Ask anything about your codebase. The assistant reads recent files
              for context.
            </p>
          ),
        },
        {
          id: 'deploy',
          icon: <Zap />,
          label: 'Deploy to production',
          hint: '⌘ ⇧ D',
          preview: (
            <div>
              <p className="text-[11.5px] text-white/65">
                Latest commit will be deployed:
              </p>
              <p className="mt-1.5 font-mono text-[11px] text-white/85">
                <span className="text-cyan-300">a463e89</span> Add 3 components:
                AppShell, Browser Window, Drag to Confirm
              </p>
            </div>
          ),
        },
      ],
    },
  ]

  return (
    <DocsPage
      title="Cmd Bar 2.0"
      slug="cmd-bar"
      description="A Raycast-style command palette with a right-side preview pane. As you arrow-key through results, the preview swaps live to show context for the highlighted item — description, metadata, even mini-renders. Two-column layout, portal-mounted overlay, ↑↓ navigation, Enter to fire, Esc to close. The richer companion to the existing flat Command Palette."
      category="71 · overlay"
    >
      <DocsSection title="Live demo (open with the button)">
        <DemoCard className="min-h-[260px]">
          <div className="flex flex-col items-center gap-3">
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="rounded-full bg-white px-4 py-1.5 text-[12.5px] font-semibold text-black transition-transform hover:scale-[1.03]"
            >
              Open Cmd Bar
            </button>
            <p className="text-[10px] uppercase tracking-[0.22em] text-white/35">
              ↑↓ to navigate · ↵ to select · esc to close
            </p>
          </div>
          <CmdBar open={open} onOpenChange={setOpen} groups={groups} />
        </DemoCard>
      </DocsSection>

      <DocsSection title="Usage">
        <CodeBlock code={SNIPPET} language="tsx" />
      </DocsSection>

      <DocsSection title="Props">
        <ul className="grid gap-2 sm:grid-cols-2">
          {[
            ['open / onOpenChange', 'Controlled open state.'],
            ['groups', 'CmdBarGroup[] — { label?, items[] }, item: { id, label, icon?, hint?, preview?, meta?, keywords?, onSelect? }.'],
            ['placeholder', 'Search input placeholder. Default "Search commands…".'],
            ['emptyMessage', 'Copy shown when no items match.'],
            ['accent', 'Highlight pill color. Default #A78BFA.'],
          ].map(([n, b]) => (
            <li key={n} className="rounded-lg border border-white/10 bg-white/[0.02] p-3">
              <code className="font-mono text-xs text-white">{n}</code>
              <p className="mt-1 text-xs text-white/60">{b}</p>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-xs text-white/45">
          <code className="font-mono">preview</code> can be any ReactNode — text,
          a mini chart, a stats grid, an avatar. The pane auto-scrolls when the
          preview overflows.
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
