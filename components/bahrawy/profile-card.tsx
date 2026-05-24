'use client'

/**
 * <ProfileCard />  —  Apple Design System polish
 *
 * The hover-or-click preview card every social/collab UI shows when
 * you tap an avatar — GitHub-style, restyled with Apple's vibrancy +
 * spring physics: vivid SF accent gradient header, generous 28px
 * corner radius, vibrancy `backdrop-blur-2xl`, multi-layer shadows
 * (close drop + ambient + accent glow on hover), pill buttons with
 * 0.96 press feedback, soft hover-lift, and Apple-style spring
 * (stiffness ~420 / damping ~32) on mount.
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
  /** Card width. Default 328. */
  width?: number
  className?: string
}

// SF-style vivid system colors for status + palette
const STATE_COLORS: Record<Exclude<ProfileCardStatus, 'none'>, string> = {
  online: '#30D158',
  away: '#FF9F0A',
  busy: '#FF453A',
  offline: '#8E8E93',
}

// Apple-y vivid gradient stops (SF accent + iOS wallpaper inspirations)
const PALETTES: { from: string; to: string; glow: string }[] = [
  { from: '#5E5CE6', to: '#BF5AF2', glow: '94, 92, 230' },   // indigo → purple
  { from: '#0A84FF', to: '#5E5CE6', glow: '10, 132, 255' },  // blue → indigo
  { from: '#FF375F', to: '#FF9F0A', glow: '255, 55, 95' },   // pink → amber
  { from: '#FF9F0A', to: '#FFD60A', glow: '255, 159, 10' },  // amber → yellow
  { from: '#30D158', to: '#0A84FF', glow: '48, 209, 88' },   // green → blue
  { from: '#FF453A', to: '#BF5AF2', glow: '255, 69, 58' },   // red → purple
  { from: '#64D2FF', to: '#5E5CE6', glow: '100, 210, 255' }, // sky → indigo
]

// Apple-style spring used throughout (snappy but soft tail)
const APPLE_SPRING = { type: 'spring' as const, stiffness: 420, damping: 32, mass: 0.6 }

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
  width = 328,
  className,
}: ProfileCardProps) {
  const [imgFailed, setImgFailed] = React.useState(false)
  const [hover, setHover] = React.useState(false)
  const showImage = !!avatarSrc && !imgFailed
  const palette = PALETTES[hashIndex(name || 'x', PALETTES.length)]
  const grad =
    headerGradient ?? ([palette.from, palette.to] as [string, string])
  const glow = palette.glow
  const isFollowed = primaryAction?.followed ?? false

  return (
    <motion.div
      onHoverStart={() => setHover(true)}
      onHoverEnd={() => setHover(false)}
      initial={{ opacity: 0, y: 12, scale: 0.94 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={APPLE_SPRING}
      whileHover={{ y: -2 }}
      className={cn(
        'relative isolate overflow-hidden rounded-[28px] border border-white/[0.08] backdrop-blur-2xl',
        // Vibrancy: layered translucent backgrounds
        'bg-[linear-gradient(180deg,rgba(28,28,30,0.92)_0%,rgba(18,18,20,0.96)_100%)]',
        className,
      )}
      style={{
        width,
        // Apple multi-layer shadow: close + ambient + dynamic glow
        boxShadow: hover
          ? `0 1px 0 rgba(255,255,255,0.06) inset,
             0 12px 32px -8px rgba(0,0,0,0.55),
             0 28px 64px -16px rgba(0,0,0,0.4),
             0 0 0 0.5px rgba(255,255,255,0.04),
             0 0 60px -10px rgba(${glow}, 0.45)`
          : `0 1px 0 rgba(255,255,255,0.05) inset,
             0 10px 28px -10px rgba(0,0,0,0.5),
             0 24px 56px -20px rgba(0,0,0,0.35),
             0 0 0 0.5px rgba(255,255,255,0.04)`,
        transition: 'box-shadow 320ms cubic-bezier(0.22, 1, 0.36, 1)',
      }}
    >
      {/* Header strip — vivid SF gradient + soft top sheen */}
      <div
        className="relative h-24"
        style={{
          backgroundImage: `linear-gradient(135deg, ${grad[0]} 0%, ${grad[1]} 100%)`,
        }}
      >
        {/* Specular highlight at top */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-1/2"
          style={{
            background:
              'linear-gradient(180deg, rgba(255,255,255,0.28) 0%, rgba(255,255,255,0) 100%)',
            mixBlendMode: 'soft-light',
          }}
        />
        {/* Diagonal sheen */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'linear-gradient(115deg, rgba(255,255,255,0.18) 0%, transparent 40%, transparent 60%, rgba(255,255,255,0.08) 100%)',
            mixBlendMode: 'overlay',
          }}
        />
        {/* Subtle grain for material feel */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.12]"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
          }}
        />
      </div>

      {/* Avatar overlapping the seam */}
      <div className="relative px-6">
        <div className="absolute -top-10 left-6">
          <motion.span
            className="relative inline-block"
            style={{ width: 72, height: 72 }}
            whileHover={{ scale: 1.04 }}
            transition={APPLE_SPRING}
          >
            <span
              className="relative inline-flex h-full w-full items-center justify-center overflow-hidden rounded-full ring-[5px]"
              style={{
                background: showImage
                  ? '#1c1c1e'
                  : `linear-gradient(135deg, ${palette.from}, ${palette.to})`,
                ['--tw-ring-color' as string]: '#0a0a0c',
                boxShadow: `0 8px 24px -8px rgba(${glow}, 0.55), 0 4px 12px rgba(0,0,0,0.5)`,
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
                <span
                  className="text-[22px] font-semibold tracking-tight text-white"
                  style={{ textShadow: '0 1px 2px rgba(0,0,0,0.25)' }}
                >
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
                  boxShadow: `0 0 0 3.5px #0a0a0c, 0 0 12px -2px ${STATE_COLORS[status]}`,
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
          </motion.span>
        </div>

        {/* Spacer to push content below the avatar */}
        <div style={{ height: 40 }} />

        {/* Name + handle */}
        <div className="min-w-0">
          <h3 className="truncate text-[17px] font-semibold tracking-[-0.018em] text-white">
            {name}
          </h3>
          {handle && (
            <p className="mt-0.5 truncate text-[13px] tracking-tight text-white/45">
              {handle}
            </p>
          )}
          {role && (
            <p className="mt-1.5 truncate text-[13px] font-medium tracking-tight text-white/75">
              {role}
            </p>
          )}
        </div>

        {/* Bio */}
        {bio && (
          <p className="mt-3.5 text-[13px] leading-[1.55] tracking-tight text-white/65">
            {bio}
          </p>
        )}

        {/* Meta rows */}
        {meta && meta.length > 0 && (
          <ul className="mt-3.5 space-y-1.5">
            {meta.map((m, i) => (
              <li
                key={i}
                className="flex items-center gap-2 text-[12px] tracking-tight text-white/55"
              >
                {m.icon && (
                  <span className="shrink-0 text-white/40 [&>svg]:h-3.5 [&>svg]:w-3.5">
                    {m.icon}
                  </span>
                )}
                <span className="truncate">{m.value}</span>
              </li>
            ))}
          </ul>
        )}

        {/* Stats — vibrancy pill grid */}
        {stats && stats.length > 0 && (
          <div
            className="mt-4 flex overflow-hidden rounded-2xl border border-white/[0.06] backdrop-blur-xl"
            style={{
              background:
                'linear-gradient(180deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.02) 100%)',
            }}
          >
            {stats.map((s, i) => (
              <React.Fragment key={i}>
                {i > 0 && (
                  <span
                    aria-hidden
                    className="my-2 w-px bg-white/[0.06]"
                  />
                )}
                <div className="flex-1 px-3 py-2.5 text-center">
                  <p className="text-[15px] font-semibold tracking-tight tabular-nums text-white">
                    {typeof s.value === 'number' ? s.value.toLocaleString() : s.value}
                  </p>
                  <p className="mt-0.5 text-[10px] font-medium uppercase tracking-[0.14em] text-white/40">
                    {s.label}
                  </p>
                </div>
              </React.Fragment>
            ))}
          </div>
        )}

        {/* Actions — Apple pill buttons with press feedback */}
        {(primaryAction || secondaryAction) && (
          <div className="mb-5 mt-4 flex items-center gap-2">
            {primaryAction && (
              <motion.button
                type="button"
                onClick={primaryAction.onClick}
                whileTap={{ scale: 0.96 }}
                transition={APPLE_SPRING}
                className={cn(
                  'inline-flex flex-1 items-center justify-center gap-1.5 rounded-full py-2 text-[13px] font-semibold tracking-tight transition-colors',
                  isFollowed
                    ? 'border border-white/15 bg-white/[0.06] text-white hover:bg-white/[0.1]'
                    : 'border border-white/10 text-black hover:brightness-105',
                )}
                style={
                  isFollowed
                    ? undefined
                    : {
                        background:
                          'linear-gradient(180deg, #FFFFFF 0%, #E8E8EA 100%)',
                        boxShadow:
                          '0 1px 0 rgba(255,255,255,0.7) inset, 0 6px 14px -6px rgba(0,0,0,0.5)',
                      }
                }
              >
                {isFollowed && <Check className="h-3 w-3" strokeWidth={3} />}
                {primaryAction.label}
              </motion.button>
            )}
            {secondaryAction && (
              <motion.button
                type="button"
                onClick={secondaryAction.onClick}
                whileTap={{ scale: 0.96 }}
                transition={APPLE_SPRING}
                className="inline-flex flex-1 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.04] py-2 text-[13px] font-medium tracking-tight text-white/90 backdrop-blur-xl transition-colors hover:bg-white/[0.08]"
              >
                {secondaryAction.label}
              </motion.button>
            )}
          </div>
        )}
      </div>
    </motion.div>
  )
}

// Re-export common icons consumers will use in `meta`.
export const ProfileCardIcons = { MapPin, Calendar, Link: LinkIcon }
