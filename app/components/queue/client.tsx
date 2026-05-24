'use client'

import * as React from 'react'
import { Queue } from '@/components/bahrawy/queue'
import { CodeBlock } from '@/components/showcase/code-block'
import { DocsPage, DocsSection, DemoCard } from '@/components/showcase/docs-page'

const SNIPPET = `import { Queue } from '@/components/bahrawy/queue'

<Queue
  groups={[
    {
      id: 'queued',
      title: 'Queued',
      defaultOpen: true,
      items: [
        { id: 'a', label: 'How do I set up the project?' },
        { id: 'b', label: 'What is the roadmap for Q4?' },
        { id: 'c', label: 'Update the default logo to this png.' },
      ],
    },
    {
      id: 'todo',
      title: 'Todo',
      defaultOpen: true,
      items: [
        { id: 'd', label: 'Write project documentation', checked: true },
        { id: 'e', label: 'Implement authentication' },
        {
          id: 'f',
          label: 'Fix bug #42',
          description: 'Resolve crash on settings page',
        },
      ],
    },
  ]}
/>`

function Avatar({ initials }: { initials: string }) {
  return (
    <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-violet-400/40 to-rose-400/40 text-[10px] font-semibold tracking-tight text-white/90">
      {initials}
    </span>
  )
}

export default function QueueDocs() {
  return (
    <DocsPage
      title="Queue"
      slug="queue"
      description="Linear-style collapsible task groups. Each section header toggles the group open or closed with a spring-eased height animation. Items have a soft round checkbox that fades + strikes the label through on complete, plus optional sub-text and avatar slots."
      category="63 · data"
    >
      <DocsSection title="Live demo">
        <DemoCard className="min-h-[420px] items-start py-8">
          <div className="w-full max-w-md">
            <Queue
              groups={[
                {
                  id: 'queued',
                  title: 'Queued',
                  defaultOpen: true,
                  items: [
                    { id: 'a', label: 'How do I set up the project?' },
                    { id: 'b', label: 'What is the roadmap for Q4?' },
                    {
                      id: 'c',
                      label: 'Update the default logo to this png.',
                      avatar: <Avatar initials="AB" />,
                    },
                    { id: 'd', label: 'Please generate a changelog.' },
                  ],
                },
                {
                  id: 'todo',
                  title: 'Todo',
                  defaultOpen: true,
                  items: [
                    {
                      id: 'e',
                      label: 'Write project documentation',
                      description: 'Complete the README and API docs',
                      checked: true,
                    },
                    { id: 'f', label: 'Implement authentication' },
                    {
                      id: 'g',
                      label: 'Fix bug #42',
                      description: 'Resolve crash on settings page',
                    },
                    { id: 'h', label: 'Refactor queue logic' },
                  ],
                },
              ]}
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
            ['groups', 'Array of { id, title, items, defaultOpen? }.'],
            ['onToggle', '(groupId, itemId, checked) => void.'],
            ['showCount', 'Show the un-checked count next to the title. Default true.'],
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
