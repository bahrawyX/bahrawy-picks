'use client'

import { BrowserWindow } from '@/components/bahrawy/browser-window'
import { CodeBlock } from '@/components/showcase/code-block'
import { DocsPage, DocsSection, DemoCard } from '@/components/showcase/docs-page'

const SNIPPET = `import { BrowserWindow } from '@/components/bahrawy/browser-window'

<BrowserWindow
  url="https://bahrawy-picks.vercel.app/components"
  animateUrl
  secure
  variant="dark"
  height={420}
>
  <Screenshot />
</BrowserWindow>`

function HeroContent() {
  return (
    <div
      className="flex h-full w-full items-center justify-center"
      style={{
        background:
          'radial-gradient(120% 100% at 30% 20%, rgba(255,255,255,0.06), transparent 55%), radial-gradient(120% 100% at 80% 80%, rgba(255,255,255,0.04), transparent 55%), #0a0a0c',
      }}
    >
      <div className="px-8 text-center">
        <p className="text-[10px] uppercase tracking-[0.32em] text-white/45">
          One library
        </p>
        <h3 className="mt-2 text-balance font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl">
          151 components.<br />Copy, paste, ship.
        </h3>
        <p className="mt-3 text-[12px] text-white/55">
          From form primitives to WebGL shaders.
        </p>
      </div>
    </div>
  )
}

function MarketingContent() {
  return (
    <div
      className="flex h-full w-full flex-col items-center justify-center p-6"
      style={{ background: '#fafaf9' }}
    >
      <p className="text-[10px] uppercase tracking-[0.32em] text-zinc-500">
        Pricing
      </p>
      <h3 className="mt-2 text-balance font-display text-4xl font-semibold tracking-tight text-zinc-900">
        Free for hobby projects.
      </h3>
      <p className="mt-3 max-w-md text-center text-[12.5px] text-zinc-500">
        Pay only when you ship to production. No hidden fees, cancel any time.
      </p>
      <button className="mt-5 rounded-full bg-zinc-900 px-4 py-1.5 text-[12.5px] font-semibold text-white">
        Start free →
      </button>
    </div>
  )
}

export default function BrowserWindowDocs() {
  return (
    <DocsPage
      title="Browser Window"
      slug="browser-window"
      description="The mac-window-chrome wrapper every product landing page needs to frame a screenshot. Big Sur / Sequoia accuracy — radial-gradient traffic lights with hover glyphs, vibrancy title bar, lucide nav buttons, and a centered URL bar with a lock icon. Pass animateUrl and the URL types itself in character-by-character with a blinking caret."
      category="22 · decoration"
    >
      <DocsSection title="Dark — animated URL with secure indicator">
        <DemoCard className="min-h-[520px]">
          <div className="w-full max-w-3xl">
            <BrowserWindow
              url="https://bahrawy-picks.vercel.app/components"
              animateUrl
              urlSpeed={28}
              variant="dark"
              secure
              height={400}
              title="Components — Bahrawy"
            >
              <HeroContent />
            </BrowserWindow>
          </div>
        </DemoCard>
      </DocsSection>

      <DocsSection title="Light — Big Sur neutral frame">
        <DemoCard className="min-h-[520px]">
          <div className="w-full max-w-3xl">
            <BrowserWindow
              url="https://stripe.com/pricing"
              variant="light"
              secure
              height={400}
            >
              <MarketingContent />
            </BrowserWindow>
          </div>
        </DemoCard>
      </DocsSection>

      <DocsSection title="Minimal — no action buttons">
        <DemoCard className="min-h-[280px]">
          <div className="w-full max-w-xl">
            <BrowserWindow
              url="docs.bahrawy-picks.vercel.app/quickstart"
              variant="dark"
              showActions={false}
              height={140}
            >
              <div className="flex h-full items-center justify-center text-[12px] text-white/55">
                Quickstart guide
              </div>
            </BrowserWindow>
          </div>
        </DemoCard>
      </DocsSection>

      <DocsSection title="Usage">
        <CodeBlock code={SNIPPET} language="tsx" />
      </DocsSection>

      <DocsSection title="Props">
        <ul className="grid gap-2 sm:grid-cols-2">
          {[
            ['url', 'String shown in the address bar.'],
            ['animateUrl', 'Type the URL out character-by-character on mount. Default false.'],
            ['urlSpeed', 'Chars/sec when animating. Default 32.'],
            ['variant', '"dark" (Sequoia) or "light" (Big Sur). Default "dark".'],
            ['showActions', 'Back / forward / reload buttons. Default true.'],
            ['secure', 'Color the lock icon green to indicate HTTPS.'],
            ['title', 'Optional title (e.g. "Inbox · Linear") shown on right.'],
            ['height', 'Body height — passes through to the content slot.'],
            ['children', 'Content rendered below the chrome.'],
            ['className', 'Extra classes on the outer frame.'],
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
