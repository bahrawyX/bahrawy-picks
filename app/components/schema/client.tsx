'use client'

import * as React from 'react'
import { Schema, type SchemaTable } from '@/components/bahrawy/schema'
import { CodeBlock } from '@/components/showcase/code-block'
import { DocsPage, DocsSection, DemoCard } from '@/components/showcase/docs-page'

const INITIAL_TABLES: SchemaTable[] = [
  {
    name: 'users',
    x: 48,
    y: 72,
    columns: [
      { name: 'id', type: 'uuid', primary: true },
      { name: 'email', type: 'text' },
      { name: 'name', type: 'text' },
      { name: 'created_at', type: 'timestamp' },
    ],
  },
  {
    name: 'posts',
    x: 400,
    y: 140,
    columns: [
      { name: 'id', type: 'uuid', primary: true },
      { name: 'author_id', type: 'uuid', references: { table: 'users', column: 'id' } },
      { name: 'title', type: 'text' },
      { name: 'body', type: 'text' },
      { name: 'published', type: 'bool' },
      { name: 'created_at', type: 'timestamp' },
    ],
  },
  {
    name: 'comments',
    x: 760,
    y: 72,
    columns: [
      { name: 'id', type: 'uuid', primary: true },
      { name: 'post_id', type: 'uuid', references: { table: 'posts', column: 'id' } },
      { name: 'author_id', type: 'uuid', references: { table: 'users', column: 'id' } },
      { name: 'body', type: 'text' },
      { name: 'created_at', type: 'timestamp' },
    ],
  },
  {
    name: 'reactions',
    x: 760,
    y: 360,
    columns: [
      { name: 'id', type: 'uuid', primary: true },
      { name: 'post_id', type: 'uuid', references: { table: 'posts', column: 'id' }, nullable: true },
      { name: 'comment_id', type: 'uuid', references: { table: 'comments', column: 'id' }, nullable: true },
      { name: 'user_id', type: 'uuid', references: { table: 'users', column: 'id' } },
      { name: 'kind', type: 'enum' },
    ],
  },
]

const SNIPPET = `import { Schema, type SchemaTable } from '@/components/bahrawy/schema'

const [tables, setTables] = useState<SchemaTable[]>([
  {
    name: 'users',
    x: 24, y: 28,
    columns: [
      { name: 'id', type: 'uuid', primary: true },
      { name: 'email', type: 'text' },
    ],
  },
  {
    name: 'posts',
    x: 300, y: 80,
    columns: [
      { name: 'id', type: 'uuid', primary: true },
      { name: 'author_id', type: 'uuid', references: { table: 'users', column: 'id' } },
    ],
  },
])

// Drop \`onTablesChange\` to make the schema fully editable —
// drag tables, add / remove / rename / re-type columns,
// manage foreign keys through the popover on each row.
<Schema
  tables={tables}
  onTablesChange={setTables}
  width={760}
  height={460}
/>`

export default function SchemaDocs() {
  const [tables, setTables] = React.useState<SchemaTable[]>(INITIAL_TABLES)

  return (
    <DocsPage
      title="Schema"
      slug="schema"
      description="Mini database ER diagram with optional admin mode. Tables render as cards with column rows and a key glyph on primary keys; SVG bezier lines auto-draw between every column that declares a foreign key. Pass `onTablesChange` to make the whole diagram editable — drag tables to reposition, add or remove tables and columns, double-click to rename, cycle types, toggle primary keys, and manage foreign keys through a per-row popover."
      category="14 · data"
    >
      <DocsSection title="Admin mode — drag, edit, link">
        <DemoCard className="items-stretch p-4 sm:p-6">
          <div className="flex w-full flex-col gap-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="font-display text-[13px] tracking-tight text-white/65">
                Drag any table by its header · double-click a name to rename · click a type to
                change it · click the key to toggle primary · click the link icon to set a
                foreign key.
              </p>
              <button
                type="button"
                onClick={() => setTables(INITIAL_TABLES)}
                className="shrink-0 rounded-full border border-white/[0.1] bg-white/[0.04] px-3 py-1 font-display text-[12px] font-medium tracking-tight text-white/85 transition-colors hover:bg-white/[0.08]"
              >
                Reset schema
              </button>
            </div>
            <Schema
              tables={tables}
              onTablesChange={setTables}
              width="100%"
              height={680}
            />
          </div>
        </DemoCard>
      </DocsSection>

      <DocsSection title="View only — pass tables without onTablesChange">
        <DemoCard className="items-stretch p-4 sm:p-6">
          <Schema tables={INITIAL_TABLES} width="100%" height={520} />
        </DemoCard>
      </DocsSection>

      <DocsSection title="Usage">
        <CodeBlock code={SNIPPET} language="tsx" />
      </DocsSection>

      <DocsSection title="Props">
        <ul className="grid gap-2 sm:grid-cols-2">
          {[
            ['tables', 'SchemaTable[] — each { name, x, y, columns, accent? }.'],
            ['onTablesChange', '(next) => void — provide to enable admin mode (drag + edit).'],
            ['admin', 'Force admin mode on/off. Defaults to true when onTablesChange is provided.'],
            ['width', 'Canvas width — number (px) or string. Default "100%".'],
            ['height', 'Canvas height — number (px) or string. Default 600.'],
            ['showTypes', 'Show the type label on each column row. Default true.'],
            ['className', 'Extra classes on the canvas.'],
          ].map(([n, b]) => (
            <li key={n} className="rounded-lg border border-white/10 bg-white/[0.02] p-3">
              <code className="font-mono text-xs text-white">{n}</code>
              <p className="mt-1 text-xs text-white/60">{b}</p>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-xs text-white/45">
          Per-column flags: <code className="font-mono">primary · nullable · references: {'{ table, column }'}</code>.
          Removing a table or column cascades the FK cleanup so you never end up with
          dangling references.
        </p>
      </DocsSection>

      <DocsSection title="Admin gestures">
        <ul className="grid gap-2 sm:grid-cols-2">
          {[
            ['Drag table', 'Pointer-down on the header (with the grip icon) and drag. The FK lines re-render every frame so they stay attached.'],
            ['Move with keyboard', 'Tab to a table header and nudge with the arrow keys — 16px per press, 64px with Shift. Commits through the same path as drag so FK lines re-route.'],
            ['Add table', 'Toolbar in the top-right of the canvas.'],
            ['Delete table', 'Trash icon that fades in on header hover. Any FK pointing at the table is cleaned up.'],
            ['Rename', 'Double-click the table name or any column name to edit inline. Enter to commit, Esc to cancel.'],
            ['Change type', 'Click the type label on any column row — opens a native select with the common SQL types.'],
            ['Primary key', 'Click the key/dot glyph on a column to toggle PK.'],
            ['Foreign key', 'Click the link icon on a row to open a popover listing every other column. Pick one to set the FK, or "Remove FK" to clear it.'],
            ['Export', 'Download icon in the toolbar saves the current schema as JSON.'],
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
