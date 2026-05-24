'use client'

import { FileSearch, Inbox, Users } from 'lucide-react'
import { EmptyState } from '@/components/bahrawy/empty-state'
import { CodeBlock } from '@/components/showcase/code-block'
import { DocsPage, DocsSection, DemoCard } from '@/components/showcase/docs-page'

export default function EmptyStateDocs() {
  return (
    <DocsPage
      title="Empty State"
      slug="empty-state"
      description="The standard no-data pattern: icon + heading + body + CTA. Used to fill empty tables, lists, or dashboards with something helpful."
      category="105 · ui"
    >
      <DocsSection title="Live demo">
        <DemoCard className="min-h-[420px] items-stretch">
          <div className="grid w-full gap-4 sm:grid-cols-2">
            <EmptyState
              title="No tasks yet"
              description="Get started by creating your first task. It only takes a second."
              primaryCta={{ label: 'New task' }}
              secondaryCta={{ label: 'Import' }}
              accentColor="rgba(167,139,250,0.18)"
            />
            <EmptyState
              icon={<FileSearch className="h-6 w-6" />}
              title="No results"
              description={'We couldn\'t find anything matching your search.'}
              primaryCta={{ label: 'Clear filters' }}
              accentColor="rgba(34,211,238,0.18)"
            />
            <EmptyState
              icon={<Users className="h-6 w-6" />}
              title="No teammates yet"
              description="Invite people to collaborate on this workspace."
              primaryCta={{ label: 'Invite teammates' }}
              accentColor="rgba(244,114,182,0.18)"
            />
            <EmptyState
              icon={<Inbox className="h-6 w-6" />}
              title="Inbox zero"
              description="You're all caught up. Take the win."
              accentColor="rgba(52,211,153,0.18)"
            />
          </div>
        </DemoCard>
      </DocsSection>
      <DocsSection title="Usage">
        <CodeBlock code={`<EmptyState\n  title="No tasks yet"\n  description="Get started by creating your first task."\n  primaryCta={{ label: 'New task' }}\n/>`} language="tsx" />
      </DocsSection>
    </DocsPage>
  )
}
