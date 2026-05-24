'use client'

import { Banner } from '@/components/bahrawy/banner'
import { CodeBlock } from '@/components/showcase/code-block'
import { DocsPage, DocsSection, DemoCard } from '@/components/showcase/docs-page'

export default function BannerDocs() {
  return (
    <DocsPage
      title="Banner"
      slug="banner"
      description="Sticky announcement banner. Slide-in from the top, intent variants, dismissible (remembered for the session by default)."
      category="109 · overlay"
    >
      <DocsSection title="Live demo">
        <DemoCard className="min-h-[280px] items-stretch">
          <div className="flex w-full flex-col gap-3">
            <Banner intent="info" persistDismiss={false}>
              We pushed v2.0 today — 95 components total.
            </Banner>
            <Banner
              intent="promo"
              persistDismiss={false}
              cta={{ label: 'Get Pro' }}
            >
              Lifetime updates for $19. This month only.
            </Banner>
            <Banner intent="success" persistDismiss={false}>
              Your changes were saved.
            </Banner>
            <Banner intent="warning" persistDismiss={false}>
              Your trial ends in 3 days.
            </Banner>
          </div>
        </DemoCard>
      </DocsSection>
      <DocsSection title="Usage">
        <CodeBlock code={`<Banner intent="promo" cta={{ label: 'Get Pro' }} id="v2-promo">\n  Lifetime updates for $19. This month only.\n</Banner>`} language="tsx" />
      </DocsSection>
    </DocsPage>
  )
}
