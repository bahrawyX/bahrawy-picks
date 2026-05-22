'use client'

import { OrigamiUnfold } from '@/components/bahrawy/origami-unfold'
import { CodeBlock } from '@/components/showcase/code-block'
import { DocsPage, DocsSection } from '@/components/showcase/docs-page'

const SNIPPET = `import { OrigamiUnfold } from '@/components/bahrawy/origami-unfold'

<OrigamiUnfold
  eyebrow="A folded note"
  panels={[
    { eyebrow: 'one',   title: 'Pencil first.',    body: '…' },
    { eyebrow: 'two',   title: 'Then the cage.',   body: '…' },
    { eyebrow: 'three', title: 'Move it in code.', body: '…' },
    { eyebrow: 'four',  title: 'Last 10% is 90%.', body: '…' },
  ]}
  finalHeading="Four moves, in order."
  cta={{ label: 'Read the case study' }}
/>`

export default function OrigamiUnfoldDocs() {
  return (
    <DocsPage
      title="Origami Unfold"
      slug="origami-unfold"
      description="A folded paper square unfolds in 3D as you scroll — four flaps hinge outward sequentially (top → right → bottom → left), revealing four content quadrants under a final headline."
      category="122 · gsap-section"
    >
      <DocsSection title="Live demo" description="Scroll into the section — each flap unfolds outward in turn, revealing the panel beneath. The final heading lands when the paper is fully open.">
        <p className="text-xs text-white/40">↓ scroll to unfold</p>
      </DocsSection>

      <OrigamiUnfold
        eyebrow="A folded note"
        panels={[
          { eyebrow: 'one',   title: 'Pencil first.',     body: 'Every motion in the library started life as twenty bad pencil drawings.', accent: '#F472B6' },
          { eyebrow: 'two',   title: 'Then the cage.',    body: 'Layout-first wireframes nail rhythm and density. No colors yet.', accent: '#A78BFA' },
          { eyebrow: 'three', title: 'Move it in code.',  body: 'A live prototype turns the static into something with springs.', accent: '#22D3EE' },
          { eyebrow: 'four',  title: 'Last 10 % is 90 %.', body: 'Easing curves, accent colors, copy. The polish that makes good work feel made.', accent: '#34D399' },
        ]}
        finalHeading="Four moves, in order."
        cta={{ label: 'Read the case study' }}
        accentColor="#22D3EE"
      />

      <div className="h-32" aria-hidden />

      <DocsSection title="Usage"><CodeBlock code={SNIPPET} language="tsx" /></DocsSection>

      <DocsSection title="Props">
        <ul className="grid gap-2 sm:grid-cols-2">
          {[
            ['panels', 'Exactly 4 OrigamiPanel { eyebrow?, title, body?, accent? }. Order: topLeft, topRight, bottomRight, bottomLeft.'],
            ['eyebrow', 'Tiny tag at the top of the section.'],
            ['finalHeading', 'Headline that fades in above the unfolded sheet at the end.'],
            ['cta', '{ label, href?, onClick? }'],
            ['scrollLength', 'Pin length in viewport heights. Default 3.5.'],
            ['paperColor', 'Paper background color. Default #fafaf7.'],
            ['accentColor', 'Ring + hinge accent. Default #22D3EE.'],
            ['className', 'Extra classes on the outer wrapper.'],
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
          {['gsap', '@gsap/react', 'lucide-react'].map((d) => (
            <code key={d} className="rounded-md border border-white/10 bg-white/[0.04] px-2 py-1 font-mono text-xs text-white/80">{d}</code>
          ))}
        </div>
      </DocsSection>
    </DocsPage>
  )
}
