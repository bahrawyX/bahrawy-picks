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
import { useRovingTabindex, type RovingItemProps } from '@/lib/use-roving-tabindex'

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
  const [focusWithin, setFocusWithin] = React.useState(false)

  // Roving tabindex: arrows/Home/End move focus along the row,
  // Enter/Space pick (native button activation).
  const roving = useRovingTabindex({ count: emojis.length })

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
      onFocus={() => setFocusWithin(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) setFocusWithin(false)
      }}
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
          focusIndex={focusWithin ? roving.focusIndex : null}
          maxScale={maxScale}
          falloff={falloff}
          isSelected={selected.includes(e)}
          onPick={onPick}
          itemProps={roving.getItemProps(i)}
        />
      ))}
    </div>
  )
}

// Layout pitch between emoji centers: h-8 w-8 button (32px) + gap-1 (4px).
const ITEM_PITCH = 36

function EmojiButton({
  emoji,
  index,
  count,
  hoverX,
  focusIndex,
  maxScale,
  falloff,
  isSelected,
  onPick,
  itemProps,
}: {
  emoji: string
  index: number
  count: number
  hoverX: number | null
  focusIndex: number | null
  maxScale: number
  falloff: number
  isSelected: boolean
  onPick: (e: string) => void
  itemProps: RovingItemProps
}) {
  const ref = React.useRef<HTMLButtonElement | null>(null)
  const [center, setCenter] = React.useState<number | null>(null)

  // Measure this button's center within the row outside of render —
  // once on mount and again whenever a hover session starts, so the
  // value tracks layout drift without reading rects during render.
  const hovering = hoverX != null
  React.useLayoutEffect(() => {
    const el = ref.current
    const parent = el?.parentElement
    if (!el || !parent) return
    const parentRect = parent.getBoundingClientRect()
    const rect = el.getBoundingClientRect()
    setCenter(rect.left - parentRect.left + rect.width / 2)
  }, [hovering])

  let scale = 1
  if (hoverX != null && center != null) {
    const dist = Math.abs(hoverX - center)
    const t = Math.max(0, 1 - dist / falloff)
    scale = 1 + (maxScale - 1) * t
  } else if (focusIndex != null) {
    // Keyboard focus drives the same magnification curve, using index
    // distance × item pitch in place of the pointer distance.
    const dist = Math.abs(index - focusIndex) * ITEM_PITCH
    const t = Math.max(0, 1 - dist / falloff)
    scale = 1 + (maxScale - 1) * t
  }
  void count

  return (
    <motion.button
      ref={(el) => {
        ref.current = el
        itemProps.ref(el)
      }}
      type="button"
      tabIndex={itemProps.tabIndex}
      onKeyDown={itemProps.onKeyDown}
      onFocus={itemProps.onFocus}
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
