'use client'

import * as React from 'react'
import { Pagination } from '@/components/bahrawy/pagination'
import { CodeBlock } from '@/components/showcase/code-block'
import { DocsPage, DocsSection, DemoCard } from '@/components/showcase/docs-page'

const SNIPPET = `import { Pagination } from '@/components/bahrawy/pagination'

const [page, setPage] = useState(1)

<Pagination page={page} pageCount={24} onPageChange={setPage} />`

export default function PaginationDocs() {
  const [p1, setP1] = React.useState(1)
  const [p2, setP2] = React.useState(7)
  const [p3, setP3] = React.useState(42)

  return (
    <DocsPage
      title="Pagination"
      slug="pagination"
      description="An Apple-style page navigator. Numbered pills with ellipsis-collapsing for long ranges (always shows first, last, and a window around current), prev / next chevron buttons, layoutId-driven active pill that glides between pages, disabled at boundaries."
      category="171 · navigation"
    >
      <DocsSection title="Short range">
        <DemoCard className="min-h-[160px]">
          <div className="flex flex-col items-center gap-3">
            <Pagination page={p1} pageCount={5} onPageChange={setP1} />
            <p className="font-mono text-[11px] tabular-nums text-white/45">
              page = <span className="text-white/75">{p1}</span> of 5
            </p>
          </div>
        </DemoCard>
      </DocsSection>

      <DocsSection title="With ellipsis">
        <DemoCard className="min-h-[160px]">
          <div className="flex flex-col items-center gap-3">
            <Pagination page={p2} pageCount={24} onPageChange={setP2} />
            <p className="font-mono text-[11px] tabular-nums text-white/45">
              page = <span className="text-white/75">{p2}</span> of 24
            </p>
          </div>
        </DemoCard>
      </DocsSection>

      <DocsSection title="Large range + first / last shortcuts">
        <DemoCard className="min-h-[160px]">
          <div className="flex flex-col items-center gap-3">
            <Pagination
              page={p3}
              pageCount={120}
              onPageChange={setP3}
              showFirstLast
              siblings={2}
            />
            <p className="font-mono text-[11px] tabular-nums text-white/45">
              page = <span className="text-white/75">{p3}</span> of 120
            </p>
          </div>
        </DemoCard>
      </DocsSection>

      <DocsSection title="Usage">
        <CodeBlock code={SNIPPET} language="tsx" />
      </DocsSection>

      <DocsSection title="Props">
        <ul className="grid gap-2 sm:grid-cols-2">
          {[
            ['page', '1-based current page.'],
            ['pageCount', 'Total number of pages.'],
            ['onPageChange', '(next) => void.'],
            ['siblings', 'Pages shown around `page` before ellipsis. Default 1.'],
            ['showFirstLast', 'Show « / » first / last shortcut buttons. Default false.'],
            ['className', 'Extra classes on the nav pill.'],
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
            <code key={d} className="rounded-md border border-white/10 bg-white/[0.04] px-2 py-1 font-mono text-xs text-white/80">{d}</code>
          ))}
        </div>
      </DocsSection>
    </DocsPage>
  )
}
