'use client'

import { ShiningBorder } from '@/components/bahrawy/shining-border'
import { CodeBlock } from '@/components/showcase/code-block'
import { DemoCard, DocsPage, DocsSection } from '@/components/showcase/docs-page'
import { PropsTable } from '@/components/showcase/props-table'

// ---------------------------------------------------------------------------
// Code snippets
// ---------------------------------------------------------------------------

const BASIC_SNIPPET = `import { ShiningBorder } from '@/components/bahrawy/shining-border'

<ShiningBorder>
  <div className="p-6 text-center">
    <h3 className="text-lg font-semibold text-white">Card Title</h3>
    <p className="mt-2 text-sm text-white/60">
      Card content goes here
    </p>
  </div>
</ShiningBorder>`

const LOGIN_SNIPPET = `import { ShiningBorder } from '@/components/bahrawy/shining-border'

<ShiningBorder variant="aurora" borderRadius={16} borderWidth={2}>
  <div className="w-80 p-8">
    <h3 className="text-xl font-bold text-white">Login</h3>
    <p className="mt-1 text-sm text-white/50">
      Welcome back. Enter your credentials.
    </p>
    <div className="mt-6 flex flex-col gap-4">
      <input
        type="email"
        placeholder="Email"
        className="rounded-lg border border-white/10 bg-white/5
                   px-4 py-2.5 text-sm text-white placeholder-white/30
                   outline-none focus:border-white/25"
      />
      <input
        type="password"
        placeholder="Password"
        className="rounded-lg border border-white/10 bg-white/5
                   px-4 py-2.5 text-sm text-white placeholder-white/30
                   outline-none focus:border-white/25"
      />
      <button className="rounded-lg bg-white px-4 py-2.5 text-sm
                          font-medium text-black hover:bg-white/90">
        Sign in
      </button>
      <button className="rounded-lg border border-white/10 px-4
                          py-2.5 text-sm text-white/70 hover:bg-white/5">
        Create account
      </button>
    </div>
  </div>
</ShiningBorder>`

// ---------------------------------------------------------------------------
// Demo helpers
// ---------------------------------------------------------------------------

function SimpleCard({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="p-6 text-center">
      <h3 className="text-lg font-semibold text-white">{title}</h3>
      {subtitle && <p className="mt-2 text-sm text-white/60">{subtitle}</p>}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function ShiningBorderDocs() {
  return (
    <DocsPage
      category="62 · decoration"
      title="Shining border"
      slug="shining-border"
      description="A wrapper component that adds an animated glowing beam traveling around its border. Uses a conic gradient rotated continuously via Framer Motion."
    >
      {/* ── Basic ────────────────────────────────────────── */}
      <DocsSection title="Basic">
        <DemoCard>
          <ShiningBorder>
            <SimpleCard
              title="Card Title"
              subtitle="Card content goes here"
            />
          </ShiningBorder>
        </DemoCard>
        <CodeBlock code={BASIC_SNIPPET} language="tsx" />
      </DocsSection>

      {/* ── All Variants ─────────────────────────────────── */}
      <DocsSection title="All variants">
        <DemoCard className="min-h-[360px]">
          <div className="grid w-full max-w-4xl gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {(
              [
                'default',
                'rainbow',
                'aurora',
                'fire',
                'neon',
                'custom',
              ] as const
            ).map((v) => (
              <ShiningBorder
                key={v}
                variant={v}
                colors={v === 'custom' ? ['#06b6d4', '#10b981', '#06b6d4'] : undefined}
              >
                <SimpleCard title={v} subtitle={`variant="${v}"`} />
              </ShiningBorder>
            ))}
          </div>
        </DemoCard>
      </DocsSection>

      {/* ── On a Button ──────────────────────────────────── */}
      <DocsSection title="On a button">
        <DemoCard>
          <ShiningBorder variant="neon" borderRadius={9999} borderWidth={2}>
            <button className="px-8 py-3 text-sm font-medium text-white">
              Get Started
            </button>
          </ShiningBorder>
        </DemoCard>
      </DocsSection>

      {/* ── Multiple Beams ───────────────────────────────── */}
      <DocsSection title="Multiple beams">
        <DemoCard className="min-h-[320px]">
          <div className="flex flex-wrap items-center justify-center gap-6">
            {[1, 2, 3].map((count) => (
              <ShiningBorder key={count} variant="aurora" beamCount={count}>
                <SimpleCard
                  title={`${count} beam${count > 1 ? 's' : ''}`}
                  subtitle={`beamCount={${count}}`}
                />
              </ShiningBorder>
            ))}
          </div>
        </DemoCard>
      </DocsSection>

      {/* ── Pause on Hover ───────────────────────────────── */}
      <DocsSection title="Pause on hover">
        <DemoCard>
          <ShiningBorder variant="rainbow" pauseOnHover>
            <SimpleCard
              title="Hover me"
              subtitle="The beam pauses on hover"
            />
          </ShiningBorder>
        </DemoCard>
      </DocsSection>

      {/* ── Border Widths ────────────────────────────────── */}
      <DocsSection title="Border widths">
        <DemoCard className="min-h-[320px]">
          <div className="flex flex-wrap items-center justify-center gap-6">
            {[1, 2, 4].map((w) => (
              <ShiningBorder key={w} variant="fire" borderWidth={w}>
                <SimpleCard
                  title={`${w}px border`}
                  subtitle={`borderWidth={${w}}`}
                />
              </ShiningBorder>
            ))}
          </div>
        </DemoCard>
      </DocsSection>

      {/* ── Login Card ───────────────────────────────────── */}
      <DocsSection title="Login card">
        <DemoCard className="min-h-[480px]">
          <ShiningBorder variant="aurora" borderRadius={16} borderWidth={2}>
            <div className="w-80 p-8">
              <h3 className="text-xl font-bold text-white">Login</h3>
              <p className="mt-1 text-sm text-white/50">
                Welcome back. Enter your credentials.
              </p>
              <div className="mt-6 flex flex-col gap-4">
                <input
                  type="email"
                  placeholder="Email"
                  className="rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-white/30 outline-none focus:border-white/25"
                />
                <input
                  type="password"
                  placeholder="Password"
                  className="rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-white/30 outline-none focus:border-white/25"
                />
                <button className="rounded-lg bg-white px-4 py-2.5 text-sm font-medium text-black hover:bg-white/90">
                  Sign in
                </button>
                <button className="rounded-lg border border-white/10 px-4 py-2.5 text-sm text-white/70 hover:bg-white/5">
                  Create account
                </button>
              </div>
            </div>
          </ShiningBorder>
        </DemoCard>
        <CodeBlock code={LOGIN_SNIPPET} language="tsx" />
      </DocsSection>

      {/* ── Props ─────────────────────────────────────────── */}
      <DocsSection title="Props">
        <PropsTable
          props={[
            { name: 'children', type: 'ReactNode', description: 'Content to wrap.' },
            { name: 'variant', type: "'default' | 'rainbow' | 'aurora' | 'fire' | 'neon' | 'custom'", default: '"default"', description: 'Preset color scheme for the beam.' },
            { name: 'colors', type: 'string[]', description: 'Custom gradient colors (used with variant="custom").' },
            { name: 'borderWidth', type: 'number', default: '2', description: 'Border thickness in pixels.' },
            { name: 'borderRadius', type: 'number', default: '12', description: 'Border radius in pixels.' },
            { name: 'speed', type: 'number', default: '1', description: 'Rotation speed multiplier.' },
            { name: 'beamCount', type: 'number', default: '1', description: 'Number of beams (1-3).' },
            { name: 'showGlow', type: 'boolean', default: 'true', description: 'Show a soft glow behind the beam.' },
            { name: 'pauseOnHover', type: 'boolean', default: 'false', description: 'Pause the rotation on hover.' },
            { name: 'innerBackground', type: 'string', default: '"bg-black"', description: 'Tailwind class for the inner content background.' },
            { name: 'className', type: 'string', description: 'Additional classes for the outer wrapper.' },
            { name: 'innerClassName', type: 'string', description: 'Additional classes for the inner content wrapper.' },
          ]}
        />
      </DocsSection>

      {/* ── Dependencies ─────────────────────────────────── */}
      <DocsSection title="Dependencies">
        <div className="flex flex-wrap gap-2">
          {['framer-motion'].map((d) => (
            <span
              key={d}
              className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/60"
            >
              {d}
            </span>
          ))}
        </div>
      </DocsSection>
    </DocsPage>
  )
}
