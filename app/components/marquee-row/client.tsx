'use client'

import { useState } from 'react'
import { MarqueeRow } from '@/components/bahrawy/marquee-row'
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

const SNIPPET = `import { MarqueeRow } from '@/components/bahrawy'

<MarqueeRow speed={25} pauseOnHover>
  {logos.map((logo) => (
    <img key={logo.alt} src={logo.src} alt={logo.alt} className="h-8" />
  ))}
</MarqueeRow>`

const LOGOS = [
  { name: 'React', color: 'text-cyan-400' },
  { name: 'Next.js', color: 'text-white' },
  { name: 'TypeScript', color: 'text-blue-400' },
  { name: 'Tailwind', color: 'text-sky-400' },
  { name: 'Framer', color: 'text-purple-400' },
  { name: 'Vercel', color: 'text-white' },
  { name: 'Prisma', color: 'text-teal-400' },
  { name: 'Stripe', color: 'text-violet-400' },
]

const TESTIMONIALS = [
  { text: 'Incredible DX. Shipped 3x faster.', author: 'Sarah K.' },
  { text: 'The best component library I have used.', author: 'Mike R.' },
  { text: 'Clean code, beautiful animations.', author: 'Aya M.' },
  { text: 'Perfect for production apps.', author: 'James L.' },
  { text: 'My team loves the dark theme.', author: 'Priya S.' },
]

export default function MarqueeRowDocs() {
  const [speed, setSpeed] = useState(30)
  const [reverse, setReverse] = useState(false)
  const [pauseOnHover, setPauseOnHover] = useState(true)

  return (
    <DocsPage
      category="12 · motion"
      title="Marquee row"
      slug="marquee-row"
      description="Infinite scrolling marquee that duplicates children for seamless looping. Pure CSS animation — no JS loop. Pauses on hover with configurable speed and direction."
    >
      <DocsSection title="Logo strip">
        <DemoCard className="flex-col gap-6">
          <MarqueeRow speed={speed} reverse={reverse} pauseOnHover={pauseOnHover}>
            {LOGOS.map((logo) => (
              <div
                key={logo.name}
                className="flex h-12 items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-5"
              >
                <span className={`text-sm font-semibold ${logo.color}`}>
                  {logo.name}
                </span>
              </div>
            ))}
          </MarqueeRow>
        </DemoCard>

        <ControlsRow>
          <ControlLabel>Speed</ControlLabel>
          {[15, 30, 60].map((s) => (
            <Button
              key={s}
              size="sm"
              variant={speed === s ? 'default' : 'outline'}
              onClick={() => setSpeed(s)}
            >
              {s}s
            </Button>
          ))}
          <span className="mx-1 h-5 w-px bg-white/10" />
          <Button
            size="sm"
            variant={reverse ? 'default' : 'outline'}
            onClick={() => setReverse((v) => !v)}
          >
            Reverse
          </Button>
          <Button
            size="sm"
            variant={pauseOnHover ? 'default' : 'outline'}
            onClick={() => setPauseOnHover((v) => !v)}
          >
            Pause on hover
          </Button>
        </ControlsRow>
      </DocsSection>

      <DocsSection title="Testimonials">
        <DemoCard>
          <div className="flex w-full flex-col gap-4">
            <MarqueeRow speed={35} pauseOnHover>
              {TESTIMONIALS.map((t) => (
                <div
                  key={t.author}
                  className="w-64 shrink-0 rounded-xl border border-white/10 bg-white/[0.03] p-4"
                >
                  <p className="text-sm text-white/70">&ldquo;{t.text}&rdquo;</p>
                  <p className="mt-2 text-xs font-medium text-white/40">— {t.author}</p>
                </div>
              ))}
            </MarqueeRow>
            <MarqueeRow speed={35} reverse pauseOnHover>
              {[...TESTIMONIALS].reverse().map((t) => (
                <div
                  key={t.author}
                  className="w-64 shrink-0 rounded-xl border border-white/10 bg-white/[0.03] p-4"
                >
                  <p className="text-sm text-white/70">&ldquo;{t.text}&rdquo;</p>
                  <p className="mt-2 text-xs font-medium text-white/40">— {t.author}</p>
                </div>
              ))}
            </MarqueeRow>
          </div>
        </DemoCard>
      </DocsSection>

      <DocsSection title="Usage">
        <CodeBlock code={SNIPPET} language="tsx" />
      </DocsSection>

      <DocsSection title="Props">
        <PropsTable
          props={[
            { name: 'children', type: 'ReactNode', description: 'Items to scroll (duplicated automatically for seamless loop).' },
            { name: 'speed', type: 'number', default: '30', description: 'Duration of one full loop in seconds.' },
            { name: 'reverse', type: 'boolean', default: 'false', description: 'Reverse scroll direction (left-to-right).' },
            { name: 'pauseOnHover', type: 'boolean', default: 'true', description: 'Pause the marquee when hovered.' },
            { name: 'gap', type: 'number', default: '24', description: 'Gap between items in pixels.' },
            { name: 'className', type: 'string', description: 'Additional classes for the wrapper.' },
          ]}
        />
      </DocsSection>

      <DocsSection title="Dependencies">
        <div className="flex flex-wrap gap-2">
          <span className="text-sm text-white/40">No external dependencies.</span>
        </div>
      </DocsSection>
    </DocsPage>
  )
}
