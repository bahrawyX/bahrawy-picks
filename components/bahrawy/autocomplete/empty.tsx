'use client'

import { motion } from 'framer-motion'
import { SearchX } from 'lucide-react'
import { fadeUp, springGentle } from '@/lib/motion'

interface EmptyProps {
  message?: string
}

export function Empty({ message = 'No results found' }: EmptyProps) {
  return (
    <motion.div
      {...fadeUp}
      transition={springGentle}
      className="flex flex-col items-center justify-center gap-1.5 py-6"
    >
      <SearchX className="h-4 w-4 text-picks-fg/25" />
      <span className="text-sm text-picks-fg/40">{message}</span>
    </motion.div>
  )
}
