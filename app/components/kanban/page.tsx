'use client'

import { useState, useCallback } from 'react'
import { Kanban, type KanbanColumn, type KanbanCard } from '@/components/bahrawy/kanban'
import { CodeBlock } from '@/components/showcase/code-block'
import {
  DemoCard,
  DocsPage,
  DocsSection,
} from '@/components/showcase/docs-page'
import { PropsTable } from '@/components/showcase/props-table'

// ---------------------------------------------------------------------------
// Demo data
// ---------------------------------------------------------------------------

const DEMO_COLUMNS: KanbanColumn[] = [
  {
    id: 'backlog',
    title: 'Backlog',
    color: '#6b7280',
    cards: [
      {
        id: '1',
        title: 'Research competitors',
        description: 'Analyze top 5 competitors',
        priority: 'low',
        labels: [{ text: 'Research', color: '#3b82f6' }],
      },
      {
        id: '2',
        title: 'Design system audit',
        priority: 'medium',
        labels: [{ text: 'Design', color: '#8b5cf6' }],
        comments: 3,
      },
      { id: '3', title: 'Write API docs', priority: 'low', attachments: 2 },
    ],
  },
  {
    id: 'in-progress',
    title: 'In Progress',
    color: '#3b82f6',
    cards: [
      {
        id: '4',
        title: 'Build auth flow',
        description: 'Implement OAuth2 with Google',
        priority: 'high',
        labels: [{ text: 'Feature', color: '#22c55e' }],
        assignees: [{ name: 'Ahmed' }, { name: 'Sara' }],
        comments: 5,
      },
      {
        id: '5',
        title: 'Fix mobile nav',
        priority: 'urgent',
        labels: [{ text: 'Bug', color: '#ef4444' }],
        dueDate: new Date(),
      },
    ],
  },
  {
    id: 'review',
    title: 'Review',
    color: '#f59e0b',
    cards: [
      {
        id: '6',
        title: 'Landing page redesign',
        priority: 'high',
        labels: [{ text: 'Design', color: '#8b5cf6' }],
        assignees: [{ name: 'Omar' }],
        attachments: 4,
        comments: 8,
      },
    ],
  },
  {
    id: 'done',
    title: 'Done',
    color: '#22c55e',
    cards: [
      {
        id: '7',
        title: 'Setup CI/CD',
        priority: 'medium',
        labels: [{ text: 'DevOps', color: '#06b6d4' }],
      },
      { id: '8', title: 'Database migration', priority: 'high' },
    ],
  },
]

const WIP_COLUMNS: KanbanColumn[] = [
  {
    id: 'wip-todo',
    title: 'To Do',
    color: '#6b7280',
    cards: [
      { id: 'w1', title: 'Task A', priority: 'low' },
      { id: 'w2', title: 'Task B', priority: 'medium' },
    ],
  },
  {
    id: 'wip-progress',
    title: 'In Progress',
    color: '#3b82f6',
    limit: 3,
    cards: [
      { id: 'w3', title: 'Overloaded task 1', priority: 'high' },
      { id: 'w4', title: 'Overloaded task 2', priority: 'urgent' },
      { id: 'w5', title: 'Overloaded task 3', priority: 'medium' },
      { id: 'w6', title: 'Overloaded task 4', priority: 'high' },
    ],
  },
  {
    id: 'wip-done',
    title: 'Done',
    color: '#22c55e',
    cards: [{ id: 'w7', title: 'Completed task', priority: 'low' }],
  },
]

// ---------------------------------------------------------------------------
// Code snippets
// ---------------------------------------------------------------------------

const BASIC_SNIPPET = `import { Kanban, type KanbanColumn } from '@/components/bahrawy/kanban'

const [columns, setColumns] = useState<KanbanColumn[]>([
  {
    id: 'backlog',
    title: 'Backlog',
    color: '#6b7280',
    cards: [
      { id: '1', title: 'Research competitors', priority: 'low' },
    ],
  },
  // ...more columns
])

<Kanban columns={columns} />`

const WIP_SNIPPET = `<Kanban
  columns={[
    {
      id: 'in-progress',
      title: 'In Progress',
      color: '#3b82f6',
      limit: 3,        // WIP limit
      cards: [/* 4 cards — exceeds limit */],
    },
  ]}
/>`

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function KanbanDocs() {
  const [basicColumns, setBasicColumns] = useState<KanbanColumn[]>(DEMO_COLUMNS)
  const [wipColumns, setWipColumns] = useState<KanbanColumn[]>(WIP_COLUMNS)

  return (
    <DocsPage
      title="Kanban"
      slug="kanban"
      description="Full-featured drag and drop Kanban board with columns, cards, WIP limits, search, filters, and detail dialogs."
      category="09 · DATA"
    >
      {/* Basic Board */}
      <DocsSection
        title="Basic Board"
        description="Drag cards between columns, reorder columns, search and filter by priority. Click a card to edit."
      >
        <DemoCard className="items-start overflow-x-auto">
          <div className="w-full min-w-[900px]">
            <Kanban columns={basicColumns} />
          </div>
        </DemoCard>
        <CodeBlock code={BASIC_SNIPPET} language="tsx" />
      </DocsSection>

      {/* WIP Limits */}
      <DocsSection
        title="WIP Limits"
        description="Set a limit on columns to warn when card count exceeds capacity."
      >
        <DemoCard className="items-start overflow-x-auto">
          <div className="w-full min-w-[700px]">
            <Kanban
              columns={wipColumns}
              showSearch={false}
              showFilters={false}
            />
          </div>
        </DemoCard>
        <CodeBlock code={WIP_SNIPPET} language="tsx" />
      </DocsSection>

      {/* Props tables */}
      <DocsSection title="KanbanProps">
        <PropsTable
          props={[
            {
              name: 'columns',
              type: 'KanbanColumn[]',
              description: 'Array of column definitions with their cards.',
            },
            {
              name: 'onCardMove',
              type: '(cardId, fromColumnId, toColumnId, newIndex) => void',
              description:
                'Called when a card is dragged to a new position. Enables controlled mode.',
            },
            {
              name: 'onCardUpdate',
              type: '(card: KanbanCard) => void',
              description: 'Called when a card is edited via the detail dialog.',
            },
            {
              name: 'onCardAdd',
              type: '(columnId: string, card: KanbanCard) => void',
              description: 'Called when a new card is added via quick-add.',
            },
            {
              name: 'onCardDelete',
              type: '(cardId: string, columnId: string) => void',
              description: 'Called when a card is deleted.',
            },
            {
              name: 'onColumnReorder',
              type: '(columns: KanbanColumn[]) => void',
              description:
                'Called when columns are reordered via drag and drop.',
            },
            {
              name: 'onColumnAdd',
              type: '(column: KanbanColumn) => void',
              description: 'Called when a new column is added.',
            },
            {
              name: 'onColumnDelete',
              type: '(columnId: string) => void',
              description: 'Called when a column is deleted.',
            },
            {
              name: 'showSearch',
              type: 'boolean',
              default: 'true',
              description: 'Show the search bar above the board.',
            },
            {
              name: 'showFilters',
              type: 'boolean',
              default: 'true',
              description: 'Show the priority filter bar.',
            },
            {
              name: 'cardWidth',
              type: 'number',
              default: '280',
              description: 'Width of each card in pixels.',
            },
            {
              name: 'className',
              type: 'string',
              description: 'Additional classes for the board wrapper.',
            },
          ]}
        />
      </DocsSection>

      <DocsSection title="KanbanColumn">
        <PropsTable
          props={[
            {
              name: 'id',
              type: 'string',
              description: 'Unique column identifier.',
            },
            {
              name: 'title',
              type: 'string',
              description: 'Column header text.',
            },
            {
              name: 'color',
              type: 'string',
              description:
                'Hex color for the column header dot indicator.',
            },
            {
              name: 'limit',
              type: 'number',
              description:
                'WIP limit. Shows a warning badge when card count exceeds this value.',
            },
            {
              name: 'cards',
              type: 'KanbanCard[]',
              description: 'Array of cards in this column.',
            },
            {
              name: 'collapsed',
              type: 'boolean',
              default: 'false',
              description: 'Whether the column starts collapsed.',
            },
          ]}
        />
      </DocsSection>

      <DocsSection title="KanbanCard">
        <PropsTable
          props={[
            {
              name: 'id',
              type: 'string',
              description: 'Unique card identifier.',
            },
            {
              name: 'title',
              type: 'string',
              description: 'Card title text.',
            },
            {
              name: 'description',
              type: 'string',
              description: 'Optional card description (truncated to 2 lines).',
            },
            {
              name: 'priority',
              type: '"low" | "medium" | "high" | "urgent"',
              description:
                'Card priority. Determines the colored left border.',
            },
            {
              name: 'labels',
              type: '{ text: string; color: string }[]',
              description: 'Colored label badges shown on the card.',
            },
            {
              name: 'assignees',
              type: '{ name: string; avatar?: string }[]',
              description:
                'Assignee avatars (max 3 shown with +N overflow).',
            },
            {
              name: 'dueDate',
              type: 'Date',
              description:
                'Due date. Shown in red when overdue.',
            },
            {
              name: 'attachments',
              type: 'number',
              description: 'Number of attachments (shown with paperclip icon).',
            },
            {
              name: 'comments',
              type: 'number',
              description: 'Number of comments (shown with message icon).',
            },
            {
              name: 'coverImage',
              type: 'string',
              description: 'URL for a cover image displayed at the top of the card.',
            },
            {
              name: 'metadata',
              type: 'Record<string, unknown>',
              description: 'Arbitrary metadata for custom extensions.',
            },
          ]}
        />
      </DocsSection>
    </DocsPage>
  )
}
