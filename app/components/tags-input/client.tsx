'use client'

import { useState } from 'react'
import { TagsInput } from '@/components/bahrawy'
import { CodeBlock } from '@/components/showcase/code-block'
import {
  DemoCard,
  DocsPage,
  DocsSection,
} from '@/components/showcase/docs-page'
import { PropsTable } from '@/components/showcase/props-table'

// ---------------------------------------------------------------------------
// Snippets
// ---------------------------------------------------------------------------

const BASIC_SNIPPET = `import { TagsInput } from '@/components/bahrawy'

<TagsInput
  placeholder="Add a technology…"
  onChange={(tags) => console.log(tags)}
/>`

const MAX_SNIPPET = `<TagsInput
  maxTags={5}
  placeholder="Max 5 tags…"
  onChange={(tags) => console.log(tags)}
/>`

const SUGGESTIONS_SNIPPET = `<TagsInput
  placeholder="Type to see suggestions…"
  suggestions={['React', 'Vue', 'Angular', 'Svelte', 'Next.js', 'Nuxt', 'Remix']}
  onChange={(tags) => console.log(tags)}
/>`

const VALIDATE_SNIPPET = `<TagsInput
  placeholder="Emails only…"
  validate={(tag) =>
    /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(tag)
      ? true
      : 'Must be a valid email'
  }
  onChange={(tags) => console.log(tags)}
/>`

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function TagsInputDocs() {
  const [basic, setBasic] = useState<string[]>(['React', 'TypeScript'])
  const [maxTags, setMaxTags] = useState<string[]>(['Design', 'Code', 'Ship'])
  const [withSuggestions, setWithSuggestions] = useState<string[]>([])
  const [validated, setValidated] = useState<string[]>([])
  const [disabled] = useState<string[]>(['Read-only', 'Tags'])
  const [errored, setErrored] = useState<string[]>(['Invalid'])

  return (
    <DocsPage
      title="Tags Input"
      slug="tags-input"
      description="Multi-tag text input with chip UI, auto-suggestions, validation, and animated add/remove transitions."
      category="43 · DATA"
    >
      {/* ---- Basic ---- */}
      <DocsSection title="Basic">
        <DemoCard>
          <div className="mx-auto w-full max-w-md">
            <TagsInput
              value={basic}
              onChange={setBasic}
              placeholder="Add a technology…"
            />
          </div>
        </DemoCard>
        <CodeBlock code={BASIC_SNIPPET} language="tsx" />
      </DocsSection>

      {/* ---- Max tags ---- */}
      <DocsSection title="Max tags (5)">
        <DemoCard>
          <div className="mx-auto w-full max-w-md">
            <TagsInput
              value={maxTags}
              onChange={setMaxTags}
              maxTags={5}
              placeholder="Max 5 tags…"
            />
          </div>
        </DemoCard>
        <CodeBlock code={MAX_SNIPPET} language="tsx" />
      </DocsSection>

      {/* ---- With suggestions ---- */}
      <DocsSection title="With suggestions">
        <DemoCard>
          <div className="mx-auto w-full max-w-md">
            <TagsInput
              value={withSuggestions}
              onChange={setWithSuggestions}
              placeholder="Type a framework…"
              suggestions={[
                'React',
                'Vue',
                'Angular',
                'Svelte',
                'Next.js',
                'Nuxt',
                'Remix',
                'SolidJS',
                'Astro',
                'Qwik',
              ]}
            />
          </div>
        </DemoCard>
        <CodeBlock code={SUGGESTIONS_SNIPPET} language="tsx" />
      </DocsSection>

      {/* ---- With validation ---- */}
      <DocsSection title="With validation (emails only)">
        <DemoCard>
          <div className="mx-auto w-full max-w-md">
            <TagsInput
              value={validated}
              onChange={setValidated}
              placeholder="Enter email addresses…"
              validate={(tag) =>
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(tag)
                  ? true
                  : 'Must be a valid email'
              }
            />
          </div>
        </DemoCard>
        <CodeBlock code={VALIDATE_SNIPPET} language="tsx" />
      </DocsSection>

      {/* ---- Error state ---- */}
      <DocsSection title="Error state">
        <DemoCard>
          <div className="mx-auto w-full max-w-md">
            <TagsInput
              value={errored}
              onChange={setErrored}
              error="Please add at least 3 tags"
              placeholder="Add tags…"
            />
          </div>
        </DemoCard>
      </DocsSection>

      {/* ---- Disabled ---- */}
      <DocsSection title="Disabled">
        <DemoCard>
          <div className="mx-auto w-full max-w-md">
            <TagsInput value={disabled} disabled />
          </div>
        </DemoCard>
      </DocsSection>

      {/* ---- Props ---- */}
      <DocsSection title="Props">
        <PropsTable
          props={[
            { name: 'value', type: 'string[]', default: '—', description: 'Controlled tag list' },
            { name: 'onChange', type: '(tags: string[]) => void', default: '—', description: 'Called on tag add/remove' },
            { name: 'defaultValue', type: 'string[]', default: '[]', description: 'Uncontrolled initial tags' },
            { name: 'placeholder', type: 'string', default: "'Add a tag…'", description: 'Input placeholder text' },
            { name: 'maxTags', type: 'number', default: '—', description: 'Maximum number of tags allowed' },
            { name: 'allowDuplicates', type: 'boolean', default: 'false', description: 'Allow duplicate tag values' },
            { name: 'delimiter', type: "string | string[]", default: "[',', 'Enter']", description: 'Keys that trigger tag creation' },
            { name: 'suggestions', type: 'string[]', default: '—', description: 'Static suggestion list for dropdown' },
            { name: 'validate', type: '(tag: string) => boolean | string', default: '—', description: 'Validation function — return true or error string' },
            { name: 'disabled', type: 'boolean', default: 'false', description: 'Disable the input' },
            { name: 'error', type: 'string', default: '—', description: 'Error message shown below' },
            { name: 'className', type: 'string', default: '—', description: 'Additional CSS classes' },
          ]}
        />
      </DocsSection>
    </DocsPage>
  )
}
