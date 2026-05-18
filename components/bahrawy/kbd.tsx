'use client'

import { useMemo } from 'react'
import { cn } from '@/lib/utils'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface KbdProps {
  keys: string | string[]
  separator?: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

// ---------------------------------------------------------------------------
// Platform detection
// ---------------------------------------------------------------------------

function getIsMac(): boolean {
  if (typeof navigator === 'undefined') return false
  return /Mac|iPhone|iPad|iPod/.test(navigator.platform || '') ||
    (navigator.userAgent?.includes('Mac') ?? false)
}

// ---------------------------------------------------------------------------
// Key symbol mapping
// ---------------------------------------------------------------------------

const macSymbols: Record<string, string> = {
  mod: '⌘',
  ctrl: '⌃',
  alt: '⌥',
  shift: '⇧',
  enter: '↵',
  backspace: '⌫',
  delete: '⌦',
  escape: 'esc',
  tab: '⇥',
  space: '␣',
  up: '↑',
  down: '↓',
  left: '←',
  right: '→',
  capslock: '⇪',
}

const winSymbols: Record<string, string> = {
  mod: 'Ctrl',
  ctrl: 'Ctrl',
  alt: 'Alt',
  shift: 'Shift',
  enter: '↵',
  backspace: '⌫',
  delete: 'Del',
  escape: 'Esc',
  tab: 'Tab',
  space: 'Space',
  up: '↑',
  down: '↓',
  left: '←',
  right: '→',
  capslock: 'Caps',
}

function resolveKey(key: string, isMac: boolean): string {
  const lower = key.toLowerCase()
  const map = isMac ? macSymbols : winSymbols
  return map[lower] ?? key.toUpperCase()
}

// ---------------------------------------------------------------------------
// Sizes
// ---------------------------------------------------------------------------

const sizeStyles = {
  sm: 'min-w-[18px] h-5 px-1 text-[10px] rounded',
  md: 'min-w-[22px] h-6 px-1.5 text-[11px] rounded-md',
  lg: 'min-w-[28px] h-7 px-2 text-xs rounded-md',
} as const

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function Kbd({
  keys,
  separator = '+',
  size = 'md',
  className,
}: KbdProps) {
  const isMac = useMemo(getIsMac, [])

  const keyArray = typeof keys === 'string' ? keys.split('+').map((k) => k.trim()) : keys

  const resolvedKeys = useMemo(
    () => keyArray.map((k) => resolveKey(k, isMac)),
    [keyArray, isMac],
  )

  return (
    <kbd
      className={cn(
        'inline-flex items-center gap-0.5 font-sans font-medium text-white/60',
        className,
      )}
      aria-label={keyArray.join(' + ')}
    >
      {resolvedKeys.map((key, i) => (
        <span key={`${key}-${i}`}>
          <span
            className={cn(
              'inline-flex items-center justify-center border border-white/[0.1] bg-white/[0.04] font-mono leading-none text-white/60',
              sizeStyles[size],
            )}
          >
            {key}
          </span>
          {i < resolvedKeys.length - 1 && (
            <span className="mx-0.5 text-white/20">{separator}</span>
          )}
        </span>
      ))}
    </kbd>
  )
}
