'use client'

import { CassetteTape } from '@/components/bahrawy/cassette-tape'
import { CodeBlock } from '@/components/showcase/code-block'
import { DocsPage, DocsSection, DemoCard } from '@/components/showcase/docs-page'

const SNIPPET = `import { CassetteTape } from '@/components/bahrawy/cassette-tape'

<CassetteTape
  sideA={{ title: 'Summer Set',  artist: 'Bahrawy', runtime: '23:14' }}
  sideB={{ title: 'After Hours', artist: 'Bahrawy', runtime: '24:02' }}
  defaultPlaying
/>`

export default function CassetteTapeDocs() {
  return (
    <DocsPage
      title="Cassette Tape"
      slug="cassette-tape"
      description="A vintage audio cassette — rotating reels, tape line between them, label with side / title / duration, play-pause button, and a 3D flip between A-side and B-side. Pure CSS shell + a tiny SVG for the tape curve."
      category="151 · card"
    >
      <DocsSection title="Live demo · press play, then flip">
        <DemoCard className="min-h-[400px]">
          <div className="flex w-full max-w-[440px] items-center justify-center py-8">
            <CassetteTape
              sideA={{ title: 'Summer Set', artist: 'Bahrawy', runtime: '23:14' }}
              sideB={{ title: 'After Hours', artist: 'Bahrawy', runtime: '24:02' }}
              defaultPlaying
            />
          </div>
        </DemoCard>
      </DocsSection>

      <DocsSection title="Usage"><CodeBlock code={SNIPPET} language="tsx" /></DocsSection>

      <DocsSection title="Props">
        <ul className="grid gap-2 sm:grid-cols-2">
          {[
            ['sideA / sideB', 'CassetteSide — { title, artist?, runtime? }. Two halves of the tape.'],
            ['shellColor', 'Cassette body colour. Default warm purple-black plastic.'],
            ['labelColor', 'Label background. Default vintage cream.'],
            ['defaultPlaying', 'Initial play state. Default false.'],
            ['spinSpeed', 'Seconds per reel revolution. Default 3.'],
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
        <div className="text-xs text-white/55">No external runtime dependencies — just React + CSS.</div>
      </DocsSection>
    </DocsPage>
  )
}
