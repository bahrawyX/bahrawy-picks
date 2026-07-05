'use client'

/**
 * /theme-preview — internal QA page for the picks-* theming tokens.
 * Renders the same component set twice: on the default dark tokens and
 * inside a data-picks-theme="light" wrapper. Not listed in any registry.
 */

import { StatCard } from '@/components/bahrawy/stat-card'
import { Sparkline } from '@/components/bahrawy/sparkline'
import { StatusPill } from '@/components/bahrawy/status-pill'
import { Skeleton, SkeletonText } from '@/components/bahrawy/skeleton'
import { Switch } from '@/components/bahrawy/switch'
import { SearchInput } from '@/components/bahrawy/search-input'
import { Accordion } from '@/components/bahrawy/accordion'
import { Tabs } from '@/components/bahrawy/tabs'

const SPARK = [4, 9, 6, 12, 10, 16, 13, 19, 22, 18, 26, 30]

function Panel({ title }: { title: string }) {
  return (
    <section className="rounded-2xl p-8" style={{ background: 'var(--picks-surface)' }}>
      <h2 className="mb-6 text-lg font-semibold text-picks-fg">{title}</h2>
      <div className="grid gap-6 md:grid-cols-2">
        <StatCard
          label="Monthly revenue"
          value={48250}
          prefix="$"
          delta={12.4}
          trend={SPARK}
        />
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <StatusPill intent="online">Operational</StatusPill>
            <StatusPill intent="away">Degraded</StatusPill>
            <Switch defaultChecked label="Notifications" />
          </div>
          <SearchInput placeholder="Search components…" />
          <Sparkline points={SPARK} responsive label="Revenue trend" className="h-8" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-2/3" />
            <SkeletonText lines={2} />
          </div>
        </div>
        <Accordion
          items={[
            { id: 'a', title: 'What is this page?', content: 'Internal QA for the picks-* theme tokens.' },
            { id: 'b', title: 'How do I theme?', content: 'Set data-picks-theme="light" on any wrapper.' },
          ]}
        />
        <Tabs
          items={[
            { id: 'one', label: 'Overview', content: <p className="text-sm text-picks-fg/60">Token-driven content.</p> },
            { id: 'two', label: 'Details', content: <p className="text-sm text-picks-fg/60">Same components, both themes.</p> },
          ]}
        />
      </div>
    </section>
  )
}

export default function ThemePreviewPage() {
  return (
    <main className="mx-auto flex max-w-4xl flex-col gap-10 px-6 py-16">
      <header>
        <h1 className="text-2xl font-semibold text-white">picks-* theme preview</h1>
        <p className="mt-1 text-sm text-white/60">
          Same components on the default dark tokens, then inside{' '}
          <code className="rounded bg-white/10 px-1">data-picks-theme=&quot;light&quot;</code>.
        </p>
      </header>
      <Panel title="Dark (default tokens)" />
      <div data-picks-theme="light">
        <Panel title="Light (data-picks-theme='light')" />
      </div>
    </main>
  )
}
