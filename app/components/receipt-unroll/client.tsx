'use client'

import { ReceiptUnroll } from '@/components/bahrawy/receipt-unroll'
import { CodeBlock } from '@/components/showcase/code-block'
import { DocsPage, DocsSection } from '@/components/showcase/docs-page'

const SNIPPET = `import { ReceiptUnroll } from '@/components/bahrawy/receipt-unroll'

<ReceiptUnroll
  eyebrow="Order #00120"
  store="BAHRAWY · MERCANTILE"
  meta="123 craft st · MAY 2026"
  lines={[
    { id: 'a', label: 'Components × 120', value: '$0.00', note: 'open-source' },
    { id: 'b', label: 'Heart × infinite', value: '$0.00' },
    // …
  ]}
  subtotal="$0.00"
  tax="$0.00"
  total="$0.00"
  footer="thank you · come again"
  cta={{ label: 'See the catalog' }}
/>`

export default function ReceiptUnrollDocs() {
  return (
    <DocsPage
      title="Receipt Unroll"
      slug="receipt-unroll"
      description="A paper receipt unrolls from a printer slot at the top of the viewport as you scroll. Header, monospaced line items type in one at a time, subtotal/total animate at the bottom, scalloped edges + barcode at the very bottom."
      category="142 · gsap-section"
    >
      <DocsSection title="Live demo" description="Scroll into the section — the receipt prints out, item by item, finishing with the total + a barcode.">
        <p className="text-xs text-white/40">↓ scroll to print</p>
      </DocsSection>

      <ReceiptUnroll
        eyebrow="Order #00120"
        store="BAHRAWY · MERCANTILE"
        meta="123 craft st · may 2026"
        lines={[
          { id: 'a', label: 'Components', value: '× 120', note: 'open-source' },
          { id: 'b', label: 'Categories', value: '× 18' },
          { id: 'c', label: 'Heart', value: '× ∞' },
          { id: 'd', label: 'TypeScript strict', value: '✓' },
          { id: 'e', label: 'Tailwind v3', value: '✓' },
          { id: 'f', label: 'GSAP + Framer', value: '✓' },
          { id: 'g', label: 'Apple-grade easing', value: '✓' },
          { id: 'h', label: 'Lifetime updates', value: '✓' },
        ]}
        subtotal="$0.00"
        tax="$0.00"
        total="$0.00"
        footer="thank you · come back soon"
        cta={{ label: 'See the catalog' }}
        accentColor="#22D3EE"
      />

      <div className="h-32" aria-hidden />

      <DocsSection title="Usage"><CodeBlock code={SNIPPET} language="tsx" /></DocsSection>

      <DocsSection title="Props">
        <ul className="grid gap-2 sm:grid-cols-2">
          {[
            ['store', 'Brand line printed at the top.'],
            ['meta', 'Subheader line (date, address, receipt #).'],
            ['lines', 'ReceiptLine[] — { id, label, value, note? }. Each prints in sequentially.'],
            ['subtotal', 'Subtotal value (string or node).'],
            ['tax', 'Tax line value.'],
            ['total', 'Final total — emphasized.'],
            ['footer', 'Tagline rendered above the barcode.'],
            ['eyebrow', 'Tiny tag above the section.'],
            ['cta', '{ label, href?, onClick? }'],
            ['scrollLength', 'Pin length in viewport heights. Default 4.'],
            ['paperColor', 'Paper hex. Default a warm off-white.'],
            ['inkColor', 'Ink color. Default near-black.'],
            ['accentColor', 'Printer-slot glow. Default #22D3EE.'],
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
          {['gsap', '@gsap/react', 'lucide-react'].map((d) => (
            <code key={d} className="rounded-md border border-white/10 bg-white/[0.04] px-2 py-1 font-mono text-xs text-white/80">{d}</code>
          ))}
        </div>
      </DocsSection>
    </DocsPage>
  )
}
