'use client'

import * as React from 'react'
import { Dialog } from '@/components/bahrawy/dialog'
import { CodeBlock } from '@/components/showcase/code-block'
import { DocsPage, DocsSection, DemoCard } from '@/components/showcase/docs-page'
import { Trash2, KeySquare, Sparkles } from 'lucide-react'

const SNIPPET = `import { Dialog } from '@/components/bahrawy/dialog'

const [open, setOpen] = useState(false)

<Dialog
  open={open}
  onOpenChange={setOpen}
  title="Delete project"
  description="This action cannot be undone. All tasks, files, and members will be removed."
  intent="destructive"
  footer={
    <>
      <Button variant="secondary" onClick={() => setOpen(false)}>Cancel</Button>
      <Button variant="destructive" onClick={confirmDelete}>Delete</Button>
    </>
  }
/>`

function GlassButton({
  children,
  onClick,
  intent = 'default',
}: {
  children: React.ReactNode
  onClick?: () => void
  intent?: 'default' | 'primary' | 'destructive'
}) {
  const style =
    intent === 'destructive'
      ? 'bg-[#FF453A] text-white hover:brightness-110'
      : intent === 'primary'
      ? 'bg-white text-black hover:bg-white/90'
      : 'border border-white/[0.08] bg-white/[0.04] text-white/90 backdrop-blur hover:bg-white/[0.1]'
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center justify-center gap-1.5 rounded-full px-4 py-1.5 text-[13px] font-semibold tracking-tight transition-colors ${style}`}
    >
      {children}
    </button>
  )
}

export default function DialogDocs() {
  const [deleteOpen, setDeleteOpen] = React.useState(false)
  const [signinOpen, setSigninOpen] = React.useState(false)
  const [aiOpen, setAiOpen] = React.useState(false)
  const [email, setEmail] = React.useState('')

  return (
    <DocsPage
      title="Dialog"
      slug="dialog"
      description="Apple-style centered modal. Vibrancy backdrop with blur, scale-in spring entrance, focus trap that restores the previously-active element on close, ESC + backdrop click to dismiss, body scroll lock, role='dialog' + aria-modal. Slots: title, description, body children, footer. Intent: default | destructive."
      category="166 · overlay"
    >
      <DocsSection title="Destructive — confirm delete">
        <DemoCard className="min-h-[280px]">
          <GlassButton intent="destructive" onClick={() => setDeleteOpen(true)}>
            <Trash2 className="h-3.5 w-3.5" strokeWidth={2.5} />
            Delete project
          </GlassButton>

          <Dialog
            open={deleteOpen}
            onOpenChange={setDeleteOpen}
            intent="destructive"
            title="Delete project?"
            description="This action cannot be undone. All tasks, files, and members will be removed permanently."
            footer={
              <>
                <GlassButton onClick={() => setDeleteOpen(false)}>Cancel</GlassButton>
                <GlassButton
                  intent="destructive"
                  onClick={() => {
                    setDeleteOpen(false)
                  }}
                >
                  Delete
                </GlassButton>
              </>
            }
          />
        </DemoCard>
      </DocsSection>

      <DocsSection title="With form input — sign in">
        <DemoCard className="min-h-[280px]">
          <GlassButton intent="primary" onClick={() => setSigninOpen(true)}>
            <KeySquare className="h-3.5 w-3.5" strokeWidth={2.5} />
            Sign in
          </GlassButton>

          <Dialog
            open={signinOpen}
            onOpenChange={setSigninOpen}
            title="Welcome back"
            description="Enter your email to receive a magic link."
            width={420}
            footer={
              <>
                <GlassButton onClick={() => setSigninOpen(false)}>Cancel</GlassButton>
                <GlassButton
                  intent="primary"
                  onClick={() => {
                    setSigninOpen(false)
                  }}
                >
                  Send link
                </GlassButton>
              </>
            }
          >
            <label className="block">
              <span className="block text-[10.5px] font-semibold uppercase tracking-[0.16em] text-white/40">
                Email
              </span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@bahrawy.me"
                className="mt-1.5 w-full rounded-[10px] border border-white/[0.08] bg-white/[0.04] px-3 py-2 text-[13px] tracking-tight text-white outline-none placeholder:text-white/35 focus:border-white/20"
              />
            </label>
          </Dialog>
        </DemoCard>
      </DocsSection>

      <DocsSection title="Rich content — Bahrawy AI prompt">
        <DemoCard className="min-h-[280px]">
          <GlassButton onClick={() => setAiOpen(true)}>
            <Sparkles className="h-3.5 w-3.5" strokeWidth={2.5} />
            Ask Bahrawy AI
          </GlassButton>

          <Dialog
            open={aiOpen}
            onOpenChange={setAiOpen}
            title="What would you like to make?"
            description="Describe a component and we'll scaffold it from this library."
            width={480}
            footer={
              <>
                <GlassButton onClick={() => setAiOpen(false)}>Close</GlassButton>
                <GlassButton intent="primary" onClick={() => setAiOpen(false)}>
                  Generate
                </GlassButton>
              </>
            }
          >
            <textarea
              rows={3}
              placeholder="e.g. A pricing table with three tiers, a monthly/annual switch, and a popular badge on the middle one."
              className="w-full resize-none rounded-[10px] border border-white/[0.08] bg-white/[0.04] px-3 py-2 text-[13px] leading-relaxed tracking-tight text-white outline-none placeholder:text-white/35 focus:border-white/20"
            />
            <div className="mt-3 flex flex-wrap gap-1.5">
              {['hero', 'pricing', 'dashboard', 'auth', 'onboarding'].map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-white/[0.08] bg-white/[0.04] px-2.5 py-0.5 text-[10.5px] font-medium tracking-tight text-white/70"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </Dialog>
        </DemoCard>
      </DocsSection>

      <DocsSection title="Usage">
        <CodeBlock code={SNIPPET} language="tsx" />
      </DocsSection>

      <DocsSection title="Props">
        <ul className="grid gap-2 sm:grid-cols-2">
          {[
            ['open / onOpenChange', 'Controlled open state.'],
            ['title', 'Bold header text (gets aria-labelledby).'],
            ['description', 'Secondary header line (gets aria-describedby).'],
            ['footer', 'Right-aligned footer slot — usually action buttons.'],
            ['intent', '"default" | "destructive". Destructive colors the title SF red.'],
            ['width', 'Max width in px. Default 440.'],
            ['showCloseButton', 'Render the small × close button. Default true.'],
            ['closeOnBackdropClick', 'Backdrop click dismisses. Default true.'],
            ['closeOnEsc', 'Esc dismisses. Default true.'],
            ['className', 'Extra classes on the panel.'],
          ].map(([n, b]) => (
            <li key={n} className="rounded-lg border border-white/10 bg-white/[0.02] p-3">
              <code className="font-mono text-xs text-white">{n}</code>
              <p className="mt-1 text-xs text-white/60">{b}</p>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-xs text-white/45">
          Focus is trapped inside the panel (Tab + Shift+Tab cycle through the focusables),
          and on close the previously-active element is restored.
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
