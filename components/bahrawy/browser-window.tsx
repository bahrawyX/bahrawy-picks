'use client'

/**
 * <BrowserWindow />
 *
 * The mac-window-chrome wrapper every product landing page needs to
 * frame a screenshot. Traffic lights (red/yellow/green), optional
 * back/forward/reload, a URL bar with a lock icon, and your content
 * inside. Pass `animateUrl` and the URL types itself in character by
 * character with a blinking caret — perfect for a "watch how it
 * works" hero demo.
 *
 * Two variants: dark (matches the rest of Bahrawy) and light (for
 * screenshots that need a neutral frame).
 */

import * as React from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, Lock, RotateCw } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface BrowserWindowProps {
  /** URL displayed in the address bar. */
  url?: string
  /** Type the URL out character-by-character on mount. */
  animateUrl?: boolean
  /** Chars/sec when animating. Default 32. */
  urlSpeed?: number
  /** Dark = matches Bahrawy palette. Light = neutral, for screenshots. */
  variant?: 'dark' | 'light'
  /** Show the back/forward/reload triplet. Default true on sm+. */
  showActions?: boolean
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
        'overflow-hidden rounded-xl border shadow-2xl',
        dark
          ? 'border-white/10 bg-[#0a0a0c] shadow-black/40'
          : 'border-zinc-300/60 bg-white shadow-zinc-900/15',
        className,
      )}
    >
      {/* Window chrome */}
      <header
        className={cn(
          'flex items-center gap-3 border-b px-3 py-2.5',
          dark
            ? 'border-white/[0.06] bg-white/[0.02]'
            : 'border-zinc-200 bg-zinc-100',
        )}
      >
        {/* Traffic lights */}
        <div className="flex shrink-0 items-center gap-1.5">
          <span className="block h-3 w-3 rounded-full bg-rose-400/90 ring-1 ring-rose-500/30" />
          <span className="block h-3 w-3 rounded-full bg-amber-400/90 ring-1 ring-amber-500/30" />
          <span className="block h-3 w-3 rounded-full bg-emerald-400/90 ring-1 ring-emerald-500/30" />
        </div>

        {/* Back / forward / reload */}
        {showActions && (
          <div className="hidden shrink-0 items-center gap-0.5 sm:flex">
            <ChromeIconButton dark={dark}>
              <ArrowLeft className="h-3.5 w-3.5" strokeWidth={2.5} />
            </ChromeIconButton>
            <ChromeIconButton dark={dark}>
              <ArrowRight className="h-3.5 w-3.5" strokeWidth={2.5} />
            </ChromeIconButton>
            <ChromeIconButton dark={dark}>
              <RotateCw className="h-3.5 w-3.5" strokeWidth={2.5} />
            </ChromeIconButton>
          </div>
        )}

        {/* URL bar */}
        <div
          className={cn(
            'flex min-w-0 flex-1 items-center gap-2 rounded-full border px-3 py-1',
            dark
              ? 'border-white/10 bg-white/[0.04]'
              : 'border-zinc-200 bg-white',
          )}
        >
          <Lock
            className={cn(
              'h-3 w-3 shrink-0',
              dark ? 'text-emerald-300/75' : 'text-emerald-600',
            )}
            strokeWidth={2.5}
          />
          <code
            className={cn(
              'min-w-0 flex-1 truncate font-mono text-[11.5px]',
              dark ? 'text-white/80' : 'text-zinc-700',
            )}
          >
            {shownUrl}
            {typing && <BlinkCaret dark={dark} />}
          </code>
        </div>

        {/* Optional centered title */}
        {title && (
          <div
            className={cn(
              'hidden shrink-0 truncate text-[11px] font-medium tracking-tight md:block',
              dark ? 'text-white/55' : 'text-zinc-500',
            )}
          >
            {title}
          </div>
        )}
      </header>

      {/* Body */}
      <div className="overflow-hidden" style={{ height }}>
        {children}
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------

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
        'inline-flex h-6 w-6 items-center justify-center rounded-md transition-colors',
        dark
          ? 'text-white/30 hover:bg-white/[0.06] hover:text-white/85'
          : 'text-zinc-400 hover:bg-zinc-200/60 hover:text-zinc-700',
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
        'ml-px inline-block h-[1em] w-[5px] translate-y-[2px] rounded-sm',
        dark ? 'bg-white/75' : 'bg-zinc-600',
      )}
    />
  )
}
