'use client'

import { useState } from 'react'
import { addDays, startOfToday, subDays } from 'date-fns'
import type { DateRange } from 'react-day-picker'
import { DateRangePicker } from '@/components/bahrawy/date-range-picker'
import type { DateRangePreset } from '@/components/bahrawy/date-range-picker'
import { Button } from '@/components/ui/button'
import { CodeBlock } from '@/components/showcase/code-block'
import {
  ControlLabel,
  ControlsRow,
  DemoCard,
  DocsPage,
  DocsSection,
} from '@/components/showcase/docs-page'
import { PropsTable } from '@/components/showcase/props-table'

const CUSTOM_PRESETS: DateRangePreset[] = [
  {
    label: 'Last 14 days',
    range: () => ({ from: subDays(startOfToday(), 13), to: startOfToday() }),
  },
  {
    label: 'Last 90 days',
    range: () => ({ from: subDays(startOfToday(), 89), to: startOfToday() }),
  },
  {
    label: 'Year to date',
    range: () => ({
      from: new Date(new Date().getFullYear(), 0, 1),
      to: startOfToday(),
    }),
  },
]

const SNIPPET = `import { DateRangePicker } from '@/components/bahrawy'
import { useState } from 'react'
import type { DateRange } from 'react-day-picker'

const [range, setRange] = useState<DateRange | undefined>()

<DateRangePicker
  value={range}
  onChange={setRange}
  minDate={new Date('2024-01-01')}
  maxDate={new Date('2026-12-31')}
/>`

export default function DateRangePickerDocs() {
  const [range, setRange] = useState<DateRange | undefined>(undefined)
  const [withCustomPresets, setWithCustomPresets] = useState(false)
  const [withBounds, setWithBounds] = useState(false)
  const [disabled, setDisabled] = useState(false)

  const today = startOfToday()
  const minDate = withBounds ? subDays(today, 90) : undefined
  const maxDate = withBounds ? addDays(today, 90) : undefined
  const presets = withCustomPresets ? CUSTOM_PRESETS : undefined

  return (
    <DocsPage
      category="05 · form"
      title="Date range picker"
      slug="date-range-picker"
      description="Two-month range picker built on react-day-picker v9 with Framer Motion animations. Includes preset shortcuts, popover on desktop, drawer on mobile."
    >
      <DocsSection title="Live demo">
        <DemoCard className="min-h-[180px]">
          <div className="flex w-full flex-col items-center gap-3">
            <DateRangePicker
              value={range}
              onChange={setRange}
              minDate={minDate}
              maxDate={maxDate}
              presets={presets}
              disabled={disabled}
            />
            <p className="text-center font-mono text-xs text-white/40">
              {range?.from
                ? `from=${range.from.toLocaleDateString()}  to=${range.to?.toLocaleDateString() ?? '—'}`
                : 'value = undefined'}
            </p>
          </div>
        </DemoCard>

        <ControlsRow>
          <ControlLabel>Presets</ControlLabel>
          <Button
            size="sm"
            variant={!withCustomPresets ? 'default' : 'outline'}
            onClick={() => setWithCustomPresets(false)}
          >
            Default
          </Button>
          <Button
            size="sm"
            variant={withCustomPresets ? 'default' : 'outline'}
            onClick={() => setWithCustomPresets(true)}
          >
            Custom
          </Button>
          <span className="mx-1 h-5 w-px bg-white/10" />
          <Button
            size="sm"
            variant={withBounds ? 'default' : 'outline'}
            onClick={() => setWithBounds((v) => !v)}
          >
            90 day bounds
          </Button>
          <Button
            size="sm"
            variant={disabled ? 'default' : 'outline'}
            onClick={() => setDisabled((v) => !v)}
          >
            Disabled
          </Button>
          <span className="mx-1 h-5 w-px bg-white/10" />
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setRange(undefined)}
          >
            Clear
          </Button>
        </ControlsRow>
      </DocsSection>

      <DocsSection title="Usage">
        <CodeBlock code={SNIPPET} language="tsx" />
      </DocsSection>

      <DocsSection title="Props">
        <PropsTable
          props={[
            { name: 'value', type: 'DateRange | undefined', description: 'Currently selected range.' },
            { name: 'onChange', type: '(value) => void', description: 'Fires when the selection changes.' },
            { name: 'minDate', type: 'Date', description: 'Earliest selectable date.' },
            { name: 'maxDate', type: 'Date', description: 'Latest selectable date.' },
            { name: 'disabledDates', type: 'Date[]', default: '[]', description: 'Specific dates to disable.' },
            { name: 'presets', type: 'DateRangePreset[]', default: 'Today / 7d / 30d / This month', description: 'Quick-pick shortcuts.' },
            { name: 'placeholder', type: 'string', default: '"Select date range"', description: 'Trigger text when nothing is selected.' },
            { name: 'disabled', type: 'boolean', default: 'false', description: 'Disable the trigger.' },
            { name: 'align', type: '"start" | "center" | "end"', default: '"start"', description: 'Popover alignment.' },
          ]}
        />
      </DocsSection>

      <DocsSection title="Mobile">
        <p className="text-sm text-white/60">
          On viewports under 768px the picker opens in a bottom drawer
          instead of a popover, and collapses to a single month for usability.
        </p>
      </DocsSection>
    </DocsPage>
  )
}
