'use client'

import * as React from 'react'
import { BottomSheet } from '@/components/bahrawy/bottom-sheet'
import {
  Share,
  AirplayIcon,
  Copy,
  MessageSquare,
  Mail,
  Bookmark,
  Link as LinkIcon,
  Printer,
  Music2,
  ListMusic,
  Heart,
  Plus,
  Shuffle,
} from 'lucide-react'
import { CodeBlock } from '@/components/showcase/code-block'
import { DocsPage, DocsSection, DemoCard } from '@/components/showcase/docs-page'

const SNIPPET = `import { BottomSheet } from '@/components/bahrawy/bottom-sheet'

const [open, setOpen] = useState(false)

<BottomSheet
  open={open}
  onOpenChange={setOpen}
  detents={[0.4, 0.92]}
  defaultDetent={0}
  title="Share"
>
  <div>… your sheet content …</div>
</BottomSheet>`

function ShareGrid() {
  const items = [
    { icon: <MessageSquare className="h-5 w-5" strokeWidth={2.25} />, label: 'Messages', tint: '#30D158' },
    { icon: <Mail className="h-5 w-5" strokeWidth={2.25} />, label: 'Mail', tint: '#0A84FF' },
    { icon: <AirplayIcon className="h-5 w-5" strokeWidth={2.25} />, label: 'AirDrop', tint: '#5E5CE6' },
    { icon: <Copy className="h-5 w-5" strokeWidth={2.25} />, label: 'Copy', tint: '#FF9F0A' },
    { icon: <LinkIcon className="h-5 w-5" strokeWidth={2.25} />, label: 'Copy Link', tint: '#64D2FF' },
    { icon: <Bookmark className="h-5 w-5" strokeWidth={2.25} />, label: 'Save', tint: '#FF375F' },
    { icon: <Printer className="h-5 w-5" strokeWidth={2.25} />, label: 'Print', tint: '#BF5AF2' },
    { icon: <Share className="h-5 w-5" strokeWidth={2.25} />, label: 'More', tint: '#8E8E93' },
  ]
  return (
    <div className="grid grid-cols-4 gap-3">
      {items.map((it) => (
        <button
          key={it.label}
          type="button"
          className="group flex flex-col items-center gap-1.5 rounded-2xl px-2 py-3 transition-colors hover:bg-white/[0.04]"
        >
          <span
            className="inline-flex h-12 w-12 items-center justify-center rounded-2xl text-white"
            style={{
              background: `linear-gradient(180deg, ${it.tint}33 0%, ${it.tint}1c 100%)`,
              border: `0.5px solid ${it.tint}55`,
              boxShadow: `0 1px 0 rgba(255,255,255,0.08) inset, 0 6px 16px -8px ${it.tint}66`,
            }}
          >
            {it.icon}
          </span>
          <span className="text-[10.5px] font-medium tracking-tight text-white/85">
            {it.label}
          </span>
        </button>
      ))}
    </div>
  )
}

function NowPlayingSheetBody() {
  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <div
          className="h-16 w-16 shrink-0 rounded-2xl"
          style={{
            background:
              'linear-gradient(135deg, #FF375F 0%, #BF5AF2 50%, #5E5CE6 100%)',
            boxShadow: '0 12px 28px -8px rgba(94,92,230,0.55)',
          }}
        />
        <div className="min-w-0 flex-1">
          <p className="truncate text-[15px] font-semibold tracking-tight text-white">
            Midnight City
          </p>
          <p className="truncate text-[12.5px] text-white/55">M83 · Hurry Up, We&apos;re Dreaming</p>
        </div>
        <button
          type="button"
          className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.04] text-white/85"
        >
          <Heart className="h-4 w-4" strokeWidth={2.25} />
        </button>
      </div>

      <ul className="divide-y divide-white/[0.05] overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.015]">
        {[
          { icon: <ListMusic className="h-4 w-4" strokeWidth={2.25} />, label: 'Add to Playlist' },
          { icon: <Plus className="h-4 w-4" strokeWidth={2.25} />, label: 'Add to Library' },
          { icon: <Shuffle className="h-4 w-4" strokeWidth={2.25} />, label: 'Play Next' },
          { icon: <Music2 className="h-4 w-4" strokeWidth={2.25} />, label: 'View Album' },
          { icon: <Share className="h-4 w-4" strokeWidth={2.25} />, label: 'Share Song…' },
        ].map((row) => (
          <li key={row.label}>
            <button
              type="button"
              className="flex w-full items-center gap-3 px-4 py-3 text-left text-[13px] font-medium tracking-tight text-white/90 transition-colors hover:bg-white/[0.04]"
            >
              <span className="text-white/55">{row.icon}</span>
              <span className="flex-1 truncate">{row.label}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default function BottomSheetDocs() {
  const [shareOpen, setShareOpen] = React.useState(false)
  const [songOpen, setSongOpen] = React.useState(false)
  const [, setDetent] = React.useState(0)

  return (
    <DocsPage
      title="Bottom Sheet"
      slug="bottom-sheet"
      description="An iOS share-sheet-style drawer. Anchors to the bottom of the viewport with a vibrancy backdrop, supports any number of snap detents (e.g. peek 40%, full 92%), drags between them with momentum, and dismisses with a flick down past the smallest detent. Apple spring physics throughout, generous 28px top radius, multi-layer shadow."
      category="163 · overlay"
    >
      <DocsSection title="Share sheet — two detents (peek 40%, full 92%)">
        <DemoCard className="min-h-[300px]">
          <div className="flex flex-col items-center gap-3">
            <button
              type="button"
              onClick={() => setShareOpen(true)}
              className="rounded-full border border-white/15 bg-white px-5 py-2 text-[13px] font-semibold tracking-tight text-black transition-transform hover:scale-[1.03]"
            >
              Open Share Sheet
            </button>
            <p className="text-[11.5px] tracking-tight text-white/45">
              Drag the handle up / down to switch detents · flick down to dismiss
            </p>
          </div>

          <BottomSheet
            open={shareOpen}
            onOpenChange={setShareOpen}
            detents={[0.4, 0.92]}
            defaultDetent={0}
            title="Share"
            onDetentChange={setDetent}
          >
            <ShareGrid />
            <div className="mt-5 grid gap-2">
              <button
                type="button"
                className="rounded-2xl border border-white/[0.08] bg-white/[0.04] px-4 py-3 text-[13px] font-medium tracking-tight text-white/90 backdrop-blur"
              >
                Edit Actions…
              </button>
              <button
                type="button"
                onClick={() => setShareOpen(false)}
                className="rounded-2xl bg-white px-4 py-3 text-[13px] font-semibold tracking-tight text-black"
              >
                Cancel
              </button>
            </div>
          </BottomSheet>
        </DemoCard>
      </DocsSection>

      <DocsSection title="Now playing — three detents">
        <DemoCard className="min-h-[300px]">
          <div className="flex flex-col items-center gap-3">
            <button
              type="button"
              onClick={() => setSongOpen(true)}
              className="rounded-full bg-gradient-to-r from-[#FF375F] via-[#BF5AF2] to-[#5E5CE6] px-5 py-2 text-[13px] font-semibold tracking-tight text-white transition-transform hover:scale-[1.03]"
              style={{ boxShadow: '0 12px 28px -8px rgba(191,90,242,0.5)' }}
            >
              ♫ Open Now Playing
            </button>
            <p className="text-[11.5px] tracking-tight text-white/45">
              Three detents: peek 30%, half 55%, full 92%
            </p>
          </div>

          <BottomSheet
            open={songOpen}
            onOpenChange={setSongOpen}
            detents={[0.3, 0.55, 0.92]}
            defaultDetent={1}
            title="Now Playing"
            headerAction={
              <button
                type="button"
                onClick={() => setSongOpen(false)}
                className="rounded-full bg-white/[0.08] px-3 py-1 text-[12px] font-semibold tracking-tight text-white"
              >
                Done
              </button>
            }
          >
            <NowPlayingSheetBody />
          </BottomSheet>
        </DemoCard>
      </DocsSection>

      <DocsSection title="Usage">
        <CodeBlock code={SNIPPET} language="tsx" />
      </DocsSection>

      <DocsSection title="Props">
        <ul className="grid gap-2 sm:grid-cols-2">
          {[
            ['open / onOpenChange', 'Controlled open state.'],
            ['detents', 'Snap heights as fractions of viewport. Sorted ascending. Default [0.4, 0.92].'],
            ['defaultDetent', 'Index of the initial detent. Default 0.'],
            ['onDetentChange', '(idx) => void — fires when the user snaps to a different detent.'],
            ['showHandle', 'Show the small drag-handle pill at the top. Default true.'],
            ['closeOnBackdropClick', 'Clicking the dimmed backdrop dismisses. Default true.'],
            ['closeOnEsc', 'Esc key dismisses. Default true.'],
            ['title', 'Optional title shown in a header bar.'],
            ['headerAction', 'Right-aligned header slot (e.g. a Done button).'],
            ['className', 'Extra classes on the sheet container.'],
          ].map(([n, b]) => (
            <li key={n} className="rounded-lg border border-white/10 bg-white/[0.02] p-3">
              <code className="font-mono text-xs text-white">{n}</code>
              <p className="mt-1 text-xs text-white/60">{b}</p>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-xs text-white/45">
          The sheet projects drag-end position with{' '}
          <code className="font-mono">offset + velocity × 0.18</code>, then snaps to the
          nearest detent (or dismisses if the closest target is &quot;hidden&quot;).
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
