'use client'

import type { ReactNode } from 'react'
import { AnimatePresence, MotionConfig, motion } from 'framer-motion'
import { usePrefersReducedMotion } from '@/lib/use-prefers-reduced-motion'
import {
  Mic,
  PhoneCall,
  PhoneOff,
  Music2,
  MapPin,
  Send,
  Timer as TimerIcon,
  BatteryLow,
  Search,
  ScreenShare,
  Volume2,
  Mic2,
} from 'lucide-react'

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export type DynamicIslandView =
  | 'idle'
  | 'ring'
  | 'timer'
  | 'record'
  | 'music'
  | 'maps'
  | 'airdrop'
  | 'airdropMini'
  | 'lowBattery'
  | 'phone'
  | 'findmy'
  | 'screenRecord'

/**
 * Per-scene display content. Every field is optional — anything omitted
 * falls back to the built-in demo copy, so `<DynamicIsland view="music" />`
 * keeps working unchanged.
 */
export interface DynamicIslandContent {
  /** `timer` scene — countdown readout + trailing label. */
  timer?: { time?: string; label?: string }
  /** `record` scene — elapsed recording time. */
  record?: { time?: string }
  /** `airdropMini` scene — item count + trailing label. */
  airdropMini?: { count?: string; label?: string }
  /** `lowBattery` scene — battery level + trailing label. */
  lowBattery?: { level?: string; label?: string }
  /** `screenRecord` scene — elapsed time + trailing label. */
  screenRecord?: { time?: string; label?: string }
  /** `findmy` scene — the device / item label. */
  findmy?: { label?: string }
  /** `maps` scene — instruction line, street sub-line, ETA. */
  maps?: { instruction?: string; street?: string; eta?: string }
  /** `ring` scene — caller name, status line, optional avatar node. */
  ring?: { name?: string; status?: string; avatar?: ReactNode }
  /** `phone` scene — callee name + status/duration line. */
  phone?: { name?: string; status?: string }
  /** `music` scene — track title, artist line, optional artwork node. */
  music?: { title?: string; artist?: string; artwork?: ReactNode }
  /** `airdrop` scene — transfer title + sub-line. */
  airdrop?: { title?: string; subtitle?: string }
}

export interface DynamicIslandProps {
  /** Which scene the island is showing. Defaults to 'idle'. */
  view?: DynamicIslandView
  /** Display data per scene. Omitted fields use the built-in demo copy. */
  content?: DynamicIslandContent
  /**
   * Fired when an interactive button inside a scene is pressed:
   * 'accept-call' | 'decline-call' (ring), 'toggle-mute' | 'end-call' (phone).
   */
  onAction?: (action: string) => void
  className?: string
}

/* ------------------------------------------------------------------ */
/*  Spring config — the iOS-island feel                                */
/* ------------------------------------------------------------------ */

/**
 * The spring is everything. Values tuned for a "soft but quick" morph —
 * the container snaps to its new shape with a tiny overshoot, then settles.
 */
const ISLAND_SPRING = {
  type: 'spring' as const,
  stiffness: 380,
  damping: 32,
  mass: 1.05,
}

/** Faster, lower-amplitude spring for content fades inside the island. */
const CONTENT_SPRING = {
  type: 'spring' as const,
  stiffness: 500,
  damping: 38,
  mass: 0.9,
}

/* ------------------------------------------------------------------ */
/*  Size + shape definitions per view                                  */
/* ------------------------------------------------------------------ */

interface IslandShape {
  width: number
  height: number
  borderRadius: number
  /** Horizontal padding inside the island. */
  paddingX: number
}

const SHAPES: Record<DynamicIslandView, IslandShape> = {
  // ── Compact (38px tall) ─────────────────────────────────────────
  idle: { width: 126, height: 38, borderRadius: 22, paddingX: 0 },
  timer: { width: 210, height: 38, borderRadius: 22, paddingX: 12 },
  record: { width: 200, height: 38, borderRadius: 22, paddingX: 12 },
  airdropMini: { width: 116, height: 38, borderRadius: 22, paddingX: 10 },
  lowBattery: { width: 168, height: 38, borderRadius: 22, paddingX: 12 },
  screenRecord: { width: 222, height: 38, borderRadius: 22, paddingX: 12 },

  // ── Medium (50px tall) — slim notification ─────────────────────
  findmy: { width: 300, height: 50, borderRadius: 26, paddingX: 14 },
  maps: { width: 296, height: 64, borderRadius: 30, paddingX: 14 },

  // ── Expanded (80px tall) ────────────────────────────────────────
  ring: { width: 350, height: 84, borderRadius: 38, paddingX: 16 },
  music: { width: 350, height: 80, borderRadius: 36, paddingX: 14 },
  phone: { width: 332, height: 76, borderRadius: 34, paddingX: 14 },

  // ── Tall expanded (with progress) ───────────────────────────────
  airdrop: { width: 296, height: 86, borderRadius: 34, paddingX: 16 },
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function DynamicIsland({
  view = 'idle',
  content,
  onAction,
  className,
}: DynamicIslandProps) {
  const shape = SHAPES[view]
  // Reduced motion: morphs become instant and ambient loops are cut.
  const reduced = usePrefersReducedMotion()

  return (
    <MotionConfig transition={reduced ? { duration: 0 } : ISLAND_SPRING}>
      <motion.div
        layout
        animate={{
          width: shape.width,
          height: shape.height,
          borderRadius: shape.borderRadius,
        }}
        className={[
          'relative isolate overflow-hidden bg-black text-white',
          'shadow-[0_10px_36px_-12px_rgba(0,0,0,0.7)]',
          'ring-1 ring-white/[0.06]',
          className ?? '',
        ].join(' ')}
        style={{
          // Initial width/height while the first animation is computed
          width: shape.width,
          height: shape.height,
          borderRadius: shape.borderRadius,
        }}
      >
        {/* Very faint top highlight — gives the island a glassy edge */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-b from-white/8 to-transparent"
        />

        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={view}
            initial={reduced ? false : { opacity: 0, scale: 0.85, filter: 'blur(6px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, scale: 0.92, filter: 'blur(4px)' }}
            transition={reduced ? { duration: 0 } : CONTENT_SPRING}
            className="absolute inset-0 flex items-center"
            style={{ paddingLeft: shape.paddingX, paddingRight: shape.paddingX }}
          >
            <ViewContent
              view={view}
              reduced={reduced}
              content={content}
              onAction={onAction}
            />
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </MotionConfig>
  )
}

/* ------------------------------------------------------------------ */
/*  Per-view content                                                   */
/* ------------------------------------------------------------------ */

function ViewContent({
  view,
  reduced,
  content,
  onAction,
}: {
  view: DynamicIslandView
  reduced: boolean
  content?: DynamicIslandContent
  onAction?: (action: string) => void
}) {
  switch (view) {
    case 'idle':
      return null

    case 'timer':
      return (
        <div className="flex w-full items-center gap-3">
          <TimerIcon className="h-4 w-4 text-amber-300" strokeWidth={2.2} />
          <span className="flex-1 font-mono text-sm tabular-nums">
            {content?.timer?.time ?? '12:34'}
          </span>
          <span className="text-[10px] uppercase tracking-widest text-white/50">
            {content?.timer?.label ?? 'Timer'}
          </span>
        </div>
      )

    case 'record':
      return (
        <div className="flex w-full items-center gap-3">
          <motion.span
            className="h-2.5 w-2.5 rounded-full bg-rose-500"
            animate={reduced ? { opacity: 1 } : { opacity: [1, 0.4, 1] }}
            transition={
              reduced
                ? { duration: 0 }
                : { duration: 1.4, repeat: Infinity, ease: 'easeInOut' }
            }
          />
          <span className="flex-1 font-mono text-sm tabular-nums">
            {content?.record?.time ?? '00:42'}
          </span>
          <Mic className="h-4 w-4 text-rose-300" strokeWidth={2.2} />
        </div>
      )

    case 'airdropMini':
      return (
        <div className="flex w-full items-center justify-center gap-2">
          <Send className="h-3.5 w-3.5 text-blue-300" strokeWidth={2.4} />
          <span className="font-mono text-xs tabular-nums text-white/90">
            {content?.airdropMini?.count ?? '1'}
          </span>
          <span className="text-[10px] uppercase tracking-widest text-white/50">
            {content?.airdropMini?.label ?? 'AirDrop'}
          </span>
        </div>
      )

    case 'lowBattery':
      return (
        <div className="flex w-full items-center gap-2.5">
          <BatteryLow className="h-4 w-4 text-amber-400" strokeWidth={2.2} />
          <span className="flex-1 font-mono text-sm tabular-nums">
            {content?.lowBattery?.level ?? '20%'}
          </span>
          <span className="text-[10px] uppercase tracking-widest text-amber-300/80">
            {content?.lowBattery?.label ?? 'Low'}
          </span>
        </div>
      )

    case 'screenRecord':
      return (
        <div className="flex w-full items-center gap-2.5">
          <motion.span
            className="flex h-4 w-4 items-center justify-center"
            animate={reduced ? { scale: 1 } : { scale: [1, 1.15, 1] }}
            transition={
              reduced
                ? { duration: 0 }
                : { duration: 1.6, repeat: Infinity, ease: 'easeInOut' }
            }
          >
            <ScreenShare className="h-4 w-4 text-rose-300" strokeWidth={2.2} />
          </motion.span>
          <span className="flex-1 font-mono text-sm tabular-nums">
            {content?.screenRecord?.time ?? '02:17'}
          </span>
          <span className="text-[10px] uppercase tracking-widest text-rose-300/80">
            {content?.screenRecord?.label ?? 'Screen'}
          </span>
        </div>
      )

    case 'findmy':
      return (
        <div className="flex w-full items-center gap-3">
          <span className="relative flex h-7 w-7 items-center justify-center">
            {!reduced && (
              <motion.span
                className="absolute inset-0 rounded-full border-2 border-emerald-400/60"
                animate={{ scale: [1, 1.6], opacity: [0.6, 0] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: 'easeOut' }}
              />
            )}
            <Search className="h-3.5 w-3.5 text-emerald-300" strokeWidth={2.4} />
          </span>
          <span className="flex-1 truncate text-sm font-medium">
            {content?.findmy?.label ?? 'Find My — iPhone gxuri'}
          </span>
        </div>
      )

    case 'maps':
      return (
        <div className="flex w-full items-center gap-2.5">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-sky-500/15 ring-1 ring-sky-400/30">
            <MapPin className="h-4 w-4 text-sky-300" strokeWidth={2.2} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[13px] font-medium leading-tight">
              {content?.maps?.instruction ?? 'Turn left in 500 m'}
            </p>
            <p className="truncate text-[10px] leading-tight text-white/50">
              {content?.maps?.street ?? 'El-Tahrir St.'}
            </p>
          </div>
          <span className="font-mono text-sm tabular-nums text-white/90">
            {content?.maps?.eta ?? '8 min'}
          </span>
        </div>
      )

    case 'ring': {
      const name = content?.ring?.name ?? 'Mohamed Bahrawy'
      return (
        <div className="flex w-full items-center gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white/[0.06] ring-1 ring-white/10">
            {content?.ring?.avatar ?? (
              <span className="text-base font-medium">{name.charAt(0)}</span>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium leading-tight">
              {name}
            </p>
            <p className="text-[11px] leading-tight text-white/50">
              {content?.ring?.status ?? 'incoming call…'}
            </p>
          </div>
          <button
            type="button"
            aria-label="Decline call"
            onClick={() => onAction?.('decline-call')}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-rose-500 text-white shadow-[0_4px_12px_-2px_rgba(244,63,94,0.5)] transition-transform hover:scale-105 active:scale-95"
          >
            <PhoneOff className="h-4 w-4" strokeWidth={2.4} />
          </button>
          <button
            type="button"
            aria-label="Accept call"
            onClick={() => onAction?.('accept-call')}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white shadow-[0_4px_12px_-2px_rgba(16,185,129,0.5)] transition-transform hover:scale-105 active:scale-95"
          >
            <PhoneCall className="h-4 w-4" strokeWidth={2.4} />
          </button>
        </div>
      )
    }

    case 'phone':
      return (
        <div className="flex w-full items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 ring-1 ring-emerald-400/30">
            <PhoneCall className="h-4 w-4 text-emerald-300" strokeWidth={2.4} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium leading-tight">
              {content?.phone?.name ?? 'Sara'}
            </p>
            <p className="font-mono text-[11px] leading-tight tabular-nums text-emerald-300/80">
              {content?.phone?.status ?? '02:14 · on call'}
            </p>
          </div>
          <button
            type="button"
            aria-label="Toggle mute"
            onClick={() => onAction?.('toggle-mute')}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/[0.06] text-white/70 ring-1 ring-white/10 transition-colors hover:bg-white/10 hover:text-white"
          >
            <Mic2 className="h-3.5 w-3.5" strokeWidth={2.2} />
          </button>
          <button
            type="button"
            aria-label="End call"
            onClick={() => onAction?.('end-call')}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-rose-500 text-white shadow-[0_4px_12px_-2px_rgba(244,63,94,0.5)] transition-transform hover:scale-105 active:scale-95"
          >
            <PhoneOff className="h-3.5 w-3.5" strokeWidth={2.4} />
          </button>
        </div>
      )

    case 'music':
      return (
        <div className="flex w-full items-center gap-3">
          <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-[10px] bg-gradient-to-br from-fuchsia-500 via-purple-500 to-indigo-500">
            {content?.music?.artwork ?? (
              <span className="absolute inset-0 flex items-center justify-center">
                <Music2 className="h-5 w-5 text-white/90" strokeWidth={2.2} />
              </span>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium leading-tight">
              {content?.music?.title ?? 'Midnight Drive'}
            </p>
            <p className="truncate text-[11px] leading-tight text-white/50">
              {content?.music?.artist ?? 'Cosmic Lounge · 3:24'}
            </p>
          </div>
          <Waveform reduced={reduced} />
        </div>
      )

    case 'airdrop':
      return (
        <div className="flex w-full flex-col justify-center gap-1.5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-500/15 ring-1 ring-blue-400/30">
              <Send className="h-3.5 w-3.5 text-blue-300" strokeWidth={2.4} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[13px] font-medium leading-tight">
                {content?.airdrop?.title ?? 'Receiving photo'}
              </p>
              <p className="truncate text-[10px] leading-tight text-white/50">
                {content?.airdrop?.subtitle ?? 'iPhone of Sara · 2.4 MB'}
              </p>
            </div>
            <Volume2 className="h-3.5 w-3.5 text-white/40" strokeWidth={2} />
          </div>
          <div className="h-[3px] w-full overflow-hidden rounded-full bg-white/10">
            <motion.div
              className="h-full rounded-full bg-blue-400"
              initial={reduced ? false : { width: '0%' }}
              animate={
                reduced
                  ? { width: '100%' }
                  : { width: ['12%', '64%', '92%', '100%'] }
              }
              transition={
                reduced ? { duration: 0 } : { duration: 2.8, ease: 'easeOut' }
              }
            />
          </div>
        </div>
      )
  }
}

/* ------------------------------------------------------------------ */
/*  Tiny waveform indicator for the music view                         */
/* ------------------------------------------------------------------ */

function Waveform({ reduced }: { reduced: boolean }) {
  const bars = [4, 9, 6, 12, 5, 10, 7]

  // Reduced motion: a static waveform — bars sit at their peak heights.
  if (reduced) {
    return (
      <div className="flex h-8 items-center gap-[3px]">
        {bars.map((h, i) => (
          <span
            key={i}
            className="block w-[3px] rounded-full bg-emerald-300"
            style={{ height: h * 2 }}
          />
        ))}
      </div>
    )
  }

  return (
    <div className="flex h-8 items-center gap-[3px]">
      {bars.map((h, i) => (
        <motion.span
          key={i}
          className="block w-[3px] rounded-full bg-emerald-300"
          initial={{ height: 4 }}
          animate={{ height: [4, h * 2, 4] }}
          transition={{
            duration: 1.0 + (i % 3) * 0.15,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: i * 0.07,
          }}
        />
      ))}
    </div>
  )
}
