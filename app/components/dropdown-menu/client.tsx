'use client'

import { useState } from 'react'
import { Copy, Edit3, MoreHorizontal, Share2, Trash2 } from 'lucide-react'
import { DropdownMenu, type DropdownEntry } from '@/components/bahrawy/dropdown-menu'
import { CodeBlock } from '@/components/showcase/code-block'
import { DocsPage, DocsSection, DemoCard } from '@/components/showcase/docs-page'

export default function DropdownMenuDocs() {
  const [lastAction, setLastAction] = useState<string>('—')

  const items: DropdownEntry[] = [
    { id: 'edit', label: 'Edit', icon: <Edit3 className="h-3.5 w-3.5" />, shortcut: '⌘E', onSelect: () => setLastAction('Edit') },
    { id: 'duplicate', label: 'Duplicate', icon: <Copy className="h-3.5 w-3.5" />, shortcut: '⌘D', onSelect: () => setLastAction('Duplicate') },
    { id: 'share', label: 'Share', icon: <Share2 className="h-3.5 w-3.5" />, onSelect: () => setLastAction('Share') },
    { kind: 'separator' as const },
    { id: 'delete', label: 'Delete', icon: <Trash2 className="h-3.5 w-3.5" />, danger: true, shortcut: '⌫', onSelect: () => setLastAction('Delete') },
  ]

  return (
    <DocsPage
      title="Dropdown Menu"
      slug="dropdown-menu"
      description="Animated dropdown menu with keyboard navigation (↑/↓/Enter), dividers, icons, shortcut hints, and a danger style."
      category="98 · overlay"
    >
      <DocsSection title="Live demo" description="Open the menu and try the arrow keys.">
        <DemoCard className="min-h-[280px]">
          <div className="flex flex-col items-center gap-6">
            <DropdownMenu
              items={items}
              trigger={
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/[0.04] text-white/80 transition-colors hover:bg-white/10 hover:text-white">
                  <MoreHorizontal className="h-4 w-4" />
                </span>
              }
            />
            <p className="text-xs text-white/40">Last action: <span className="font-mono text-white/70">{lastAction}</span></p>
          </div>
        </DemoCard>
      </DocsSection>
      <DocsSection title="Usage">
        <CodeBlock code={`<DropdownMenu\n  trigger={<MoreButton />}\n  items={[\n    { id: 'edit', label: 'Edit', shortcut: '⌘E', onSelect: () => {} },\n    { kind: 'separator' },\n    { id: 'delete', label: 'Delete', danger: true, onSelect: () => {} },\n  ]}\n/>`} language="tsx" />
      </DocsSection>
    </DocsPage>
  )
}
