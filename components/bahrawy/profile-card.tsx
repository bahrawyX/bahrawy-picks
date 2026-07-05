'use client'

/**
 * <ProfileCard />  —  Apple / Emil Kowalski restraint
 *
 * The hover-or-click preview card every social/collab UI shows when
 * you tap an avatar — GitHub-style, restyled with restrained Apple
 * vibrancy and spring physics: a quiet vibrancy-gray header by
 * default (vivid gradient is opt-in via `headerGradient`), 28px corner
 * radius, hairline 1px borders, flat refined shadows, and Apple-style
 * spring (stiffness ~420 / damping ~32) on mount.
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
  /**
   * Header strip background. Pass a CSS background string (any
   * gradient or solid color) to opt in to a vivid header. Defaults
   * to a restrained vibrancy gray.
   */
  headerGradient?: string | [string, string]
  /** Primary action — usually Follow. */
  primaryAction?: { label: string; onClick?: () => void; followed?: boolean }
  /** Secondary action — usually Message / View Profile. */
  secondaryAction?: { label: string; onClick?: () => void }
  /** Card width. Default 328. */
  width?: number
  className?: string
}

// Restrained SF status colors
const STATE_COLORS: Record<Exclude<ProfileCardStatus, 'none'>, string> = {
  online: '#30D158',
  away: '#FF9F0A',
  busy: '#FF453A',
  offline: '#8E8E93',
}

// Default header: a vibrancy-gray panel, not a vivid gradient.
const DEFAULT_HEADER =
  'linear-gradient(180deg, rgba(40,40,45,0.9), rgba(28,28,32,0.95))'

// Apple-style spring used throughout (snappy but soft tail)
const APPLE_SPRING = { type: 'spring' as const, stiffness: 420, damping: 32, mass: 0.6 }

function initialsFrom(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (!parts.length) return '?'
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

function resolveHeader(input?: string | [string, string]): string {
  if (!input) return DEFAULT_HEADER
  if (typeof input === 'string') return input
  // Two-stop legacy tuple — preserve old call sites that passed [from, to].
  return `linear-gradient(135deg, ${input[0]} 0%, ${input[1]} 100%)`
}

export const ProfileCard = React.forwardRef<HTMLDivElement, ProfileCardProps>(
  (
    {
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
      width = 328,
      className,
    },
    ref,
  ) => {
    const [imgFailed, setImgFailed] = React.useState(false)
    const showImage = !!avatarSrc && !imgFailed
    const headerBackground = resolveHeader(headerGradient)
    const isFollowed = primaryAction?.followed ?? false

    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 12, scale: 0.94 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={APPLE_SPRING}
        className={cn(
          'relative isolate overflow-hidden rounded-[28px] border border-picks-fg/[0.08] backdrop-blur-2xl',
          'bg-[linear-gradient(180deg,rgba(28,28,30,0.92)_0%,rgba(18,18,20,0.96)_100%)]',
          className,
        )}
        style={{
          width,
          // Flat refined shadow. No accent glow, no dynamic morph.
          boxShadow:
            '0 10px 28px -10px rgba(0,0,0,0.5), 0 28px 64px -20px rgba(0,0,0,0.35)',
        }}
      >
        {/* Header strip — vibrancy gray by default, vivid only on opt-in */}
        <div
          className="relative h-24"
          style={{ background: headerBackground }}
        />

        {/* Avatar overlapping the seam */}
        <div className="relative px-6">
          <div className="absolute -top-10 left-6">
            <span
              className="relative inline-block"
              style={{ width: 72, height: 72 }}
            >
              <span
                className="relative inline-flex h-full w-full items-center justify-center overflow-hidden rounded-full ring-[3px]"
                style={{
                  background: showImage
                    ? '#1c1c1e'
                    : 'linear-gradient(135deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))',
                  ['--tw-ring-color' as string]: 'var(--picks-surface, #0a0a0c)',
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
                  <span className="text-[22px] font-semibold tracking-tight text-picks-fg">
                    {initialsFrom(name)}
                  </span>
                )}
              </span>
              {status !== 'none' && (
                <span
                  aria-label={status}
                  className="absolute bottom-0.5 right-0.5 block rounded-full"
                  style={{
                    width: 16,
                    height: 16,
                    background: STATE_COLORS[status],
                    boxShadow: '0 0 0 3.5px var(--picks-surface, #0a0a0c)',
                  }}
                >
                  {status === 'online' && (
                    <motion.span
                      aria-hidden
                      className="absolute inset-0 rounded-full"
                      style={{ background: STATE_COLORS.online }}
                      animate={{ scale: [1, 2], opacity: [0.55, 0] }}
                      transition={{ duration: 1.6, repeat: Infinity, ease: 'easeOut' }}
                    />
                  )}
                </span>
              )}
            </span>
          </div>

          {/* Spacer to push content below the avatar */}
          <div style={{ height: 40 }} />

          {/* Name + handle */}
          <div className="min-w-0">
            <h3 className="truncate font-display text-[18px] font-semibold leading-[1.15] tracking-[-0.02em] text-picks-fg">
              {name}
            </h3>
            {handle && (
              <p className="mt-0.5 truncate text-[12.5px] leading-[1.3] tracking-tight text-picks-fg/55">
                {handle}
              </p>
            )}
            {role && (
              <p className="mt-1.5 truncate text-[12.5px] font-medium leading-[1.3] tracking-tight text-picks-fg/75">
                {role}
              </p>
            )}
          </div>

          {/* Bio */}
          {bio && (
            <p className="mt-3.5 text-[12.5px] leading-[1.5] tracking-tight text-picks-fg/65">
              {bio}
            </p>
          )}

          {/* Meta rows */}
          {meta && meta.length > 0 && (
            <ul className="mt-3.5 space-y-1.5">
              {meta.map((m, i) => (
                <li
                  key={i}
                  className="flex items-center gap-2 text-[12.5px] leading-[1.4] tracking-tight text-picks-fg/55"
                >
                  {m.icon && (
                    <span className="shrink-0 text-picks-fg/40 [&>svg]:h-3.5 [&>svg]:w-3.5">
                      {m.icon}
                    </span>
                  )}
                  <span className="truncate">{m.value}</span>
                </li>
              ))}
            </ul>
          )}

          {/* Stats — hairline grid, no inner gradients */}
          {stats && stats.length > 0 && (
            <div className="mt-4 flex overflow-hidden rounded-2xl border border-picks-fg/[0.08]">
              {stats.map((s, i) => (
                <React.Fragment key={i}>
                  {i > 0 && (
                    <span
                      aria-hidden
                      className="my-2 w-px bg-picks-fg/[0.08]"
                    />
                  )}
                  <div className="flex-1 px-3 py-2.5 text-center">
                    <p className="text-[15px] font-semibold tracking-tight tabular-nums text-picks-fg">
                      {typeof s.value === 'number' ? s.value.toLocaleString() : s.value}
                    </p>
                    <p className="mt-0.5 text-[10px] font-medium uppercase tracking-[0.16em] text-picks-fg/40">
                      {s.label}
                    </p>
                  </div>
                </React.Fragment>
              ))}
            </div>
          )}

          {/* Actions — Apple pill buttons, plain backgrounds, color-only transitions */}
          {(primaryAction || secondaryAction) && (
            <div className="mb-5 mt-4 flex items-center gap-2">
              {primaryAction && (
                <button
                  type="button"
                  onClick={primaryAction.onClick}
                  className={cn(
                    'inline-flex flex-1 items-center justify-center gap-1.5 rounded-full py-2 text-[13px] font-semibold tracking-tight transition-colors',
                    isFollowed
                      ? 'border border-picks-fg/15 bg-picks-fg/[0.06] text-picks-fg hover:bg-picks-fg/[0.1]'
                      : 'border border-picks-fg/10 bg-picks-fg text-picks-surface hover:bg-picks-fg/90',
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
                  className="inline-flex flex-1 items-center justify-center rounded-full border border-picks-fg/[0.08] bg-picks-fg/[0.04] py-2 text-[13px] font-medium tracking-tight text-picks-fg/90 transition-colors hover:bg-picks-fg/[0.08]"
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
)
ProfileCard.displayName = 'ProfileCard'

// Re-export common icons consumers will use in `meta`.
export const ProfileCardIcons = { MapPin, Calendar, Link: LinkIcon }
