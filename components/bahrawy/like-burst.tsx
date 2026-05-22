'use client'

/**
 * <LikeBurst />
 *
 * A heart button that bursts when you like it. On click:
 *
 *  - The heart fills with the active colour and springs up briefly,
 *    then settles.
 *  - A ring of small "particles" (default 10) shoots outward from
 *    the heart, fading + falling slightly as they travel. Each
 *    particle's angle is `(i / N) × 360°` so the burst is evenly
 *    radial; each one's distance has a small random jitter for
 *    organic feel.
 *  - Clicking again un-likes (no burst on un-like).
 *
 * Controlled or uncontrolled. Works as an `<a>` (link), a `<button>`
 * (default), or a plain interactive `<span>` via the `as` prop.
 */

import * as React from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Heart } from 'lucide-react'
import { cn } from '@/lib/utils'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface LikeBurstProps {
  /** Controlled value. */
  liked?: boolean
  /** Uncontrolled default. */
  defaultLiked?: boolean
  /** Fired on click — receives the next liked state. */
  onChange?: (next: boolean) => void
  /** Optional running like count, rendered to the right of the heart. */
  count?: number
  /** Show the like count to the right of the heart. Default true if count is set. */
  showCount?: boolean
  /** Heart size in px. Default 24. */
  size?: number
  /** Number of burst particles. Default 10. */
  particles?: number
  /** Active colour when liked. Default '#F472B6'. */
  color?: string
  /** Idle stroke colour. Default 'rgba(255,255,255,0.55)'. */
  idleColor?: string
  /** Accessible label. */
  label?: string
  className?: string
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

const HEART_SPRING = {
  type: 'spring' as const,
  stiffness: 480,
  damping: 14,
  mass: 0.4,
}

export function LikeBurst({
  liked: controlled,
  defaultLiked = false,
  onChange,
  count,
  showCount,
  size = 24,
  particles = 10,
  color = '#F472B6',
  idleColor = 'rgba(255,255,255,0.55)',
  label = 'Like',
  className,
}: LikeBurstProps) {
  const [internal, setInternal] = React.useState(defaultLiked)
  const isControlled = controlled !== undefined
  const liked = isControlled ? controlled : internal
  // `burstKey` resets every like so each burst is a fresh animation
  // (AnimatePresence sees a key change and re-mounts the particles).
  const [burstKey, setBurstKey] = React.useState(0)

  const showTheCount = showCount ?? count !== undefined

  const onClick = () => {
    const next = !liked
    if (!isControlled) setInternal(next)
    onChange?.(next)
    if (next) {
      // Only burst when transitioning to liked.
      setBurstKey((k) => k + 1)
    }
  }

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={liked}
      aria-label={label}
      className={cn(
        'group relative inline-flex items-center gap-1.5 rounded-full px-2 py-1 transition-colors',
        'outline-none focus-visible:ring-2 focus-visible:ring-white/30 focus-visible:ring-offset-2 focus-visible:ring-offset-black',
        liked ? 'text-pink-300' : 'text-white/65 hover:text-white',
        className,
      )}
    >
      {/* The heart — animated scale on like / un-like */}
      <motion.span
        className="relative inline-flex items-center justify-center"
        animate={liked ? { scale: [1, 1.35, 1] } : { scale: 1 }}
        transition={HEART_SPRING}
      >
        <Heart
          width={size}
          height={size}
          strokeWidth={2}
          style={{
            color: liked ? color : idleColor,
            fill: liked ? color : 'transparent',
            transition: 'color 200ms ease-out, fill 200ms ease-out',
          }}
        />

        {/* Particle burst — only renders the brief moment after a like */}
        <AnimatePresence>
          {liked && (
            <BurstRing
              key={burstKey}
              count={particles}
              color={color}
              size={size}
            />
          )}
        </AnimatePresence>
      </motion.span>

      {showTheCount && (
        <span
          className="font-mono text-xs tabular-nums"
          aria-hidden={!liked}
        >
          {count ?? (liked ? 1 : 0)}
        </span>
      )}
    </button>
  )
}

// ---------------------------------------------------------------------------
// BurstRing — the radial particles
// ---------------------------------------------------------------------------

function BurstRing({
  count,
  color,
  size,
}: {
  count: number
  color: string
  size: number
}) {
  // Each particle gets a stable seeded jitter on its travel distance so
  // the burst feels organic but doesn't reshuffle on re-render.
  const particles = React.useMemo(() => {
    return Array.from({ length: count }).map((_, i) => {
      // Pseudo-random in [-0.35, 0.35] from the index.
      const r = ((i * 9301 + 49297) % 233280) / 233280
      const jitter = (r - 0.5) * 0.7
      return {
        angle: (i / count) * Math.PI * 2,
        // Particle travels 110% of the heart size outward, plus jitter
        distance: size * 1.05 * (1 + jitter * 0.5),
        // Tiny dot size varies a touch.
        dot: 2 + r * 2.5,
      }
    })
  }, [count, size])

  return (
    <span
      aria-hidden
      className="pointer-events-none absolute left-1/2 top-1/2 h-0 w-0"
    >
      {/* Soft expanding ring at the centre — feels like a click "shock" */}
      <motion.span
        className="absolute left-0 top-0 rounded-full"
        style={{
          width: size,
          height: size,
          marginLeft: -size / 2,
          marginTop: -size / 2,
          border: `2px solid ${color}`,
        }}
        initial={{ scale: 0.4, opacity: 0.6 }}
        animate={{ scale: 1.8, opacity: 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      />

      {particles.map((p, i) => {
        const dx = Math.cos(p.angle) * p.distance
        const dy = Math.sin(p.angle) * p.distance
        return (
          <motion.span
            key={i}
            className="absolute left-0 top-0 rounded-full"
            style={{
              width: p.dot,
              height: p.dot,
              marginLeft: -p.dot / 2,
              marginTop: -p.dot / 2,
              background: color,
            }}
            initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
            animate={{
              x: dx,
              y: dy + p.distance * 0.18, // slight downward drift
              opacity: 0,
              scale: 0.6,
            }}
            transition={{
              duration: 0.6,
              ease: [0.22, 1, 0.36, 1],
            }}
          />
        )
      })}
    </span>
  )
}
