'use client'

import { HeroAwwwards } from '@/components/bahrawy/hero-awwwards'
import { CodeBlock } from '@/components/showcase/code-block'
import { DocsPage, DocsSection } from '@/components/showcase/docs-page'

const SNIPPET = `import { HeroAwwwards } from '@/components/bahrawy/hero-awwwards'

<HeroAwwwards
  eyebrow="v2.0 · 98 components"
  title="Made to be felt."
  description="Open-source components for makers who give a damn about how something feels."
  primaryCta={{ label: 'Get started', href: '/docs' }}
  secondaryCta={{ label: 'Browse components', href: '/components' }}
  spotlightColors={['#A78BFA', '#22D3EE']}
/>`

export default function HeroAwwwardsDocs() {
  return (
    <DocsPage
      title="Hero Awwwards"
      slug="hero-awwwards"
      description="The big one. Letters cascade in with GSAP rotateX + blur clearance + scale + y, a flowing color gradient runs through the headline forever, a spring-smoothed spotlight follows the cursor, four blurred accent blobs drift in the background, a marquee strip slides in at the bottom. Designed to be the first paint on a landing page and still feel adorable, not loud."
      category="98 · gsap-section"
    >
      <DocsSection
        title="Live demo"
        description="Move the cursor around the hero — the spotlight follows. Reload to see the letter cascade again."
      >
        <p className="text-xs text-white/40">↓ the hero</p>
      </DocsSection>

      <HeroAwwwards
        eyebrow="v2.0 · 98 components"
        title="Made to be felt."
        description="Open-source components for makers who give a damn about how something feels. Drop one in, tune it, ship the same day."
        primaryCta={{ label: 'Get started' }}
        secondaryCta={{ label: 'Browse components' }}
      />

      <div className="h-24" aria-hidden />

      <DocsSection title="Usage">
        <CodeBlock code={SNIPPET} language="tsx" />
      </DocsSection>

      <DocsSection title="How the motion works">
        <ul className="grid gap-2 sm:grid-cols-2">
          {[
            ['Letter cascade', 'GSAP timeline sets every letter to { autoAlpha: 0, y: 70, scale: 0.7, rotateX: 55°, filter: blur(12px), transformOrigin: bottom }, then tweens to rest with stagger 30 ms and power4 ease.'],
            ['Flowing gradient', 'A 6-stop linear gradient sits behind the text via background-clip: text, with background-size 220% 100%. A 12s linear keyframe slides the gradient across forever.'],
            ['Mouse spotlight', 'Two motion values track the cursor position 0–1, spring-smoothed, then mapped to CSS percent strings inside two radial-gradient lobes that bake into a single motion template.'],
            ['Drifting blobs', '4 absolutely-positioned blurred circles ride a Framer keyframe array of small x/y offsets — never the same path twice, never repeating exactly.'],
            ['Dot grid', "Fixed `radial-gradient(rgba(255,255,255,0.55) 1px, transparent 1px)` at 28 px tiles, masked to the center so the edges fade out — keeps the type isolated."],
            ['Marquee strip', 'Bottom edge, animated with the `marquee` keyframe + a duration CSS var so consumers can override speed.'],
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
            ['eyebrow', 'Tiny tag above the headline. Renders with a pulsing emerald dot.'],
            ['title', 'Headline string. Split on spaces; each letter animates individually.'],
            ['description', 'Sub-copy below the headline.'],
            ['primaryCta', '{ label, href?, onClick? } — solid white pill.'],
            ['secondaryCta', '{ label, href?, onClick? } — outlined pill on a blur.'],
            ['marquee', 'Words rendered in the bottom strip. Defaults to a tech-stack list.'],
            ['spotlightColors', 'Two hex colors blended around the cursor. Default purple + cyan.'],
            ['className', 'Extra classes on the section.'],
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
          {['gsap', '@gsap/react', 'framer-motion', 'lucide-react'].map((d) => (
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
