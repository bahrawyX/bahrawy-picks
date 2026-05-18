'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { scaleIn, springSnappy, tweenExit } from '@/lib/motion'
import { cn } from '@/lib/utils'

type Priority = 'low' | 'medium' | 'high' | 'urgent'

interface FilterBarProps {
  activePriorities: Priority[]
  onToggle: (priority: Priority) => void
  className?: string
}

const PRIORITIES: { value: Priority; label: string; color: string }[] = [
  { value: 'low', label: 'Low', color: 'bg-gray-500/15 text-gray-400 border-gray-500/20' },
  { value: 'medium', label: 'Medium', color: 'bg-blue-500/15 text-blue-400 border-blue-500/20' },
  { value: 'high', label: 'High', color: 'bg-amber-500/15 text-amber-400 border-amber-500/20' },
  { value: 'urgent', label: 'Urgent', color: 'bg-red-500/15 text-red-400 border-red-500/20' },
]

export function FilterBar({ activePriorities, onToggle, className }: FilterBarProps) {
  return (
    <div className={cn('flex flex-wrap items-center gap-2', className)}>
      <span className="text-xs text-white/40">Priority:</span>
      <AnimatePresence mode="popLayout">
        {PRIORITIES.map((p) => {
          const isActive = activePriorities.includes(p.value)
          return (
            <motion.button
              key={p.value}
              layout
              {...scaleIn}
              animate={{
                opacity: 1,
                scale: 1,
              }}
              exit={scaleIn.exit}
              transition={isActive ? springSnappy : tweenExit}
              onClick={() => onToggle(p.value)}
              className={cn(
                'rounded-full border px-3 py-1 text-xs font-medium transition-colors',
                isActive
                  ? p.color
                  : 'border-white/[0.06] bg-white/[0.03] text-white/40 hover:bg-white/[0.06]'
              )}
            >
              {p.label}
            </motion.button>
          )
        })}
      </AnimatePresence>
    </div>
  )
}

export type { Priority }
