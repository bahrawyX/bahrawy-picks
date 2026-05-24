'use client'

import {
  Camera,
  Heart,
  MessageSquare,
  Music,
  Settings,
  Share2,
  Sparkles,
} from 'lucide-react'
import { OrbitalMenu } from '@/components/bahrawy/orbital-menu'
import { CodeBlock } from '@/components/showcase/code-block'
import { DocsPage, DocsSection, DemoCard } from '@/components/showcase/docs-page'

const SNIPPET = `import { OrbitalMenu } from '@/components/bahrawy/orbital-menu'
import { Camera, Heart, MessageSquare, Share2 } from 'lucide-react'

<OrbitalMenu
  direction="top"
  radius={110}
  items={[
    { id: 'cam',   icon: <Camera />,       label: 'Photo',   onClick: () => {} },
    { id: 'msg',   icon: <MessageSquare />, label: 'Message', onClick: () => {} },
    { id: 'heart', icon: <Heart />,        label: 'Like',    onClick: () => {} },
    { id: 'share', icon: <Share2 />,       label: 'Share',   onClick: () => {} },
  ]}
/>`

export default function OrbitalMenuDocs() {
  return (
    <DocsPage
      title="Orbital Menu"
      slug="orbital-menu"
      description="A FAB-style trigger button that fans its menu items outward along an arc on click. Per-item spring stagger, configurable direction (top / right / bottom / left / circle), click outside or Escape to close."
      category="154 · navigation"
    >
      <DocsSection title="Live demo · top arc" description="Click the button — items spring out in a half-circle.">
        <DemoCard className="min-h-[360px]">
          <div className="flex items-end justify-center pb-12 pt-32">
            <OrbitalMenu
              direction="top"
              radius={110}
              accentColor="#A78BFA"
              items={[
                { id: 'cam',   icon: <Camera className="h-5 w-5" />,        label: 'Photo' },
                { id: 'msg',   icon: <MessageSquare className="h-5 w-5" />, label: 'Message' },
                { id: 'heart', icon: <Heart className="h-5 w-5" />,         label: 'Like',     accent: '#F472B6' },
                { id: 'share', icon: <Share2 className="h-5 w-5" />,        label: 'Share' },
              ]}
            />
          </div>
        </DemoCard>
      </DocsSection>

      <DocsSection title="Full circle" description="direction=&quot;circle&quot; — items orbit a full 360°.">
        <DemoCard className="min-h-[360px]">
          <div className="flex items-center justify-center py-12">
            <OrbitalMenu
              direction="circle"
              radius={100}
              accentColor="#22D3EE"
              items={[
                { id: 'a', icon: <Sparkles className="h-5 w-5" />,      label: 'Magic' },
                { id: 'b', icon: <Music className="h-5 w-5" />,         label: 'Music' },
                { id: 'c', icon: <Heart className="h-5 w-5" />,         label: 'Like' },
                { id: 'd', icon: <Share2 className="h-5 w-5" />,        label: 'Share' },
                { id: 'e', icon: <MessageSquare className="h-5 w-5" />, label: 'Message' },
                { id: 'f', icon: <Settings className="h-5 w-5" />,      label: 'Settings' },
              ]}
            />
          </div>
        </DemoCard>
      </DocsSection>

      <DocsSection title="Usage"><CodeBlock code={SNIPPET} language="tsx" /></DocsSection>

      <DocsSection title="Props">
        <ul className="grid gap-2 sm:grid-cols-2">
          {[
            ['items', 'OrbitalMenuItem[] — { id, icon, label?, onClick?, accent? }. Order = arc order.'],
            ['direction', "'top' (default), 'right', 'bottom', 'left', or 'circle' for the full 360°."],
            ['radius', 'Arc radius in px. Default 110.'],
            ['triggerIcon', 'Icon shown on the trigger. Default <Plus />.'],
            ['triggerLabel', 'aria-label for the trigger.'],
            ['accentColor', 'Trigger + item ring color. Default #A78BFA.'],
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
          {['framer-motion', 'lucide-react'].map((d) => (
            <code key={d} className="rounded-md border border-white/10 bg-white/[0.04] px-2 py-1 font-mono text-xs text-white/80">{d}</code>
          ))}
        </div>
      </DocsSection>
    </DocsPage>
  )
}
