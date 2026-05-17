'use client'

import { useState, type ReactNode } from 'react'
import { Code2, Eye, RefreshCw } from 'lucide-react'
import { cn } from '@/lib/utils'
import { CodeBlock } from './code-block'

export function PreviewTabs({
  preview,
  code,
  language,
}: {
  preview: ReactNode
  code: string
  language?: string
}) {
  const [tab, setTab] = useState<'preview' | 'code'>('preview')
  const [reloadKey, setReloadKey] = useState(0)

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <div className="inline-flex items-center gap-1 rounded-lg border border-white/10 bg-white/[0.03] p-1">
          <TabButton active={tab === 'preview'} onClick={() => setTab('preview')}>
            <Eye className="h-3.5 w-3.5" strokeWidth={2} />
            Preview
          </TabButton>
          <TabButton active={tab === 'code'} onClick={() => setTab('code')}>
            <Code2 className="h-3.5 w-3.5" strokeWidth={2} />
            Code
          </TabButton>
        </div>
      </div>

      {tab === 'preview' ? (
        <div className="relative overflow-hidden rounded-xl border border-white/10 bg-black/40">
          <button
            type="button"
            onClick={() => setReloadKey((k) => k + 1)}
            aria-label="Reload preview"
            className="absolute right-3 top-3 z-10 inline-flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-black/60 text-white/60 backdrop-blur transition-colors duration-m3-enter ease-m3-enter hover:bg-white/5 hover:text-white"
          >
            <RefreshCw className="h-3.5 w-3.5" />
          </button>
          <div key={reloadKey}>{preview}</div>
        </div>
      ) : (
        <CodeBlock code={code} language={language} />
      )}
    </div>
  )
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-all duration-m3-enter ease-m3-enter',
        active
          ? 'bg-white/10 text-white shadow-inner shadow-white/5'
          : 'text-white/50 hover:text-white'
      )}
    >
      {children}
    </button>
  )
}
