'use client'

import { TwitterCard } from '@/components/bahrawy/twitter-card'
import { CodeBlock } from '@/components/showcase/code-block'
import { DemoCard, DocsPage, DocsSection } from '@/components/showcase/docs-page'
import { PropsTable } from '@/components/showcase/props-table'

// ---------------------------------------------------------------------------
// Code snippets
// ---------------------------------------------------------------------------

const BASIC_SNIPPET = `import { TwitterCard } from '@/components/bahrawy/twitter-card'

<TwitterCard
  name="Abdelrahman"
  handle="bahrawy"
  content="Just shipped a new component library. Dark mode first, motion-rich, and fully typed. Check it out!"
/>`

const METRICS_SNIPPET = `<TwitterCard
  name="Abdelrahman"
  handle="bahrawy"
  verified="blue"
  avatar="https://github.com/bahrawy.png"
  content="Just shipped a new component library. Dark mode first, motion-rich, and fully typed. Check it out!"
  timestamp={new Date('2025-01-15T15:42:00')}
  likes={1200}
  retweets={342}
  replies={89}
  views={45000}
/>`

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function TwitterCardDocs() {
  return (
    <DocsPage
      category="61 · card"
      title="Twitter card"
      slug="twitter-card"
      description="A beautiful tweet-style social post card with content parsing, verified badges, metric formatting, and platform branding. Built with Framer Motion animations."
    >
      {/* ── Basic ─────────────────────────────────────────────────────── */}
      <DocsSection title="Basic">
        <DemoCard>
          <div className="w-full max-w-lg">
            <TwitterCard
              name="Abdelrahman"
              handle="bahrawy"
              content="Just shipped a new component library. Dark mode first, motion-rich, and fully typed. Check it out!"
            />
          </div>
        </DemoCard>
        <CodeBlock code={BASIC_SNIPPET} language="tsx" />
      </DocsSection>

      {/* ── With Image ────────────────────────────────────────────────── */}
      <DocsSection title="With image">
        <DemoCard>
          <div className="w-full max-w-lg">
            <TwitterCard
              name="Abdelrahman"
              handle="bahrawy"
              verified="blue"
              content="The new code editor component is looking really clean. Syntax highlighting, multiple themes, and a mini toolbar."
              image="https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&h=300&fit=crop"
              timestamp={new Date('2025-01-15T15:42:00')}
              likes={824}
              retweets={156}
              replies={42}
              views={12400}
            />
          </div>
        </DemoCard>
      </DocsSection>

      {/* ── Verified Variants ─────────────────────────────────────────── */}
      <DocsSection title="Verified variants">
        <DemoCard className="min-h-[200px]">
          <div className="flex w-full max-w-3xl flex-col gap-4 sm:flex-row">
            <div className="flex-1">
              <TwitterCard
                name="Blue Verified"
                handle="blueverified"
                verified="blue"
                content="This account has a blue verification badge."
              />
            </div>
            <div className="flex-1">
              <TwitterCard
                name="Gold Verified"
                handle="goldorg"
                verified="gold"
                content="This account has a gold organization badge."
              />
            </div>
            <div className="flex-1">
              <TwitterCard
                name="Gray Verified"
                handle="graygov"
                verified="gray"
                content="This account has a gray government badge."
              />
            </div>
          </div>
        </DemoCard>
      </DocsSection>

      {/* ── With Metrics ──────────────────────────────────────────────── */}
      <DocsSection title="With metrics">
        <DemoCard>
          <div className="w-full max-w-lg">
            <TwitterCard
              name="Abdelrahman"
              handle="bahrawy"
              verified="blue"
              avatar="https://github.com/bahrawy.png"
              content="Just shipped a new component library. Dark mode first, motion-rich, and fully typed. Check it out!"
              timestamp={new Date('2025-01-15T15:42:00')}
              likes={1200}
              retweets={342}
              replies={89}
              views={45000}
            />
          </div>
        </DemoCard>
        <CodeBlock code={METRICS_SNIPPET} language="tsx" />
      </DocsSection>

      {/* ── Long Content ──────────────────────────────────────────────── */}
      <DocsSection title="Long content">
        <DemoCard>
          <div className="w-full max-w-lg">
            <TwitterCard
              name="Abdelrahman"
              handle="bahrawy"
              verified="blue"
              content={
                "Building a modern component library from scratch is no small feat. You have to think about accessibility, performance, animation, theming, and developer experience all at once. " +
                "Every component needs to be flexible enough to cover real-world use cases but opinionated enough to look great out of the box. " +
                "I spent the last few months on this, iterating on every detail from motion curves to color tokens. " +
                "The result is something I'm genuinely proud of. If you're building with @nextjs and @tailwindcss, give it a try. #webdev #opensource #react"
              }
              timestamp={new Date('2025-03-20T09:15:00')}
              likes={3400}
              retweets={890}
              replies={215}
              views={128000}
            />
          </div>
        </DemoCard>
      </DocsSection>

      {/* ── Platform Variants ─────────────────────────────────────────── */}
      <DocsSection title="Platform variants">
        <DemoCard className="min-h-[200px]">
          <div className="flex w-full max-w-2xl flex-col gap-4 sm:flex-row">
            <div className="flex-1">
              <TwitterCard
                name="Abdelrahman"
                handle="bahrawy"
                platform="x"
                content="This card shows the X logo in the corner."
                timestamp={new Date('2025-06-01T12:00:00')}
              />
            </div>
            <div className="flex-1">
              <TwitterCard
                name="Abdelrahman"
                handle="bahrawy"
                platform="twitter"
                content="This card shows the classic Twitter bird logo."
                timestamp={new Date('2023-03-01T12:00:00')}
              />
            </div>
          </div>
        </DemoCard>
      </DocsSection>

      {/* ── Grid ──────────────────────────────────────────────────────── */}
      <DocsSection title="Grid">
        <DemoCard className="min-h-[400px]">
          <div className="grid w-full max-w-3xl gap-4 sm:grid-cols-2">
            <TwitterCard
              name="Sarah Chen"
              handle="sarahcodes"
              verified="blue"
              content="Just deployed our new landing page with @nextjs 15 and it's blazing fast. Server components are a game changer for performance. #webdev"
              likes={542}
              retweets={78}
              replies={23}
              views={8900}
            />
            <TwitterCard
              name="Design Systems"
              handle="designsystems"
              verified="gold"
              content="Consistency is not about making everything look the same. It's about making everything feel intentional."
              likes={2100}
              retweets={445}
              replies={67}
              views={34000}
            />
            <TwitterCard
              name="Alex Rivera"
              handle="alexdev"
              content="Hot take: dark mode isn't just a preference, it's a lifestyle. My code editor, my terminal, my browser, even my toaster is in dark mode."
              likes={890}
              retweets={112}
              replies={156}
              views={15600}
            />
            <TwitterCard
              name="Tech Updates"
              handle="techupdates"
              verified="gray"
              content="TypeScript 6.0 announced with full pattern matching support. The future of type-safe JavaScript is here. #typescript #programming"
              image="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&h=300&fit=crop"
              likes={4500}
              retweets={1200}
              replies={340}
              views={89000}
            />
          </div>
        </DemoCard>
      </DocsSection>

      {/* ── Props ─────────────────────────────────────────────────────── */}
      <DocsSection title="Props">
        <PropsTable
          props={[
            { name: 'name', type: 'string', description: 'Display name of the tweet author.' },
            { name: 'handle', type: 'string', description: 'Username handle (without the @ symbol).' },
            { name: 'avatar', type: 'string', description: 'Avatar image URL. Falls back to a colored circle with the first letter of name.' },
            { name: 'verified', type: "'blue' | 'gold' | 'gray' | false", default: 'false', description: 'Verified badge variant. Blue for individuals, gold for organizations, gray for government.' },
            { name: 'content', type: 'string', description: 'Tweet body text. @mentions, #hashtags, and URLs are auto-highlighted.' },
            { name: 'image', type: 'string', description: 'Optional image attachment URL.' },
            { name: 'timestamp', type: 'string | Date', description: 'Tweet timestamp. Formatted as readable date like "3:42 PM · Jan 15, 2025".' },
            { name: 'platform', type: "'twitter' | 'x'", default: "'x'", description: 'Platform branding. Changes the logo icon in the top-right corner.' },
            { name: 'likes', type: 'number', description: 'Number of likes. Auto-formatted (e.g. 1200 → 1.2K).' },
            { name: 'retweets', type: 'number', description: 'Number of retweets. Auto-formatted.' },
            { name: 'replies', type: 'number', description: 'Number of replies. Auto-formatted.' },
            { name: 'views', type: 'number', description: 'Number of views. Auto-formatted.' },
            { name: 'href', type: 'string', description: 'If provided, the card becomes a link that opens in a new tab.' },
            { name: 'showMore', type: 'boolean', description: 'Force show/hide the "Show more" toggle. Defaults to true if content exceeds 280 characters.' },
            { name: 'className', type: 'string', description: 'Additional CSS classes for the card container.' },
          ]}
        />
      </DocsSection>

      {/* ── Dependencies ──────────────────────────────────────────────── */}
      <DocsSection title="Dependencies">
        <div className="flex flex-wrap gap-2">
          {['framer-motion', 'lucide-react'].map((dep) => (
            <code
              key={dep}
              className="rounded-md bg-white/[0.06] px-2.5 py-1 font-mono text-xs text-white/60"
            >
              {dep}
            </code>
          ))}
        </div>
      </DocsSection>
    </DocsPage>
  )
}
