'use client'

import { useState } from 'react'
import {
  Home,
  Search,
  Settings,
  User,
  FileText,
  Plus,
  Trash2,
  Share2,
  Moon,
  LogOut,
} from 'lucide-react'
import { CommandPalette, type CommandGroup } from '@/components/bahrawy/command-palette'
import { Button } from '@/components/ui/button'
import { CodeBlock } from '@/components/showcase/code-block'
import {
  DemoCard,
  DocsPage,
  DocsSection,
} from '@/components/showcase/docs-page'
import { PropsTable } from '@/components/showcase/props-table'

const SNIPPET = `import { CommandPalette } from '@/components/bahrawy'

const [open, setOpen] = useState(false)

const groups = [
  {
    heading: 'Actions',
    items: [
      { id: 'new', label: 'New file', icon: <Plus />, shortcut: '⌘N', onSelect: () => {} },
      { id: 'search', label: 'Search', icon: <Search />, shortcut: '⌘F', onSelect: () => {} },
    ],
  },
]

<CommandPalette open={open} onOpenChange={setOpen} groups={groups} />`

export default function CommandPaletteDocs() {
  const [open, setOpen] = useState(false)
  const [lastAction, setLastAction] = useState<string | null>(null)

  const groups: CommandGroup[] = [
    {
      heading: 'Navigation',
      items: [
        { id: 'home', label: 'Go to Home', icon: <Home className="h-4 w-4" />, onSelect: () => setLastAction('Home') },
        { id: 'search', label: 'Search docs', icon: <Search className="h-4 w-4" />, shortcut: '⌘F', onSelect: () => setLastAction('Search') },
        { id: 'profile', label: 'Profile', icon: <User className="h-4 w-4" />, onSelect: () => setLastAction('Profile') },
        { id: 'settings', label: 'Settings', icon: <Settings className="h-4 w-4" />, shortcut: '⌘,', onSelect: () => setLastAction('Settings') },
      ],
    },
    {
      heading: 'Actions',
      items: [
        { id: 'new', label: 'New document', icon: <Plus className="h-4 w-4" />, shortcut: '⌘N', onSelect: () => setLastAction('New document') },
        { id: 'share', label: 'Share page', icon: <Share2 className="h-4 w-4" />, onSelect: () => setLastAction('Share') },
        { id: 'export', label: 'Export as PDF', icon: <FileText className="h-4 w-4" />, onSelect: () => setLastAction('Export') },
        { id: 'delete', label: 'Delete', icon: <Trash2 className="h-4 w-4" />, onSelect: () => setLastAction('Delete'), disabled: true },
      ],
    },
    {
      heading: 'Preferences',
      items: [
        { id: 'dark', label: 'Toggle dark mode', icon: <Moon className="h-4 w-4" />, shortcut: '⌘D', onSelect: () => setLastAction('Dark mode') },
        { id: 'logout', label: 'Log out', icon: <LogOut className="h-4 w-4" />, onSelect: () => setLastAction('Logout') },
      ],
    },
  ]

  return (
    <DocsPage
      category="15 · overlay"
      title="Command palette"
      slug="command-palette"
      description="Spotlight-style command palette with fuzzy search, keyboard navigation, grouped actions, and spring animations. Built on cmdk."
    >
      <DocsSection title="Live demo">
        <DemoCard className="flex-col gap-4">
          <div className="text-center">
            <Button onClick={() => setOpen(true)}>
              Open Command Palette
            </Button>
            <p className="mt-3 text-xs text-white/40">
              or press{' '}
              <kbd className="rounded border border-white/10 bg-white/5 px-1.5 py-0.5 font-mono text-[10px]">
                ⌘K
              </kbd>
            </p>
          </div>

          {lastAction && (
            <p className="text-center text-sm text-white/50">
              Last action:{' '}
              <span className="font-medium text-emerald-400">{lastAction}</span>
            </p>
          )}

          <CommandPalette
            open={open}
            onOpenChange={setOpen}
            groups={groups}
          />
        </DemoCard>
      </DocsSection>

      <DocsSection title="Usage">
        <CodeBlock code={SNIPPET} language="tsx" />
      </DocsSection>

      <DocsSection title="Props">
        <PropsTable
          props={[
            { name: 'open', type: 'boolean', description: 'Controlled open state.' },
            { name: 'onOpenChange', type: '(open: boolean) => void', description: 'Callback when open state changes.' },
            { name: 'groups', type: 'CommandGroup[]', description: 'Array of command groups ({ heading, items }).' },
            { name: 'placeholder', type: 'string', default: '"Type a command or search…"', description: 'Search input placeholder.' },
            { name: 'shortcut', type: 'string', default: '"k"', description: 'Key for the Cmd/Ctrl+key shortcut.' },
            { name: 'className', type: 'string', description: 'Additional classes for the dialog panel.' },
          ]}
        />
      </DocsSection>

      <DocsSection title="CommandItem">
        <PropsTable
          props={[
            { name: 'id', type: 'string', description: 'Unique identifier.' },
            { name: 'label', type: 'string', description: 'Display label and search target.' },
            { name: 'icon', type: 'ReactNode', description: 'Optional icon.' },
            { name: 'shortcut', type: 'string', description: 'Keyboard shortcut hint.' },
            { name: 'onSelect', type: '() => void', description: 'Callback when selected.' },
            { name: 'disabled', type: 'boolean', default: 'false', description: 'Disable this item.' },
          ]}
        />
      </DocsSection>

      <DocsSection title="Dependencies">
        <div className="flex flex-wrap gap-2">
          {['cmdk', 'framer-motion'].map((d) => (
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
