'use client'

export interface ProgressBarProps {
  progress: number
}

export function ProgressBar({ progress }: ProgressBarProps) {
  return (
    <div className="h-[2px] w-full overflow-hidden rounded-full bg-white/10">
      <div
        className="h-full rounded-full bg-white/80"
        style={{ width: `${progress * 100}%` }}
      />
    </div>
  )
}
