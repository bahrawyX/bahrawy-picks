'use client'

import { useState } from 'react'
import {
  Globe,
  Palette,
  Code,
  Music,
  Film,
  Gamepad2,
  BookOpen,
  Coffee,
  Dumbbell,
  Camera,
  Plane,
  Heart,
} from 'lucide-react'
import { Autocomplete, type AutocompleteOption as Option } from '@/components/bahrawy'
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

// ---------------------------------------------------------------------------
// Mock data
// ---------------------------------------------------------------------------

const FRAMEWORKS: Option[] = [
  { label: 'React', value: 'react', group: 'Frontend', icon: <Code className="h-4 w-4" /> },
  { label: 'Vue', value: 'vue', group: 'Frontend', icon: <Code className="h-4 w-4" /> },
  { label: 'Angular', value: 'angular', group: 'Frontend', icon: <Code className="h-4 w-4" /> },
  { label: 'Svelte', value: 'svelte', group: 'Frontend', icon: <Code className="h-4 w-4" /> },
  { label: 'Next.js', value: 'nextjs', group: 'Fullstack', icon: <Globe className="h-4 w-4" /> },
  { label: 'Nuxt', value: 'nuxt', group: 'Fullstack', icon: <Globe className="h-4 w-4" /> },
  { label: 'Remix', value: 'remix', group: 'Fullstack', icon: <Globe className="h-4 w-4" /> },
  { label: 'Express', value: 'express', group: 'Backend', icon: <Code className="h-4 w-4" /> },
  { label: 'Fastify', value: 'fastify', group: 'Backend', icon: <Code className="h-4 w-4" /> },
  { label: 'NestJS', value: 'nestjs', group: 'Backend', icon: <Code className="h-4 w-4" />, description: 'Progressive Node.js framework' },
]

const HOBBIES: Option[] = [
  { label: 'Photography', value: 'photography', icon: <Camera className="h-4 w-4" />, description: 'Capture moments' },
  { label: 'Gaming', value: 'gaming', icon: <Gamepad2 className="h-4 w-4" />, description: 'Video & board games' },
  { label: 'Reading', value: 'reading', icon: <BookOpen className="h-4 w-4" />, description: 'Books & articles' },
  { label: 'Music', value: 'music', icon: <Music className="h-4 w-4" />, description: 'Listen or play' },
  { label: 'Movies', value: 'movies', icon: <Film className="h-4 w-4" />, description: 'Films & series' },
  { label: 'Cooking', value: 'cooking', icon: <Coffee className="h-4 w-4" />, description: 'Kitchen adventures' },
  { label: 'Fitness', value: 'fitness', icon: <Dumbbell className="h-4 w-4" />, description: 'Stay active' },
  { label: 'Travel', value: 'travel', icon: <Plane className="h-4 w-4" />, description: 'Explore the world' },
  { label: 'Design', value: 'design', icon: <Palette className="h-4 w-4" />, description: 'Creative expression' },
  { label: 'Volunteering', value: 'volunteering', icon: <Heart className="h-4 w-4" />, description: 'Give back' },
]

const COLORS: Option[] = [
  { label: 'Red', value: 'red' },
  { label: 'Orange', value: 'orange' },
  { label: 'Yellow', value: 'yellow' },
  { label: 'Green', value: 'green' },
  { label: 'Blue', value: 'blue' },
  { label: 'Purple', value: 'purple' },
  { label: 'Pink', value: 'pink' },
  { label: 'Black', value: 'black' },
  { label: 'White', value: 'white' },
]

// Fake async search — simulates API
function mockAsyncSearch(query: string): Promise<Option[]> {
  const allCities: Option[] = [
    { label: 'New York', value: 'new-york', description: 'United States' },
    { label: 'London', value: 'london', description: 'United Kingdom' },
    { label: 'Paris', value: 'paris', description: 'France' },
    { label: 'Tokyo', value: 'tokyo', description: 'Japan' },
    { label: 'Berlin', value: 'berlin', description: 'Germany' },
    { label: 'Sydney', value: 'sydney', description: 'Australia' },
    { label: 'Toronto', value: 'toronto', description: 'Canada' },
    { label: 'Cairo', value: 'cairo', description: 'Egypt' },
    { label: 'Dubai', value: 'dubai', description: 'UAE' },
    { label: 'Seoul', value: 'seoul', description: 'South Korea' },
    { label: 'Mumbai', value: 'mumbai', description: 'India' },
    { label: 'São Paulo', value: 'sao-paulo', description: 'Brazil' },
    { label: 'Mexico City', value: 'mexico-city', description: 'Mexico' },
    { label: 'Istanbul', value: 'istanbul', description: 'Turkey' },
    { label: 'Singapore', value: 'singapore', description: 'Singapore' },
  ]

  return new Promise((resolve) => {
    setTimeout(() => {
      const q = query.toLowerCase()
      resolve(allCities.filter((c) => c.label.toLowerCase().includes(q)))
    }, 400)
  })
}

// ---------------------------------------------------------------------------
// Snippets
// ---------------------------------------------------------------------------

const STATIC_SNIPPET = `import { Autocomplete } from '@/components/bahrawy'

const frameworks = [
  { label: 'React', value: 'react', group: 'Frontend' },
  { label: 'Next.js', value: 'nextjs', group: 'Fullstack' },
  { label: 'Express', value: 'express', group: 'Backend' },
]

<Autocomplete
  options={frameworks}
  placeholder="Select framework..."
  onChange={(value) => console.log(value)}
/>`

const MULTI_SNIPPET = `<Autocomplete
  options={hobbies}
  multiple
  maxItems={4}
  placeholder="Select hobbies..."
  onChange={(values) => console.log(values)}
/>`

const ASYNC_SNIPPET = `<Autocomplete
  onSearch={async (query) => {
    const res = await fetch(\`/api/cities?q=\${query}\`)
    return res.json()
  }}
  debounceMs={300}
  placeholder="Search cities..."
/>`

const CREATABLE_SNIPPET = `<Autocomplete
  options={colors}
  creatable
  onCreate={(value) => console.log('Created:', value)}
  placeholder="Pick or create a color..."
/>`

const RHF_SNIPPET = `import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Autocomplete } from '@/components/bahrawy'

const schema = z.object({
  framework: z.string().min(1, 'Required'),
})

function MyForm() {
  const { control, handleSubmit } = useForm({
    resolver: zodResolver(schema),
  })

  return (
    <form onSubmit={handleSubmit(console.log)}>
      <Controller
        name="framework"
        control={control}
        render={({ field, fieldState }) => (
          <Autocomplete
            options={frameworks}
            value={field.value}
            onChange={field.onChange}
            error={fieldState.error?.message}
            placeholder="Select framework..."
          />
        )}
      />
    </form>
  )
}`

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function AutocompleteDocs() {
  const [singleValue, setSingleValue] = useState<string>('')
  const [multiValue, setMultiValue] = useState<string[]>([])
  const [asyncValue, setAsyncValue] = useState<string>('')
  const [creatableSingle, setCreatableSingle] = useState<string>('')
  const [creatableMulti, setCreatableMulti] = useState<string[]>([])
  const [errorDemo, setErrorDemo] = useState<string>('')
  const [disabledDemo, setDisabledDemo] = useState<string>('')
  const [clearableDemo, setClearableDemo] = useState<string>('')
  const [showError, setShowError] = useState(true)
  const [showDisabled, setShowDisabled] = useState(true)

  return (
    <DocsPage
      category="01 · form"
      title="Autocomplete"
      slug="autocomplete"
      description="Static, async, and creatable combobox with single and multi-select, debounced search, and chip UI. Built on shadcn Popover + Command."
    >
      {/* ---- Static single with groups ---- */}
      <DocsSection title="Static single select">
        <DemoCard>
          <div className="w-full max-w-sm space-y-3">
            <Autocomplete
              options={FRAMEWORKS}
              value={singleValue}
              onChange={(v) => setSingleValue(v as string)}
              placeholder="Select framework..."
              clearable
            />
            <p className="text-center font-mono text-xs text-white/40">
              {singleValue ? `value = "${singleValue}"` : 'value = ""'}
            </p>
          </div>
        </DemoCard>
        <CodeBlock code={STATIC_SNIPPET} language="tsx" />
      </DocsSection>

      {/* ---- Multi-select with max items ---- */}
      <DocsSection title="Multi-select with maxItems">
        <DemoCard>
          <div className="w-full max-w-sm space-y-3">
            <Autocomplete
              options={HOBBIES}
              multiple
              maxItems={4}
              value={multiValue}
              onChange={(v) => setMultiValue(v as string[])}
              placeholder="Select up to 4 hobbies..."
              clearable
            />
            <p className="text-center font-mono text-xs text-white/40">
              {multiValue.length > 0
                ? `value = [${multiValue.map((v) => `"${v}"`).join(', ')}]`
                : 'value = []'}
            </p>
          </div>
        </DemoCard>
        <CodeBlock code={MULTI_SNIPPET} language="tsx" />
      </DocsSection>

      {/* ---- Async search ---- */}
      <DocsSection title="Async search">
        <DemoCard>
          <div className="w-full max-w-sm space-y-3">
            <Autocomplete
              onSearch={mockAsyncSearch}
              debounceMs={300}
              value={asyncValue}
              onChange={(v) => setAsyncValue(v as string)}
              placeholder="Search cities..."
              clearable
            />
            <p className="text-center font-mono text-xs text-white/40">
              {asyncValue ? `value = "${asyncValue}"` : 'value = ""'}
            </p>
          </div>
        </DemoCard>
        <CodeBlock code={ASYNC_SNIPPET} language="tsx" />
      </DocsSection>

      {/* ---- Creatable single ---- */}
      <DocsSection title="Creatable single select">
        <DemoCard>
          <div className="w-full max-w-sm space-y-3">
            <Autocomplete
              options={COLORS}
              creatable
              onCreate={(v) => console.log('Created:', v)}
              value={creatableSingle}
              onChange={(v) => setCreatableSingle(v as string)}
              placeholder="Pick or create a color..."
              clearable
            />
            <p className="text-center font-mono text-xs text-white/40">
              {creatableSingle
                ? `value = "${creatableSingle}"`
                : 'value = ""'}
            </p>
          </div>
        </DemoCard>
        <CodeBlock code={CREATABLE_SNIPPET} language="tsx" />
      </DocsSection>

      {/* ---- Creatable multi ---- */}
      <DocsSection title="Creatable multi-select">
        <DemoCard>
          <div className="w-full max-w-sm space-y-3">
            <Autocomplete
              options={COLORS}
              creatable
              multiple
              maxItems={5}
              onCreate={(v) => console.log('Created:', v)}
              value={creatableMulti}
              onChange={(v) => setCreatableMulti(v as string[])}
              placeholder="Pick or create colors..."
              clearable
            />
            <p className="text-center font-mono text-xs text-white/40">
              {creatableMulti.length > 0
                ? `value = [${creatableMulti.map((v) => `"${v}"`).join(', ')}]`
                : 'value = []'}
            </p>
          </div>
        </DemoCard>
      </DocsSection>

      {/* ---- Error state ---- */}
      <DocsSection title="Error state">
        <DemoCard>
          <div className="w-full max-w-sm space-y-3">
            <Autocomplete
              options={FRAMEWORKS}
              value={errorDemo}
              onChange={(v) => setErrorDemo(v as string)}
              placeholder="Select framework..."
              error={showError ? 'This field is required' : undefined}
            />
          </div>
        </DemoCard>
        <ControlsRow>
          <Button
            size="sm"
            variant={showError ? 'default' : 'outline'}
            onClick={() => setShowError((v) => !v)}
          >
            Error
          </Button>
        </ControlsRow>
      </DocsSection>

      {/* ---- Disabled ---- */}
      <DocsSection title="Disabled state">
        <DemoCard>
          <div className="w-full max-w-sm">
            <Autocomplete
              options={FRAMEWORKS}
              value={disabledDemo}
              onChange={(v) => setDisabledDemo(v as string)}
              placeholder="Select framework..."
              disabled={showDisabled}
            />
          </div>
        </DemoCard>
        <ControlsRow>
          <Button
            size="sm"
            variant={showDisabled ? 'default' : 'outline'}
            onClick={() => setShowDisabled((v) => !v)}
          >
            Disabled
          </Button>
        </ControlsRow>
      </DocsSection>

      {/* ---- Clearable ---- */}
      <DocsSection title="Clearable">
        <DemoCard>
          <div className="w-full max-w-sm space-y-3">
            <Autocomplete
              options={FRAMEWORKS}
              value={clearableDemo}
              onChange={(v) => setClearableDemo(v as string)}
              placeholder="Select and clear..."
              clearable
            />
            <p className="text-center font-mono text-xs text-white/40">
              {clearableDemo ? `value = "${clearableDemo}"` : 'value = ""'}
            </p>
          </div>
        </DemoCard>
      </DocsSection>

      {/* ---- RHF Integration ---- */}
      <DocsSection title="React Hook Form">
        <CodeBlock code={RHF_SNIPPET} language="tsx" />
      </DocsSection>

      {/* ---- Props ---- */}
      <DocsSection title="Props">
        <PropsTable
          props={[
            { name: 'options', type: 'Option[]', description: 'Static option array for client-side filtering.' },
            { name: 'onSearch', type: '(query: string) => Promise<Option[]>', description: 'Async search callback. Called with debounce.' },
            { name: 'multiple', type: 'boolean', default: 'false', description: 'Enable multi-select with badge chips.' },
            { name: 'creatable', type: 'boolean', default: 'false', description: 'Allow creating new options not in the list.' },
            { name: 'onCreate', type: '(value: string) => void', description: 'Called when a new option is created.' },
            { name: 'value', type: 'string | string[]', description: 'Controlled selected value(s).' },
            { name: 'onChange', type: '(value: string | string[]) => void', description: 'Fires when selection changes.' },
            { name: 'defaultValue', type: 'string | string[]', description: 'Initial value for uncontrolled usage.' },
            { name: 'debounceMs', type: 'number', default: '300', description: 'Debounce delay for async onSearch.' },
            { name: 'minChars', type: 'number', default: '1', description: 'Min characters before onSearch fires.' },
            { name: 'maxItems', type: 'number', description: 'Max selectable items in multi-select mode.' },
            { name: 'clearable', type: 'boolean', default: 'false', description: 'Show X button to clear all selection.' },
            { name: 'placeholder', type: 'string', default: '"Select..."', description: 'Placeholder text in trigger.' },
            { name: 'searchPlaceholder', type: 'string', default: '"Search..."', description: 'Placeholder in search input.' },
            { name: 'emptyMessage', type: 'string', default: '"No results found"', description: 'Message when no options match.' },
            { name: 'loadingMessage', type: 'string', default: '"Searching..."', description: 'Message during async loading.' },
            { name: 'disabled', type: 'boolean', default: 'false', description: 'Disable the entire component.' },
            { name: 'error', type: 'string', description: 'Error message — shows red border and text below.' },
            { name: 'name', type: 'string', description: 'Hidden input name for native form submission.' },
            { name: 'className', type: 'string', description: 'Additional classes for the wrapper.' },
            { name: 'popoverWidth', type: "'trigger' | 'auto'", default: "'trigger'", description: 'Popover width — match trigger or auto-size.' },
          ]}
        />
      </DocsSection>

      {/* ---- Option type ---- */}
      <DocsSection title="Option type">
        <PropsTable
          props={[
            { name: 'label', type: 'string', description: 'Display text for the option.' },
            { name: 'value', type: 'string', description: 'Unique value identifier.' },
            { name: 'description', type: 'string', description: 'Muted subtitle shown below label.' },
            { name: 'icon', type: 'ReactNode', description: 'Icon shown left of label.' },
            { name: 'disabled', type: 'boolean', description: 'Disable this option.' },
            { name: 'group', type: 'string', description: 'Group options under a heading.' },
          ]}
        />
      </DocsSection>

      {/* ---- Dependencies ---- */}
      <DocsSection title="Dependencies">
        <div className="flex flex-wrap gap-2">
          {['framer-motion', 'cmdk', '@radix-ui/react-popover'].map((d) => (
            <code
              key={d}
              className="rounded-md border border-white/10 bg-white/[0.04] px-2 py-1 font-mono text-xs text-white/80"
            >
              {d}
            </code>
          ))}
        </div>
      </DocsSection>
    </DocsPage>
  )
}
