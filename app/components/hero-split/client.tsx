'use client'

import { HeroSplit, type HeroSplitItem } from '@/components/bahrawy/hero-split'
import { CodeBlock } from '@/components/showcase/code-block'
import { DocsPage, DocsSection } from '@/components/showcase/docs-page'

/* ------------------------------------------------------------------ */
/*  Demo content                                                       */
/* ------------------------------------------------------------------ */

const LEFT: HeroSplitItem[] = [
  {
    image: 'https://images.unsplash.com/photo-1604871000636-074fa5117945?w=900&q=80&auto=format&fit=crop',
    eyebrow: '01 · Craft',
    caption: 'Made by hand. Every line.',
  },
  {
    image: 'https://images.unsplash.com/photo-1518806118471-f28b20a1d79d?w=900&q=80&auto=format&fit=crop',
    eyebrow: '02 · Motion',
    caption: 'Spring into life.',
  },
  {
    image: 'https://images.unsplash.com/photo-1493246507139-91e8fad9978e?w=900&q=80&auto=format&fit=crop',
    eyebrow: '03 · Refine',
    caption: 'Pixel-perfect.',
  },
  {
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=900&q=80&auto=format&fit=crop',
    eyebrow: '04 · Ship',
    caption: 'Ready for the world.',
  },
]

const RIGHT: HeroSplitItem[] = [
  {
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=900&q=80&auto=format&fit=crop',
    eyebrow: 'A · Open',
    caption: 'Copy. Paste. Own.',
  },
  {
    image: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=900&q=80&auto=format&fit=crop',
    eyebrow: 'B · Quiet',
    caption: 'No noise. No bloat.',
  },
  {
    image: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=900&q=80&auto=format&fit=crop',
    eyebrow: 'C · Composed',
    caption: 'Plays well with others.',
  },
  {
    image: 'https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?w=900&q=80&auto=format&fit=crop',
    eyebrow: 'D · Felt',
    caption: 'Built to be felt.',
  },
]

const SNIPPET = `import { HeroSplit } from '@/components/bahrawy/hero-split'

const left = [
  { image: '/01.jpg', eyebrow: '01 · Craft', caption: 'Made by hand.' },
  // …
]
const right = [
  { image: '/A.jpg', eyebrow: 'A · Open', caption: 'Copy. Paste. Own.' },
  // …
]

<HeroSplit
  left={left}
  right={right}
  scrollLength={3}
  reveal={0.7}
  revealEyebrow="Two views"
  revealTitle="Two views. One library."
  revealDescription="One side talks craft, the other talks shipping."
  revealPrimaryCta={{ label: 'Get started' }}
  revealSecondaryCta={{ label: 'Browse components' }}
/>`

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function HeroSplitDocs() {
  return (
    <DocsPage
      title="Hero Split"
      slug="hero-split"
      description={`A pinned hero with two 50/50 columns of stacked content that scroll in opposite Y directions — left up, right down. Past \`reveal\` (default 0.7) of the pin, a centred card fades in over both halves with a backdrop blur — the "meeting" moment.`}
      category="108 · gsap-section"
    >
      <DocsSection
        title="Live demo"
        description="Scroll into the section — left column slides up, right slides down, and a centred reveal lands over the top once you're three-quarters through."
      >
        <p className="text-xs text-white/40">↓ scroll in</p>
      </DocsSection>

      <HeroSplit
        left={LEFT}
        right={RIGHT}
        scrollLength={3}
        reveal={0.7}
        revealEyebrow="Two views"
        revealTitle="Two views. One library."
        revealDescription="One side talks craft, the other talks shipping. The whole thing is yours to copy."
        revealPrimaryCta={{ label: 'Get started' }}
        revealSecondaryCta={{ label: 'Browse components' }}
      />

      <div className="h-24" aria-hidden />

      <DocsSection title="Usage">
        <CodeBlock code={SNIPPET} language="tsx" />
      </DocsSection>

      <DocsSection title="How the motion works">
        <ul className="grid gap-2 sm:grid-cols-2">
          {[
            ['Pin', 'Section is `(scrollLength + 1) * 100vh` tall. Inner div pins for `scrollLength` viewports; the extra vh is release room.'],
            ['Opposite-direction Y', "Both columns are 200% tall (twice the viewport). Left tweens `yPercent: 0 → -50` (slides up by one viewport). Right tweens `yPercent: -50 → 0` (starts one viewport up, slides down to meet). Net effect: they pass each other on the Y axis."],
            ['Continuous scrub', '`ScrollTrigger.scrub: 0.35` locks both tweens to scroll. No auto-play, just real scroll → real motion.'],
            ['Reveal trigger', 'Two tweens scheduled at timeline position `reveal` (default 0.7): a backdrop-blur dimmer fades to 1, the centre card fades + scales 0.94 → 1 + lifts y 14 → 0.'],
            ['Per-tile composition', "Each column item is a 48vh-tall image card with an eyebrow + caption laid over a from-black gradient. Easy to swap for any content shape — replace `SplitTile` if you want quotes or stat blocks instead."],
          ].map(([n, b]) => (
            <li key={n} className="rounded-lg border border-white/10 bg-white/[0.02] p-3">
              <code className="font-mono text-xs text-white">{n}</code>
              <p className="mt-1 whitespace-pre-line text-xs text-white/60">{b}</p>
            </li>
          ))}
        </ul>
      </DocsSection>

      <DocsSection title="Props">
        <ul className="grid gap-2 sm:grid-cols-2">
          {[
            ['left', 'HeroSplitItem[] — { image, alt?, eyebrow?, caption }'],
            ['right', 'HeroSplitItem[] — same shape'],
            ['scrollLength', 'Pin duration in viewport heights. Default 3.'],
            ['reveal', 'Scroll progress (0–1) at which the centre card appears. Default 0.7.'],
            ['revealEyebrow', 'Tag above the reveal title.'],
            ['revealTitle', 'Reveal headline.'],
            ['revealDescription', 'Reveal sub-copy.'],
            ['revealPrimaryCta', '{ label, href?, onClick? }'],
            ['revealSecondaryCta', '{ label, href?, onClick? }'],
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
