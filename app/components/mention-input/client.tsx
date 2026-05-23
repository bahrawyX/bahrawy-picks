'use client'

import { useCallback, useState } from 'react'
import { MentionInput } from '@/components/bahrawy'
import type { MentionSuggestion } from '@/components/bahrawy/mention-input'
import { CodeBlock } from '@/components/showcase/code-block'
import {
  DemoCard,
  DocsPage,
  DocsSection,
} from '@/components/showcase/docs-page'
import { PropsTable } from '@/components/showcase/props-table'

const SAMPLE_USERS: MentionSuggestion[] = [
  { id: '1', name: 'Alice Johnson', description: 'Engineering', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alice' },
  { id: '2', name: 'Bob Smith', description: 'Design', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bob' },
  { id: '3', name: 'Carol Williams', description: 'Product', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Carol' },
  { id: '4', name: 'Dave Brown', description: 'Marketing', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Dave' },
  { id: '5', name: 'Eve Davis', description: 'Engineering', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Eve' },
  { id: '6', name: 'Frank Wilson', description: 'Sales', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Frank' },
]

const BASIC_SNIPPET = `import { MentionInput } from '@/components/bahrawy'

const users = [
  { id: '1', name: 'Alice Johnson', description: 'Engineering' },
  { id: '2', name: 'Bob Smith', description: 'Design' },
]

<MentionInput
  suggestions={users}
  onChange={(text, mentions) => {
    console.log(text, mentions)
  }}
/>`

const MULTILINE_SNIPPET = `<MentionInput
  multiline
  suggestions={users}
  placeholder="Write a comment... use @ to mention"
/>`

export default function MentionInputDocs() {
  const [text, setText] = useState('')

  return (
    <DocsPage
      title="Mention Input"
      slug="mention-input"
      description="ContentEditable input with @mention support, cursor-positioned dropdown, and mention chip rendering."
      category="25 · FORM"
    >
      {/* Basic */}
      <DocsSection title="Basic">
        <DemoCard>
          <div className="w-full max-w-lg">
            <MentionInput
              suggestions={SAMPLE_USERS}
              onChange={(t) => setText(t)}
              placeholder="Type @ to mention someone..."
            />
            {text && (
              <p className="mt-2 text-xs text-white/30 break-all">
                Output: {text}
              </p>
            )}
          </div>
        </DemoCard>
        <CodeBlock code={BASIC_SNIPPET} language="tsx" />
      </DocsSection>

      {/* Multiline */}
      <DocsSection title="Multiline">
        <DemoCard>
          <div className="w-full max-w-lg">
            <MentionInput
              multiline
              suggestions={SAMPLE_USERS}
              placeholder="Write a comment... use @ to mention"
            />
          </div>
        </DemoCard>
        <CodeBlock code={MULTILINE_SNIPPET} language="tsx" />
      </DocsSection>

      {/* Without avatars */}
      <DocsSection title="Without avatars">
        <DemoCard>
          <div className="w-full max-w-lg">
            <MentionInput
              suggestions={SAMPLE_USERS.map(({ avatar, ...rest }) => rest)}
              placeholder="Mention a team member..."
            />
          </div>
        </DemoCard>
      </DocsSection>

      {/* Error */}
      <DocsSection title="Error state">
        <DemoCard>
          <div className="w-full max-w-lg">
            <MentionInput
              suggestions={SAMPLE_USERS}
              error="At least one mention is required"
            />
          </div>
        </DemoCard>
      </DocsSection>

      {/* Disabled */}
      <DocsSection title="Disabled">
        <DemoCard>
          <div className="w-full max-w-lg">
            <MentionInput disabled suggestions={[]} />
          </div>
        </DemoCard>
      </DocsSection>

      {/* Props */}
      <DocsSection title="Props">
        <PropsTable
          props={[
            { name: 'value', type: 'string', default: '—', description: 'Controlled text value' },
            { name: 'onChange', type: '(text: string, mentions: MentionData[]) => void', default: '—', description: 'Called on text or mention change' },
            { name: 'trigger', type: 'string', default: "'@'", description: 'Character that triggers the mention dropdown' },
            { name: 'suggestions', type: 'MentionSuggestion[]', default: '[]', description: 'Array of suggestions with id, name, avatar, description' },
            { name: 'onSearch', type: '(query: string) => void', default: '—', description: 'Called when search query changes (for async search)' },
            { name: 'loading', type: 'boolean', default: 'false', description: 'Show loading spinner in dropdown' },
            { name: 'placeholder', type: 'string', default: "'Type @ to mention...'", description: 'Placeholder text' },
            { name: 'disabled', type: 'boolean', default: 'false', description: 'Disable the input' },
            { name: 'maxLength', type: 'number', default: '—', description: 'Maximum text length' },
            { name: 'multiline', type: 'boolean', default: 'false', description: 'Allow multi-line input' },
            { name: 'error', type: 'string', default: '—', description: 'Error message' },
            { name: 'className', type: 'string', default: '—', description: 'Additional CSS classes' },
          ]}
        />
      </DocsSection>
    </DocsPage>
  )
}
