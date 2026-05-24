'use client'

import * as React from 'react'
import { LiveCursor, LiveCursors } from '@/components/bahrawy/live-cursors'
import { CodeBlock } from '@/components/showcase/code-block'
import { DocsPage, DocsSection, DemoCard } from '@/components/showcase/docs-page'

const SNIPPET = `import { LiveCursors } from '@/components/bahrawy/live-cursors'

<div className="relative h-[400px]">
  <LiveCursors
    users={[
      { id: '1', name: '@haydenbleasel', color: '#34D399', x: 60,  y: 50,  message: 'Can we adjust the color?' },
      { id: '2', name: '@leerob',        color: '#F472B6', x: 480, y: 140, message: 'One more thing…' },
      { id: '3', name: '@shadcn',        color: '#60A5FA', x: 180, y: 240, message: 'Another new component?!!' },
    ]}
  />
</div>`

const ROAM_MESSAGES = [
  'lgtm',
  'one more thing…',
  'looks clean',
  'ship it',
  'love this',
  'wait what',
  'try violet?',
  'fix the spacing',
  'this is sick',
]

function pick<T>(list: T[], avoid?: T): T {
  if (list.length === 1) return list[0]
  let v = list[Math.floor(Math.random() * list.length)]
  while (v === avoid) v = list[Math.floor(Math.random() * list.length)]
  return v
}

export default function LiveCursorsDocs() {
  // ─── Demo 1 ── Static, matches the inspiration exactly.
  const staticUsers = [
    {
      id: '1',
      name: '@haydenbleasel',
      color: '#34D399',
      x: 60,
      y: 40,
      message: 'Can we adjust the color?',
    },
    {
      id: '2',
      name: '@leerob',
      color: '#F472B6',
      x: 460,
      y: 130,
      message: 'One more thing…',
    },
    {
      id: '3',
      name: '@shadcn',
      color: '#60A5FA',
      x: 170,
      y: 230,
      message: 'Another new component?!!',
    },
  ]

  // ─── Demo 2 ── Auto-roaming with swapping messages.
  const [roaming, setRoaming] = React.useState([
    { id: 'a', name: '@violet', color: '#A78BFA', x: 80, y: 60, message: 'hey' },
    { id: 'b', name: '@rose', color: '#F472B6', x: 320, y: 160, message: 'sup' },
    { id: 'c', name: '@gold', color: '#FBBF24', x: 520, y: 220, message: 'cool' },
    { id: 'd', name: '@cyan', color: '#22D3EE', x: 220, y: 100, message: 'ship it' },
  ])
  React.useEffect(() => {
    const id = setInterval(() => {
      setRoaming((prev) =>
        prev.map((u) => ({
          ...u,
          x: 40 + Math.random() * 560,
          y: 30 + Math.random() * 220,
          message: pick(ROAM_MESSAGES, u.message),
        })),
      )
    }, 2400)
    return () => clearInterval(id)
  }, [])

  // ─── Demo 3 ── Follow-your-cursor + typeable bubble.
  const followRef = React.useRef<HTMLDivElement>(null)
  const [pos, setPos] = React.useState({ x: 280, y: 130 })
  const [text, setText] = React.useState('')
  const [focused, setFocused] = React.useState(false)
  const handleMove = (e: React.MouseEvent) => {
    const r = followRef.current?.getBoundingClientRect()
    if (!r) return
    setPos({ x: e.clientX - r.left, y: e.clientY - r.top })
  }

  return (
    <DocsPage
      title="Live Cursors"
      slug="live-cursors"
      description="Figma/Vercel-style multiplayer cursors with chat bubbles. Each cursor is a colored arrow that springs to its (x, y) target, with an optional bubble showing the user's @handle and message. A typing flag swaps the message body for three pulsing dots so you can show 'someone is typing' without a message yet."
      category="09 · cursor"
    >
      <DocsSection title="Live demo">
        <DemoCard className="relative min-h-[340px] overflow-hidden p-0">
          <div className="relative h-[340px] w-full">
            <LiveCursors users={staticUsers} />
          </div>
        </DemoCard>
      </DocsSection>

      <DocsSection title="Auto-roaming">
        <DemoCard className="relative min-h-[300px] overflow-hidden p-0">
          <div className="relative h-[300px] w-full">
            <LiveCursors users={roaming} />
          </div>
          <div className="absolute bottom-3 left-3 text-[10px] uppercase tracking-[0.22em] text-white/40">
            spring physics · roams every 2.4s
          </div>
        </DemoCard>
      </DocsSection>

      <DocsSection title="Follows your cursor">
        <DemoCard className="relative min-h-[320px] overflow-hidden p-0">
          <div
            ref={followRef}
            onMouseMove={handleMove}
            className="relative h-[320px] w-full cursor-none"
          >
            <LiveCursor
              name="@you"
              color="#A78BFA"
              x={pos.x}
              y={pos.y}
              message={text || (focused ? undefined : 'move + type below')}
              typing={focused && text.length === 0}
              stiffness={500}
              damping={40}
            />
          </div>
          <div className="absolute bottom-3 left-3 right-3 flex justify-center">
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              placeholder="type a message…"
              className="w-full max-w-xs rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-1.5 text-[12px] text-white placeholder:text-white/35 outline-none focus:border-white/25 focus:bg-white/[0.06]"
            />
          </div>
        </DemoCard>
      </DocsSection>

      <DocsSection title="Usage">
        <CodeBlock code={SNIPPET} language="tsx" />
      </DocsSection>

      <DocsSection title="Props">
        <h4 className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-white/55">
          LiveCursor
        </h4>
        <ul className="grid gap-2 sm:grid-cols-2">
          {[
            ['name', 'Display name (@ prefix is convention, not enforced).'],
            ['color', 'Cursor + bubble accent color. Default #60A5FA.'],
            ['x / y', 'Position in px, relative to the positioned ancestor.'],
            ['message', 'Bubble message. Bubble is hidden if name/message/typing all empty.'],
            ['typing', 'Show pulsing 3-dot indicator instead of the message body.'],
            ['stiffness', 'Spring stiffness. Default 320.'],
            ['damping', 'Spring damping. Default 38.'],
            ['z', 'z-index for stacking. Default 30.'],
            ['className', 'Extra classes on the cursor wrapper.'],
          ].map(([n, b]) => (
            <li key={n} className="rounded-lg border border-white/10 bg-white/[0.02] p-3">
              <code className="font-mono text-xs text-white">{n}</code>
              <p className="mt-1 text-xs text-white/60">{b}</p>
            </li>
          ))}
        </ul>
        <h4 className="mb-2 mt-5 text-xs font-semibold uppercase tracking-[0.18em] text-white/55">
          LiveCursors
        </h4>
        <ul className="grid gap-2 sm:grid-cols-2">
          {[
            ['users', 'Array of { id, name, color, x, y, message, typing }.'],
            ['className', 'Extra classes on the absolutely-positioned overlay.'],
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
            <code key={d} className="rounded-md border border-white/10 bg-white/[0.04] px-2 py-1 font-mono text-xs text-white/80">
              {d}
            </code>
          ))}
        </div>
      </DocsSection>
    </DocsPage>
  )
}
