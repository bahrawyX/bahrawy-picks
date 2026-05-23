'use client'

import { useState } from 'react'
import {
  ToastProvider,
  useToast,
  type ToastPosition,
} from '@/components/bahrawy/toast'
import { CodeBlock } from '@/components/showcase/code-block'
import { DocsPage, DocsSection, DemoCard } from '@/components/showcase/docs-page'
import {
  ControlPanel,
  SelectControl,
  SliderControl,
} from '@/components/showcase/control-panel'

/* ------------------------------------------------------------------ */
/*  Inner component that uses the hook                                 */
/* ------------------------------------------------------------------ */

function ToastButtons() {
  const { push } = useToast()
  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      <button
        type="button"
        onClick={() => push({ title: 'Saved.', description: 'Your changes are in the cloud.' })}
        className="rounded-full border border-white/15 bg-white/[0.04] px-4 py-2 text-sm text-white/90 hover:bg-white/10"
      >
        Default
      </button>
      <button
        type="button"
        onClick={() => push({ intent: 'success', title: 'Deployed!', description: 'Build #4082 went live in 4.2s.' })}
        className="rounded-full border border-emerald-400/30 bg-emerald-500/10 px-4 py-2 text-sm text-emerald-300 hover:bg-emerald-500/20"
      >
        Success
      </button>
      <button
        type="button"
        onClick={() => push({ intent: 'error', title: 'Save failed.', description: 'Check your connection and try again.' })}
        className="rounded-full border border-rose-400/30 bg-rose-500/10 px-4 py-2 text-sm text-rose-300 hover:bg-rose-500/20"
      >
        Error
      </button>
      <button
        type="button"
        onClick={() => push({ intent: 'info', title: 'New version available.', description: 'Refresh to load v2.3.' })}
        className="rounded-full border border-sky-400/30 bg-sky-500/10 px-4 py-2 text-sm text-sky-300 hover:bg-sky-500/20"
      >
        Info
      </button>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function ToastDocs() {
  const [position, setPosition] = useState<ToastPosition>('bottom-right')
  const [duration, setDuration] = useState(3500)

  const snippet = `import { ToastProvider, useToast } from '@/components/bahrawy/toast'

function App() {
  return (
    <ToastProvider position="${position}" duration={${duration}}>
      <YourApp />
    </ToastProvider>
  )
}

function SomeChild() {
  const { push } = useToast()
  return (
    <button onClick={() => push({ intent: 'success', title: 'Saved!' })}>
      Save
    </button>
  )
}`

  return (
    <DocsPage
      title="Toast"
      slug="toast"
      description="Imperative toast notifications. Wrap your tree (or section) in <ToastProvider>, then call useToast().push() anywhere inside. Toasts slide in, stack with offset, and auto-dismiss."
      category="63 · overlay"
    >
      <DocsSection title="Live demo" description="Click any button to fire a toast. They stack at the configured corner.">
        <ToastProvider position={position} duration={duration} key={position}>
          <DemoCard className="min-h-[300px]">
            <ToastButtons />
          </DemoCard>
        </ToastProvider>

        <ControlPanel>
          <SelectControl
            label="Position"
            value={position}
            onChange={(v) => setPosition(v as ToastPosition)}
            options={[
              { label: 'top-right', value: 'top-right' },
              { label: 'top-left', value: 'top-left' },
              { label: 'bottom-right', value: 'bottom-right' },
              { label: 'bottom-left', value: 'bottom-left' },
            ]}
          />
          <SliderControl
            label="Duration"
            value={duration}
            onChange={setDuration}
            min={1000}
            max={8000}
            step={250}
            unit="ms"
          />
        </ControlPanel>
      </DocsSection>

      <DocsSection title="Usage">
        <CodeBlock code={snippet} language="tsx" />
      </DocsSection>

      <DocsSection title="Props (Provider)">
        <ul className="grid gap-2 sm:grid-cols-2">
          {[
            ['children', 'Your app or subtree.'],
            ['position', '"top-right" | "top-left" | "bottom-right" | "bottom-left". Default "bottom-right".'],
            ['duration', 'Default toast lifetime in ms. Default 3500.'],
            ['max', 'Cap on concurrent toasts. Default 5.'],
          ].map(([n, b]) => (
            <li key={n} className="rounded-lg border border-white/10 bg-white/[0.02] p-3">
              <code className="font-mono text-xs text-white">{n}</code>
              <p className="mt-1 text-xs text-white/60">{b}</p>
            </li>
          ))}
        </ul>
      </DocsSection>

      <DocsSection title="push() shape">
        <ul className="grid gap-2 sm:grid-cols-2">
          {[
            ['title', 'string — main label.'],
            ['description', 'string — optional secondary copy.'],
            ['intent', '"default" | "success" | "error" | "info".'],
            ['duration', 'ms override for this toast.'],
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
