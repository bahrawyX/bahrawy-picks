'use client'

import { type ReactNode } from 'react'
import { motion } from 'framer-motion'
import { X } from 'lucide-react'
import { scaleIn, springSnappy, tweenExit } from '@/lib/motion'

interface ChipProps {
  label: string
  icon?: ReactNode
  onRemove: () => void
  disabled?: boolean
}

export function Chip({ label, icon, onRemove, disabled }: ChipProps) {
  return (
    <motion.span
      layout
      {...scaleIn}
      exit={{ ...scaleIn.exit, transition: tweenExit }}
      transition={springSnappy}
      className="inline-flex items-center gap-1 rounded-md border border-white/10 bg-white/[0.06] px-2 py-0.5 text-xs font-medium text-white/80"
    >
      {icon && <span className="flex shrink-0 [&_svg]:h-3 [&_svg]:w-3">{icon}</span>}
      <span className="max-w-[120px] truncate">{label}</span>
      {!disabled && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            onRemove()
          }}
          className="flex shrink-0 items-center justify-center rounded-sm text-white/30 transition-colors hover:text-white/70"
        >
          <X className="h-3 w-3" />
        </button>
      )}
    </motion.span>
  )
}
