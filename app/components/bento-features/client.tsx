'use client'

import { Boxes, Gauge, Layers, Palette, Shield, Sparkles } from 'lucide-react'
import { BentoFeatures, type BentoFeatureItem } from '@/components/bahrawy/bento-features'
import { CodeBlock } from '@/components/showcase/code-block'
import { DocsPage, DocsSection } from '@/components/showcase/docs-page'

const ITEMS: BentoFeatureItem[] = [
  {
    eyebrow: 'Motion',
    title: 'Spring physics on every interaction.',
    body: 'No CSS-flat hover states. Every button, every card, every transition rides a spring.',
    icon: <Sparkles className="h-5 w-5" />,
    accent: 'purple',
    span: 2,
  },
  {
    eyebrow: 'Performance',
    title: 'Fast by default.',
    body: 'GPU-only transforms, no layout reads inside scroll loops, lazy mount where it counts.',
    icon: <Gauge className="h-5 w-5" />,
    accent: 'cyan',
  },
  {
    eyebrow: 'Theming',
    title: 'One token, every variant.',
    body: 'Pass an accentColor and the whole component takes on your brand.',
    icon: <Palette className="h-5 w-5" />,
    accent: 'pink',
  },
  {
    eyebrow: 'Accessibility',
    title: 'Keyboard + screen reader, day one.',
    body: 'Focus rings, ARIA, reduced-motion. No retrofit.',
    icon: <Shield className="h-5 w-5" />,
    accent: 'emerald',
  },
  {
    eyebrow: 'Composability',
    title: 'Plays well with anything.',
    body: 'Built on shadcn + Radix primitives. Drop into any React + Next.js project.',
    icon: <Layers className="h-5 w-5" />,
    accent: 'amber',
    span: 2,
  },
  {
    eyebrow: 'Library',
    title: '95 components and counting.',
    body: 'Forms, motion, sections, scroll, data — the long tail covered.',
    icon: <Boxes className="h-5 w-5" />,
    accent: 'neutral',
  },
]

export default function BentoFeaturesDocs() {
  return (
    <DocsPage
      title="Bento Features"
      slug="bento-features"
      description="A feature bento grid section with mixed-size cards. Each card scroll-reveals with a small stagger; accent gradients give the grid a hint of color without going loud."
      category="112 · section"
    >
      <DocsSection title="Live demo">
        <div className="overflow-hidden rounded-2xl border border-white/10">
          <BentoFeatures
            eyebrow="What's inside"
            heading="A library built for makers."
            description="Six things we obsess over, so you don't have to."
            items={ITEMS}
          />
        </div>
      </DocsSection>

      <DocsSection title="Usage">
        <CodeBlock code={`<BentoFeatures heading="A library built for makers." items={items} />`} language="tsx" />
      </DocsSection>
    </DocsPage>
  )
}
