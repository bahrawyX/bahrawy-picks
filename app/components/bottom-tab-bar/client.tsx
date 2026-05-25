'use client'

import * as React from 'react'
import { BottomTabBar } from '@/components/bahrawy/bottom-tab-bar'
import { CodeBlock } from '@/components/showcase/code-block'
import { DocsPage, DocsSection, DemoCard } from '@/components/showcase/docs-page'
import { Home, Search, Bell, User, MessageCircle, LayoutGrid, Heart, ShoppingBag } from 'lucide-react'

const SNIPPET = `import { BottomTabBar } from '@/components/bahrawy/bottom-tab-bar'
import { Home, Search, Bell, User } from 'lucide-react'

const [tab, setTab] = useState('home')

<BottomTabBar
  value={tab}
  onValueChange={setTab}
  items={[
    { value: 'home',     label: 'Home',     icon: <Home /> },
    { value: 'search',   label: 'Search',   icon: <Search /> },
    { value: 'notifs',   label: 'Inbox',    icon: <Bell />, badge: 3 },
    { value: 'profile',  label: 'Profile',  icon: <User /> },
  ]}
/>`

export default function BottomTabBarDocs() {
  const [tab1, setTab1] = React.useState('home')
  const [tab2, setTab2] = React.useState('feed')

  return (
    <DocsPage
      title="Bottom Tab Bar"
      slug="bottom-tab-bar"
      description="iOS-style mobile bottom navigation. A floating vibrancy pill with 3–5 tabs, each with an icon + label, optional badge. The active tab gets a soft white pill that glides between tabs via Framer's layoutId. Use as a fixed floating bar (set floating={true}) or inline inside a layout."
      category="175 · navigation"
    >
      <DocsSection title="Four tabs with a badge">
        <DemoCard className="min-h-[180px]">
          <div className="flex flex-col items-center gap-3">
            <BottomTabBar
              value={tab1}
              onValueChange={setTab1}
              items={[
                { value: 'home', label: 'Home', icon: <Home /> },
                { value: 'search', label: 'Search', icon: <Search /> },
                { value: 'notifs', label: 'Inbox', icon: <Bell />, badge: 3 },
                { value: 'profile', label: 'Profile', icon: <User /> },
              ]}
            />
            <p className="font-mono text-[11px] tabular-nums text-white/45">
              tab = <span className="text-white/75">{tab1}</span>
            </p>
          </div>
        </DemoCard>
      </DocsSection>

      <DocsSection title="Five tabs, no labels (icon-only)">
        <DemoCard className="min-h-[180px]">
          <div className="flex flex-col items-center gap-3">
            <BottomTabBar
              value={tab2}
              onValueChange={setTab2}
              showLabels={false}
              items={[
                { value: 'feed', label: 'Feed', icon: <LayoutGrid /> },
                { value: 'messages', label: 'Messages', icon: <MessageCircle />, badge: 12 },
                { value: 'likes', label: 'Likes', icon: <Heart /> },
                { value: 'cart', label: 'Cart', icon: <ShoppingBag />, badge: 1 },
                { value: 'profile', label: 'Profile', icon: <User /> },
              ]}
            />
            <p className="font-mono text-[11px] tabular-nums text-white/45">
              tab = <span className="text-white/75">{tab2}</span>
            </p>
          </div>
        </DemoCard>
      </DocsSection>

      <DocsSection title="Usage">
        <CodeBlock code={SNIPPET} language="tsx" />
        <p className="mt-3 text-xs text-white/45">
          Pass <code className="font-mono">floating={'{true}'}</code> to fix the bar to the
          bottom of the viewport (<code className="font-mono">position: fixed</code> centered
          horizontally). Otherwise it sits inline wherever you place it.
        </p>
      </DocsSection>

      <DocsSection title="Props">
        <ul className="grid gap-2 sm:grid-cols-2">
          {[
            ['items', 'BottomTabBarItem[] — { value, label, icon, badge? }.'],
            ['value / onValueChange', 'Controlled active tab.'],
            ['defaultValue', 'Uncontrolled initial active tab.'],
            ['showLabels', 'Show the text label under each icon. Default true.'],
            ['floating', 'Position fixed at viewport bottom. Default false.'],
            ['layoutId', 'Shared layoutId for the active pill (use when multiple bars are on the same page).'],
            ['className', 'Extra classes on the bar.'],
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
          {['framer-motion'].map((d) => (
            <code key={d} className="rounded-md border border-white/10 bg-white/[0.04] px-2 py-1 font-mono text-xs text-white/80">{d}</code>
          ))}
        </div>
      </DocsSection>
    </DocsPage>
  )
}
