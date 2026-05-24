'use client'

import { CinemaReel, type CinemaReelFrame } from '@/components/bahrawy/cinema-reel'
import { CodeBlock } from '@/components/showcase/code-block'
import { DocsPage, DocsSection } from '@/components/showcase/docs-page'

const FRAMES: CinemaReelFrame[] = [
  {
    id: 'open',
    image:
      'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=900&q=80&auto=format&fit=crop',
    eyebrow: 'Reel 01',
    title: 'Open on a wide.',
    body: 'Establish the room. Slow push-in.',
    accent: '#FBBF24',
  },
  {
    id: 'cu',
    image:
      'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=900&q=80&auto=format&fit=crop',
    eyebrow: 'Reel 02',
    title: 'Cut to a close-up.',
    body: 'Eyes. The thing the room was about.',
    accent: '#F472B6',
  },
  {
    id: 'object',
    image:
      'https://images.unsplash.com/photo-1499428665502-503f6c608263?w=900&q=80&auto=format&fit=crop',
    eyebrow: 'Reel 03',
    title: 'Insert the object.',
    body: 'A detail you only get with a film camera.',
    accent: '#22D3EE',
  },
  {
    id: 'motion',
    image:
      'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=900&q=80&auto=format&fit=crop',
    eyebrow: 'Reel 04',
    title: 'Dolly across.',
    body: 'Movement that wasn\'t in the shot list.',
    accent: '#A78BFA',
  },
  {
    id: 'street',
    image:
      'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=900&q=80&auto=format&fit=crop',
    eyebrow: 'Reel 05',
    title: 'Cut to street.',
    body: 'Different light, same story.',
    accent: '#34D399',
  },
  {
    id: 'close',
    image:
      'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=900&q=80&auto=format&fit=crop',
    eyebrow: 'Reel 06',
    title: 'Close on a hand.',
    body: 'Almost the end. Hold here.',
    accent: '#FBBF24',
  },
  {
    id: 'end',
    image:
      'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=900&q=80&auto=format&fit=crop',
    eyebrow: 'Reel 07',
    title: 'Fade to black.',
    body: 'Title card. Music swells.',
    accent: '#F472B6',
  },
]

const SNIPPET = `import { CinemaReel } from '@/components/bahrawy/cinema-reel'

const frames = [
  { id: 'open',   image: '/01.jpg', eyebrow: 'Reel 01', title: 'Open on a wide.' },
  { id: 'cu',     image: '/02.jpg', eyebrow: 'Reel 02', title: 'Cut to a close-up.' },
  // …
]

<CinemaReel
  eyebrow="A short film, scrolled"
  frames={frames}
  cta={{ label: 'See the cut' }}
  scrollLength={4}
  accentColor="#FBBF24"
/>`

export default function CinemaReelDocs() {
  return (
    <DocsPage
      title="Cinema Reel"
      slug="cinema-reel"
      description="A pinned scroll section that unspools a horizontal film strip from vertical scroll. Reel hubs spin at the edges, sprocket holes line the top and bottom of the strip, the centered frame pops forward + brightens, neighbours dim — exactly like watching a real projector pull frames past a gate."
      category="152 · gsap-section"
    >
      <DocsSection
        title="Live demo"
        description="Scroll into the section — the strip unspools horizontally, frames pass through the center playhead, reel hubs spin at the edges."
      >
        <p className="text-xs text-white/40">↓ scroll to unspool</p>
      </DocsSection>

      <CinemaReel
        eyebrow="A short film, scrolled"
        frames={FRAMES}
        cta={{ label: 'See the cut' }}
        scrollLength={4}
        accentColor="#FBBF24"
      />

      <div className="h-32" aria-hidden />

      <DocsSection title="Usage">
        <CodeBlock code={SNIPPET} language="tsx" />
      </DocsSection>

      <DocsSection title="How the motion works">
        <ul className="grid gap-2 sm:grid-cols-2">
          {[
            ['Vertical scroll → horizontal strip', "ScrollTrigger.onUpdate writes a normalized `progress` (0–1) into a ref. A single RAF loop reads it each frame and writes `translate3d(translateX, 0, 0)` on the strip so the active frame's center maps to viewport.width / 2."],
            ['Frame focus envelope', "Each frame gets a per-frame scale + opacity based on `|i − activeIndex|`. The active frame scales to 1, opacity 1; neighbours drop quickly. Reads as a real projector pulling the next frame into the gate."],
            ['Sprocket holes', "Top and bottom sprocket rows are separate strips with their own holes, sharing the strip's transform so the holes line up perfectly with the frames regardless of resize."],
            ['Reel hubs', "Two oversized reel discs sit just off-screen at the left and right edges, rotating proportional to scroll progress × 360 × frame count. Rotates fast enough to read as 'spinning,' slow enough to track the strip motion."],
            ['Center playhead', "A thin vertical accent line marks the gate position, plus a small `now playing` chip floating just above. Sits at z-index above the strip so it's always visible."],
            ['Resize-safe layout', "Frame width is declared in vh units; the RAF loop reads the live viewport dimensions each frame, so resizing the window while pinned keeps frames centered correctly."],
            ['Smooth scrub', "ScrollTrigger scrub of 0.35 plus the per-frame envelope means even fast scrolls produce a continuous motion — no jumping between frames."],
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
            ['frames', 'CinemaReelFrame[] — each { id, image?, eyebrow?, title, body?, accent? }. Order = traversal order left-to-right.'],
            ['eyebrow', 'Tiny tag rendered at the top of the section.'],
            ['cta', '{ label, href?, onClick? } — final call-to-action that fades in at the end.'],
            ['scrollLength', 'Pin duration in viewport heights. Default 4.'],
            ['frameWidth', 'Width of each frame in vh. Default 50.'],
            ['accentColor', 'Sprocket + playhead + reel-hub glow. Default #FBBF24.'],
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
