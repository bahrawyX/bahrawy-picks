'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { ArrowUp } from 'lucide-react'
import { scaleIn, springSnappy, tweenExit } from '@/lib/motion'
import { cn } from '@/lib/utils'

interface ScrollToTopProps {
  visible: boolean
  onClick: () => void
  className?: string
}

export function ScrollToTop({ visible, onClick, className }: ScrollToTopProps) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={scaleIn.initial}
          animate={scaleIn.animate}
          exit={scaleIn.exit}
          transition={visible ? springSnappy : tweenExit}
          whileTap={{ scale: 0.93 }}
          onClick={onClick}
          className={cn(
            'absolute bottom-3 right-3 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-zinc-800 text-white/70 shadow-lg hover:bg-zinc-700 hover:text-white transition-colors',
            className
          )}
          aria-label="Scroll to top"
        >
          <ArrowUp className="h-4 w-4" />
        </motion.button>
      )}
    </AnimatePresence>
  )
}
