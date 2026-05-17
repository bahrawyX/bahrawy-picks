'use client'

interface DateSeparatorProps {
  label: string
}

export function DateSeparator({ label }: DateSeparatorProps) {
  return (
    <div className="sticky top-0 z-10 -mx-1 px-1 py-2 backdrop-blur-sm animate-tl-fade-up">
      <span className="text-xs font-medium text-white/30">
        {label}
      </span>
    </div>
  )
}
