'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { fadeUp, springGentle } from '@/lib/motion'

interface DateSeparatorProps {
  label: string
}

export function DateSeparator({ label }: DateSeparatorProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-40px' })

  return (
    <motion.div
      ref={ref}
      {...fadeUp}
      animate={isInView ? fadeUp.animate : fadeUp.initial}
      transition={springGentle}
      className="sticky top-0 z-10 -mx-1 px-1 py-2 backdrop-blur-sm"
    >
      <span className="text-xs font-medium text-white/30">
        {label}
      </span>
    </motion.div>
  )
}
