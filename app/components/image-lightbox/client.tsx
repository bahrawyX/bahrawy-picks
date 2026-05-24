'use client'

import { ImageLightbox } from '@/components/bahrawy/image-lightbox'
import { CodeBlock } from '@/components/showcase/code-block'
import { DocsPage, DocsSection, DemoCard } from '@/components/showcase/docs-page'

const SNIPPET = `import { ImageLightbox } from '@/components/bahrawy/image-lightbox'

<ImageLightbox
  images={[
    { src: '/photos/1.jpg', caption: 'Sunset, Mt. Fuji' },
    { src: '/photos/2.jpg', caption: 'Kyoto at dawn' },
    { src: '/photos/3.jpg', caption: 'Tokyo skyline' },
  ]}
/>`

// Curated Unsplash landscapes (1200w hero + 220w thumb)
function pic(id: string, caption: string) {
  return {
    src: `https://images.unsplash.com/photo-${id}?w=1200&auto=format&fit=crop&q=80`,
    thumb: `https://images.unsplash.com/photo-${id}?w=220&auto=format&fit=crop&q=70`,
    caption,
    alt: caption,
  }
}

const PHOTOS = [
  pic('1506744038136-46273834b3fb', 'Mountain reflection at dusk'),
  pic('1500382017468-9049fed747ef', 'Golden field in autumn'),
  pic('1501785888041-af3ef285b470', 'Lake under aurora'),
  pic('1470071459604-3b5ec3a7fe05', 'Fog rolling over hills'),
  pic('1465056836041-7f43ac27dcb5', 'Coastal cliffs'),
  pic('1418065460487-3e41a6c84dc5', 'Desert dunes at sunrise'),
  pic('1469474968028-56623f02e42e', 'Tropical lagoon overhead'),
  pic('1472214103451-9374bd1c798e', 'Forest road at dawn'),
]

const PORTRAITS = [
  pic('1500530855697-b586d89ba3ee', 'Mountain pines'),
  pic('1493246507139-91e8fad9978e', 'Snow ridge'),
  pic('1455218873509-8097305ee378', 'River through canyon'),
]

export default function ImageLightboxDocs() {
  return (
    <DocsPage
      title="Image Lightbox"
      slug="image-lightbox"
      description="Click-to-zoom gallery with Apple aesthetics — vibrancy `backdrop-blur-2xl` backdrop, glassy control pills for prev/next/close/counter, swipe-to-navigate on touch (with velocity), arrow-key navigation, Esc to close, optional caption pill. Grid thumbnails hover-lift and scale-zoom on press. Drives itself by default or wire `open` / `index` for full control."
      category="161 · overlay"
    >
      <DocsSection title="8-photo gallery (click any → lightbox)">
        <DemoCard className="min-h-[420px] items-start py-8">
          <div className="w-full max-w-3xl">
            <ImageLightbox images={PHOTOS} thumbSize={130} gap={8} />
          </div>
        </DemoCard>
      </DocsSection>

      <DocsSection title="Compact 3-photo strip">
        <DemoCard className="min-h-[280px] items-start py-8">
          <div className="w-full max-w-md">
            <ImageLightbox images={PORTRAITS} thumbSize={100} gap={6} />
          </div>
        </DemoCard>
      </DocsSection>

      <DocsSection title="Usage">
        <CodeBlock code={SNIPPET} language="tsx" />
      </DocsSection>

      <DocsSection title="Props">
        <ul className="grid gap-2 sm:grid-cols-2">
          {[
            ['images', 'LightboxImage[] — { src, caption?, alt?, thumb? }.'],
            ['showGrid', 'Render the built-in thumbnail grid. Default true.'],
            ['thumbSize', 'Square thumbnail size in px. Default 110.'],
            ['gap', 'Grid gap in px. Default 6.'],
            ['open / onOpenChange', 'Controlled open state.'],
            ['index / onIndexChange', 'Controlled active image index.'],
            ['className', 'Extra classes on the outer grid wrapper.'],
          ].map(([n, b]) => (
            <li key={n} className="rounded-lg border border-white/10 bg-white/[0.02] p-3">
              <code className="font-mono text-xs text-white">{n}</code>
              <p className="mt-1 text-xs text-white/60">{b}</p>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-xs text-white/45">
          Keyboard: <code className="font-mono">→</code> next ·{' '}
          <code className="font-mono">←</code> prev ·{' '}
          <code className="font-mono">Esc</code> close · Swipe on touch.
        </p>
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
