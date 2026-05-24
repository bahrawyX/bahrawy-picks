'use client'

import { VinylPlayer, type VinylTrack } from '@/components/bahrawy/vinyl-player'
import { CodeBlock } from '@/components/showcase/code-block'
import { DocsPage, DocsSection } from '@/components/showcase/docs-page'

const TRACKS: VinylTrack[] = [
  { id: 't1', title: 'Side A · Opener', artist: 'Bahrawy', runtime: '3:42', accent: '#F472B6' },
  { id: 't2', title: 'Slow burn', artist: 'Bahrawy', runtime: '4:18', accent: '#A78BFA' },
  { id: 't3', title: 'Velvet light', artist: 'Bahrawy', runtime: '5:02', accent: '#22D3EE' },
  { id: 't4', title: 'Honest mistake', artist: 'Bahrawy', runtime: '3:55', accent: '#FBBF24' },
  { id: 't5', title: 'Side B · Closer', artist: 'Bahrawy', runtime: '6:14', accent: '#34D399' },
]

const SNIPPET = `import { VinylPlayer } from '@/components/bahrawy/vinyl-player'

const tracks = [
  { id: 't1', title: 'Side A · Opener', artist: 'Bahrawy', runtime: '3:42' },
  // …
]

<VinylPlayer
  eyebrow="A1 · 33⅓"
  tracks={tracks}
  cta={{ label: 'Hear the cut' }}
  scrollLength={3.5}
  spins={6}
  accentColor="#F472B6"
/>`

export default function VinylPlayerDocs() {
  return (
    <DocsPage
      title="Vinyl Player"
      slug="vinyl-player"
      description="A turntable with a spinning vinyl record + tonearm that rotates to point at different tracks as you scroll. Each track has its own info panel; a live waveform highlights the active track."
      category="141 · gsap-section"
    >
      <DocsSection title="Live demo" description="Scroll into the section — the record spins, the tonearm drops to each track in turn, the panel on the right swaps to the active track.">
        <p className="text-xs text-white/40">↓ scroll · drop the needle</p>
      </DocsSection>

      <VinylPlayer
        eyebrow="A1 · 33⅓ rpm"
        tracks={TRACKS}
        cta={{ label: 'Hear the cut' }}
        scrollLength={3.5}
        spins={6}
        accentColor="#F472B6"
      />

      <div className="h-32" aria-hidden />

      <DocsSection title="Usage">
        <CodeBlock code={SNIPPET} language="tsx" />
      </DocsSection>

      <DocsSection title="Props">
        <ul className="grid gap-2 sm:grid-cols-2">
          {[
            ['tracks', 'VinylTrack[] — each { id, title, artist?, runtime?, accent? }. Order = playback order.'],
            ['eyebrow', 'Tiny tag at the top of the section.'],
            ['cta', '{ label, href?, onClick? } — final call-to-action.'],
            ['scrollLength', 'Pin duration in viewport heights. Default 3.5.'],
            ['spins', 'Total record rotations across the pin. Default 6.'],
            ['accentColor', 'Label + tonearm cartridge glow. Default #F472B6.'],
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
            <code key={d} className="rounded-md border border-white/10 bg-white/[0.04] px-2 py-1 font-mono text-xs text-white/80">{d}</code>
          ))}
        </div>
      </DocsSection>
    </DocsPage>
  )
}
