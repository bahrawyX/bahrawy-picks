'use client'

/**
 * <AvatarStatus />
 *
 * The single primitive every chat, collab, or directory UI uses.
 * Image avatar with a graceful initials fallback (initials are derived
 * from the name and the background color is hashed from the name too,
 * so the same person always gets the same colour). A status dot sits
 * in the corner with a ring that matches the surrounding background
 * to give it that "punched out" look. The `online` state pulses
 * subtly to signal liveness.
 *
 * Optional name + role copy renders to the right.
 */

import * as React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

export type AvatarStatusState = 'online' | 'away' | 'busy' | 'offline' | 'none'

export interface AvatarStatusProps {
  /** Image URL. If omitted (or it fails to load), initials are shown. */
  src?: string
  /** Display name — also drives initials + the hashed fallback color. */
  name: string
  /** Optional role / subtitle rendered next to the name. */
  role?: React.ReactNode
  /** Connection state. Default 'none' (no dot). */
  status?: AvatarStatusState
  /** Size preset — sm 28, md 36, lg 48, xl 64. Default 'md'. */
  size?: 'sm' | 'md' | 'lg' | 'xl'
  /** Render the name + role to the right of the avatar. Default false. */
  showName?: boolean
  /** Background color for the status-dot ring. Defaults to the page bg
   *  via the `--picks-surface` token (dark fallback when unset). */
  ringColor?: string
  /** Outer subtle ring around the avatar itself. Default false. */
  outerRing?: boolean
  className?: string
}

const SIZES = {
  sm: { box: 28, dot: 9, textPx: 11, gap: 8 },
  md: { box: 36, dot: 11, textPx: 12.5, gap: 10 },
  lg: { box: 48, dot: 13, textPx: 14, gap: 12 },
  xl: { box: 64, dot: 16, textPx: 17, gap: 14 },
}

const STATE_COLORS: Record<Exclude<AvatarStatusState, 'none'>, string> = {
  online: '#34D399', // emerald
  away: '#FBBF24',   // amber
  busy: '#FB7185',   // rose
  offline: '#71717A', // zinc
}

// 8 stable palettes for the initials fallback — picked from a name hash.
const FALLBACK_PALETTES: { from: string; to: string }[] = [
  { from: '#A78BFA', to: '#7C3AED' }, // violet
  { from: '#22D3EE', to: '#0891B2' }, // cyan
  { from: '#F472B6', to: '#DB2777' }, // pink
  { from: '#FBBF24', to: '#D97706' }, // amber
  { from: '#34D399', to: '#059669' }, // emerald
  { from: '#FB7185', to: '#E11D48' }, // rose
  { from: '#60A5FA', to: '#2563EB' }, // blue
  { from: '#A78BFA', to: '#22D3EE' }, // violet-cyan blend
]

function initialsFrom(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return '?'
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

function hashIndex(s: string, mod: number) {
  let h = 0
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0
  return Math.abs(h) % mod
}

export function AvatarStatus({
  src,
  name,
  role,
  status = 'none',
  size = 'md',
  showName = false,
  ringColor = 'var(--picks-surface, #08070d)',
  outerRing = false,
  className,
}: AvatarStatusProps) {
  const dims = SIZES[size]
  const [imgFailed, setImgFailed] = React.useState(false)
  const showImage = !!src && !imgFailed
  const palette = FALLBACK_PALETTES[hashIndex(name || 'x', FALLBACK_PALETTES.length)]

  return (
    <div
      className={cn('inline-flex items-center', className)}
      style={{ gap: showName ? dims.gap : 0 }}
    >
      {/* Outer wrapper is positioning context — NO overflow so the status
          dot can extend past the rounded edge of the inner clip-box. */}
      <span
        className={cn(
          'relative inline-block shrink-0 select-none',
          outerRing && 'rounded-full ring-2 ring-picks-fg/15 ring-offset-2 ring-offset-[var(--ring-bg,transparent)]',
        )}
        style={{
          width: dims.box,
          height: dims.box,
          ['--ring-bg' as string]: ringColor,
        }}
        aria-label={name}
      >
        {/* Inner clip-box — this is what owns overflow:hidden so the
            avatar image (or initials gradient) is rounded. */}
        <span
          className="relative inline-flex h-full w-full items-center justify-center overflow-hidden rounded-full"
          style={{
            background: showImage
              ? '#1a1a1f'
              : `linear-gradient(135deg, ${palette.from}, ${palette.to})`,
          }}
        >
          {showImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={src}
              alt={name}
              onError={() => setImgFailed(true)}
              className="h-full w-full object-cover"
              draggable={false}
            />
          ) : (
            <span
              className="font-semibold tracking-tight text-picks-fg/95"
              style={{ fontSize: dims.textPx, lineHeight: 1 }}
            >
              {initialsFrom(name)}
            </span>
          )}
        </span>

        {/* Status dot — lives OUTSIDE the clip-box so it can extend
            past the avatar's rounded edge with its own ring. */}
        {status !== 'none' && (
          <span
            aria-label={status}
            className="absolute block rounded-full"
            style={{
              width: dims.dot,
              height: dims.dot,
              right: 0,
              bottom: 0,
              background: STATE_COLORS[status],
              boxShadow: `0 0 0 2px ${ringColor}`,
            }}
          >
            {status === 'online' && (
              <motion.span
                aria-hidden
                className="absolute inset-0 rounded-full"
                style={{ background: STATE_COLORS.online }}
                animate={{ scale: [1, 1.9], opacity: [0.55, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeOut' }}
              />
            )}
          </span>
        )}
      </span>

      {showName && (
        <span className="flex min-w-0 flex-col leading-tight">
          <span
            className="truncate font-display font-semibold tracking-tight text-picks-fg"
            style={{ fontSize: dims.textPx }}
          >
            {name}
          </span>
          {role && (
            <span
              className="truncate text-picks-fg/55"
              style={{ fontSize: dims.textPx - 2 }}
            >
              {role}
            </span>
          )}
        </span>
      )}
    </div>
  )
}
