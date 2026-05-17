import { Sidebar } from '@/components/showcase/sidebar'
import { PageTransition } from '@/components/page-transition'

export default function ComponentsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="relative min-h-screen bg-black text-white">
      <div className="mx-auto flex w-full max-w-7xl gap-10 px-6 pt-28 pb-24 md:px-10">
        <aside className="sticky top-28 hidden h-[calc(100vh-8rem)] w-64 shrink-0 overflow-y-auto pr-2 md:block">
          <Sidebar />
        </aside>
        <main className="min-w-0 flex-1">
          <PageTransition scope="pathname" skipFirst>
            {children}
          </PageTransition>
        </main>
      </div>
    </div>
  )
}
