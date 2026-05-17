'use client'

import { useState } from 'react'
import { FileUpload } from '@/components/bahrawy/file-upload'
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

const SNIPPET = `import { FileUpload } from '@/components/bahrawy'

<FileUpload
  accept="image/*"
  maxSize={5 * 1024 * 1024}
  maxFiles={5}
  multiple
  onUpload={async (file) => {
    const form = new FormData()
    form.append('file', file)
    await fetch('/api/upload', { method: 'POST', body: form })
  }}
  onChange={(files) => console.log('Files:', files)}
/>`

export default function FileUploadDocs() {
  const [disabled, setDisabled] = useState(false)

  return (
    <DocsPage
      category="06 · form"
      title="File upload"
      slug="file-upload"
      description="Drag-and-drop file upload with animated file cards, per-file progress tracking, MIME type filtering, and size validation. Built on Framer Motion."
    >
      {/* ---- Multi file ---- */}
      <DocsSection title="Multi file upload">
        <DemoCard>
          <div className="w-full max-w-lg">
            <FileUpload
              multiple
              maxFiles={5}
              disabled={disabled}
              onUpload={async () => {
                await new Promise((r) => setTimeout(r, 1200))
              }}
            />
          </div>
        </DemoCard>
        <ControlsRow>
          <ControlLabel>State</ControlLabel>
          <Button
            size="sm"
            variant={disabled ? 'default' : 'outline'}
            onClick={() => setDisabled((v) => !v)}
          >
            Disabled
          </Button>
        </ControlsRow>
      </DocsSection>

      {/* ---- Single file ---- */}
      <DocsSection title="Single file">
        <DemoCard>
          <div className="w-full max-w-lg">
            <FileUpload
              multiple={false}
              onUpload={async () => {
                await new Promise((r) => setTimeout(r, 800))
              }}
            />
          </div>
        </DemoCard>
      </DocsSection>

      {/* ---- Images only, max 2 MB ---- */}
      <DocsSection title="Images only · max 2 MB">
        <DemoCard>
          <div className="w-full max-w-lg">
            <FileUpload
              accept="image/*"
              maxSize={2 * 1024 * 1024}
              multiple
              maxFiles={3}
            />
          </div>
        </DemoCard>
      </DocsSection>

      {/* ---- With upload error ---- */}
      <DocsSection title="Simulated upload error">
        <DemoCard>
          <div className="w-full max-w-lg">
            <FileUpload
              multiple
              onUpload={async () => {
                await new Promise((r) => setTimeout(r, 600))
                throw new Error('Network error')
              }}
            />
          </div>
        </DemoCard>
      </DocsSection>

      <DocsSection title="Usage">
        <CodeBlock code={SNIPPET} language="tsx" />
      </DocsSection>

      <DocsSection title="Props">
        <PropsTable
          props={[
            { name: 'accept', type: 'string', description: 'MIME type filter (e.g. "image/*", "application/pdf").' },
            { name: 'maxSize', type: 'number', description: 'Maximum file size in bytes.' },
            { name: 'maxFiles', type: 'number', description: 'Maximum number of files.' },
            { name: 'multiple', type: 'boolean', default: 'true', description: 'Allow multiple file selection.' },
            { name: 'onUpload', type: '(file: File) => Promise<void>', description: 'Async upload handler per file. Progress is tracked automatically.' },
            { name: 'onChange', type: '(files: File[]) => void', description: 'Called when file list changes (React Hook Form integration).' },
            { name: 'onRemove', type: '(file: File) => void', description: 'Called when a file is removed.' },
            { name: 'disabled', type: 'boolean', default: 'false', description: 'Disable all interaction.' },
          ]}
        />
      </DocsSection>

      <DocsSection title="Dependencies">
        <div className="flex flex-wrap gap-2">
          {['framer-motion'].map((d) => (
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
