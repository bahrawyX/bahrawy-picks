'use client'

import { HeroScrollGrow } from '@/components/bahrawy/hero-scroll-grow'
import { CodeBlock } from '@/components/showcase/code-block'
import { DocsPage, DocsSection } from '@/components/showcase/docs-page'

const SNIPPET = `import { HeroScrollGrow } from '@/components/bahrawy/hero-scroll-grow'

<HeroScrollGrow
  eyebrow="v2.0"
  title="See it in motion."
  description="Scroll to bring the picture into full focus."
  primaryCta={{ label: 'Get started', href: '/docs' }}
  secondaryCta={{ label: 'Browse components' }}
  image="/hero.jpg"
  scrollLength={2.5}
  overlayCaption="Built for makers who give a damn."
/>`

export default function HeroScrollGrowDocs() {
  return (
    <DocsPage
      title="Hero Scroll Grow"
      slug="hero-scroll-grow"
      description="A pinned hero. Text sits over an inset image card; as the user scrolls, a single GSAP timeline grows the image from 72% to full-bleed, dissolves its border-radius, fades the hero text out, and (optionally) brings in an overlay caption. Everything is locked to scroll via ScrollTrigger.scrub."
      category="117 · gsap-section"
    >
      <DocsSection
        title="Live demo"
        description="Scroll into the hero — the image card opens out and the text dissolves on the way to full-bleed."
      >
        <p className="text-xs text-white/40">↓ the hero</p>
      </DocsSection>

      <HeroScrollGrow
        eyebrow="v2.0 · 99 components"
        title="See it in motion."
        description="A library of beautifully crafted React components. Scroll to bring the picture into full focus."
        primaryCta={{ label: 'Get started' }}
        secondaryCta={{ label: 'Browse components' }}
        image="https://images.unsplash.com/photo-1493246507139-91e8fad9978e?w=1600&q=80&auto=format&fit=crop"
        alt="A still lake reflecting the surrounding mountains at dawn."
        overlayCaption="Built for makers who give a damn."
        scrollLength={2.5}
      />

      <div className="h-24" aria-hidden />

      <DocsSection title="Usage">
        <CodeBlock code={SNIPPET} language="tsx" />
      </DocsSection>

      <DocsSection title="How the motion works">
        <ul className="grid gap-2 sm:grid-cols-2">
          {[
            ['Pin', 'The section is `scrollLength + 1` viewport heights tall. The inner div is pinned for `scrollLength` viewports; the remaining 1 vh is "release room" so the next section eases in instead of jump-cutting.'],
            ['Image grow', "Image wrap starts at `scale: initialScale` (default 0.72), `borderRadius: initialRadius` (default 28 px). A single tween animates both to `scale: 1, borderRadius: 0` across the full pin."],
            ['Text dissolve', 'Hero text container tween starts at 55% of the timeline and runs to 85% — `autoAlpha: 1 → 0, y: 0 → -32px`. By the time the image is full-bleed, the hero text is out of the way.'],
            ['Overlay caption', 'If `overlayCaption` is provided, it fades + lifts in from 75% to 100% — appears once the image takes the page.'],
            ['Scrub', '`ScrollTrigger.scrub: 0.4` locks every tween to actual scroll position with a tiny lag for smoothness. No auto-play, no jankiness.'],
            ['Background gradient', 'A built-in top-to-bottom gradient over the image keeps the hero text legible at every scale step.'],
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
            ['eyebrow', 'Small tag above the headline.'],
            ['title', 'Main headline (ReactNode).'],
            ['description', 'Sub-copy under the headline.'],
            ['primaryCta', '{ label, href?, onClick? } — solid white pill.'],
            ['secondaryCta', '{ label, href?, onClick? } — outlined pill.'],
            ['image', 'Image src. Should be wide and dramatic — it ends up full-bleed.'],
            ['alt', 'Image alt text.'],
            ['scrollLength', 'Pin duration in viewport heights. Default 2.5.'],
            ['initialScale', 'Starting scale of the image card. Default 0.72.'],
            ['initialRadius', 'Starting border-radius in px. Default 28.'],
            ['overlayCaption', 'Optional caption that fades over the full-bleed image.'],
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
