'use client'

import { useState } from 'react'
import { Skeleton, SkeletonText } from '@/components/bahrawy/skeleton'
import { CodeBlock } from '@/components/showcase/code-block'
import { DocsPage, DocsSection, DemoCard } from '@/components/showcase/docs-page'
import { ControlPanel, SliderControl } from '@/components/showcase/control-panel'

export default function SkeletonDocs() {
  const [lines, setLines] = useState(3)

  const snippet = `import { Skeleton, SkeletonText } from '@/components/bahrawy/skeleton'

// Single shape
<Skeleton width={120} height={120} shape="circle" />

// Multi-line text placeholder
<SkeletonText lines={${lines}} />`

  return (
    <DocsPage
      title="Skeleton"
      slug="skeleton"
      description="Shimmer placeholders for loading states. Use Skeleton for arbitrary shapes (rect, circle, pill) and SkeletonText for multi-line text blocks that taper on the last line."
      category="84 · ui"
    >
      <DocsSection title="Live demo">
        <DemoCard className="min-h-[320px] items-start">
          <div className="grid w-full max-w-3xl gap-8 sm:grid-cols-2">
            {/* Card skeleton */}
            <div className="flex flex-col gap-4 rounded-xl border border-white/10 bg-white/[0.02] p-4">
              <Skeleton width="100%" height={160} />
              <div className="flex items-center gap-3">
                <Skeleton width={40} height={40} shape="circle" />
                <div className="flex-1">
                  <Skeleton width="60%" height="0.9rem" />
                  <div className="mt-2">
                    <Skeleton width="40%" height="0.7rem" />
                  </div>
                </div>
              </div>
              <SkeletonText lines={lines} />
            </div>

            {/* Profile row skeleton */}
            <div className="flex flex-col gap-3 rounded-xl border border-white/10 bg-white/[0.02] p-4">
              <p className="text-xs uppercase tracking-wider text-white/40">List items</p>
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3 border-b border-white/[0.04] pb-3 last:border-b-0">
                  <Skeleton width={36} height={36} shape="circle" />
                  <div className="flex-1">
                    <Skeleton width="55%" height="0.9rem" />
                    <div className="mt-2">
                      <Skeleton width="80%" height="0.7rem" />
                    </div>
                  </div>
                  <Skeleton width={48} height={24} shape="pill" />
                </div>
              ))}
            </div>
          </div>
        </DemoCard>

        <ControlPanel>
          <SliderControl label="Lines" value={lines} onChange={setLines} min={1} max={6} step={1} />
        </ControlPanel>
      </DocsSection>

      <DocsSection title="Usage">
        <CodeBlock code={snippet} language="tsx" />
      </DocsSection>

      <DocsSection title="Props (Skeleton)">
        <ul className="grid gap-2 sm:grid-cols-2">
          {[
            ['width', 'CSS width. Default "100%".'],
            ['height', 'CSS height. Default "1rem".'],
            ['shape', '"rect" | "circle" | "pill". Default "rect".'],
            ['className', 'Extra classes.'],
          ].map(([n, b]) => (
            <li key={n} className="rounded-lg border border-white/10 bg-white/[0.02] p-3">
              <code className="font-mono text-xs text-white">{n}</code>
              <p className="mt-1 text-xs text-white/60">{b}</p>
            </li>
          ))}
        </ul>
      </DocsSection>

      <DocsSection title="Props (SkeletonText)">
        <ul className="grid gap-2 sm:grid-cols-2">
          {[
            ['lines', 'Number of lines. Default 3.'],
            ['lineHeight', 'CSS height per line. Default "0.85rem".'],
            ['gap', 'CSS gap between lines. Default "0.55rem".'],
            ['lastLineWidth', 'Width factor of last line 0–1. Default 0.6.'],
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
        <p className="text-sm text-white/50">No external dependencies. The shimmer animation lives in tailwind.config.</p>
      </DocsSection>
    </DocsPage>
  )
}
