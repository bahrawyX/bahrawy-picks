'use client'

import * as React from 'react'
import { SidebarNav } from '@/components/bahrawy/sidebar-nav'
import {
  Home,
  Inbox,
  CalendarDays,
  Star,
  FolderOpen,
  Settings,
  Users,
  CircleDollarSign,
  LineChart,
  LifeBuoy,
  Sparkles,
  ListChecks,
} from 'lucide-react'
import { CodeBlock } from '@/components/showcase/code-block'
import { DocsPage, DocsSection, DemoCard } from '@/components/showcase/docs-page'

const SNIPPET = `import { SidebarNav } from '@/components/bahrawy/sidebar-nav'

const [active, setActive] = useState('inbox')

<SidebarNav
  active={active}
  onActiveChange={setActive}
  brand={<BrandRow />}
  sections={[
    {
      id: 'general',
      items: [
        { id: 'home',    label: 'Home',    icon: <Home /> },
        { id: 'inbox',   label: 'Inbox',   icon: <Inbox />, badge: 4 },
        { id: 'starred', label: 'Starred', icon: <Star /> },
      ],
    },
    {
      id: 'projects',
      label: 'Projects',
      collapsible: true,
      items: [
        { id: 'site',  label: 'Site redesign',   icon: <FolderOpen /> },
        { id: 'docs',  label: 'Docs portal',     icon: <FolderOpen /> },
      ],
    },
  ]}
/>`

export default function SidebarNavDocs() {
  const [activeA, setActiveA] = React.useState('inbox')
  const [activeB, setActiveB] = React.useState('analytics')

  return (
    <DocsPage
      title="Sidebar Nav"
      slug="sidebar-nav"
      description="Apple-style app sidebar navigation primitive. Distinct from <AppShell /> (which is a full layout) — this is the nav body you'd drop into any layout. Vibrancy backdrop-blur panel, grouped + collapsible sections, animated active-item pill driven by layoutId so it glides between rows, icon + label + optional trailing badge, optional sticky footer."
      category="160 · navigation"
    >
      <DocsSection title="Two columns with brand + footer">
        <DemoCard className="min-h-[560px] items-start py-8">
          <div className="grid w-full max-w-3xl gap-4 sm:grid-cols-[248px_1fr]">
            <div style={{ height: 500 }}>
              <SidebarNav
                active={activeA}
                onActiveChange={setActiveA}
                brand={
                  <div className="flex items-center gap-2">
                    <span className="inline-flex h-7 w-7 items-center justify-center rounded-[8px] bg-gradient-to-br from-[#5E5CE6] to-[#BF5AF2] text-white">
                      <Sparkles className="h-3.5 w-3.5" strokeWidth={2.5} />
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-[13px] font-semibold tracking-tight text-white">
                        bahrawy.app
                      </p>
                      <p className="truncate text-[10.5px] text-white/45">Workspace</p>
                    </div>
                  </div>
                }
                footer={
                  <div className="flex items-center gap-2.5 px-2 py-1">
                    <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#FF375F] to-[#FF9F0A] text-[10px] font-bold text-white">
                      AB
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[12px] font-medium tracking-tight text-white">
                        Abdelrahman
                      </p>
                      <p className="truncate text-[10.5px] text-white/45">Pro plan</p>
                    </div>
                  </div>
                }
                sections={[
                  {
                    id: 'general',
                    items: [
                      { id: 'home', label: 'Home', icon: <Home /> },
                      { id: 'inbox', label: 'Inbox', icon: <Inbox />, badge: 4 },
                      { id: 'today', label: 'Today', icon: <CalendarDays /> },
                      { id: 'starred', label: 'Starred', icon: <Star /> },
                    ],
                  },
                  {
                    id: 'projects',
                    label: 'Projects',
                    collapsible: true,
                    items: [
                      { id: 'site', label: 'Site redesign', icon: <FolderOpen /> },
                      { id: 'docs', label: 'Docs portal', icon: <FolderOpen /> },
                      { id: 'api', label: 'API v2', icon: <FolderOpen />, badge: 'new' },
                    ],
                  },
                  {
                    id: 'team',
                    label: 'Team',
                    collapsible: true,
                    defaultCollapsed: true,
                    items: [
                      { id: 'people', label: 'People', icon: <Users /> },
                      { id: 'billing', label: 'Billing', icon: <CircleDollarSign /> },
                    ],
                  },
                  {
                    id: 'bottom',
                    items: [
                      { id: 'settings', label: 'Settings', icon: <Settings /> },
                    ],
                  },
                ]}
              />
            </div>
            <div className="hidden rounded-[20px] border border-white/[0.06] bg-white/[0.015] p-5 sm:block">
              <p className="text-[10.5px] font-semibold uppercase tracking-[0.18em] text-white/40">
                Active
              </p>
              <p className="mt-1 font-mono text-[13px] tracking-tight text-white/85">
                {activeA}
              </p>
              <p className="mt-4 text-[12px] leading-relaxed text-white/55">
                Click any item in the sidebar — the pill glides between rows
                via Framer&apos;s <code className="font-mono">layoutId</code> with
                Apple spring physics. Collapse sections with the section labels.
              </p>
            </div>
          </div>
        </DemoCard>
      </DocsSection>

      <DocsSection title="Minimal, no brand or footer">
        <DemoCard className="min-h-[440px] items-start py-8">
          <div style={{ height: 380 }}>
            <SidebarNav
              active={activeB}
              onActiveChange={setActiveB}
              accent="#30D158"
              width={228}
              sections={[
                {
                  id: 'main',
                  items: [
                    { id: 'overview', label: 'Overview', icon: <Home /> },
                    { id: 'analytics', label: 'Analytics', icon: <LineChart /> },
                    { id: 'tasks', label: 'Tasks', icon: <ListChecks />, badge: 12 },
                    { id: 'help', label: 'Help', icon: <LifeBuoy /> },
                  ],
                },
              ]}
            />
          </div>
        </DemoCard>
      </DocsSection>

      <DocsSection title="Usage">
        <CodeBlock code={SNIPPET} language="tsx" />
      </DocsSection>

      <DocsSection title="Props">
        <ul className="grid gap-2 sm:grid-cols-2">
          {[
            ['sections', 'SidebarNavSection[] — { id, label?, items, collapsible?, defaultCollapsed? }.'],
            ['active / onActiveChange', 'Controlled active item id.'],
            ['defaultActive', 'Uncontrolled initial active id.'],
            ['brand', 'Optional header content (logo + product name).'],
            ['footer', 'Optional sticky footer (user pill, etc).'],
            ['accent', 'Active-pill accent. Default SF indigo #5E5CE6.'],
            ['width', 'Sidebar width in px. Default 248.'],
            ['className', 'Extra classes on the nav element.'],
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
