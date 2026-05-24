'use client'

import { Halo } from '@/components/bahrawy/halo'
import { CodeBlock } from '@/components/showcase/code-block'
import { DocsPage, DocsSection, DemoCard } from '@/components/showcase/docs-page'

const SNIPPET = `import { Halo } from '@/components/bahrawy/halo'

<div className="relative h-screen w-full">
  <Halo
    baseColor="#1B1B4B"
    peakColor="#FF6FA8"
    ambientColor="#5E5CE6"
    strength={1.4}
    radius={1.6}
  />
  {/* Your content on top */}
  <div className="absolute inset-0 grid place-items-center">
    <h1>Move your cursor</h1>
  </div>
</div>`

export default function HaloDocs() {
  return (
    <DocsPage
      title="Halo"
      slug="halo"
      description="A cursor-reactive WebGL background. ~3,000 glowy spheres on a tilted plane (Three.js InstancedMesh). A custom vertex shader lifts every sphere toward the cursor's world-projected position via a Gaussian falloff, drags the halo behind cursor velocity, and tilts the whole scene for parallax. Spheres recolor on bump height with rim fresnel for soft glow."
      category="02 · background"
    >
      <DocsSection title="Move your cursor anywhere in the canvas">
        <DemoCard className="min-h-[520px] items-stretch p-0">
          <div className="relative h-[500px] w-full overflow-hidden rounded-2xl">
            <Halo />
            <div className="pointer-events-none absolute inset-x-0 top-6 z-10 text-center">
              <p className="text-[10.5px] font-semibold uppercase tracking-[0.32em] text-white/45">
                Hover · drag · move
              </p>
              <h2 className="mt-2 bg-gradient-to-b from-white to-white/55 bg-clip-text text-3xl font-semibold tracking-tight text-transparent sm:text-4xl">
                Halo follows you.
              </h2>
            </div>
            <div className="pointer-events-none absolute inset-x-0 bottom-6 z-10 text-center text-[10.5px] tracking-tight text-white/40">
              3,136 instanced spheres · cursor-displaced vertex shader · velocity-dragged halo
            </div>
          </div>
        </DemoCard>
      </DocsSection>

      <DocsSection title="Cool palette — emerald + cyan">
        <DemoCard className="min-h-[420px] items-stretch p-0">
          <div className="relative h-[400px] w-full overflow-hidden rounded-2xl">
            <Halo
              baseColor="#062B22"
              peakColor="#34D399"
              ambientColor="#22D3EE"
              background="#03110F"
              strength={1.6}
              radius={1.8}
            />
          </div>
        </DemoCard>
      </DocsSection>

      <DocsSection title="Dense + warm — amber + rose">
        <DemoCard className="min-h-[420px] items-stretch p-0">
          <div className="relative h-[400px] w-full overflow-hidden rounded-2xl">
            <Halo
              density={68}
              extent={6}
              sphereRadius={0.055}
              baseColor="#3B1108"
              peakColor="#FFD60A"
              ambientColor="#FF453A"
              background="#0F0606"
              strength={1.3}
              radius={1.3}
            />
          </div>
        </DemoCard>
      </DocsSection>

      <DocsSection title="Usage">
        <CodeBlock code={SNIPPET} language="tsx" />
        <p className="mt-3 text-xs text-white/45">
          The canvas fills its parent. Wrap it in a <code className="font-mono">relative</code>{' '}
          container with a fixed height (or <code className="font-mono">h-screen</code> for a
          full-bleed hero) and layer content on top with <code className="font-mono">absolute</code>{' '}
          + <code className="font-mono">pointer-events-none</code> so the canvas keeps receiving
          cursor input.
        </p>
      </DocsSection>

      <DocsSection title="Props">
        <ul className="grid gap-2 sm:grid-cols-2">
          {[
            ['density', 'Grid resolution NxN. Default 56 (≈3,136 spheres).'],
            ['extent', 'Plane half-extent in world units. Default 6.'],
            ['sphereRadius', 'Per-sphere radius. Default 0.07.'],
            ['strength', 'Peak bump height under the cursor. Default 1.4.'],
            ['radius', 'Cursor halo falloff radius (world units). Default 1.6.'],
            ['baseColor', 'Sphere color at zero bump. Default deep indigo.'],
            ['peakColor', 'Sphere color at peak bump + rim glow. Default warm pink.'],
            ['ambientColor', 'Ambient bounce color baked into the rim. Default SF indigo.'],
            ['background', 'WebGL clear color behind the spheres. Default #06060C.'],
            ['paused', 'Freeze the animation + cursor reaction. Default false.'],
            ['className', 'Extra classes on the outer canvas wrapper.'],
          ].map(([n, b]) => (
            <li key={n} className="rounded-lg border border-white/10 bg-white/[0.02] p-3">
              <code className="font-mono text-xs text-white">{n}</code>
              <p className="mt-1 text-xs text-white/60">{b}</p>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-xs text-white/45">
          On idle (cursor not over the canvas), the halo strength eases to ~18% so the field
          still breathes with a two-frequency sine wave but doesn&apos;t feel forgotten.
        </p>
      </DocsSection>

      <DocsSection title="Dependencies">
        <div className="flex flex-wrap gap-2">
          {['three'].map((d) => (
            <code key={d} className="rounded-md border border-white/10 bg-white/[0.04] px-2 py-1 font-mono text-xs text-white/80">
              {d}
            </code>
          ))}
        </div>
      </DocsSection>
    </DocsPage>
  )
}
