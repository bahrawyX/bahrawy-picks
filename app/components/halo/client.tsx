'use client'

import { Halo } from '@/components/bahrawy/halo'
import { CodeBlock } from '@/components/showcase/code-block'
import { DocsPage, DocsSection, DemoCard } from '@/components/showcase/docs-page'

const SNIPPET = `import { Halo } from '@/components/bahrawy/halo'

<div className="relative h-screen w-full bg-black">
  <Halo
    color1="#FF6FA8"
    color2="#5E5CE6"
    color3="#22D3EE"
    density={28}
    mouseInfluence={0.45}
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
      description="A cursor-reactive WebGL background built on a single OGL fragment shader (same engine as Line Waves). A dense grid of iridescent dots pulses on its own time; as you move the cursor, the grid visibly bends + spirals around it via a Gaussian-falloff warp, the pattern smears in the direction of cursor velocity, and a bright accent halo brightens the dots in the cursor's neighborhood. The field drifts slowly when idle so the scene is always alive."
      category="02 · background"
    >
      <DocsSection title="Move your cursor anywhere in the canvas">
        <DemoCard className="min-h-[520px] items-stretch p-0">
          <div className="relative h-[500px] w-full overflow-hidden rounded-2xl bg-black">
            <Halo />
            <div className="pointer-events-none absolute inset-x-0 top-6 z-10 text-center">
              <p className="text-[10.5px] font-semibold uppercase tracking-[0.32em] text-white/45">
                Hover · drag · move
              </p>
              <h2 className="mt-2 bg-gradient-to-b from-white to-white/55 bg-clip-text text-3xl font-semibold tracking-tight text-transparent sm:text-4xl">
                Halo bends around you.
              </h2>
            </div>
            <div className="pointer-events-none absolute inset-x-0 bottom-6 z-10 text-center text-[10.5px] tracking-tight text-white/45">
              Single OGL fragment shader · UV-warped dot mesh · velocity smear · cursor halo
            </div>
          </div>
        </DemoCard>
      </DocsSection>

      <DocsSection title="Cool — emerald · cyan · indigo">
        <DemoCard className="min-h-[420px] items-stretch p-0">
          <div className="relative h-[400px] w-full overflow-hidden rounded-2xl bg-black">
            <Halo
              color1="#34D399"
              color2="#22D3EE"
              color3="#5E5CE6"
              density={32}
              mouseInfluence={0.5}
              speed={0.5}
            />
          </div>
        </DemoCard>
      </DocsSection>

      <DocsSection title="Warm — amber · rose · violet">
        <DemoCard className="min-h-[420px] items-stretch p-0">
          <div className="relative h-[400px] w-full overflow-hidden rounded-2xl bg-black">
            <Halo
              color1="#FFD60A"
              color2="#FF6FA8"
              color3="#BF5AF2"
              density={24}
              dotSize={0.16}
              mouseInfluence={0.55}
              brightness={1.1}
            />
          </div>
        </DemoCard>
      </DocsSection>

      <DocsSection title="Dense + subtle — mono indigo">
        <DemoCard className="min-h-[360px] items-stretch p-0">
          <div className="relative h-[340px] w-full overflow-hidden rounded-2xl bg-black">
            <Halo
              color1="#5E5CE6"
              color2="#A99CFF"
              color3="#0A84FF"
              density={42}
              dotSize={0.09}
              speed={0.3}
              mouseInfluence={0.35}
              brightness={0.95}
            />
          </div>
        </DemoCard>
      </DocsSection>

      <DocsSection title="Usage">
        <CodeBlock code={SNIPPET} language="tsx" />
        <p className="mt-3 text-xs text-white/45">
          The canvas has a transparent clear color (premultipliedAlpha:false), so it sits on
          top of whatever background you put behind it. Wrap it in a{' '}
          <code className="font-mono">relative</code> container with a fixed height and put
          your content above with <code className="font-mono">absolute</code> +{' '}
          <code className="font-mono">pointer-events-none</code> so the canvas keeps receiving
          cursor input.
        </p>
      </DocsSection>

      <DocsSection title="Props">
        <ul className="grid gap-2 sm:grid-cols-2">
          {[
            ['density', 'Number of dots across the short axis. Default 28.'],
            ['dotSize', 'Dot radius relative to cell size (0..0.5). Default 0.12.'],
            ['speed', 'Animation speed multiplier. Default 0.4.'],
            ['mouseInfluence', 'Strength of the cursor warp + halo. Default 0.45.'],
            ['color1 / color2 / color3', 'Three iridescent stops mixed across the field.'],
            ['brightness', 'Overall brightness multiplier. Default 1.0.'],
            ['paused', 'Freeze the animation + cursor interaction. Default false.'],
            ['className', 'Extra classes on the outer canvas wrapper.'],
          ].map(([n, b]) => (
            <li key={n} className="rounded-lg border border-white/10 bg-white/[0.02] p-3">
              <code className="font-mono text-xs text-white">{n}</code>
              <p className="mt-1 text-xs text-white/60">{b}</p>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-xs text-white/45">
          The cursor warp is a Gaussian falloff <code className="font-mono">exp(-d² · 4.5)</code>{' '}
          that pulls pixels radially toward the cursor plus a tangential swirl so the grid
          visibly bends instead of just collapsing inward.
        </p>
      </DocsSection>

      <DocsSection title="Dependencies">
        <div className="flex flex-wrap gap-2">
          {['ogl'].map((d) => (
            <code key={d} className="rounded-md border border-white/10 bg-white/[0.04] px-2 py-1 font-mono text-xs text-white/80">
              {d}
            </code>
          ))}
        </div>
      </DocsSection>
    </DocsPage>
  )
}
