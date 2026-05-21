'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { Menu } from 'lucide-react'
import { Sidebar } from '@/components/showcase/sidebar'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'

export default function ComponentsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  // Close sheet + scroll to top on route change
  useEffect(() => {
    setOpen(false)
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [pathname])

  return (
    <div className="relative min-h-screen bg-black text-white">
      {/* No outer max-width — sidebar sits at the very left edge of the
          viewport, main showcase takes everything else. */}
      <div className="flex w-full pt-28 pb-24">
        {/* Desktop sidebar — pinned to the left edge */}
        <aside className="sticky top-28 hidden h-[calc(100vh-8rem)] w-64 shrink-0 overflow-y-auto pl-6 pr-3 scrollbar-hide md:block lg:pl-8 [mask-image:linear-gradient(to_bottom,transparent,black_80px,black_calc(100%-80px),transparent)]">
          <div className="pb-10 pt-6">
            <Sidebar />
          </div>
        </aside>

        {/* Mobile sidebar trigger */}
        <div className="fixed bottom-6 right-6 z-40 md:hidden">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <button
                type="button"
                className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-black/80 text-white shadow-2xl shadow-black/60 backdrop-blur-xl transition-transform active:scale-95"
                aria-label="Browse components"
              >
                <Menu className="h-5 w-5" />
              </button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80 overflow-y-auto px-0">
              <SheetHeader className="px-6">
                <SheetTitle>Components</SheetTitle>
              </SheetHeader>
              <div className="px-4 pb-10 pt-4">
                <Sidebar />
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Main showcase — takes ALL remaining space; content wrapped in a
            90% width div so there's a comfortable gutter on both sides. */}
        <main className="min-w-0 flex-1">
          <div className="mx-auto w-[90%]">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
