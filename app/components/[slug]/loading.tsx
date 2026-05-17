export default function Loading() {
  return (
    <article className="flex animate-pulse flex-col gap-10">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex-1 space-y-3">
          <div className="h-3 w-32 rounded-full bg-white/10" />
          <div className="h-10 w-56 rounded-md bg-white/10 sm:w-72" />
          <div className="space-y-2">
            <div className="h-3 w-full max-w-xl rounded-full bg-white/[0.07]" />
            <div className="h-3 w-3/4 max-w-md rounded-full bg-white/[0.07]" />
          </div>
        </div>
        <div className="h-9 w-9 rounded-lg bg-white/[0.06]" />
      </header>

      <div>
        <div className="mb-4 inline-flex h-9 w-44 rounded-lg bg-white/[0.06]" />
        <div className="h-[420px] rounded-xl border border-white/10 bg-white/[0.03]" />
      </div>

      <section>
        <div className="mb-4 h-5 w-16 rounded-full bg-white/10" />
        <div className="overflow-hidden rounded-xl border border-white/10 bg-white/[0.02]">
          <div className="h-10 border-b border-white/10 bg-white/[0.03]" />
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="grid grid-cols-[1fr_1fr_1fr_2fr] gap-4 border-b border-white/[0.06] px-4 py-3 last:border-b-0"
            >
              <div className="h-5 w-20 rounded-md bg-white/[0.06]" />
              <div className="h-5 w-16 rounded-md bg-white/[0.06]" />
              <div className="h-5 w-14 rounded-md bg-white/[0.06]" />
              <div className="h-5 w-full max-w-sm rounded-md bg-white/[0.06]" />
            </div>
          ))}
        </div>
      </section>

      <section>
        <div className="mb-4 h-5 w-28 rounded-full bg-white/10" />
        <div className="flex flex-wrap gap-2">
          <div className="h-7 w-16 rounded-md bg-white/[0.06]" />
          <div className="h-7 w-28 rounded-md bg-white/[0.06]" />
          <div className="h-7 w-20 rounded-md bg-white/[0.06]" />
        </div>
      </section>
    </article>
  )
}
