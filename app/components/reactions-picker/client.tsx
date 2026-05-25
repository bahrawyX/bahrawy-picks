'use client'

import * as React from 'react'
import { ReactionsPicker } from '@/components/bahrawy/reactions-picker'
import { CodeBlock } from '@/components/showcase/code-block'
import { DocsPage, DocsSection, DemoCard } from '@/components/showcase/docs-page'

const SNIPPET = `import { ReactionsPicker } from '@/components/bahrawy/reactions-picker'

<ReactionsPicker
  onPick={(emoji) => console.log('reacted:', emoji)}
  emojis={['👍', '❤️', '🎉', '😂', '🤔', '🔥']}
/>`

export default function ReactionsPickerDocs() {
  const [reactions, setReactions] = React.useState<Record<string, number>>({
    '👍': 4,
    '❤️': 2,
  })
  const [selected, setSelected] = React.useState<string[]>(['👍'])

  const onPick = (emoji: string) => {
    const has = selected.includes(emoji)
    setSelected((cur) =>
      has ? cur.filter((e) => e !== emoji) : [...cur, emoji],
    )
    setReactions((cur) => ({
      ...cur,
      [emoji]: (cur[emoji] ?? 0) + (has ? -1 : 1),
    }))
  }

  const cleaned = Object.entries(reactions).filter(([, n]) => n > 0)

  return (
    <DocsPage
      title="Reactions Picker"
      slug="reactions-picker"
      description="A Slack / Messages-style emoji reactions popup. A row of emojis scales up on cursor proximity (macOS Dock magnification), click fires the picker's onPick with the chosen emoji. Selected emojis show a soft active background. Vibrancy pill, Apple spring on the magnify scale."
      category="174 · overlay"
    >
      <DocsSection title="Default — hover to magnify">
        <DemoCard className="min-h-[200px]">
          <div className="flex flex-col items-center gap-4">
            <ReactionsPicker onPick={onPick} selected={selected} />
            {cleaned.length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5">
                {cleaned.map(([e, n]) => (
                  <span
                    key={e}
                    className="inline-flex items-center gap-1 rounded-full border border-white/[0.08] bg-white/[0.04] px-2 py-0.5 text-[12px]"
                  >
                    <span>{e}</span>
                    <span className="font-mono text-[10.5px] tabular-nums text-white/65">
                      {n}
                    </span>
                  </span>
                ))}
              </div>
            )}
          </div>
        </DemoCard>
      </DocsSection>

      <DocsSection title="Custom emoji set + bigger magnification">
        <DemoCard className="min-h-[200px]">
          <ReactionsPicker
            onPick={() => {}}
            emojis={['💯', '✨', '🚀', '👀', '💀', '😎', '🙏', '🥹']}
            maxScale={1.8}
            falloff={100}
          />
        </DemoCard>
      </DocsSection>

      <DocsSection title="Usage">
        <CodeBlock code={SNIPPET} language="tsx" />
      </DocsSection>

      <DocsSection title="Props">
        <ul className="grid gap-2 sm:grid-cols-2">
          {[
            ['emojis', 'string[] — emojis shown in the row. Defaults to 6 SF emojis.'],
            ['selected', 'string[] — already-picked emojis (shown with soft active bg).'],
            ['onPick', '(emoji) => void — fires on click.'],
            ['maxScale', 'Maximum scale of the hovered emoji. Default 1.5.'],
            ['falloff', 'Distance in px where scale returns to 1. Default 80.'],
            ['className', 'Extra classes on the pill.'],
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
          {['framer-motion'].map((d) => (
            <code key={d} className="rounded-md border border-white/10 bg-white/[0.04] px-2 py-1 font-mono text-xs text-white/80">{d}</code>
          ))}
        </div>
      </DocsSection>
    </DocsPage>
  )
}
