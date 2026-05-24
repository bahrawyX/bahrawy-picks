'use client'

import * as React from 'react'
import {
  AppShell,
  type AppShellSection,
} from '@/components/bahrawy/app-shell'
import {
  Bell,
  ChevronDown,
  FileText,
  Folder,
  Home,
  Inbox,
  Search,
  Settings,
} from 'lucide-react'
import { CodeBlock } from '@/components/showcase/code-block'
import { DocsPage, DocsSection, DemoCard } from '@/components/showcase/docs-page'

const SNIPPET = `import { AppShell } from '@/components/bahrawy/app-shell'

<AppShell
  brand={<Brand />}
  topbar={<Topbar />}
  sidebar={[
    {
      label: 'General',
      items: [
        { label: 'Home',   icon: <Home />,   onClick: () => setActive('home'),   active: active === 'home' },
        { label: 'Search', icon: <Search />, onClick: () => setActive('search'), active: active === 'search' },
        { label: 'Inbox',  icon: <Inbox />,  onClick: () => setActive('inbox'),  active: active === 'inbox', badge: <Badge>3</Badge> },
      ],
    },
    {
      label: 'Workspace',
      items: [
        { label: 'Projects',  icon: <Folder />,   href: '/projects' },
        { label: 'Documents', icon: <FileText />, href: '/documents' },
      ],
    },
  ]}
  sidebarFooter={<UserChip />}
>
  <YourPage />
</AppShell>`

function Brand() {
  return (
    <div className="flex items-center gap-2.5">
      <span
        aria-hidden
        className="flex h-7 w-7 items-center justify-center rounded-[7px] border border-white/[0.1] bg-gradient-to-br from-white/[0.14] to-white/[0.04] font-display text-[13px] font-semibold text-white"
      >
        B
      </span>
      <span className="truncate font-display text-[14px] font-semibold tracking-tight text-white">
        Bahrawy
      </span>
    </div>
  )
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex h-[18px] min-w-[18px] items-center justify-center rounded-md bg-white/[0.08] px-1.5 font-mono text-[10px] tabular-nums text-white/65">
      {children}
    </span>
  )
}

function UserChip() {
  return (
    <button className="flex w-full items-center gap-2.5 rounded-lg px-2 py-1.5 transition-colors hover:bg-white/[0.04]">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/[0.1] bg-gradient-to-br from-white/[0.14] to-white/[0.04] text-[11px] font-semibold text-white">
        AB
      </span>
      <span className="min-w-0 flex-1 text-left">
        <span className="block truncate text-[12px] font-medium tracking-tight text-white">
          Abdelrahman
        </span>
        <span className="block truncate text-[10.5px] text-white/45">
          Pro plan
        </span>
      </span>
      <ChevronDown className="h-3.5 w-3.5 shrink-0 text-white/40" strokeWidth={2} />
    </button>
  )
}

function Topbar({ active }: { active: string }) {
  const label = TITLES[active] ?? 'Home'
  return (
    <div className="flex items-center gap-2">
      <h2 className="truncate font-display text-[15px] font-semibold tracking-tight text-white">
        {label}
      </h2>
      <div className="ml-auto flex items-center gap-1.5">
        <button className="hidden h-8 items-center gap-2 rounded-md border border-white/[0.06] bg-white/[0.04] px-2.5 text-[11.5px] text-white/65 transition-colors hover:bg-white/[0.08] hover:text-white sm:inline-flex">
          <Search className="h-3.5 w-3.5" strokeWidth={2} />
          Search
          <kbd className="rounded border border-white/[0.06] bg-black/40 px-1 py-px font-mono text-[9.5px] text-white/45">
            ⌘K
          </kbd>
        </button>
        <button className="inline-flex h-8 w-8 items-center justify-center rounded-md text-white/55 transition-colors hover:bg-white/[0.06] hover:text-white">
          <Bell className="h-3.5 w-3.5" strokeWidth={2} />
        </button>
      </div>
    </div>
  )
}

const TITLES: Record<string, string> = {
  home: 'Home',
  search: 'Search',
  inbox: 'Inbox',
  projects: 'Projects',
  documents: 'Documents',
  settings: 'Settings',
}

function Dashboard() {
  const stats = [
    { label: 'Revenue', value: '$84,231', delta: '+12.4%' },
    { label: 'Active users', value: '12,847', delta: '+3.1%' },
    { label: 'Conversion', value: '4.82%', delta: '+0.6%' },
  ]
  const activity = [
    { who: 'Lee Robinson',  what: 'opened a pull request',   when: 'just now' },
    { who: 'Hayden Bleasel', what: 'merged main',             when: '2m ago' },
    { who: 'shadcn',        what: 'commented on #482',        when: '14m ago' },
    { who: 'Emil Kowalski', what: 'deployed to production',   when: '32m ago' },
  ]
  return (
    <div className="space-y-6">
      {/* Stat cards */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {stats.map((s) => (
          <div
            key={s.label}
            className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4"
          >
            <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-white/45">
              {s.label}
            </p>
            <p className="mt-2 font-display text-[28px] font-semibold tracking-tight text-white tabular-nums">
              {s.value}
            </p>
            <p className="mt-1 text-[11.5px] text-emerald-400/80 tabular-nums">
              {s.delta}
            </p>
          </div>
        ))}
      </div>

      {/* Activity feed */}
      <div className="rounded-xl border border-white/[0.06] bg-white/[0.02]">
        <div className="flex items-center justify-between border-b border-white/[0.06] px-4 py-3">
          <h3 className="font-display text-[13px] font-semibold tracking-tight text-white">
            Recent activity
          </h3>
          <button className="text-[11px] text-white/45 transition-colors hover:text-white/75">
            View all
          </button>
        </div>
        <ul className="divide-y divide-white/[0.04]">
          {activity.map((a, i) => (
            <li key={i} className="flex items-center gap-3 px-4 py-3">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.04] text-[10.5px] font-semibold text-white/75">
                {a.who
                  .split(' ')
                  .map((w) => w[0])
                  .join('')
                  .slice(0, 2)}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[12.5px] text-white/85">
                  <span className="font-medium text-white">{a.who}</span>{' '}
                  <span className="text-white/55">{a.what}</span>
                </p>
              </div>
              <span className="shrink-0 font-mono text-[10.5px] text-white/35">
                {a.when}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default function AppShellDocs() {
  const [active, setActive] = React.useState('home')
  const sections: AppShellSection[] = [
    {
      label: 'General',
      items: [
        { label: 'Home',   icon: <Home />,   onClick: () => setActive('home'),   active: active === 'home' },
        { label: 'Search', icon: <Search />, onClick: () => setActive('search'), active: active === 'search' },
        { label: 'Inbox',  icon: <Inbox />,  onClick: () => setActive('inbox'),  active: active === 'inbox', badge: <Badge>3</Badge> },
      ],
    },
    {
      label: 'Workspace',
      items: [
        { label: 'Projects',  icon: <Folder />,   onClick: () => setActive('projects'),  active: active === 'projects' },
        { label: 'Documents', icon: <FileText />, onClick: () => setActive('documents'), active: active === 'documents' },
      ],
    },
    {
      items: [
        { label: 'Settings', icon: <Settings />, onClick: () => setActive('settings'), active: active === 'settings' },
      ],
    },
  ]

  return (
    <DocsPage
      title="App Shell"
      slug="app-shell"
      description="The layout primitive every SaaS starts with. Fixed 256px vibrancy sidebar with grouped sections + a brand area, a 52px topbar that spans the content column, and a generous main area. Active items become a neutral pill that springs between rows via shared layoutId. Mobile drawer behind a blurred scrim."
      category="21 · layout"
    >
      <DocsSection title="Full shell — click items in the sidebar">
        <DemoCard className="min-h-[640px] overflow-hidden p-0">
          <div className="h-[620px] w-full">
            <AppShell
              brand={<Brand />}
              sidebar={sections}
              sidebarFooter={<UserChip />}
              topbar={<Topbar active={active} />}
            >
              <Dashboard />
            </AppShell>
          </div>
        </DemoCard>
      </DocsSection>

      <DocsSection title="Usage">
        <CodeBlock code={SNIPPET} language="tsx" />
      </DocsSection>

      <DocsSection title="Props">
        <ul className="grid gap-2 sm:grid-cols-2">
          {[
            ['sidebar', 'AppShellSection[] — each { label?, items[] }, item: { href|onClick, label, icon?, badge?, active? }.'],
            ['brand', 'Top-of-rail brand slot (logo + product name).'],
            ['topbar', 'Optional topbar contents — hidden if omitted.'],
            ['sidebarFooter', 'Bottom-of-rail footer slot (user chip, etc).'],
            ['children', 'Main content area — scrolls independently.'],
            ['sidebarWidth', 'Sidebar width in px. Default 256.'],
            ['className', 'Extra classes on the outer frame.'],
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
