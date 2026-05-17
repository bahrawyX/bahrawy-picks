'use client'

import { useState } from 'react'
import { Check, Copy } from 'lucide-react'
import { cn } from '@/lib/utils'

export function CodeBlock({
  code,
  language = 'tsx',
}: {
  code: string
  language?: string
}) {
  const [copied, setCopied] = useState(false)

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      // noop
    }
  }

  return (
    <div className="relative overflow-hidden rounded-xl border border-white/10 bg-black/40">
      <div className="flex items-center justify-between border-b border-white/10 bg-white/[0.02] px-4 py-2">
        <span className="text-xs uppercase tracking-wider text-white/40">
          {language}
        </span>
        <button
          type="button"
          onClick={onCopy}
          className={cn(
            'inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs transition-colors duration-m3-enter ease-m3-enter',
            copied
              ? 'text-white'
              : 'text-white/60 hover:bg-white/5 hover:text-white'
          )}
        >
          {copied ? (
            <Check className="h-3.5 w-3.5" />
          ) : (
            <Copy className="h-3.5 w-3.5" />
          )}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <pre className="max-h-[640px] overflow-auto p-4 text-[12.5px] leading-relaxed text-white/85">
        <code className="font-mono">{code}</code>
      </pre>
    </div>
  )
}
