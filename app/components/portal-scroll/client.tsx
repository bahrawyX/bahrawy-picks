'use client'

import { PortalScroll } from '@/components/bahrawy/portal-scroll'
import { CodeBlock } from '@/components/showcase/code-block'
import { DocsPage, DocsSection } from '@/components/showcase/docs-page'

const SNIPPET = `import { PortalScroll } from '@/components/bahrawy/portal-scroll'

<PortalScroll
  outer={{
    image:
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1600&auto=format&fit=crop&q=80',
    eyebrow: 'Portal Scroll',
    title: 'You\\'re standing outside.',
    subtitle: 'The story is behind the door.',
  }}
  inner={{
    image:
      'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1600&auto=format&fit=crop&q=80',
    eyebrow: 'Step through',
    title: 'Step through.',
    subtitle: 'Everything past this point is what we ship — taste, process, motion.',
  }}
  cta={{ label: 'Browse the work', href: '/components' }}
  scrollLength={3.5}
/>`

export default function PortalScrollDocs() {
  return (
    <DocsPage
      title="Portal Scroll"
      slug="portal-scroll"
      description="A pinned scroll section built around one image: you're standing outside a moody scene, and a circular portal opens in the centre of the viewport and grows until it consumes the screen, revealing a completely different scene inside. Cursor parallax inside the portal sells the depth, the inner headline arrives letter-by-letter, and a single white hairline rides the portal edge — no glow, no accent color."
      category="17 · gsap-section"
    >
      <DocsSection
        title="Live demo"
        description="Scroll to open the portal. Move your cursor around inside the portal to feel the depth parallax."
      >
        <p className="text-xs text-white/40">↓ scroll to step through</p>
      </DocsSection>

      <PortalScroll
        outer={{
          image:
            'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1600&auto=format&fit=crop&q=80',
          eyebrow: 'Portal Scroll',
          title: 'Outside, at dusk.',
          subtitle: 'A door you haven’t walked through yet.',
        }}
        inner={{
          image:
            'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1600&auto=format&fit=crop&q=80',
          eyebrow: 'Inside',
          title: 'Step through.',
          subtitle:
            'A clearer light, a quieter water — the place the work actually lives.',
        }}
        cta={{ label: 'Browse the work' }}
        scrollLength={3.5}
      />

      <div className="h-24" aria-hidden />

      <DocsSection title="Usage">
        <CodeBlock code={SNIPPET} language="tsx" />
      </DocsSection>

      <DocsSection title="How the motion works">
        <ul className="grid gap-2 sm:grid-cols-2">
          {[
            ['One radius drives everything', 'A single GSAP-tweened number `radius.value` (0 → 1) is multiplied by the viewport diagonal/2. Each frame writes both the inner layer\'s `clip-path: circle(Rpx at 50% 50%)` AND the rim element\'s width/height. They never drift out of sync.'],
            ['Cursor parallax inside', "Two layered transforms inside the portal: the background image moves OPPOSITE the cursor (push-back), the headline moves WITH the cursor at 35% magnitude (foreground). Lerped at 0.08/0.10 in a single RAF loop so it stays smooth."],
            ['Letter-by-letter inner title', "Inner `title` is split into chars, each in its own `<span>`. GSAP staggers them by 0.025s once the portal is large enough to fit the line. Non-string titles fall back to a plain `<h2>`."],
            ['Outer fades back', "As the portal grows past 0.18 of the timeline, the outer headline + hint fade to autoAlpha 0 and lift slightly. The outer image also scales 1 → 1.05 across the whole pin so the new scene feels deeper."],
            ['Hairline rim, plain white dot', "The portal edge is a single 1px white outline at 8% opacity — no conic sweep, no glow, no accent color. A 6px white dot rides the perimeter via a rotating wrapper, with a soft drop-shadow for legibility."],
            ['Rim fades at the end', "The rim's `autoAlpha` is tweened from 0 → 1 just after the portal starts opening, then back to 0 once the portal nears full size — so the line doesn't fight the inner headline at the moment of arrival."],
            ['Reduced motion', "The orbit / scan keyframes are gated by `@media (prefers-reduced-motion: reduce)`. The portal still opens via scroll, just without the moving dot."],
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
            ['outer', 'PortalScrollScene — { image, alt?, eyebrow?, title, subtitle? }. The scene visible BEFORE the portal opens.'],
            ['inner', 'PortalScrollScene — same shape. Revealed INSIDE the portal. Title is split letter-by-letter if it\'s a string.'],
            ['cta', '{ label, href?, onClick? } — final call-to-action inside the portal.'],
            ['scrollLength', 'Pin duration in viewport heights. Default 3.5.'],
            ['shape', '\'circle\' | \'diamond\' — portal mask shape. Default \'circle\'.'],
            ['accentColor', 'Optional tint for the portal rim hairline, the orbiting scan dot, and the outer scroll-hint dot. Default plain white — still no glow or shadow.'],
            ['parallaxStrength', 'Max cursor-parallax shift in px inside the portal. Default 28.'],
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
