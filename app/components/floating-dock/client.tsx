'use client'

import { useState } from 'react'
import {
  Home,
  Search,
  MessageSquare,
  Settings,
  User,
} from 'lucide-react'
import { FloatingDock, type DockItem } from '@/components/bahrawy/floating-dock'
import { Button } from '@/components/ui/button'
import { CodeBlock } from '@/components/showcase/code-block'
import {
  ControlLabel,
  ControlsRow,
  DemoCard,
  DocsPage,
  DocsSection,
} from '@/components/showcase/docs-page'
import { PropsTable } from '@/components/showcase/props-table'

const SNIPPET = `import { FloatingDock } from '@/components/bahrawy'
import { Home, Search, Settings, User } from 'lucide-react'

const items = [
  { icon: <Home className="h-5 w-5" />, label: 'Home' },
  { icon: <Search className="h-5 w-5" />, label: 'Search' },
  { icon: <Settings className="h-5 w-5" />, label: 'Settings' },
  { icon: <User className="h-5 w-5" />, label: 'Profile' },
]

<FloatingDock items={items} magnification={1.4} distance={140} />`

const ITEMS: DockItem[] = [
  { icon: <Home className="h-5 w-5" />, label: 'Home' },
  { icon: <Search className="h-5 w-5" />, label: 'Search' },
  { icon: <MessageSquare className="h-5 w-5" />, label: 'Messages' },
  { icon: <Settings className="h-5 w-5" />, label: 'Settings' },
  { icon: <User className="h-5 w-5" />, label: 'Profile' },
]

export default function FloatingDockDocs() {
  const [magnification, setMagnification] = useState(1.4)
  const [distance, setDistance] = useState(140)

  return (
    <DocsPage
      category="37 · navigation"
      title="Floating dock"
      slug="floating-dock"
      description="macOS-style dock that magnifies icons near the cursor. Framer Motion spring physics for smooth, GPU-accelerated scaling with tooltips."
    >
      <DocsSection title="Live demo">
        <DemoCard className="min-h-[320px]">
          <FloatingDock
            items={ITEMS}
            magnification={magnification}
            distance={distance}
          />
        </DemoCard>

        <ControlsRow>
          <ControlLabel>Magnify</ControlLabel>
          {[1.2, 1.4, 1.6].map((m) => (
            <Button
              key={m}
              size="sm"
              variant={magnification === m ? 'default' : 'outline'}
              onClick={() => setMagnification(m)}
            >
              {m}x
            </Button>
          ))}
          <span className="mx-1 h-5 w-px bg-white/10" />
          <ControlLabel>Hovering Distance</ControlLabel>
          {[80, 140, 200].map((d) => (
            <Button
              key={d}
              size="sm"
              variant={distance === d ? 'default' : 'outline'}
              onClick={() => setDistance(d)}
            >
              {d}px
            </Button>
          ))}
        </ControlsRow>
      </DocsSection>

      <DocsSection title="Usage">
        <CodeBlock code={SNIPPET} language="tsx" />
      </DocsSection>

      <DocsSection title="Props">
        <PropsTable
          props={[
            { name: 'items', type: 'DockItem[]', description: 'Array of dock items ({ icon, label, href?, onClick? }).' },
            { name: 'magnification', type: 'number', default: '1.4', description: 'Max scale multiplier on hover.' },
            { name: 'distance', type: 'number', default: '140', description: 'Pixel distance from cursor to start scaling.' },
            { name: 'className', type: 'string', description: 'Additional classes for the dock bar.' },
          ]}
        />
      </DocsSection>

      <DocsSection title="DockItem">
        <PropsTable
          props={[
            { name: 'icon', type: 'ReactNode', description: 'Dock icon (SVG or Lucide icon).' },
            { name: 'label', type: 'string', description: 'Tooltip label shown on hover.' },
            { name: 'href', type: 'string', description: 'If provided, renders as a link.' },
            { name: 'onClick', type: '() => void', description: 'Click handler.' },
          ]}
        />
      </DocsSection>

      <DocsSection title="Dependencies">
        <div className="flex flex-wrap gap-2">
          {['framer-motion'].map((d) => (
            <code
              key={d}
              className="rounded-md border border-white/10 bg-white/[0.04] px-2 py-1 font-mono text-xs text-white/80"
            >
              {d}
            </code>
          ))}
        </div>
      </DocsSection>
    </DocsPage>
  )
}
