'use client'

import { motion, AnimatePresence } from 'framer-motion'

export interface CardNumberProps {
  current: number
  total: number
}

export function CardNumber({ current, total }: CardNumberProps) {
  const formatted = String(current).padStart(2, '0')
  const totalFormatted = String(total).padStart(2, '0')

  return (
    <div className="flex items-baseline font-mono text-sm text-white/50">
      <div className="relative inline-flex overflow-hidden" style={{ width: '1.5em' }}>
        <AnimatePresence mode="popLayout">
          <motion.span
            key={formatted}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          >
            {formatted}
          </motion.span>
        </AnimatePresence>
      </div>
      <span className="mx-1">/</span>
      <span>{totalFormatted}</span>
    </div>
  )
}
