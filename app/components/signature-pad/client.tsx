'use client'

import { useState } from 'react'
import { SignaturePad, type SignatureResult } from '@/components/bahrawy'
import { CodeBlock } from '@/components/showcase/code-block'
import {
  DemoCard,
  DocsPage,
  DocsSection,
} from '@/components/showcase/docs-page'
import { PropsTable } from '@/components/showcase/props-table'

const BASIC_SNIPPET = `import { SignaturePad } from '@/components/bahrawy'

<SignaturePad
  onSignature={(result) => {
    console.log(result.base64)
    // result.blob, result.svg, result.isEmpty
  }}
/>`

const CUSTOM_SNIPPET = `<SignaturePad
  strokeColor="#60a5fa"
  strokeWidth={4}
  height={250}
  exportFormat="png"
/>`

export default function SignaturePadDocs() {
  const [result, setResult] = useState<SignatureResult | null>(null)
  const [customResult, setCustomResult] = useState<SignatureResult | null>(null)

  return (
    <DocsPage
      title="Signature Pad"
      slug="signature-pad"
      description="Canvas-based signature pad with draw and type modes, bezier smoothing, velocity-based stroke width, and export to PNG/JPEG/SVG."
      category="23 · FORM"
    >
      {/* Basic */}
      <DocsSection title="Basic">
        <DemoCard className="flex-col gap-4">
          <div className="w-full max-w-lg">
            <SignaturePad onSignature={setResult} />
          </div>
          {result && result.base64 && (
            <div className="flex items-center gap-3">
              <img
                src={result.base64}
                alt="Signature"
                className="h-16 rounded-lg border border-white/10 bg-white/5 object-contain px-4"
              />
              <p className="text-xs text-white/30">Exported</p>
            </div>
          )}
        </DemoCard>
        <CodeBlock code={BASIC_SNIPPET} language="tsx" />
      </DocsSection>

      {/* Custom colors */}
      <DocsSection title="Custom stroke color">
        <DemoCard className="flex-col gap-4">
          <div className="w-full max-w-lg">
            <SignaturePad
              strokeColor="#60a5fa"
              strokeWidth={4}
              height={250}
              onSignature={setCustomResult}
            />
          </div>
          {customResult && customResult.base64 && (
            <div className="flex items-center gap-3">
              <img
                src={customResult.base64}
                alt="Signature"
                className="h-16 rounded-lg border border-white/10 bg-white/5 object-contain px-4"
              />
            </div>
          )}
        </DemoCard>
        <CodeBlock code={CUSTOM_SNIPPET} language="tsx" />
      </DocsSection>

      {/* Thin stroke */}
      <DocsSection title="Thin stroke">
        <DemoCard>
          <div className="w-full max-w-lg">
            <SignaturePad strokeWidth={1.5} smoothing={0.8} />
          </div>
        </DemoCard>
      </DocsSection>

      {/* Disabled */}
      <DocsSection title="Disabled">
        <DemoCard>
          <div className="w-full max-w-lg">
            <SignaturePad disabled />
          </div>
        </DemoCard>
      </DocsSection>

      {/* Props */}
      <DocsSection title="Props">
        <PropsTable
          props={[
            { name: 'onSignature', type: '(result: SignatureResult) => void', default: '—', description: 'Called with blob, base64, and optional SVG on export' },
            { name: 'mode', type: "'draw' | 'type'", default: "'draw'", description: 'Default input mode' },
            { name: 'strokeColor', type: 'string', default: "'#ffffff'", description: 'Stroke/text color' },
            { name: 'strokeWidth', type: 'number', default: '3', description: 'Maximum stroke width in pixels' },
            { name: 'smoothing', type: 'number', default: '0.5', description: 'Stroke smoothing factor (0–1)' },
            { name: 'exportFormat', type: "'png' | 'jpeg' | 'svg'", default: "'png'", description: 'Export image format' },
            { name: 'exportQuality', type: 'number', default: '0.92', description: 'Export quality (0–1)' },
            { name: 'height', type: 'number', default: '200', description: 'Canvas height in pixels' },
            { name: 'placeholder', type: 'string', default: "'Sign here'", description: 'Placeholder text shown when empty' },
            { name: 'disabled', type: 'boolean', default: 'false', description: 'Disable the signature pad' },
            { name: 'className', type: 'string', default: '—', description: 'Additional CSS classes' },
          ]}
        />
      </DocsSection>
    </DocsPage>
  )
}
