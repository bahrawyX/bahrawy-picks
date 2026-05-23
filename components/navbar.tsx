'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Github, Menu } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { GlobalSearch } from '@/components/global-search'
import { BrandMark } from '@/components/brand-mark'

const links = [
  { href: '/components', label: 'Components' },
  { href: '/#docs', label: 'Docs' },
  { href: '/#showcase', label: 'Showcase' },
]

/**
 * Floating pill navbar. Center nav collapses on scroll-down and expands
 * on scroll-up using a `grid-template-columns: 1fr ↔ 0fr` transition.
 * Above the threshold the nav is always wide.
 *
 * On mobile: shows a hamburger menu that opens a Sheet drawer.
 */
export function Navbar() {
  const [compact, setCompact] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname()

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

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
    <header className="fixed top-4 left-1/2 z-50 -translate-x-1/2 w-[calc(100%-2rem)] max-w-fit">
      <div
        className={cn(
          'flex items-center gap-1 rounded-full border border-white/10 bg-black/40 px-2 py-1.5 shadow-2xl shadow-black/40 backdrop-blur-xl',
          'transition-all',
          collapseMotion
        )}
      >
        {/* Mobile hamburger */}
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild>
            <button
              type="button"
              className="inline-flex h-8 w-8 items-center justify-center rounded-full text-white/70 transition-colors hover:bg-white/5 hover:text-white md:hidden"
              aria-label="Open menu"
            >
              <Menu className="h-4 w-4" />
            </button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 px-0">
            <SheetHeader className="px-6">
              <SheetTitle className="flex items-center gap-2 text-white">
                <BrandMark className="h-5 w-5" />
                Bahrawy
              </SheetTitle>
            </SheetHeader>
            <nav className="mt-4 flex flex-col gap-1 px-4">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    'rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                    pathname === link.href || (link.href !== '/' && pathname?.startsWith(link.href))
                      ? 'bg-white/10 text-white'
                      : 'text-white/60 hover:bg-white/[0.06] hover:text-white',
                  )}
                >
                  {link.label}
                </Link>
              ))}
              <div className="my-2 h-px bg-white/[0.06]" />
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer noopener"
                className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-white/60 transition-colors hover:bg-white/[0.06] hover:text-white"
              >
                <Github className="h-4 w-4" />
                GitHub
              </a>
            </nav>
          </SheetContent>
        </Sheet>

        <Link
          href="/"
          aria-label="Bahrawy — home"
          className="group inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-semibold tracking-tight text-white transition-colors hover:bg-white/[0.04]"
        >
          <BrandMark className="h-[18px] w-[18px] shrink-0 transition-transform duration-300 group-hover:-rotate-3" />
          <span>Bahrawy</span>
        </Link>

        {/* Collapsible center: grid 1fr ↔ 0fr animates width smoothly — hidden on mobile */}
        <div
          className={cn(
            'hidden md:grid overflow-hidden transition-[grid-template-columns,opacity]',
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

        {/* Global ⌘K search — single instance; trigger is responsive internally */}
        <GlobalSearch />

        <a
          href="https://github.com"
          target="_blank"
          rel="noreferrer noopener"
          aria-label="GitHub"
          className="hidden md:inline-flex rounded-full p-2 text-white/70 transition-colors duration-m3-enter ease-m3-enter hover:bg-white/5 hover:text-white"
        >
          <Github className="h-4 w-4" />
        </a>
      </div>
    </header>
  )
}
