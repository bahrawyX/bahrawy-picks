'use client'

import { Music, Plane, Ticket, Train } from 'lucide-react'
import { WalletPass } from '@/components/bahrawy/wallet-pass'
import { CodeBlock } from '@/components/showcase/code-block'
import { DocsPage, DocsSection, DemoCard } from '@/components/showcase/docs-page'

const SNIPPET = `import { WalletPass } from '@/components/bahrawy/wallet-pass'

<WalletPass
  variant="event"
  logo={<Music className="h-3.5 w-3.5" />}
  organization="Bahrawy Tour"
  badge="GA"
  title="Side B · Closer"
  subtitle="Live at the Greek Theatre"
  details={[
    { label: 'Date',  value: 'Aug 24' },
    { label: 'Doors', value: '7:30 PM' },
    { label: 'Seat',  value: 'GA' },
  ]}
  barcode="A1B2-C3D4-E5F6"
/>`

export default function WalletPassDocs() {
  return (
    <DocsPage
      title="Wallet Pass"
      slug="wallet-pass"
      description="Apple Wallet-style metallic pass card. Hand-tuned linear-gradient palettes per variant (event / transit / coupon / boarding) or pass your own. The iconic perforated top edge is a CSS mask of tiny circles repeated horizontally — actual cutouts, the page behind shows through. CSS-drawn barcode at the bottom with stripe widths deterministically hashed from the code string."
      category="69 · card"
    >
      <DocsSection title="Event pass">
        <DemoCard className="min-h-[440px]">
          <WalletPass
            variant="event"
            logo={<Music className="h-3.5 w-3.5" strokeWidth={2.5} />}
            organization="Bahrawy Tour"
            badge="GA"
            title="Side B · Closer"
            subtitle="Live at the Greek Theatre"
            details={[
              { label: 'Date', value: 'Aug 24' },
              { label: 'Doors', value: '7:30 PM' },
              { label: 'Seat', value: 'GA' },
            ]}
            barcode="EVT-A1B2-C3D4"
          />
        </DemoCard>
      </DocsSection>

      <DocsSection title="Boarding pass">
        <DemoCard className="min-h-[440px]">
          <WalletPass
            variant="boarding"
            logo={<Plane className="h-3.5 w-3.5" strokeWidth={2.5} />}
            organization="Bahrawy Air"
            badge="Group 2"
            title="CAI → JFK"
            subtitle="Flight BA 247 · Direct"
            details={[
              { label: 'Date', value: 'Mar 14' },
              { label: 'Gate', value: 'B12' },
              { label: 'Seat', value: '14A' },
            ]}
            barcode="BA247-CAI-JFK"
          />
        </DemoCard>
      </DocsSection>

      <DocsSection title="Transit + coupon">
        <DemoCard className="min-h-[460px] py-8">
          <div className="flex flex-wrap items-start justify-center gap-6">
            <WalletPass
              variant="transit"
              logo={<Train className="h-3.5 w-3.5" strokeWidth={2.5} />}
              organization="Cairo Metro"
              badge="Day"
              title="All-Day Pass"
              subtitle="Valid until 11:59 PM"
              details={[
                { label: 'Zone', value: 'All' },
                { label: 'Trips', value: 'Unlimited' },
                { label: 'Date', value: 'Today' },
              ]}
              barcode="CM-DAY-2026"
            />
            <WalletPass
              variant="coupon"
              logo={<Ticket className="h-3.5 w-3.5" strokeWidth={2.5} />}
              organization="Bahrawy Picks"
              badge="20% OFF"
              title="Spring Sale"
              subtitle="Use at checkout"
              details={[
                { label: 'Code', value: 'SPRING20' },
                { label: 'Min', value: '$50' },
                { label: 'Ends', value: 'Apr 30' },
              ]}
              barcode="SPRING20-2026"
            />
          </div>
        </DemoCard>
      </DocsSection>

      <DocsSection title="Custom gradient">
        <DemoCard className="min-h-[420px]">
          <WalletPass
            variant="custom"
            gradient={['#06B6D4', '#A78BFA', '#F472B6']}
            organization="Bahrawy Members"
            badge="VIP"
            title="Founder's Pass"
            subtitle="Lifetime access"
            details={[
              { label: 'Member', value: '#0001' },
              { label: 'Tier', value: 'Founder' },
              { label: 'Since', value: '2026' },
            ]}
            barcode="MEMBER-0001"
          />
        </DemoCard>
      </DocsSection>

      <DocsSection title="Usage">
        <CodeBlock code={SNIPPET} language="tsx" />
      </DocsSection>

      <DocsSection title="Props">
        <ul className="grid gap-2 sm:grid-cols-2">
          {[
            ['variant', '"event" | "transit" | "coupon" | "boarding" | "custom". Default "event".'],
            ['gradient', 'Override the variant gradient — 2 or 3 hex stops.'],
            ['logo', 'Optional icon node at the top-left.'],
            ['organization', 'Required header text (top-left).'],
            ['badge', 'Optional pill at top-right (price, type chip, etc).'],
            ['title', 'Big primary text — event/route/pass name.'],
            ['subtitle', 'Subtitle under the title.'],
            ['details', 'Up to 3 { label, value } rows shown above the barcode.'],
            ['barcode', 'Barcode string (used as the visual seed + readable text).'],
            ['hideBarcode', 'Hide the barcode strip. Default false.'],
            ['width', 'Card width in px. Default 320.'],
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
          {['lucide-react'].map((d) => (
            <code key={d} className="rounded-md border border-white/10 bg-white/[0.04] px-2 py-1 font-mono text-xs text-white/80">
              {d}
            </code>
          ))}
        </div>
      </DocsSection>
    </DocsPage>
  )
}
