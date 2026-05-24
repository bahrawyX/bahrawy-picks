'use client'

import { PricingTier, type PricingPlan } from '@/components/bahrawy/pricing-tier'
import { CodeBlock } from '@/components/showcase/code-block'
import { DocsPage, DocsSection } from '@/components/showcase/docs-page'

const PLANS: PricingPlan[] = [
  {
    id: 'free',
    name: 'Free',
    price: '$0',
    priceSuffix: 'forever',
    description: 'For exploring and small side projects.',
    features: [
      'All 75 components',
      'Copy-paste source',
      'Community support',
      'MIT license',
    ],
    cta: { label: 'Start free' },
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '$12',
    priceSuffix: '/mo',
    description: 'For solo devs shipping production apps.',
    features: [
      'Everything in Free',
      'Premium blocks (heroes, pricing, footers)',
      'Lifetime updates',
      'Email support',
      'Figma source files',
    ],
    cta: { label: 'Go Pro' },
    featured: true,
  },
  {
    id: 'team',
    name: 'Team',
    price: '$48',
    priceSuffix: '/mo',
    description: 'For small teams and agencies.',
    features: [
      'Everything in Pro',
      '5 seats included',
      'Private Slack channel',
      'Priority support',
      'White-label licensing',
    ],
    cta: { label: 'Contact us' },
  },
]

const SNIPPET = `import { PricingTier } from '@/components/bahrawy/pricing-tier'

const plans = [
  { id: 'free',  name: 'Free', price: '$0',  features: [...], cta: { label: 'Start free' } },
  { id: 'pro',   name: 'Pro',  price: '$12', features: [...], cta: { label: 'Go Pro' }, featured: true },
  { id: 'team',  name: 'Team', price: '$48', features: [...], cta: { label: 'Contact us' } },
]

<PricingTier plans={plans} heading="Simple, honest pricing." />`

export default function PricingTierDocs() {
  return (
    <DocsPage
      title="Pricing Tier"
      slug="pricing-tier"
      description="Three-tier pricing card grid. One tier can be `featured` — gets a glow ring, a Recommended pill, and lifts slightly above the rest. Cards stagger in on scroll."
      category="87 · pricing"
    >
      <DocsSection title="Live demo">
        <div className="overflow-hidden rounded-2xl border border-white/10">
          <PricingTier
            eyebrow="Pricing"
            heading="Simple, honest pricing."
            description="Free for personal use. Pro and Team unlock the premium blocks."
            plans={PLANS}
            accentColor="#A78BFA"
          />
        </div>
      </DocsSection>

      <DocsSection title="Usage">
        <CodeBlock code={SNIPPET} language="tsx" />
      </DocsSection>

      <DocsSection title="Props">
        <ul className="grid gap-2 sm:grid-cols-2">
          {[
            ['plans', 'PricingPlan[] — { id, name, price, features, cta, featured? }'],
            ['eyebrow', 'Tag above the section heading.'],
            ['heading', 'Section heading.'],
            ['description', 'Sub-copy below the heading.'],
            ['accentColor', 'Color for the featured ring + CTA. Default #FFFFFF.'],
            ['className', 'Extra classes on the section.'],
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
