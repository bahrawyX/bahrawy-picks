'use client'

import { Breadcrumb } from '@/components/bahrawy/breadcrumb'
import { CodeBlock } from '@/components/showcase/code-block'
import { DocsPage, DocsSection, DemoCard } from '@/components/showcase/docs-page'

export default function BreadcrumbDocs() {
  return (
    <DocsPage
      title="Breadcrumb"
      slug="breadcrumb"
      description="Animated breadcrumb with chevron separators. Long trails collapse to a `…` button you can click to expand."
      category="83 · navigation"
    >
      <DocsSection title="Live demo" description="Click the `…` on the second example to expand the full path.">
        <DemoCard className="min-h-[200px] items-stretch">
          <div className="flex w-full max-w-2xl flex-col gap-8">
            <Breadcrumb
              items={[
                { label: 'Home', href: '#' },
                { label: 'Components', href: '#' },
                { label: 'Breadcrumb' },
              ]}
            />
            <Breadcrumb
              maxVisible={3}
              items={[
                { label: 'Home', href: '#' },
                { label: 'Workspace', href: '#' },
                { label: 'Projects', href: '#' },
                { label: 'Bahrawy', href: '#' },
                { label: 'Components', href: '#' },
                { label: 'Settings' },
              ]}
            />
          </div>
        </DemoCard>
      </DocsSection>
      <DocsSection title="Usage">
        <CodeBlock code={`<Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Settings' }]} />`} language="tsx" />
      </DocsSection>
    </DocsPage>
  )
}
