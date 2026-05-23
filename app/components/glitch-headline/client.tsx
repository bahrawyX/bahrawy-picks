'use client'

import { GlitchHeadline } from '@/components/bahrawy/glitch-headline'
import { CodeBlock } from '@/components/showcase/code-block'
import { DocsPage, DocsSection } from '@/components/showcase/docs-page'

const SNIPPET = `import { GlitchHeadline } from '@/components/bahrawy/glitch-headline'

<h1 className="text-7xl font-semibold tracking-tight">
  <GlitchHeadline>SIGNAL LOST</GlitchHeadline>
</h1>`

export default function GlitchHeadlineDocs() {
  return (
    <DocsPage
      title="Glitch Headline"
      slug="glitch-headline"
      description="A CRT-damaged display headline. Cyan + magenta channels drift in idle wobble; on hover a clip-path band sweeps through the text and slices it horizontally, shifting chunks a few pixels out of register. Pure CSS — no animation loop, no JS runtime cost."
      category="119 · type effect"
    >
      <DocsSection
        title="Live demo"
        description="Hover the headline. The idle wobble is always on, the slice band kicks in on hover."
      >
        <p className="text-xs text-white/40">↓ hover the text</p>
      </DocsSection>

      <div className="flex min-h-[320px] items-center justify-center rounded-xl border border-white/10 bg-black/40 px-8 py-16">
        <h1
          className="text-center font-semibold leading-none tracking-tight text-white"
          style={{ fontSize: 'clamp(48px, 10vw, 144px)', letterSpacing: '-0.04em' }}
        >
          <GlitchHeadline>SIGNAL LOST</GlitchHeadline>
        </h1>
      </div>

      <DocsSection title="Always-on variant">
        <p className="text-xs text-white/40">
          Pass <code className="font-mono text-white/70">mode=&quot;always&quot;</code> to keep the slice band running even at rest.
        </p>
      </DocsSection>

      <div className="flex min-h-[260px] items-center justify-center rounded-xl border border-white/10 bg-black/40 px-8 py-12">
        <h2
          className="text-center font-semibold leading-none tracking-tight text-white"
          style={{ fontSize: 'clamp(36px, 7vw, 96px)', letterSpacing: '-0.04em' }}
        >
          <GlitchHeadline
            mode="always"
            channelA="#22D3EE"
            channelB="#F472B6"
            speed={1.3}
            intensity={8}
          >
            ERROR · 404
          </GlitchHeadline>
        </h2>
      </div>

      <DocsSection title="Usage">
        <CodeBlock code={SNIPPET} language="tsx" />
      </DocsSection>

      <DocsSection title="How it works">
        <ul className="grid gap-2 sm:grid-cols-2">
          {[
            ['Three stacked copies', 'Same text rendered three times: cyan layer (channel A, offset left/up), magenta layer (channel B, offset right/down), and a base white layer in the middle.'],
            ['Idle wobble', "Each channel runs its own keyframe with `steps(2, jump-end)` timing — so the offsets stutter rather than ease smoothly. Reads as broken analog signal, not as fluid animation."],
            ['Slice band on hover', "A fourth copy is positioned absolute with `clip-path: inset(top right bottom left)`. The clip moves through 6 different horizontal bands per cycle, and each band has its own X offset, so chunks of the text slip out of register."],
            ['Per-instance keyframes', "Each `<GlitchHeadline>` injects its own `<style>` block scoped by a unique id, so multiple headlines on a page with different `intensity` / `speed` don't fight each other."],
            ['Scoped variables', "Channel colors, intensity, and durations are pushed in as CSS custom properties (`--gh-a`, `--gh-half`, `--gh-dur`, `--gh-slice`) so the keyframes stay generic."],
            ['No JS runtime', "All animation is CSS keyframes. No `requestAnimationFrame`, no event listeners — it costs nothing once the page is rendered."],
            ['Reduced motion', "If `prefers-reduced-motion: reduce` → all animations are turned off and the color channels collapse to opacity 0. Just the clean base text remains."],
          ].map(([n, b]) => (
            <li key={n} className="rounded-lg border border-white/10 bg-white/[0.02] p-3">
              <code className="font-mono text-xs text-white">{n}</code>
              <p className="mt-1 text-xs text-white/60">{b}</p>
            </li>
          ))}
        </ul>
      </DocsSection>

      <DocsSection title="Props">
        <ul className="grid gap-2 sm:grid-cols-2">
          {[
            ['children', 'string — the text to display (required).'],
            ['mode', "'hover' (default), 'always', or 'idle'. Idle disables the slice band; always keeps everything boosted."],
            ['channelA', 'Color of the left/up offset layer. Default cyan (#22D3EE).'],
            ['channelB', 'Color of the right/down offset layer. Default magenta (#F472B6).'],
            ['baseColor', 'Base text color. Default white.'],
            ['scanlines', 'Render horizontal scan-lines over the text. Default true.'],
            ['speed', 'Cadence multiplier. 1 default; 2 = twice as fast.'],
            ['intensity', 'Maximum channel offset in px at peak. Default 6.'],
            ['instanceId', 'Stable id for keyframes — supply when SSR-rendering multiple instances.'],
            ['className', 'Extra classes on the wrapper.'],
          ].map(([n, b]) => (
            <li key={n} className="rounded-lg border border-white/10 bg-white/[0.02] p-3">
              <code className="font-mono text-xs text-white">{n}</code>
              <p className="mt-1 text-xs text-white/60">{b}</p>
            </li>
          ))}
        </ul>
      </DocsSection>

      <DocsSection title="Dependencies">
        <div className="text-xs text-white/55">No external runtime dependencies. Just React.</div>
      </DocsSection>
    </DocsPage>
  )
}
