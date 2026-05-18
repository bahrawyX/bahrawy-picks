'use client'

import { useState } from 'react'
import { RatingInput } from '@/components/bahrawy'
import { CodeBlock } from '@/components/showcase/code-block'
import {
  DemoCard,
  DocsPage,
  DocsSection,
} from '@/components/showcase/docs-page'
import { PropsTable } from '@/components/showcase/props-table'

const BASIC_SNIPPET = `import { RatingInput } from '@/components/bahrawy'

<RatingInput
  onChange={(value) => console.log(value)}
/>`

const HEART_SNIPPET = `<RatingInput variant="heart" />`

const EMOJI_SNIPPET = `<RatingInput variant="emoji" />`

export default function RatingInputDocs() {
  const [val, setVal] = useState(0)

  return (
    <DocsPage
      title="Rating Input"
      slug="rating-input"
      description="Interactive rating input with star, heart, emoji, and thumb variants, half-star precision, and labels."
      category="08 · FORM"
    >
      {/* Star (default) */}
      <DocsSection title="Stars (default)">
        <DemoCard>
          <div className="flex flex-col items-center gap-3">
            <RatingInput value={val} onChange={setVal} />
            {val > 0 && (
              <p className="text-xs text-white/40">Rating: {val}</p>
            )}
          </div>
        </DemoCard>
        <CodeBlock code={BASIC_SNIPPET} language="tsx" />
      </DocsSection>

      {/* Hearts */}
      <DocsSection title="Hearts">
        <DemoCard>
          <RatingInput variant="heart" />
        </DemoCard>
        <CodeBlock code={HEART_SNIPPET} language="tsx" />
      </DocsSection>

      {/* Emojis */}
      <DocsSection title="Emojis">
        <DemoCard>
          <RatingInput variant="emoji" />
        </DemoCard>
        <CodeBlock code={EMOJI_SNIPPET} language="tsx" />
      </DocsSection>

      {/* Thumbs */}
      <DocsSection title="Thumbs">
        <DemoCard>
          <RatingInput variant="thumb" />
        </DemoCard>
      </DocsSection>

      {/* Half stars */}
      <DocsSection title="Half-star precision">
        <DemoCard>
          <RatingInput allowHalf />
        </DemoCard>
      </DocsSection>

      {/* With labels */}
      <DocsSection title="With labels">
        <DemoCard>
          <RatingInput labels={['Terrible', 'Bad', 'OK', 'Good', 'Amazing']} />
        </DemoCard>
      </DocsSection>

      {/* Large */}
      <DocsSection title="Large size">
        <DemoCard>
          <RatingInput size="lg" />
        </DemoCard>
      </DocsSection>

      {/* Read-only */}
      <DocsSection title="Read-only">
        <DemoCard>
          <RatingInput readOnly value={4} />
        </DemoCard>
      </DocsSection>

      {/* Disabled */}
      <DocsSection title="Disabled">
        <DemoCard>
          <RatingInput disabled value={2} />
        </DemoCard>
      </DocsSection>

      {/* Props */}
      <DocsSection title="Props">
        <PropsTable
          props={[
            { name: 'value', type: 'number', default: '0', description: 'Controlled rating value' },
            { name: 'onChange', type: '(value: number) => void', default: '—', description: 'Called when rating changes' },
            { name: 'max', type: 'number', default: '5', description: 'Maximum rating value' },
            { name: 'variant', type: "'star' | 'heart' | 'emoji' | 'thumb'", default: "'star'", description: 'Visual style' },
            { name: 'allowHalf', type: 'boolean', default: 'false', description: 'Allow half-star precision' },
            { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Icon size' },
            { name: 'labels', type: 'string[]', default: '—', description: 'Text labels for each star' },
            { name: 'disabled', type: 'boolean', default: 'false', description: 'Disable input' },
            { name: 'readOnly', type: 'boolean', default: 'false', description: 'Read-only mode' },
            { name: 'className', type: 'string', default: '—', description: 'Additional CSS classes' },
          ]}
        />
      </DocsSection>
    </DocsPage>
  )
}
