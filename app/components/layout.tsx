import { Sidebar } from '@/components/showcase/sidebar'

export default function ComponentsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="relative min-h-screen bg-black text-white">
      <div className="mx-auto flex w-full max-w-7xl gap-10 px-6 pt-28 pb-24 md:px-10">
        <aside className="sticky top-28 hidden h-[calc(100vh-8rem)] w-64 shrink-0 overflow-y-auto pr-2 scrollbar-hide md:block [mask-image:linear-gradient(to_bottom,transparent,black_40px,black_calc(100%-40px),transparent)]">
          <div className="pb-10 pt-6">
            <Sidebar />
          </div>
        </aside>
        <main className="min-w-0 flex-1">
          {children}
        </main>
      </div>
    </div>
  )
}
