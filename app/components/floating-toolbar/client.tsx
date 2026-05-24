'use client'

import * as React from 'react'
import { FloatingToolbar } from '@/components/bahrawy/floating-toolbar'
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Link as LinkIcon,
  Quote,
  Code,
  Sparkles,
  MessageSquare,
} from 'lucide-react'
import { CodeBlock } from '@/components/showcase/code-block'
import { DocsPage, DocsSection, DemoCard } from '@/components/showcase/docs-page'

const SNIPPET = `import { FloatingToolbar } from '@/components/bahrawy/floating-toolbar'
import { Bold, Italic, Link as LinkIcon } from 'lucide-react'

const editorRef = useRef<HTMLDivElement>(null)

<div ref={editorRef} contentEditable suppressContentEditableWarning>
  Highlight any text in this editor…
</div>

<FloatingToolbar
  targetRef={editorRef}
  actions={[
    { id: 'bold',   label: 'Bold',   icon: <Bold />,   onClick: (text) => alert(text) },
    { id: 'italic', label: 'Italic', icon: <Italic /> },
    { id: 'link',   label: 'Link',   icon: <LinkIcon />, divider: true },
  ]}
/>`

const LOREM = `When in the course of human events, it becomes necessary for a designer to dissolve the friction between intent and action, a decent respect to the user demands they should declare the gestures which impel them to the workflow. We hold these truths to be self-evident: that all selections are not equal, that they are endowed by the cursor with certain unalienable affordances, that among these are bold, italic, and the pursuit of perfect kerning.`

const NOTE = `Highlights from yesterday's review:

— Onboarding still loses people at step 3. The "connect your data" screen needs an example dataset they can click to skip ahead.
— The new pricing toggle is doing its job; conversions on Pro went from 4.1% → 6.8%.
— File previews on slow connections still flash a layout shift. Reserve the aspect-ratio box and we're done.
— Q4 OKR for performance: shave 300ms off TTFB on the docs domain. Caching the registry should get us most of the way.`

export default function FloatingToolbarDocs() {
  const editorRef = React.useRef<HTMLDivElement>(null)
  const noteRef = React.useRef<HTMLDivElement>(null)
  const [lastAction, setLastAction] = React.useState<string | null>(null)
  const [aiNote, setAiNote] = React.useState<string | null>(null)

  const handle = (id: string) => (text: string) =>
    setLastAction(`${id}: "${text.slice(0, 60)}${text.length > 60 ? '…' : ''}"`)

  return (
    <DocsPage
      title="Floating Toolbar"
      slug="floating-toolbar"
      description="The Notion/Linear-style action bar that appears when you highlight text. Watches the selection inside a wrapped surface (or anywhere if no target), measures the selection rect, and floats a vibrancy pill toolbar above it. Auto-flips below if there's no room. Each action fires with the selected text + rect so you can wire bold/italic/link/comment/ask-AI/etc."
      category="162 · overlay"
    >
      <DocsSection title="Try it: highlight text in this editor">
        <DemoCard className="min-h-[420px] items-start py-8">
          <div className="w-full max-w-2xl">
            <div
              ref={editorRef}
              contentEditable
              suppressContentEditableWarning
              spellCheck={false}
              className="min-h-[200px] rounded-[16px] border border-white/[0.08] bg-white/[0.02] px-5 py-4 text-[14px] leading-[1.7] tracking-tight text-white/85 outline-none focus:border-white/15"
              style={{ caretColor: '#5E5CE6' }}
            >
              {LOREM}
            </div>

            <div className="mt-3 flex min-h-[28px] items-center justify-between text-[11.5px] tracking-tight text-white/45">
              <span>Try highlighting a word or paragraph above.</span>
              {lastAction && (
                <code className="font-mono text-white/65">{lastAction}</code>
              )}
            </div>

            <FloatingToolbar
              targetRef={editorRef}
              actions={[
                { id: 'bold', label: 'Bold', icon: <Bold strokeWidth={2.5} />, onClick: (t) => handle('bold')(t) },
                { id: 'italic', label: 'Italic', icon: <Italic strokeWidth={2.5} />, onClick: (t) => handle('italic')(t) },
                { id: 'underline', label: 'Underline', icon: <Underline strokeWidth={2.5} />, onClick: (t) => handle('underline')(t) },
                { id: 'strike', label: 'Strikethrough', icon: <Strikethrough strokeWidth={2.5} />, onClick: (t) => handle('strike')(t) },
                { id: 'link', label: 'Link', icon: <LinkIcon strokeWidth={2.5} />, divider: true, onClick: (t) => handle('link')(t) },
                { id: 'code', label: 'Code', icon: <Code strokeWidth={2.5} />, onClick: (t) => handle('code')(t) },
                { id: 'quote', label: 'Quote', icon: <Quote strokeWidth={2.5} />, onClick: (t) => handle('quote')(t) },
              ]}
            />
          </div>
        </DemoCard>
      </DocsSection>

      <DocsSection title="Custom actions — Ask AI + Comment">
        <DemoCard className="min-h-[440px] items-start py-8">
          <div className="w-full max-w-2xl">
            <div
              ref={noteRef}
              className="rounded-[16px] border border-white/[0.08] bg-white/[0.02] px-5 py-4 text-[13.5px] leading-[1.75] tracking-tight text-white/85"
              style={{ whiteSpace: 'pre-wrap' }}
            >
              {NOTE}
            </div>

            {aiNote && (
              <div
                className="mt-3 rounded-[14px] border border-[#5E5CE6]/30 bg-[#5E5CE6]/[0.08] px-4 py-3 text-[12.5px] tracking-tight text-white/85 backdrop-blur"
                style={{
                  boxShadow:
                    '0 1px 0 rgba(255,255,255,0.06) inset, 0 12px 28px -10px rgba(94,92,230,0.45)',
                }}
              >
                <div className="mb-1 flex items-center gap-1.5 text-[10.5px] font-semibold uppercase tracking-[0.16em] text-[#A99CFF]">
                  <Sparkles className="h-3 w-3" strokeWidth={2.5} /> Bahrawy AI
                </div>
                {aiNote}
              </div>
            )}

            <FloatingToolbar
              targetRef={noteRef}
              accent="#5E5CE6"
              actions={[
                {
                  id: 'ai',
                  label: 'Ask AI',
                  icon: <Sparkles strokeWidth={2.5} />,
                  active: true,
                  onClick: (t) =>
                    setAiNote(
                      `Summary of your ${t.split(/\s+/).length}-word selection: "${t.slice(0, 80)}${t.length > 80 ? '…' : ''}" — looks like a high-signal observation worth turning into a task.`,
                    ),
                },
                { id: 'comment', label: 'Comment', icon: <MessageSquare strokeWidth={2.5} />, divider: true, onClick: (t) => handle('comment')(t) },
                { id: 'link', label: 'Link', icon: <LinkIcon strokeWidth={2.5} />, onClick: (t) => handle('link')(t) },
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
            ['actions', 'FloatingToolbarAction[] — { id, label, icon?, divider?, active?, onClick }.'],
            ['targetRef', 'Container the toolbar listens to for selections. Defaults to anywhere.'],
            ['offset', 'Distance above (or below if flipped) the selection. Default 10.'],
            ['accent', 'Active-action accent. Default SF indigo #5E5CE6.'],
            ['minLength', 'Minimum selected-text length before showing. Default 1.'],
            ['className', 'Extra classes on the toolbar.'],
          ].map(([n, b]) => (
            <li key={n} className="rounded-lg border border-white/10 bg-white/[0.02] p-3">
              <code className="font-mono text-xs text-white">{n}</code>
              <p className="mt-1 text-xs text-white/60">{b}</p>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-xs text-white/45">
          The toolbar auto-flips below the selection when there&apos;s no room above. Each action&apos;s{' '}
          <code className="font-mono">onClick</code> receives the selected text + the bounding rect.
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
