'use client'

import { useState } from 'react'
import {
  Mic,
  PhoneCall,
  Music2,
  MapPin,
  Send,
  Timer as TimerIcon,
  Circle,
  BatteryLow,
  Search,
  ScreenShare,
  Phone,
} from 'lucide-react'
import {
  DynamicIsland,
  type DynamicIslandView,
} from '@/components/bahrawy/dynamic-island'
import { CodeBlock } from '@/components/showcase/code-block'
import { DocsPage, DocsSection } from '@/components/showcase/docs-page'

const SCENES: Array<{
  value: DynamicIslandView
  label: string
  icon: React.ComponentType<{ className?: string }>
}> = [
  { value: 'idle', label: 'Idle', icon: Circle },
  { value: 'ring', label: 'Ring', icon: PhoneCall },
  { value: 'timer', label: 'Timer', icon: TimerIcon },
  { value: 'record', label: 'Record', icon: Mic },
  { value: 'music', label: 'Music', icon: Music2 },
  { value: 'airdrop', label: 'AirDrop', icon: Send },
  { value: 'airdropMini', label: 'AirDrop Mini', icon: Send },
  { value: 'lowBattery', label: 'Low Battery', icon: BatteryLow },
  { value: 'phone', label: 'Phone', icon: Phone },
  { value: 'findmy', label: 'Find My', icon: Search },
  { value: 'screenRecord', label: 'Screen Record', icon: ScreenShare },
  { value: 'maps', label: 'Maps', icon: MapPin },
]

const SNIPPET = `import { DynamicIsland } from '@/components/bahrawy/dynamic-island'

<DynamicIsland view="music" />`

export default function DynamicIslandDocs() {
  const [view, setView] = useState<DynamicIslandView>('music')

  return (
    <DocsPage
      title="Dynamic Island"
      slug="dynamic-island"
      description="iPhone-style notch that morphs between rich, animated states. Spring-physics layout animation — the container fluidly resizes and reshapes as content changes, with each scene fading in cleanly on top."
      category="77 · motion"
    >
      <DocsSection
        title="Live demo"
        description="Tap a scene below. The island springs into its new shape and content."
      >
        {/* Customize panel — pill buttons instead of a select */}
        <div className="mt-4 rounded-xl border border-white/[0.08] bg-white/[0.02] p-4">
          <div className="mb-3 flex items-center justify-between">
            <h4 className="text-sm font-semibold tracking-wide text-white/70">
              Customize
            </h4>
            <span className="text-[10px] uppercase tracking-[0.18em] text-white/40">
              Scene
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {SCENES.map((scene) => {
              const Icon = scene.icon
              const active = scene.value === view
              return (
                <button
                  key={scene.value}
                  type="button"
                  onClick={() => setView(scene.value)}
                  className={
                    'inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs transition-all ' +
                    (active
                      ? 'border-white bg-white text-black shadow-[0_4px_16px_-4px_rgba(255,255,255,0.25)]'
                      : 'border-white/10 bg-white/[0.03] text-white/70 hover:border-white/25 hover:bg-white/[0.06] hover:text-white')
                  }
                >
                  <Icon className="h-3.5 w-3.5" />
                  {scene.label}
                </button>
              )
            })}
          </div>
        </div>

        {/* Big, centered stage with wallpaper gradient */}
        <div className="relative mt-4 flex h-[520px] w-full items-center justify-center overflow-hidden rounded-2xl border border-white/10 p-12">
          <div
            aria-hidden
            className="absolute inset-0 bg-[radial-gradient(at_28%_18%,rgba(124,58,237,0.28),transparent_55%),radial-gradient(at_78%_72%,rgba(56,189,248,0.22),transparent_55%),radial-gradient(at_50%_100%,rgba(244,114,182,0.20),transparent_60%)]"
          />
          <div aria-hidden className="absolute inset-0 bg-zinc-950/70" />
          <div
            aria-hidden
            className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.4),transparent_40%)]"
          />

          {/* The island itself */}
          <div className="relative flex items-center justify-center">
            <DynamicIsland view={view} />
          </div>

          {/* Soft floor reflection hint */}
          <div
            aria-hidden
            className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/40 to-transparent"
          />
        </div>
      </DocsSection>

      <DocsSection title="Usage">
        <CodeBlock code={SNIPPET} language="tsx" />
      </DocsSection>

      <DocsSection title="Scenes">
        <ul className="grid gap-2 sm:grid-cols-2">
          {[
            ['idle', 'The base pill, ready to grow.'],
            ['ring', 'Incoming call with caller and accept/decline.'],
            ['timer', 'Compact countdown with a tabular-nums clock.'],
            ['record', 'Pulsing red dot + duration during recording.'],
            ['music', 'Album art, title, artist, and a live waveform.'],
            ['maps', 'Turn-by-turn directions with distance and ETA.'],
            ['airdrop', 'File transfer progress in a tall expanded shape.'],
          ].map(([v, desc]) => (
            <li
              key={v}
              className="rounded-lg border border-white/10 bg-white/[0.02] p-3"
            >
              <code className="font-mono text-xs text-white">{v}</code>
              <p className="mt-1 text-xs text-white/60">{desc}</p>
            </li>
          ))}
        </ul>
      </DocsSection>

      <DocsSection title="Dependencies">
        <div className="flex flex-wrap gap-2">
          {['framer-motion', 'lucide-react'].map((d) => (
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
