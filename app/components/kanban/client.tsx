'use client'

import { Kanban } from '@/components/bahrawy/kanban'
import { CodeBlock } from '@/components/showcase/code-block'
import { DocsPage, DocsSection } from '@/components/showcase/docs-page'

const USAGE_SNIPPET = `import { Kanban } from '@/components/bahrawy/kanban'

export default function Page() {
  return (
    <main className="h-screen p-4 md:p-6 lg:p-8">
      <Kanban />
    </main>
  )
}`

const FEATURES = [
  ['Drag & drop tasks', 'Reorder within a column or move across columns. Built on @dnd-kit with optimistic UI.'],
  ['Custom columns', 'Add, rename, recolor, reorder, and delete columns. Eight accent colors per column dot.'],
  ['Subtasks', 'Up to two levels of nesting. Tick subtasks off; the parent prompts to complete when all are done.'],
  ['Priority & difficulty', 'Inline pill menus on every card. Low/Medium/High and Easy/Medium/Hard with signal-bar icons.'],
  ['Due dates', 'Calendar popover with overdue/today/tomorrow presentations and overdue highlighting.'],
  ['Filters', 'Search by title or description, filter by priority, difficulty, and due-date window.'],
  ['List view', 'Switch from board to a sortable list with group-by status/priority/difficulty/due date.'],
  ['Persistent', 'Tasks, columns, and view preferences are stored in localStorage — survives reloads.'],
  ['Mobile-friendly', 'Bottom sheet dialog, snap-x column scroll, and forced-list view on small screens.'],
] as const

const DEPENDENCIES = [
  '@dnd-kit/core',
  '@dnd-kit/sortable',
  '@dnd-kit/utilities',
  'zustand',
  'framer-motion',
  'sonner',
  'zod',
  'date-fns',
  'react-day-picker',
]

export default function KanbanDocs() {
  return (
    <DocsPage
      title="Kanban"
      slug="kanban"
      description="A complete, self-managing task board. Drop it on a page and you have drag-and-drop columns, subtasks, filters, list view, and persistence — out of the box."
      category="52 · data"
    >
      <DocsSection
        title="Live demo"
        description="Open a task to edit it. Add a column. Drag tasks around. Everything you change is persisted in localStorage."
      >
        <div className="h-[720px] w-full overflow-hidden rounded-xl border border-white/10 bg-black p-4 md:p-5">
          <Kanban />
        </div>
      </DocsSection>

      <DocsSection
        title="Usage"
        description="The component is self-contained — no props required. Just drop it in a full-height layout."
      >
        <CodeBlock code={USAGE_SNIPPET} language="tsx" />
      </DocsSection>

      <DocsSection title="Features">
        <ul className="grid gap-3 sm:grid-cols-2">
          {FEATURES.map(([title, body]) => (
            <li
              key={title}
              className="rounded-lg border border-white/10 bg-white/[0.02] p-3"
            >
              <p className="text-sm font-medium text-white">{title}</p>
              <p className="mt-1 text-xs text-white/60">{body}</p>
            </li>
          ))}
        </ul>
      </DocsSection>

      <DocsSection title="Dependencies">
        <div className="flex flex-wrap gap-2">
          {DEPENDENCIES.map((d) => (
            <code
              key={d}
              className="rounded-md border border-white/10 bg-white/[0.04] px-2 py-1 font-mono text-xs text-white/80"
            >
              {d}
            </code>
          ))}
        </div>
      </DocsSection>
    </DocsPage>
  )
}
