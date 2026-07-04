'use client'

/**
 * <Deploy />
 *
 * A Vercel-style deployment card. Status drives the whole visual:
 *
 *   queued     — gray dot, idle
 *   building   — amber dot + a shimmering scanline across the top
 *                edge; if `liveElapsed` is true, the duration ticks
 *                up every second
 *   ready      — emerald dot + a soft pulse on appearance
 *   failed     — rose dot + a brief shake on appearance
 *   cancelled  — muted, no animation
 *
 * Inside: branch chip, commit message (truncated), short SHA, author
 * avatar (or initials fallback), environment chip, duration.
 */

import * as React from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Check, GitBranch, GitCommit, Loader, X, ArrowUpRight } from 'lucide-react'
import { cn } from '@/lib/utils'

export type DeployStatus = 'queued' | 'building' | 'ready' | 'failed' | 'cancelled'
export type DeployEnvironment = 'production' | 'preview' | 'development'

export interface DeployProps {
  status: DeployStatus
  branch: string
  commit: {
    sha: string
    message: string
    author?: { name: string; avatarUrl?: string }
  }
  environment?: DeployEnvironment
  /** Duration in seconds. For 'building' with liveElapsed=true, the start of the build. */
  duration?: number
  /** When status is 'building', tick the duration up every second. */
  liveElapsed?: boolean
  /** Optional "Visit" link href shown for `ready` deployments. */
  href?: string
  className?: string
}

const STATUS_META: Record<
  DeployStatus,
  { label: string; color: string; dot: string; ring: string; Icon: React.ElementType | null }
> = {
  queued: {
    label: 'Queued',
    color: 'text-white/65',
    dot: 'bg-white/40',
    ring: 'ring-white/15',
    Icon: null,
  },
  building: {
    label: 'Building',
    color: 'text-amber-300',
    dot: 'bg-amber-400',
    ring: 'ring-amber-400/30',
    Icon: Loader,
  },
  ready: {
    label: 'Ready',
    color: 'text-emerald-300',
    dot: 'bg-emerald-400',
    ring: 'ring-emerald-400/30',
    Icon: Check,
  },
  failed: {
    label: 'Failed',
    color: 'text-rose-300',
    dot: 'bg-rose-400',
    ring: 'ring-rose-400/30',
    Icon: X,
  },
  cancelled: {
    label: 'Cancelled',
    color: 'text-white/45',
    dot: 'bg-white/30',
    ring: 'ring-white/10',
    Icon: X,
  },
}

const ENV_COLOR: Record<DeployEnvironment, string> = {
  production: 'text-emerald-300 border-emerald-400/30 bg-emerald-400/10',
  preview: 'text-violet-300 border-violet-400/30 bg-violet-400/10',
  development: 'text-sky-300 border-sky-400/30 bg-sky-400/10',
}

export function Deploy({
  status,
  branch,
  commit,
  environment = 'preview',
  duration,
  liveElapsed = false,
  href,
  className,
}: DeployProps) {
  const meta = STATUS_META[status]
  const [elapsed, setElapsed] = React.useState(duration ?? 0)

  // Live tick when building. Anchored to a start timestamp (rather than
  // incrementing a counter) so the readout self-corrects instead of
  // drifting — even when a throttled background tab delays the interval.
  React.useEffect(() => {
    if (!liveElapsed || status !== 'building') {
      setElapsed(duration ?? 0)
      return
    }
    const start = Date.now() - (duration ?? 0) * 1000
    const tick = () => setElapsed(Math.floor((Date.now() - start) / 1000))
    tick()
    const t = setInterval(tick, 1000)
    return () => clearInterval(t)
  }, [liveElapsed, status, duration])

  const sha = commit.sha.slice(0, 7)

  return (
    <motion.div
      // Failed status — give the whole card a brief shake.
      animate={status === 'failed' ? { x: [0, -3, 3, -2, 2, 0] } : { x: 0 }}
      transition={{ duration: 0.4 }}
      className={cn(
        'relative w-full overflow-hidden rounded-xl border border-white/[0.08] bg-white/[0.02]',
        className,
      )}
    >
      {/* Top scanline shimmer (only when building) */}
      <AnimatePresence>
        {status === 'building' && (
          <motion.div
            key="shimmer"
            aria-hidden
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="pointer-events-none absolute inset-x-0 top-0 h-px overflow-hidden"
          >
            <motion.span
              className="absolute top-0 h-px w-1/3 bg-gradient-to-r from-transparent via-amber-300 to-transparent"
              animate={{ x: ['-100%', '400%'] }}
              transition={{ duration: 1.6, ease: 'linear', repeat: Infinity }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center gap-3 px-4 py-3.5">
        {/* Status dot */}
        <StatusIndicator status={status} />

        <div className="min-w-0 flex-1">
          {/* Top row: status label + env chip + duration */}
          <div className="flex items-center gap-2">
            <span className={cn('text-[12px] font-semibold tracking-tight', meta.color)}>
              {meta.label}
            </span>
            <span
              className={cn(
                'inline-flex shrink-0 items-center rounded-md border px-1.5 py-0.5 text-[9.5px] font-medium uppercase tracking-wider',
                ENV_COLOR[environment],
              )}
            >
              {environment}
            </span>
            {(elapsed > 0 || status === 'building') && (
              <span className="font-mono text-[10.5px] tabular-nums text-white/40">
                {formatElapsed(elapsed)}
              </span>
            )}
          </div>

          {/* Commit message — truncated */}
          <p className="mt-1 truncate text-[12.5px] leading-tight text-white/85">
            {commit.message}
          </p>

          {/* Branch + SHA + author */}
          <div className="mt-1.5 flex items-center gap-2 text-[11px] text-white/45">
            <span className="inline-flex items-center gap-1">
              <GitBranch className="h-3 w-3" strokeWidth={2} />
              <span className="font-mono text-white/65">{branch}</span>
            </span>
            <span className="text-white/20">·</span>
            <span className="inline-flex items-center gap-1 font-mono">
              <GitCommit className="h-3 w-3" strokeWidth={2} />
              {sha}
            </span>
            {commit.author && (
              <>
                <span className="text-white/20">·</span>
                <span className="inline-flex items-center gap-1.5">
                  <Avatar
                    name={commit.author.name}
                    avatarUrl={commit.author.avatarUrl}
                  />
                  <span className="text-white/55">{commit.author.name}</span>
                </span>
              </>
            )}
          </div>
        </div>

        {/* Right-side Visit link, only for Ready */}
        {status === 'ready' && href && (
          <a
            href={href}
            target="_blank"
            rel="noreferrer noopener"
            className="group inline-flex shrink-0 items-center gap-1 rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[11px] font-medium text-white/85 transition-colors hover:border-white/25 hover:bg-white/[0.08]"
          >
            Visit
            <ArrowUpRight className="h-3 w-3 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </a>
        )}
      </div>
    </motion.div>
  )
}

// ---------------------------------------------------------------------------

function StatusIndicator({ status }: { status: DeployStatus }) {
  const meta = STATUS_META[status]
  const Icon = meta.Icon
  return (
    <span
      aria-hidden
      className={cn(
        'relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/[0.04] ring-1',
        meta.ring,
      )}
    >
      {status === 'ready' && (
        <motion.span
          aria-hidden
          className={cn('absolute inset-0 rounded-full', meta.dot)}
          initial={{ opacity: 0.5, scale: 1 }}
          animate={{ opacity: 0, scale: 1.6 }}
          transition={{ duration: 0.9, ease: 'easeOut' }}
        />
      )}
      {Icon ? (
        <Icon
          className={cn('relative h-4 w-4', meta.color, status === 'building' && 'animate-spin')}
          strokeWidth={2.5}
        />
      ) : (
        <span
          aria-hidden
          className={cn('relative block h-2 w-2 rounded-full', meta.dot)}
        />
      )}
    </span>
  )
}

function Avatar({ name, avatarUrl }: { name: string; avatarUrl?: string }) {
  if (avatarUrl) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={avatarUrl} alt={name} className="h-4 w-4 rounded-full" />
  }
  const initials = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join('')
  return (
    <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-gradient-to-br from-violet-400/45 to-rose-400/45 text-[8px] font-semibold text-white/95">
      {initials}
    </span>
  )
}

function formatElapsed(seconds: number): string {
  if (seconds < 60) return `${seconds}s`
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}m ${s.toString().padStart(2, '0')}s`
}
