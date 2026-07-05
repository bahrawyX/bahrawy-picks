'use client'

/**
 * <Terminal />
 *
 * A live-looking terminal that auto-types a scripted sequence —
 * command, output, pause, command, output… — like the demo terminals
 * on the Vercel and Stripe homepages. A blinking cursor sits at the
 * write head; the whole thing pauses on hover so a visitor can read
 * mid-stream; an optional play/pause/replay control sits in the top
 * bar.
 *
 * Loop the sequence with `loop`, or let it stop at the end.
 */

import * as React from 'react'
import { motion } from 'framer-motion'
import { Play, Pause, RotateCcw } from 'lucide-react'
import { cn } from '@/lib/utils'

export type TerminalVariant = 'default' | 'success' | 'warn' | 'error' | 'muted' | 'accent'

export interface TerminalStep {
  type: 'command' | 'output' | 'pause'
  /** For 'command': the command (excluding prompt). For 'output': the line. For 'pause': empty. */
  text?: string
  /** For 'command' steps: prompt prefix. Default '$ '. */
  prompt?: string
  /** For 'output' steps: color variant. Default 'default'. */
  variant?: TerminalVariant
  /** For 'pause' steps: ms to pause. Default 600. */
  ms?: number
  /** For 'output' steps: render instantly instead of typing. Default true. */
  instant?: boolean
}

export interface TerminalProps {
  steps: TerminalStep[]
  /** Optional title bar text. Default 'bash'. */
  title?: string
  /** Prompt prefix for command steps without their own `prompt`, and for the idle trailing line. Default '$ '. */
  prompt?: string
  /** Show the mac-style window header. Default true. */
  showHeader?: boolean
  /** Show play / pause / replay controls in the header. Default true. */
  showControls?: boolean
  /** Restart the sequence after it finishes. Default true. */
  loop?: boolean
  /** Type speed in characters per second. Default 38. */
  speed?: number
  /** Pause the player when the cursor hovers the terminal. Default true. */
  pauseOnHover?: boolean
  /** Container height. Default '320px'. */
  height?: string | number
  className?: string
}

const VARIANT_COLOR: Record<TerminalVariant, string> = {
  default: 'text-white/85',
  success: 'text-emerald-300',
  warn: 'text-amber-300',
  error: 'text-rose-300',
  muted: 'text-white/45',
  accent: 'text-violet-300',
}

interface RenderedLine {
  key: number
  prompt?: string
  text: string
  variant: TerminalVariant
  isCommand: boolean
  isComplete: boolean
}

export function Terminal({
  steps,
  title,
  prompt = '$ ',
  showHeader = true,
  showControls = true,
  loop = true,
  speed = 38,
  pauseOnHover = true,
  height = '320px',
  className,
}: TerminalProps) {
  const [lines, setLines] = React.useState<RenderedLine[]>([])
  const [playing, setPlaying] = React.useState(true)
  const [hovered, setHovered] = React.useState(false)
  const stepIdxRef = React.useRef(0)
  const charIdxRef = React.useRef(0)
  const lineKeyRef = React.useRef(0)
  const scrollRef = React.useRef<HTMLDivElement>(null)
  const effectivelyPlaying = playing && !(pauseOnHover && hovered)

  // Reset everything (for replay)
  const reset = React.useCallback(() => {
    stepIdxRef.current = 0
    charIdxRef.current = 0
    lineKeyRef.current = 0
    setLines([])
  }, [])

  // The animation loop — driven by setTimeout (per char / per output / per pause)
  React.useEffect(() => {
    if (!effectivelyPlaying) return
    if (steps.length === 0) return

    let cancelled = false
    let timer: ReturnType<typeof setTimeout>

    const tick = () => {
      if (cancelled) return
      const step = steps[stepIdxRef.current]
      if (!step) {
        if (loop) {
          reset()
          timer = setTimeout(tick, 800)
        }
        return
      }

      // Pause step
      if (step.type === 'pause') {
        const ms = step.ms ?? 600
        stepIdxRef.current++
        timer = setTimeout(tick, ms)
        return
      }

      const text = step.text ?? ''

      // Output step — usually instant, optionally typed.
      if (step.type === 'output') {
        if (step.instant !== false) {
          // Append the whole line at once.
          setLines((prev) => [
            ...prev,
            {
              key: lineKeyRef.current++,
              text,
              variant: step.variant ?? 'default',
              isCommand: false,
              isComplete: true,
            },
          ])
          stepIdxRef.current++
          charIdxRef.current = 0
          timer = setTimeout(tick, 70)
          return
        }
      }

      // Command (or typed output) — type one char per tick
      const ms = 1000 / speed
      if (charIdxRef.current === 0) {
        // Start a new line
        setLines((prev) => [
          ...prev,
          {
            key: lineKeyRef.current++,
            prompt: step.type === 'command' ? (step.prompt ?? prompt) : undefined,
            text: '',
            variant: step.variant ?? 'default',
            isCommand: step.type === 'command',
            isComplete: false,
          },
        ])
      }

      if (charIdxRef.current < text.length) {
        charIdxRef.current++
        // Update the LAST line with the new char count.
        const upTo = text.slice(0, charIdxRef.current)
        setLines((prev) => {
          if (prev.length === 0) return prev
          const copy = prev.slice()
          copy[copy.length - 1] = { ...copy[copy.length - 1], text: upTo }
          return copy
        })
        // Slightly variable typing rhythm for realism
        const jitter = (Math.random() - 0.5) * 0.4
        timer = setTimeout(tick, ms * (1 + jitter))
      } else {
        // Mark line complete and move on
        setLines((prev) => {
          if (prev.length === 0) return prev
          const copy = prev.slice()
          copy[copy.length - 1] = { ...copy[copy.length - 1], isComplete: true }
          return copy
        })
        stepIdxRef.current++
        charIdxRef.current = 0
        timer = setTimeout(tick, step.type === 'command' ? 280 : 60)
      }
    }

    timer = setTimeout(tick, 250)
    return () => {
      cancelled = true
      clearTimeout(timer)
    }
  }, [steps, effectivelyPlaying, speed, loop, reset, prompt])

  // Auto-scroll to keep the cursor visible
  React.useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight
  }, [lines])

  return (
    <div
      className={cn(
        'w-full overflow-hidden rounded-xl border border-picks-fg/[0.08] bg-[#08080b] shadow-2xl shadow-black/40',
        className,
      )}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {showHeader && (
        <header className="flex items-center gap-2 border-b border-picks-fg/[0.06] bg-picks-fg/[0.02] px-3 py-2">
          <span aria-hidden className="flex items-center gap-1.5">
            <span className="block h-2.5 w-2.5 rounded-full bg-rose-400/80" />
            <span className="block h-2.5 w-2.5 rounded-full bg-amber-400/80" />
            <span className="block h-2.5 w-2.5 rounded-full bg-emerald-400/80" />
          </span>
          <span className="ml-2 truncate text-[11px] font-medium text-picks-fg/55">
            {title ?? 'bash'}
          </span>
          {showControls && (
            <div className="ml-auto flex items-center gap-0.5">
              <button
                type="button"
                onClick={() => setPlaying((p) => !p)}
                aria-label={playing ? 'Pause' : 'Play'}
                className="inline-flex h-6 w-6 items-center justify-center rounded text-picks-fg/55 hover:bg-picks-fg/[0.06] hover:text-picks-fg"
              >
                {playing ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
              </button>
              <button
                type="button"
                onClick={() => {
                  reset()
                  setPlaying(true)
                }}
                aria-label="Replay"
                className="inline-flex h-6 w-6 items-center justify-center rounded text-picks-fg/55 hover:bg-picks-fg/[0.06] hover:text-picks-fg"
              >
                <RotateCcw className="h-3 w-3" />
              </button>
            </div>
          )}
        </header>
      )}

      <div
        ref={scrollRef}
        className="overflow-y-auto px-4 py-3 font-mono text-[12.5px] leading-snug"
        style={{ height }}
        data-lenis-prevent
      >
        {lines.map((line, i) => {
          const isLast = i === lines.length - 1
          return (
            <div key={line.key} className="flex whitespace-pre">
              {line.prompt && (
                <span className="select-none text-white/35">{line.prompt}</span>
              )}
              <span className={VARIANT_COLOR[line.variant]}>
                {line.text}
                {isLast && !line.isComplete && <Cursor />}
              </span>
            </div>
          )
        })}
        {/* When all lines complete (between steps), show a trailing cursor on a fresh prompt line */}
        {lines.length > 0 && lines[lines.length - 1].isComplete && (
          <div className="flex whitespace-pre">
            <span className="select-none text-white/35">{prompt}</span>
            <Cursor />
          </div>
        )}
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------

function Cursor() {
  return (
    <motion.span
      aria-hidden
      className="inline-block h-[1em] w-[7px] translate-y-[3px] bg-white/85"
      animate={{ opacity: [1, 0.1, 1] }}
      transition={{ duration: 1, repeat: Infinity, ease: 'easeInOut' }}
    />
  )
}
