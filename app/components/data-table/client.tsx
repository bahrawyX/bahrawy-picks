'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { type ColumnDef } from '@tanstack/react-table'
import { Copy, Eye, Loader2, Trash2 } from 'lucide-react'
import { DataTable } from '@/components/bahrawy/data-table'
import {
  createTextColumn,
  createNumberColumn,
  createDateColumn,
  createBadgeColumn,
  createBooleanColumn,
  createActionsColumn,
} from '@/lib/column-helpers'
import { Button } from '@/components/ui/button'
import { CodeBlock } from '@/components/showcase/code-block'
import {
  DemoCard,
  DocsPage,
  DocsSection,
} from '@/components/showcase/docs-page'
import { PropsTable } from '@/components/showcase/props-table'

// ---------------------------------------------------------------------------
// Mock data types
// ---------------------------------------------------------------------------

interface User {
  id: number
  name: string
  email: string
  role: string
  status: string
  revenue: number
  verified: boolean
  joinedAt: string
  department: string
}

// ---------------------------------------------------------------------------
// Generate mock data
// ---------------------------------------------------------------------------

const NAMES = [
  'Alice Johnson', 'Bob Smith', 'Charlie Brown', 'Diana Prince',
  'Eve Davis', 'Frank Miller', 'Grace Lee', 'Henry Wilson',
  'Ivy Chen', 'Jack Thompson', 'Karen White', 'Leo Martinez',
  'Maya Patel', 'Noah Garcia', 'Olivia Kim', 'Peter Zhang',
  'Quinn Adams', 'Ruby Singh', 'Sam Taylor', 'Tara Moore',
]
const ROLES = ['Admin', 'Editor', 'Viewer', 'Moderator']
const STATUSES = ['Active', 'Inactive', 'Pending', 'Suspended']
const DEPTS = ['Engineering', 'Design', 'Marketing', 'Sales', 'Support']

function generateUsers(count: number): User[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    name: NAMES[i % NAMES.length],
    email: `${NAMES[i % NAMES.length].toLowerCase().replace(' ', '.')}+${i}@example.com`,
    role: ROLES[i % ROLES.length],
    status: STATUSES[i % STATUSES.length],
    revenue: ((i * 7919 + 1301) % 50000) + 1000,
    verified: i % 3 !== 0,
    joinedAt: new Date(2023, i % 12, (i % 28) + 1).toISOString(),
    department: DEPTS[i % DEPTS.length],
  }))
}

const USERS_50 = generateUsers(50)

// ---------------------------------------------------------------------------
// Badge color maps
// ---------------------------------------------------------------------------

const STATUS_COLORS: Record<string, string> = {
  Active: 'bg-emerald-500/15 text-emerald-400',
  Inactive: 'bg-zinc-500/15 text-zinc-400',
  Pending: 'bg-amber-500/15 text-amber-400',
  Suspended: 'bg-red-500/15 text-red-400',
}

const ROLE_COLORS: Record<string, string> = {
  Admin: 'bg-violet-500/15 text-violet-400',
  Editor: 'bg-blue-500/15 text-blue-400',
  Viewer: 'bg-zinc-500/15 text-zinc-400',
  Moderator: 'bg-orange-500/15 text-orange-400',
}

// ---------------------------------------------------------------------------
// Code snippets
// ---------------------------------------------------------------------------

const BASIC_SNIPPET = `import { DataTable } from '@/components/bahrawy'
import {
  createTextColumn,
  createNumberColumn,
  createBadgeColumn,
} from '@/lib/column-helpers'

const columns = [
  createTextColumn<User>('name', 'Name'),
  createTextColumn<User>('email', 'Email'),
  createBadgeColumn<User>('status', 'Status', {
    Active: 'bg-emerald-500/15 text-emerald-400',
    Inactive: 'bg-zinc-500/15 text-zinc-400',
  }),
  createNumberColumn<User>('revenue', 'Revenue', {
    format: { style: 'currency', currency: 'USD' },
  }),
]

<DataTable columns={columns} data={users} />`

const SELECTION_SNIPPET = `<DataTable
  columns={columns}
  data={users}
  bulkActions={[
    {
      label: 'Delete',
      icon: <Trash2 className="h-4 w-4" />,
      onClick: (rows) => console.log('Delete', rows),
      variant: 'destructive',
    },
  ]}
  onRowSelectionChange={(rows) => console.log('Selected:', rows)}
/>`

const EXPAND_SNIPPET = `<DataTable
  columns={columns}
  data={users}
  renderSubComponent={(row) => (
    <div className="text-sm text-white/60">
      <p>Department: {row.original.department}</p>
      <p>Verified: {row.original.verified ? 'Yes' : 'No'}</p>
    </div>
  )}
/>`

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function DataTableDocs() {
  // -- Basic table columns --
  const basicColumns = useMemo(
    () => [
      createTextColumn<User>('name', 'Name'),
      createTextColumn<User>('email', 'Email'),
      createBadgeColumn<User>('status', 'Status', STATUS_COLORS),
      createBadgeColumn<User>('role', 'Role', ROLE_COLORS),
      createNumberColumn<User>('revenue', 'Revenue', {
        format: { style: 'currency', currency: 'USD', maximumFractionDigits: 0 },
      }),
      createDateColumn<User>('joinedAt', 'Joined'),
    ],
    []
  )

  // -- Selection demo --
  const selectionColumns = useMemo(
    () => [
      createTextColumn<User>('name', 'Name'),
      createTextColumn<User>('email', 'Email'),
      createBadgeColumn<User>('status', 'Status', STATUS_COLORS),
      createActionsColumn<User>([
        {
          label: 'View details',
          icon: <Eye className="h-4 w-4" />,
          onClick: () => {},
        },
        {
          label: 'Copy email',
          icon: <Copy className="h-4 w-4" />,
          onClick: () => {},
        },
        {
          label: 'Delete',
          icon: <Trash2 className="h-4 w-4" />,
          onClick: () => {},
          variant: 'destructive',
        },
      ]),
    ],
    []
  )

  // -- Expand demo --
  const expandColumns = useMemo(
    () => [
      createTextColumn<User>('name', 'Name'),
      createTextColumn<User>('email', 'Email'),
      createBadgeColumn<User>('status', 'Status', STATUS_COLORS),
      createNumberColumn<User>('revenue', 'Revenue', {
        format: { style: 'currency', currency: 'USD', maximumFractionDigits: 0 },
      }),
    ],
    []
  )

  // -- Virtualized --
  const VIRTUAL_DATA = useMemo(() => generateUsers(10_000), [])

  const virtualColumns = useMemo(
    () => [
      createTextColumn<User>('name', 'Name'),
      createTextColumn<User>('email', 'Email'),
      createBadgeColumn<User>('role', 'Role', ROLE_COLORS),
      createNumberColumn<User>('revenue', 'Revenue', {
        format: { style: 'currency', currency: 'USD', maximumFractionDigits: 0 },
      }),
    ],
    []
  )

  // -- Loading state toggle --
  const [showLoading, setShowLoading] = useState(false)

  // -- Server-side pagination mock --
  const [serverData, setServerData] = useState<User[]>([])
  const [serverLoading, setServerLoading] = useState(false)
  const [serverPageCount, setServerPageCount] = useState(0)
  const allServerData = useMemo(() => generateUsers(200), [])

  const fetchPage = useCallback(
    (page: number, size: number) => {
      setServerLoading(true)
      setTimeout(() => {
        const start = page * size
        setServerData(allServerData.slice(start, start + size))
        setServerPageCount(Math.ceil(allServerData.length / size))
        setServerLoading(false)
      }, 500)
    },
    [allServerData]
  )

  // Load first page on mount
  useEffect(() => {
    fetchPage(0, 10)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // -- Empty state data --
  const [emptyData] = useState<User[]>([])

  return (
    <DocsPage
      category="39 · data"
      title="Data table"
      slug="data-table"
      description="Production-grade data table with sorting, filtering, pagination, row selection, virtualization, and column resizing. Built on TanStack Table."
    >
      {/* ============================================ */}
      {/* Basic Table */}
      {/* ============================================ */}
      <DocsSection title="Basic table">
        <DemoCard className="p-4">
          <DataTable columns={basicColumns} data={USERS_50.slice(0, 20)} />
        </DemoCard>
        <CodeBlock code={BASIC_SNIPPET} language="tsx" />
      </DocsSection>

      {/* ============================================ */}
      {/* Row Selection + Bulk Actions */}
      {/* ============================================ */}
      <DocsSection title="Row selection &amp; bulk actions">
        <p className="mb-3 text-sm text-white/50">
          Select rows with checkboxes. A bulk action bar slides up from the bottom.
        </p>
        <DemoCard className="p-4">
          <DataTable
            columns={selectionColumns}
            data={USERS_50.slice(0, 15)}
            bulkActions={[
              {
                label: 'Delete',
                icon: <Trash2 className="h-3.5 w-3.5" />,
                onClick: (rows) => alert(`Deleting ${rows.length} rows`),
                variant: 'destructive',
              },
              {
                label: 'Copy emails',
                icon: <Copy className="h-3.5 w-3.5" />,
                onClick: (rows) =>
                  alert(rows.map((r) => r.email).join(', ')),
              },
            ]}
          />
        </DemoCard>
        <CodeBlock code={SELECTION_SNIPPET} language="tsx" />
      </DocsSection>

      {/* ============================================ */}
      {/* Expandable Rows */}
      {/* ============================================ */}
      <DocsSection title="Expandable rows">
        <p className="mb-3 text-sm text-white/50">
          Click the chevron to expand a row and render a sub-component.
        </p>
        <DemoCard className="p-4">
          <DataTable
            columns={expandColumns}
            data={USERS_50.slice(0, 10)}
            renderSubComponent={(row) => (
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-white/40">Department</p>
                  <p className="text-white/70">{row.original.department}</p>
                </div>
                <div>
                  <p className="text-white/40">Verified</p>
                  <p className="text-white/70">
                    {row.original.verified ? 'Yes' : 'No'}
                  </p>
                </div>
                <div>
                  <p className="text-white/40">ID</p>
                  <p className="font-mono text-white/70">#{row.original.id}</p>
                </div>
              </div>
            )}
          />
        </DemoCard>
        <CodeBlock code={EXPAND_SNIPPET} language="tsx" />
      </DocsSection>

      {/* ============================================ */}
      {/* Loading Skeleton */}
      {/* ============================================ */}
      <DocsSection title="Loading &amp; empty states">
        <div className="mb-3 flex items-center gap-2">
          <Button
            size="sm"
            variant={showLoading ? 'default' : 'outline'}
            onClick={() => setShowLoading(!showLoading)}
            className="gap-1.5"
          >
            {showLoading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
            {showLoading ? 'Loading...' : 'Toggle loading'}
          </Button>
        </div>
        <DemoCard className="p-4">
          <DataTable
            columns={basicColumns}
            data={showLoading ? [] : USERS_50.slice(0, 5)}
            isLoading={showLoading}
          />
        </DemoCard>

        <p className="mt-6 mb-3 text-sm font-medium text-white/70">Empty state</p>
        <DemoCard className="p-4">
          <DataTable
            columns={basicColumns}
            data={emptyData}
          />
        </DemoCard>
      </DocsSection>

      {/* ============================================ */}
      {/* Server-side Pagination */}
      {/* ============================================ */}
      <DocsSection title="Server-side pagination">
        <p className="mb-3 text-sm text-white/50">
          200 rows fetched 10 at a time with a 500ms simulated delay.
        </p>
        <DemoCard className="p-4">
          <DataTable
            columns={basicColumns}
            data={serverData}
            isLoading={serverLoading}
            manualPagination
            pageCount={serverPageCount}
            rowCount={allServerData.length}
            onPaginationChange={(p) => fetchPage(p.pageIndex, p.pageSize)}
          />
        </DemoCard>
      </DocsSection>

      {/* ============================================ */}
      {/* Virtualized (10K rows) */}
      {/* ============================================ */}
      <DocsSection title="Virtualized — 10,000 rows">
        <p className="mb-3 text-sm text-white/50">
          Renders only visible rows. Scroll is buttery smooth.
        </p>
        <DemoCard className="p-4">
          <DataTable
            columns={virtualColumns}
            data={VIRTUAL_DATA}
            virtualize
          />
        </DemoCard>
      </DocsSection>

      {/* ============================================ */}
      {/* Props */}
      {/* ============================================ */}
      <DocsSection title="Props">
        <PropsTable
          props={[
            { name: 'columns', type: 'ColumnDef<TData, TValue>[]', description: 'TanStack column definitions.' },
            { name: 'data', type: 'TData[]', description: 'Array of row data.' },
            { name: 'isLoading', type: 'boolean', default: 'false', description: 'Show skeleton loading rows.' },
            { name: 'emptyState', type: 'ReactNode', description: 'Custom empty state component.' },
            { name: 'bulkActions', type: 'BulkAction<TData>[]', description: 'Actions shown when rows are selected.' },
            { name: 'defaultSort', type: 'SortingState', description: 'Initial sort state.' },
            { name: 'defaultHiddenColumns', type: 'string[]', description: 'Column IDs hidden by default.' },
            { name: 'density', type: '"compact" | "default" | "comfortable"', default: '"default"', description: 'Row padding density.' },
            { name: 'renderSubComponent', type: '(row: Row<TData>) => ReactNode', description: 'Renders expandable row content.' },
            { name: 'toolbarActions', type: 'ReactNode', description: 'Custom actions in the toolbar.' },
            { name: 'manualPagination', type: 'boolean', default: 'false', description: 'Server-controlled pagination.' },
            { name: 'pageCount', type: 'number', description: 'Total pages (server-side).' },
            { name: 'rowCount', type: 'number', description: 'Total rows (server-side).' },
            { name: 'onPaginationChange', type: '(pagination) => void', description: 'Pagination state callback.' },
            { name: 'manualSorting', type: 'boolean', default: 'false', description: 'Server-controlled sorting.' },
            { name: 'manualFiltering', type: 'boolean', default: 'false', description: 'Server-controlled filtering.' },
            { name: 'onSortingChange', type: '(sorting) => void', description: 'Sort state callback.' },
            { name: 'onFilteringChange', type: '(filters) => void', description: 'Filter state callback.' },
            { name: 'onRowSelectionChange', type: '(rows: TData[]) => void', description: 'Selected rows callback.' },
            { name: 'virtualize', type: 'boolean', default: 'false', description: 'Enable row virtualization for large datasets.' },
            { name: 'className', type: 'string', description: 'Additional wrapper classes.' },
          ]}
        />
      </DocsSection>

      {/* ============================================ */}
      {/* Column Helpers */}
      {/* ============================================ */}
      <DocsSection title="Column helpers">
        <PropsTable
          props={[
            { name: 'createTextColumn', type: '(key, header, options?) => ColumnDef', description: 'Text column with search filter.' },
            { name: 'createNumberColumn', type: '(key, header, options?) => ColumnDef', description: 'Number column with Intl formatting.' },
            { name: 'createDateColumn', type: '(key, header, options?) => ColumnDef', description: 'Date column with locale formatting.' },
            { name: 'createBadgeColumn', type: '(key, header, colorMap, options?) => ColumnDef', description: 'Badge column with color mapping.' },
            { name: 'createBooleanColumn', type: '(key, header, options?) => ColumnDef', description: 'Boolean column (Yes/No).' },
            { name: 'createActionsColumn', type: '(actions[]) => ColumnDef', description: 'Row actions dropdown column.' },
          ]}
        />
      </DocsSection>

      {/* ============================================ */}
      {/* Dependencies */}
      {/* ============================================ */}
      <DocsSection title="Dependencies">
        <div className="flex flex-wrap gap-2">
          {[
            '@tanstack/react-table',
            '@tanstack/react-virtual',
            'framer-motion',
          ].map((d) => (
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
