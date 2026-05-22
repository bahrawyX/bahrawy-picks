'use client'

import { AuroraSky, type AuroraVerse } from '@/components/bahrawy/aurora-sky'
import { CodeBlock } from '@/components/showcase/code-block'
import { DocsPage, DocsSection } from '@/components/showcase/docs-page'

const VERSES: AuroraVerse[] = [
  { id: 'a', eyebrow: 'i.',   title: 'It starts as a hum,',   body: 'a green flicker just above the trees, easy to miss if you blink.' },
  { id: 'b', eyebrow: 'ii.',  title: 'then a long ribbon',     body: 'pulls across the whole sky — slow, certain, in no hurry.' },
  { id: 'c', eyebrow: 'iii.', title: 'until you notice',       body: 'every star you thought you knew has shifted, and so have you.' },
]

const SNIPPET = `import { AuroraSky } from '@/components/bahrawy/aurora-sky'

const verses = [
  { id: 'a', eyebrow: 'i.',   title: 'It starts as a hum,',   body: '…' },
  { id: 'b', eyebrow: 'ii.',  title: 'then a long ribbon',     body: '…' },
  { id: 'c', eyebrow: 'iii.', title: 'until you notice',       body: '…' },
]

<AuroraSky
  eyebrow="Borealis"
  verses={verses}
  cta={{ label: 'Look up' }}
  ribbonColors={['#34D399', '#A78BFA', '#F472B6']}
/>`

export default function AuroraSkyDocs() {
  return (
    <DocsPage
      title="Aurora Sky"
      slug="aurora-sky"
      description="A pinned scroll section that paints an aurora borealis across a starfield. Three undulating SVG ribbons draw themselves left-to-right via animated stroke-dashoffset; stars twinkle behind; a verse panel crossfades in the lower half."
      category="124 · gsap-section"
    >
      <DocsSection title="Live demo" description="Scroll into the section — ribbons unfurl, stars twinkle, the verse crossfades line by line.">
        <p className="text-xs text-white/40">↓ scroll · let the lights paint</p>
      </DocsSection>

      <AuroraSky
        eyebrow="Borealis"
        verses={VERSES}
        cta={{ label: 'Look up' }}
        ribbonColors={['#34D399', '#A78BFA', '#F472B6']}
      />

      <div className="h-32" aria-hidden />

      <DocsSection title="Usage"><CodeBlock code={SNIPPET} language="tsx" /></DocsSection>

      <DocsSection title="Props">
        <ul className="grid gap-2 sm:grid-cols-2">
          {[
            ['verses', 'AuroraVerse[] — { id, eyebrow?, title, body? }. Crossfaded in the lower half as the ribbons paint.'],
            ['eyebrow', 'Tiny tag at the top of the section.'],
            ['cta', '{ label, href?, onClick? }'],
            ['scrollLength', 'Pin length in viewport heights. Default 3.5.'],
            ['ribbonColors', '[c1, c2, c3] — colors for the three ribbons. Default green / violet / magenta.'],
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
