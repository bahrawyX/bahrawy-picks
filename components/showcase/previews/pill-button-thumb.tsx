import { ArrowRight } from 'lucide-react'

export default function PillButtonThumb() {
  return (
    <div className="relative flex h-full w-full items-center justify-center bg-gradient-to-br from-white/[0.04] via-transparent to-white/[0.02]">
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/5 blur-3xl"
      />
      <div className="relative inline-flex items-center gap-2 rounded-full bg-white px-5 py-2 text-sm font-medium text-black shadow-2xl shadow-black/40">
        Get started
        <ArrowRight className="h-3.5 w-3.5" />
      </div>
    </div>
  )
}
