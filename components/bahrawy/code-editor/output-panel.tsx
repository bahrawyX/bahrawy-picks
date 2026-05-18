'use client'

import { useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Trash2, Terminal } from 'lucide-react'
import { cn } from '@/lib/utils'
import { springGentle, tweenExit } from '@/lib/motion'
import { CopyButton } from '@/components/bahrawy/copy-button'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface OutputPanelProps {
  output: string
  onClear: () => void
  theme: 'dark' | 'light'
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function OutputPanel({ output, onClear, theme }: OutputPanelProps) {
  const scrollRef = useRef<HTMLPreElement>(null)
  const isDark = theme === 'dark'
  const isVisible = output.length > 0

  // Auto-scroll to bottom when output changes
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [output])

  return (
    <AnimatePresence mode="wait">
      {isVisible && (
        <motion.div
          key="output-panel"
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={isVisible ? springGentle : tweenExit}
          className="overflow-hidden"
        >
          <div
            className={cn(
              'border-t',
              isDark
                ? 'border-white/[0.06]'
                : 'border-black/[0.06]',
            )}
          >
            {/* Header */}
            <div
              className={cn(
                'flex items-center justify-between px-3 py-1.5',
                isDark
                  ? 'bg-white/[0.02]'
                  : 'bg-black/[0.02]',
              )}
            >
              <div className="flex items-center gap-1.5">
                <Terminal
                  className={cn(
                    'h-3.5 w-3.5',
                    isDark ? 'text-white/40' : 'text-black/40',
                  )}
                />
                <span
                  className={cn(
                    'text-xs font-medium',
                    isDark ? 'text-white/50' : 'text-black/50',
                  )}
                >
                  Output
                </span>
              </div>
              <div className="flex items-center gap-1">
                <CopyButton
                  text={output}
                  variant="ghost"
                  size="sm"
                  className={cn(
                    isDark
                      ? 'text-white/40 hover:text-white/70'
                      : 'text-black/40 hover:text-black/70',
                  )}
                />
                <button
                  type="button"
                  onClick={onClear}
                  className={cn(
                    'inline-flex h-7 w-7 items-center justify-center rounded-lg transition-colors',
                    isDark
                      ? 'text-white/40 hover:bg-white/[0.06] hover:text-white/70'
                      : 'text-black/40 hover:bg-black/[0.06] hover:text-black/70',
                  )}
                  aria-label="Clear output"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {/* Output content */}
            <pre
              ref={scrollRef}
              className={cn(
                'max-h-48 overflow-auto px-3 py-2 font-mono text-xs leading-relaxed',
                isDark
                  ? 'bg-black/40 text-green-400/80'
                  : 'bg-white text-green-700/80',
              )}
            >
              {output}
            </pre>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
