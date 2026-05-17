import { Code2, Zap, Heart } from 'lucide-react'
import { Reveal } from '@/components/reveal'

const features = [
  {
    icon: Code2,
    title: 'Copy & paste',
    description:
      'Drop components straight into your project. No installs, no lock-in. Own the code you ship.',
  },
  {
    icon: Zap,
    title: 'Next.js first',
    description:
      'Built for the App Router, React Server Components, and modern Next.js patterns out of the box.',
  },
  {
    icon: Heart,
    title: 'Open source',
    description:
      'MIT licensed. Free forever. Built in the open with a community of designers and developers.',
  },
]

export function Features() {
  return (
    <section
      id="components"
      className="relative overflow-hidden bg-black py-32 sm:py-40"
    >
      {/* Faint top divider glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent"
      />

      <div className="mx-auto max-w-6xl px-6">
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-medium uppercase tracking-[0.18em] text-white/40">
              Everything you need
            </p>
            <h2 className="mt-4 text-balance text-4xl font-semibold tracking-tight text-white sm:text-5xl">
              Components without the overhead.
            </h2>
            <p className="mt-5 text-pretty text-white/60">
              A growing library of carefully crafted React & Next.js components.
              Designed to be copied, owned, and customized — not imported and
              forgotten.
            </p>
          </div>
        </Reveal>

        <div className="mt-20 grid gap-6 md:grid-cols-3">
          {features.map((feat, i) => (
            <Reveal key={feat.title} delay={i * 80}>
              <article className="group relative h-full overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-8 transition-all duration-m3-enter ease-m3-enter hover:border-white/20 hover:bg-white/[0.05]">
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 transition-opacity duration-m3-enter ease-m3-enter group-hover:opacity-100"
                />
                <div className="mb-6 inline-flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white shadow-inner shadow-white/5">
                  <feat.icon className="h-5 w-5" strokeWidth={1.75} />
                </div>
                <h3 className="text-lg font-semibold tracking-tight text-white">
                  {feat.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-white/60">
                  {feat.description}
                </p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
