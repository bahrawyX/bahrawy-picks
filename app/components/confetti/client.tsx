'use client'

import { useCallback } from 'react'
import { useConfetti } from '@/components/bahrawy'
import { ConfettiCanvas } from '@/components/bahrawy/confetti/canvas'
import { CodeBlock } from '@/components/showcase/code-block'
import {
  DemoCard,
  DocsPage,
  DocsSection,
} from '@/components/showcase/docs-page'
import { PropsTable } from '@/components/showcase/props-table'

/** Returns a normalized { x, y } origin from the top-center of the clicked button. */
function originFromButton(e: React.MouseEvent<HTMLButtonElement>) {
  const rect = e.currentTarget.getBoundingClientRect()
  return {
    x: (rect.left + rect.width / 2) / window.innerWidth,
    y: rect.top / window.innerHeight,
  }
}

const HOOK_SNIPPET = `import { useConfetti } from '@/components/bahrawy'
import { ConfettiCanvas } from '@/components/bahrawy/confetti/canvas'

function Demo() {
  const { ref, fire } = useConfetti()
  return (
    <>
      <ConfettiCanvas ref={ref} />
      <button onClick={() => fire()}>
        Celebrate!
      </button>
    </>
  )
}`

const WRAPPER_SNIPPET = `import { Confetti } from '@/components/bahrawy'

<Confetti>
  <YourContent />
</Confetti>`

export default function ConfettiDocs() {
  const { ref, fire } = useConfetti()

  return (
    <DocsPage
      title="Confetti"
      slug="confetti"
      description="Canvas-based confetti particle system with configurable colors, gravity, spread, and imperative fire() API."
      category="56 · MOTION"
    >
      {/* Single fullscreen canvas for the whole page */}
      <ConfettiCanvas ref={ref} />

      {/* Interactive demo */}
      <DocsSection title="Fire confetti">
        <DemoCard>
          <button
            onClick={(e) => fire({ origin: originFromButton(e) })}
            className="rounded-lg bg-white/10 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-white/20"
          >
            🎉 Fire Confetti
          </button>
        </DemoCard>
      </DocsSection>

      {/* Custom colors */}
      <DocsSection title="Custom colors">
        <DemoCard>
          <button
            onClick={(e) =>
              fire({ colors: ['#ff0000', '#00ff00', '#0000ff'], count: 120, origin: originFromButton(e) })
            }
            className="rounded-lg bg-white/10 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-white/20"
          >
            🌈 RGB Burst
          </button>
        </DemoCard>
      </DocsSection>

      {/* useConfetti hook */}
      <DocsSection title="useConfetti hook">
        <CodeBlock code={HOOK_SNIPPET} language="tsx" />
      </DocsSection>

      {/* Wrapper component */}
      <DocsSection title="Wrapper component">
        <CodeBlock code={WRAPPER_SNIPPET} language="tsx" />
      </DocsSection>

      {/* Props */}
      <DocsSection title="ConfettiConfig">
        <PropsTable
          props={[
            { name: 'count', type: 'number', default: '80', description: 'Number of particles' },
            { name: 'colors', type: 'string[]', default: '8 defaults', description: 'Particle color palette' },
            { name: 'gravity', type: 'number', default: '0.15', description: 'Downward pull per frame' },
            { name: 'drag', type: 'number', default: '0.02', description: 'Air resistance coefficient' },
            { name: 'spread', type: 'number', default: '60', description: 'Launch cone angle in degrees' },
            { name: 'velocity', type: 'number', default: '18', description: 'Initial launch speed' },
            { name: 'origin', type: '{ x: number; y: number }', default: '{ x: 0.5, y: 0.5 }', description: 'Origin point (0-1)' },
          ]}
        />
      </DocsSection>
    </DocsPage>
  )
}
