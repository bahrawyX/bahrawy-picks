'use client'

import { LiquidLetters } from '@/components/bahrawy/liquid-letters'
import { CodeBlock } from '@/components/showcase/code-block'
import { DocsPage, DocsSection } from '@/components/showcase/docs-page'

const SNIPPET = `import { LiquidLetters } from '@/components/bahrawy/liquid-letters'

<LiquidLetters
  color="#ffffff"
  background="#06070a"
  blur={8}
  blobRadius={36}
>
  FLUID
</LiquidLetters>`

export default function LiquidLettersDocs() {
  return (
    <DocsPage
      title="Liquid Letters"
      slug="liquid-letters"
      description="A typography effect that makes letters look like blobs of liquid. The classic CSS-goo SVG filter (Gaussian blur + alpha-tightening colour matrix) is applied to both the SVG text AND a cursor-following blob — so the blob bonds with whichever letters it touches and pulls them into a single fluid shape."
      category="127 · type effect"
    >
      <DocsSection
        title="Live demo"
        description="Move your cursor across the canvas. A blob follows you and bonds with the letters it passes — the way two drops of water merge when they touch."
      >
        <p className="text-xs text-white/40">↓ move the goo</p>
      </DocsSection>

      <LiquidLetters>FLUID</LiquidLetters>

      <DocsSection title="With color">
        <p className="text-xs text-white/40">Same effect with a tinted blob.</p>
      </DocsSection>

      <LiquidLetters color="#22D3EE" background="#0a0814" blur={10} blobRadius={42} fontSize="clamp(64px, 12vw, 180px)">
        OOZE
      </LiquidLetters>

      <DocsSection title="Usage">
        <CodeBlock code={SNIPPET} language="tsx" />
      </DocsSection>

      <DocsSection title="How the goo works">
        <ul className="grid gap-2 sm:grid-cols-2">
          {[
            ['SVG filter, two passes', "The whole scene is rendered inside one `<g>` with a single SVG filter applied to its root. The filter runs `feGaussianBlur` (smears shapes into each other) then `feColorMatrix` (re-sharpens alpha)."],
            ['Alpha tightening', "The colour matrix multiplies the alpha channel by ~22 and subtracts 10. Anywhere the blurred shapes overlap stays above the threshold and renders fully opaque; anywhere they don't gets clipped to transparent. The boundary becomes a smooth isoline — a curved bridge between adjacent shapes."],
            ['Letters + blob, same filter', "Both the SVG `<text>` and a `<circle>` (the cursor blob) sit inside the filtered group. They participate equally, so the blob can BOND with letters — pulling them into a single fluid silhouette when close."],
            ['Cursor lerp', "Pointer events update a target position; a single RAF loop lerps `cx` and `cy` of the blob toward that target. Touch, pen, mouse — all unified via Pointer Events."],
            ['Park position', "On pointer-leave, the blob's target moves below the canvas so it appears to 'drip out the bottom.' On pointer-enter, it returns to the cursor."],
            ['Per-instance filter id', "Each `<LiquidLetters>` generates its own filter id from `useId`, so multiple instances on a page don't reference one another's filter."],
            ['SR-only fallback', "The actual text is also rendered as a `<span className='sr-only'>` so screen readers and search indexers read it normally."],
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
            ['children', 'string — the text to render.'],
            ['color', 'Color of the liquid. Default white.'],
            ['background', 'Canvas background color. Default #06070a.'],
            ['blur', 'Gaussian blur radius in px. Higher = thicker bonds. Default 8.'],
            ['blobRadius', 'Cursor blob radius in px. Default 36.'],
            ['fontSize', 'Number (px) or CSS string. Defaults to a responsive clamp.'],
            ['lerp', 'Cursor follow lerp 0–1. Higher = snappier. Default 0.18.'],
            ['aspect', 'CSS aspect-ratio for the canvas. Default "21 / 9".'],
            ['showHint', 'Show "Move the goo" hint at the bottom. Default true.'],
            ['className', 'Extra classes on the canvas.'],
          ].map(([n, b]) => (
            <li key={n} className="rounded-lg border border-white/10 bg-white/[0.02] p-3">
              <code className="font-mono text-xs text-white">{n}</code>
              <p className="mt-1 text-xs text-white/60">{b}</p>
            </li>
          ))}
        </ul>
      </DocsSection>

      <DocsSection title="Dependencies">
        <div className="text-xs text-white/55">No external runtime dependencies. Just React + SVG.</div>
      </DocsSection>
    </DocsPage>
  )
}
