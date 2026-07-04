'use client'

import { Kanban, type KanbanColumn } from '@/components/bahrawy/kanban'
import { CodeBlock } from '@/components/showcase/code-block'
import { DocsPage, DocsSection } from '@/components/showcase/docs-page'
import { PropsTable } from '@/components/showcase/props-table'
import type { PropEntry } from '@/components/showcase/registry'

// Seed for the live demo — used only on first visit; once the visitor
// changes anything, localStorage (via storageKey) takes over.
const DEMO_COLUMNS: KanbanColumn[] = [
  {
    id: 'todo',
    label: 'To Do',
    accent: 'neutral',
    cards: [
      {
        id: 'demo-brief',
        title: 'Write launch brief',
        description: 'One-pager covering audience, message, and channels.',
        priority: 'high',
        difficulty: 'medium',
        subtasks: [
          { id: 'demo-brief-1', title: 'Collect product screenshots', done: true },
          { id: 'demo-brief-2', title: 'Draft key messaging' },
        ],
      },
      {
        id: 'demo-pricing',
        title: 'Review pricing page copy',
        priority: 'medium',
        difficulty: 'easy',
      },
    ],
  },
  {
    id: 'doing',
    label: 'Doing',
    accent: 'primary',
    cards: [
      {
        id: 'demo-onboarding',
        title: 'Redesign onboarding flow',
        description: 'Cut the signup steps from five to three.',
        priority: 'high',
        difficulty: 'hard',
        subtasks: [
          { id: 'demo-onboarding-1', title: 'Audit current funnel', done: true },
          { id: 'demo-onboarding-2', title: 'Prototype new flow', done: true },
          { id: 'demo-onboarding-3', title: 'Usability test with 5 users' },
        ],
      },
    ],
  },
  {
    id: 'done',
    label: 'Done',
    accent: 'emerald',
    cards: [
      {
        id: 'demo-darkmode',
        title: 'Ship dark mode toggle',
        priority: 'low',
        difficulty: 'medium',
      },
    ],
  },
]

const USAGE_SNIPPET = `import { Kanban } from '@/components/bahrawy/kanban'

export default function Page() {
  return (
    <main className="h-screen p-4 md:p-6 lg:p-8">
      {/* Uncontrolled: starts from defaultColumns (or empty To Do/Doing/Done)
          and persists to localStorage because storageKey is set. */}
      <Kanban storageKey="kanban" />
    </main>
  )
}`

const CONTROLLED_SNIPPET = `import { useState } from 'react'
import { Kanban, type KanbanColumn } from '@/components/bahrawy/kanban'

const INITIAL: KanbanColumn[] = [
  {
    id: 'todo',
    label: 'To Do',
    accent: 'neutral',
    cards: [
      {
        id: 'task-1',
        title: 'Ship the release',
        priority: 'high',
        difficulty: 'medium',
        dueDate: '2026-07-10',
        subtasks: [
          { id: 'task-1a', title: 'Write changelog', done: true },
          { id: 'task-1b', title: 'Tag the build' },
        ],
      },
    ],
  },
  { id: 'doing', label: 'Doing', accent: 'primary', cards: [] },
  { id: 'done', label: 'Done', accent: 'emerald', cards: [] },
]

export default function Page() {
  const [columns, setColumns] = useState<KanbanColumn[]>(INITIAL)

  return (
    <main className="h-screen p-4 md:p-6 lg:p-8">
      <Kanban
        columns={columns}
        onChange={setColumns}
        onCardMove={({ cardId, fromColumnId, toColumnId, toIndex }) => {
          // e.g. sync the move to your backend
          console.log(cardId, fromColumnId, '→', toColumnId, '@', toIndex)
        }}
        onCardClick={(card) => console.log('opened', card.id)}
      />
    </main>
  )
}`

const PROPS: PropEntry[] = [
  {
    name: 'columns',
    type: 'KanbanColumn[]',
    description:
      'Controlled board data — columns with their cards (and nested subtasks). Pair with onChange and feed the data back in.',
  },
  {
    name: 'onChange',
    type: '(columns: KanbanColumn[]) => void',
    description:
      'Fired with the full board data after any change (add/edit/delete/move of cards, columns, or subtasks). Works in both controlled and uncontrolled mode.',
  },
  {
    name: 'defaultColumns',
    type: 'KanbanColumn[]',
    default: 'To Do / Doing / Done',
    description:
      'Initial data for uncontrolled usage. Defaults to empty To Do, Doing, and Done columns.',
  },
  {
    name: 'storageKey',
    type: 'string',
    description:
      'Opt-in persistence. When set, the board and its view preferences are stored in localStorage under keys namespaced by this value. Omit for a fully in-memory board.',
  },
  {
    name: 'onCardMove',
    type: '(event: KanbanCardMoveEvent) => void',
    description:
      'Fired when a card is dropped in a new position — { cardId, fromColumnId, toColumnId, toIndex }.',
  },
  {
    name: 'onCardClick',
    type: '(card: KanbanCard) => void',
    description: 'Fired when a card is opened for editing (click on card or Edit action).',
  },
]

const FEATURES = [
  ['Drag & drop tasks', 'Reorder within a column or move across columns. Built on @dnd-kit with optimistic UI.'],
  ['Custom columns', 'Add, rename, recolor, reorder, and delete columns. Eight accent colors per column dot.'],
  ['Subtasks', 'Up to two levels of nesting. Tick subtasks off; the parent prompts to complete when all are done.'],
  ['Priority & difficulty', 'Inline pill menus on every card. Low/Medium/High and Easy/Medium/Hard with signal-bar icons.'],
  ['Due dates', 'Calendar popover with overdue/today/tomorrow presentations and overdue highlighting.'],
  ['Filters', 'Search by title or description, filter by priority, difficulty, and due-date window.'],
  ['List view', 'Switch from board to a sortable list with group-by status/priority/difficulty/due date.'],
  ['Opt-in persistence', 'Pass storageKey to persist tasks, columns, and view preferences to localStorage. In-memory otherwise.'],
  ['Controlled or uncontrolled', 'Feed columns + onChange to own the data, or drop it in with defaultColumns and let it self-manage.'],
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
      description="A full-featured task board component. Drag-and-drop columns, subtasks, filters, list view — controlled or uncontrolled, with opt-in localStorage persistence."
      category="75 · data"
    >
      <DocsSection
        title="Live demo"
        description="Open a task to edit it. Add a column. Drag tasks around. This demo passes storageKey so everything you change is persisted in localStorage."
      >
        <div className="h-[720px] w-full overflow-hidden rounded-xl border border-white/10 bg-black p-4 md:p-5">
          <Kanban storageKey="kanban" defaultColumns={DEMO_COLUMNS} />
        </div>
      </DocsSection>

      <DocsSection
        title="Usage"
        description="No props required — drop it in a full-height layout. Add storageKey if you want the board to survive reloads."
      >
        <CodeBlock code={USAGE_SNIPPET} language="tsx" />
      </DocsSection>

      <DocsSection
        title="Controlled usage"
        description="Pass columns + onChange to own the data: every card edit, move, or column change comes back through onChange as a nested KanbanColumn[] you can persist anywhere."
      >
        <CodeBlock code={CONTROLLED_SNIPPET} language="tsx" />
      </DocsSection>

      <DocsSection title="Props">
        <PropsTable props={PROPS} />
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
