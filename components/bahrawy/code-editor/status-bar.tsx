'use client'

import { useMemo } from 'react'
import { cn } from '@/lib/utils'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface StatusBarProps {
  language: string
  cursorPosition: { line: number; column: number }
  value: string
  theme: 'dark' | 'light'
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const languageLabels: Record<string, string> = {
  typescript: 'TypeScript',
  javascript: 'JavaScript',
  tsx: 'TSX',
  jsx: 'JSX',
  python: 'Python',
  rust: 'Rust',
  go: 'Go',
  css: 'CSS',
  html: 'HTML',
  json: 'JSON',
  markdown: 'Markdown',
  sql: 'SQL',
  bash: 'Bash',
  yaml: 'YAML',
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function StatusBar({
  language,
  cursorPosition,
  value,
  theme,
}: StatusBarProps) {
  const fileSize = useMemo(() => {
    const bytes = new TextEncoder().encode(value).length
    return formatBytes(bytes)
  }, [value])

  const isDark = theme === 'dark'

  return (
    <div
      className={cn(
        'flex items-center justify-between px-3 py-1 text-[11px] font-medium select-none',
        isDark
          ? 'bg-[#252525] text-white/40'
          : 'border-t border-black/[0.06] bg-black/[0.02] text-black/40',
      )}
    >
      <div className="flex items-center gap-3">
        <span
          className={cn(
            'rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider',
            isDark
              ? 'bg-white/[0.06] text-white/60'
              : 'bg-black/[0.06] text-black/60',
          )}
        >
          {languageLabels[language] ?? language}
        </span>
        <span>
          Ln {cursorPosition.line}, Col {cursorPosition.column}
        </span>
      </div>
      <div className="flex items-center gap-3">
        <span>{fileSize}</span>
        <span>UTF-8</span>
      </div>
    </div>
  )
}
