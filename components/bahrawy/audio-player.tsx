'use client'

/**
 * <AudioPlayer />
 *
 * A real audio player. Play/pause, current/total time, volume, and
 * the signature: a waveform-as-seek-bar where the bars left of the
 * playhead glow accent-colored and bars to the right are muted.
 * Click any bar to seek; drag along the bars to scrub.
 *
 * Pass `waveform` if you've pre-computed the amplitudes (web audio
 * analysis on the server). If you don't, a deterministic synthetic
 * waveform is generated from the src URL so the same track always
 * looks the same.
 */

import * as React from 'react'
import { motion } from 'framer-motion'
import { Pause, Play, Volume2, VolumeX } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface AudioPlayerProps {
  /** Audio source URL. */
  src: string
  /** Track title. */
  title?: string
  /** Track artist / subtitle. */
  artist?: string
  /** Optional square cover art URL. */
  coverArt?: string
  /** Pre-computed amplitude data (0..1), one per bar. If omitted, a
   * deterministic synthetic waveform is generated. */
  waveform?: number[]
  /** Number of synthetic bars when no `waveform` is passed. Default 64. */
  bars?: number
  /** Accent for the played-portion bars + play button. Default '#A78BFA'. */
  accent?: string
  /** Auto-play on mount. Default false. */
  autoPlay?: boolean
  className?: string
}

export function AudioPlayer({
  src,
  title,
  artist,
  coverArt,
  waveform,
  bars = 64,
  accent = '#A78BFA',
  autoPlay = false,
  className,
}: AudioPlayerProps) {
  const audioRef = React.useRef<HTMLAudioElement>(null)
  const wrapRef = React.useRef<HTMLDivElement>(null)
  const [playing, setPlaying] = React.useState(false)
  const [current, setCurrent] = React.useState(0)
  const [duration, setDuration] = React.useState(0)
  const [volume, setVolume] = React.useState(0.8)
  const [muted, setMuted] = React.useState(false)
  const [scrubbing, setScrubbing] = React.useState(false)

  // Synthetic waveform — deterministic from the src string.
  const data = React.useMemo(() => {
    if (waveform && waveform.length > 0) return waveform
    return generateWaveform(src, bars)
  }, [waveform, src, bars])

  const progress = duration > 0 ? current / duration : 0

  // Wire up audio events.
  React.useEffect(() => {
    const el = audioRef.current
    if (!el) return
    const onTime = () => setCurrent(el.currentTime)
    const onMeta = () => setDuration(el.duration || 0)
    const onPlay = () => setPlaying(true)
    const onPause = () => setPlaying(false)
    const onEnded = () => setPlaying(false)
    el.addEventListener('timeupdate', onTime)
    el.addEventListener('loadedmetadata', onMeta)
    el.addEventListener('play', onPlay)
    el.addEventListener('pause', onPause)
    el.addEventListener('ended', onEnded)
    return () => {
      el.removeEventListener('timeupdate', onTime)
      el.removeEventListener('loadedmetadata', onMeta)
      el.removeEventListener('play', onPlay)
      el.removeEventListener('pause', onPause)
      el.removeEventListener('ended', onEnded)
    }
  }, [])

  // Volume / mute sync.
  React.useEffect(() => {
    const el = audioRef.current
    if (!el) return
    el.volume = muted ? 0 : volume
  }, [volume, muted])

  const toggle = () => {
    const el = audioRef.current
    if (!el) return
    if (el.paused) el.play().catch(() => undefined)
    else el.pause()
  }

  // Click / drag on the waveform to scrub.
  const seekFromPointer = (e: React.PointerEvent | PointerEvent) => {
    const el = audioRef.current
    const wrap = wrapRef.current
    if (!el || !wrap || !duration) return
    const rect = wrap.getBoundingClientRect()
    const x = e.clientX - rect.left
    const frac = Math.max(0, Math.min(1, x / rect.width))
    el.currentTime = frac * duration
    setCurrent(el.currentTime)
  }
  const onWavePointerDown = (e: React.PointerEvent) => {
    setScrubbing(true)
    ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
    seekFromPointer(e)
  }
  const onWavePointerMove = (e: React.PointerEvent) => {
    if (!scrubbing) return
    seekFromPointer(e)
  }
  const onWavePointerUp = (e: React.PointerEvent) => {
    setScrubbing(false)
    ;(e.target as HTMLElement).releasePointerCapture(e.pointerId)
  }

  return (
    <div
      className={cn(
        'flex w-full max-w-xl items-center gap-4 rounded-2xl border border-white/[0.08] bg-white/[0.02] p-3.5',
        className,
      )}
    >
      <audio ref={audioRef} src={src} autoPlay={autoPlay} preload="metadata" />

      {/* Play / pause button */}
      <button
        type="button"
        onClick={toggle}
        aria-label={playing ? 'Pause' : 'Play'}
        className="relative inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-zinc-900 transition-transform hover:scale-[1.04] active:scale-95"
        style={{ background: accent }}
      >
        {playing ? (
          <Pause className="h-4 w-4" strokeWidth={3} />
        ) : (
          <Play className="ml-0.5 h-4 w-4" strokeWidth={3} fill="currentColor" />
        )}
      </button>

      {/* Cover art (if provided) */}
      {coverArt && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={coverArt}
          alt=""
          className="h-12 w-12 shrink-0 rounded-lg object-cover ring-1 ring-white/10"
        />
      )}

      {/* Title + waveform + time */}
      <div className="min-w-0 flex-1">
        {(title || artist) && (
          <div className="flex items-baseline gap-2">
            {title && (
              <span className="truncate text-[12.5px] font-semibold tracking-tight text-white">
                {title}
              </span>
            )}
            {artist && (
              <span className="truncate text-[11px] text-white/45">{artist}</span>
            )}
          </div>
        )}

        {/* Waveform */}
        <div
          ref={wrapRef}
          onPointerDown={onWavePointerDown}
          onPointerMove={onWavePointerMove}
          onPointerUp={onWavePointerUp}
          onPointerCancel={onWavePointerUp}
          className="mt-1.5 flex h-9 cursor-pointer items-end gap-[2px]"
          role="slider"
          aria-label="Seek"
          aria-valuemin={0}
          aria-valuemax={Math.round(duration)}
          aria-valuenow={Math.round(current)}
        >
          {data.map((amp, i) => {
            const isPlayed = i / data.length < progress
            return (
              <span
                key={i}
                aria-hidden
                className="flex-1 rounded-sm transition-colors"
                style={{
                  height: `${Math.max(8, amp * 100)}%`,
                  background: isPlayed ? accent : 'rgba(255,255,255,0.18)',
                  boxShadow: isPlayed ? `0 0 6px ${accent}55` : undefined,
                }}
              />
            )
          })}
        </div>

        {/* Time + volume row */}
        <div className="mt-1 flex items-center justify-between gap-2">
          <span className="font-mono text-[10.5px] tabular-nums text-white/55">
            {formatTime(current)}{' '}
            <span className="text-white/30">/ {formatTime(duration)}</span>
          </span>
          <VolumeControl
            volume={volume}
            muted={muted}
            onVolumeChange={(v) => {
              setVolume(v)
              if (v > 0) setMuted(false)
            }}
            onToggleMute={() => setMuted((m) => !m)}
            accent={accent}
          />
        </div>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------

function VolumeControl({
  volume,
  muted,
  onVolumeChange,
  onToggleMute,
  accent,
}: {
  volume: number
  muted: boolean
  onVolumeChange: (v: number) => void
  onToggleMute: () => void
  accent: string
}) {
  return (
    <div className="group flex items-center gap-1.5">
      <button
        type="button"
        onClick={onToggleMute}
        aria-label={muted ? 'Unmute' : 'Mute'}
        className="inline-flex h-6 w-6 items-center justify-center rounded-md text-white/45 transition-colors hover:bg-white/[0.06] hover:text-white"
      >
        {muted || volume === 0 ? (
          <VolumeX className="h-3 w-3" strokeWidth={2.5} />
        ) : (
          <Volume2 className="h-3 w-3" strokeWidth={2.5} />
        )}
      </button>
      <div className="relative h-1 w-16 overflow-hidden rounded-full bg-white/[0.06]">
        <motion.div
          aria-hidden
          className="absolute inset-y-0 left-0 rounded-full"
          style={{
            width: `${muted ? 0 : volume * 100}%`,
            background: accent,
          }}
        />
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={muted ? 0 : volume}
          onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
          aria-label="Volume"
          className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
        />
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------

function generateWaveform(seed: string, n: number): number[] {
  // Hash the seed to a number so the same src always produces the same waveform.
  let h = 0
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) | 0
  // LCG seeded by the hash.
  let s = (h ^ 0x9e3779b9) >>> 0
  const rand = () => {
    s = (s * 1664525 + 1013904223) >>> 0
    return s / 0x100000000
  }
  const out: number[] = []
  for (let i = 0; i < n; i++) {
    // Mix two sine waves + noise — gives a song-like envelope.
    const t = i / n
    const wave = 0.4 + 0.35 * Math.sin(t * Math.PI * 6) + 0.25 * Math.sin(t * Math.PI * 17 + 1.3)
    const noise = (rand() - 0.5) * 0.4
    out.push(Math.max(0.12, Math.min(1, wave + noise)))
  }
  return out
}

function formatTime(s: number): string {
  if (!isFinite(s) || s < 0) return '0:00'
  const m = Math.floor(s / 60)
  const sec = Math.floor(s % 60)
  return `${m}:${sec.toString().padStart(2, '0')}`
}
