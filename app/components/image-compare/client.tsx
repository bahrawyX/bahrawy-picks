'use client'

import { ImageCompare } from '@/components/bahrawy/image-compare'
import { CodeBlock } from '@/components/showcase/code-block'
import { DocsPage, DocsSection, DemoCard } from '@/components/showcase/docs-page'

const SNIPPET = `import { ImageCompare } from '@/components/bahrawy/image-compare'

<ImageCompare
  before="/before.jpg"
  after="/after.jpg"
  beforeLabel="Before"
  afterLabel="After"
  defaultPosition={0.5}
  height={400}
/>`

// Use Unsplash photos that compare nicely. The "before" is a warmer/
// vintage variation, the "after" is the same scene in a cooler / more
// modern grade — Unsplash transforms via `?...` are fine for a demo.
const BEFORE_1 = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80&auto=format&sat=-100'
const AFTER_1 = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80&auto=format'

const BEFORE_2 = 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=1200&q=80&auto=format&blur=10'
const AFTER_2 = 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=1200&q=80&auto=format'

export default function ImageCompareDocs() {
  return (
    <DocsPage
      title="Image Compare"
      slug="image-compare"
      description="The drag-to-wipe before/after slider every redesign post uses. Two images stacked; the top image is clipped via CSS clip-path at the handle's position so the bottom one shows through. Click or drag anywhere in the frame to move the handle. Keyboard support: ←/→ nudge by 4%, Shift for 16%, Home/End slam to 0/100. Horizontal or vertical."
      category="72 · decoration"
    >
      <DocsSection title="Color grade — desaturated → full color">
        <DemoCard className="min-h-[460px]">
          <div className="w-full max-w-3xl">
            <ImageCompare
              before={BEFORE_1}
              after={AFTER_1}
              beforeLabel="Before"
              afterLabel="After"
              height={400}
            />
          </div>
        </DemoCard>
      </DocsSection>

      <DocsSection title="Blurred → sharp">
        <DemoCard className="min-h-[420px]">
          <div className="w-full max-w-3xl">
            <ImageCompare
              before={BEFORE_2}
              after={AFTER_2}
              beforeLabel="Blurry"
              afterLabel="Sharp"
              defaultPosition={0.35}
              height={360}
            />
          </div>
        </DemoCard>
      </DocsSection>

      <DocsSection title="Vertical wipe">
        <DemoCard className="min-h-[460px]">
          <div className="w-full max-w-3xl">
            <ImageCompare
              before={BEFORE_1}
              after={AFTER_1}
              beforeLabel="Original"
              afterLabel="Graded"
              direction="vertical"
              defaultPosition={0.4}
              height={400}
            />
          </div>
        </DemoCard>
      </DocsSection>

      <DocsSection title="Usage">
        <CodeBlock code={SNIPPET} language="tsx" />
      </DocsSection>

      <DocsSection title="Props">
        <ul className="grid gap-2 sm:grid-cols-2">
          {[
            ['before / after', 'URLs of the two images.'],
            ['beforeLabel / afterLabel', 'Optional pill labels rendered over each image.'],
            ['direction', '"horizontal" (default) or "vertical".'],
            ['defaultPosition', 'Initial handle position 0..1. Default 0.5.'],
            ['height / width', 'Container dimensions. Default height=360, width="100%".'],
            ['disabled', 'Disable interaction; handle still renders.'],
            ['className', 'Extra classes on the outer frame.'],
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
            <code key={d} className="rounded-md border border-white/10 bg-white/[0.04] px-2 py-1 font-mono text-xs text-white/80">
              {d}
            </code>
          ))}
        </div>
      </DocsSection>
    </DocsPage>
  )
}
