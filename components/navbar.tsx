'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Github } from 'lucide-react'
import { cn } from '@/lib/utils'

const links = [
  { href: '/components', label: 'Components' },
  { href: '/#docs', label: 'Docs' },
  { href: '/#showcase', label: 'Showcase' },
]

/**
 * Floating pill navbar. Center nav collapses on scroll-down and expands
 * on scroll-up using a `grid-template-columns: 1fr ↔ 0fr` transition.
 * Above the threshold the nav is always wide.
 */
export function Navbar() {
  const [compact, setCompact] = useState(false)

  useEffect(() => {
    const TOP_THRESHOLD = 80
    const DELTA = 4
    let lastY = window.scrollY
    let ticking = false

    const update = () => {
      const y = window.scrollY
      if (y < TOP_THRESHOLD) {
        setCompact(false)
      } else if (y > lastY + DELTA) {
        setCompact(true)
      } else if (y < lastY - DELTA) {
        setCompact(false)
      }
      lastY = y
      ticking = false
    }

    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(update)
        ticking = true
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Enter motion when expanding (wide), exit motion when collapsing (compact)
  const collapseMotion = compact
    ? 'duration-m3-exit ease-m3-exit'
    : 'duration-m3-enter ease-m3-enter'

  return (
    <header className="fixed top-4 left-1/2 z-50 -translate-x-1/2">
      <div
        className={cn(
          'flex items-center gap-1 rounded-full border border-white/10 bg-black/40 px-2 py-1.5 shadow-2xl shadow-black/40 backdrop-blur-xl',
          'transition-all',
          collapseMotion
        )}
      >
        <Link
          href="/"
          className="rounded-full px-4 py-1.5 text-sm font-semibold tracking-tight text-white"
        >
          Bahrawy
        </Link>

        {/* Collapsible center: grid 1fr ↔ 0fr animates width smoothly */}
        <div
          className={cn(
            'grid overflow-hidden transition-[grid-template-columns,opacity]',
            collapseMotion,
            compact ? 'grid-cols-[0fr] opacity-0' : 'grid-cols-[1fr] opacity-100'
          )}
          aria-hidden={compact}
        >
          <div className="flex min-w-0 items-center gap-1">
            <span className="h-5 w-px shrink-0 bg-white/10" aria-hidden />
            <nav className="flex items-center gap-0.5 px-1">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  tabIndex={compact ? -1 : 0}
                  className="whitespace-nowrap rounded-full px-3 py-1.5 text-sm text-white/70 transition-colors duration-m3-enter ease-m3-enter hover:bg-white/5 hover:text-white"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            <span className="h-5 w-px shrink-0 bg-white/10" aria-hidden />
          </div>
        </div>

        <a
          href="https://github.com"
          target="_blank"
          rel="noreferrer noopener"
          aria-label="GitHub"
          className="rounded-full p-2 text-white/70 transition-colors duration-m3-enter ease-m3-enter hover:bg-white/5 hover:text-white"
        >
          <Github className="h-4 w-4" />
        </a>
      </div>
    </header>
  )
}
