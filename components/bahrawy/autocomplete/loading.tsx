'use client'

import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'
import { scaleIn, springSnappy } from '@/lib/motion'

interface LoadingProps {
  message?: string
}

export function Loading({ message = 'Searching...' }: LoadingProps) {
  return (
    <motion.div
      {...scaleIn}
      transition={springSnappy}
      className="flex items-center justify-center gap-2 py-6"
    >
      <Loader2 className="h-4 w-4 animate-spin text-picks-fg/40" />
      <span className="text-sm text-picks-fg/40">{message}</span>
    </motion.div>
  )
}
