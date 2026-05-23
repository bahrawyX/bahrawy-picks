'use client'

import * as React from 'react'
import {
  NotificationStack,
  type Notification,
} from '@/components/bahrawy/notification-stack'
import {
  AlertTriangle,
  GitPullRequest,
  Heart,
  MessageSquare,
  Star,
  Zap,
} from 'lucide-react'
import { CodeBlock } from '@/components/showcase/code-block'
import { DocsPage, DocsSection, DemoCard } from '@/components/showcase/docs-page'

const ICONS = {
  pr: <GitPullRequest className="h-4 w-4" strokeWidth={2.5} />,
  star: <Star className="h-4 w-4" strokeWidth={2.5} />,
  heart: <Heart className="h-4 w-4" strokeWidth={2.5} />,
  msg: <MessageSquare className="h-4 w-4" strokeWidth={2.5} />,
  alert: <AlertTriangle className="h-4 w-4" strokeWidth={2.5} />,
  zap: <Zap className="h-4 w-4" strokeWidth={2.5} />,
}

const INITIAL: Notification[] = [
  {
    id: 'n1',
    icon: ICONS.pr,
    accent: '#A78BFA',
    title: '@leerob opened a pull request',
    description: 'feat: add LiveCursor + chat bubble primitive',
    timestamp: 'just now',
    unread: true,
  },
  {
    id: 'n2',
    icon: ICONS.star,
    accent: '#FBBF24',
    title: '@haydenbleasel starred bahrawy-picks',
    description: '136 stars · 24 forks',
    timestamp: '2m ago',
    unread: true,
  },
  {
    id: 'n3',
    icon: ICONS.msg,
    accent: '#22D3EE',
    title: '@shadcn commented on #142',
    description: '“Love the spring on the toggle. Maybe drop the damping a hair?”',
    timestamp: '7m ago',
  },
  {
    id: 'n4',
    icon: ICONS.heart,
    accent: '#F472B6',
    title: 'Live Cursors hit 1k downloads',
    description: '+312 this week — your fastest-growing component',
    timestamp: '32m ago',
  },
  {
    id: 'n5',
    icon: ICONS.zap,
    accent: '#34D399',
    title: 'Deploy succeeded — main',
    description: 'a7f3c2b · build · 47s',
    timestamp: '1h ago',
  },
  {
    id: 'n6',
    icon: ICONS.alert,
    accent: '#FB7185',
    title: 'Lighthouse score dropped 4 points',
    description: 'CLS regressed on /components/[slug]',
    timestamp: '2h ago',
  },
]

const SNIPPET = `import { NotificationStack } from '@/components/bahrawy/notification-stack'

<NotificationStack
  peek={2}
  notifications={[
    {
      id: 'n1',
      icon: <GitPullRequest className="h-4 w-4" />,
      accent: '#A78BFA',
      title: '@leerob opened a pull request',
      description: 'feat: add LiveCursor primitive',
      timestamp: 'just now',
      unread: true,
    },
    // …
  ]}
  onDismiss={(id) => console.log('dismiss', id)}
/>`

export default function NotificationStackDocs() {
  // Reset the list periodically if the demo runs empty so the user can
  // see the dismiss interaction over and over.
  const [items, setItems] = React.useState(INITIAL)
  React.useEffect(() => {
    if (items.length > 0) return
    const t = setTimeout(() => setItems(INITIAL), 1400)
    return () => clearTimeout(t)
  }, [items])

  return (
    <DocsPage
      title="Notification Stack"
      slug="notification-stack"
      description="iOS-style stacked notification cards. Only the top one is fully visible by default — the next 1–2 peek out behind it at slightly smaller scale. Hover (or focus) and the whole stack fans out into a list with spring physics; leave and they re-stack. Click the X on any card to dismiss it with a slide-out animation."
      category="54 · data"
    >
      <DocsSection title="Live (hover to fan, click ✕ to dismiss)">
        <DemoCard className="min-h-[560px] items-start py-10">
          <NotificationStack
            notifications={items}
            peek={2}
            onDismiss={(id) => setItems((prev) => prev.filter((n) => n.id !== id))}
            onClearAll={() => setItems([])}
          />
        </DemoCard>
      </DocsSection>

      <DocsSection title="Usage">
        <CodeBlock code={SNIPPET} language="tsx" />
      </DocsSection>

      <DocsSection title="Props">
        <ul className="grid gap-2 sm:grid-cols-2">
          {[
            ['notifications', 'Notification[] — { id, title, description?, timestamp?, icon?, accent?, unread? }.'],
            ['peek', 'How many cards peek behind the top one when collapsed. Default 2.'],
            ['onDismiss', '(id) => void — fires when an individual ✕ is clicked.'],
            ['onClearAll', '() => void — fires when "Clear all" is clicked (appears when expanded).'],
            ['accent', 'Fallback accent for cards without their own. Default violet.'],
            ['className', 'Extra classes on the outer wrapper.'],
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
