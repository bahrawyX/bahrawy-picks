'use client'

import {
  PricingCompare,
  type PricingComparePlan,
  type PricingCompareGroup,
} from '@/components/bahrawy/pricing-compare'
import { CodeBlock } from '@/components/showcase/code-block'
import { DocsPage, DocsSection } from '@/components/showcase/docs-page'

const PLANS: PricingComparePlan[] = [
  { id: 'free', name: 'Free', price: '$0', priceSuffix: '/mo', cta: { label: 'Start free' } },
  { id: 'pro', name: 'Pro', price: '$12', priceSuffix: '/mo', cta: { label: 'Get Pro' }, featured: true },
  { id: 'team', name: 'Team', price: '$48', priceSuffix: '/mo', cta: { label: 'Talk to sales' } },
]

const GROUPS: PricingCompareGroup[] = [
  {
    label: 'Components',
    features: [
      { label: 'Core library (65 components)', values: [true, true, true] },
      { label: 'Premium blocks (heroes, pricing, footers)', values: [false, true, true] },
      { label: 'Figma source files', values: [false, true, true] },
      { label: 'Storybook examples', values: [false, true, true] },
    ],
  },
  {
    label: 'Updates & support',
    features: [
      { label: 'Updates', values: ['1 year', 'Lifetime', 'Lifetime'] },
      { label: 'Email support', values: [false, true, true] },
      { label: 'Priority support', values: [false, false, true] },
      { label: 'Slack channel', values: [false, false, true] },
    ],
  },
  {
    label: 'Licensing',
    features: [
      { label: 'Personal & commercial use', values: [true, true, true] },
      { label: 'Team seats', values: ['1', '1', '5'] },
      { label: 'White-label', values: [false, false, true] },
    ],
  },
]

const SNIPPET = `import { PricingCompare } from '@/components/bahrawy/pricing-compare'

<PricingCompare
  plans={[
    { id: 'free', name: 'Free', price: '$0', cta: { label: 'Start free' } },
    { id: 'pro',  name: 'Pro',  price: '$12', cta: { label: 'Get Pro' }, featured: true },
  ]}
  groups={[
    { label: 'Components', features: [{ label: 'Core', values: [true, true, true] }] },
  ]}
/>`

export default function PricingCompareDocs() {
  return (
    <DocsPage
      title="Pricing Compare"
      slug="pricing-compare"
      description="Tall feature comparison table. Plan headers across the top, feature groups down the side. The recommended column gets a subtle accent panel behind it. Rows fade up as they enter the viewport."
      category="83 · pricing"
    >
      <DocsSection title="Live demo">
        <div className="overflow-hidden rounded-2xl border border-white/10">
          <PricingCompare
            eyebrow="Compare plans"
            heading="Every feature, side by side."
            description="Pick the plan that fits — switch anytime."
            plans={PLANS}
            groups={GROUPS}
            accentColor="#F472B6"
          />
        </div>
      </DocsSection>

      <DocsSection title="Usage">
        <CodeBlock code={SNIPPET} language="tsx" />
      </DocsSection>

      <DocsSection title="Props">
        <ul className="grid gap-2 sm:grid-cols-2">
          {[
            ['plans', 'PricingComparePlan[] — { id, name, price, cta, featured? }'],
            ['groups', 'PricingCompareGroup[] — labeled sections of feature rows.'],
            ['eyebrow', 'Tag above the heading.'],
            ['heading', 'Section heading.'],
            ['description', 'Sub-copy.'],
            ['accentColor', 'Featured column highlight color.'],
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
