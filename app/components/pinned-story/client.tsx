'use client'

import {
  PinnedStory,
  type PinnedStoryStep,
} from '@/components/bahrawy/pinned-story'
import { CodeBlock } from '@/components/showcase/code-block'
import { DocsPage, DocsSection } from '@/components/showcase/docs-page'

const STEPS: PinnedStoryStep[] = [
  {
    id: 'craft',
    eyebrow: 'Craft',
    title: 'Made by hand, every line.',
    body:
      'Every component is composed from first principles — type, rhythm, motion. Nothing arbitrary, nothing borrowed. You inherit the taste, not the noise.',
    image:
      'https://images.unsplash.com/photo-1604871000636-074fa5117945?w=900&q=80&auto=format&fit=crop',
    accent: '#A78BFA',
  },
  {
    id: 'motion',
    eyebrow: 'Motion',
    title: 'Spring into life.',
    body:
      'Spring physics on every interaction — the difference between a UI you use and one you feel. Frame-locked scroll for the cinematic stuff, snappy springs for the rest.',
    image:
      'https://images.unsplash.com/photo-1518806118471-f28b20a1d79d?w=900&q=80&auto=format&fit=crop',
    accent: '#22D3EE',
  },
  {
    id: 'refine',
    eyebrow: 'Refine',
    title: 'Pixel-perfect, by default.',
    body:
      'The polish you would have applied last is the polish you get on day one. Dark- and light-mode considered, focus rings, reduced motion — all wired up.',
    image:
      'https://images.unsplash.com/photo-1493246507139-91e8fad9978e?w=900&q=80&auto=format&fit=crop',
    accent: '#F472B6',
  },
  {
    id: 'ship',
    eyebrow: 'Ship',
    title: 'Ready for the world.',
    body:
      "Production-tested in dark, in light, across browsers, on devices. Move fast without breaking taste — your users won't notice the seams, only the result.",
    image:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=900&q=80&auto=format&fit=crop',
    accent: '#34D399',
  },
]

const SNIPPET = `import { PinnedStory } from '@/components/bahrawy/pinned-story'

const steps = [
  {
    id: 'craft',
    eyebrow: 'Craft',
    title: 'Made by hand, every line.',
    body: 'Every component is composed from first principles.',
    image: '/craft.jpg',
    accent: '#A78BFA',
  },
  // … more steps
]

<PinnedStory steps={steps} stepLength={1.2} accentColor="#A78BFA" />`

export default function PinnedStoryDocs() {
  return (
    <DocsPage
      title="Pinned Story"
      slug="pinned-story"
      description="A cinema-style pinned narrative section. The container pins for the full scroll, and a single scrubbed GSAP timeline orchestrates every layer at once — text crossfade, image swap + parallax pan, giant background number, accent tint, top progress bar, side guide dot."
      category="115 · gsap-section"
    >
      <DocsSection
        title="Live demo"
        description="Scroll into the section — it locks in place and the steps walk through cinematically. Keep scrolling past the last step to release the pin."
      >
        <p className="text-xs text-white/40">↓ scroll in</p>
      </DocsSection>

      {/* The section itself — full-bleed inside the docs column */}
      <PinnedStory steps={STEPS} stepLength={1.2} accentColor="#A78BFA" />

      <div className="h-24" aria-hidden />

      <DocsSection title="Usage">
        <CodeBlock code={SNIPPET} language="tsx" />
      </DocsSection>

      <DocsSection title="Props">
        <ul className="grid gap-2 sm:grid-cols-2">
          {[
            ['steps', 'PinnedStoryStep[] — { id, eyebrow?, title, body, image, accent? }'],
            ['stepLength', 'Pin length per step in viewport heights. Higher = slower per step. Default 1.2.'],
            ['showBigNumber', 'Render the giant 00/01/02… number behind everything. Default true.'],
            ['accentColor', 'Progress bar + side dot + default tint color. Default #A78BFA.'],
            ['className', 'Extra classes on the outer wrapper.'],
          ].map(([n, b]) => (
            <li
              key={n}
              className="rounded-lg border border-white/10 bg-white/[0.02] p-3"
            >
              <code className="font-mono text-xs text-white">{n}</code>
              <p className="mt-1 text-xs text-white/60">{b}</p>
            </li>
          ))}
        </ul>
      </DocsSection>

      <DocsSection title="How the motion works">
        <ul className="grid gap-2 sm:grid-cols-2">
          {[
            ['ScrollTrigger pin', "The outer section's height is N × stepLength × 100vh. Inside, a child div is pinned with `pin: true` so it stays glued to the viewport for the entire scroll range."],
            ['Scrubbed timeline', "A single `gsap.timeline()` is given `scrub: 0.5`, which locks every tween's progress to scroll position with a tiny lag for smoothness."],
            ['Per-step segments', 'Each step gets a 1/N slice of the timeline; the last 40% of the previous slice overlaps with the first 40% of the next for a smooth crossfade.'],
            ['Image parallax', 'During its segment, each image drifts from y -3% to +3% via a `fromTo` with `ease: none`, so it feels like a slow Ken-Burns pan.'],
            ['Progress bar + dot', "Both are driven by tweens placed at timeline position 0 with the timeline's full duration — they map directly to scroll progress."],
            ['Step counter', "A `requestAnimationFrame` loop reads each step's computed opacity and reports whichever is currently highest. No subscription to scroll required."],
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
          {['gsap', '@gsap/react'].map((d) => (
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
