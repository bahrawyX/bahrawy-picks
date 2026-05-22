'use client'

import { PaperTear } from '@/components/bahrawy/paper-tear'
import { CodeBlock } from '@/components/showcase/code-block'
import { DocsPage, DocsSection } from '@/components/showcase/docs-page'

const SNIPPET = `import { PaperTear } from '@/components/bahrawy/paper-tear'

<PaperTear
  top={{
    eyebrow: 'cover',
    title: 'The summary.',
    subtitle: 'What we put on the case study page.',
    background: 'linear-gradient(180deg, #fafaf7 0%, #ede9dd 100%)',
    accent: '#F472B6',
  }}
  bottom={{
    eyebrow: 'inside',
    title: 'The actual work.',
    subtitle: 'Drafts, dead ends, the version that almost shipped.',
    background: 'linear-gradient(180deg, #0b0f1e 0%, #050810 100%)',
    accent: '#A78BFA',
  }}
  cta={{ label: 'See the process' }}
  seed={7}
/>`

export default function PaperTearDocs() {
  return (
    <DocsPage
      title="Paper Tear"
      slug="paper-tear"
      description="Two sheets of paper stacked on top of each other. As you scroll into the section, the top sheet tears off along a deterministic jagged SVG path and lifts away with a subtle tilt + fade, revealing the bottom sheet underneath. Both halves carry a paper-grain texture so the tear feels physical."
      category="108 · gsap-section"
    >
      <DocsSection
        title="Live demo"
        description="Scroll into the section — the top sheet tears away along an irregular edge to reveal what's underneath."
      >
        <p className="text-xs text-white/40">↓ scroll to tear</p>
      </DocsSection>

      {/*
        Break out of the 90% showcase wrapper so the tear takes the FULL
        main area (everything except the sidebar). The math: parent is
        90% of grandparent, so width 111.12% / -5.55% margins fills the
        grandparent edge-to-edge without overlapping the sidebar.
      */}
      <div className="-mx-[5.55%] w-[111.12%]">
        <PaperTear
          top={{
            eyebrow: 'cover',
            title: 'The summary.',
            subtitle: 'What we put on the case study page.',
            accent: '#F472B6',
          }}
          bottom={{
            eyebrow: 'inside',
            title: 'The actual work.',
            subtitle: 'Drafts, dead ends, the version that almost shipped.',
            accent: '#A78BFA',
          }}
          cta={{ label: 'See the process' }}
          seed={7}
        />
      </div>

      <div className="h-24" aria-hidden />

      <DocsSection title="Usage">
        <CodeBlock code={SNIPPET} language="tsx" />
      </DocsSection>

      <DocsSection title="How the tear works">
        <ul className="grid gap-2 sm:grid-cols-2">
          {[
            ['Seeded jagged path', "A deterministic mulberry32 PRNG generates a sequence of (x, y) points along the horizontal centre. X advances in slightly-random steps; Y has a low-frequency drift plus high-frequency teeth. Same `seed` = same edge every time."],
            ['Two SVG paths from one centreline', "We feed those points into TWO `path(...)` strings: one polygon covering the top half (flat top, jagged bottom), one covering the bottom (jagged top, flat bottom). Both share the exact same centreline so they fit together perfectly."],
            ['clip-path: path()', "Each sheet uses the SVG path string directly as a `clip-path: path('...')` — supported in all modern browsers. No SVG element actually renders the path; it's just used as a mask."],
            ['Lift + tilt + fade', "On scroll, GSAP tweens the top sheet: `y: -110%` (slides up out of view), `rotation: -3.5deg` (subtle tear-away tilt), `autoAlpha: 0.85`. The transform-origin is the bottom centre so the rotation hinges at the tear."],
            ['Bottom reveal', "Bottom content is dimmed (autoAlpha 0.5) at rest. As the top clears 45% of the way through the pin, the bottom content tweens to full opacity + 0 y."],
            ['Paper grain', "A tiny SVG `feTurbulence` filter rendered as a data-URI background image is layered on both halves at low opacity. The top uses `mix-blend-mode: multiply` (paper feel), the bottom uses `overlay` (subtle highlight)."],
            ['CTA arrives last', "Triggered at 78% of the pin so the user reads the bottom title first."],
          ].map(([n, b]) => (
            <li key={n} className="rounded-lg border border-white/10 bg-white/[0.02] p-3">
              <code className="font-mono text-xs text-white">{n}</code>
              <p className="mt-1 text-xs text-white/60">{b}</p>
            </li>
          ))}
        </ul>
      </DocsSection>

      <DocsSection title="Props">
        <ul className="grid gap-2 sm:grid-cols-2">
          {[
            ['top', 'PaperTearScene — { eyebrow?, title, subtitle?, background?, accent? }. The sheet visible at rest.'],
            ['bottom', 'PaperTearScene — same shape. Revealed when the top tears off.'],
            ['cta', '{ label, href?, onClick? } — final call-to-action.'],
            ['scrollLength', 'Pin duration in viewport heights. Default 2.4.'],
            ['detail', 'Number of jagged points along the tear line. Default 36. Higher = finer teeth.'],
            ['jitter', 'Vertical wobble amplitude as fraction of height. Default 0.04 (4%).'],
            ['seed', 'PRNG seed — change to get a different tear shape. Default 1.'],
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
