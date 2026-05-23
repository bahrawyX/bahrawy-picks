'use client'

import { useState } from 'react'
import {
  RevealOnScroll,
  RevealStagger,
  RevealItem,
  type RevealDirection,
} from '@/components/bahrawy/reveal-on-scroll'
import { Button } from '@/components/ui/button'
import { CodeBlock } from '@/components/showcase/code-block'
import {
  ControlLabel,
  ControlsRow,
  DocsPage,
  DocsSection,
} from '@/components/showcase/docs-page'
import { PropsTable } from '@/components/showcase/props-table'

const SNIPPET_SINGLE = `import { RevealOnScroll } from '@/components/bahrawy'

<RevealOnScroll direction="up" distance={24} duration={0.5}>
  <h2>This heading animates in when scrolled into view.</h2>
</RevealOnScroll>`

const SNIPPET_STAGGER = `import { RevealStagger, RevealItem } from '@/components/bahrawy'

<RevealStagger stagger={0.08}>
  {items.map((item) => (
    <RevealItem key={item.id} direction="up">
      <Card>{item.title}</Card>
    </RevealItem>
  ))}
</RevealStagger>`

const FEATURES = [
  { title: 'Lightning Fast', desc: 'Optimized animations that run at 60fps on any device.' },
  { title: 'Accessible', desc: 'Respects prefers-reduced-motion out of the box.' },
  { title: 'Composable', desc: 'Works with any component — just wrap and go.' },
  { title: 'Zero Config', desc: 'Sensible defaults that look great immediately.' },
  { title: 'TypeScript', desc: 'Fully typed props with IntelliSense support.' },
  { title: 'SSR Safe', desc: 'No hydration mismatches with server rendering.' },
]

export default function RevealOnScrollDocs() {
  const [direction, setDirection] = useState<RevealDirection>('up')
  const [key, setKey] = useState(0)

  const replay = () => setKey((k) => k + 1)

  return (
    <DocsPage
      category="14 · motion"
      title="Reveal on scroll"
      slug="reveal-on-scroll"
      description="Animate elements into view when they enter the viewport. Supports directional slides, stagger groups, and one-shot or repeating animations."
    >
      <DocsSection title="Single reveal">
        <div className="flex flex-col gap-4" key={`single-${key}`}>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={replay}>
              Replay
            </Button>
          </div>

          <ControlsRow>
            <ControlLabel>Direction</ControlLabel>
            {(['up', 'down', 'left', 'right'] as const).map((d) => (
              <Button
                key={d}
                size="sm"
                variant={direction === d ? 'default' : 'outline'}
                onClick={() => { setDirection(d); replay() }}
              >
                {d}
              </Button>
            ))}
          </ControlsRow>

          <div className="min-h-[200px] overflow-hidden rounded-xl border border-white/10 bg-black/40 p-8">
            <RevealOnScroll direction={direction} distance={40} once={false}>
              <div className="mx-auto max-w-md rounded-xl border border-white/10 bg-white/[0.03] p-6 text-center">
                <h3 className="text-xl font-bold text-white">Hello, world!</h3>
                <p className="mt-2 text-sm text-white/50">
                  This content reveals with a {direction} slide animation.
                </p>
              </div>
            </RevealOnScroll>
          </div>
        </div>
      </DocsSection>

      <DocsSection title="Stagger group">
        <div className="flex flex-col gap-4" key={`stagger-${key}`}>
          <div className="overflow-hidden rounded-xl border border-white/10 bg-black/40 p-8">
            <RevealStagger stagger={0.1} once={false}>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {FEATURES.map((f) => (
                  <RevealItem key={f.title} direction={direction} distance={30}>
                    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
                      <h4 className="text-sm font-semibold text-white">{f.title}</h4>
                      <p className="mt-1 text-xs text-white/50">{f.desc}</p>
                    </div>
                  </RevealItem>
                ))}
              </div>
            </RevealStagger>
          </div>
        </div>
      </DocsSection>

      <DocsSection title="Single usage">
        <CodeBlock code={SNIPPET_SINGLE} language="tsx" />
      </DocsSection>

      <DocsSection title="Stagger usage">
        <CodeBlock code={SNIPPET_STAGGER} language="tsx" />
      </DocsSection>

      <DocsSection title="RevealOnScroll Props">
        <PropsTable
          props={[
            { name: 'children', type: 'ReactNode', description: 'Content to reveal.' },
            { name: 'direction', type: '"up" | "down" | "left" | "right"', default: '"up"', description: 'Slide direction.' },
            { name: 'distance', type: 'number', default: '24', description: 'Slide distance in pixels.' },
            { name: 'duration', type: 'number', default: '0.5', description: 'Duration in seconds.' },
            { name: 'delay', type: 'number', default: '0', description: 'Delay in seconds.' },
            { name: 'once', type: 'boolean', default: 'true', description: 'Only animate the first time.' },
            { name: 'className', type: 'string', description: 'Additional classes.' },
          ]}
        />
      </DocsSection>

      <DocsSection title="RevealStagger Props">
        <PropsTable
          props={[
            { name: 'children', type: 'ReactNode', description: 'RevealItem children.' },
            { name: 'stagger', type: 'number', default: '0.08', description: 'Delay between each child in seconds.' },
            { name: 'once', type: 'boolean', default: 'true', description: 'Only animate once.' },
            { name: 'className', type: 'string', description: 'Additional classes.' },
          ]}
        />
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
