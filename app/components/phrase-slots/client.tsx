'use client'

import {
  PhraseSlots,
  type PhraseSlotConfig,
} from '@/components/bahrawy/phrase-slots'
import { CodeBlock } from '@/components/showcase/code-block'
import { DocsPage, DocsSection } from '@/components/showcase/docs-page'

const SLOTS: PhraseSlotConfig[] = [
  {
    options: ['We', 'You', 'They', 'I'],
    target: 'We',
  },
  {
    options: ['ship', 'make', 'craft', 'design'],
    target: 'make',
  },
  {
    options: ['interfaces', 'products', 'things', 'apps'],
    target: 'things',
  },
  {
    options: ['users', 'people', 'makers', 'devs'],
    target: 'people',
  },
  {
    options: ['use', 'love', 'feel', 'keep'],
    target: 'feel',
  },
]

const SNIPPET = `import { PhraseSlots } from '@/components/bahrawy/phrase-slots'

const slots = [
  { options: ['We', 'You', 'They', 'I'],              target: 'We' },
  { options: ['ship', 'make', 'craft', 'design'],     target: 'make' },
  { options: ['interfaces', 'products', 'things'],    target: 'things' },
  { options: ['users', 'people', 'makers'],           target: 'people' },
  { options: ['use', 'love', 'feel', 'keep'],         target: 'feel' },
]

<PhraseSlots
  eyebrow="v2.0"
  heading="By the time you finish scrolling,"
  slots={slots}
  description="…you've assembled the line we live by, one word at a time."
  cta={{ label: 'Get started', href: '/docs' }}
  accentColor="#A78BFA"
/>`

export default function PhraseSlotsDocs() {
  return (
    <DocsPage
      title="Phrase Slots"
      slug="phrase-slots"
      description="A slot-machine for words. Each slot is a single-line window over a tall column of candidate words; scroll spins every column through a few cycles and lands on its target — staggered, so the sentence reveals left-to-right. By the end of the section a complete sentence reads across the row and an accent underline draws beneath it."
      category="109 · gsap-section"
    >
      <DocsSection
        title="Live demo"
        description="Scroll into the section — five reels spin and land in sequence to form one sentence."
      >
        <p className="text-xs text-white/40">↓ scroll in</p>
      </DocsSection>

      <PhraseSlots
        eyebrow="v2.0"
        heading="By the time you finish scrolling,"
        slots={SLOTS}
        description="…you've just assembled the line we live by, one word at a time."
        cta={{ label: 'Get started' }}
        accentColor="#A78BFA"
      />

      <div className="h-24" aria-hidden />

      <DocsSection title="Usage">
        <CodeBlock code={SNIPPET} language="tsx" />
      </DocsSection>

      <DocsSection title="How the motion works">
        <ul className="grid gap-2 sm:grid-cols-2">
          {[
            ['Pin', "Section is `(scrollLength + 1) × 100vh` tall. Inner pins for `scrollLength` viewports of scroll; the extra +1 is release room so the next section doesn't jump-cut."],
            ['Cycled columns', "Each slot's column stacks its options THREE times. That gives the reel something to spin past before it stops — you can see candidate words flick through before the target lands."],
            ['Target offset', "Per slot: `offsetIndex = (CYCLES − 1) × N + targetIdx`. The column translates by `−offsetIndex × slotHeight` so the target word lands in the slot window during the FINAL cycle."],
            ['Staggered landing', "Slot i lands at scroll progress `0.20 + (i / (slots.length − 1)) × 0.64`. With 5 slots that's 0.20 / 0.36 / 0.52 / 0.68 / 0.84 — a clean left-to-right reveal."],
            ['Slot-reel feel', "Every column tween uses `ease: power3.out`. Fast at the start, slowing as it lands — the same curve a real slot reel decelerates with."],
            ['Underline + reveal', 'Once the last slot lands, an accent underline tween draws across the full row, then the description and CTA fade in.'],
            ['Edge mask', "Each slot window has a top/bottom mask-image fade so words tick into view from a haze rather than hard-clipping at the edges."],
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
            ['slots', "PhraseSlotConfig[] — each `{ options, target }`. `target` must appear in `options`. Left-to-right reads as the final sentence."],
            ['eyebrow', 'Tiny tag above the heading. Renders with a pulse-coloured dot.'],
            ['heading', 'Short headline above the slots — sets up the sentence.'],
            ['description', 'Sub-copy that fades in once the sentence lands.'],
            ['cta', '{ label, href?, onClick? } — final call-to-action.'],
            ['scrollLength', 'Pin duration in viewport heights. Default 3.5.'],
            ['accentColor', 'Underline + eyebrow dot color. Default #A78BFA.'],
            ['slotHeight', 'Slot window height in px (also drives font-size). Default 96.'],
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
