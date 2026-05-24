'use client'

/**
 * <BrowserWindow />
 *
 * Mac browser chrome (Big Sur / Sequoia accuracy) for framing
 * screenshots. Radial-gradient traffic lights with hover glyphs, a
 * vibrancy title bar, lucide nav buttons, and a centered URL bar with
 * a lock icon. Optional typing animation for the URL.
 */

import * as React from 'react'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, Lock, RotateCw } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface BrowserWindowProps {
  /** URL displayed in the address bar. */
  url?: string
  /** Type the URL out character-by-character on mount. */
  animateUrl?: boolean
  /** Chars/sec when animating. Default 32. */
  urlSpeed?: number
  /** Dark = Sequoia dark vibrancy. Light = Big Sur light vibrancy. */
  variant?: 'dark' | 'light'
  /** Show the back/forward/reload triplet. Default true on sm+. */
  showActions?: boolean
  /** Color the lock icon green to indicate a secure connection. */
  secure?: boolean
  /** Body height — passes through to the content slot. */
  height?: string | number
  /** Optional title shown centered in the chrome (e.g. "Inbox · Linear"). */
  title?: string
  children?: React.ReactNode
  className?: string
}

export function BrowserWindow({
  url,
  animateUrl = false,
  urlSpeed = 32,
  variant = 'dark',
  showActions = true,
  secure = false,
  height,
  title,
  children,
  className,
}: BrowserWindowProps) {
  const fullUrl = url ?? ''
  const [shownUrl, setShownUrl] = React.useState(animateUrl ? '' : fullUrl)
  const [typing, setTyping] = React.useState(animateUrl)

  React.useEffect(() => {
    if (!animateUrl) {
      setShownUrl(fullUrl)
      setTyping(false)
      return
    }
    setShownUrl('')
    setTyping(true)
    let i = 0
    let cancelled = false
    const ms = 1000 / urlSpeed
    const tick = () => {
      if (cancelled) return
      i++
      setShownUrl(fullUrl.slice(0, i))
      if (i < fullUrl.length) {
        const jitter = 1 + (Math.random() - 0.5) * 0.5
        timer = window.setTimeout(tick, ms * jitter)
      } else {
        setTyping(false)
      }
    }
    let timer = window.setTimeout(tick, 320)
    return () => {
      cancelled = true
      clearTimeout(timer)
    }
  }, [fullUrl, animateUrl, urlSpeed])

  const dark = variant === 'dark'

  return (
    <div
      className={cn(
        'overflow-hidden rounded-[12px] border backdrop-blur-xl',
        dark ? 'border-white/[0.06]' : 'border-black/[0.08]',
        className,
      )}
      style={{
        boxShadow:
          '0 1px 0 rgba(255,255,255,0.06) inset, 0 10px 28px -10px rgba(0,0,0,0.55), 0 28px 64px -18px rgba(0,0,0,0.45)',
      }}
    >
      {/* Window chrome — 36px tall */}
      <header
        className={cn(
          'group/chrome relative flex h-9 items-center gap-3 border-b px-3',
          dark ? 'border-white/[0.06]' : 'border-black/[0.08]',
        )}
        style={{
          background: dark
            ? 'linear-gradient(180deg, rgba(50,50,55,0.95), rgba(36,36,40,0.95))'
            : 'linear-gradient(180deg, rgba(245,245,247,0.95), rgba(228,228,232,0.95))',
        }}
      >
        {/* Traffic lights */}
        <div className="flex shrink-0 items-center gap-2">
          <TrafficLight color="red" />
          <TrafficLight color="yellow" />
          <TrafficLight color="green" />
        </div>

        {/* Back / forward / reload */}
        {showActions && (
          <div className="hidden shrink-0 items-center gap-0.5 sm:flex">
            <ChromeIconButton dark={dark}>
              <ChevronLeft className="h-3.5 w-3.5" strokeWidth={2.25} />
            </ChromeIconButton>
            <ChromeIconButton dark={dark}>
              <ChevronRight className="h-3.5 w-3.5" strokeWidth={2.25} />
            </ChromeIconButton>
            <ChromeIconButton dark={dark}>
              <RotateCw className="h-3.5 w-3.5" strokeWidth={2.25} />
            </ChromeIconButton>
          </div>
        )}

        {/* URL bar — centered */}
        <div className="flex min-w-0 flex-1 justify-center">
          <div
            className={cn(
              'flex h-6 w-full max-w-[60%] items-center gap-1.5 rounded-md border px-3 backdrop-blur-md',
              dark
                ? 'border-white/[0.06] bg-black/30'
                : 'border-black/[0.08] bg-white',
            )}
          >
            <Lock
              className={cn(
                'h-2.5 w-2.5 shrink-0',
                secure
                  ? dark
                    ? 'text-emerald-400/85'
                    : 'text-emerald-600'
                  : dark
                    ? 'text-white/40'
                    : 'text-black/45',
              )}
              strokeWidth={2.5}
            />
            <code
              className={cn(
                'min-w-0 flex-1 truncate text-center font-mono text-[11px]',
                dark ? 'text-white/65' : 'text-black/65',
              )}
            >
              {shownUrl}
              {typing && <BlinkCaret dark={dark} />}
            </code>
          </div>
        </div>

        {/* Optional title (right side) */}
        {title && (
          <div
            className={cn(
              'hidden shrink-0 truncate text-[11px] font-medium tracking-tight md:block',
              dark ? 'text-white/55' : 'text-black/55',
            )}
          >
            {title}
          </div>
        )}
      </header>

      {/* Body */}
      <div
        className={cn('overflow-hidden', dark ? 'bg-[#0a0a0c]' : 'bg-white')}
        style={{ height }}
      >
        {children}
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------

const TRAFFIC = {
  red: { outer: '#FF5F57', inner: '#E0443E', glyph: '×' },
  yellow: { outer: '#FEBC2E', inner: '#DEA123', glyph: '−' },
  green: { outer: '#28C840', inner: '#1AAB29', glyph: '+' },
}

function TrafficLight({ color }: { color: 'red' | 'yellow' | 'green' }) {
  const { outer, inner, glyph } = TRAFFIC[color]
  return (
    <span
      className="relative inline-flex h-3 w-3 items-center justify-center rounded-full"
      style={{
        background: `radial-gradient(circle at 30% 30%, ${outer} 0%, ${inner} 100%)`,
        boxShadow: 'inset 0 0 0 0.5px rgba(0,0,0,0.2)',
      }}
    >
      <span
        aria-hidden
        className="select-none font-mono text-[8px] font-bold leading-none text-black opacity-0 transition-opacity duration-150 group-hover/chrome:opacity-55"
        style={{ marginTop: color === 'yellow' ? -1 : 0 }}
      >
        {glyph}
      </span>
    </span>
  )
}

function ChromeIconButton({
  dark,
  children,
}: {
  dark: boolean
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      tabIndex={-1}
      className={cn(
        'inline-flex h-6 w-6 items-center justify-center rounded-[5px] transition-colors',
        dark
          ? 'text-white/55 hover:bg-white/[0.06] hover:text-white/85'
          : 'text-black/45 hover:bg-black/[0.06] hover:text-black/80',
      )}
    >
      {children}
    </button>
  )
}

function BlinkCaret({ dark }: { dark: boolean }) {
  return (
    <motion.span
      aria-hidden
      animate={{ opacity: [1, 0.2, 1] }}
      transition={{ duration: 0.9, repeat: Infinity, ease: 'easeInOut' }}
      className={cn(
        'ml-px inline-block h-[1em] w-[4px] translate-y-[2px] rounded-sm',
        dark ? 'bg-white/75' : 'bg-black/65',
      )}
    />
  )
}
