'use client'

import { CharSpring } from '@/components/bahrawy/char-spring'
import { CodeBlock } from '@/components/showcase/code-block'
import { DocsPage, DocsSection, DemoCard } from '@/components/showcase/docs-page'

export default function CharSpringDocs() {
  return (
    <DocsPage
      title="Char Spring"
      slug="char-spring"
      description="Each character springs up from below when the element enters the viewport. The container has overflow-hidden so the off-screen start state is genuinely hidden. Per-char delay gives the line a typewriter-with-bounce feel."
      category="149 · text effect"
    >
      <DocsSection title="Scroll to replay">
        <DemoCard className="min-h-[260px]">
          <h2 className="text-5xl font-semibold tracking-tight text-white sm:text-7xl">
            <CharSpring>Up they come.</CharSpring>
          </h2>
        </DemoCard>
      </DocsSection>

      <DocsSection title="Tighter spring">
        <DemoCard className="min-h-[260px]">
          <h2 className="text-5xl font-semibold tracking-tight text-white sm:text-7xl">
            <CharSpring stiffness={420} damping={28} stagger={0.025}>Snappy bounce.</CharSpring>
          </h2>
        </DemoCard>
      </DocsSection>

      <DocsSection title="Usage">
        <CodeBlock language="tsx" code={`<CharSpring stagger={0.04} stiffness={280} damping={22} replay>
  Up they come.
</CharSpring>`} />
      </DocsSection>

      <DocsSection title="Props">
        <ul className="grid gap-2 sm:grid-cols-2">
          {[
            ['children', 'string — the text (required).'],
            ['stagger', 'Stagger per character in seconds. Default 0.04.'],
            ['stiffness', 'Spring stiffness. Default 280.'],
            ['damping', 'Spring damping. Default 22.'],
            ['replay', 'Re-play every time the element re-enters. Default true.'],
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
        <div className="flex flex-wrap gap-2">
          <code className="rounded-md border border-white/10 bg-white/[0.04] px-2 py-1 font-mono text-xs text-white/80">framer-motion</code>
        </div>
      </DocsSection>
    </DocsPage>
  )
}
