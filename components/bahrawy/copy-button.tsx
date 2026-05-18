'use client'

import { useState, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Copy, Check, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { springSnappy } from '@/lib/motion'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type CopyState = 'idle' | 'copied' | 'error'

export interface CopyButtonProps {
  text: string
  onCopy?: () => void
  onError?: (error: Error) => void
  duration?: number
  variant?: 'default' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  label?: string
  className?: string
  /** @internal Override the copy function for testing */
  copyFn?: (text: string) => Promise<void>
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const sizeMap = {
  sm: 'h-7 w-7',
  md: 'h-8 w-8',
  lg: 'h-9 w-9',
} as const

const iconSizeMap = {
  sm: 'h-3 w-3',
  md: 'h-3.5 w-3.5',
  lg: 'h-4 w-4',
} as const

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function CopyButton({
  text,
  onCopy,
  onError,
  duration = 2000,
  variant = 'default',
  size = 'md',
  label,
  className,
  copyFn,
}: CopyButtonProps) {
  const [state, setState] = useState<CopyState>('idle')
  const timerRef = useRef<ReturnType<typeof setTimeout>>(null)

  const handleCopy = useCallback(async () => {
    const writeFn = copyFn ?? navigator.clipboard.writeText.bind(navigator.clipboard)
    try {
      await writeFn(text)
      setState('copied')
      onCopy?.()
    } catch (err) {
      setState('error')
      onError?.(err instanceof Error ? err : new Error('Copy failed'))
    }
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => setState('idle'), duration)
  }, [text, onCopy, onError, duration, copyFn])

  const tooltipText =
    state === 'copied' ? 'Copied!' : state === 'error' ? 'Failed to copy' : 'Copy'

  const iconClass = iconSizeMap[size]

  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            onClick={handleCopy}
            className={cn(
              'inline-flex items-center justify-center gap-1.5 rounded-lg transition-colors',
              sizeMap[size],
              variant === 'default' &&
                'border border-white/[0.08] bg-white/[0.03] text-white/60 hover:border-white/20 hover:bg-white/[0.06] hover:text-white',
              variant === 'outline' &&
                'border border-white/[0.12] bg-transparent text-white/60 hover:border-white/25 hover:text-white',
              variant === 'ghost' &&
                'bg-transparent text-white/50 hover:bg-white/[0.06] hover:text-white',
              state === 'copied' && 'border-green-500/30 text-green-400',
              state === 'error' && 'border-red-500/30 text-red-400',
              label && 'w-auto px-2.5',
              className,
            )}
            aria-label={tooltipText}
          >
            <AnimatePresence mode="wait">
              <motion.span
                key={state}
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.5, opacity: 0 }}
                transition={springSnappy}
                className="flex items-center"
              >
                {state === 'copied' ? (
                  <Check className={cn(iconClass, 'text-green-400')} />
                ) : state === 'error' ? (
                  <AlertCircle className={cn(iconClass, 'text-red-400')} />
                ) : (
                  <Copy className={iconClass} />
                )}
              </motion.span>
            </AnimatePresence>
            {label && <span className="text-xs">{label}</span>}
          </button>
        </TooltipTrigger>
        <TooltipContent side="top">{tooltipText}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
