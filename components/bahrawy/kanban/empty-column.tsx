'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { Inbox } from 'lucide-react'

interface EmptyColumnProps {
  isDragOver?: boolean
  className?: string
}

export function EmptyColumn({ isDragOver, className }: EmptyColumnProps) {
  return (
    <div
      className={cn(
        'flex flex-1 flex-col items-center justify-center gap-2 rounded-xl py-8 pointer-events-none select-none',
        className
      )}
    >
      {isDragOver ? (
        <p className="text-[11px] text-white/30">Drop here</p>
      ) : (
        <>
          <motion.div
            animate={{ opacity: [0.15, 0.35, 0.15] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          >
            <Inbox className="h-8 w-8 text-white/15" />
          </motion.div>
          <p className="text-[11px] text-white/20">No cards yet</p>
        </>
      )}
    </div>
  )
}
