'use client'

import { AudioPlayer } from '@/components/bahrawy/audio-player'
import { CodeBlock } from '@/components/showcase/code-block'
import { DocsPage, DocsSection, DemoCard } from '@/components/showcase/docs-page'

const SNIPPET = `import { AudioPlayer } from '@/components/bahrawy/audio-player'

<AudioPlayer
  src="/track.mp3"
  title="Side B · Closer"
  artist="Bahrawy"
  coverArt="/cover.jpg"
  accent="#A78BFA"
/>`

// Royalty-free sample from Mozilla's web docs assets.
const SAMPLE_SRC = 'https://interactive-examples.mdn.mozilla.net/media/cc0-audio/t-rex-roar.mp3'

export default function AudioPlayerDocs() {
  return (
    <DocsPage
      title="Audio Player"
      slug="audio-player"
      description="A real audio player built around <audio>. Play/pause, current/total time, volume + mute, and the signature: a waveform-as-seek-bar where the bars left of the playhead glow accent-colored and the rest stay muted. Click any bar to seek; drag to scrub. If you pass `waveform` (pre-computed amplitudes) it uses those; otherwise it generates a deterministic synthetic waveform from the src URL so the same track always looks the same."
      category="66 · ui"
    >
      <DocsSection title="Default (violet, synthetic waveform)">
        <DemoCard className="min-h-[220px]">
          <AudioPlayer
            src={SAMPLE_SRC}
            title="Side B · Closer"
            artist="Bahrawy"
            accent="#A78BFA"
          />
        </DemoCard>
      </DocsSection>

      <DocsSection title="Cyan, denser waveform">
        <DemoCard className="min-h-[220px]">
          <AudioPlayer
            src={SAMPLE_SRC}
            title="Velvet light"
            artist="Bahrawy"
            accent="#22D3EE"
            bars={96}
          />
        </DemoCard>
      </DocsSection>

      <DocsSection title="With cover art">
        <DemoCard className="min-h-[220px]">
          <AudioPlayer
            src={SAMPLE_SRC}
            title="Honest mistake"
            artist="Bahrawy · 3:55"
            accent="#F472B6"
            coverArt="https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=200&h=200&fit=crop&q=80"
          />
        </DemoCard>
      </DocsSection>

      <DocsSection title="Usage">
        <CodeBlock code={SNIPPET} language="tsx" />
      </DocsSection>

      <DocsSection title="Props">
        <ul className="grid gap-2 sm:grid-cols-2">
          {[
            ['src', 'Audio source URL.'],
            ['title / artist', 'Optional metadata shown above the waveform.'],
            ['coverArt', 'Optional square cover art URL.'],
            ['waveform', 'Pre-computed amplitudes (0..1 per bar). If omitted, generated from src.'],
            ['bars', 'Number of synthetic bars when no waveform passed. Default 64.'],
            ['accent', 'Accent for the played-portion bars + play button. Default #A78BFA.'],
            ['autoPlay', 'Auto-play on mount. Default false.'],
            ['className', 'Extra classes on the outer card.'],
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
          {['framer-motion', 'lucide-react'].map((d) => (
            <code key={d} className="rounded-md border border-white/10 bg-white/[0.04] px-2 py-1 font-mono text-xs text-white/80">
              {d}
            </code>
          ))}
        </div>
      </DocsSection>
    </DocsPage>
  )
}
