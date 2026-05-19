'use client'

import { motion } from 'framer-motion'

export interface DotIndicatorsProps {
  total: number
  active: number
}

export function DotIndicators({ total, active }: DotIndicatorsProps) {
  return (
    <div className="flex items-center justify-center gap-2">
      {Array.from({ length: total }, (_, i) => {
        const isActive = i === active
        return (
          <motion.div
            key={i}
            className="h-2 rounded-full"
            animate={{
              width: isActive ? 24 : 8,
              backgroundColor: isActive
                ? 'rgba(255, 255, 255, 1)'
                : 'rgba(255, 255, 255, 0.3)',
            }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          />
        )
      })}
    </div>
  )
}
