'use client'

/**
 * <AIChat />
 *
 * A Claude/ChatGPT-style chat view. User messages right-aligned in
 * dark bubbles; assistant messages left-aligned with an optional
 * avatar and a brighter card. Any message with `streaming: true`
 * reveals one character at a time at a configurable speed, with a
 * blinking caret pinned to the write head. Show a `thinking` flag at
 * the end to render a 3-dot pulse indicator before the next response
 * starts.
 *
 * Auto-scrolls as new text arrives.
 */

import * as React from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  /** Animate the content character-by-character (only honored for assistant). */
  streaming?: boolean
}

export interface AIChatProps {
  messages: ChatMessage[]
  /** Show a "Thinking…" 3-dot indicator at the bottom. */
  thinking?: boolean
  /** Type speed in chars/sec for streaming messages. Default 70. */
  speed?: number
  /** Custom avatar for assistant rows. Default a violet sparkle. */
  assistantAvatar?: React.ReactNode
  /** Custom avatar for user rows (right side). */
  userAvatar?: React.ReactNode
  /** Container max height. Default '420px'. */
  height?: string | number
  /** Auto-scroll to bottom on new content. Default true. */
  autoScroll?: boolean
  className?: string
}

export function AIChat({
  messages,
  thinking = false,
  speed = 70,
  assistantAvatar,
  userAvatar,
  height = '420px',
  autoScroll = true,
  className,
}: AIChatProps) {
  const scrollRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    if (!autoScroll) return
    const el = scrollRef.current
    if (el) el.scrollTop = el.scrollHeight
  })

  return (
    <div
      className={cn(
        'flex w-full flex-col overflow-hidden rounded-2xl border border-white/[0.08] bg-zinc-950/60',
        className,
      )}
    >
      <header className="flex items-center gap-2 border-b border-white/[0.06] bg-white/[0.02] px-4 py-2.5">
        <Sparkles className="h-3.5 w-3.5 text-violet-300" strokeWidth={2.5} />
        <span className="font-display text-[11.5px] font-semibold tracking-tight text-white/85">
          Assistant
        </span>
        <span className="ml-auto inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.22em] text-white/35">
          <span aria-hidden className="block h-1 w-1 animate-pulse rounded-full bg-emerald-400" />
          online
        </span>
      </header>

      <div
        ref={scrollRef}
        className="flex-1 space-y-4 overflow-y-auto px-4 py-5"
        style={{ maxHeight: height }}
        data-lenis-prevent
      >
        {messages.map((m) => (
          <MessageRow
            key={m.id}
            message={m}
            speed={speed}
            assistantAvatar={assistantAvatar}
            userAvatar={userAvatar}
          />
        ))}
        <AnimatePresence>
          {thinking && (
            <motion.div
              key="thinking"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              className="flex items-start gap-2.5"
            >
              <DefaultAssistantAvatar custom={assistantAvatar} />
              <div className="rounded-2xl rounded-bl-md border border-white/10 bg-white/[0.04] px-3.5 py-2.5">
                <ThinkingDots />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------

function MessageRow({
  message,
  speed,
  assistantAvatar,
  userAvatar,
}: {
  message: ChatMessage
  speed: number
  assistantAvatar?: React.ReactNode
  userAvatar?: React.ReactNode
}) {
  const isUser = message.role === 'user'
  // Stream the content one char at a time when requested.
  const text = useStreamingText(
    message.content,
    Boolean(message.streaming) && !isUser,
    speed,
  )
  const done = text.length === message.content.length

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        'flex items-start gap-2.5',
        isUser ? 'flex-row-reverse' : 'flex-row',
      )}
    >
      {isUser ? (
        <DefaultUserAvatar custom={userAvatar} />
      ) : (
        <DefaultAssistantAvatar custom={assistantAvatar} />
      )}
      <div
        className={cn(
          'max-w-[78%] rounded-2xl px-3.5 py-2.5 text-[13px] leading-[1.55]',
          isUser
            ? 'rounded-br-md bg-white/[0.07] text-white/90'
            : 'rounded-bl-md border border-white/10 bg-white/[0.025] text-white/85',
        )}
      >
        <span className="whitespace-pre-wrap break-words">
          {text}
          {!done && <Caret />}
        </span>
      </div>
    </motion.div>
  )
}

function useStreamingText(content: string, enabled: boolean, speed: number) {
  const [shown, setShown] = React.useState(enabled ? '' : content)

  React.useEffect(() => {
    if (!enabled) {
      setShown(content)
      return
    }
    setShown('')
    let i = 0
    let cancelled = false
    const ms = 1000 / speed
    const tick = () => {
      if (cancelled) return
      i++
      setShown(content.slice(0, i))
      if (i < content.length) {
        // Slight jitter for naturalness
        const jitter = 1 + (Math.random() - 0.5) * 0.4
        timer = window.setTimeout(tick, ms * jitter)
      }
    }
    let timer = window.setTimeout(tick, ms)
    return () => {
      cancelled = true
      clearTimeout(timer)
    }
  }, [content, enabled, speed])

  return shown
}

// ---------------------------------------------------------------------------

function Caret() {
  return (
    <motion.span
      aria-hidden
      className="ml-0.5 inline-block h-[1em] w-[6px] translate-y-[2px] rounded-sm bg-white/75"
      animate={{ opacity: [1, 0.2, 1] }}
      transition={{ duration: 0.9, repeat: Infinity, ease: 'easeInOut' }}
    />
  )
}

function ThinkingDots() {
  return (
    <span className="inline-flex items-center gap-1.5 py-0.5">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="block h-1.5 w-1.5 rounded-full bg-white/70"
          animate={{ opacity: [0.25, 1, 0.25], y: [0, -2, 0] }}
          transition={{ duration: 1.0, delay: i * 0.18, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}
    </span>
  )
}

function DefaultAssistantAvatar({ custom }: { custom?: React.ReactNode }) {
  if (custom) return <>{custom}</>
  return (
    <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-400/40 to-fuchsia-400/40 ring-1 ring-violet-400/30">
      <Sparkles className="h-3 w-3 text-violet-100" strokeWidth={2.5} />
    </span>
  )
}

function DefaultUserAvatar({ custom }: { custom?: React.ReactNode }) {
  if (custom) return <>{custom}</>
  return (
    <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/[0.06] text-[10px] font-semibold tracking-tight text-white/80 ring-1 ring-white/10">
      You
    </span>
  )
}
