'use client'

import { AvatarStatus } from '@/components/bahrawy/avatar-status'
import { CodeBlock } from '@/components/showcase/code-block'
import { DocsPage, DocsSection, DemoCard } from '@/components/showcase/docs-page'

const SNIPPET = `import { AvatarStatus } from '@/components/bahrawy/avatar-status'

<AvatarStatus
  src="https://github.com/leerob.png"
  name="Lee Robinson"
  role="VP of Product, Vercel"
  status="online"
  size="lg"
  showName
/>`

export default function AvatarStatusDocs() {
  return (
    <DocsPage
      title="Avatar with Status"
      slug="avatar-status"
      description="The single primitive every chat, collab, or directory UI uses. Image avatar with a graceful initials fallback (initials are derived from the name; the gradient bg is hashed from the name so the same person always gets the same color across your app). Status dot in the corner with a ring matching the background for the 'punched out' look. Online state pulses subtly. Sizes sm/md/lg/xl."
      category="25 · ui"
    >
      <DocsSection title="All states + sizes">
        <DemoCard className="min-h-[260px]">
          <div className="flex flex-col items-center gap-8">
            <div className="flex items-end gap-6">
              <AvatarStatus name="Hayden Bleasel" status="online" size="sm" />
              <AvatarStatus name="Lee Robinson" status="away" size="md" />
              <AvatarStatus name="Abdelrahman Bahrawy" status="busy" size="lg" />
              <AvatarStatus name="shadcn" status="offline" size="xl" />
            </div>
            <p className="text-[10px] uppercase tracking-[0.22em] text-white/40">
              online · away · busy · offline
            </p>
          </div>
        </DemoCard>
      </DocsSection>

      <DocsSection title="With names + roles (chat-list style)">
        <DemoCard className="min-h-[320px] items-start py-8">
          <div className="flex w-full max-w-md flex-col gap-3">
            {[
              { name: 'Hayden Bleasel',     role: 'CEO · Eververse',          status: 'online' as const,  src: 'https://github.com/haydenbleasel.png' },
              { name: 'Lee Robinson',       role: 'VP Product · Vercel',      status: 'online' as const,  src: 'https://github.com/leerob.png' },
              { name: 'shadcn',             role: 'Building UI primitives',   status: 'away' as const,    src: 'https://github.com/shadcn.png' },
              { name: 'Pieter Levels',      role: 'Solo founder',             status: 'busy' as const,    src: 'https://github.com/levelsio.png' },
              { name: 'Abdelrahman Bahrawy',role: 'Building bahrawy.me',      status: 'offline' as const },
            ].map((p) => (
              <div key={p.name} className="rounded-xl border border-white/10 bg-white/[0.02] p-3">
                <AvatarStatus
                  src={p.src}
                  name={p.name}
                  role={p.role}
                  status={p.status}
                  size="md"
                  showName
                />
              </div>
            ))}
          </div>
        </DemoCard>
      </DocsSection>

      <DocsSection title="Initials fallback (deterministic colors)">
        <DemoCard className="min-h-[180px]">
          <div className="flex flex-wrap items-center justify-center gap-4">
            {['Alex Kim', 'Beatrice Chen', 'Carlos Reyes', 'Diana Ng', 'Ezra Khan', 'Farah Saleh', 'George Park', 'Hana Yamada'].map(
              (n) => (
                <AvatarStatus key={n} name={n} size="lg" />
              ),
            )}
          </div>
        </DemoCard>
      </DocsSection>

      <DocsSection title="Usage">
        <CodeBlock code={SNIPPET} language="tsx" />
      </DocsSection>

      <DocsSection title="Props">
        <ul className="grid gap-2 sm:grid-cols-2">
          {[
            ['src', 'Image URL. Initials fallback if omitted or load fails.'],
            ['name', 'Display name — drives initials + the hashed fallback color.'],
            ['role', 'Optional subtitle next to the name.'],
            ['status', '"online" | "away" | "busy" | "offline" | "none". Default "none".'],
            ['size', '"sm" (28) | "md" (36) | "lg" (48) | "xl" (64).'],
            ['showName', 'Render the name + role to the right. Default false.'],
            ['ringColor', 'Background of the status-dot ring — set to your page bg. Default #08070d.'],
            ['outerRing', 'Subtle outer ring around the avatar. Default false.'],
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
        <div className="flex flex-wrap gap-2">
          {['framer-motion'].map((d) => (
            <code key={d} className="rounded-md border border-white/10 bg-white/[0.04] px-2 py-1 font-mono text-xs text-white/80">
              {d}
            </code>
          ))}
        </div>
      </DocsSection>
    </DocsPage>
  )
}
