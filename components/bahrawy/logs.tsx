'use client'

/**
 * <Logs />
 *
 * Terminal-style log stream. Each entry is a row with: a faint
 * timestamp, a colored level pill, an optional [source] tag, and the
 * message body. Optional filter chips at the top toggle which levels
 * are visible; optional auto-scroll keeps the most-recent line in
 * view as new entries arrive.
 *
 * Pass entries from any source — fetch, EventSource, websocket — and
 * they render in the order received.
 */

import * as React from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { cn } from '@/lib/utils'

export type LogLevel = 'info' | 'success' | 'warn' | 'error' | 'debug'

export interface LogEntry {
  id: string
  /** Date or pre-formatted timestamp string. */
  timestamp?: Date | string
  level: LogLevel
  message: string
  /** Optional source tag, e.g. 'api', 'auth.session'. */
  source?: string
}

export interface LogsProps {
  entries: LogEntry[]
  /** Show filter chips above the stream. Default true. */
  showFilters?: boolean
  /** Auto-scroll to the bottom when new entries appear. Default true. */
  autoScroll?: boolean
  /** Container max height. Default '380px'. */
  height?: string | number
  className?: string
}

const LEVEL_META: Record<
  LogLevel,
  { label: string; pill: string; dot: string }
> = {
  info: {
    label: 'INFO',
    pill: 'bg-sky-400/12 text-sky-300',
    dot: 'bg-sky-400',
  },
  success: {
    label: 'OK',
    pill: 'bg-emerald-400/12 text-emerald-300',
    dot: 'bg-emerald-400',
  },
  warn: {
    label: 'WARN',
    pill: 'bg-amber-400/12 text-amber-300',
    dot: 'bg-amber-400',
  },
  error: {
    label: 'ERR ',
    pill: 'bg-rose-400/12 text-rose-300',
    dot: 'bg-rose-400',
  },
  debug: {
    label: 'DBG ',
    pill: 'bg-white/[0.06] text-white/55',
    dot: 'bg-white/40',
  },
}

const ALL_LEVELS: LogLevel[] = ['info', 'success', 'warn', 'error', 'debug']

export function Logs({
  entries,
  showFilters = true,
  autoScroll = true,
  height = '380px',
  className,
}: LogsProps) {
  const [active, setActive] = React.useState<Set<LogLevel>>(
    () => new Set(ALL_LEVELS),
  )
  const scrollRef = React.useRef<HTMLDivElement>(null)

  const filtered = React.useMemo(
    () => entries.filter((e) => active.has(e.level)),
    [entries, active],
  )

  // Auto-scroll to bottom as entries change.
  React.useEffect(() => {
    if (!autoScroll || !scrollRef.current) return
    scrollRef.current.scrollTop = scrollRef.current.scrollHeight
  }, [filtered.length, autoScroll])

  const counts = React.useMemo(() => {
    const c: Record<LogLevel, number> = {
      info: 0,
      success: 0,
      warn: 0,
      error: 0,
      debug: 0,
    }
    for (const e of entries) c[e.level]++
    return c
  }, [entries])

  const toggle = (lvl: LogLevel) => {
    setActive((s) => {
      const next = new Set(s)
      if (next.has(lvl)) next.delete(lvl)
      else next.add(lvl)
      return next
    })
  }

  return (
    <div
      className={cn(
        'w-full overflow-hidden rounded-xl border border-white/[0.08] bg-[#08080b]',
        className,
      )}
    >
      {showFilters && (
        <div className="flex items-center gap-1.5 border-b border-white/[0.05] bg-white/[0.015] px-2.5 py-2">
          {ALL_LEVELS.map((lvl) => {
            const meta = LEVEL_META[lvl]
            const on = active.has(lvl)
            return (
              <button
                key={lvl}
                type="button"
                onClick={() => toggle(lvl)}
                aria-pressed={on}
                className={cn(
                  'inline-flex items-center gap-1.5 rounded-md border px-2 py-1 font-mono text-[10px] tracking-tight transition-colors',
                  on
                    ? 'border-white/15 bg-white/[0.04] text-white/85'
                    : 'border-transparent bg-transparent text-white/30 hover:text-white/55',
                )}
              >
                <span
                  aria-hidden
                  className={cn('block h-1.5 w-1.5 rounded-full', meta.dot, !on && 'opacity-40')}
                />
                <span>{meta.label.trim()}</span>
                <span className="tabular-nums opacity-55">{counts[lvl]}</span>
              </button>
            )
          })}
          <div className="ml-auto inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.22em] text-white/30">
            <span
              aria-hidden
              className="block h-1 w-1 animate-pulse rounded-full bg-emerald-400"
            />
            live
          </div>
        </div>
      )}

      <div
        ref={scrollRef}
        className="overflow-y-auto"
        style={{ maxHeight: height }}
        data-lenis-prevent
      >
        <AnimatePresence initial={false}>
          {filtered.map((entry) => (
            <LogRow key={entry.id} entry={entry} />
          ))}
        </AnimatePresence>
        {filtered.length === 0 && (
          <p className="px-4 py-8 text-center font-mono text-[11px] text-white/35">
            No entries match the active filters.
          </p>
        )}
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------

function LogRow({ entry }: { entry: LogEntry }) {
  const meta = LEVEL_META[entry.level]
  const ts =
    entry.timestamp instanceof Date
      ? formatTime(entry.timestamp)
      : (entry.timestamp ?? '')

  return (
    <motion.div
      layout="position"
      initial={{ opacity: 0, x: -4 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.16, ease: [0.22, 1, 0.36, 1] }}
      className="flex items-baseline gap-2.5 border-b border-white/[0.03] px-3 py-1.5 font-mono text-[12px] leading-snug last:border-b-0"
    >
      {ts && (
        <span className="shrink-0 text-[10.5px] tabular-nums text-white/30">
          {ts}
        </span>
      )}
      <span
        className={cn(
          'shrink-0 rounded px-1.5 py-[1px] text-[9.5px] font-semibold tracking-wider',
          meta.pill,
        )}
      >
        {meta.label}
      </span>
      {entry.source && (
        <span className="shrink-0 text-[10.5px] text-cyan-300/65">
          [{entry.source}]
        </span>
      )}
      <span className="min-w-0 flex-1 text-white/85">{entry.message}</span>
    </motion.div>
  )
}

function formatTime(d: Date): string {
  const h = String(d.getHours()).padStart(2, '0')
  const m = String(d.getMinutes()).padStart(2, '0')
  const s = String(d.getSeconds()).padStart(2, '0')
  return `${h}:${m}:${s}`
}
