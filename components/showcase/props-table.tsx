import type { PropEntry } from './registry'

export function PropsTable({ props }: { props: PropEntry[] }) {
  return (
    <div className="overflow-hidden rounded-xl border border-white/10 bg-white/[0.02]">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10 bg-white/[0.03] text-left text-xs font-medium uppercase tracking-wider text-white/40">
              <th className="px-4 py-3">Property</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Default</th>
              <th className="px-4 py-3">Description</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.06]">
            {props.map((p) => (
              <tr key={p.name}>
                <td className="px-4 py-3 align-top">
                  <code className="rounded-md bg-white/[0.06] px-2 py-0.5 font-mono text-[12px] text-white">
                    {p.name}
                  </code>
                </td>
                <td className="px-4 py-3 align-top font-mono text-[12px] text-white/60">
                  {p.type}
                </td>
                <td className="px-4 py-3 align-top">
                  {p.default ? (
                    <code className="rounded-md bg-white/[0.06] px-2 py-0.5 font-mono text-[12px] text-white/80">
                      {p.default}
                    </code>
                  ) : (
                    <span className="text-white/30">—</span>
                  )}
                </td>
                <td className="px-4 py-3 align-top text-sm text-white/70">
                  {p.description}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
