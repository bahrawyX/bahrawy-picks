'use client'

import { useState } from 'react'
import { SearchInput } from '@/components/bahrawy/search-input'
import { CodeBlock } from '@/components/showcase/code-block'
import { DocsPage, DocsSection, DemoCard } from '@/components/showcase/docs-page'
import { ControlPanel, SelectControl, ToggleControl } from '@/components/showcase/control-panel'

export default function SearchInputDocs() {
  const [size, setSize] = useState<'sm' | 'md' | 'lg'>('md')
  const [loading, setLoading] = useState(false)
  const [value, setValue] = useState('')
  const [lastSearch, setLastSearch] = useState('')

  return (
    <DocsPage
      title="Search Input"
      slug="search-input"
      description="Standalone search field with an animated icon, clear button, debounced onSearch, and a loading spinner."
      category="101 · form"
    >
      <DocsSection title="Live demo" description="Type to see the icon nudge and the clear button fade in.">
        <DemoCard className="min-h-[280px] items-stretch">
          <div className="flex w-full max-w-md flex-col gap-3">
            <SearchInput
              size={size}
              loading={loading}
              value={value}
              onChange={setValue}
              onSearch={setLastSearch}
              placeholder="Search components…"
            />
            <p className="text-xs text-white/40">
              Last searched (debounced):{' '}
              <span className="font-mono text-white/70">
                {lastSearch || '—'}
              </span>
            </p>
          </div>
        </DemoCard>
        <ControlPanel>
          <SelectControl
            label="Size"
            value={size}
            onChange={(v) => setSize(v as 'sm' | 'md' | 'lg')}
            options={[
              { label: 'sm', value: 'sm' },
              { label: 'md', value: 'md' },
              { label: 'lg', value: 'lg' },
            ]}
          />
          <ToggleControl label="Loading" checked={loading} onChange={setLoading} />
        </ControlPanel>
      </DocsSection>
      <DocsSection title="Usage">
        <CodeBlock code={`<SearchInput\n  placeholder="Search components…"\n  onSearch={(q) => fetch(\`/api/search?q=\${q}\`)}\n  debounceMs={200}\n/>`} language="tsx" />
      </DocsSection>
    </DocsPage>
  )
}
