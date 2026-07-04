'use client'

/**
 * <TwitterCard />
 *
 * A beautiful tweet-style social post card with a dark theme. Supports content
 * parsing (mentions, hashtags, URLs), verified badges, metric formatting,
 * image attachments, and platform branding (X / Twitter).
 *
 * Uses Framer Motion for entrance, hover, and stagger animations.
 */

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, Repeat2, MessageCircle, Eye } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  springSnappy,
  springGentle,
  fadeUp,
  scaleIn,
  staggerContainer,
} from '@/lib/motion'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface TwitterCardProps {
  name: string
  handle: string
  avatar?: string
  verified?: 'blue' | 'gold' | 'gray' | false
  content: string
  image?: string
  timestamp?: string | Date
  platform?: 'twitter' | 'x'
  likes?: number
  retweets?: number
  replies?: number
  views?: number
  href?: string
  showMore?: boolean
  className?: string
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatMetric(n: number): string {
  if (n >= 1_000_000) {
    const val = n / 1_000_000
    return val % 1 === 0 ? `${val}M` : `${parseFloat(val.toFixed(1))}M`
  }
  if (n >= 1_000) {
    const val = n / 1_000
    return val % 1 === 0 ? `${val}K` : `${parseFloat(val.toFixed(1))}K`
  }
  return String(n)
}

function formatTimestamp(ts: string | Date): string {
  const date = typeof ts === 'string' ? new Date(ts) : ts
  if (isNaN(date.getTime())) return String(ts)

  const hours = date.getHours()
  const minutes = date.getMinutes()
  const ampm = hours >= 12 ? 'PM' : 'AM'
  const h = hours % 12 || 12
  const m = minutes.toString().padStart(2, '0')

  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
  ]
  const month = months[date.getMonth()]
  const day = date.getDate()
  const year = date.getFullYear()

  return `${h}:${m} ${ampm} · ${month} ${day}, ${year}`
}

/** Parse tweet content and return React nodes with highlighted mentions, hashtags, and URLs. */
function parseContent(text: string): React.ReactNode[] {
  // Match @mentions, #hashtags, and URLs
  const regex = /(@\w+)|(#\w+)|(https?:\/\/[^\s]+)/g
  const parts: React.ReactNode[] = []
  let lastIndex = 0
  let match: RegExpExecArray | null

  while ((match = regex.exec(text)) !== null) {
    // Push preceding plain text
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index))
    }

    const value = match[0]

    if (match[1]) {
      // @mention
      parts.push(
        <span key={match.index} className="text-blue-400 hover:underline cursor-pointer">
          {value}
        </span>
      )
    } else if (match[2]) {
      // #hashtag
      parts.push(
        <span key={match.index} className="text-blue-400 hover:underline cursor-pointer">
          {value}
        </span>
      )
    } else if (match[3]) {
      // URL
      parts.push(
        <a
          key={match.index}
          href={value}
          target="_blank"
          rel="noopener noreferrer"
          className="relative z-[2] text-blue-400 hover:underline cursor-pointer"
          onClick={(e) => e.stopPropagation()}
        >
          {value.replace(/^https?:\/\//, '').slice(0, 30)}
          {value.replace(/^https?:\/\//, '').length > 30 ? '...' : ''}
        </a>
      )
    }

    lastIndex = match.index + value.length
  }

  // Push remaining text
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex))
  }

  return parts
}

// ---------------------------------------------------------------------------
// SVG Icons
// ---------------------------------------------------------------------------

function XLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  )
}

function TwitterBird({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M23.643 4.937c-.835.37-1.732.62-2.675.733.962-.576 1.7-1.49 2.048-2.578-.9.534-1.897.922-2.958 1.13-.85-.904-2.06-1.47-3.4-1.47-2.572 0-4.658 2.086-4.658 4.66 0 .364.042.718.12 1.06-3.873-.195-7.304-2.05-9.602-4.868-.4.69-.63 1.49-.63 2.342 0 1.616.823 3.043 2.072 3.878-.764-.025-1.482-.234-2.11-.583v.06c0 2.257 1.605 4.14 3.737 4.568-.392.106-.803.162-1.227.162-.3 0-.593-.028-.877-.082.593 1.85 2.313 3.198 4.352 3.234-1.595 1.25-3.604 1.995-5.786 1.995-.376 0-.747-.022-1.112-.065 2.062 1.323 4.51 2.093 7.14 2.093 8.57 0 13.255-7.098 13.255-13.254 0-.2-.005-.402-.014-.602.91-.658 1.7-1.477 2.323-2.41z" />
    </svg>
  )
}

function VerifiedBadge({ variant }: { variant: 'blue' | 'gold' | 'gray' }) {
  const colors = {
    blue: 'text-blue-400',
    gold: 'text-amber-400',
    gray: 'text-gray-400',
  }

  return (
    <motion.svg
      viewBox="0 0 22 22"
      className={cn('h-[18px] w-[18px] shrink-0', colors[variant])}
      fill="currentColor"
      aria-label="Verified"
      {...scaleIn}
      transition={springSnappy}
    >
      <path d="M20.396 11c-.018-.646-.215-1.275-.57-1.816-.354-.54-.852-.972-1.438-1.246.223-.607.27-1.264.14-1.897-.131-.634-.437-1.218-.882-1.687-.47-.445-1.053-.75-1.687-.882-.633-.13-1.29-.083-1.897.14-.273-.587-.704-1.086-1.245-1.44S11.647 1.62 11 1.604c-.646.017-1.273.213-1.813.568s-.969.855-1.24 1.44c-.608-.223-1.267-.272-1.902-.14-.635.13-1.22.436-1.69.882-.445.47-.749 1.055-.878 1.69-.13.635-.08 1.293.144 1.896-.587.274-1.087.705-1.443 1.245-.356.54-.555 1.17-.574 1.817.02.647.218 1.276.574 1.817.356.54.856.972 1.443 1.245-.224.604-.274 1.26-.144 1.896.13.636.433 1.221.878 1.69.47.446 1.055.752 1.69.883.635.13 1.294.083 1.902-.141.272.587.702 1.088 1.24 1.443.54.354 1.167.551 1.813.568.647-.017 1.277-.214 1.817-.568s.972-.856 1.245-1.443c.604.224 1.262.272 1.896.141.636-.13 1.22-.436 1.69-.882.445-.47.75-1.055.88-1.69.131-.636.083-1.293-.139-1.897.586-.274 1.084-.705 1.439-1.246.354-.54.551-1.17.569-1.816zM9.662 14.85l-3.429-3.428 1.293-1.302 2.072 2.072 4.4-4.794 1.347 1.246z" />
    </motion.svg>
  )
}

// ---------------------------------------------------------------------------
// Avatar
// ---------------------------------------------------------------------------

function Avatar({
  src,
  name,
}: {
  src?: string
  name: string
}) {
  const [imgError, setImgError] = React.useState(false)

  const initial = name.charAt(0).toUpperCase()

  // Deterministic background color based on name
  const colors = [
    'bg-blue-600',
    'bg-emerald-600',
    'bg-purple-600',
    'bg-rose-600',
    'bg-amber-600',
    'bg-cyan-600',
    'bg-indigo-600',
    'bg-pink-600',
  ]
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  const colorClass = colors[Math.abs(hash) % colors.length]

  if (src && !imgError) {
    return (
      <motion.img
        src={src}
        alt={name}
        className="h-12 w-12 shrink-0 rounded-full object-cover"
        whileHover={{ scale: 1.08 }}
        transition={springSnappy}
        onError={() => setImgError(true)}
      />
    )
  }

  return (
    <motion.div
      className={cn(
        'flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-base font-bold text-white',
        colorClass,
      )}
      whileHover={{ scale: 1.08 }}
      transition={springSnappy}
    >
      {initial}
    </motion.div>
  )
}

// ---------------------------------------------------------------------------
// Metric item
// ---------------------------------------------------------------------------

interface MetricItemProps {
  icon: React.ReactNode
  value: number
  hoverColor: string
}

function MetricItem({ icon, value, hoverColor }: MetricItemProps) {
  return (
    <motion.div
      className={cn(
        'group/metric flex items-center gap-1.5 text-[13px] text-white/40 transition-colors',
        hoverColor,
      )}
      variants={fadeUp}
      whileHover={{ scale: 1.15 }}
      transition={springSnappy}
    >
      {icon}
      <span>{formatMetric(value)}</span>
    </motion.div>
  )
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function TwitterCard({
  name,
  handle,
  avatar,
  verified = false,
  content,
  image,
  timestamp,
  platform = 'x',
  likes,
  retweets,
  replies,
  views,
  href,
  showMore: showMoreProp,
  className,
}: TwitterCardProps) {
  const [expanded, setExpanded] = React.useState(false)
  const [imageLoaded, setImageLoaded] = React.useState(false)

  const shouldShowMore = showMoreProp ?? content.length > 280
  const displayContent = shouldShowMore && !expanded
    ? content.slice(0, 280)
    : content

  const hasMetrics =
    likes !== undefined ||
    retweets !== undefined ||
    replies !== undefined ||
    views !== undefined

  const platformLabel = platform === 'twitter' ? 'Twitter' : 'X'

  return (
    <motion.div
      className={cn(
        'relative overflow-hidden rounded-xl border border-white/[0.08] bg-black p-4',
        href && 'cursor-pointer',
        className,
      )}
      {...fadeUp}
      transition={springGentle}
      whileHover={href ? { scale: 1.01, y: -2 } : undefined}
    >
      {/* Stretched link — covers the card without nesting interactive
          elements (show more, inline links) inside an <a>. Interactive
          children sit above it via z-index. */}
      {href && (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`View post by ${name} on ${platformLabel}`}
          className="absolute inset-0 z-[1] rounded-xl"
        />
      )}
      {/* Header: avatar, name, handle, logo */}
      <div className="flex items-start gap-3">
        <Avatar src={avatar} name={name} />

        <div className="min-w-0 flex-1">
          <div className="flex min-w-0 items-center gap-1">
            <span className="min-w-0 truncate text-[15px] font-bold text-white">
              {name}
            </span>
            {verified && <VerifiedBadge variant={verified} />}
          </div>
          <div className="min-w-0 truncate text-[13px] leading-tight text-white/50">
            @{handle}
          </div>
        </div>

        <div className="shrink-0 text-white/40">
          {platform === 'twitter' ? (
            <TwitterBird className="h-5 w-5" />
          ) : (
            <XLogo className="h-5 w-5" />
          )}
        </div>
      </div>

      {/* Content */}
      <div className="mt-3 text-[15px] leading-relaxed text-white/90 whitespace-pre-wrap">
        {parseContent(displayContent)}
        {shouldShowMore && !expanded && (
          <span className="text-white/40">...</span>
        )}
      </div>

      {/* Show more toggle */}
      <AnimatePresence>
        {shouldShowMore && (
          <motion.button
            type="button"
            className="relative z-[2] mt-1 text-[15px] font-medium text-blue-400 hover:underline"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              setExpanded((prev) => !prev)
            }}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={springGentle}
          >
            {expanded ? 'Show less' : 'Show more'}
          </motion.button>
        )}
      </AnimatePresence>

      {/* Image */}
      {image && (
        <div className="relative mt-3 overflow-hidden rounded-xl">
          <motion.img
            src={image}
            alt="Tweet attachment"
            className="w-full object-cover"
            initial={{ opacity: 0, scale: 1.02 }}
            animate={
              imageLoaded
                ? { opacity: 1, scale: 1 }
                : { opacity: 0, scale: 1.02 }
            }
            transition={springGentle}
            onLoad={() => setImageLoaded(true)}
          />
        </div>
      )}

      {/* Timestamp */}
      {timestamp && (
        <div className="mt-3 text-[13px] text-white/40">
          {formatTimestamp(timestamp)} · {platformLabel}
        </div>
      )}

      {/* Metrics */}
      {hasMetrics && (
        <>
          <div className="mt-3 border-t border-white/[0.08]" />
          <motion.div
            className="mt-3 flex items-center gap-6"
            variants={staggerContainer}
            initial="initial"
            animate="animate"
          >
            {replies !== undefined && (
              <MetricItem
                icon={
                  <MessageCircle className="h-4 w-4 transition-colors group-hover/metric:text-blue-400" />
                }
                value={replies}
                hoverColor="hover:text-blue-400"
              />
            )}
            {retweets !== undefined && (
              <MetricItem
                icon={
                  <Repeat2 className="h-4 w-4 transition-colors group-hover/metric:text-green-500" />
                }
                value={retweets}
                hoverColor="hover:text-green-500"
              />
            )}
            {likes !== undefined && (
              <MetricItem
                icon={
                  <Heart className="h-4 w-4 transition-colors group-hover/metric:text-rose-500" />
                }
                value={likes}
                hoverColor="hover:text-rose-500"
              />
            )}
            {views !== undefined && (
              <MetricItem
                icon={
                  <Eye className="h-4 w-4 transition-colors group-hover/metric:text-white/60" />
                }
                value={views}
                hoverColor="hover:text-white/60"
              />
            )}
          </motion.div>
        </>
      )}
    </motion.div>
  )
}
