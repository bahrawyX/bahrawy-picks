'use client'

import { useState } from 'react'
import {
  DemoCard,
  DocsPage,
  DocsSection,
} from '@/components/showcase/docs-page'
import { CodeBlock } from '@/components/showcase/code-block'
import {
  TextReveal,
  GradientText,
  TypewriterText,
  FlipText,
  TextScramble,
  BlurReveal,
  NeonGlow,
  FloatingElements,
  SplitReveal,
  ParallaxSection,
  StaggerReveal,
} from '@/components/bahrawy/animations'

// ---------------------------------------------------------------------------
// Code snippets
// ---------------------------------------------------------------------------

const TEXT_REVEAL_SNIPPET = `<TextReveal
  text="Beautiful animations that reveal on scroll"
  variant="words"
  stagger={0.05}
/>`

const GRADIENT_TEXT_SNIPPET = `<GradientText preset="aurora" as="h2" className="text-4xl font-bold">
  Aurora gradient flowing through text
</GradientText>`

const TYPEWRITER_SNIPPET = `<TypewriterText
  strings={[
    "Build stunning interfaces",
    "Ship faster with Bahrawy",
    "Animations made simple",
  ]}
  speed={80}
  cursor
/>`

const FLIP_TEXT_SNIPPET = `<FlipText
  text="DEPARTURES"
  stagger={0.08}
  duration={0.4}
/>`

const TEXT_SCRAMBLE_SNIPPET = `<TextScramble
  text="DECRYPTING MESSAGE..."
  trigger="inView"
  charset="matrix"
  duration={2}
/>`

const BLUR_REVEAL_SNIPPET = `<BlurReveal direction="up" blur={20} stagger={0.2}>
  <h2>Focus in</h2>
  <p>Content reveals from blur</p>
</BlurReveal>`

const NEON_GLOW_SNIPPET = `<NeonGlow color="cyan" intensity={6} pulse flicker>
  OPEN 24/7
</NeonGlow>`

const FLOATING_SNIPPET = `<FloatingElements
  count={15}
  size={[4, 12]}
  opacity={[0.1, 0.4]}
  speed={0.8}
/>`

const SPLIT_REVEAL_SNIPPET = `<SplitReveal
  front={<div className="bg-zinc-800 p-8 text-center">Hover me</div>}
  back={<div className="bg-blue-600 p-8 text-center">Revealed!</div>}
  trigger="hover"
/>`

const PARALLAX_SNIPPET = `<ParallaxSection speed={-0.3}>
  <h1>I move slower on scroll</h1>
</ParallaxSection>`

const STAGGER_SNIPPET = `<StaggerReveal direction="up" stagger={0.1}>
  <Card />
  <Card />
  <Card />
</StaggerReveal>`

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function AnimationsDocs() {
  const [scrambleKey, setScrambleKey] = useState(0)

  return (
    <DocsPage
      title="Animations"
      slug="animations"
      description="11 production-ready animation components. Drop them in and instantly elevate your UI."
      category="10 · MOTION"
    >
      {/* 1 — Text Reveal */}
      <DocsSection
        title="Text Reveal"
        description="Words appear one by one with a smooth clip-mask slide-up effect."
      >
        <DemoCard className="items-center justify-center min-h-[200px]">
          <div className="space-y-6 text-center">
            <TextReveal
              text="Beautiful animations that reveal on scroll"
              variant="words"
              as="h2"
              className="text-2xl font-bold text-white"
            />
            <TextReveal
              text="Each character slides up independently"
              variant="chars"
              as="p"
              className="text-lg text-white/60"
              stagger={0.02}
              delay={0.5}
            />
          </div>
        </DemoCard>
        <CodeBlock code={TEXT_REVEAL_SNIPPET} language="tsx" />
      </DocsSection>

      {/* 2 — Gradient Text */}
      <DocsSection
        title="Gradient Text"
        description="Text with an animated flowing gradient — like aurora light moving through the letters."
      >
        <DemoCard className="flex-col gap-6 items-center justify-center min-h-[280px]">
          <GradientText preset="aurora" as="h2" className="text-4xl font-bold tracking-tight">
            Aurora gradient
          </GradientText>
          <GradientText preset="fire" as="h2" className="text-4xl font-bold tracking-tight">
            Fire gradient
          </GradientText>
          <GradientText preset="ocean" as="h2" className="text-4xl font-bold tracking-tight">
            Ocean gradient
          </GradientText>
          <GradientText preset="candy" as="h2" className="text-3xl font-bold tracking-tight">
            Candy gradient
          </GradientText>
          <GradientText preset="rainbow" as="h2" className="text-3xl font-bold tracking-tight">
            Rainbow gradient
          </GradientText>
        </DemoCard>
        <CodeBlock code={GRADIENT_TEXT_SNIPPET} language="tsx" />
      </DocsSection>

      {/* 3 — Typewriter Text */}
      <DocsSection
        title="Typewriter Text"
        description="Classic typewriter with natural speed variation, delete-and-retype cycling, and blinking cursor."
      >
        <DemoCard className="items-center justify-center min-h-[120px]">
          <div className="text-2xl font-mono text-white">
            <TypewriterText
              strings={[
                'Build stunning interfaces.',
                'Ship faster with Bahrawy.',
                'Animations made simple.',
                'Drop in and go.',
              ]}
              speed={80}
              deleteSpeed={40}
              pauseDuration={1500}
              cursor
            />
          </div>
        </DemoCard>
        <CodeBlock code={TYPEWRITER_SNIPPET} language="tsx" />
      </DocsSection>

      {/* 4 — Flip Text */}
      <DocsSection
        title="Flip Text"
        description="Split-flap display effect — each character flips in like a departures board."
      >
        <DemoCard className="items-center justify-center min-h-[140px]">
          <FlipText
            text="DEPARTURES"
            className="text-5xl font-bold tracking-widest text-white"
            charClassName="text-white"
            stagger={0.08}
            duration={0.4}
          />
        </DemoCard>
        <CodeBlock code={FLIP_TEXT_SNIPPET} language="tsx" />
      </DocsSection>

      {/* 5 — Text Scramble */}
      <DocsSection
        title="Text Scramble"
        description="Characters scramble through random chars before resolving to the final text."
      >
        <DemoCard className="flex-col gap-6 items-center justify-center min-h-[200px]">
          <TextScramble
            key={`matrix-${scrambleKey}`}
            text="DECRYPTING SECURE MESSAGE..."
            trigger="inView"
            charset="matrix"
            duration={2}
            className="text-xl font-mono text-emerald-400"
          />
          <TextScramble
            key={`binary-${scrambleKey}`}
            text="SYSTEM ONLINE"
            trigger="inView"
            charset="binary"
            duration={1.5}
            className="text-lg font-mono text-cyan-400"
          />
          <button
            onClick={() => setScrambleKey((k) => k + 1)}
            className="mt-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/60 hover:bg-white/10 hover:text-white transition-colors"
          >
            Replay
          </button>
        </DemoCard>
        <CodeBlock code={TEXT_SCRAMBLE_SNIPPET} language="tsx" />
      </DocsSection>

      {/* 6 — Blur Reveal */}
      <DocsSection
        title="Blur Reveal"
        description="Content fades in from heavy blur to sharp — like a camera coming into focus."
      >
        <DemoCard className="items-center justify-center min-h-[200px]">
          <BlurReveal direction="up" blur={20} stagger={0.2} once={false}>
            <h3 className="text-3xl font-bold text-white">Coming into focus</h3>
            <p className="mt-2 text-lg text-white/50">
              Watch the blur dissolve as you scroll
            </p>
          </BlurReveal>
        </DemoCard>
        <CodeBlock code={BLUR_REVEAL_SNIPPET} language="tsx" />
      </DocsSection>

      {/* 7 — Neon Glow */}
      <DocsSection
        title="Neon Glow"
        description="Pulsing neon glow effect with optional realistic flicker."
      >
        <DemoCard className="flex-col gap-8 items-center justify-center min-h-[280px] bg-black/60">
          <NeonGlow color="cyan" intensity={7} pulse as="h2" className="text-4xl font-bold">
            OPEN 24/7
          </NeonGlow>
          <NeonGlow color="pink" intensity={6} pulse flicker as="h2" className="text-3xl font-bold">
            COCKTAILS
          </NeonGlow>
          <NeonGlow color="green" intensity={5} pulse as="span" className="text-2xl font-bold">
            VACANCY
          </NeonGlow>
        </DemoCard>
        <CodeBlock code={NEON_GLOW_SNIPPET} language="tsx" />
      </DocsSection>

      {/* 8 — Floating Elements */}
      <DocsSection
        title="Floating Elements"
        description="Elements float and drift gently in random directions — perfect for hero backgrounds."
      >
        <DemoCard className="relative items-center justify-center min-h-[300px] overflow-hidden">
          <FloatingElements
            count={20}
            size={[4, 14]}
            opacity={[0.1, 0.4]}
            speed={0.8}
            color="white"
            className="absolute inset-0"
          />
          <p className="relative z-10 text-lg font-medium text-white/70">
            Particles floating around this text
          </p>
        </DemoCard>
        <CodeBlock code={FLOATING_SNIPPET} language="tsx" />
      </DocsSection>

      {/* 9 — Split Reveal */}
      <DocsSection
        title="Split Reveal"
        description="Two halves split apart to reveal hidden content — like opening curtains."
      >
        <DemoCard className="items-center justify-center min-h-[250px]">
          <div className="w-full max-w-sm">
            <SplitReveal
              front={
                <div className="flex h-48 items-center justify-center rounded-xl bg-zinc-800 text-white/60">
                  Hover to reveal
                </div>
              }
              back={
                <div className="flex h-48 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 text-white font-semibold text-lg">
                  Hidden content!
                </div>
              }
              trigger="hover"
              direction="horizontal"
            />
          </div>
        </DemoCard>
        <CodeBlock code={SPLIT_REVEAL_SNIPPET} language="tsx" />
      </DocsSection>

      {/* 10 — Parallax Section */}
      <DocsSection
        title="Parallax Section"
        description="Elements move at different speeds as you scroll — creating depth."
      >
        <DemoCard className="flex-col items-center justify-center min-h-[200px] overflow-hidden">
          <ParallaxSection speed={-0.4}>
            <p className="text-3xl font-bold text-white/80">Slow layer</p>
          </ParallaxSection>
          <ParallaxSection speed={0.2}>
            <p className="text-lg text-white/40 mt-4">Fast layer (moves other way)</p>
          </ParallaxSection>
        </DemoCard>
        <CodeBlock code={PARALLAX_SNIPPET} language="tsx" />
      </DocsSection>

      {/* 11 — Stagger Reveal */}
      <DocsSection
        title="Stagger Reveal"
        description="Container that automatically staggers its children in on scroll."
      >
        <DemoCard className="items-start justify-center min-h-[200px]">
          <StaggerReveal direction="up" stagger={0.1} className="flex flex-wrap gap-3 w-full justify-center">
            {['Component', 'Library', 'Animations', 'Tailwind', 'React', 'Motion'].map(
              (label) => (
                <div
                  key={label}
                  className="rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-medium text-white/70"
                >
                  {label}
                </div>
              )
            )}
          </StaggerReveal>
        </DemoCard>
        <CodeBlock code={STAGGER_SNIPPET} language="tsx" />
      </DocsSection>
    </DocsPage>
  )
}
