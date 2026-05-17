'use client'

/**
 * Thin progress bar at the top of the viewport that animates during
 * Next.js App Router navigations. Shows immediately on <Link> click
 * and completes when the route finishes loading.
 */

import { useEffect, useState, useCallback, useRef } from 'react'
import { usePathname } from 'next/navigation'

export function NavigationProgress() {
  const pathname = usePathname()
  const [state, setState] = useState<'idle' | 'loading' | 'completing'>('idle')
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const startLoading = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    setState('loading')
  }, [])

  // Intercept all <a> clicks that are internal Next.js navigations
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement).closest('a')
      if (!anchor) return

      const href = anchor.getAttribute('href')
      if (!href || href.startsWith('http') || href.startsWith('#')) return

      // It's an internal link — start progress immediately
      if (href !== pathname) {
        startLoading()
      }
    }

    document.addEventListener('click', onClick, { capture: true })
    return () => document.removeEventListener('click', onClick, { capture: true })
  }, [pathname, startLoading])

  // When pathname changes, navigation completed → run finish animation
  useEffect(() => {
    if (state === 'loading') {
      setState('completing')
      timeoutRef.current = setTimeout(() => setState('idle'), 300)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  // Clean up
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [])

  if (state === 'idle') return null

  return (
    <div className="fixed inset-x-0 top-0 z-[100] h-[2px]">
      <div
        className={
          state === 'loading'
            ? 'h-full bg-white/80 transition-[width] duration-[8s] ease-[cubic-bezier(0.1,0.5,0.1,1)]'
            : 'h-full bg-white/80 transition-[width,opacity] duration-300 ease-out'
        }
        style={{
          width: state === 'loading' ? '85%' : '100%',
          opacity: state === 'completing' ? 0 : 1,
        }}
      />
    </div>
  )
}
