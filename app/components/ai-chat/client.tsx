'use client'

import * as React from 'react'
import { AIChat, type ChatMessage } from '@/components/bahrawy/ai-chat'
import { CodeBlock } from '@/components/showcase/code-block'
import { DocsPage, DocsSection, DemoCard } from '@/components/showcase/docs-page'

const SNIPPET = `import { AIChat } from '@/components/bahrawy/ai-chat'

<AIChat
  messages={[
    { id: '1', role: 'user',      content: 'Explain dark matter in one sentence.' },
    { id: '2', role: 'assistant', content: 'Dark matter is mass we infer from gravity but cannot see…', streaming: true },
  ]}
  thinking={false}
  speed={70}
/>`

// A short scripted exchange that loops.
const SCRIPT: ChatMessage[][] = [
  [{ id: 'u1', role: 'user', content: 'What\'s the difference between let and const in JS?' }],
  [
    { id: 'u1', role: 'user', content: 'What\'s the difference between let and const in JS?' },
    {
      id: 'a1',
      role: 'assistant',
      content:
        '`let` declares a variable you can re-assign later; `const` binds the identifier to one value and forbids re-assignment. Both are block-scoped — unlike `var` which is function-scoped and hoisted in confusing ways.',
      streaming: true,
    },
  ],
  [
    { id: 'u1', role: 'user', content: 'What\'s the difference between let and const in JS?' },
    {
      id: 'a1',
      role: 'assistant',
      content:
        '`let` declares a variable you can re-assign later; `const` binds the identifier to one value and forbids re-assignment. Both are block-scoped — unlike `var` which is function-scoped and hoisted in confusing ways.',
    },
    { id: 'u2', role: 'user', content: 'And for objects?' },
  ],
  [
    { id: 'u1', role: 'user', content: 'What\'s the difference between let and const in JS?' },
    {
      id: 'a1',
      role: 'assistant',
      content:
        '`let` declares a variable you can re-assign later; `const` binds the identifier to one value and forbids re-assignment. Both are block-scoped — unlike `var` which is function-scoped and hoisted in confusing ways.',
    },
    { id: 'u2', role: 'user', content: 'And for objects?' },
    {
      id: 'a2',
      role: 'assistant',
      content:
        '`const` only protects the binding, not the value. You can still mutate the object — change properties, push to an array. Use `Object.freeze` if you want true immutability.',
      streaming: true,
    },
  ],
]

export default function AIChatDocs() {
  const [step, setStep] = React.useState(0)
  const [thinking, setThinking] = React.useState(false)

  // Auto-advance the script for the demo.
  React.useEffect(() => {
    const TIMINGS = [1100, 5200, 1400, 5800] // ms before each step transitions
    const t = setTimeout(
      () => {
        // Brief "thinking" between a user turn and the assistant turn.
        const nextStep = (step + 1) % SCRIPT.length
        const nextIsAssistantTurn = SCRIPT[nextStep][SCRIPT[nextStep].length - 1].role === 'assistant'
        if (nextIsAssistantTurn) {
          setThinking(true)
          setTimeout(() => {
            setThinking(false)
            setStep(nextStep)
          }, 800)
        } else {
          setStep(nextStep)
        }
      },
      TIMINGS[step],
    )
    return () => clearTimeout(t)
  }, [step])

  return (
    <DocsPage
      title="AI Chat"
      slug="ai-chat"
      description="A Claude/ChatGPT-style chat view. User messages right-aligned in soft dark bubbles; assistant messages left-aligned with an avatar and a brighter card. Any message flagged streaming reveals one character at a time with a blinking caret pinned to the write head. A thinking flag renders pulsing dots while the next response is being prepared."
      category="11 · data"
    >
      <DocsSection title="Live (auto-scripted exchange)">
        <DemoCard className="min-h-[520px] items-start py-8">
          <div className="w-full max-w-xl">
            <AIChat
              messages={SCRIPT[step]}
              thinking={thinking}
              speed={75}
              height="440px"
            />
          </div>
        </DemoCard>
      </DocsSection>

      <DocsSection title="Static message thread">
        <DemoCard className="min-h-[360px] items-start py-8">
          <div className="w-full max-w-xl">
            <AIChat
              height="300px"
              messages={[
                { id: 'a', role: 'user', content: 'TL;DR — what\'s a closure?' },
                { id: 'b', role: 'assistant', content: 'A function bundled with the variables from where it was defined. The inner function keeps access to those variables even after the outer one returns.' },
                { id: 'c', role: 'user', content: 'Got it. One-liner example?' },
                { id: 'd', role: 'assistant', content: '`const counter = (() => { let n = 0; return () => ++n })()` — `counter()` increments a private `n`.' },
              ]}
            />
          </div>
        </DemoCard>
      </DocsSection>

      <DocsSection title="Usage">
        <CodeBlock code={SNIPPET} language="tsx" />
      </DocsSection>

      <DocsSection title="Props">
        <ul className="grid gap-2 sm:grid-cols-2">
          {[
            ['messages', 'ChatMessage[] — { id, role: "user"|"assistant", content, streaming? }.'],
            ['thinking', 'Show pulsing 3-dot indicator at the bottom. Default false.'],
            ['speed', 'Chars/sec for streaming messages. Default 70.'],
            ['assistantAvatar', 'Custom avatar node for assistant rows. Default violet sparkle.'],
            ['userAvatar', 'Custom avatar node for user rows. Default "You" chip.'],
            ['height', 'Max scroll height. Default "420px".'],
            ['autoScroll', 'Auto-scroll to bottom on new content. Default true.'],
            ['className', 'Extra classes on the outer container.'],
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
