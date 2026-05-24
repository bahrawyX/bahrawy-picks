'use client'

import {
  PricingToggle,
  type PricingTogglePlan,
} from '@/components/bahrawy/pricing-toggle'
import { CodeBlock } from '@/components/showcase/code-block'
import { DocsPage, DocsSection } from '@/components/showcase/docs-page'

const PLANS: PricingTogglePlan[] = [
  {
    id: 'starter',
    name: 'Starter',
    monthly: 9,
    annual: 7,
    description: 'For individual developers.',
    features: ['All 75 components', 'Updates for 1 year', 'Email support'],
    cta: { label: 'Get Starter' },
  },
  {
    id: 'pro',
    name: 'Pro',
    monthly: 19,
    annual: 15,
    description: 'For pros shipping every week.',
    features: [
      'Everything in Starter',
      'Lifetime updates',
      'Premium hero & pricing blocks',
      'Priority support',
      'Figma source files',
    ],
    cta: { label: 'Get Pro' },
    featured: true,
  },
  {
    id: 'studio',
    name: 'Studio',
    monthly: 49,
    annual: 39,
    description: 'For small teams and agencies.',
    features: ['Everything in Pro', '5 seats', 'White-label license', 'Slack channel'],
    cta: { label: 'Contact sales' },
  },
]

const SNIPPET = `import { PricingToggle } from '@/components/bahrawy/pricing-toggle'

const plans = [
  { id: 'starter', name: 'Starter', monthly: 9,  annual: 7,  features: [...], cta: { label: 'Get Starter' } },
  { id: 'pro',     name: 'Pro',     monthly: 19, annual: 15, features: [...], cta: { label: 'Get Pro' }, featured: true },
]

<PricingToggle plans={plans} annualSavingLabel="Save 20%" />`

export default function PricingToggleDocs() {
  return (
    <DocsPage
      title="Pricing Toggle"
      slug="pricing-toggle"
      description="Pricing card grid with a monthly/annual billing toggle. Flipping the toggle springs the price number to its new value — each digit settles via a motion-value spring."
      category="97 · pricing"
    >
      <DocsSection title="Live demo" description="Click the billing toggle to flip prices.">
        <div className="overflow-hidden rounded-2xl border border-white/10">
          <PricingToggle
            eyebrow="Pricing"
            heading="Pick a plan. Change it any time."
            description="No hidden fees, no surprise renewals. Cancel whenever."
            plans={PLANS}
            accentColor="#22D3EE"
          />
        </div>
      </DocsSection>

      <DocsSection title="Usage">
        <CodeBlock code={SNIPPET} language="tsx" />
      </DocsSection>

      <DocsSection title="Props">
        <ul className="grid gap-2 sm:grid-cols-2">
          {[
            ['plans', 'PricingTogglePlan[] — { id, name, monthly, annual, description, features, cta, featured? }'],
            ['currency', 'Currency prefix. Default "$".'],
            ['annualSavingLabel', 'Badge label next to the annual option. Default "Save 20%".'],
            ['eyebrow', 'Tag above the heading.'],
            ['heading', 'Section heading.'],
            ['description', 'Sub-copy.'],
            ['accentColor', 'Featured ring + CTA color.'],
            ['className', 'Extra classes.'],
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
            <code key={d} className="rounded-md border border-white/10 bg-white/[0.04] px-2 py-1 font-mono text-xs text-white/80">{d}</code>
          ))}
        </div>
      </DocsSection>
    </DocsPage>
  )
}
