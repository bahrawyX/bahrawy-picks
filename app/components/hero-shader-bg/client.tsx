'use client'

import { useState } from 'react'
import { HeroShaderBg } from '@/components/bahrawy/hero-shader-bg'
import { RollingButton } from '@/components/bahrawy/rolling-text'
import { CodeBlock } from '@/components/showcase/code-block'
import {
  DocsPage,
  DocsSection,
  DemoCard,
  ControlsRow,
  ControlLabel,
} from '@/components/showcase/docs-page'

const ACCENTS = ['#ff5f03', '#3b82f6', '#a855f7', '#10b981'] as const

export default function HeroShaderBgDocs() {
  const [scheme, setScheme] = useState<'light' | 'dark'>('dark')
  const [accent, setAccent] = useState<string>(ACCENTS[0])

  return (
    <DocsPage
      title="Hero Shader Background"
      slug="hero-shader-bg"
      description="Full-bleed animated GPU background for hero sections. Four stacked shader layers: a slow two-color Swirl base, a ChromaFlow accent that blooms toward the cursor, a FlutedGlass refraction pass that ribs the image like reeded glass, and a FilmGrain finish."
      category="176 · background"
    >
      <DocsSection
        title="Playground"
        description="Move the cursor over the card — the accent bloom follows it. Switch scheme and accent below."
      >
        <ControlsRow>
          <ControlLabel>Scheme</ControlLabel>
          {(['dark', 'light'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setScheme(s)}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                scheme === s
                  ? 'bg-white text-neutral-900'
                  : 'bg-white/10 text-white/70 hover:bg-white/20'
              }`}
            >
              {s}
            </button>
          ))}
          <ControlLabel>Accent</ControlLabel>
          {ACCENTS.map((c) => (
            <button
              key={c}
              onClick={() => setAccent(c)}
              aria-label={`Accent ${c}`}
              className={`h-6 w-6 rounded-full transition-transform ${
                accent === c ? 'scale-110 ring-2 ring-white' : 'hover:scale-105'
              }`}
              style={{ backgroundColor: c }}
            />
          ))}
        </ControlsRow>
        <DemoCard className="relative min-h-[420px] overflow-hidden p-0">
          <div className="pointer-events-auto absolute inset-0">
            <HeroShaderBg scheme={scheme} accentColor={accent} className="pointer-events-auto" />
          </div>
          <div className="pointer-events-none relative z-10 flex flex-col items-start gap-6 px-8">
            <h2
              className={`max-w-md text-3xl font-medium leading-tight tracking-tight sm:text-4xl ${
                scheme === 'dark' ? 'text-white' : 'text-neutral-900'
              }`}
            >
              We craft digital experiences for brands.
            </h2>
            <div className="pointer-events-auto">
              <RollingButton label="Start a project" variant="accent" accentColor={accent} />
            </div>
          </div>
        </DemoCard>
      </DocsSection>

      <DocsSection title="Usage">
        <CodeBlock
          language="tsx"
          code={`import { HeroShaderBg } from '@/components/bahrawy/hero-shader-bg'

<section className="relative min-h-screen overflow-hidden">
  <HeroShaderBg scheme="${scheme}" accentColor="${accent}" />
  <div className="relative z-10">{/* hero content */}</div>
</section>`}
        />
      </DocsSection>

      <DocsSection title="Props">
        <ul className="grid gap-2 sm:grid-cols-2">
          {[
            ['scheme', "'light' | 'dark' palette preset. Default 'dark'."],
            ['accentColor', "ChromaFlow bloom color. Default '#ff5f03'."],
            ['colorA / colorB', 'Swirl colors. Default from scheme.'],
            ['baseColor', 'ChromaFlow base color. Default from scheme.'],
            ['detail', 'Swirl detail. Default 1.7.'],
            ['momentum / radius', 'ChromaFlow motion. Defaults 13 / 3.5.'],
            ['frequency / angle', 'Fluted glass ridge count + angle. Defaults 8 / 31.'],
            ['refraction / highlight / speed', 'Fluted glass optics. Defaults 4 / scheme / 0.15.'],
            ['grain', 'Film grain strength. Default from scheme.'],
            ['className', 'Extra classes on the absolute-inset wrapper.'],
          ].map(([n, b]) => (
            <li key={n} className="rounded-lg border border-white/10 bg-white/[0.02] p-3">
              <code className="font-mono text-xs text-white">{n}</code>
              <p className="mt-1 text-xs text-white/60">{b}</p>
            </li>
          ))}
        </ul>
      </DocsSection>
    </DocsPage>
  )
}
