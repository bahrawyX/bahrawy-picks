'use client'

import { WaveText } from '@/components/bahrawy/wave-text'
import { CodeBlock } from '@/components/showcase/code-block'
import { DocsPage, DocsSection, DemoCard } from '@/components/showcase/docs-page'

export default function WaveTextDocs() {
  return (
    <DocsPage
      title="Wave Text"
      slug="wave-text"
      description="A line of text where each character undulates in a sine wave with a staggered phase, so the wave reads as a single curve travelling through the word. Pure CSS keyframes."
      category="128 · text effect"
    >
      <DocsSection title="Live demo">
        <DemoCard className="min-h-[200px]">
          <h2 className="text-5xl font-semibold tracking-tight text-white sm:text-7xl">
            <WaveText>Always in motion.</WaveText>
          </h2>
        </DemoCard>
      </DocsSection>

      <DocsSection title="Bigger wave">
        <DemoCard className="min-h-[200px]">
          <h2 className="text-5xl font-semibold tracking-tight text-white sm:text-7xl">
            <WaveText amplitude={18} duration={1.6} stagger={0.07}>Bigger swell.</WaveText>
          </h2>
        </DemoCard>
      </DocsSection>

      <DocsSection title="Usage">
        <CodeBlock language="tsx" code={`import { WaveText } from '@/components/bahrawy/wave-text'

<h1 className="text-7xl font-semibold">
  <WaveText amplitude={8} duration={2.4} stagger={0.05}>
    Always in motion.
  </WaveText>
</h1>`} />
      </DocsSection>

      <DocsSection title="Props">
        <ul className="grid gap-2 sm:grid-cols-2">
          {[
            ['children', 'string — the text to animate (required).'],
            ['amplitude', 'Wave amplitude in px. Default 8.'],
            ['duration', 'Cycle duration in seconds. Default 2.4.'],
            ['stagger', 'Stagger per character in seconds. Default 0.05.'],
            ['className', 'Extra classes on the wrapper.'],
          ].map(([n, b]) => (
            <li key={n} className="rounded-lg border border-white/10 bg-white/[0.02] p-3">
              <code className="font-mono text-xs text-white">{n}</code>
              <p className="mt-1 text-xs text-white/60">{b}</p>
            </li>
          ))}
        </ul>
      </DocsSection>
    </DocsPage>
  )
}
