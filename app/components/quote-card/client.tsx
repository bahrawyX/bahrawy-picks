'use client'

import { QuoteCard } from '@/components/bahrawy/quote-card'
import { CodeBlock } from '@/components/showcase/code-block'
import { DocsPage, DocsSection, DemoCard } from '@/components/showcase/docs-page'

export default function QuoteCardDocs() {
  return (
    <DocsPage
      title="Quote Card"
      slug="quote-card"
      description="A pull-quote card with author avatar + role. Quote glyph, body, and caption stagger in on scroll."
      category="123 · card"
    >
      <DocsSection title="Live demo">
        <DemoCard className="items-stretch">
          <div className="grid w-full gap-4 sm:grid-cols-2">
            <QuoteCard
              quote="The bar for what feels good has been raised. We swapped three of our hand-rolled components for Bahrawy and shipped a week earlier."
              author={{
                name: 'Sara Chen',
                role: 'Engineering Lead, Lumen',
                avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&q=80&auto=format&fit=crop',
              }}
              accentColor="#A78BFA"
            />
            <QuoteCard
              quote="Drop a component in, tune a couple of props, ship. The animation feels like Apple-level care."
              author={{ name: 'Marcus Reid', role: 'Indie maker', fallback: 'M' }}
              accentColor="#22D3EE"
            />
          </div>
        </DemoCard>
      </DocsSection>
      <DocsSection title="Usage">
        <CodeBlock code={`<QuoteCard\n  quote="The bar for what feels good has been raised."\n  author={{ name: 'Sara Chen', role: 'Engineering Lead', avatar: '/a.jpg' }}\n  accentColor="#A78BFA"\n/>`} language="tsx" />
      </DocsSection>
    </DocsPage>
  )
}
