'use client'

import * as React from 'react'
import { Building2, Calendar, Link as LinkIcon, MapPin } from 'lucide-react'
import { ProfileCard } from '@/components/bahrawy/profile-card'
import { CodeBlock } from '@/components/showcase/code-block'
import { DocsPage, DocsSection, DemoCard } from '@/components/showcase/docs-page'

const SNIPPET = `import { ProfileCard } from '@/components/bahrawy/profile-card'

<ProfileCard
  avatarSrc="https://github.com/leerob.png"
  name="Lee Robinson"
  handle="@leerob"
  role="VP of Product · Vercel"
  bio="Building the web. Triathlete, runner, coffee enthusiast."
  status="online"
  meta={[
    { icon: <MapPin />, value: 'Des Moines, IA' },
    { icon: <LinkIcon />, value: 'leerob.com' },
  ]}
  stats={[
    { label: 'Followers', value: '120k' },
    { label: 'Following', value: 412 },
    { label: 'Stars',     value: '9.2k' },
  ]}
  primaryAction={{ label: 'Follow' }}
  secondaryAction={{ label: 'Message' }}
/>`

export default function ProfileCardDocs() {
  const [followed1, setFollowed1] = React.useState(false)
  const [followed2, setFollowed2] = React.useState(true)

  return (
    <DocsPage
      title="Profile Card"
      slug="profile-card"
      description="The hover-or-click preview every social or collab UI shows when you tap an avatar — GitHub-style. Gradient header strip → avatar overlapping the seam → name + handle + role → bio → meta rows → stats → primary action + secondary action. Status dot on the avatar uses the same online/away/busy/offline logic as <AvatarStatus />."
      category="24 · card"
    >
      <DocsSection title="Full card with stats">
        <DemoCard className="min-h-[520px]">
          <ProfileCard
            avatarSrc="https://github.com/leerob.png"
            name="Lee Robinson"
            handle="@leerob"
            role="VP of Product · Vercel"
            bio="Building the web. Triathlete, runner, coffee enthusiast."
            status="online"
            meta={[
              { icon: <MapPin />, value: 'Des Moines, IA' },
              { icon: <LinkIcon />, value: 'leerob.com' },
              { icon: <Calendar />, value: 'Joined April 2014' },
            ]}
            stats={[
              { label: 'Followers', value: '120k' },
              { label: 'Following', value: 412 },
              { label: 'Stars', value: '9.2k' },
            ]}
            primaryAction={{
              label: followed1 ? 'Following' : 'Follow',
              followed: followed1,
              onClick: () => setFollowed1((v) => !v),
            }}
            secondaryAction={{ label: 'Message' }}
          />
        </DemoCard>
      </DocsSection>

      <DocsSection title="Already followed (with custom gradient)">
        <DemoCard className="min-h-[480px]">
          <ProfileCard
            avatarSrc="https://github.com/shadcn.png"
            name="shadcn"
            handle="@shadcn"
            role="Building UI primitives"
            bio="Designer turned engineer. Maintains shadcn/ui."
            status="away"
            headerGradient={['#22D3EE', '#7C3AED']}
            meta={[
              { icon: <Building2 />, value: 'Vercel' },
              { icon: <LinkIcon />, value: 'ui.shadcn.com' },
            ]}
            stats={[
              { label: 'Followers', value: '85k' },
              { label: 'Stars', value: '78k' },
            ]}
            primaryAction={{
              label: followed2 ? 'Following' : 'Follow',
              followed: followed2,
              onClick: () => setFollowed2((v) => !v),
            }}
            secondaryAction={{ label: 'View profile' }}
          />
        </DemoCard>
      </DocsSection>

      <DocsSection title="Minimal — initials fallback, no stats">
        <DemoCard className="min-h-[360px]">
          <ProfileCard
            name="Abdelrahman Bahrawy"
            handle="@bahrawy"
            role="Building bahrawy-picks.vercel.app"
            bio="Component library + interactive playground."
            status="busy"
            primaryAction={{ label: 'Follow' }}
          />
        </DemoCard>
      </DocsSection>

      <DocsSection title="Usage">
        <CodeBlock code={SNIPPET} language="tsx" />
      </DocsSection>

      <DocsSection title="Props">
        <ul className="grid gap-2 sm:grid-cols-2">
          {[
            ['avatarSrc', 'Avatar image URL. Initials fallback if omitted/failed.'],
            ['name', 'Display name.'],
            ['handle / role', 'Optional sub-headers.'],
            ['bio', 'Optional bio paragraph.'],
            ['meta', 'Array of { icon?, value } rows (location, link, joined, etc).'],
            ['stats', 'Stats grid — { label, value } pairs shown above the actions.'],
            ['status', 'Avatar status dot (online/away/busy/offline/none).'],
            ['headerGradient', 'Override header strip — [from, to] hex stops.'],
            ['primaryAction', '{ label, onClick?, followed? } — toggles to a Followed style when followed:true.'],
            ['secondaryAction', '{ label, onClick? }.'],
            ['width', 'Card width in px. Default 320.'],
          ].map(([n, b]) => (
            <li key={n} className="rounded-lg border border-white/10 bg-white/[0.02] p-3">
              <code className="font-mono text-xs text-white">{n}</code>
              <p className="mt-1 text-xs text-white/60">{b}</p>
            </li>
          ))}
        </ul>
      </DocsSection>

      <DocsSection title="Dependencies">
        <div className="flex flex-wrap gap-2">
          {['framer-motion', 'lucide-react'].map((d) => (
            <code key={d} className="rounded-md border border-white/10 bg-white/[0.04] px-2 py-1 font-mono text-xs text-white/80">
              {d}
            </code>
          ))}
        </div>
      </DocsSection>
    </DocsPage>
  )
}
