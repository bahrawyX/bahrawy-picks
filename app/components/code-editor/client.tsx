'use client'

import { useState } from 'react'
import { CodeEditor } from '@/components/bahrawy'
import { CodeBlock } from '@/components/showcase/code-block'
import {
  DemoCard,
  DocsPage,
  DocsSection,
} from '@/components/showcase/docs-page'
import { PropsTable } from '@/components/showcase/props-table'

const SAMPLE_TS = `interface User {
  id: string
  name: string
  email: string
}

function greet(user: User): string {
  return \`Hello, \${user.name}!\`
}

const user: User = {
  id: '1',
  name: 'Ahmed',
  email: 'ahmed@bahrawy.dev',
}

console.log(greet(user))`

const SAMPLE_PY = `def fibonacci(n: int) -> list[int]:
    """Generate Fibonacci sequence."""
    if n <= 0:
        return []
    fib = [0, 1]
    for i in range(2, n):
        fib.append(fib[-1] + fib[-2])
    return fib[:n]

print(fibonacci(10))`

const SAMPLE_CSS = `@layer components {
  .card {
    @apply rounded-2xl border border-white/10
           bg-white/5 p-6 backdrop-blur-sm;
    transition: transform 0.2s ease;
  }

  .card:hover {
    transform: translateY(-2px);
  }
}`

const BASIC_SNIPPET = `import { CodeEditor } from '@/components/bahrawy'

<CodeEditor
  value={code}
  onChange={setCode}
  language="typescript"
/>`

const MULTI_FILE_SNIPPET = `<CodeEditor
  files={[
    { name: 'index.ts', language: 'typescript', content: '...' },
    { name: 'style.css', language: 'css', content: '...' },
  ]}
  onFilesChange={setFiles}
/>`

const RUN_SNIPPET = `<CodeEditor
  value={code}
  onChange={setCode}
  onRun={(code) => {
    try {
      const result = eval(code)
      setOutput(String(result))
    } catch (e) {
      setOutput(String(e))
    }
  }}
  output={output}
  onOutputClear={() => setOutput('')}
/>`

const DIFF_SNIPPET = `<CodeEditor
  diff={{
    original: 'const x = 1',
    modified: 'const x = 2',
    language: 'typescript',
  }}
  diffMode="split"
/>`

export default function CodeEditorDocs() {
  const [code, setCode] = useState(SAMPLE_TS)
  const [output, setOutput] = useState('')
  const [files, setFiles] = useState([
    { name: 'index.ts', language: 'typescript', content: SAMPLE_TS },
    { name: 'style.css', language: 'css', content: SAMPLE_CSS },
    { name: 'fib.py', language: 'python', content: SAMPLE_PY },
  ])

  return (
    <DocsPage
      title="Code Editor"
      slug="code-editor"
      description="Monaco-powered inline code editor with multi-file tabs, diff mode, custom Bahrawy theme, run button, and output panel."
      category="36 · DATA"
    >
      {/* Basic */}
      <DocsSection title="Basic">
        <DemoCard className="items-start">
          <div className="w-full">
            <CodeEditor
              value={code}
              onChange={setCode}
              language="typescript"
              height={320}
            />
          </div>
        </DemoCard>
        <CodeBlock code={BASIC_SNIPPET} language="tsx" />
      </DocsSection>

      {/* Multi-file */}
      <DocsSection title="Multi-file tabs">
        <DemoCard className="items-start">
          <div className="w-full">
            <CodeEditor
              files={files}
              onFilesChange={setFiles}
              height={320}
            />
          </div>
        </DemoCard>
        <CodeBlock code={MULTI_FILE_SNIPPET} language="tsx" />
      </DocsSection>

      {/* With run + output */}
      <DocsSection title="Run & output panel">
        <DemoCard className="items-start">
          <div className="w-full">
            <CodeEditor
              value={'console.log("Hello from Bahrawy!");\nconsole.log(2 + 2);'}
              language="javascript"
              height={240}
              onRun={(c) => {
                try {
                  const logs: string[] = []
                  const mockLog = (...args: unknown[]) =>
                    logs.push(args.map(String).join(' '))
                  const fn = new Function('console', c)
                  fn({ log: mockLog, error: mockLog, warn: mockLog })
                  setOutput(logs.join('\n') || '(no output)')
                } catch (e) {
                  setOutput(String(e))
                }
              }}
              output={output}
              onOutputClear={() => setOutput('')}
            />
          </div>
        </DemoCard>
        <CodeBlock code={RUN_SNIPPET} language="tsx" />
      </DocsSection>

      {/* Read only */}
      <DocsSection title="Read only">
        <DemoCard className="items-start">
          <div className="w-full">
            <CodeEditor
              value={SAMPLE_PY}
              language="python"
              readOnly
              height={260}
            />
          </div>
        </DemoCard>
      </DocsSection>

      {/* Diff mode */}
      <DocsSection title="Diff mode">
        <DemoCard className="items-start">
          <div className="w-full">
            <CodeEditor
              diff={{
                original: `function greet(name: string) {\n  return "Hello, " + name\n}`,
                modified: `function greet(name: string): string {\n  return \`Hello, \${name}!\`\n}`,
                language: 'typescript',
              }}
              diffMode="split"
              height={240}
            />
          </div>
        </DemoCard>
        <CodeBlock code={DIFF_SNIPPET} language="tsx" />
      </DocsSection>

      {/* Light theme */}
      <DocsSection title="Light theme">
        <DemoCard className="items-start">
          <div className="w-full">
            <CodeEditor
              value={SAMPLE_CSS}
              language="css"
              theme="light"
              height={260}
            />
          </div>
        </DemoCard>
      </DocsSection>

      {/* Props */}
      <DocsSection title="Props">
        <PropsTable
          props={[
            { name: 'value', type: 'string', default: '—', description: 'Controlled editor content' },
            { name: 'onChange', type: '(value: string) => void', default: '—', description: 'Called on content change' },
            { name: 'language', type: 'string', default: "'typescript'", description: 'Editor language (typescript, python, css, etc.)' },
            { name: 'theme', type: "'dark' | 'light'", default: "'dark'", description: 'Color theme' },
            { name: 'height', type: 'number | string', default: '400', description: 'Editor height in px or CSS value' },
            { name: 'readOnly', type: 'boolean', default: 'false', description: 'Disable editing' },
            { name: 'showMinimap', type: 'boolean', default: 'false', description: 'Show Monaco minimap' },
            { name: 'files', type: 'EditorFile[]', default: '—', description: 'Multi-file tab list' },
            { name: 'onFilesChange', type: '(files: EditorFile[]) => void', default: '—', description: 'Called when files change' },
            { name: 'onRun', type: '(code: string) => void', default: '—', description: 'Called when run button is clicked' },
            { name: 'output', type: 'string', default: '—', description: 'Output panel content' },
            { name: 'onOutputClear', type: '() => void', default: '—', description: 'Called when clear output button clicked' },
            { name: 'diff', type: '{ original, modified, language }', default: '—', description: 'Renders DiffEditor when provided' },
            { name: 'diffMode', type: "'split' | 'inline'", default: "'split'", description: 'Diff layout mode' },
            { name: 'fontSize', type: 'number', default: '14', description: 'Editor font size' },
            { name: 'tabSize', type: 'number', default: '2', description: 'Tab size in spaces' },
            { name: 'wordWrap', type: 'boolean', default: 'false', description: 'Enable word wrap' },
            { name: 'className', type: 'string', default: '—', description: 'Additional CSS classes' },
          ]}
        />
      </DocsSection>
    </DocsPage>
  )
}
