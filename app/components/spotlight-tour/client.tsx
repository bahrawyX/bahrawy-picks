'use client'

import * as React from 'react'
import { SpotlightTour } from '@/components/bahrawy/spotlight-tour'
import { Sparkles, Search, Settings, Send } from 'lucide-react'
import { CodeBlock } from '@/components/showcase/code-block'
import { DocsPage, DocsSection, DemoCard } from '@/components/showcase/docs-page'

const SNIPPET = `import { SpotlightTour } from '@/components/bahrawy/spotlight-tour'

const searchRef = useRef<HTMLButtonElement>(null)
const settingsRef = useRef<HTMLButtonElement>(null)
const [open, setOpen] = useState(false)

<SpotlightTour
  open={open}
  onOpenChange={setOpen}
  steps={[
    { target: searchRef,   title: 'Search anything',  description: 'Press ⌘K from anywhere.' },
    { target: settingsRef, title: 'Customize',        description: 'Theme, shortcuts, integrations.' },
  ]}
/>`

export default function SpotlightTourDocs() {
  const [open, setOpen] = React.useState(false)
  const [step, setStep] = React.useState(0)
  const [finished, setFinished] = React.useState(false)

  const sparkleRef = React.useRef<HTMLButtonElement>(null)
  const inputRef = React.useRef<HTMLInputElement>(null)
  const searchRef = React.useRef<HTMLButtonElement>(null)
  const settingsRef = React.useRef<HTMLButtonElement>(null)
  const sendRef = React.useRef<HTMLButtonElement>(null)

  const start = () => {
    setStep(0)
    setFinished(false)
    setOpen(true)
  }

  return (
    <DocsPage
      title="Spotlight Tour"
      slug="spotlight-tour"
      description="Interactive onboarding overlay. Dim the page, cut a soft-cornered glowing hole around the active target via the box-shadow trick (`box-shadow: 0 0 0 9999px rgba(0,0,0,.78)` on a rect sized to the target), anchor a tooltip with prev/next/skip/step-dots. Targets accept either a ref or a CSS selector. Auto-measures, auto-scroll-into-view, auto-flips tooltip placement based on viewport room. Keyboard nav: ←/→ between steps, Esc to close."
      category="08 · overlay"
    >
      <DocsSection title="Tour a sample toolbar">
        <DemoCard className="min-h-[360px]">
          <div className="flex w-full flex-col items-center gap-5">
            {/* Fake app toolbar with the tour targets */}
            <div className="flex w-full max-w-xl items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.02] px-2 py-2">
              <button
                ref={sparkleRef}
                type="button"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-violet-400/20 text-violet-200 transition-colors hover:bg-violet-400/30"
                aria-label="AI assistant"
              >
                <Sparkles className="h-4 w-4" strokeWidth={2.5} />
              </button>
              <input
                ref={inputRef}
                type="text"
                placeholder="Ask anything…"
                className="min-w-0 flex-1 rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-1.5 text-[12.5px] text-white placeholder:text-white/40 outline-none focus:border-white/25"
              />
              <button
                ref={searchRef}
                type="button"
                aria-label="Search"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full text-white/55 transition-colors hover:bg-white/[0.06] hover:text-white"
              >
                <Search className="h-4 w-4" strokeWidth={2.5} />
              </button>
              <button
                ref={settingsRef}
                type="button"
                aria-label="Settings"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full text-white/55 transition-colors hover:bg-white/[0.06] hover:text-white"
              >
                <Settings className="h-4 w-4" strokeWidth={2.5} />
              </button>
              <button
                ref={sendRef}
                type="button"
                aria-label="Send"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white text-black transition-transform hover:scale-105"
              >
                <Send className="h-4 w-4" strokeWidth={2.5} />
              </button>
            </div>

            {/* Start / status */}
            <div className="flex flex-col items-center gap-2">
              <button
                type="button"
                onClick={start}
                className="rounded-full bg-violet-400 px-4 py-1.5 text-[12.5px] font-semibold text-black transition-transform hover:scale-[1.03]"
              >
                {finished ? 'Restart tour' : 'Start tour'}
              </button>
              {finished && (
                <span className="text-[11px] uppercase tracking-[0.22em] text-emerald-300">
                  ✓ completed
                </span>
              )}
            </div>
          </div>

          <SpotlightTour
            open={open}
            onOpenChange={setOpen}
            step={step}
            onStepChange={setStep}
            onComplete={() => setFinished(true)}
            steps={[
              {
                target: sparkleRef,
                title: 'Meet your assistant',
                description: 'Tap the sparkle to summon ideas, summaries, anything.',
                placement: 'bottom',
              },
              {
                target: inputRef,
                title: 'Ask anything',
                description: 'Plain language works. The assistant figures out the rest.',
                placement: 'bottom',
              },
              {
                target: searchRef,
                title: 'Search the library',
                description: 'Filter by name, category, or dependency.',
                placement: 'bottom',
              },
              {
                target: settingsRef,
                title: 'Customize',
                description: 'Theme, shortcuts, integrations — make it yours.',
                placement: 'bottom',
              },
              {
                target: sendRef,
                title: 'Ship it',
                description: 'One tap and your message is on its way.',
                placement: 'left',
              },
            ]}
          />
        </DemoCard>
      </DocsSection>

      <DocsSection title="Usage">
        <CodeBlock code={SNIPPET} language="tsx" />
      </DocsSection>

      <DocsSection title="Props">
        <ul className="grid gap-2 sm:grid-cols-2">
          {[
            ['steps', 'SpotlightTourStep[] — { target (ref or CSS selector), title, description?, placement? }.'],
            ['open', 'Controlled open state.'],
            ['onOpenChange', '(open) => void — fires when the tour opens or closes.'],
            ['step / onStepChange', 'Controlled active step index.'],
            ['onComplete', 'Fires after the user clicks Done on the last step.'],
            ['onSkip', 'Fires when the user clicks Skip / hits Esc / clicks outside the cutout.'],
            ['spotlightPadding', 'Extra px around the target rect for the cutout. Default 8.'],
            ['spotlightRadius', 'Corner radius of the cutout. Default 12.'],
            ['overlayOpacity', 'Overlay opacity 0..1. Default 0.78.'],
            ['accent', 'Color for the focus ring + step dots + Next button. Default #A78BFA.'],
            ['skipLabel / doneLabel', 'Button label overrides.'],
          ].map(([n, b]) => (
            <li key={n} className="rounded-lg border border-white/10 bg-white/[0.02] p-3">
              <code className="font-mono text-xs text-white">{n}</code>
              <p className="mt-1 text-xs text-white/60">{b}</p>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-xs text-white/45">
          Keyboard: <code className="font-mono">→ / ↓</code> next ·{' '}
          <code className="font-mono">← / ↑</code> prev ·{' '}
          <code className="font-mono">Esc</code> close
        </p>
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
