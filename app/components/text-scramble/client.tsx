'use client'

import { useState } from 'react'
import { TextScramble } from '@/components/bahrawy/animations'
import { CodeBlock } from '@/components/showcase/code-block'
import {
  DemoCard,
  DocsPage,
  DocsSection,
} from '@/components/showcase/docs-page'
import {
  ControlPanel,
  SelectControl,
  SliderControl,
  ToggleControl,
} from '@/components/showcase/control-panel'

export default function TextScrambleDocs() {
  const [key, setKey] = useState(0)
  const [charset, setCharset] = useState('alphanumeric')
  const [duration, setDuration] = useState(1.5)
  const [speed, setSpeed] = useState(20)
  const [staggerEnabled, setStaggerEnabled] = useState(true)

  const replay = () => setKey((k) => k + 1)

  const snippet = `<TextScramble
  text="DECRYPTING SECURE MESSAGE..."
  trigger="mount"
  charset="${charset}"
  duration={${duration}}
  speed={${speed}}
  stagger={${staggerEnabled}}
  className="text-xl font-mono text-emerald-400"
/>`

  return (
    <DocsPage
      category="78 · motion"
      title="Text Scramble"
      slug="text-scramble"
      description="Hacker terminal effect — characters scramble through random chars before resolving to the final text. Supports multiple charsets and staggered reveal."
    >
      <DocsSection title="Interactive demo">
        <DemoCard>
          <TextScramble
            key={key}
            text="DECRYPTING SECURE MESSAGE..."
            trigger="mount"
            charset={charset}
            duration={duration}
            speed={speed}
            stagger={staggerEnabled}
            className="text-xl font-mono text-emerald-400"
          />
        </DemoCard>

        <ControlPanel onReplay={replay}>
          <SelectControl
            label="Charset"
            value={charset}
            onChange={setCharset}
            options={[
              { label: 'Alphanumeric', value: 'alphanumeric' },
              { label: 'Symbols', value: 'symbols' },
              { label: 'Binary', value: 'binary' },
              { label: 'Hex', value: 'hex' },
              { label: 'Matrix', value: 'matrix' },
            ]}
          />
          <SliderControl
            label="Duration"
            value={duration}
            onChange={setDuration}
            min={0.5}
            max={5}
            step={0.1}
            unit="s"
          />
          <SliderControl
            label="Speed"
            value={speed}
            onChange={setSpeed}
            min={5}
            max={50}
            step={1}
            unit="fps"
          />
          <ToggleControl
            label="Stagger"
            checked={staggerEnabled}
            onChange={setStaggerEnabled}
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
