import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

export function DocsPage({
  category,
  title,
  description,
  children,
}: {
  category?: string
  title: string
  description: string
  children: ReactNode
}) {
  return (
    <article className="flex flex-col gap-10">
      <header>
        {category && (
          <p className="text-xs uppercase tracking-[0.2em] text-white/40">
            {category}
          </p>
        )}
        <h1 className="mt-2 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
          {title}
        </h1>
        <p className="mt-3 max-w-2xl text-pretty text-sm text-white/60">
          {description}
        </p>
      </header>
      {children}
    </article>
  )
}

export function DocsSection({
  title,
  description,
  children,
  className,
}: {
  title?: string
  description?: string
  children: ReactNode
  className?: string
}) {
  return (
    <section className={cn('flex flex-col gap-4', className)}>
      {(title || description) && (
        <div>
          {title && (
            <h2 className="text-lg font-semibold tracking-tight text-white">
              {title}
            </h2>
          )}
          {description && (
            <p className="mt-1 text-sm text-white/55">{description}</p>
          )}
        </div>
      )}
      {children}
    </section>
  )
}

export function DemoCard({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        'flex min-h-[280px] items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-black/40 p-8',
        className
      )}
    >
      {children}
    </div>
  )
}

export function ControlsRow({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        'flex flex-wrap items-center gap-2 rounded-xl border border-white/10 bg-white/[0.02] p-3',
        className
      )}
    >
      {children}
    </div>
  )
}

export function ControlLabel({ children }: { children: ReactNode }) {
  return (
    <span className="px-1 text-xs uppercase tracking-wider text-white/40">
      {children}
    </span>
  )
}
