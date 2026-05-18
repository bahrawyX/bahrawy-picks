'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Plus, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { scaleIn, tweenExit, springSnappy } from '@/lib/motion'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface EditorFile {
  name: string
  language: string
  content: string
}

export interface FileTabsProps {
  files: EditorFile[]
  activeIndex: number
  onSelect: (index: number) => void
  onClose: (index: number) => void
  onAdd: () => void
  theme: 'dark' | 'light'
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const languageColors: Record<string, string> = {
  typescript: 'bg-blue-500/20 text-blue-400',
  javascript: 'bg-yellow-500/20 text-yellow-400',
  tsx: 'bg-blue-500/20 text-blue-300',
  jsx: 'bg-yellow-500/20 text-yellow-300',
  python: 'bg-green-500/20 text-green-400',
  rust: 'bg-orange-500/20 text-orange-400',
  go: 'bg-cyan-500/20 text-cyan-400',
  css: 'bg-purple-500/20 text-purple-400',
  html: 'bg-red-500/20 text-red-400',
  json: 'bg-gray-500/20 text-gray-400',
  markdown: 'bg-gray-500/20 text-gray-300',
  sql: 'bg-indigo-500/20 text-indigo-400',
  bash: 'bg-green-500/20 text-green-300',
  yaml: 'bg-pink-500/20 text-pink-400',
}

const languageColorsLight: Record<string, string> = {
  typescript: 'bg-blue-100 text-blue-700',
  javascript: 'bg-yellow-100 text-yellow-700',
  tsx: 'bg-blue-100 text-blue-600',
  jsx: 'bg-yellow-100 text-yellow-600',
  python: 'bg-green-100 text-green-700',
  rust: 'bg-orange-100 text-orange-700',
  go: 'bg-cyan-100 text-cyan-700',
  css: 'bg-purple-100 text-purple-700',
  html: 'bg-red-100 text-red-700',
  json: 'bg-gray-100 text-gray-700',
  markdown: 'bg-gray-100 text-gray-600',
  sql: 'bg-indigo-100 text-indigo-700',
  bash: 'bg-green-100 text-green-600',
  yaml: 'bg-pink-100 text-pink-700',
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function FileTabs({
  files,
  activeIndex,
  onSelect,
  onClose,
  onAdd,
  theme,
}: FileTabsProps) {
  const isDark = theme === 'dark'
  const canClose = files.length > 1

  return (
    <div
      className={cn(
        'flex items-center gap-0 overflow-x-auto border-b',
        isDark
          ? 'border-white/[0.04] bg-white/[0.02]'
          : 'border-black/[0.06] bg-black/[0.01]',
      )}
    >
      <AnimatePresence mode="popLayout">
        {files.map((file, index) => {
          const isActive = index === activeIndex
          const colorClasses = isDark
            ? languageColors[file.language] ?? 'bg-gray-500/20 text-gray-400'
            : languageColorsLight[file.language] ?? 'bg-gray-100 text-gray-600'

          return (
            <motion.button
              key={`${file.name}-${index}`}
              type="button"
              onClick={() => onSelect(index)}
              layout
              initial={scaleIn.initial}
              animate={scaleIn.animate}
              exit={{ ...tweenExit, ...scaleIn.exit }}
              transition={springSnappy}
              className={cn(
                'group relative flex items-center gap-2 whitespace-nowrap px-3 py-2 text-xs font-medium transition-colors',
                isActive
                  ? isDark
                    ? 'bg-white/[0.06] text-white'
                    : 'bg-black/[0.04] text-black'
                  : isDark
                    ? 'text-white/40 hover:bg-white/[0.03] hover:text-white/60'
                    : 'text-black/40 hover:bg-black/[0.02] hover:text-black/60',
              )}
            >
              <span>{file.name}</span>
              <span
                className={cn(
                  'rounded px-1 py-0.5 text-[9px] font-semibold uppercase tracking-wider',
                  colorClasses,
                )}
              >
                {file.language}
              </span>
              {canClose && (
                <span
                  role="button"
                  tabIndex={0}
                  onClick={(e) => {
                    e.stopPropagation()
                    onClose(index)
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.stopPropagation()
                      onClose(index)
                    }
                  }}
                  className={cn(
                    'ml-0.5 inline-flex h-4 w-4 items-center justify-center rounded opacity-0 transition-opacity group-hover:opacity-100',
                    isDark
                      ? 'hover:bg-white/[0.1] text-white/40 hover:text-white/80'
                      : 'hover:bg-black/[0.1] text-black/40 hover:text-black/80',
                  )}
                  aria-label={`Close ${file.name}`}
                >
                  <X className="h-3 w-3" />
                </span>
              )}
              {/* Active indicator */}
              {isActive && (
                <motion.div
                  layoutId="active-tab-indicator"
                  className={cn(
                    'absolute inset-x-0 bottom-0 h-0.5',
                    isDark ? 'bg-white/60' : 'bg-black/60',
                  )}
                  transition={springSnappy}
                />
              )}
            </motion.button>
          )
        })}
      </AnimatePresence>

      {/* Add file button */}
      <motion.button
        type="button"
        onClick={onAdd}
        whileTap={{ scale: 0.93 }}
        transition={springSnappy}
        className={cn(
          'ml-1 inline-flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-md transition-colors',
          isDark
            ? 'text-white/30 hover:bg-white/[0.06] hover:text-white/60'
            : 'text-black/30 hover:bg-black/[0.06] hover:text-black/60',
        )}
        aria-label="Add new file"
      >
        <Plus className="h-3.5 w-3.5" />
      </motion.button>
    </div>
  )
}
