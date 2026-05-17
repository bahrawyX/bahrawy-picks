export default function ComponentsLoading() {
  return (
    <div className="flex flex-col gap-10 animate-pulse">
      {/* Header skeleton */}
      <header>
        <div className="h-3 w-24 rounded bg-white/5" />
        <div className="mt-3 h-10 w-72 rounded-lg bg-white/5 sm:h-12 sm:w-96" />
        <div className="mt-4 h-4 w-full max-w-lg rounded bg-white/5" />
        <div className="mt-2 h-4 w-60 rounded bg-white/5" />
        {/* Install bar skeleton */}
        <div className="mt-4 h-10 w-full max-w-md rounded-lg border border-white/5 bg-white/[0.02]" />
      </header>

      {/* Demo card skeleton */}
      <section className="flex flex-col gap-4">
        <div className="h-5 w-28 rounded bg-white/5" />
        <div className="h-[280px] rounded-xl border border-white/5 bg-white/[0.02]" />
      </section>

      {/* Props table skeleton */}
      <section className="flex flex-col gap-4">
        <div className="h-5 w-16 rounded bg-white/5" />
        <div className="space-y-2">
          <div className="h-8 w-full rounded bg-white/[0.03]" />
          <div className="h-8 w-full rounded bg-white/[0.02]" />
          <div className="h-8 w-full rounded bg-white/[0.02]" />
          <div className="h-8 w-full rounded bg-white/[0.02]" />
        </div>
      </section>
    </div>
  )
}
