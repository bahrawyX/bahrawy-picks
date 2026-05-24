'use client'

import * as React from 'react'
import { MoodSlider } from '@/components/bahrawy/mood-slider'
import { CodeBlock } from '@/components/showcase/code-block'
import { DocsPage, DocsSection, DemoCard } from '@/components/showcase/docs-page'

const SNIPPET = `import { MoodSlider } from '@/components/bahrawy/mood-slider'

const [mood, setMood] = useState(0.5)

<MoodSlider value={mood} onChange={setMood} />

// Swap the gradient endpoints
<MoodSlider
  defaultValue={0.6}
  trackColors={['#0A84FF', '#30D158']}
/>`

const MOOD_WORD = (v: number) => {
  if (v < 0.15) return 'awful'
  if (v < 0.3) return 'rough'
  if (v < 0.45) return 'meh'
  if (v < 0.6) return 'fine'
  if (v < 0.75) return 'good'
  if (v < 0.9) return 'great'
  return 'amazing'
}

export default function MoodSliderDocs() {
  const [v, setV] = React.useState(0.6)
  return (
    <DocsPage
      title="Mood Slider"
      slug="mood-slider"
      description="An Apple-style slider that runs from cool indigo to warm pink. The handle is a clean white disc that scales up on hover and again on drag; the value snaps to evenly-spaced steps for a tiny haptic-like feel."
      category="159 · form"
    >
      <DocsSection title="Drag to change the mood">
        <DemoCard className="min-h-[260px]">
          <div className="flex w-full max-w-[420px] flex-col items-center gap-6">
            <MoodSlider value={v} onChange={setV} />
            <p className="text-center text-sm uppercase tracking-[0.32em] text-white/65">
              {MOOD_WORD(v)} · {(v * 100).toFixed(0)}%
            </p>
          </div>
        </DemoCard>
      </DocsSection>

      <DocsSection
        title="Different gradient endpoints"
        description="Pass any two CSS colors as trackColors — the bar interpolates between them. Below: Apple system blue → green."
      >
        <DemoCard className="min-h-[200px]">
          <div className="w-full max-w-[420px]">
            <MoodSlider
              defaultValue={0.5}
              trackColors={['#0A84FF', '#30D158']}
              label="Energy"
            />
          </div>
        </DemoCard>
      </DocsSection>

      <DocsSection title="Finer steps">
        <DemoCard className="min-h-[200px]">
          <div className="w-full max-w-[420px]">
            <MoodSlider defaultValue={0.5} steps={21} label="Volume" />
          </div>
        </DemoCard>
      </DocsSection>

      <DocsSection title="Usage"><CodeBlock code={SNIPPET} language="tsx" /></DocsSection>

      <DocsSection title="Props">
        <ul className="grid gap-2 sm:grid-cols-2">
          {[
            ['value', 'Controlled value 0–1.'],
            ['defaultValue', 'Uncontrolled initial value. Default 0.5.'],
            ['onChange', '(next: number) => void.'],
            ['trackColors', '[low, high] CSS colors for the gradient. Default indigo → pink.'],
            ['steps', 'Snap-to-step count. Default 11 (10 segments).'],
            ['label', 'Accessible label. Default "Mood".'],
            ['moods', 'Words bucketed across 0–1; the current one renders in the header.'],
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
        <div className="text-xs text-white/55">framer-motion (handle spring + word morph).</div>
      </DocsSection>
    </DocsPage>
  )
}
