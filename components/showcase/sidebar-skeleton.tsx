import { registry } from './registry'

export function SidebarSkeleton() {
  return (
    <div className="flex animate-pulse flex-col gap-6">
      <div className="h-4 w-24 rounded-full bg-white/10" />

      <ul className="flex flex-col gap-3 pt-1">
        <li className="flex items-center gap-3">
          <span className="h-px w-7 shrink-0 rounded-full bg-white/20" />
          <span className="h-3.5 w-32 rounded-full bg-white/[0.08]" />
        </li>
        <li className="flex items-center gap-3">
          <span className="h-px w-7 shrink-0 rounded-full bg-white/15" />
          <span className="h-3.5 w-20 rounded-full bg-white/[0.07]" />
        </li>
        <li aria-hidden className="my-1 h-px bg-white/[0.04]" />
        {registry.map((entry, i) => (
          <li key={entry.slug} className="flex items-center gap-3">
            <span
              className="h-px shrink-0 rounded-full bg-white/[0.08]"
              style={{ width: `${20 + (i % 4) * 4}px` }}
            />
            <span
              className="h-3 rounded-full bg-white/[0.06]"
              style={{ width: `${96 + ((i * 17) % 60)}px` }}
            />
          </li>
        ))}
      </ul>
    </div>
  )
}
