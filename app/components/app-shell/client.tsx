'use client'

import * as React from 'react'
import {
  AppShell,
  type AppShellSection,
} from '@/components/bahrawy/app-shell'
import {
  Bell,
  ChevronDown,
  CircleDot,
  FileText,
  Folder,
  Inbox,
  LayoutGrid,
  Plus,
  Search,
  Settings,
  Sparkles,
  Users,
} from 'lucide-react'
import { CodeBlock } from '@/components/showcase/code-block'
import { DocsPage, DocsSection, DemoCard } from '@/components/showcase/docs-page'

const SNIPPET = `import { AppShell } from '@/components/bahrawy/app-shell'

<AppShell
  brand={<Brand />}
  topbar={<Topbar />}
  sidebar={[
    {
      label: 'Workspace',
      items: [
        { label: 'Inbox',   icon: <Inbox />,     href: '/inbox',   active: true,  badge: <span>12</span> },
        { label: 'Issues',  icon: <CircleDot />, href: '/issues' },
      ],
    },
    {
      label: 'Library',
      items: [
        { label: 'Docs',     icon: <FileText />, href: '/docs' },
        { label: 'Settings', icon: <Settings />, href: '/settings' },
      ],
    },
  ]}
  sidebarFooter={<UserChip />}
>
  <YourPage />
</AppShell>`

function Brand() {
  return (
    <div className="flex items-center gap-2">
      <span className="flex h-6 w-6 items-center justify-center rounded-md bg-violet-400/20 text-violet-200">
        <Sparkles className="h-3.5 w-3.5" strokeWidth={2.5} />
      </span>
      <span className="truncate text-[13px] font-semibold tracking-tight text-white">
        Bahrawy
      </span>
    </div>
  )
}

function Badge({ count }: { count: number }) {
  return (
    <span className="inline-flex h-5 min-w-[20px] items-center justify-center rounded-md bg-white/[0.08] px-1 font-mono text-[10px] tabular-nums text-white/75">
      {count}
    </span>
  )
}

function UserChip() {
  return (
    <button className="flex w-full items-center gap-2 rounded-lg p-1.5 transition-colors hover:bg-white/[0.04]">
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-400/45 to-rose-400/45 text-[10px] font-semibold text-white">
        AB
      </span>
      <span className="min-w-0 flex-1 text-left">
        <span className="block truncate text-[11.5px] font-medium text-white">
          Abdelrahman
        </span>
        <span className="block truncate text-[10px] text-white/45">
          abdelrahman@bahrawy.me
        </span>
      </span>
      <ChevronDown className="h-3 w-3 shrink-0 text-white/35" strokeWidth={2.5} />
    </button>
  )
}

function Topbar() {
  return (
    <div className="flex items-center gap-2">
      <h2 className="truncate text-[13px] font-semibold tracking-tight text-white">
        Inbox
      </h2>
      <span className="text-white/30">·</span>
      <span className="text-[11px] text-white/45">12 new this week</span>
      <div className="ml-auto flex items-center gap-1.5">
        <button className="hidden h-7 items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-2.5 text-[11px] text-white/65 transition-colors hover:bg-white/[0.08] hover:text-white sm:inline-flex">
          <Search className="h-3 w-3" strokeWidth={2.5} />
          Search
          <kbd className="rounded border border-white/10 bg-black/40 px-1 py-px font-mono text-[9px] text-white/45">
            ⌘K
          </kbd>
        </button>
        <button className="inline-flex h-7 w-7 items-center justify-center rounded-md text-white/55 transition-colors hover:bg-white/[0.06] hover:text-white">
          <Bell className="h-3.5 w-3.5" strokeWidth={2.5} />
        </button>
        <button className="inline-flex h-7 items-center gap-1.5 rounded-full bg-white px-2.5 text-[11.5px] font-semibold text-black transition-transform hover:scale-[1.03]">
          <Plus className="h-3 w-3" strokeWidth={3} />
          New
        </button>
      </div>
    </div>
  )
}

function FakeInboxBody() {
  const rows = [
    { from: '@haydenbleasel', subject: 'Re: Spotlight Tour polish',     time: 'just now', unread: true },
    { from: '@leerob',        subject: 'OG image regenerate for /og',   time: '2m',       unread: true },
    { from: '@shadcn',        subject: 'Nebula colors look amazing',    time: '14m',      unread: false },
    { from: '@vercel',        subject: 'Deployment succeeded — main',   time: '32m',      unread: false },
    { from: '@github',        subject: '12 new stars this week',        time: '1h',       unread: false },
    { from: '@stripe',        subject: 'Invoice #INV-3092 paid',        time: '3h',       unread: false },
  ]
  return (
    <ul className="divide-y divide-white/[0.04]">
      {rows.map((r, i) => (
        <li
          key={i}
          className="flex cursor-pointer items-center gap-3 px-4 py-3 transition-colors hover:bg-white/[0.02]"
        >
          <span
            aria-hidden
            className={
              'block h-1.5 w-1.5 shrink-0 rounded-full ' +
              (r.unread ? 'bg-violet-400' : 'bg-transparent')
            }
          />
          <span className="w-32 shrink-0 truncate text-[12px] font-medium text-white/85">
            {r.from}
          </span>
          <span className="min-w-0 flex-1 truncate text-[12px] text-white/70">
            {r.subject}
          </span>
          <span className="shrink-0 font-mono text-[10.5px] text-white/35">
            {r.time}
          </span>
        </li>
      ))}
    </ul>
  )
}

export default function AppShellDocs() {
  const [active, setActive] = React.useState('inbox')
  const sections: AppShellSection[] = [
    {
      label: 'Workspace',
      items: [
        { label: 'Inbox',     icon: <Inbox />,      onClick: () => setActive('inbox'),     active: active === 'inbox', badge: <Badge count={12} /> },
        { label: 'Issues',    icon: <CircleDot />,  onClick: () => setActive('issues'),    active: active === 'issues' },
        { label: 'Projects',  icon: <Folder />,     onClick: () => setActive('projects'),  active: active === 'projects', badge: <Badge count={3} /> },
        { label: 'Team',      icon: <Users />,      onClick: () => setActive('team'),      active: active === 'team' },
      ],
    },
    {
      label: 'Library',
      items: [
        { label: 'Components', icon: <LayoutGrid />, onClick: () => setActive('components'), active: active === 'components' },
        { label: 'Docs',       icon: <FileText />,   onClick: () => setActive('docs'),       active: active === 'docs' },
        { label: 'Settings',   icon: <Settings />,   onClick: () => setActive('settings'),   active: active === 'settings' },
      ],
    },
  ]

  return (
    <DocsPage
      title="App Shell"
      slug="app-shell"
      description="The layout primitive every SaaS starts with. A left rail (brand + nav sections + footer), an optional topbar, and the main content area. Spring-animated collapse to icon-only mode — labels fade out as the rail shrinks; mobile-first via a slide-in drawer."
      category="61 · layout"
    >
      <DocsSection title="Full shell (click the chevron to collapse)">
        <DemoCard className="min-h-[560px] overflow-hidden p-0">
          <div className="h-[540px] w-full">
            <AppShell
              brand={<Brand />}
              sidebar={sections}
              sidebarFooter={<UserChip />}
              topbar={<Topbar />}
            >
              <FakeInboxBody />
            </AppShell>
          </div>
        </DemoCard>
      </DocsSection>

      <DocsSection title="Starts collapsed">
        <DemoCard className="min-h-[480px] overflow-hidden p-0">
          <div className="h-[460px] w-full">
            <AppShell
              brand={<Brand />}
              sidebar={sections}
              sidebarFooter={<UserChip />}
              topbar={<Topbar />}
              defaultCollapsed
            >
              <FakeInboxBody />
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
            ['defaultCollapsed', 'Start with the rail collapsed. Default false.'],
            ['collapsible', 'Show the collapse toggle. Default true.'],
            ['sidebarWidth / collapsedWidth', 'Width in px. Defaults 240 / 68.'],
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
