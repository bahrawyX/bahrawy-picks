'use client'

/**
 * <LikeBurst />
 *
 * An Apple-style heart "like" button.
 *
 *  - At rest: a clean outline heart in muted white.
 *  - On click: the heart fills with the muted SF-red (#FF3B30) and
 *    pops with a snappy spring; eight tiny particles in a warm SF
 *    palette (red / pink / orange) burst radially 30–50px outward,
 *    fading as they travel. A soft white shockwave ring expands
 *    underneath.
 *  - Click again to un-like — fill smoothly drops, no burst.
 *
 * Controlled or uncontrolled.
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
  /** Number of burst particles. Default 8 (radial 45° spacing). */
  particles?: number
  /**
   * Active colour when liked. Default '#FF3B30' (Apple SF symbols red).
   * Particles cycle through a warm SF palette around this colour.
   */
  color?: string
  /** Idle stroke colour. Default 'rgba(255,255,255,0.55)'. */
  idleColor?: string
  /** Accessible label. */
  label?: string
  className?: string
}

// ---------------------------------------------------------------------------
// Springs — Apple physics
// ---------------------------------------------------------------------------

/** Snappy pop for the heart fill — high stiffness, low damping. */
const HEART_SPRING = {
  type: 'spring' as const,
  stiffness: 460,
  damping: 18,
  mass: 0.5,
}

/** Warm SF palette — muted red, pink, warm orange. */
const SF_PARTICLE_COLORS = ['#FF3B30', '#FF6FA8', '#FF9F0A']

export function LikeBurst({
  liked: controlled,
  defaultLiked = false,
  onChange,
  count,
  showCount,
  size = 24,
  particles = 8,
  color = '#FF3B30',
  idleColor = 'rgb(var(--picks-fg-rgb) / 0.55)',
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
        'outline-none focus-visible:ring-2 focus-visible:ring-picks-fg/30 focus-visible:ring-offset-2 focus-visible:ring-offset-black',
        liked ? 'text-picks-fg' : 'text-picks-fg/65 hover:text-picks-fg',
        className,
      )}
    >
      {/* The heart — animated scale on like / un-like */}
      <motion.span
        className="relative inline-flex items-center justify-center"
        animate={liked ? { scale: [1, 1.3, 1] } : { scale: 1 }}
        transition={HEART_SPRING}
      >
        <Heart
          width={size}
          height={size}
          strokeWidth={2}
          style={{
            color: liked ? color : idleColor,
            fill: liked ? color : 'transparent',
            // Snappy fill on like, soft on un-like.
            transition: 'color 220ms ease-out, fill 220ms ease-out',
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
// BurstRing — the radial particles + shockwave
// ---------------------------------------------------------------------------

function BurstRing({
  count,
  color,
  size,
}: {
  count: number
  /** Anchor color for the shockwave ring — particles use the SF palette. */
  color: string
  size: number
}) {
  const particles = React.useMemo(() => {
    return Array.from({ length: count }).map((_, i) => {
      // Pseudo-random in [0,1] from the index — stable across re-renders.
      const r = ((i * 9301 + 49297) % 233280) / 233280
      // Apple-ish radial distance: 30–50px from centre, evenly + a touch
      // of jitter so the burst doesn't look mechanical.
      const baseDistance = 30 + r * 20
      return {
        angle: (i / count) * Math.PI * 2,
        distance: baseDistance,
        dot: 3 + r * 2, // 3–5 px particles
        color: SF_PARTICLE_COLORS[i % SF_PARTICLE_COLORS.length],
      }
    })
  }, [count])

  return (
    <span
      aria-hidden
      className="pointer-events-none absolute left-1/2 top-1/2 h-0 w-0"
    >
      {/* Soft white shockwave — quick expansion, fades fast. No coloured
          glow. */}
      <motion.span
        className="absolute left-0 top-0 rounded-full"
        style={{
          width: size,
          height: size,
          marginLeft: -size / 2,
          marginTop: -size / 2,
          border: '1.5px solid rgb(var(--picks-fg-rgb) / 0.55)',
        }}
        initial={{ scale: 0.5, opacity: 0.55 }}
        animate={{ scale: 1.9, opacity: 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
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
              background: p.color,
            }}
            // 0 → 1 → 0 over 600ms, plus the radial translate.
            initial={{ x: 0, y: 0, scale: 0, opacity: 1 }}
            animate={{
              x: dx,
              y: dy,
              scale: [0, 1, 0],
              opacity: [1, 1, 0],
            }}
            transition={{
              duration: 0.6,
              ease: [0.22, 1, 0.36, 1],
              times: [0, 0.4, 1],
            }}
          />
        )
      })}
    </span>
  )
}
