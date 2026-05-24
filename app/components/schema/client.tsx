'use client'

import { Schema, type SchemaTable } from '@/components/bahrawy/schema'
import { CodeBlock } from '@/components/showcase/code-block'
import { DocsPage, DocsSection, DemoCard } from '@/components/showcase/docs-page'

const TABLES: SchemaTable[] = [
  {
    name: 'users',
    accent: '#A78BFA',
    x: 24,
    y: 28,
    columns: [
      { name: 'id',         type: 'uuid',      primary: true },
      { name: 'email',      type: 'text' },
      { name: 'name',       type: 'text' },
      { name: 'created_at', type: 'timestamp' },
    ],
  },
  {
    name: 'posts',
    accent: '#34D399',
    x: 300,
    y: 80,
    columns: [
      { name: 'id',         type: 'uuid',      primary: true },
      { name: 'author_id',  type: 'uuid',      references: { table: 'users', column: 'id' } },
      { name: 'title',      type: 'text' },
      { name: 'body',       type: 'text' },
      { name: 'published',  type: 'bool' },
      { name: 'created_at', type: 'timestamp' },
    ],
  },
  {
    name: 'comments',
    accent: '#FBBF24',
    x: 580,
    y: 36,
    columns: [
      { name: 'id',         type: 'uuid', primary: true },
      { name: 'post_id',    type: 'uuid', references: { table: 'posts', column: 'id' } },
      { name: 'author_id',  type: 'uuid', references: { table: 'users', column: 'id' } },
      { name: 'body',       type: 'text' },
      { name: 'created_at', type: 'timestamp' },
    ],
  },
  {
    name: 'reactions',
    accent: '#F472B6',
    x: 580,
    y: 252,
    columns: [
      { name: 'id',         type: 'uuid', primary: true },
      { name: 'post_id',    type: 'uuid', references: { table: 'posts', column: 'id' }, nullable: true },
      { name: 'comment_id', type: 'uuid', references: { table: 'comments', column: 'id' }, nullable: true },
      { name: 'user_id',    type: 'uuid', references: { table: 'users', column: 'id' } },
      { name: 'kind',       type: 'enum' },
    ],
  },
]

const SNIPPET = `import { Schema } from '@/components/bahrawy/schema'

<Schema
  width={760}
  height={460}
  tables={[
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
  ]}
/>`

export default function SchemaDocs() {
  return (
    <DocsPage
      title="Schema"
      slug="schema"
      description="A mini database ER diagram. Tables render as cards at the positions you specify; columns list their name + type with a key glyph on primary keys. SVG bezier lines draw themselves between every column that declares a foreign key and the row it points to — measured after mount, redrawn on resize. Hover a column to highlight its relationship."
      category="14 · data"
    >
      <DocsSection title="Blog schema (4 tables, 4 FKs)">
        <DemoCard className="min-h-[520px] items-start py-8">
          <div className="overflow-x-auto">
            <Schema tables={TABLES} width={760} height={460} />
          </div>
        </DemoCard>
      </DocsSection>

      <DocsSection title="Usage">
        <CodeBlock code={SNIPPET} language="tsx" />
      </DocsSection>

      <DocsSection title="Props">
        <ul className="grid gap-2 sm:grid-cols-2">
          {[
            ['tables', 'SchemaTable[] — each { name, x, y, columns, accent? }.'],
            ['width', 'Canvas width in px. Default 760.'],
            ['height', 'Canvas height in px. Default 460.'],
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
          Per-column flags: <code className="font-mono">primary · nullable · references: {'{ table, column }'}</code>
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
