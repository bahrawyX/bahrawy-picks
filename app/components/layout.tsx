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

  // Close sheet on route change
  useEffect(() => {
    setOpen(false)
  }, [pathname])

  return (
    <div className="relative min-h-screen bg-black text-white">
      <div className="mx-auto flex w-full max-w-7xl gap-10 px-4 pt-28 pb-24 sm:px-6 md:px-10">
        {/* Desktop sidebar */}
        <aside className="sticky top-28 hidden h-[calc(100vh-8rem)] w-64 shrink-0 overflow-y-auto pr-2 scrollbar-hide md:block [mask-image:linear-gradient(to_bottom,transparent,black_80px,black_calc(100%-80px),transparent)]">
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

        <main className="min-w-0 flex-1">
          {children}
        </main>
      </div>
    </div>
  )
}
