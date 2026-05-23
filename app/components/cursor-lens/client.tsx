'use client'

import { CursorLens } from '@/components/bahrawy/cursor-lens'
import { CodeBlock } from '@/components/showcase/code-block'
import { DocsPage, DocsSection } from '@/components/showcase/docs-page'

const SNIPPET = `import { CursorLens } from '@/components/bahrawy/cursor-lens'

<CursorLens
  outer={{
    image: '/above.jpg',
    eyebrow: 'above',
    title: 'Still.',
    subtitle: 'The version they put on the website.',
  }}
  inner={{
    image: '/below.jpg',
    eyebrow: 'below',
    title: 'Alive.',
    subtitle: 'The version that actually ships.',
  }}
  cta={{ label: 'See the work', href: '/components' }}
  size={360}
  softness={0.35}
  zoom={1.1}
  accentColor="#A78BFA"
/>`

export default function CursorLensDocs() {
  return (
    <DocsPage
      title="Cursor Lens"
      slug="cursor-lens"
      description="An invisible cursor mask that reveals a different scene underneath as you hover. No ring, no chrome — just a soft radial fade so the boundary between the two scenes is impossible to spot. The inner image is gently magnified at the cursor focal point, the inner text is drawn crisp on top, and a click pins the lens at that spot so you can step back and look."
      category="109 · interactive"
    >
      <DocsSection
        title="Live demo"
        description="Move your cursor over the image. There's no visible mask — the second scene just bleeds through wherever you hover. Click anywhere to pin the lens at that spot, click again to unpin."
      >
        <p className="text-xs text-white/40">↓ hover to reveal</p>
      </DocsSection>

      <CursorLens
        outer={{
          image:
            'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1800&q=80&auto=format&fit=crop',
          eyebrow: 'above',
          title: 'Still.',
          subtitle: 'The version they put on the website.',
        }}
        inner={{
          image:
            'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1800&q=80&auto=format&fit=crop',
          eyebrow: 'below',
          title: 'Alive.',
          subtitle: 'The version that actually ships.',
        }}
        cta={{ label: 'See the work' }}
        size={360}
        softness={0.35}
        zoom={1.1}
        accentColor="#A78BFA"
      />

      <DocsSection title="With a visible ring">
        <p className="text-xs text-white/40">
          Sometimes you want the chrome — pass <code className="font-mono text-white/70">showRing</code> for a faint accent halo at the lens edge.
        </p>
      </DocsSection>

      <CursorLens
        outer={{
          image:
            'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=1800&q=80&auto=format&fit=crop',
          eyebrow: 'public',
          title: 'Calm seas.',
        }}
        inner={{
          image:
            'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=1800&q=80&auto=format&fit=crop',
          eyebrow: 'private',
          title: 'Hold on.',
        }}
        size={320}
        softness={0.2}
        zoom={1.15}
        showRing
        accentColor="#22D3EE"
        aspect="3 / 2"
      />

      <DocsSection title="Usage">
        <CodeBlock code={SNIPPET} language="tsx" />
      </DocsSection>

      <DocsSection title="How the motion works">
        <ul className="grid gap-2 sm:grid-cols-2">
          {[
            ['Invisible mask', "The inner layer is masked with `radial-gradient(circle Rpx at Xpx Ypx, black 0%, black (1−softness)*100%, transparent 100%)`. Softness 0 gives a hard circle; 1 gives a pure fade. Default 0.35 — solid through 65%, then a smooth edge."],
            ['Spring-lerped cursor', "Pointer events write a target (x, y) into a ref; a single RAF loop lerps the current position toward the target each frame (default 22%). Feels responsive without feeling rigid."],
            ['Crisp text over magnified image', "Inside the lens, the image layer scales by `zoom` (default 1.1) with `transform-origin` at the cursor — so the focal point of the cursor is what gets enlarged. The text layer sits above it WITHOUT scaling, so headlines stay crisp wherever the cursor lands."],
            ['Click-to-lock', "`pointerdown` toggles a `locked` flag. While locked, pointer-move stops updating the target — the lens stays put. A small accent dot appears at the lock position so it's clear it's pinned. Click again to release."],
            ['Reduced motion', "If `prefers-reduced-motion: reduce` is set, lerp is forced to 1 (instant follow) and zoom is clamped to 1 (no magnification). The reveal still works, just calmer."],
            ['Touch + pointer-unified', "Uses Pointer Events, so mouse, pen, and touch all drive the same code path. On touch: tap to position the lens, drag to move it, tap again to unpin."],
            ['No ring by default', "The whole point is the lens feels invisible. Pass `showRing` if you want a faint halo for affordance. The lock dot still appears when pinned regardless of ring."],
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
            ['outer', 'CursorLensScene — { image?, alt?, eyebrow?, title?, subtitle? }. Always-visible scene.'],
            ['inner', 'CursorLensScene — same shape. Revealed under the cursor lens.'],
            ['cta', '{ label, href?, onClick? } — optional CTA rendered BELOW the canvas (always clickable).'],
            ['size', 'Lens diameter in px. Default 360.'],
            ['softness', 'Edge softness 0–1. 0 = hard circle, 1 = full fade. Default 0.35.'],
            ['zoom', 'Inner image magnification at the cursor. Default 1.1.'],
            ['clickToLock', 'Click to pin/unpin the lens. Default true.'],
            ['lerp', 'Cursor lerp factor 0–1. Higher = snappier. Default 0.22.'],
            ['showRing', 'Show a faint accent ring at the lens edge. Default false.'],
            ['accentColor', 'Hint dot / lock dot / ring color. Default #A78BFA.'],
            ['aspect', 'CSS aspect-ratio for the canvas. Default "16 / 9".'],
            ['hint', "Tiny instruction shown until first hover. Default 'Hover to reveal'."],
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
          {['lucide-react'].map((d) => (
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
