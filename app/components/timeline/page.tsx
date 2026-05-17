'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import {
  Check,
  GitBranch,
  GitCommit,
  GitPullRequest,
  MessageSquare,
  Package,
  Rocket,
  Shield,
  Star,
  Zap,
  Bug,
  AlertTriangle,
  ArrowRight,
  Play,
  Pause,
} from 'lucide-react'
import {
  Timeline,
  type TimelineEventData,
  type TimelineVariant,
} from '@/components/bahrawy'
import { Button } from '@/components/ui/button'
import { CodeBlock } from '@/components/showcase/code-block'
import {
  ControlLabel,
  ControlsRow,
  DemoCard,
  DocsPage,
  DocsSection,
} from '@/components/showcase/docs-page'
import { PropsTable } from '@/components/showcase/props-table'

// ---------------------------------------------------------------------------
// Mock data
// ---------------------------------------------------------------------------

const now = Date.now()
const h = (hours: number) => new Date(now - hours * 3600_000).toISOString()
const d = (days: number) => new Date(now - days * 86400_000).toISOString()

const DEFAULT_EVENTS: TimelineEventData[] = [
  {
    id: '1',
    title: 'Project initialized',
    description: 'Created repository and set up Next.js 15 with TypeScript, Tailwind, and Framer Motion.',
    timestamp: d(14),
    status: 'completed',
    icon: <Rocket className="h-3 w-3 text-white" />,
    iconBackground: 'bg-violet-500',
    badge: 'Init',
    badgeVariant: 'secondary',
  },
  {
    id: '2',
    title: 'Core component library',
    description: 'Built 8 foundational components: Button, Input, Badge, Avatar, Card, Dialog, Popover, Command.',
    timestamp: d(10),
    status: 'completed',
    icon: <Package className="h-3 w-3 text-white" />,
    iconBackground: 'bg-blue-500',
    expandable: true,
    metadata: {
      Components: '8',
      'Test coverage': '94%',
      'Bundle size': '12.4 kB',
      Framework: 'React 19',
    },
  },
  {
    id: '3',
    title: 'Animation system',
    description: 'Implemented shared motion variants, spring configs, and scroll-driven animations.',
    timestamp: d(7),
    status: 'completed',
    icon: <Zap className="h-3 w-3 text-white" />,
    iconBackground: 'bg-amber-500',
  },
  {
    id: '4',
    title: 'Security audit flagged',
    description: 'Dependabot found 2 high-severity vulnerabilities in transitive dependencies.',
    timestamp: d(5),
    status: 'error',
    icon: <Shield className="h-3 w-3 text-white" />,
    badge: 'Critical',
    badgeVariant: 'destructive',
  },
  {
    id: '5',
    title: 'Performance regression',
    description: 'Lighthouse score dropped from 98 to 82 after adding heavy animations. Needs optimization.',
    timestamp: d(3),
    status: 'warning',
    icon: <AlertTriangle className="h-3 w-3 text-white" />,
    badge: 'Perf',
    badgeVariant: 'outline',
  },
  {
    id: '6',
    title: 'Timeline component',
    description: 'Building the most visually impressive component in the library — 4 variants, scroll-driven animation, live feeds.',
    timestamp: h(2),
    status: 'current',
    icon: <Star className="h-3 w-3" />,
    badge: 'In progress',
  },
  {
    id: '7',
    title: 'Documentation site',
    description: 'Full interactive docs with live demos, code snippets, and prop tables.',
    timestamp: h(1),
    status: 'upcoming',
  },
  {
    id: '8',
    title: 'v1.0 public release',
    description: 'Ship to npm, publish docs, announce on socials.',
    timestamp: new Date(now + 7 * 86400_000).toISOString(),
    status: 'upcoming',
    icon: <Rocket className="h-3 w-3" />,
    badge: 'Milestone',
    badgeVariant: 'outline',
  },
]

const ROADMAP_EVENTS: TimelineEventData[] = [
  { id: 'r1', title: 'Alpha', description: 'Internal testing', timestamp: d(30), status: 'completed', color: 'bg-emerald-500' },
  { id: 'r2', title: 'Beta', description: 'Public beta testing', timestamp: d(20), status: 'completed', color: 'bg-emerald-500' },
  { id: 'r3', title: 'RC 1', description: 'Release candidate', timestamp: d(10), status: 'current', color: 'bg-white' },
  { id: 'r4', title: 'RC 2', description: 'Bug fixes', timestamp: d(5), status: 'upcoming' },
  { id: 'r5', title: 'v1.0', description: 'Stable release', timestamp: d(0), status: 'upcoming' },
  { id: 'r6', title: 'v1.1', description: 'New components', timestamp: new Date(now + 14 * 86400_000).toISOString(), status: 'upcoming' },
]

const ACTIVITY_EVENTS: TimelineEventData[] = [
  {
    id: 'a1',
    title: 'Merged pull request #142',
    description: 'feat: add Timeline component with 4 variants',
    timestamp: h(0.5),
    status: 'completed',
    icon: <GitPullRequest className="h-3.5 w-3.5 text-violet-400" />,
    avatar: { fallback: 'AE' },
    badge: 'Merged',
  },
  {
    id: 'a2',
    title: 'Fixed bug in DataTable pagination',
    description: 'Expanded rows now render below their parent row instead of at the bottom.',
    timestamp: h(1),
    status: 'completed',
    icon: <Bug className="h-3.5 w-3.5 text-red-400" />,
    avatar: { fallback: 'BX' },
  },
  {
    id: 'a3',
    title: 'Pushed 3 commits to main',
    timestamp: h(2),
    status: 'completed',
    icon: <GitCommit className="h-3.5 w-3.5 text-blue-400" />,
    avatar: { fallback: 'AE' },
  },
  {
    id: 'a4',
    title: 'Created branch feature/autocomplete',
    timestamp: h(4),
    status: 'completed',
    icon: <GitBranch className="h-3.5 w-3.5 text-emerald-400" />,
    avatar: { fallback: 'BX' },
  },
  {
    id: 'a5',
    title: 'Commented on issue #98',
    description: 'We should add keyboard shortcuts for the command palette.',
    timestamp: d(1),
    status: 'completed',
    icon: <MessageSquare className="h-3.5 w-3.5 text-amber-400" />,
    avatar: { fallback: 'AE' },
  },
  {
    id: 'a6',
    title: 'Reviewed pull request #139',
    timestamp: d(1),
    status: 'completed',
    icon: <Check className="h-3.5 w-3.5 text-emerald-400" />,
    avatar: { fallback: 'BX' },
    badge: 'Approved',
  },
  {
    id: 'a7',
    title: 'Released v0.9.0',
    description: '12 components, dark theme, full docs.',
    timestamp: d(2),
    status: 'completed',
    icon: <Package className="h-3.5 w-3.5 text-violet-400" />,
    avatar: { fallback: 'BX' },
    badge: 'Release',
  },
  {
    id: 'a8',
    title: 'Deployed to production',
    timestamp: d(2),
    status: 'completed',
    icon: <Rocket className="h-3.5 w-3.5 text-sky-400" />,
    avatar: { fallback: 'AE' },
  },
]

const LIVE_ACTIONS = [
  { title: 'Pushed commit to main', icon: <GitCommit className="h-3.5 w-3.5 text-blue-400" />, avatar: { fallback: 'AE' } },
  { title: 'Merged pull request #143', icon: <GitPullRequest className="h-3.5 w-3.5 text-violet-400" />, avatar: { fallback: 'BX' }, badge: 'Merged' },
  { title: 'Commented on issue #101', icon: <MessageSquare className="h-3.5 w-3.5 text-amber-400" />, avatar: { fallback: 'AE' } },
  { title: 'Fixed CI pipeline', icon: <Check className="h-3.5 w-3.5 text-emerald-400" />, avatar: { fallback: 'BX' } },
  { title: 'Deployed to staging', icon: <Rocket className="h-3.5 w-3.5 text-sky-400" />, avatar: { fallback: 'AE' } },
]

// ---------------------------------------------------------------------------
// Snippets
// ---------------------------------------------------------------------------

const DEFAULT_SNIPPET = `import { Timeline } from '@/components/bahrawy'

const events = [
  {
    id: '1',
    title: 'Project started',
    description: 'Initialized the repository',
    timestamp: new Date(),
    status: 'completed',
  },
  {
    id: '2',
    title: 'In progress',
    timestamp: new Date(),
    status: 'current',
  },
]

<Timeline events={events} variant="default" />`

const ALTERNATING_SNIPPET = `<Timeline
  events={events}
  variant="alternating"
  timestampFormat="both"
/>`

const CENTERED_SNIPPET = `<Timeline
  events={roadmap}
  variant="centered"
  timestampFormat="absolute"
/>`

const ACTIVITY_SNIPPET = `<Timeline
  events={activity}
  variant="activity"
  groupByDate
  maxVisible={5}
/>`

const LIVE_SNIPPET = `<Timeline
  events={liveEvents}
  variant="activity"
  live
  groupByDate
/>`

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function TimelineDocs() {
  const [variant, setVariant] = useState<TimelineVariant>('default')
  const [timestampFormat, setTimestampFormat] = useState<'relative' | 'absolute' | 'both'>('relative')

  // Live feed state
  const [liveEvents, setLiveEvents] = useState<TimelineEventData[]>(ACTIVITY_EVENTS.slice(0, 3))
  const [isPlaying, setIsPlaying] = useState(false)
  const counterRef = useRef(0)

  useEffect(() => {
    if (!isPlaying) return
    const interval = setInterval(() => {
      const action = LIVE_ACTIONS[counterRef.current % LIVE_ACTIONS.length]
      counterRef.current += 1
      const newEvent: TimelineEventData = {
        id: `live-${Date.now()}`,
        title: action.title,
        timestamp: new Date().toISOString(),
        status: 'completed',
        icon: action.icon,
        avatar: action.avatar,
        badge: action.badge,
      }
      setLiveEvents((prev) => [newEvent, ...prev])
    }, 2000)
    return () => clearInterval(interval)
  }, [isPlaying])

  const handleEventClick = useCallback((event: TimelineEventData) => {
    console.log('Clicked event:', event.id, event.title)
  }, [])

  return (
    <DocsPage
      category="07 · data"
      title="Timeline"
      slug="timeline"
      description="Four variants: vertical, alternating, horizontal, and activity feed. Scroll-driven connector line, animated status dots, expandable events, and live feed support."
    >
      {/* ---- Default vertical ---- */}
      <DocsSection title="Default vertical">
        <DemoCard className="p-6">
          <div className="mx-auto w-full max-w-lg">
            <Timeline
              events={DEFAULT_EVENTS}
              variant="default"
              timestampFormat={timestampFormat}
              onEventClick={handleEventClick}
            />
          </div>
        </DemoCard>

        <ControlsRow>
          <ControlLabel>Timestamps</ControlLabel>
          {(['relative', 'absolute', 'both'] as const).map((f) => (
            <Button
              key={f}
              size="sm"
              variant={timestampFormat === f ? 'default' : 'outline'}
              onClick={() => setTimestampFormat(f)}
            >
              {f}
            </Button>
          ))}
        </ControlsRow>

        <CodeBlock code={DEFAULT_SNIPPET} language="tsx" />
      </DocsSection>

      {/* ---- Alternating ---- */}
      <DocsSection title="Alternating">
        <DemoCard className="p-6">
          <div className="mx-auto w-full max-w-2xl">
            <Timeline
              events={DEFAULT_EVENTS}
              variant="alternating"
              timestampFormat="both"
              onEventClick={handleEventClick}
            />
          </div>
        </DemoCard>
        <CodeBlock code={ALTERNATING_SNIPPET} language="tsx" />
      </DocsSection>

      {/* ---- Centered horizontal ---- */}
      <DocsSection title="Centered horizontal">
        <DemoCard className="p-6 overflow-hidden">
          <Timeline
            events={ROADMAP_EVENTS}
            variant="centered"
            timestampFormat="absolute"
            onEventClick={handleEventClick}
          />
        </DemoCard>
        <CodeBlock code={CENTERED_SNIPPET} language="tsx" />
      </DocsSection>

      {/* ---- Activity feed ---- */}
      <DocsSection title="Activity feed">
        <DemoCard className="p-0">
          <div className="mx-auto w-full max-w-lg py-2">
            <Timeline
              events={ACTIVITY_EVENTS}
              variant="activity"
              groupByDate
              maxVisible={5}
              onEventClick={handleEventClick}
            />
          </div>
        </DemoCard>
        <CodeBlock code={ACTIVITY_SNIPPET} language="tsx" />
      </DocsSection>

      {/* ---- Live feed ---- */}
      <DocsSection title="Live feed">
        <DemoCard className="p-0">
          <div className="mx-auto w-full max-w-lg py-2">
            <Timeline
              events={liveEvents}
              variant="activity"
              live
              groupByDate
            />
          </div>
        </DemoCard>

        <ControlsRow>
          <Button
            size="sm"
            variant={isPlaying ? 'default' : 'outline'}
            onClick={() => setIsPlaying((v) => !v)}
          >
            {isPlaying ? (
              <><Pause className="mr-1.5 h-3.5 w-3.5" /> Pause</>
            ) : (
              <><Play className="mr-1.5 h-3.5 w-3.5" /> Start live feed</>
            )}
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              setLiveEvents(ACTIVITY_EVENTS.slice(0, 3))
              counterRef.current = 0
            }}
          >
            Reset
          </Button>
        </ControlsRow>
        <CodeBlock code={LIVE_SNIPPET} language="tsx" />
      </DocsSection>

      {/* ---- Props ---- */}
      <DocsSection title="Props">
        <PropsTable
          props={[
            { name: 'events', type: 'TimelineEvent[]', description: 'Array of timeline events to display.' },
            { name: 'variant', type: "'default' | 'alternating' | 'centered' | 'activity'", default: "'default'", description: 'Visual layout variant.' },
            { name: 'live', type: 'boolean', default: 'false', description: 'Activity feed: animate new events in from the top.' },
            { name: 'groupByDate', type: 'boolean', default: 'false', description: 'Activity feed: group events by date with sticky headers.' },
            { name: 'maxVisible', type: 'number', description: 'Activity feed: show first N events, rest behind "Show more".' },
            { name: 'showTimestamps', type: 'boolean', default: 'true', description: 'Show event timestamps.' },
            { name: 'timestampFormat', type: "'relative' | 'absolute' | 'both'", default: "'relative'", description: 'Timestamp display format.' },
            { name: 'onEventClick', type: '(event: TimelineEvent) => void', description: 'Called when an event is clicked.' },
            { name: 'className', type: 'string', description: 'Additional classes for the wrapper.' },
          ]}
        />
      </DocsSection>

      {/* ---- Event type ---- */}
      <DocsSection title="TimelineEvent type">
        <PropsTable
          props={[
            { name: 'id', type: 'string', description: 'Unique identifier.' },
            { name: 'title', type: 'string', description: 'Event heading.' },
            { name: 'description', type: 'string | ReactNode', description: 'Event body text or custom content.' },
            { name: 'timestamp', type: 'Date | string', description: 'When the event occurred.' },
            { name: 'icon', type: 'ReactNode', description: 'Custom icon in the dot.' },
            { name: 'iconBackground', type: 'string', description: 'Tailwind bg class for the dot (e.g. "bg-emerald-500").' },
            { name: 'status', type: "'completed' | 'current' | 'upcoming' | 'error' | 'warning'", default: "'completed'", description: 'Determines dot style and animation.' },
            { name: 'badge', type: 'string', description: 'Text shown in a Badge next to the title.' },
            { name: 'badgeVariant', type: "'default' | 'secondary' | 'destructive' | 'outline'", description: 'Badge visual variant.' },
            { name: 'avatar', type: '{ src?: string, fallback: string }', description: 'Avatar shown in activity feed variant.' },
            { name: 'expandable', type: 'boolean', description: 'Collapse description behind "Show more" toggle.' },
            { name: 'metadata', type: 'Record<string, string>', description: 'Key-value pairs shown in expanded content.' },
            { name: 'color', type: 'string', description: 'Accent color for the dot and connector segment.' },
          ]}
        />
      </DocsSection>

      {/* ---- Dependencies ---- */}
      <DocsSection title="Dependencies">
        <div className="flex flex-wrap gap-2">
          {['framer-motion', '@radix-ui/react-avatar'].map((dep) => (
            <code
              key={dep}
              className="rounded-md border border-white/10 bg-white/[0.04] px-2 py-1 font-mono text-xs text-white/80"
            >
              {dep}
            </code>
          ))}
        </div>
      </DocsSection>
    </DocsPage>
  )
}
