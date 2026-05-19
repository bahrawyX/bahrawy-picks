'use client'

import { CardStackScroll } from '@/components/bahrawy/card-stack-scroll'
import { CodeBlock } from '@/components/showcase/code-block'
import { DocsPage, DocsSection } from '@/components/showcase/docs-page'

const cards = [
  {
    id: 'copy-paste',
    number: '01',
    title: 'Copy & Paste',
    description:
      'Every component is self-contained. Copy it into your project, customize the props, and ship. No complex package installations or peer dependency chains.',
    accentColor: '#7C3AED',
    icon: (
      <svg
        className="h-8 w-8 text-purple-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H9.75"
        />
      </svg>
    ),
  },
  {
    id: 'components',
    number: '02',
    title: '35+ Components',
    description:
      'From data tables to color pickers, from Kanban boards to signature pads. Every component you need for a production app, built with the same quality bar.',
    accentColor: '#2563EB',
    icon: (
      <svg
        className="h-8 w-8 text-blue-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25a2.25 2.25 0 0 1-2.25-2.25v-2.25Z"
        />
      </svg>
    ),
  },
  {
    id: 'framer',
    number: '03',
    title: 'Motion Built In',
    description:
      'Framer Motion and GSAP animations are woven into every component. Smooth transitions, spring physics, and scroll-driven effects — all out of the box.',
    accentColor: '#059669',
    icon: (
      <svg
        className="h-8 w-8 text-emerald-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z"
        />
      </svg>
    ),
  },
  {
    id: 'open-source',
    number: '04',
    title: 'Open Source',
    description:
      'Built in the open. Every component is free to use, modify, and distribute. Community-driven development with contributions welcome.',
    accentColor: '#D97706',
    icon: (
      <svg
        className="h-8 w-8 text-amber-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 16.5"
        />
      </svg>
    ),
  },
]

const snippet = `import { CardStackScroll } from '@/components/bahrawy/card-stack-scroll'

<CardStackScroll
  sectionLabel="Why Bahrawy?"
  heading="Everything you need"
  cards={[
    {
      id: 'feature-1',
      number: '01',
      title: 'Copy & Paste',
      description: 'Self-contained components...',
      accentColor: '#7C3AED',
      icon: <YourIcon />,
    },
    // ... more cards
  ]}
/>`

export default function CardStackScrollDocs() {
  return (
    <DocsPage
      category="15 · scroll"
      title="Card Stack Scroll"
      slug="card-stack-scroll"
      description="Pinned scroll section where cards stack and replace each other as you scroll. Physical deck-of-cards feel with accent color background transitions and progress indicators."
    >
      <DocsSection
        title="Live demo"
        description="Scroll through to see cards stack and transition."
      >
        <p className="text-sm text-white/40">
          &#8595; Scroll down to enter the card stack
        </p>
      </DocsSection>

      {/* Full card stack demo */}
      <CardStackScroll
        sectionLabel="Why Bahrawy?"
        heading="Everything you need"
        cards={cards}
        className="rounded-xl border border-white/10 overflow-hidden"
      />

      {/* Content below to show exit */}
      <DocsSection title="Usage">
        <CodeBlock code={snippet} language="tsx" />
      </DocsSection>

      <DocsSection title="Dependencies">
        <div className="flex flex-wrap gap-2">
          {['gsap', '@gsap/react'].map((d) => (
            <code
              key={d}
              className="rounded-md border border-white/10 bg-white/[0.04] px-2 py-1 font-mono text-xs text-white/80"
            >
              {d}
            </code>
          ))}
        </div>
      </DocsSection>
    </DocsPage>
  )
}
