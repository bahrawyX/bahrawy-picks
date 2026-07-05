'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { scaleIn, springSnappy } from '@/lib/motion'

export interface ContextMenuItem {
  label: string
  onClick: () => void
  danger?: boolean
  disabled?: boolean
  separator?: boolean
}

interface ContextMenuProps {
  x: number
  y: number
  items: ContextMenuItem[]
  onClose: () => void
}

export function ContextMenu({ x, y, items, onClose }: ContextMenuProps) {
  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-50" onClick={onClose} onContextMenu={(e) => { e.preventDefault(); onClose() }} />
      <AnimatePresence>
        <motion.div
          initial={scaleIn.initial}
          animate={scaleIn.animate}
          exit={scaleIn.exit}
          transition={springSnappy}
          className="fixed z-50 min-w-[160px] rounded-lg border border-picks-fg/[0.08] bg-picks-panel p-1 shadow-xl"
          style={{ left: x, top: y }}
        >
          {items.map((item, i) =>
            item.separator ? (
              <div key={i} className="my-1 h-px bg-picks-fg/[0.06]" />
            ) : (
              <button
                key={i}
                type="button"
                onClick={() => { item.onClick(); onClose() }}
                disabled={item.disabled}
                className={cn(
                  'flex w-full items-center rounded-md px-2.5 py-1.5 text-left text-xs transition-colors',
                  item.danger
                    ? 'text-red-400 hover:bg-red-500/10'
                    : 'text-picks-fg/70 hover:bg-picks-fg/[0.06] hover:text-picks-fg',
                  item.disabled && 'cursor-not-allowed opacity-40',
                )}
              >
                {item.label}
              </button>
            ),
          )}
        </motion.div>
      </AnimatePresence>
    </>
  )
}
