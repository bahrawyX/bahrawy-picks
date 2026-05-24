'use client'

import { EnvVars } from '@/components/bahrawy/env-vars'
import { CodeBlock } from '@/components/showcase/code-block'
import { DocsPage, DocsSection, DemoCard } from '@/components/showcase/docs-page'

const SNIPPET = `import { EnvVars } from '@/components/bahrawy/env-vars'

<EnvVars
  vars={[
    { name: 'DATABASE_URL', value: 'postgres://user:pass@db.host:5432/app', required: true },
    { name: 'API_KEY',      value: 'demo_5d2f4a3c9b1e7f8a6d', required: true },
    { name: 'NODE_ENV',     value: 'production' },
    { name: 'PORT',         value: '3000' },
  ]}
/>`

export default function EnvVarsDocs() {
  return (
    <DocsPage
      title="Env Vars"
      slug="env-vars"
      description="A Vercel-style environment-variable display. Each row is a monospace name with an optional Required pill, a value masked to dots, and a copy button. The header eye-toggle reveals every value at once. Read-only display — not an editor."
      category="64 · data"
    >
      <DocsSection title="Live demo">
        <DemoCard className="min-h-[320px] items-start py-8">
          <div className="w-full max-w-2xl">
            <EnvVars
              vars={[
                {
                  name: 'DATABASE_URL',
                  value: 'postgres://user:pass@db.host:5432/app',
                  required: true,
                },
                {
                  name: 'API_KEY',
                  value: 'demo_5d2f4a3c9b1e7f8a6d4e2c1f',
                  required: true,
                },
                { name: 'NODE_ENV', value: 'production' },
                { name: 'PORT', value: '3000' },
                {
                  name: 'NEXT_PUBLIC_APP_URL',
                  value: 'https://bahrawy.me',
                },
              ]}
            />
          </div>
        </DemoCard>
      </DocsSection>

      <DocsSection title="Usage">
        <CodeBlock code={SNIPPET} language="tsx" />
      </DocsSection>

      <DocsSection title="Props">
        <ul className="grid gap-2 sm:grid-cols-2">
          {[
            ['vars', 'Array of { name, value, required? }.'],
            ['title', 'Header title. Default "Environment Variables".'],
            ['defaultVisible', 'Start with values revealed. Default false.'],
            ['onCopy', '(name, value) => void — fires after a successful copy.'],
            ['className', 'Extra classes on the outer container.'],
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
            <code key={d} className="rounded-md border border-white/10 bg-white/[0.04] px-2 py-1 font-mono text-xs text-white/80">
              {d}
            </code>
          ))}
        </div>
      </DocsSection>
    </DocsPage>
  )
}
