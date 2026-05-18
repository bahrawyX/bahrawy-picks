'use client'

import { useState } from 'react'
import { AddressInput } from '@/components/bahrawy'
import type { AddressData } from '@/components/bahrawy/address-input/nominatim-utils'
import { CodeBlock } from '@/components/showcase/code-block'
import {
  DemoCard,
  DocsPage,
  DocsSection,
} from '@/components/showcase/docs-page'
import { PropsTable } from '@/components/showcase/props-table'

const BASIC_SNIPPET = `import { AddressInput } from '@/components/bahrawy'

<AddressInput
  onChange={(data) => {
    console.log(data.street, data.city)
    // data.state, data.zip, data.country
    // data.lat, data.lon
  }}
/>`

const SPLIT_SNIPPET = `<AddressInput
  mode="split"
  showMap
  onChange={(data) => console.log(data)}
/>`

const MAP_SNIPPET = `<AddressInput
  showMap
  enableGeolocation
  onChange={(data) => console.log(data)}
/>`

export default function AddressInputDocs() {
  const [address, setAddress] = useState<AddressData | null>(null)

  return (
    <DocsPage
      title="Address Input"
      slug="address-input"
      description="Address autocomplete powered by OpenStreetMap Nominatim with split fields, map preview, and geolocation."
      category="07 · FORM"
    >
      {/* Basic */}
      <DocsSection title="Basic search">
        <DemoCard>
          <div className="w-full max-w-lg">
            <AddressInput
              onChange={setAddress}
            />
            {address && address.city && (
              <p className="mt-2 text-xs text-white/30">
                {address.street && `${address.street}, `}
                {address.city}
                {address.state && `, ${address.state}`}
                {address.country && ` — ${address.country}`}
              </p>
            )}
          </div>
        </DemoCard>
        <CodeBlock code={BASIC_SNIPPET} language="tsx" />
      </DocsSection>

      {/* With map */}
      <DocsSection title="With map preview">
        <DemoCard className="items-start">
          <div className="w-full max-w-lg">
            <AddressInput showMap onChange={() => {}} />
          </div>
        </DemoCard>
        <CodeBlock code={MAP_SNIPPET} language="tsx" />
      </DocsSection>

      {/* Split mode */}
      <DocsSection title="Split fields mode">
        <DemoCard className="items-start">
          <div className="w-full max-w-lg">
            <AddressInput mode="split" showMap onChange={() => {}} />
          </div>
        </DemoCard>
        <CodeBlock code={SPLIT_SNIPPET} language="tsx" />
      </DocsSection>

      {/* Without geolocation */}
      <DocsSection title="Without geolocation">
        <DemoCard>
          <div className="w-full max-w-lg">
            <AddressInput enableGeolocation={false} onChange={() => {}} />
          </div>
        </DemoCard>
      </DocsSection>

      {/* Error */}
      <DocsSection title="Error state">
        <DemoCard>
          <div className="w-full max-w-lg">
            <AddressInput error="Address is required" onChange={() => {}} />
          </div>
        </DemoCard>
      </DocsSection>

      {/* Disabled */}
      <DocsSection title="Disabled">
        <DemoCard>
          <div className="w-full max-w-lg">
            <AddressInput disabled />
          </div>
        </DemoCard>
      </DocsSection>

      {/* Props */}
      <DocsSection title="Props">
        <PropsTable
          props={[
            { name: 'value', type: 'AddressData', default: '—', description: 'Controlled address data' },
            { name: 'onChange', type: '(data: AddressData) => void', default: '—', description: 'Called on address change' },
            { name: 'defaultValue', type: 'AddressData', default: '—', description: 'Default address data' },
            { name: 'mode', type: "'full' | 'split'", default: "'full'", description: 'Full search bar or split individual fields' },
            { name: 'showMap', type: 'boolean', default: 'false', description: 'Show OpenStreetMap preview after selection' },
            { name: 'enableGeolocation', type: 'boolean', default: 'true', description: 'Show geolocation button' },
            { name: 'placeholder', type: 'string', default: "'Search for an address...'", description: 'Search placeholder text' },
            { name: 'disabled', type: 'boolean', default: 'false', description: 'Disable the input' },
            { name: 'error', type: 'string', default: '—', description: 'Error message' },
            { name: 'className', type: 'string', default: '—', description: 'Additional CSS classes' },
          ]}
        />
      </DocsSection>
    </DocsPage>
  )
}
