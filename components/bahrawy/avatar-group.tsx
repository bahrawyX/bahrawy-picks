'use client'

/**
 * <AvatarGroup />
 *
 * Stacked overlapping avatars that spread apart on hover. If more than `max`
 * are passed, the rest are summed into a "+N" overflow chip at the end.
 *
 * @param avatars    — Array of `{ src, name, fallback? }`.
 * @param max        — Max visible avatars before overflow chip. Default 4.
 * @param size       — Avatar diameter in px. Default 36.
 * @param overlap    — Px each avatar overlaps the next. Default 12.
 * @param spread     — Extra px each avatar spreads on hover. Default 4.
 * @param className  — Extra classes for the wrapper.
 */

import * as React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

export interface AvatarItem {
  src?: string
  name: string
  fallback?: string
}

export interface AvatarGroupProps {
  avatars: AvatarItem[]
  max?: number
  size?: number
  overlap?: number
  spread?: number
  className?: string
}

const SPRING = { type: 'spring' as const, stiffness: 380, damping: 26, mass: 0.8 }

// Deterministic background color from the name — same hashing as TwitterCard.
const PALETTE = [
  'bg-blue-600',
  'bg-emerald-600',
  'bg-purple-600',
  'bg-rose-600',
  'bg-amber-600',
  'bg-cyan-600',
  'bg-indigo-600',
  'bg-pink-600',
]
function colorFor(name: string) {
  let h = 0
  for (let i = 0; i < name.length; i++) h = name.charCodeAt(i) + ((h << 5) - h)
  return PALETTE[Math.abs(h) % PALETTE.length]
}

export const AvatarGroup = React.forwardRef<HTMLDivElement, AvatarGroupProps>(
  ({ avatars, max = 4, size = 36, overlap = 12, spread = 4, className }, ref) => {
    const [hovered, setHovered] = React.useState(false)
    const visible = avatars.slice(0, max)
    const hidden = Math.max(0, avatars.length - max)

    return (
      <div
        ref={ref}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className={cn('flex items-center', className)}
      >
        {visible.map((a, i) => (
          <motion.div
            key={`${a.name}-${i}`}
            animate={{ x: hovered ? i * spread : 0 }}
            transition={SPRING}
            style={{
              width: size,
              height: size,
              marginLeft: i === 0 ? 0 : -overlap,
              zIndex: visible.length - i,
            }}
            className="relative shrink-0 overflow-hidden rounded-full ring-2 ring-[color:var(--picks-surface,#09090b)]"
            title={a.name}
          >
            {a.src ? (
              <img
                src={a.src}
                alt={a.name}
                className="h-full w-full object-cover"
                draggable={false}
              />
            ) : (
              <div
                className={cn(
                  'flex h-full w-full items-center justify-center text-xs font-semibold text-white',
                  colorFor(a.name),
                )}
              >
                {a.fallback ?? a.name.slice(0, 1).toUpperCase()}
              </div>
            )}
          </motion.div>
        ))}

        {hidden > 0 && (
          <motion.div
            animate={{ x: hovered ? visible.length * spread : 0 }}
            transition={SPRING}
            style={{
              width: size,
              height: size,
              marginLeft: -overlap,
              zIndex: 0,
            }}
            className="relative shrink-0 rounded-full ring-2 ring-[color:var(--picks-surface,#09090b)]"
          >
            <div className="flex h-full w-full items-center justify-center rounded-full bg-white/10 text-[11px] font-semibold tabular-nums text-white/80">
              +{hidden}
            </div>
          </motion.div>
        )}
      </div>
    )
  }
)
AvatarGroup.displayName = 'AvatarGroup'
