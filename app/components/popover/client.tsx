'use client'

import * as React from 'react'
import { Popover } from '@/components/bahrawy/popover'
import { SegmentedControl } from '@/components/bahrawy/segmented-control'
import { CodeBlock } from '@/components/showcase/code-block'
import { DocsPage, DocsSection, DemoCard } from '@/components/showcase/docs-page'
import { Bell, Settings, Filter, MoreHorizontal, ChevronDown, Check } from 'lucide-react'

const SNIPPET = `import { Popover } from '@/components/bahrawy/popover'

const triggerRef = useRef<HTMLButtonElement>(null)
const [open, setOpen] = useState(false)

<button ref={triggerRef} onClick={() => setOpen(o => !o)}>Open</button>

<Popover
  open={open}
  onOpenChange={setOpen}
  anchorRef={triggerRef}
  side="bottom"
  align="center"
>
  <div className="p-3">… interactive content …</div>
</Popover>`

export default function PopoverDocs() {
  // Notifications popover
  const bellRef = React.useRef<HTMLButtonElement>(null)
  const [bellOpen, setBellOpen] = React.useState(false)

  // Filter popover
  const filterRef = React.useRef<HTMLButtonElement>(null)
  const [filterOpen, setFilterOpen] = React.useState(false)
  const [filter, setFilter] = React.useState<'all' | 'open' | 'closed'>('open')

  // Settings popover
  const setRef = React.useRef<HTMLButtonElement>(null)
  const [setOpen2, setSetOpen2] = React.useState(false)
  const [notif, setNotif] = React.useState(true)
  const [sound, setSound] = React.useState(false)

  // Side demo
  const [demoSide, setDemoSide] = React.useState<'top' | 'right' | 'bottom' | 'left'>(
    'bottom',
  )
  const demoRef = React.useRef<HTMLButtonElement>(null)
  const [demoOpen, setDemoOpen] = React.useState(false)

  return (
    <DocsPage
      title="Popover"
      slug="popover"
      description="An anchored interactive popup. Distinct from <Tooltip /> (hover-only) and <DropdownMenu /> (menu-shaped) — Popover renders arbitrary interactive content anchored to a trigger. Supports side + align placement, auto-flips when there's no room, repositions on scroll/resize, click-outside + ESC to dismiss, vibrancy panel with optional arrow."
      category="167 · overlay"
    >
      <DocsSection title="Notification bell — bottom + end">
        <DemoCard className="min-h-[260px]">
          <button
            ref={bellRef}
            type="button"
            onClick={() => setBellOpen((o) => !o)}
            className="relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.04] text-white backdrop-blur transition-colors hover:bg-white/[0.08]"
            aria-label="Notifications"
          >
            <Bell className="h-4 w-4" strokeWidth={2.25} />
            <span className="absolute -right-0.5 -top-0.5 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-[#FF453A] px-1 text-[9.5px] font-bold text-white">
              3
            </span>
          </button>

          <Popover
            open={bellOpen}
            onOpenChange={setBellOpen}
            anchorRef={bellRef}
            side="bottom"
            align="end"
          >
            <div className="w-[280px] p-2">
              <p className="px-2 py-1 text-[10.5px] font-semibold uppercase tracking-[0.16em] text-white/40">
                3 new
              </p>
              <ul className="space-y-0.5">
                {[
                  { who: 'Lee', what: 'commented on Pricing v2', t: '2m' },
                  { who: 'Vercel', what: 'deployed `main` to production', t: '14m' },
                  { who: 'Maya', what: 'invited you to bahrawy.app', t: '1h' },
                ].map((n, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2.5 rounded-[8px] px-2 py-2 hover:bg-white/[0.05]"
                  >
                    <span className="mt-0.5 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-[#5E5CE6]" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[12px] tracking-tight text-white/85">
                        <span className="font-semibold text-white">{n.who}</span>{' '}
                        {n.what}
                      </p>
                      <p className="text-[10.5px] tracking-tight text-white/45">{n.t} ago</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </Popover>
        </DemoCard>
      </DocsSection>

      <DocsSection title="Filter chip — bottom + start">
        <DemoCard className="min-h-[240px]">
          <button
            ref={filterRef}
            type="button"
            onClick={() => setFilterOpen((o) => !o)}
            className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.08] bg-white/[0.04] px-3 py-1.5 text-[12.5px] font-medium tracking-tight text-white/85 backdrop-blur transition-colors hover:bg-white/[0.08]"
          >
            <Filter className="h-3.5 w-3.5" strokeWidth={2.25} />
            Status: <span className="font-semibold text-white">{filter}</span>
            <ChevronDown className="h-3 w-3 text-white/55" strokeWidth={2.5} />
          </button>

          <Popover
            open={filterOpen}
            onOpenChange={setFilterOpen}
            anchorRef={filterRef}
            side="bottom"
            align="start"
          >
            <ul className="w-[200px] p-1.5">
              {(['all', 'open', 'closed'] as const).map((v) => (
                <li key={v}>
                  <button
                    type="button"
                    onClick={() => {
                      setFilter(v)
                      setFilterOpen(false)
                    }}
                    className="flex w-full items-center justify-between gap-2 rounded-[8px] px-2.5 py-1.5 text-left text-[12.5px] font-medium tracking-tight text-white/85 hover:bg-white/[0.06]"
                  >
                    <span className="capitalize">{v}</span>
                    {v === filter && (
                      <Check className="h-3.5 w-3.5 text-[#5E5CE6]" strokeWidth={2.5} />
                    )}
                  </button>
                </li>
              ))}
            </ul>
          </Popover>
        </DemoCard>
      </DocsSection>

      <DocsSection title="Settings — right + center">
        <DemoCard className="min-h-[260px]">
          <button
            ref={setRef}
            type="button"
            onClick={() => setSetOpen2((o) => !o)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.04] text-white/85 backdrop-blur transition-colors hover:bg-white/[0.08]"
            aria-label="Settings"
          >
            <Settings className="h-4 w-4" strokeWidth={2.25} />
          </button>

          <Popover
            open={setOpen2}
            onOpenChange={setSetOpen2}
            anchorRef={setRef}
            side="right"
            align="center"
          >
            <div className="w-[240px] p-3">
              <p className="mb-2 text-[10.5px] font-semibold uppercase tracking-[0.16em] text-white/40">
                Quick Settings
              </p>
              <label className="flex cursor-pointer items-center justify-between gap-3 rounded-[8px] px-2 py-1.5 hover:bg-white/[0.05]">
                <span className="text-[12.5px] tracking-tight text-white/85">
                  Notifications
                </span>
                <Toggle on={notif} onChange={setNotif} />
              </label>
              <label className="flex cursor-pointer items-center justify-between gap-3 rounded-[8px] px-2 py-1.5 hover:bg-white/[0.05]">
                <span className="text-[12.5px] tracking-tight text-white/85">
                  Sound
                </span>
                <Toggle on={sound} onChange={setSound} />
              </label>
            </div>
          </Popover>
        </DemoCard>
      </DocsSection>

      <DocsSection title="Side picker — try every placement">
        <DemoCard className="min-h-[340px]">
          <div className="flex flex-col items-center gap-4">
            <SegmentedControl
              size="sm"
              value={demoSide}
              onValueChange={(v) => {
                setDemoSide(v as typeof demoSide)
                setDemoOpen(true)
              }}
              options={[
                { value: 'top', label: 'Top' },
                { value: 'right', label: 'Right' },
                { value: 'bottom', label: 'Bottom' },
                { value: 'left', label: 'Left' },
              ]}
            />
            <button
              ref={demoRef}
              type="button"
              onClick={() => setDemoOpen((o) => !o)}
              className="inline-flex h-12 w-32 items-center justify-center gap-1.5 rounded-full border border-white/[0.08] bg-white/[0.04] text-[13px] font-semibold tracking-tight text-white/85 backdrop-blur hover:bg-white/[0.08]"
            >
              <MoreHorizontal className="h-4 w-4" strokeWidth={2.25} />
              Anchor
            </button>
            <p className="text-[11px] tracking-tight text-white/45">
              side: <span className="font-mono text-white/65">{demoSide}</span> · auto-flips
              if there&apos;s no room
            </p>

            <Popover
              open={demoOpen}
              onOpenChange={setDemoOpen}
              anchorRef={demoRef}
              side={demoSide}
              align="center"
            >
              <div className="w-[180px] p-3">
                <p className="text-[12px] font-semibold tracking-tight text-white">
                  Placed: {demoSide}
                </p>
                <p className="mt-1 text-[11px] tracking-tight text-white/55">
                  Anchored via ref, repositions on scroll &amp; resize.
                </p>
              </div>
            </Popover>
          </div>
        </DemoCard>
      </DocsSection>

      <DocsSection title="Usage">
        <CodeBlock code={SNIPPET} language="tsx" />
      </DocsSection>

      <DocsSection title="Props">
        <ul className="grid gap-2 sm:grid-cols-2">
          {[
            ['open / onOpenChange', 'Controlled open state.'],
            ['anchorRef', 'Ref to the element to anchor against.'],
            ['side', '"top" | "right" | "bottom" | "left". Default "bottom".'],
            ['align', '"start" | "center" | "end". Default "center".'],
            ['offset', 'Distance in px between popover and anchor. Default 8.'],
            ['arrow', 'Render the small arrow pointing at the anchor. Default true.'],
            ['closeOnOutsideClick', 'Click outside dismisses. Default true.'],
            ['closeOnEsc', 'Esc dismisses. Default true.'],
            ['className', 'Extra classes on the popover.'],
          ].map(([n, b]) => (
            <li key={n} className="rounded-lg border border-white/10 bg-white/[0.02] p-3">
              <code className="font-mono text-xs text-white">{n}</code>
              <p className="mt-1 text-xs text-white/60">{b}</p>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-xs text-white/45">
          The popover auto-flips to the opposite side if the preferred placement would
          overflow the viewport, then clamps within an 8px margin.
        </p>
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

function Toggle({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      onClick={() => onChange(!on)}
      className="relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full transition-colors"
      style={{
        background: on ? '#30D158' : 'rgba(255,255,255,0.12)',
        boxShadow: on
          ? '0 0 0 0.5px rgba(255,255,255,0.15) inset, 0 0 12px -2px #30D15880'
          : '0 0 0 0.5px rgba(255,255,255,0.08) inset',
      }}
    >
      <span
        className="inline-block h-4 w-4 rounded-full bg-white transition-transform"
        style={{
          transform: on ? 'translateX(18px)' : 'translateX(2px)',
          boxShadow: '0 1px 2px rgba(0,0,0,0.3)',
        }}
      />
    </button>
  )
}
