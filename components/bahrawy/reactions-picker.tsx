'use client'

/**
 * <ReactionsPicker />  —  Slack/Messages-style emoji reactions popup.
 *
 * A row of emojis that scales up on hover (macOS Dock magnification),
 * click fires the picker's onPick with the chosen emoji. Optional
 * "Add reaction" trigger that opens an expanded grid of emojis.
 *
 * Apple aesthetics: vibrancy pill, multi-layer shadow, Apple spring
 * on the magnify scale.
 */

import * as React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

export interface ReactionsPickerProps {
  /** Emojis shown in the quick row. */
  emojis?: string[]
  /** Already-selected emoji values (will render with a soft active background). */
  selected?: string[]
  onPick: (emoji: string) => void
  /** Maximum scale of the hovered emoji. Default 1.5. */
  maxScale?: number
  /** Falloff distance from cursor (in px) where scale returns to 1. Default 80. */
  falloff?: number
  className?: string
}

const APPLE_SPRING = { type: 'spring' as const, stiffness: 420, damping: 28, mass: 0.5 }

const DEFAULT_EMOJIS = ['👍', '❤️', '🎉', '😂', '🤔', '🔥']

export function ReactionsPicker({
  emojis = DEFAULT_EMOJIS,
  selected = [],
  onPick,
  maxScale = 1.5,
  falloff = 80,
  className,
}: ReactionsPickerProps) {
  const rowRef = React.useRef<HTMLDivElement>(null)
  const [hoverX, setHoverX] = React.useState<number | null>(null)

  const onMove = (e: React.PointerEvent) => {
    const r = rowRef.current?.getBoundingClientRect()
    if (!r) return
    setHoverX(e.clientX - r.left)
  }
  const onLeave = () => setHoverX(null)

  return (
    <div
      ref={rowRef}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className={cn(
        'inline-flex items-center gap-1 rounded-full border border-white/[0.08] px-2 py-1.5 backdrop-blur-xl',
        className,
      )}
      style={{
        background:
          'linear-gradient(180deg, rgba(36,36,40,0.85) 0%, rgba(22,22,26,0.92) 100%)',
        boxShadow:
          '0 1px 0 rgba(255,255,255,0.06) inset, 0 0 0 0.5px rgba(255,255,255,0.05), 0 12px 28px -8px rgba(0,0,0,0.55)',
      }}
    >
      {emojis.map((e, i) => (
        <EmojiButton
          key={`${e}-${i}`}
          emoji={e}
          index={i}
          count={emojis.length}
          hoverX={hoverX}
          maxScale={maxScale}
          falloff={falloff}
          isSelected={selected.includes(e)}
          onPick={onPick}
        />
      ))}
    </div>
  )
}

function EmojiButton({
  emoji,
  index,
  count,
  hoverX,
  maxScale,
  falloff,
  isSelected,
  onPick,
}: {
  emoji: string
  index: number
  count: number
  hoverX: number | null
  maxScale: number
  falloff: number
  isSelected: boolean
  onPick: (e: string) => void
}) {
  const ref = React.useRef<HTMLButtonElement>(null)
  let scale = 1
  if (hoverX != null && ref.current) {
    const parentRect = ref.current.parentElement?.getBoundingClientRect()
    const rect = ref.current.getBoundingClientRect()
    if (parentRect) {
      const myCenter = rect.left - parentRect.left + rect.width / 2
      const dist = Math.abs(hoverX - myCenter)
      const t = Math.max(0, 1 - dist / falloff)
      scale = 1 + (maxScale - 1) * t
    }
  }
  void count
  void index

  return (
    <motion.button
      ref={ref}
      type="button"
      onClick={() => onPick(emoji)}
      animate={{ scale }}
      transition={APPLE_SPRING}
      whileTap={{ scale: scale * 0.9 }}
      className={cn(
        'inline-flex h-8 w-8 origin-bottom items-center justify-center rounded-full text-[20px] leading-none transition-colors',
        isSelected ? 'bg-white/[0.12]' : 'hover:bg-white/[0.06]',
      )}
      aria-label={`React with ${emoji}`}
    >
      {emoji}
    </motion.button>
  )
}
