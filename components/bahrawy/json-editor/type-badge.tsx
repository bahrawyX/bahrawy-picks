'use client'

import { cn } from '@/lib/utils'

export type JsonType = 'string' | 'number' | 'boolean' | 'null' | 'object' | 'array'

const typeColors: Record<JsonType, string> = {
  string: 'bg-green-500/15 text-green-400',
  number: 'bg-blue-500/15 text-blue-400',
  boolean: 'bg-amber-500/15 text-amber-400',
  null: 'bg-red-500/15 text-red-400',
  object: 'bg-purple-500/15 text-purple-400',
  array: 'bg-cyan-500/15 text-cyan-400',
}

export function getJsonType(value: unknown): JsonType {
  if (value === null) return 'null'
  if (Array.isArray(value)) return 'array'
  return typeof value as JsonType
}

export function TypeBadge({ type }: { type: JsonType }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-md px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wider',
        typeColors[type],
      )}
    >
      {type}
    </span>
  )
}
