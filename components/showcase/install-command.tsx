'use client'

import { useState, useCallback } from 'react'
import { cn } from '@/lib/utils'

export function InstallCommand({
  componentName,
  className,
}: {
  componentName: string
  className?: string
}) {
  const command = `npx bahrawy add ${componentName}`
  const [copied, setCopied] = useState(false)

  const copy = useCallback(() => {
    navigator.clipboard.writeText(command)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }, [command])

  return (
    <button
      type="button"
      onClick={copy}
      className={cn(
        'group flex w-full max-w-md items-center justify-between gap-3 rounded-lg border border-white/10 bg-white/[0.03] px-4 py-2.5 text-left font-mono text-sm transition-colors hover:border-white/20 hover:bg-white/[0.06]',
        className
      )}
    >
      <span className="flex items-center gap-2 truncate">
        <span className="select-none text-white/30">$</span>
        <span className="text-white/70">{command}</span>
      </span>
      <span
        className={cn(
          'flex shrink-0 items-center gap-1 text-xs transition-colors',
          copied ? 'text-emerald-400' : 'text-white/30 group-hover:text-white/50'
        )}
      >
        {copied ? (
          <>
            <CheckIcon />
            Copied
          </>
        ) : (
          <CopyIcon />
        )}
      </span>
    </button>
  )
}

function CopyIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="9" width="13" height="13" rx="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}
