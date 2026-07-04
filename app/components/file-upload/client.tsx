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

const PROGRESS_SNIPPET = `// Call report(0–100) to drive the progress bar with real numbers.
// Until the first report the bar renders as indeterminate.
<FileUpload
  onUpload={(file, report) =>
    new Promise<void>((resolve, reject) => {
      const xhr = new XMLHttpRequest()
      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) report((e.loaded / e.total) * 100)
      }
      xhr.onload = () =>
        xhr.status < 400 ? resolve() : reject(new Error('Upload failed'))
      xhr.onerror = () => reject(new Error('Network error'))
      const form = new FormData()
      form.append('file', file)
      xhr.open('POST', '/api/upload')
      xhr.send(form)
    })
  }
/>`

/** Demo stand-in for a real transfer: reports progress in timed chunks. */
async function fakeUploadWithProgress(
  _file: File,
  report: (pct: number) => void,
) {
  for (let pct = 0; pct <= 100; pct += 8) {
    await new Promise((r) => setTimeout(r, 120))
    report(pct)
  }
}

export default function FileUploadDocs() {
  const [disabled, setDisabled] = useState(false)

  return (
    <DocsPage
      category="32 · form"
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

      {/* ---- Real progress ---- */}
      <DocsSection title="Real upload progress">
        <DemoCard>
          <div className="w-full max-w-lg">
            <FileUpload multiple onUpload={fakeUploadWithProgress} />
          </div>
        </DemoCard>
        <CodeBlock code={PROGRESS_SNIPPET} language="tsx" />
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
            { name: 'onUpload', type: '(file: File, report: (pct: number) => void) => Promise<void>', description: 'Async upload handler per file. Call report(0–100) to drive the progress bar; the bar is indeterminate until the first report. A rejected promise marks the file failed. Without onUpload, files complete instantly.' },
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
