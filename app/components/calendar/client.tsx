'use client'

import * as React from 'react'
import { Calendar } from '@/components/bahrawy/calendar'
import { CodeBlock } from '@/components/showcase/code-block'
import { DocsPage, DocsSection, DemoCard } from '@/components/showcase/docs-page'

const SNIPPET = `import { Calendar } from '@/components/bahrawy/calendar'

const [date, setDate] = useState<Date | null>(new Date())

<Calendar value={date} onValueChange={setDate} />

// Multiple dates
const [dates, setDates] = useState<Date[]>([])
<Calendar mode="multiple" value={dates} onValueChange={setDates} />`

function fmt(d: Date | null) {
  if (!d) return '—'
  return new Intl.DateTimeFormat(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(d)
}

export default function CalendarDocs() {
  const [single, setSingle] = React.useState<Date | null>(new Date())
  const [multi, setMulti] = React.useState<Date[]>([])
  const [pickWeek, setPickWeek] = React.useState<Date | null>(new Date())

  return (
    <DocsPage
      title="Calendar"
      slug="calendar"
      description="An Apple-style standalone month-grid date picker. Single-date selection by default; pass mode='multiple' for an array of dates. Locale-aware weekday names, today indicator dot, layoutId-driven selection that glides between days, month navigation. Optional isDateDisabled predicate."
      category="173 · form"
    >
      <DocsSection title="Single date">
        <DemoCard className="min-h-[420px]">
          <div className="flex flex-col items-center gap-4">
            <Calendar value={single} onValueChange={setSingle} />
            <p className="font-mono text-[12px] tabular-nums text-white/55">
              selected = <span className="text-white/85">{fmt(single)}</span>
            </p>
          </div>
        </DemoCard>
      </DocsSection>

      <DocsSection title="Multiple dates">
        <DemoCard className="min-h-[420px]">
          <div className="flex flex-col items-center gap-4">
            <Calendar mode="multiple" value={multi} onValueChange={setMulti} />
            <p className="font-mono text-[12px] tabular-nums text-white/55">
              {multi.length} {multi.length === 1 ? 'date' : 'dates'} selected
            </p>
          </div>
        </DemoCard>
      </DocsSection>

      <DocsSection title="Disable weekends">
        <DemoCard className="min-h-[420px]">
          <div className="flex flex-col items-center gap-4">
            <Calendar
              value={pickWeek}
              onValueChange={setPickWeek}
              weekStartsOn={1}
              isDateDisabled={(d) => d.getDay() === 0 || d.getDay() === 6}
            />
            <p className="text-[11px] tracking-tight text-white/45">
              Week starts on Monday · Saturday + Sunday disabled
            </p>
          </div>
        </DemoCard>
      </DocsSection>

      <DocsSection title="Usage">
        <CodeBlock code={SNIPPET} language="tsx" />
      </DocsSection>

      <DocsSection title="Props">
        <ul className="grid gap-2 sm:grid-cols-2">
          {[
            ['mode', '"single" | "multiple". Default "single".'],
            ['value / onValueChange', 'Date | null for single mode; Date[] for multiple.'],
            ['defaultValue', 'Uncontrolled initial value.'],
            ['defaultMonth', 'Initial visible month. Default today.'],
            ['weekStartsOn', '0 (Sun) ... 6 (Sat). Default 0.'],
            ['locale', 'BCP-47 locale for weekday / month names. Default browser.'],
            ['isDateDisabled', '(date) => boolean — disable specific dates.'],
            ['className', 'Extra classes on the calendar.'],
          ].map(([n, b]) => (
            <li key={n} className="rounded-lg border border-white/10 bg-white/[0.02] p-3">
              <code className="font-mono text-xs text-white">{n}</code>
              <p className="mt-1 text-xs text-white/60">{b}</p>
            </li>
          ))}
        </ul>
      </DocsSection>

      <DocsSection title="Dependencies">
        <div className="flex flex-wrap gap-2">
          {['framer-motion', 'lucide-react'].map((d) => (
            <code key={d} className="rounded-md border border-white/10 bg-white/[0.04] px-2 py-1 font-mono text-xs text-white/80">{d}</code>
          ))}
        </div>
      </DocsSection>
    </DocsPage>
  )
}
