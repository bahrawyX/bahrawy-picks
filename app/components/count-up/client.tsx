'use client'

import { CountUp } from '@/components/bahrawy'
import { CodeBlock } from '@/components/showcase/code-block'
import {
  DemoCard,
  DocsPage,
  DocsSection,
} from '@/components/showcase/docs-page'
import { PropsTable } from '@/components/showcase/props-table'

const BASIC_SNIPPET = `import { CountUp } from '@/components/bahrawy'

<CountUp to={1000} />`

const FORMATTED_SNIPPET = `<CountUp
  to={9999.99}
  decimals={2}
  prefix="$"
  duration={3}
/>`

export default function CountUpDocs() {
  return (
    <DocsPage
      title="Count Up"
      slug="count-up"
      description="Animated number counter with spring physics, in-view triggering, and Intl.NumberFormat formatting."
      category="34 · MOTION"
    >
      {/* Basic */}
      <DocsSection title="Basic">
        <DemoCard>
          <CountUp to={1000} className="text-5xl font-bold text-white" />
        </DemoCard>
        <CodeBlock code={BASIC_SNIPPET} language="tsx" />
      </DocsSection>

      {/* Currency */}
      <DocsSection title="Currency format">
        <DemoCard>
          <CountUp
            to={9999.99}
            decimals={2}
            prefix="$"
            duration={3}
            className="text-4xl font-semibold text-white"
          />
        </DemoCard>
        <CodeBlock code={FORMATTED_SNIPPET} language="tsx" />
      </DocsSection>

      {/* Percentage */}
      <DocsSection title="Percentage">
        <DemoCard>
          <CountUp
            to={87}
            suffix="%"
            className="text-4xl font-semibold text-white"
          />
        </DemoCard>
      </DocsSection>

      {/* Multiple stats */}
      <DocsSection title="Stats row">
        <DemoCard>
          <div className="flex gap-12">
            <div className="text-center">
              <CountUp to={120} prefix="" className="text-3xl font-bold text-white" />
              <p className="mt-1 text-xs text-white/40">Components</p>
            </div>
            <div className="text-center">
              <CountUp to={50} suffix="k" className="text-3xl font-bold text-white" />
              <p className="mt-1 text-xs text-white/40">Downloads</p>
            </div>
            <div className="text-center">
              <CountUp to={99.9} decimals={1} suffix="%" className="text-3xl font-bold text-white" />
              <p className="mt-1 text-xs text-white/40">Uptime</p>
            </div>
          </div>
        </DemoCard>
      </DocsSection>

      {/* Props */}
      <DocsSection title="Props">
        <PropsTable
          props={[
            { name: 'to', type: 'number', default: '—', description: 'Target number to count to' },
            { name: 'from', type: 'number', default: '0', description: 'Starting number' },
            { name: 'duration', type: 'number', default: '2', description: 'Duration in seconds' },
            { name: 'delay', type: 'number', default: '0', description: 'Delay before starting in seconds' },
            { name: 'decimals', type: 'number', default: '0', description: 'Decimal places' },
            { name: 'separator', type: 'string', default: '","', description: 'Thousands separator' },
            { name: 'prefix', type: 'string', default: '""', description: 'Text before number' },
            { name: 'suffix', type: 'string', default: '""', description: 'Text after number' },
            { name: 'onComplete', type: '() => void', default: '—', description: 'Called when animation completes' },
            { name: 'className', type: 'string', default: '—', description: 'Additional CSS classes' },
          ]}
        />
      </DocsSection>
    </DocsPage>
  )
}
