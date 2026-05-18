'use client'

import { DiffEditor as MonacoDiffEditor } from '@monaco-editor/react'
import { cn } from '@/lib/utils'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface DiffEditorProps {
  original: string
  modified: string
  language: string
  diffMode: 'split' | 'inline'
  theme: 'dark' | 'light'
  options?: {
    fontSize?: number
    readOnly?: boolean
    wordWrap?: 'on' | 'off'
  }
  height?: number | string
  className?: string
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function DiffEditorPanel({
  original,
  modified,
  language,
  diffMode,
  theme,
  options,
  height = 400,
  className,
}: DiffEditorProps) {
  const themeName = theme === 'dark' ? 'bahrawyDark' : 'bahrawyLight'

  return (
    <div className={cn('overflow-hidden', className)}>
      <MonacoDiffEditor
        height={height}
        language={language}
        original={original}
        modified={modified}
        theme={themeName}
        options={{
          renderSideBySide: diffMode === 'split',
          fontSize: options?.fontSize ?? 14,
          readOnly: options?.readOnly ?? true,
          wordWrap: options?.wordWrap ?? 'off',
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          renderOverviewRuler: false,
          scrollbar: {
            verticalScrollbarSize: 8,
            horizontalScrollbarSize: 8,
          },
          padding: { top: 12, bottom: 12 },
        }}
      />
    </div>
  )
}
