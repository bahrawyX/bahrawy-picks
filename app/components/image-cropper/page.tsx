'use client'

import { useCallback, useState } from 'react'
import { ImageCropper, type CropResult } from '@/components/bahrawy'
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

const BASIC_SNIPPET = `import { ImageCropper } from '@/components/bahrawy'

<ImageCropper
  onCrop={(result) => {
    console.log(result.width, result.height)
    // result.blob, result.base64
  }}
/>`

const ASPECT_SNIPPET = `<ImageCropper
  aspectRatio={1}
  onCrop={(result) => console.log(result)}
/>`

const WIDESCREEN_SNIPPET = `<ImageCropper
  aspectRatio={16 / 9}
  showGrid
  onCrop={(result) => console.log(result)}
/>`

// A sample image URL for demos with existing images
const SAMPLE_IMAGE = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80'

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function ImageCropperDocs() {
  const [freeResult, setFreeResult] = useState<CropResult | null>(null)
  const [squareResult, setSquareResult] = useState<CropResult | null>(null)
  const [wideResult, setWideResult] = useState<CropResult | null>(null)
  const [editResult, setEditResult] = useState<CropResult | null>(null)

  const handleFree = useCallback((r: CropResult) => setFreeResult(r), [])
  const handleSquare = useCallback((r: CropResult) => setSquareResult(r), [])
  const handleWide = useCallback((r: CropResult) => setWideResult(r), [])
  const handleEdit = useCallback((r: CropResult) => setEditResult(r), [])

  return (
    <DocsPage
      title="Image Cropper"
      slug="image-cropper"
      description="Canvas-based image cropper with drag-to-crop, zoom, rotation, flip, aspect ratio presets, and file output."
      category="07 · DATA"
    >
      {/* ---- Free crop ---- */}
      <DocsSection title="Free crop (upload)">
        <DemoCard>
          <div className="flex items-start gap-6">
            <ImageCropper onCrop={handleFree} />
            {freeResult && (
              <div className="space-y-1">
                <img
                  src={freeResult.base64}
                  alt="Cropped"
                  className="h-32 rounded-lg border border-white/10 object-contain"
                />
                <p className="text-xs text-white/30">
                  {freeResult.width}×{freeResult.height}px
                </p>
              </div>
            )}
          </div>
        </DemoCard>
        <CodeBlock code={BASIC_SNIPPET} language="tsx" />
      </DocsSection>

      {/* ---- Square (1:1) ---- */}
      <DocsSection title="Square (1:1)">
        <DemoCard>
          <div className="flex items-start gap-6">
            <ImageCropper aspectRatio={1} onCrop={handleSquare} />
            {squareResult && (
              <div className="space-y-1">
                <img
                  src={squareResult.base64}
                  alt="Cropped"
                  className="h-32 w-32 rounded-lg border border-white/10 object-cover"
                />
                <p className="text-xs text-white/30">
                  {squareResult.width}×{squareResult.height}px
                </p>
              </div>
            )}
          </div>
        </DemoCard>
        <CodeBlock code={ASPECT_SNIPPET} language="tsx" />
      </DocsSection>

      {/* ---- Widescreen (16:9) ---- */}
      <DocsSection title="Widescreen (16:9)">
        <DemoCard>
          <div className="flex items-start gap-6">
            <ImageCropper aspectRatio={16 / 9} onCrop={handleWide} />
            {wideResult && (
              <div className="space-y-1">
                <img
                  src={wideResult.base64}
                  alt="Cropped"
                  className="h-24 rounded-lg border border-white/10 object-contain"
                />
                <p className="text-xs text-white/30">
                  {wideResult.width}×{wideResult.height}px
                </p>
              </div>
            )}
          </div>
        </DemoCard>
        <CodeBlock code={WIDESCREEN_SNIPPET} language="tsx" />
      </DocsSection>

      {/* ---- Existing image ---- */}
      <DocsSection title="Edit existing image">
        <DemoCard>
          <div className="flex items-start gap-6">
            <ImageCropper
              src={SAMPLE_IMAGE}
              onCrop={handleEdit}
            />
            {editResult && (
              <div className="space-y-1">
                <img
                  src={editResult.base64}
                  alt="Cropped"
                  className="h-32 rounded-lg border border-white/10 object-contain"
                />
                <p className="text-xs text-white/30">
                  {editResult.width}×{editResult.height}px
                </p>
              </div>
            )}
          </div>
        </DemoCard>
      </DocsSection>

      {/* ---- Props ---- */}
      <DocsSection title="Props">
        <PropsTable
          props={[
            { name: 'src', type: 'string', default: '—', description: 'Existing image URL to edit' },
            { name: 'onCrop', type: '(result: CropResult) => void', default: '—', description: 'Called with blob, base64, width, height after crop' },
            { name: 'aspectRatio', type: 'number', default: '—', description: 'Fixed aspect ratio (e.g. 1 for square, 16/9 for widescreen)' },
            { name: 'minWidth', type: 'number', default: '50', description: 'Minimum crop width in pixels' },
            { name: 'minHeight', type: 'number', default: '50', description: 'Minimum crop height in pixels' },
            { name: 'outputFormat', type: "'jpeg' | 'png' | 'webp'", default: "'jpeg'", description: 'Output image format' },
            { name: 'outputQuality', type: 'number', default: '0.92', description: 'Output quality 0–1' },
            { name: 'showGrid', type: 'boolean', default: 'true', description: 'Show rule-of-thirds grid lines' },
            { name: 'allowRotation', type: 'boolean', default: 'true', description: 'Show rotation slider' },
            { name: 'allowFlip', type: 'boolean', default: 'true', description: 'Show flip buttons' },
            { name: 'maxZoom', type: 'number', default: '3', description: 'Maximum zoom level' },
            { name: 'className', type: 'string', default: '—', description: 'Additional CSS classes' },
          ]}
        />
      </DocsSection>
    </DocsPage>
  )
}
