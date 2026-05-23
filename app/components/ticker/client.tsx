'use client'

import * as React from 'react'
import { Ticker, TickerRow } from '@/components/bahrawy/ticker'
import { CodeBlock } from '@/components/showcase/code-block'
import { DocsPage, DocsSection, DemoCard } from '@/components/showcase/docs-page'

const SNIPPET = `import { Ticker, TickerRow } from '@/components/bahrawy/ticker'

// Single ticker
<Ticker
  symbol="GOOG"
  price={175.41}
  delta={2.13}
  logo={<Logo />}
/>

// Marquee row
<TickerRow
  items={[
    { symbol: 'GOOG', price: 175.41, delta:  2.13 },
    { symbol: 'AAPL', price: 234.07, delta: -1.21 },
    { symbol: 'NVDA', price: 891.50, delta: 14.62 },
  ]}
/>`

// Brand-mark stand-ins
function LetterLogo({ children, bg }: { children: string; bg: string }) {
  return (
    <span
      className="flex h-full w-full items-center justify-center text-[9px] font-bold text-black"
      style={{ background: bg }}
    >
      {children}
    </span>
  )
}

export default function TickerDocs() {
  // Auto-changing price on the headline ticker so the flash animation
  // and tabular-num swap are visible in the demo.
  const [p, setP] = React.useState(175.41)
  const [d, setD] = React.useState(2.13)

  React.useEffect(() => {
    const id = setInterval(() => {
      const change = (Math.random() - 0.5) * 1.8
      setP((v) => +(v + change).toFixed(2))
      setD(+change.toFixed(2))
    }, 2400)
    return () => clearInterval(id)
  }, [])

  return (
    <DocsPage
      title="Ticker"
      slug="ticker"
      description="An inline stock-ticker pill: logo, symbol, price, signed delta with an up/down triangle. When the price updates, the row briefly flashes green or red and the delta scales up for an instant. <TickerRow> wraps a list of tickers in a seamless horizontal marquee that pauses on hover."
      category="43 · data"
    >
      <DocsSection title="Single ticker (live)">
        <DemoCard className="min-h-[180px]">
          <div className="flex flex-col items-center gap-4">
            <Ticker
              symbol="GOOG"
              price={p}
              delta={d}
              logo={<LetterLogo bg="#4285F4">G</LetterLogo>}
            />
            <span className="text-[10px] uppercase tracking-[0.22em] text-white/45">
              auto-updates every 2.4s
            </span>
          </div>
        </DemoCard>
      </DocsSection>

      <DocsSection title="Marquee row">
        <DemoCard className="min-h-[120px]">
          <div className="w-full">
            <TickerRow
              items={[
                { symbol: 'GOOG', price: 175.41, delta: 2.13, logo: <LetterLogo bg="#4285F4">G</LetterLogo> },
                { symbol: 'AAPL', price: 234.07, delta: -1.21, logo: <LetterLogo bg="#A3AAAE">A</LetterLogo> },
                { symbol: 'NVDA', price: 891.5, delta: 14.62, logo: <LetterLogo bg="#76B900">N</LetterLogo> },
                { symbol: 'MSFT', price: 432.18, delta: -3.04, logo: <LetterLogo bg="#7FBA00">M</LetterLogo> },
                { symbol: 'TSLA', price: 215.78, delta: 8.45, logo: <LetterLogo bg="#E31937">T</LetterLogo> },
                { symbol: 'AMZN', price: 184.99, delta: 1.12, logo: <LetterLogo bg="#FF9900">A</LetterLogo> },
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
            ['symbol', 'Stock symbol (e.g. "GOOG").'],
            ['price', 'Current price (number).'],
            ['delta', 'Signed change vs. previous close.'],
            ['pct', 'Optional signed percent change. Computed from delta + price if omitted.'],
            ['logo', 'Optional logo node (img / circle / initial).'],
            ['currency', 'Currency prefix. Default "$".'],
            ['precision', 'Decimal places on price. Default 2.'],
            ['className', 'Extra classes on the ticker.'],
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
