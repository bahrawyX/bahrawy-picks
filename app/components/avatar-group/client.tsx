'use client'

import { useState } from 'react'
import { AvatarGroup, type AvatarItem } from '@/components/bahrawy/avatar-group'
import { CodeBlock } from '@/components/showcase/code-block'
import { DocsPage, DocsSection, DemoCard } from '@/components/showcase/docs-page'
import {
  ControlPanel,
  SliderControl,
} from '@/components/showcase/control-panel'

const AVATARS: AvatarItem[] = [
  { name: 'Abdelrahman', src: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&q=80&auto=format&fit=crop' },
  { name: 'Sara', src: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&q=80&auto=format&fit=crop' },
  { name: 'Leo' },
  { name: 'Mira', src: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=120&q=80&auto=format&fit=crop' },
  { name: 'Ben' },
  { name: 'Zoe' },
  { name: 'Kai' },
  { name: 'Reem', src: 'https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?w=120&q=80&auto=format&fit=crop' },
]

export default function AvatarGroupDocs() {
  const [max, setMax] = useState(4)
  const [size, setSize] = useState(40)
  const [overlap, setOverlap] = useState(12)

  const snippet = `import { AvatarGroup } from '@/components/bahrawy/avatar-group'

const avatars = [
  { name: 'Abdelrahman', src: '/a.jpg' },
  { name: 'Sara', src: '/b.jpg' },
  { name: 'Leo' },
  { name: 'Mira', src: '/c.jpg' },
]

<AvatarGroup avatars={avatars} max={${max}} size={${size}} overlap={${overlap}} />`

  return (
    <DocsPage
      title="Avatar Group"
      slug="avatar-group"
      description="Stacked overlapping avatars that spread apart on hover. Overflow members past `max` collapse into a +N chip at the end. Image avatars and initial-based fallbacks both supported."
      category="66 · ui"
    >
      <DocsSection title="Live demo" description="Hover the group to see the avatars spread apart.">
        <DemoCard className="min-h-[200px]">
          <div className="flex flex-col items-center gap-6">
            <AvatarGroup avatars={AVATARS} max={max} size={size} overlap={overlap} />
            <p className="text-xs text-white/40">{AVATARS.length} members total</p>
          </div>
        </DemoCard>

        <ControlPanel>
          <SliderControl label="Max" value={max} onChange={setMax} min={1} max={8} step={1} />
          <SliderControl label="Size" value={size} onChange={setSize} min={24} max={56} step={2} unit="px" />
          <SliderControl label="Overlap" value={overlap} onChange={setOverlap} min={4} max={24} step={1} unit="px" />
        </ControlPanel>
      </DocsSection>

      <DocsSection title="Usage">
        <CodeBlock code={snippet} language="tsx" />
      </DocsSection>

      <DocsSection title="Props">
        <ul className="grid gap-2 sm:grid-cols-2">
          {[
            ['avatars', 'AvatarItem[] — { src?, name, fallback? }'],
            ['max', 'Max visible avatars. Default 4.'],
            ['size', 'Avatar diameter in px. Default 36.'],
            ['overlap', 'Px each avatar overlaps the next. Default 12.'],
            ['spread', 'Extra px each avatar moves on hover. Default 4.'],
            ['className', 'Extra classes on the wrapper.'],
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
          <code className="rounded-md border border-white/10 bg-white/[0.04] px-2 py-1 font-mono text-xs text-white/80">framer-motion</code>
        </div>
      </DocsSection>
    </DocsPage>
  )
}
