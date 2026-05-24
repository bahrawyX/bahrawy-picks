'use client'

import { FaqSection, type FaqItem } from '@/components/bahrawy/faq-section'
import { CodeBlock } from '@/components/showcase/code-block'
import { DocsPage, DocsSection } from '@/components/showcase/docs-page'

const ITEMS: FaqItem[] = [
  {
    id: 'install',
    question: 'How do I install a Bahrawy component?',
    answer: 'Run `npx bahrawy add <slug>` and the source file lands in your project. No npm install per component, no lock-in.',
  },
  {
    id: 'theme',
    question: 'Does it work with my theme?',
    answer: 'Every component is dark-first but uses Tailwind tokens (`bg-white/10`, `text-white/60`, etc.) so a light-mode skin is mostly find-and-replace.',
  },
  {
    id: 'license',
    question: 'What is the license?',
    answer: 'MIT. Use it commercially, modify it freely, attribute if you want. Nothing in this library is locked behind a paywall.',
  },
  {
    id: 'updates',
    question: 'How are updates delivered?',
    answer: 'Re-run `npx bahrawy add <slug>` and the CLI will diff your local file against the latest and ask before overwriting.',
  },
]

export default function FaqSectionDocs() {
  return (
    <DocsPage
      title="FAQ Section"
      slug="faq-section"
      description="A two-column FAQ layout — heading on the left, the question accordion on the right. Same bouncy spring as the Accordion primitive."
      category="97 · section"
    >
      <DocsSection title="Live demo" description="Click a question to expand its answer.">
        <div className="overflow-hidden rounded-2xl border border-white/10">
          <FaqSection
            eyebrow="FAQ"
            heading="Frequently asked."
            description="Quick answers to the things people ask most."
            items={ITEMS}
            accentColor="#22D3EE"
          />
        </div>
      </DocsSection>

      <DocsSection title="Usage">
        <CodeBlock code={`<FaqSection heading="Frequently asked." items={items} accentColor="#22D3EE" />`} language="tsx" />
      </DocsSection>
    </DocsPage>
  )
}
