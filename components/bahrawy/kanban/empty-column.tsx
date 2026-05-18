'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface EmptyColumnProps {
  className?: string
}

export function EmptyColumn({ className }: EmptyColumnProps) {
  return (
    <motion.div
      animate={{ opacity: [0.4, 0.7, 0.4] }}
      transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      className={cn(
        'flex h-24 items-center justify-center rounded-lg border-2 border-dashed border-white/[0.08] text-sm text-white/30',
        className
      )}
    >
      Drop card here
    </motion.div>
  )
}
