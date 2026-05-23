'use client'

/**
 * <EnvVars />
 *
 * Vercel-style environment-variable list. Each row has the variable
 * NAME in monospace, an optional "Required" pill, the value masked as
 * dots (• length matched to the real value), and a copy button. A
 * header reveal toggle flips every row at once with a soft per-row
 * stagger.
 *
 * Read-only display — this isn't an editor.
 */

import * as React from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Copy, Check, Eye, EyeOff } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface EnvVar {
  name: string
  value: string
  required?: boolean
}

export interface EnvVarsProps {
  vars: EnvVar[]
  /** Header title. Default 'Environment Variables'. */
  title?: string
  /** Start with values revealed. Default false. */
  defaultVisible?: boolean
  /** Fires when a value is copied. */
  onCopy?: (name: string, value: string) => void
  className?: string
}

export function EnvVars({
  vars,
  title = 'Environment Variables',
  defaultVisible = false,
  onCopy,
  className,
}: EnvVarsProps) {
  const [visible, setVisible] = React.useState(defaultVisible)

  return (
    <div
      className={cn(
        'w-full overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.015]',
        className,
      )}
    >
      {/* Header */}
      <header className="flex items-center justify-between gap-3 border-b border-white/[0.06] px-4 py-3">
        <h3 className="text-[13px] font-medium tracking-tight text-white/85">
          {title}
        </h3>
        <RevealToggle visible={visible} onChange={setVisible} />
      </header>

      {/* Rows */}
      <ul className="divide-y divide-white/[0.04]">
        {vars.map((v, i) => (
          <EnvVarRow
            key={v.name}
            envVar={v}
            visible={visible}
            index={i}
            onCopy={onCopy}
          />
        ))}
      </ul>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Reveal toggle (eye icon switch)
// ---------------------------------------------------------------------------

function RevealToggle({
  visible,
  onChange,
}: {
  visible: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-white/35">
        {visible ? (
          <Eye className="h-3.5 w-3.5" strokeWidth={2} />
        ) : (
          <EyeOff className="h-3.5 w-3.5" strokeWidth={2} />
        )}
      </span>
      <button
        type="button"
        role="switch"
        aria-checked={visible}
        aria-label={visible ? 'Hide values' : 'Show values'}
        onClick={() => onChange(!visible)}
        className={cn(
          'relative h-5 w-9 shrink-0 rounded-full border transition-colors',
          'outline-none focus-visible:ring-2 focus-visible:ring-white/30 focus-visible:ring-offset-2 focus-visible:ring-offset-black',
          visible
            ? 'border-white/40 bg-white/30'
            : 'border-white/15 bg-white/[0.04]',
        )}
      >
        <motion.span
          aria-hidden
          className="absolute top-1/2 h-3.5 w-3.5 rounded-full bg-white shadow-md"
          animate={{ left: visible ? 'calc(100% - 1.05rem)' : '0.15rem', y: '-50%' }}
          transition={{ type: 'spring', stiffness: 600, damping: 32 }}
        />
      </button>
    </div>
  )
}

// ---------------------------------------------------------------------------
// One row
// ---------------------------------------------------------------------------

function EnvVarRow({
  envVar,
  visible,
  index,
  onCopy,
}: {
  envVar: EnvVar
  visible: boolean
  index: number
  onCopy?: (name: string, value: string) => void
}) {
  const [copied, setCopied] = React.useState(false)

  const masked = React.useMemo(() => maskValue(envVar.value), [envVar.value])

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(envVar.value)
      onCopy?.(envVar.name, envVar.value)
      setCopied(true)
      setTimeout(() => setCopied(false), 1100)
    } catch {
      /* clipboard blocked — ignore */
    }
  }

  return (
    <li className="group flex items-center gap-3 px-4 py-3 transition-colors hover:bg-white/[0.02]">
      <div className="flex min-w-0 flex-1 items-center gap-2.5 overflow-hidden">
        <code className="shrink-0 font-mono text-[12px] tracking-tight text-white/90">
          {envVar.name}
        </code>
        {envVar.required && (
          <span className="shrink-0 rounded-md bg-white/[0.06] px-1.5 py-0.5 text-[9.5px] font-semibold uppercase tracking-wider text-white/55">
            Required
          </span>
        )}
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <span
          className={cn(
            'block max-w-[200px] truncate font-mono text-[12px] tabular-nums',
            visible ? 'text-white/80' : 'text-white/45',
          )}
        >
          {visible ? envVar.value : masked}
        </span>
        <button
          type="button"
          onClick={handleCopy}
          aria-label={`Copy ${envVar.name}`}
          className={cn(
            'relative inline-flex h-7 w-7 items-center justify-center rounded-md text-white/40 transition-colors',
            'hover:bg-white/[0.06] hover:text-white/80',
            'outline-none focus-visible:ring-2 focus-visible:ring-white/30',
          )}
        >
          <AnimatePresence mode="wait" initial={false}>
            {copied ? (
              <motion.span
                key="check"
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.6, opacity: 0 }}
                transition={{ duration: 0.16 }}
                className="text-emerald-300"
              >
                <Check className="h-3.5 w-3.5" strokeWidth={2.5} />
              </motion.span>
            ) : (
              <motion.span
                key="copy"
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.6, opacity: 0 }}
                transition={{ duration: 0.16 }}
              >
                <Copy className="h-3.5 w-3.5" strokeWidth={2} />
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>
    </li>
  )
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function maskValue(value: string): string {
  const len = Math.min(value.length, 22)
  return '•'.repeat(Math.max(len, 4))
}
