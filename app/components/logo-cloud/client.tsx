'use client'

import { useState } from 'react'
import { LogoCloud, type LogoCloudItem } from '@/components/bahrawy/logo-cloud'
import { CodeBlock } from '@/components/showcase/code-block'
import { DocsPage, DocsSection } from '@/components/showcase/docs-page'
import { ControlPanel, ToggleControl } from '@/components/showcase/control-panel'

const ITEMS: LogoCloudItem[] = [
  { name: 'Lumen' },
  { name: 'Orbital' },
  { name: 'Northwind' },
  { name: 'Atlas' },
  { name: 'Helix' },
  { name: 'Verdant' },
  { name: 'Quill' },
  { name: 'Meridian' },
]

export default function LogoCloudDocs() {
  const [marquee, setMarquee] = useState(true)

  return (
    <DocsPage
      title="Logo Cloud"
      slug="logo-cloud"
      description={'"Trusted by" section with partner logos in an edge-faded marquee. Toggle the marquee off for a static grid instead.'}
      category="113 · section"
    >
      <DocsSection title="Live demo">
        <div className="overflow-hidden rounded-2xl border border-white/10">
          <LogoCloud items={ITEMS} marquee={marquee} />
        </div>
        <ControlPanel>
          <ToggleControl label="Marquee" checked={marquee} onChange={setMarquee} />
        </ControlPanel>
      </DocsSection>

      <DocsSection title="Usage">
        <CodeBlock code={`<LogoCloud eyebrow="Trusted by teams at" items={items} marquee />`} language="tsx" />
      </DocsSection>
    </DocsPage>
  )
}
