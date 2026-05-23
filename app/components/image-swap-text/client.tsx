'use client'

import { useState } from 'react'
import {
  ImageSwapText,
  type ImageSwapItem,
} from '@/components/bahrawy/image-swap-text'
import { CodeBlock } from '@/components/showcase/code-block'
import { DocsPage, DocsSection, DemoCard } from '@/components/showcase/docs-page'
import {
  ControlPanel,
  SliderControl,
} from '@/components/showcase/control-panel'

/* ------------------------------------------------------------------ */
/*  Demo content                                                       */
/* ------------------------------------------------------------------ */

const ITEMS: ImageSwapItem[] = [
  {
    src: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80&auto=format&fit=crop',
    label: 'Faffa',
  },
  {
    src: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80&auto=format&fit=crop',
    label: 'Koka',
  },
  {
    src: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80&auto=format&fit=crop',
    label: 'Lume',
  },
  {
    src: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&q=80&auto=format&fit=crop',
    label: 'Vela',
  },
  {
    src: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=200&q=80&auto=format&fit=crop',
    label: 'Nori',
  },
  {
    src: 'https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?w=200&q=80&auto=format&fit=crop',
    label: 'Soto',
  },
  {
    src: 'https://images.unsplash.com/photo-1492447166138-50c3889fccb1?w=200&q=80&auto=format&fit=crop',
    label: 'Pyra',
  },
  {
    src: 'https://images.unsplash.com/photo-1521146764736-56c929d59c83?w=200&q=80&auto=format&fit=crop',
    label: 'Echo',
  },
]

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function ImageSwapTextDocs() {
  const [thumbSize, setThumbSize] = useState(56)

  const snippet = `import { ImageSwapText } from '@/components/bahrawy/image-swap-text'

const items = [
  { src: '/avatars/1.jpg', label: 'Faffa' },
  { src: '/avatars/2.jpg', label: 'Koka' },
  { src: '/avatars/3.jpg', label: 'Lume' },
]

<ImageSwapText
  items={items}
  defaultLabel="Bahrawy"
  accentColor="#EF2B2D"
  thumbSize={${thumbSize}}
/>`

  return (
    <DocsPage
      title="Image Swap Text"
      slug="image-swap-text"
      description="A row of small avatars sitting above a giant headline. Hover an avatar and the headline swaps to that avatar's word in red — old letters fan outward like a paper-fan while new letters pop in from the middle. A red disc with an arrow follows the hovered thumbnail."
      category="68 · motion"
    >
      <DocsSection
        title="Live demo"
        description="Hover any of the avatars above the headline. Move along the row and watch the tracker glide between them."
      >
        <DemoCard className="min-h-[500px] items-center overflow-hidden bg-black">
          <ImageSwapText
            items={ITEMS}
            defaultLabel="Bahrawy"
            accentColor="#EF2B2D"
            thumbSize={thumbSize}
          />
        </DemoCard>

        <ControlPanel>
          <SliderControl
            label="Thumb"
            value={thumbSize}
            onChange={setThumbSize}
            min={40}
            max={80}
            step={2}
            unit="px"
          />
        </ControlPanel>
      </DocsSection>

      <DocsSection title="Usage">
        <CodeBlock code={snippet} language="tsx" />
      </DocsSection>

      <DocsSection title="Props">
        <ul className="grid gap-2 sm:grid-cols-2">
          {[
            ['items', 'ImageSwapItem[] — each `{ src, label, alt? }` pairs an avatar with the word that replaces the headline on hover.'],
            ['defaultLabel', 'The headline displayed when no avatar is hovered.'],
            ['accentColor', 'Color used for the active word + tracker disc. Default `#EF2B2D` (red).'],
            ['thumbSize', 'Avatar size in px. Default 56.'],
            ['fontFamily', 'Optional CSS font-family override for the headline.'],
            ['className', 'Extra classes on the outer wrapper.'],
          ].map(([name, body]) => (
            <li
              key={name}
              className="rounded-lg border border-white/10 bg-white/[0.02] p-3"
            >
              <code className="font-mono text-xs text-white">{name}</code>
              <p className="mt-1 text-xs text-white/60">{body}</p>
            </li>
          ))}
        </ul>
      </DocsSection>

      <DocsSection title="Dependencies">
        <div className="flex flex-wrap gap-2">
          {['framer-motion', 'lucide-react'].map((d) => (
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
