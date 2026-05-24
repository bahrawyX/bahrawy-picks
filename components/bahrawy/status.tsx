'use client'

/**
 * <Status />
 *
 * Vercel/Atlassian Statuspage-style service status. A big overall
 * banner at the top — "All systems operational" / "Degraded" / etc.
 * — plus a list of services, each with their own state pill and an
 * optional 90-day uptime ribbon showing per-day status as small
 * vertical bars.
 *
 * Overall state is derived from the worst service state:
 *   outage > maintenance > degraded > operational
 */

import * as React from 'react'
import { motion } from 'framer-motion'
import { Check, AlertTriangle, XCircle, Wrench } from 'lucide-react'
import { cn } from '@/lib/utils'

export type StatusState = 'operational' | 'degraded' | 'outage' | 'maintenance'

export interface StatusService {
  name: string
  state: StatusState
  description?: string
  /** Per-day history — most-recent LAST. Length ≤ 90. */
  history?: StatusState[]
}

export interface StatusProps {
  services: StatusService[]
  /** Override the auto-derived overall state. */
  overall?: StatusState
  /** Header title. Default 'System status'. */
  title?: string
  /** Show the 90-day uptime ribbons. Default true. */
  showHistory?: boolean
  className?: string
}

const STATE_RANK: Record<StatusState, number> = {
  operational: 0,
  maintenance: 1,
  degraded: 2,
  outage: 3,
}

const STATE_META: Record<
  StatusState,
  { label: string; color: string; bg: string; ring: string; Icon: React.ElementType }
> = {
  operational: {
    label: 'Operational',
    color: 'text-emerald-300',
    bg: 'bg-emerald-400',
    ring: 'ring-emerald-400/30',
    Icon: Check,
  },
  degraded: {
    label: 'Degraded',
    color: 'text-amber-300',
    bg: 'bg-amber-400',
    ring: 'ring-amber-400/30',
    Icon: AlertTriangle,
  },
  outage: {
    label: 'Outage',
    color: 'text-rose-300',
    bg: 'bg-rose-400',
    ring: 'ring-rose-400/30',
    Icon: XCircle,
  },
  maintenance: {
    label: 'Maintenance',
    color: 'text-sky-300',
    bg: 'bg-sky-400',
    ring: 'ring-sky-400/30',
    Icon: Wrench,
  },
}

const OVERALL_HEADLINE: Record<StatusState, string> = {
  operational: 'All systems operational',
  degraded: 'Degraded performance',
  outage: 'Active incident',
  maintenance: 'Scheduled maintenance',
}

export function Status({
  services,
  overall,
  title = 'System status',
  showHistory = true,
  className,
}: StatusProps) {
  const derived: StatusState = React.useMemo(() => {
    return services.reduce<StatusState>((worst, s) => {
      return STATE_RANK[s.state] > STATE_RANK[worst] ? s.state : worst
    }, 'operational')
  }, [services])

  const state = overall ?? derived
  const meta = STATE_META[state]

  return (
    <div
      className={cn(
        'w-full overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.015]',
        className,
      )}
    >
      {/* Overall banner */}
      <header className="flex items-center gap-3 border-b border-white/[0.06] px-4 py-4">
        <span
          aria-hidden
          className={cn(
            'relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/[0.04] ring-1',
            meta.ring,
          )}
        >
          {state === 'operational' && (
            <span
              aria-hidden
              className={cn(
                'absolute inset-0 animate-ping rounded-full opacity-30',
                meta.bg,
              )}
            />
          )}
          <meta.Icon
            className={cn('relative h-4 w-4', meta.color)}
            strokeWidth={2.5}
          />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[10.5px] font-medium uppercase tracking-[0.18em] text-white/40">
            {title}
          </p>
          <p className="mt-0.5 font-display text-[14px] font-semibold tracking-tight text-white">
            {OVERALL_HEADLINE[state]}
          </p>
        </div>
        <StatePill state={state} />
      </header>

      {/* Service rows */}
      <ul className="divide-y divide-white/[0.04]">
        {services.map((svc, i) => (
          <ServiceRow
            key={svc.name}
            service={svc}
            showHistory={showHistory}
            index={i}
          />
        ))}
      </ul>
    </div>
  )
}

// ---------------------------------------------------------------------------

function ServiceRow({
  service,
  showHistory,
  index,
}: {
  service: StatusService
  showHistory: boolean
  index: number
}) {
  return (
    <li className="px-4 py-3.5 transition-colors hover:bg-white/[0.02]">
      <div className="flex items-start gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="text-[13px] font-medium tracking-tight text-white/90">
              {service.name}
            </span>
            <StatePill state={service.state} compact />
          </div>
          {service.description && (
            <p className="mt-0.5 text-[11.5px] leading-snug text-white/45">
              {service.description}
            </p>
          )}
        </div>
      </div>

      {showHistory && service.history && service.history.length > 0 && (
        <div className="mt-3">
          <div className="flex h-6 items-end gap-[2px]">
            {service.history.map((s, i) => {
              const meta = STATE_META[s]
              return (
                <motion.span
                  key={i}
                  aria-hidden
                  initial={{ scaleY: 0.3, opacity: 0 }}
                  animate={{ scaleY: 1, opacity: 1 }}
                  transition={{
                    delay: 0.005 * i + 0.04 * index,
                    duration: 0.4,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className={cn('block h-full w-[3px] origin-bottom rounded-sm', meta.bg)}
                  style={{ opacity: s === 'operational' ? 0.55 : 0.85 }}
                  title={meta.label}
                />
              )
            })}
          </div>
          <div className="mt-1.5 flex items-center justify-between text-[10px] uppercase tracking-[0.18em] text-white/30">
            <span>{service.history.length} days ago</span>
            <span>today</span>
          </div>
        </div>
      )}
    </li>
  )
}

// ---------------------------------------------------------------------------

function StatePill({
  state,
  compact = false,
}: {
  state: StatusState
  compact?: boolean
}) {
  const meta = STATE_META[state]
  return (
    <span
      className={cn(
        'inline-flex shrink-0 items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] font-medium',
        compact ? 'px-1.5 py-0.5 text-[10px]' : 'px-2.5 py-1 text-[11px]',
        meta.color,
      )}
    >
      <span aria-hidden className={cn('block h-1.5 w-1.5 rounded-full', meta.bg)} />
      {meta.label}
    </span>
  )
}
