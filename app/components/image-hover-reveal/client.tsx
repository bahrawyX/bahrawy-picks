'use client'

import { useState } from 'react'
import { ArrowUpRight } from 'lucide-react'
import { ImageHoverReveal } from '@/components/bahrawy/image-hover-reveal'
import { CodeBlock } from '@/components/showcase/code-block'
import { DocsPage, DocsSection, DemoCard } from '@/components/showcase/docs-page'
import {
  ControlPanel,
  SelectControl,
  SliderControl,
} from '@/components/showcase/control-panel'

/* ------------------------------------------------------------------ */
/*  Demo content                                                       */
/* ------------------------------------------------------------------ */

const ITEMS = [
  {
    src: 'https://images.unsplash.com/photo-1604871000636-074fa5117945?w=900&q=80&auto=format&fit=crop',
    eyebrow: 'Architecture',
    title: 'Quiet geometry',
    description:
      'Clean light, long shadows. The kind of place that makes a quiet decision look loud.',
  },
  {
    src: 'https://images.unsplash.com/photo-1518806118471-f28b20a1d79d?w=900&q=80&auto=format&fit=crop',
    eyebrow: 'Travel',
    title: 'A way out',
    description:
      'Pack light. Leave early. Take the long road back — the one that bends through the hills.',
  },
  {
    src: 'https://images.unsplash.com/photo-1493246507139-91e8fad9978e?w=900&q=80&auto=format&fit=crop',
    eyebrow: 'Atmosphere',
    title: 'Still water',
    description:
      'A morning where the surface holds the sky perfectly. No wind. No reason to move.',
  },
]

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function ImageHoverRevealDocs() {
  const [align, setAlign] = useState<'left' | 'center'>('left')
  const [scale, setScale] = useState(1.06)
  const [height, setHeight] = useState(360)

  const snippet = `import { ImageHoverReveal } from '@/components/bahrawy/image-hover-reveal'

<ImageHoverReveal
  src="/photo.jpg"
  eyebrow="Architecture"
  title="Quiet geometry"
  description="Clean light, long shadows."
  align="${align}"
  scale={${scale}}
  height={${height}}
/>`

  return (
    <DocsPage
      title="Image Hover Reveal"
      slug="image-hover-reveal"
      description="An image card whose hidden description slides up over the image on hover. The title lifts to make room, the image zooms a touch, and the overlay deepens — all on the same spring."
      category="55 · card"
    >
      <DocsSection
        title="Live demo"
        description="Hover any card. Title lifts, description slides in, image zooms."
      >
        <DemoCard className="min-h-[440px] items-start">
          <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {ITEMS.map((item) => (
              <ImageHoverReveal
                key={item.title}
                src={item.src}
                eyebrow={item.eyebrow}
                title={item.title}
                description={item.description}
                align={align}
                scale={scale}
                height={height}
                cta={
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-white/90 underline-offset-4 hover:underline">
                    View
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </span>
                }
              />
            ))}
          </div>
        </DemoCard>

        <ControlPanel>
          <SelectControl
            label="Align"
            value={align}
            onChange={(v) => setAlign(v as 'left' | 'center')}
            options={[
              { label: 'left', value: 'left' },
              { label: 'center', value: 'center' },
            ]}
          />
          <SliderControl
            label="Zoom"
            value={scale}
            onChange={setScale}
            min={1}
            max={1.2}
            step={0.01}
          />
          <SliderControl
            label="Height"
            value={height}
            onChange={setHeight}
            min={240}
            max={520}
            step={10}
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
            ['src', 'string — image URL.'],
            ['alt', 'string — defaults to title.'],
            ['eyebrow', 'Optional uppercase tag above the title.'],
            ['title', 'Always-visible headline.'],
            ['description', 'Revealed on hover.'],
            ['cta', 'Optional button / link revealed with the description.'],
            ['scale', 'Image zoom on hover. Default 1.06.'],
            ['height', 'Card height in px. Default 360.'],
            ['align', '"left" or "center". Default "left".'],
            ['className', 'Extra classes on the outer card.'],
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
