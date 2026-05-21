'use client'

import { HeroAwwwards } from '@/components/bahrawy/hero-awwwards'
import { CodeBlock } from '@/components/showcase/code-block'
import { DocsPage, DocsSection } from '@/components/showcase/docs-page'

const SNIPPET = `import { HeroAwwwards } from '@/components/bahrawy/hero-awwwards'

<HeroAwwwards
  eyebrow="v2.0 · 98 components"
  // Pass an array of strings for a multi-line curtain reveal.
  title={['Made for the', 'people who', 'give a damn.']}
  description="Open-source components for makers who care how something feels — not just how it looks."
  primaryCta={{ label: 'Get started', href: '/docs' }}
  secondaryCta={{ label: 'Browse components' }}
  accentColor="#A78BFA"
/>`

export default function HeroAwwwardsDocs() {
  return (
    <DocsPage
      title="Hero Awwwards"
      slug="hero-awwwards"
      description="A restrained, type-first landing hero. One GSAP timeline reveals each line of the headline by raising a clip-path mask from the baseline — letters appear in place rather than flying around. A single accent glow + spring-smoothed cursor spotlight do all the background work. No rainbow, no disco."
      category="98 · gsap-section"
    >
      <DocsSection
        title="Live demo"
        description="Reload the page to replay the curtain reveal. Move the cursor — a soft spotlight follows."
      >
        <p className="text-xs text-white/40">↓ the hero</p>
      </DocsSection>

      <HeroAwwwards
        eyebrow="v2.0 · 98 components"
        title={['Made for the', 'people who', 'give a damn.']}
        description="Open-source components for makers who care how something feels — not just how it looks. Drop one in, tune it, ship the same day."
        primaryCta={{ label: 'Get started' }}
        secondaryCta={{ label: 'Browse components' }}
        accentColor="#A78BFA"
      />

      <div className="h-24" aria-hidden />

      <DocsSection title="Usage">
        <CodeBlock code={SNIPPET} language="tsx" />
      </DocsSection>

      <DocsSection title="Design rationale">
        <ul className="grid gap-2 sm:grid-cols-2">
          {[
            ['Type is the hero', "The headline is the largest, loudest thing on the page. Anton at clamp(72px, 13vw, 220px), tight letter-spacing, multi-line — gives the words real weight."],
            ['One signature animation', "Each line of the headline reveals by sliding a `clipPath: inset(0 0 100% 0)` → `inset(0 0 0 0)` mask up from the baseline. Letters appear in place. No rotateX, no scaling, no blur — calmer and more confident."],
            ['Restrained color', "A single duotone gradient brushes across the headline forever (white → accent → white). Eye-friendly. No 6-stop rainbow."],
            ['Less stacked background', "One corner glow in the top-right + one spring-smoothed cursor spotlight. No blob disco, no dot grid, no marquee. The type carries the page."],
            ['A landing line', "A thin horizontal rule draws under the headline once it finishes — a tiny punctuation mark that ties the eyebrow + headline + subline together."],
            ['Scroll indicator', "Bottom-center, a 'Scroll' label and a short accent bar that breathes up and down a vertical line. Hint without the whole marquee."],
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
            ['eyebrow', 'Tiny uppercase tag above the headline. Pairs with a thin accent bar.'],
            ['title', 'string | string[] — pass an array for multi-line, each line reveals as its own mask sweep.'],
            ['description', 'Sub-copy under the headline. Max-width pinned.'],
            ['primaryCta', '{ label, href?, onClick? } — solid pill with an arrow that nudges on hover.'],
            ['secondaryCta', '{ label, href?, onClick? } — text-only link, no pill, no border.'],
            ['accentColor', 'Single accent color used in the glow, rule, scroll bar, and the duotone brush on the headline. Default #A78BFA.'],
            ['className', 'Extra classes on the outer section.'],
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
