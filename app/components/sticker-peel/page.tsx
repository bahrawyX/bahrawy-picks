'use client'

import { StickerPeel } from '@/components/bahrawy/sticker-peel'
import { CodeBlock } from '@/components/showcase/code-block'
import { DocsPage, DocsSection, DemoCard } from '@/components/showcase/docs-page'

const SNIPPET = `import { StickerPeel } from '@/components/bahrawy/sticker-peel'

<StickerPeel color="#FDE68A" size={220}>
  <div className="text-center">
    <p className="text-xs font-medium uppercase tracking-[0.22em] opacity-65">
      Limited
    </p>
    <h3 className="mt-1 text-2xl font-extrabold uppercase">
      Bahrawy
    </h3>
    <p className="mt-1 text-[10px] uppercase tracking-[0.22em] opacity-65">
      hand-stuck
    </p>
  </div>
</StickerPeel>`

export default function StickerPeelDocs() {
  return (
    <DocsPage
      title="Sticker Peel"
      slug="sticker-peel"
      description="Drag the top-right corner of a sticker to peel it back. A 3D fold lifts the corner off the surface, a cast shadow appears underneath, and the back face shows through. Release past a threshold and the sticker stays peeled."
      category="127 · card"
    >
      <DocsSection title="Live demo · drag the top-right corner">
        <DemoCard className="min-h-[360px]">
          <div className="flex items-center justify-center gap-10 py-10">
            <StickerPeel color="#FDE68A" size={220}>
              <div>
                <p className="text-[10px] font-medium uppercase tracking-[0.22em] opacity-65">
                  Limited
                </p>
                <h3 className="mt-1 text-2xl font-extrabold uppercase tracking-tight">
                  Bahrawy
                </h3>
                <p className="mt-1 text-[10px] uppercase tracking-[0.22em] opacity-65">
                  hand-stuck
                </p>
              </div>
            </StickerPeel>

            <StickerPeel color="#A7F3D0" size={220}>
              <div>
                <p className="text-[10px] font-medium uppercase tracking-[0.22em] opacity-65">
                  Side B
                </p>
                <h3 className="mt-1 text-2xl font-extrabold uppercase">good</h3>
                <p className="mt-1 text-[10px] uppercase tracking-[0.22em] opacity-65">
                  stuff only
                </p>
              </div>
            </StickerPeel>
          </div>
        </DemoCard>
      </DocsSection>

      <DocsSection title="Usage"><CodeBlock code={SNIPPET} language="tsx" /></DocsSection>

      <DocsSection title="Props">
        <ul className="grid gap-2 sm:grid-cols-2">
          {[
            ['children', 'Content rendered inside the sticker (both faces).'],
            ['color', 'Sticker face colour. Default warm yellow #FDE68A.'],
            ['backColor', 'Back-of-sticker colour. Defaults to the face colour.'],
            ['size', 'Sticker edge length in px. Default 220.'],
            ['stickThreshold', '0–1 — how far the corner must be dragged for the sticker to STAY peeled on release. Default 0.55.'],
            ['radius', 'Border-radius in px. Default 24.'],
            ['className', 'Extra classes on the wrapper.'],
          ].map(([n, b]) => (
            <li key={n} className="rounded-lg border border-white/10 bg-white/[0.02] p-3">
              <code className="font-mono text-xs text-white">{n}</code>
              <p className="mt-1 text-xs text-white/60">{b}</p>
            </li>
          ))}
        </ul>
      </DocsSection>

      <DocsSection title="Dependencies">
        <div className="text-xs text-white/55">No external runtime dependencies — just React + CSS 3D transforms.</div>
      </DocsSection>
    </DocsPage>
  )
}
