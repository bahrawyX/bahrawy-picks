'use client'

import { useState } from 'react'
import { TypewriterText } from '@/components/bahrawy/animations'
import { CodeBlock } from '@/components/showcase/code-block'
import {
  DemoCard,
  DocsPage,
  DocsSection,
} from '@/components/showcase/docs-page'
import {
  ControlPanel,
  SliderControl,
  ToggleControl,
  SelectControl,
} from '@/components/showcase/control-panel'

export default function TypewriterTextDocs() {
  const [key, setKey] = useState(0)
  const [speed, setSpeed] = useState(80)
  const [deleteSpeed, setDeleteSpeed] = useState(40)
  const [pauseDuration, setPauseDuration] = useState(1500)
  const [showCursor, setShowCursor] = useState(true)
  const [loop, setLoop] = useState(true)
  const [cursorChar, setCursorChar] = useState('|')

  const replay = () => setKey((k) => k + 1)

  const snippet = `<TypewriterText
  strings={["Build stunning interfaces.", "Ship faster with Bahrawy.", "Animations made simple."]}
  speed={${speed}}
  deleteSpeed={${deleteSpeed}}
  pauseDuration={${pauseDuration}}
  cursor={${showCursor}}
  cursorChar="${cursorChar}"
  loop={${loop}}
/>`

  return (
    <DocsPage
      title="Typewriter Text"
      slug="typewriter-text"
      description="Animated typewriter effect that types, pauses, and deletes through an array of strings. Configurable speeds, cursor style, and looping."
      category="10 · MOTION"
    >
      <DocsSection title="Preview" description="Watch the typewriter cycle through phrases with adjustable timing.">
        <DemoCard className="items-center justify-center min-h-[200px]">
          <div className="text-2xl font-mono text-white">
            <TypewriterText
              key={key}
              strings={["Build stunning interfaces.", "Ship faster with Bahrawy.", "Animations made simple."]}
              speed={speed}
              deleteSpeed={deleteSpeed}
              pauseDuration={pauseDuration}
              cursor={showCursor}
              cursorChar={cursorChar}
              loop={loop}
            />
          </div>
        </DemoCard>
        <ControlPanel onReplay={replay}>
          <SliderControl
            label="Typing Speed"
            value={speed}
            onChange={setSpeed}
            min={20}
            max={200}
            step={5}
            unit="ms"
          />
          <SliderControl
            label="Delete Speed"
            value={deleteSpeed}
            onChange={setDeleteSpeed}
            min={10}
            max={100}
            step={5}
            unit="ms"
          />
          <SliderControl
            label="Pause Duration"
            value={pauseDuration}
            onChange={setPauseDuration}
            min={500}
            max={4000}
            step={100}
            unit="ms"
          />
          <ToggleControl
            label="Show Cursor"
            checked={showCursor}
            onChange={setShowCursor}
          />
          <ToggleControl
            label="Loop"
            checked={loop}
            onChange={setLoop}
          />
          <SelectControl
            label="Cursor Character"
            value={cursorChar}
            onChange={setCursorChar}
            options={[
              { label: '| (Pipe)', value: '|' },
              { label: '_ (Underscore)', value: '_' },
              { label: '▋ (Block)', value: '▋' },
            ]}
          />
        </ControlPanel>
        <CodeBlock code={snippet} language="tsx" />
      </DocsSection>

      <DocsSection title="Dependencies">
        <div className="flex flex-wrap gap-2">
          {['framer-motion'].map((d) => (
            <code key={d} className="rounded-md border border-white/10 bg-white/[0.04] px-2 py-1 font-mono text-xs text-white/80">{d}</code>
          ))}
        </div>
      </DocsSection>
    </DocsPage>
  )
}
