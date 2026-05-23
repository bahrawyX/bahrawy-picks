'use client'

/**
 * <Diff />
 *
 * GitHub-style unified code diff. A file header with the filename and
 * +N/-N stats, then a monospace body where each line has line numbers
 * for the OLD and NEW side, a +/- gutter glyph, and a tinted row
 * background — red for removed, green for added, neutral for context.
 *
 * Lines are passed pre-classified — no diffing happens here. Pair it
 * with a real diff library upstream if you need to compute the diff
 * from raw before/after.
 */

import * as React from 'react'
import { File as FileIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface DiffLine {
  type: 'context' | 'added' | 'removed'
  content: string
  oldNumber?: number
  newNumber?: number
}

export interface DiffProps {
  filename: string
  lines: DiffLine[]
  /** Optional language label rendered as a small chip next to the filename. */
  language?: string
  /** Hide the +N -N stats in the header. Default false. */
  hideStats?: boolean
  /** Hide line numbers. Default false. */
  hideLineNumbers?: boolean
  className?: string
}

export function Diff({
  filename,
  lines,
  language,
  hideStats = false,
  hideLineNumbers = false,
  className,
}: DiffProps) {
  const added = lines.filter((l) => l.type === 'added').length
  const removed = lines.filter((l) => l.type === 'removed').length

  return (
    <div
      className={cn(
        'w-full overflow-hidden rounded-xl border border-white/[0.08] bg-white/[0.02]',
        className,
      )}
    >
      {/* Header */}
      <header className="flex items-center gap-3 border-b border-white/[0.06] px-3.5 py-2.5">
        <FileIcon
          className="h-3.5 w-3.5 shrink-0 text-white/45"
          strokeWidth={2}
        />
        <code className="min-w-0 flex-1 truncate font-mono text-[12px] tracking-tight text-white/85">
          {filename}
        </code>
        {language && (
          <span className="hidden shrink-0 rounded-md border border-white/10 bg-white/[0.04] px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-white/55 sm:inline">
            {language}
          </span>
        )}
        {!hideStats && (
          <div className="flex shrink-0 items-center gap-1.5 font-mono text-[11px] tabular-nums">
            <span className="rounded-md bg-emerald-400/12 px-1.5 py-0.5 text-emerald-300">
              +{added}
            </span>
            <span className="rounded-md bg-rose-400/12 px-1.5 py-0.5 text-rose-300">
              −{removed}
            </span>
          </div>
        )}
      </header>

      {/* Body */}
      <div className="overflow-x-auto">
        <pre className="font-mono text-[12px] leading-[1.55]">
          {lines.map((line, i) => (
            <DiffRow
              key={i}
              line={line}
              hideLineNumbers={hideLineNumbers}
            />
          ))}
        </pre>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------

function DiffRow({
  line,
  hideLineNumbers,
}: {
  line: DiffLine
  hideLineNumbers: boolean
}) {
  const bg =
    line.type === 'added'
      ? 'bg-emerald-400/8'
      : line.type === 'removed'
        ? 'bg-rose-400/8'
        : 'bg-transparent'
  const glyphColor =
    line.type === 'added'
      ? 'text-emerald-400/80'
      : line.type === 'removed'
        ? 'text-rose-400/80'
        : 'text-white/25'
  const numColor =
    line.type === 'added'
      ? 'text-emerald-400/55'
      : line.type === 'removed'
        ? 'text-rose-400/55'
        : 'text-white/30'

  const glyph = line.type === 'added' ? '+' : line.type === 'removed' ? '−' : ' '

  return (
    <div className={cn('flex w-full whitespace-pre', bg)}>
      {!hideLineNumbers && (
        <span
          aria-hidden
          className={cn(
            'sticky left-0 inline-flex shrink-0 select-none border-r border-white/[0.05] px-2.5 py-0 text-right tabular-nums',
            numColor,
          )}
        >
          <span className="inline-block w-6">{line.oldNumber ?? ''}</span>
          <span className="inline-block w-6">{line.newNumber ?? ''}</span>
        </span>
      )}
      <span
        aria-hidden
        className={cn('inline-block w-5 shrink-0 select-none text-center', glyphColor)}
      >
        {glyph}
      </span>
      <code className="flex-1 pr-3 text-white/85">{line.content || ' '}</code>
    </div>
  )
}
