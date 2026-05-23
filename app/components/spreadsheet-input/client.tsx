'use client'

import { useState } from 'react'
import { SpreadsheetInput, type SpreadsheetColumn, type SpreadsheetRow } from '@/components/bahrawy'
import { CodeBlock } from '@/components/showcase/code-block'
import {
  DemoCard,
  DocsPage,
  DocsSection,
} from '@/components/showcase/docs-page'
import { PropsTable } from '@/components/showcase/props-table'

const PEOPLE_COLUMNS: SpreadsheetColumn[] = [
  { key: 'name', header: 'Name', type: 'text', width: 160 },
  { key: 'age', header: 'Age', type: 'number', width: 80 },
  { key: 'email', header: 'Email', type: 'text', width: 220 },
  { key: 'role', header: 'Role', type: 'text', width: 140 },
]

const PEOPLE_DATA = [
  { name: 'Ahmed Bahrawy', age: 28, email: 'ahmed@bahrawy.dev', role: 'Developer' },
  { name: 'Sara Chen', age: 32, email: 'sara@example.com', role: 'Designer' },
  { name: 'James Wilson', age: 25, email: 'james@example.com', role: 'PM' },
  { name: 'Mia Rodriguez', age: 29, email: 'mia@example.com', role: 'Developer' },
]

const TASK_COLUMNS: SpreadsheetColumn[] = [
  { key: 'task', header: 'Task', type: 'text', width: 240 },
  {
    key: 'status',
    header: 'Status',
    type: 'select',
    width: 130,
    options: ['Todo', 'In Progress', 'Done'],
  },
  { key: 'done', header: 'Done', type: 'checkbox', width: 70 },
]

const TASK_DATA = [
  { task: 'Design landing page', status: 'Done', done: true },
  { task: 'Build component library', status: 'In Progress', done: false },
  { task: 'Write documentation', status: 'Todo', done: false },
]

const FORMULA_COLUMNS: SpreadsheetColumn[] = [
  { key: 'item', header: 'Item', type: 'text', width: 180 },
  { key: 'qty', header: 'Qty', type: 'number', width: 80 },
  { key: 'price', header: 'Price', type: 'number', width: 100 },
]

const FORMULA_DATA = [
  { item: 'Widget A', qty: 10, price: 25 },
  { item: 'Widget B', qty: 5, price: 40 },
  { item: 'Widget C', qty: 8, price: 15 },
  { item: 'Total Qty', qty: '=SUM(B1:B3)', price: '=SUM(C1:C3)' },
]

const BASIC_SNIPPET = `import { SpreadsheetInput, type SpreadsheetColumn } from '@/components/bahrawy'

const columns: SpreadsheetColumn[] = [
  { key: 'name', header: 'Name', type: 'text', width: 160 },
  { key: 'age', header: 'Age', type: 'number', width: 80 },
  { key: 'email', header: 'Email', type: 'text', width: 220 },
]

<SpreadsheetInput
  columns={columns}
  data={data}
  onChange={setData}
  showToolbar
/>`

const FORMULA_SNIPPET = `const columns: SpreadsheetColumn[] = [
  { key: 'item', header: 'Item', type: 'text' },
  { key: 'qty', header: 'Qty', type: 'number' },
  { key: 'price', header: 'Price', type: 'number' },
]

const data = [
  { item: 'Widget A', qty: 10, price: 25 },
  { item: 'Widget B', qty: 5, price: 40 },
  { item: 'Total', qty: '=SUM(B1:B2)', price: '=SUM(C1:C2)' },
]

<SpreadsheetInput
  columns={columns}
  data={data}
  enableFormulas
  showFormulaBar
/>`

const CHECKBOX_SNIPPET = `const columns: SpreadsheetColumn[] = [
  { key: 'task', header: 'Task', type: 'text' },
  { key: 'status', header: 'Status', type: 'select', options: ['Todo', 'In Progress', 'Done'] },
  { key: 'done', header: 'Done', type: 'checkbox' },
]

<SpreadsheetInput columns={columns} data={tasks} onChange={setTasks} />`

const STRESS_COLUMNS: SpreadsheetColumn[] = [
  { key: 'name', header: 'Name', type: 'text', width: 200 },
  { key: 'amount', header: 'Amount', type: 'number', width: 120 },
  {
    key: 'status',
    header: 'Status',
    type: 'select',
    width: 130,
    options: ['Active', 'Inactive', 'Pending', 'Banned'],
  },
  { key: 'verified', header: 'OK?', type: 'checkbox', width: 60 },
  { key: 'notes', header: 'Notes', type: 'text', width: 260 },
]

const STRESS_DATA: SpreadsheetRow[] = [
  { name: '', amount: 0, status: '', verified: false, notes: 'Empty name test' },
  { name: '   ', amount: -999999, status: 'Active', verified: true, notes: 'Leading spaces & huge negative' },
  { name: 'Robert\'); DROP TABLE Students;--', amount: 42, status: 'Pending', verified: false, notes: 'SQL injection test' },
  { name: '<script>alert("xss")</script>', amount: NaN, status: 'Banned', verified: true, notes: 'XSS attempt + NaN' },
  { name: 'a'.repeat(300), amount: 0.1 + 0.2, status: 'Active', verified: false, notes: 'Overflow text + float precision' },
  { name: 'null', amount: 0, status: 'Inactive', verified: false, notes: 'Literal string "null"' },
  { name: 'undefined', amount: Infinity, status: 'Active', verified: true, notes: 'Infinity number' },
  { name: 'John "Johnny" O\'Brien', amount: -0, status: 'Pending', verified: false, notes: 'Quotes in name + negative zero' },
  { name: '12345', amount: 99999999999, status: 'Active', verified: true, notes: 'Numeric name + huge number' },
  { name: 'Test User', amount: 3.14159265358979, status: 'Inactive', verified: false, notes: 'Long decimal' },
  { name: 'true', amount: 1e-10, status: 'Banned', verified: true, notes: 'Boolean-ish name + tiny number' },
  { name: '!@#$%^&*()', amount: -1, status: 'Active', verified: false, notes: 'Special characters name' },
]

export default function SpreadsheetInputDocs() {
  const [people, setPeople] = useState<SpreadsheetRow[]>(PEOPLE_DATA)
  const [tasks, setTasks] = useState<SpreadsheetRow[]>(TASK_DATA)
  const [stress, setStress] = useState<SpreadsheetRow[]>(STRESS_DATA)

  return (
    <DocsPage
      title="Spreadsheet Input"
      slug="spreadsheet-input"
      description="Mini Excel-style editable grid with cell types, formulas, virtualization, CSV import/export, and clipboard support."
      category="37 · FORM"
    >
      {/* Basic */}
      <DocsSection title="Basic">
        <DemoCard className="items-start">
          <div className="w-full">
            <SpreadsheetInput
              columns={PEOPLE_COLUMNS}
              data={people}
              onChange={setPeople}
              showToolbar
            />
          </div>
        </DemoCard>
        <CodeBlock code={BASIC_SNIPPET} language="tsx" />
      </DocsSection>

      {/* Checkbox + Select */}
      <DocsSection title="Checkbox & select columns">
        <DemoCard className="items-start">
          <div className="w-full max-w-xl">
            <SpreadsheetInput
              columns={TASK_COLUMNS}
              data={tasks}
              onChange={setTasks}
            />
          </div>
        </DemoCard>
        <CodeBlock code={CHECKBOX_SNIPPET} language="tsx" />
      </DocsSection>

      {/* Formulas */}
      <DocsSection title="Formulas (SUM, AVG, MAX, MIN, COUNT)">
        <DemoCard className="items-start">
          <div className="w-full max-w-xl">
            <SpreadsheetInput
              columns={FORMULA_COLUMNS}
              data={FORMULA_DATA}
              enableFormulas
              showFormulaBar
              showToolbar
            />
          </div>
        </DemoCard>
        <CodeBlock code={FORMULA_SNIPPET} language="tsx" />
      </DocsSection>

      {/* Read only */}
      <DocsSection title="Read only">
        <DemoCard className="items-start">
          <div className="w-full">
            <SpreadsheetInput
              columns={PEOPLE_COLUMNS}
              data={PEOPLE_DATA}
              readOnly
            />
          </div>
        </DemoCard>
      </DocsSection>

      {/* Empty with defaults */}
      <DocsSection title="Empty (5 default rows)">
        <DemoCard className="items-start">
          <div className="w-full max-w-xl">
            <SpreadsheetInput
              columns={[
                { key: 'col1', header: 'Column A', type: 'text', width: 160 },
                { key: 'col2', header: 'Column B', type: 'number', width: 120 },
                { key: 'col3', header: 'Column C', type: 'text', width: 160 },
              ]}
              defaultRowCount={5}
              showToolbar
            />
          </div>
        </DemoCard>
      </DocsSection>

      {/* Stress test */}
      <DocsSection title="Stress test (edge cases)">
        <DemoCard className="items-start">
          <div className="w-full">
            <SpreadsheetInput
              columns={STRESS_COLUMNS}
              data={stress}
              onChange={setStress}
              showToolbar
            />
          </div>
        </DemoCard>
        <p className="mt-2 text-sm text-white/40">
          Tests: empty values, whitespace, SQL injection strings, XSS attempts,
          overflow text, NaN, Infinity, negative zero, float precision, special
          characters, boolean-like strings, huge numbers, and long decimals.
        </p>
      </DocsSection>

      {/* Props */}
      <DocsSection title="Props">
        <PropsTable
          props={[
            { name: 'columns', type: 'SpreadsheetColumn[]', default: '—', description: 'Column definitions (key, header, type, width, options, etc.)' },
            { name: 'data', type: 'SpreadsheetRow[]', default: '[]', description: 'Controlled row data' },
            { name: 'onChange', type: '(data: SpreadsheetRow[]) => void', default: '—', description: 'Called when data changes' },
            { name: 'maxRows', type: 'number', default: '1000', description: 'Maximum number of rows' },
            { name: 'defaultRowCount', type: 'number', default: '3', description: 'Number of empty rows when no data provided' },
            { name: 'showFormulaBar', type: 'boolean', default: 'false', description: 'Show formula bar above grid' },
            { name: 'enableFormulas', type: 'boolean', default: 'false', description: 'Enable formula evaluation (=SUM, =AVG, etc.)' },
            { name: 'showToolbar', type: 'boolean', default: 'false', description: 'Show toolbar with undo/redo and import/export' },
            { name: 'rowHeight', type: 'number', default: '32', description: 'Row height in pixels' },
            { name: 'virtualize', type: 'boolean', default: 'false', description: 'Enable row virtualization for large datasets' },
            { name: 'readOnly', type: 'boolean', default: 'false', description: 'Disable all editing' },
            { name: 'className', type: 'string', default: '—', description: 'Additional CSS classes' },
          ]}
        />
      </DocsSection>
    </DocsPage>
  )
}
