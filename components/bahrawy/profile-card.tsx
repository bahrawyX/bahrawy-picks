'use client'

/**
 * <ProfileCard />
 *
 * The hover-or-click preview card every social/collab UI shows when
 * you tap an avatar — GitHub-style. Gradient header strip → avatar
 * overlapping the seam → name + handle + role → optional bio → stats
 * row (followers / following / starred / etc.) → primary action
 * button. Built as a self-contained card so you can drop it inside a
 * Popover, Tooltip, or just render inline.
 *
 * Status dot on the avatar uses the same logic as <AvatarStatus />.
 */

import * as React from 'react'
import { motion } from 'framer-motion'
import { MapPin, Calendar, Link as LinkIcon, Check } from 'lucide-react'
import { cn } from '@/lib/utils'

export type ProfileCardStatus = 'online' | 'away' | 'busy' | 'offline' | 'none'

export interface ProfileCardStat {
  label: string
  value: number | string
}

export interface ProfileCardProps {
  /** Avatar image URL. Initials fallback if omitted/failed. */
  avatarSrc?: string
  /** Display name. */
  name: string
  /** Handle (e.g. '@leerob'). */
  handle?: string
  /** Role / title (e.g. "VP of Product · Vercel"). */
  role?: string
  /** Bio paragraph. */
  bio?: React.ReactNode
  /** Optional meta row — { icon, value } pairs (e.g. location, link, joined). */
  meta?: { icon?: React.ReactNode; value: React.ReactNode }[]
  /** Stat numbers shown below the bio. */
  stats?: ProfileCardStat[]
  /** Avatar status dot. */
  status?: ProfileCardStatus
  /** Header strip color stops (top of card). */
  headerGradient?: [string, string]
  /** Primary action — usually Follow. */
  primaryAction?: { label: string; onClick?: () => void; followed?: boolean }
  /** Secondary action — usually Message / View Profile. */
  secondaryAction?: { label: string; onClick?: () => void }
  /** Card width. Default 320. */
  width?: number
  className?: string
}

const STATE_COLORS: Record<Exclude<ProfileCardStatus, 'none'>, string> = {
  online: '#34D399',
  away: '#FBBF24',
  busy: '#FB7185',
  offline: '#71717A',
}

const PALETTES: { from: string; to: string }[] = [
  { from: '#A78BFA', to: '#7C3AED' },
  { from: '#22D3EE', to: '#0891B2' },
  { from: '#F472B6', to: '#DB2777' },
  { from: '#FBBF24', to: '#D97706' },
  { from: '#34D399', to: '#059669' },
  { from: '#FB7185', to: '#E11D48' },
  { from: '#60A5FA', to: '#2563EB' },
]

function initialsFrom(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (!parts.length) return '?'
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}
function hashIndex(s: string, mod: number) {
  let h = 0
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0
  return Math.abs(h) % mod
}

export function ProfileCard({
  avatarSrc,
  name,
  handle,
  role,
  bio,
  meta,
  stats,
  status = 'none',
  headerGradient,
  primaryAction,
  secondaryAction,
  width = 320,
  className,
}: ProfileCardProps) {
  const [imgFailed, setImgFailed] = React.useState(false)
  const showImage = !!avatarSrc && !imgFailed
  const palette = PALETTES[hashIndex(name || 'x', PALETTES.length)]
  const grad =
    headerGradient ??
    ([palette.from, palette.to] as [string, string])
  const isFollowed = primaryAction?.followed ?? false

  return (
    <motion.div
      initial={{ opacity: 0, y: 6, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        'overflow-hidden rounded-2xl border border-white/10 bg-zinc-950/95 shadow-2xl shadow-black/40 backdrop-blur',
        className,
      )}
      style={{ width }}
    >
      {/* Header strip */}
      <div
        className="relative h-20"
        style={{
          background: `linear-gradient(120deg, ${grad[0]} 0%, ${grad[1]} 100%)`,
        }}
      >
        {/* Subtle sheen */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-30"
          style={{
            background:
              'linear-gradient(115deg, rgba(255,255,255,0.2) 0%, transparent 35%, transparent 65%, rgba(255,255,255,0.06) 100%)',
            mixBlendMode: 'overlay',
          }}
        />
      </div>

      {/* Avatar overlapping the seam */}
      <div className="relative px-5">
        <div className="absolute -top-9 left-5">
          <span className="relative inline-block" style={{ width: 64, height: 64 }}>
            <span
              className="relative inline-flex h-full w-full items-center justify-center overflow-hidden rounded-full ring-4"
              style={{
                background: showImage
                  ? '#1a1a1f'
                  : `linear-gradient(135deg, ${palette.from}, ${palette.to})`,
                ['--tw-ring-color' as string]: '#0a0a0c',
              }}
            >
              {showImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={avatarSrc}
                  alt={name}
                  onError={() => setImgFailed(true)}
                  className="h-full w-full object-cover"
                  draggable={false}
                />
              ) : (
                <span className="text-[20px] font-bold tracking-tight text-white/95">
                  {initialsFrom(name)}
                </span>
              )}
            </span>
            {status !== 'none' && (
              <span
                aria-label={status}
                className="absolute bottom-0 right-0 block rounded-full"
                style={{
                  width: 14,
                  height: 14,
                  background: STATE_COLORS[status],
                  boxShadow: '0 0 0 3px #0a0a0c',
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
        </div>

        {/* Spacer to push content below the avatar */}
        <div style={{ height: 36 }} />

        {/* Name + handle */}
        <div className="min-w-0">
          <h3 className="truncate text-[15px] font-semibold tracking-tight text-white">
            {name}
          </h3>
          {handle && (
            <p className="truncate text-[12px] text-white/45">{handle}</p>
          )}
          {role && (
            <p className="mt-1 truncate text-[12px] text-white/70">{role}</p>
          )}
        </div>

        {/* Bio */}
        {bio && (
          <p className="mt-3 text-[12.5px] leading-relaxed text-white/65">
            {bio}
          </p>
        )}

        {/* Meta rows */}
        {meta && meta.length > 0 && (
          <ul className="mt-3 space-y-1">
            {meta.map((m, i) => (
              <li
                key={i}
                className="flex items-center gap-1.5 text-[11.5px] text-white/55"
              >
                {m.icon && (
                  <span className="shrink-0 [&>svg]:h-3 [&>svg]:w-3">{m.icon}</span>
                )}
                <span className="truncate">{m.value}</span>
              </li>
            ))}
          </ul>
        )}

        {/* Stats */}
        {stats && stats.length > 0 && (
          <div className="mt-4 flex divide-x divide-white/[0.06] rounded-lg border border-white/[0.06] bg-white/[0.02]">
            {stats.map((s, i) => (
              <div
                key={i}
                className="flex-1 px-3 py-2 text-center first:rounded-l-lg last:rounded-r-lg"
              >
                <p className="font-mono text-[14px] font-semibold tabular-nums text-white">
                  {typeof s.value === 'number' ? s.value.toLocaleString() : s.value}
                </p>
                <p className="text-[10px] uppercase tracking-[0.18em] text-white/40">
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Actions */}
        {(primaryAction || secondaryAction) && (
          <div className="mt-4 mb-4 flex items-center gap-2">
            {primaryAction && (
              <button
                type="button"
                onClick={primaryAction.onClick}
                className={cn(
                  'inline-flex flex-1 items-center justify-center gap-1.5 rounded-full py-1.5 text-[12px] font-semibold tracking-tight transition-colors',
                  isFollowed
                    ? 'border border-white/15 bg-white/[0.04] text-white/85 hover:bg-white/[0.08]'
                    : 'bg-white text-black hover:bg-white/90',
                )}
              >
                {isFollowed && <Check className="h-3 w-3" strokeWidth={3} />}
                {primaryAction.label}
              </button>
            )}
            {secondaryAction && (
              <button
                type="button"
                onClick={secondaryAction.onClick}
                className="inline-flex flex-1 items-center justify-center rounded-full border border-white/15 bg-white/[0.04] py-1.5 text-[12px] font-medium text-white/85 transition-colors hover:bg-white/[0.08]"
              >
                {secondaryAction.label}
              </button>
            )}
          </div>
        )}
      </div>
    </motion.div>
  )
}

// Re-export common icons consumers will use in `meta`.
export const ProfileCardIcons = { MapPin, Calendar, Link: LinkIcon }
