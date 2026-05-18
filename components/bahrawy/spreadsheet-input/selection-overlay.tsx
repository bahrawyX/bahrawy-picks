'use client'

import { motion } from 'framer-motion'
import { tweenSmooth } from '@/lib/motion'

interface SelectionOverlayProps {
  top: number
  left: number
  width: number
  height: number
}

export function SelectionOverlay({ top, left, width, height }: SelectionOverlayProps) {
  if (width <= 0 || height <= 0) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={tweenSmooth}
      className="pointer-events-none absolute z-10"
      style={{ top, left, width, height }}
    >
      <div className="h-full w-full border-2 border-blue-500 bg-blue-500/10" />
    </motion.div>
  )
}
