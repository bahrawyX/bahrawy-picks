'use client'

import { X } from 'lucide-react'
import { motion } from 'framer-motion'
import { scaleIn, springSnappy, tweenExit } from '@/lib/motion'

interface FilterBadgeProps {
  label: string
  value: string
  onRemove: () => void
}

export function FilterBadge({ label, value, onRemove }: FilterBadgeProps) {
  return (
    <motion.button
      layout
      {...scaleIn}
      exit={{ ...scaleIn.exit, transition: tweenExit }}
      transition={springSnappy}
      type="button"
      onClick={onRemove}
      className="group inline-flex items-center gap-1.5 rounded-md border border-white/10 bg-white/[0.04] px-2 py-1 text-xs text-white/70 transition-colors hover:border-white/20 hover:bg-white/[0.08] hover:text-white"
    >
      <span className="font-medium text-white/40">{label}:</span>
      <span className="max-w-[120px] truncate">{value}</span>
      <X className="h-3 w-3 shrink-0 text-white/30 transition-colors group-hover:text-white/70" />
    </motion.button>
  )
}
