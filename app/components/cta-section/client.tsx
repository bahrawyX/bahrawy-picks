'use client'

import { CtaSection } from '@/components/bahrawy/cta-section'
import { CodeBlock } from '@/components/showcase/code-block'
import { DocsPage, DocsSection } from '@/components/showcase/docs-page'

export default function CtaSectionDocs() {
  return (
    <DocsPage
      title="CTA Section"
      slug="cta-section"
      description="A big call-to-action band sitting on top of a soft radial glow. Drop this between feature sections to pull users into your sign-up flow."
      category="97 · section"
    >
      <DocsSection title="Live demo">
        <div className="overflow-hidden rounded-2xl border border-white/10">
          <CtaSection
            eyebrow="Ready when you are"
            title="Ship the same week you start."
            description="Copy a component, tune it, deploy. No design back-and-forth, no missing patterns."
            primaryCta={{ label: 'Get started' }}
            secondaryCta={{ label: 'Read the docs' }}
            glowColors={['#A78BFA', '#22D3EE']}
          />
        </div>
      </DocsSection>

      <DocsSection title="Usage">
        <CodeBlock code={`<CtaSection title="Ship the same week you start." primaryCta={{ label: 'Get started' }} glowColors={['#A78BFA', '#22D3EE']} />`} language="tsx" />
      </DocsSection>
    </DocsPage>
  )
}
