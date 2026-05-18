'use client'

import { useState, useRef, useCallback } from 'react'
import { VirtualList, type VirtualListHandle } from '@/components/bahrawy/virtual-list'
import { CodeBlock } from '@/components/showcase/code-block'
import { DemoCard, DocsPage, DocsSection } from '@/components/showcase/docs-page'
import { PropsTable } from '@/components/showcase/props-table'

// ---------------------------------------------------------------------------
// Data generators
// ---------------------------------------------------------------------------

const FIXED_DATA = Array.from({ length: 100000 }, (_, i) => ({
  id: i,
  title: `Item #${i + 1}`,
  description: `This is the description for item ${i + 1}`,
}))

const VARIABLE_DATA = Array.from({ length: 1000 }, (_, i) => {
  const lines = 1 + Math.floor(Math.random() * 5)
  return {
    id: i,
    title: `Item #${i + 1}`,
    content: Array.from(
      { length: lines },
      (__, l) => `Line ${l + 1} of item ${i + 1} with some sample text.`
    ).join(' '),
  }
})

const COLORS = [
  'bg-red-500/20',
  'bg-blue-500/20',
  'bg-green-500/20',
  'bg-yellow-500/20',
  'bg-purple-500/20',
  'bg-pink-500/20',
  'bg-cyan-500/20',
  'bg-orange-500/20',
]

const GRID_DATA = Array.from({ length: 1000 }, (_, i) => ({
  id: i,
  title: `Card ${i + 1}`,
  color: COLORS[i % COLORS.length],
}))

const SEARCHABLE_DATA = Array.from({ length: 1000 }, (_, i) => {
  const names = [
    'Ahmed', 'Sara', 'James', 'Mia', 'Carlos', 'Yuki', 'Priya', 'Omar',
    'Lena', 'Noah', 'Fatima', 'Lucas', 'Aisha', 'Ethan', 'Zara', 'Daniel',
  ]
  const surnames = [
    'Bahrawy', 'Chen', 'Wilson', 'Rodriguez', 'Kim', 'Singh', 'Okafor',
    'Martinez', 'Mueller', 'Tanaka', 'Patel', 'Johnson', 'Ali', 'Brown',
  ]
  return {
    id: i,
    name: `${names[i % names.length]} ${surnames[i % surnames.length]}`,
    email: `user${i}@example.com`,
  }
})

const ROLES = ['Admin', 'Editor', 'Viewer', 'Developer', 'Designer']

const TABLE_DATA = Array.from({ length: 5000 }, (_, i) => ({
  id: String(i + 1),
  name: `User ${i + 1}`,
  email: `user${i + 1}@example.com`,
  role: ROLES[i % ROLES.length],
}))

const SCROLL_DATA = Array.from({ length: 10000 }, (_, i) => ({
  id: i,
  title: `Row #${i + 1}`,
}))

// ---------------------------------------------------------------------------
// Snippets
// ---------------------------------------------------------------------------

const FIXED_SNIPPET = `import { VirtualList } from '@/components/bahrawy'

const data = Array.from({ length: 100000 }, (_, i) => ({
  id: i,
  title: \`Item #\${i + 1}\`,
  description: \`Description for item \${i + 1}\`,
}))

<VirtualList
  data={data}
  itemHeight={60}
  height={400}
  renderItem={({ item, index }) => (
    <div className="flex items-center gap-3 px-4 h-full border-b border-white/[0.04]">
      <span className="text-white/30 text-xs w-12">{index}</span>
      <div>
        <p className="text-sm text-white">{item.title}</p>
        <p className="text-xs text-white/40">{item.description}</p>
      </div>
    </div>
  )}
/>`

const VARIABLE_SNIPPET = `<VirtualList
  data={variableData}
  variableHeight
  estimatedItemHeight={80}
  height={400}
  renderItem={({ item }) => (
    <div className="px-4 py-3 border-b border-white/[0.04]">
      <p className="text-sm font-medium text-white">{item.title}</p>
      <p className="text-xs text-white/50 mt-1">{item.content}</p>
    </div>
  )}
/>`

const GRID_SNIPPET = `<VirtualList
  data={gridData}
  columns={4}
  itemHeight={120}
  height={400}
  renderItem={({ item }) => (
    <div className={\`rounded-lg \${item.color} p-4 h-full flex items-center justify-center\`}>
      <span className="text-sm text-white font-medium">{item.title}</span>
    </div>
  )}
/>`

const INFINITE_SNIPPET = `const [items, setItems] = useState(initialItems)
const [loading, setLoading] = useState(false)
const [hasMore, setHasMore] = useState(true)

<VirtualList
  data={items}
  height={400}
  itemHeight={60}
  onLoadMore={() => {
    setLoading(true)
    // fetch more...
  }}
  isLoadingMore={loading}
  hasMore={hasMore}
  loadMoreThreshold={200}
  renderItem={({ item }) => (
    <div className="px-4 h-full flex items-center">
      {item.title}
    </div>
  )}
/>`

const SEARCH_SNIPPET = `<VirtualList
  data={data}
  searchable
  searchPlaceholder="Search by name..."
  filterFn={(item, query) =>
    item.name.toLowerCase().includes(query.toLowerCase())
  }
  height={400}
  itemHeight={56}
  renderItem={({ item }) => (
    <div className="px-4 h-full flex items-center justify-between">
      <span>{item.name}</span>
      <span className="text-white/40">{item.email}</span>
    </div>
  )}
/>`

const TABLE_SNIPPET = `<VirtualList
  data={tableData}
  tableMode
  tableColumns={[
    { key: 'id', header: 'ID', width: 80 },
    { key: 'name', header: 'Name', width: 200 },
    { key: 'email', header: 'Email', width: 250 },
    { key: 'role', header: 'Role', width: 120 },
  ]}
  height={400}
  itemHeight={44}
  renderItem={() => null}
/>`

const SCROLL_TO_SNIPPET = `const listRef = useRef<VirtualListHandle>(null)

<input
  type="number"
  onChange={(e) => {
    listRef.current?.scrollToIndex(Number(e.target.value))
  }}
/>

<VirtualList
  ref={listRef}
  data={data}
  height={400}
  itemHeight={48}
  renderItem={({ item, index }) => (
    <div className="px-4 h-full flex items-center">
      Row {index}
    </div>
  )}
/>`

// ---------------------------------------------------------------------------
// Props table data
// ---------------------------------------------------------------------------

const PROPS = [
  { name: 'data', type: 'T[]', description: 'Array of items to render.' },
  {
    name: 'renderItem',
    type: '(props: RenderItemProps<T>) => ReactNode',
    description: 'Render function receiving item, index, isFirst, isLast, and style.',
  },
  { name: 'itemHeight', type: 'number', default: '60', description: 'Fixed row height in pixels.' },
  { name: 'variableHeight', type: 'boolean', default: 'false', description: 'Enable dynamic row height measurement.' },
  { name: 'estimatedItemHeight', type: 'number', default: '60', description: 'Estimated height for variable-height mode.' },
  { name: 'overscan', type: 'number', default: '5', description: 'Number of extra rows to render outside the viewport.' },
  { name: 'columns', type: "number | 'auto'", description: 'Number of grid columns. "auto" calculates from minItemWidth.' },
  { name: 'minItemWidth', type: 'number', default: '200', description: 'Minimum item width for auto column calculation.' },
  { name: 'onLoadMore', type: '() => void', description: 'Called when scrolled near the bottom for infinite loading.' },
  { name: 'isLoadingMore', type: 'boolean', description: 'Shows a spinner at the bottom while loading more.' },
  { name: 'hasMore', type: 'boolean', description: 'Whether more items can be loaded.' },
  { name: 'loadMoreThreshold', type: 'number', default: '200', description: 'Distance from bottom (px) to trigger onLoadMore.' },
  { name: 'initialScrollIndex', type: 'number', description: 'Scroll to this index on mount.' },
  { name: 'searchable', type: 'boolean', default: 'false', description: 'Show a search input above the list.' },
  { name: 'onSearch', type: '(query: string) => void', description: 'Called with the search query (debounced 200ms).' },
  { name: 'filterFn', type: '(item: T, query: string) => boolean', description: 'Client-side filter predicate for search.' },
  { name: 'searchPlaceholder', type: 'string', description: 'Placeholder text for the search input.' },
  { name: 'isLoading', type: 'boolean', default: 'false', description: 'Show skeleton loading state.' },
  { name: 'emptyState', type: 'ReactNode', description: 'Rendered when data is empty.' },
  { name: 'emptySearchState', type: 'ReactNode', description: 'Rendered when search yields no results.' },
  { name: 'groups', type: '{ label: string; startIndex: number }[]', description: 'Group headers at given indices (fixed-height mode).' },
  { name: 'tableMode', type: 'boolean', default: 'false', description: 'Enable windowed table mode with sticky header.' },
  { name: 'tableColumns', type: '{ key: string; header: string; width?: number }[]', description: 'Column definitions for table mode.' },
  { name: 'direction', type: "'vertical' | 'horizontal'", default: "'vertical'", description: 'Scroll direction (fixed-height mode only).' },
  { name: 'height', type: 'number | string', default: '400', description: 'Container height.' },
  { name: 'className', type: 'string', description: 'Additional CSS classes on the outer wrapper.' },
]

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function VirtualListPage() {
  // Infinite scroll state
  const [infiniteItems, setInfiniteItems] = useState(
    Array.from({ length: 20 }, (_, i) => ({ id: i, title: `Item #${i + 1}` }))
  )
  const [infiniteLoading, setInfiniteLoading] = useState(false)
  const [infiniteHasMore, setInfiniteHasMore] = useState(true)

  const loadMore = useCallback(() => {
    setInfiniteLoading(true)
    setTimeout(() => {
      setInfiniteItems((prev) => {
        const next = Array.from(
          { length: 20 },
          (_, i) => ({ id: prev.length + i, title: `Item #${prev.length + i + 1}` })
        )
        const combined = [...prev, ...next]
        if (combined.length >= 100) setInfiniteHasMore(false)
        return combined
      })
      setInfiniteLoading(false)
    }, 1500)
  }, [])

  // Scroll-to-index state
  const listRef = useRef<VirtualListHandle>(null)
  const [scrollTarget, setScrollTarget] = useState('')

  return (
    <DocsPage
      category="Data"
      title="Virtual List"
      slug="virtual-list"
      description="High-performance virtualized list handling millions of rows. Fixed/variable height, grid, infinite scroll, grouped, table mode."
    >
      {/* Fixed height */}
      <DocsSection
        title="Fixed Height (100K items)"
        description="Renders 100,000 items with fixed 60px row height. Scroll stays silky smooth."
      >
        <DemoCard className="flex-col items-stretch p-0 overflow-hidden">
          <VirtualList
            data={FIXED_DATA}
            itemHeight={60}
            height={400}
            renderItem={({ item, index }) => (
              <div className="flex items-center gap-3 px-4 h-full border-b border-white/[0.04]">
                <span className="text-white/30 tabular-nums text-xs w-16 shrink-0">
                  {index.toLocaleString()}
                </span>
                <div className="min-w-0">
                  <p className="text-sm text-white truncate">{item.title}</p>
                  <p className="text-xs text-white/40 truncate">{item.description}</p>
                </div>
              </div>
            )}
          />
        </DemoCard>
        <CodeBlock code={FIXED_SNIPPET} />
      </DocsSection>

      {/* Variable height */}
      <DocsSection
        title="Variable Height"
        description="1,000 items with random content lengths. Each row is measured dynamically."
      >
        <DemoCard className="flex-col items-stretch p-0 overflow-hidden">
          <VirtualList
            data={VARIABLE_DATA}
            variableHeight
            estimatedItemHeight={80}
            height={400}
            renderItem={({ item }) => (
              <div className="px-4 py-3 border-b border-white/[0.04]">
                <p className="text-sm font-medium text-white">{item.title}</p>
                <p className="text-xs text-white/50 mt-1 leading-relaxed">{item.content}</p>
              </div>
            )}
          />
        </DemoCard>
        <CodeBlock code={VARIABLE_SNIPPET} />
      </DocsSection>

      {/* Grid mode */}
      <DocsSection
        title="Grid Mode"
        description="1,000 items in a 4-column grid layout. Rows are virtualized."
      >
        <DemoCard className="flex-col items-stretch p-0 overflow-hidden">
          <VirtualList
            data={GRID_DATA}
            columns={4}
            itemHeight={120}
            height={400}
            renderItem={({ item }) => (
              <div
                className={`rounded-lg ${item.color} p-4 h-full flex items-center justify-center`}
              >
                <span className="text-sm text-white font-medium">{item.title}</span>
              </div>
            )}
          />
        </DemoCard>
        <CodeBlock code={GRID_SNIPPET} />
      </DocsSection>

      {/* Infinite scroll */}
      <DocsSection
        title="Infinite Scroll"
        description="Starts with 20 items and loads 20 more when scrolled near the bottom. Stops at 100."
      >
        <DemoCard className="flex-col items-stretch p-0 overflow-hidden">
          <VirtualList
            data={infiniteItems}
            height={400}
            itemHeight={60}
            onLoadMore={loadMore}
            isLoadingMore={infiniteLoading}
            hasMore={infiniteHasMore}
            loadMoreThreshold={200}
            renderItem={({ item, index }) => (
              <div className="flex items-center gap-3 px-4 h-full border-b border-white/[0.04]">
                <span className="text-white/30 tabular-nums text-xs w-10 shrink-0">
                  {index + 1}
                </span>
                <span className="text-sm text-white">{item.title}</span>
              </div>
            )}
          />
        </DemoCard>
        <CodeBlock code={INFINITE_SNIPPET} />
      </DocsSection>

      {/* Searchable */}
      <DocsSection
        title="Searchable"
        description="1,000 items with client-side name filtering via the built-in search bar."
      >
        <DemoCard className="flex-col items-stretch p-0 overflow-hidden">
          <VirtualList
            data={SEARCHABLE_DATA}
            searchable
            searchPlaceholder="Search by name..."
            filterFn={(item, query) =>
              item.name.toLowerCase().includes(query.toLowerCase())
            }
            emptySearchState="No matching names found."
            height={400}
            itemHeight={56}
            renderItem={({ item }) => (
              <div className="flex items-center justify-between px-4 h-full border-b border-white/[0.04]">
                <span className="text-sm text-white">{item.name}</span>
                <span className="text-xs text-white/40">{item.email}</span>
              </div>
            )}
          />
        </DemoCard>
        <CodeBlock code={SEARCH_SNIPPET} />
      </DocsSection>

      {/* Table mode */}
      <DocsSection
        title="Table Mode"
        description="5,000 rows with a sticky column header. Built-in cell rendering from tableColumns keys."
      >
        <DemoCard className="flex-col items-stretch p-0 overflow-hidden">
          <VirtualList
            data={TABLE_DATA}
            tableMode
            tableColumns={[
              { key: 'id', header: 'ID', width: 80 },
              { key: 'name', header: 'Name', width: 200 },
              { key: 'email', header: 'Email', width: 250 },
              { key: 'role', header: 'Role', width: 120 },
            ]}
            height={400}
            itemHeight={44}
            renderItem={() => null}
          />
        </DemoCard>
        <CodeBlock code={TABLE_SNIPPET} />
      </DocsSection>

      {/* Scroll to index */}
      <DocsSection
        title="Scroll to Index"
        description="Use the imperative handle to jump to any row in a 10,000-item list."
      >
        <DemoCard className="flex-col items-stretch gap-3 p-4 overflow-hidden">
          <div className="flex items-center gap-2">
            <input
              type="number"
              min={0}
              max={9999}
              value={scrollTarget}
              onChange={(e) => setScrollTarget(e.target.value)}
              placeholder="Row index (0-9999)"
              className="flex h-9 w-48 rounded-md border border-zinc-800 bg-transparent px-3 py-1 text-sm text-white placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-500"
            />
            <button
              onClick={() => {
                const idx = Number(scrollTarget)
                if (!isNaN(idx)) listRef.current?.scrollToIndex(idx)
              }}
              className="h-9 rounded-md border border-zinc-700 bg-white/[0.05] px-4 text-sm text-white hover:bg-white/[0.1] transition-colors"
            >
              Go
            </button>
          </div>
          <VirtualList
            ref={listRef}
            data={SCROLL_DATA}
            height={350}
            itemHeight={48}
            renderItem={({ item, index }) => (
              <div className="flex items-center px-4 h-full border-b border-white/[0.04]">
                <span className="text-white/30 tabular-nums text-xs w-16 shrink-0">
                  #{index}
                </span>
                <span className="text-sm text-white">{item.title}</span>
              </div>
            )}
          />
        </DemoCard>
        <CodeBlock code={SCROLL_TO_SNIPPET} />
      </DocsSection>

      {/* Props table */}
      <DocsSection title="Props">
        <PropsTable props={PROPS} />
      </DocsSection>
    </DocsPage>
  )
}
