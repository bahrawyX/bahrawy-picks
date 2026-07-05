'use client'

/**
 * <CassetteTape />
 *
 * A vintage audio cassette, rendered in pure CSS + a small SVG for
 * the centre teeth. Two reels rotate when the tape is "playing", a
 * thin tape line connects them, and a label centred on the front
 * shows the side (A / B) + title + duration. Click the play button
 * (or the cassette itself) to toggle playback — the reels spin via
 * a CSS keyframe whose play-state is bound to the React state. Use
 * the small AB toggle to flip sides; the cassette flips in 3D via
 * `rotateY` and the back face shows side B.
 *
 * No glow anywhere — just realistic plastic shading, hairline
 * borders, and a soft drop-shadow.
 */

import * as React from 'react'
import { cn } from '@/lib/utils'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface CassetteSide {
  /** Headline rendered on the label. */
  title: React.ReactNode
  /** Optional artist / subtitle line. */
  artist?: React.ReactNode
  /** Optional runtime label, e.g. "23:14". */
  runtime?: string
}

export interface CassetteTapeProps {
  /** A-side metadata. */
  sideA: CassetteSide
  /** B-side metadata. */
  sideB: CassetteSide
  /** Brand line printed at the top of the label. Default 'Bahrawy · Music Co.'. */
  brand?: string
  /** Cassette body colour. Default a warm plastic ivory. */
  shellColor?: string
  /** Label background colour. Default a vintage cream. */
  labelColor?: string
  /** Initial play state. Default false (paused). */
  defaultPlaying?: boolean
  /** Seconds per reel revolution. Default 3 (fast forward speed). */
  spinSpeed?: number
  className?: string
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function CassetteTape({
  sideA,
  sideB,
  brand = 'Bahrawy · Music Co.',
  shellColor = '#1f1d2a',
  labelColor = '#f3e9c8',
  defaultPlaying = false,
  spinSpeed = 3,
  className,
}: CassetteTapeProps) {
  const [playing, setPlaying] = React.useState(defaultPlaying)
  const [side, setSide] = React.useState<'A' | 'B'>('A')

  const id = React.useId().replace(/:/g, '')

  return (
    <div
      className={cn('relative w-full max-w-[420px]', className)}
      style={{ perspective: '1200px' }}
    >
      {/* The whole cassette is wrapped in a 3D pivot that flips when
          the user switches sides. */}
      <div
        className="relative w-full"
        style={{
          aspectRatio: '5 / 3',
          transformStyle: 'preserve-3d',
          transform: side === 'B' ? 'rotateY(180deg)' : 'rotateY(0deg)',
          transition: 'transform 800ms cubic-bezier(0.22, 1, 0.36, 1)',
        }}
      >
        {/* SIDE A — front of the cassette */}
        <CassetteFace
          face="A"
          info={sideA}
          brand={brand}
          shellColor={shellColor}
          labelColor={labelColor}
          playing={playing}
          onTogglePlay={() => setPlaying((p) => !p)}
          onFlip={() => setSide('B')}
          instanceId={id}
        />

        {/* SIDE B — flipped 180° on Y axis, sits "behind" until flip */}
        <div
          className="absolute inset-0"
          style={{
            transform: 'rotateY(180deg)',
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
          }}
        >
          <CassetteFace
            face="B"
            info={sideB}
            brand={brand}
            shellColor={shellColor}
            labelColor={labelColor}
            playing={playing}
            onTogglePlay={() => setPlaying((p) => !p)}
            onFlip={() => setSide('A')}
            instanceId={`${id}-b`}
          />
        </div>
      </div>

      {/* Per-instance reel-spin keyframes — play-state bound to React state.
          Covers both faces: side A reels use the bare id, side B the -b suffix. */}
      <style>{`
        .bahrawy-cassette-reel-${id},
        .bahrawy-cassette-reel-${id}-b {
          animation: bahrawy-cassette-spin-${id} ${spinSpeed}s linear infinite;
          animation-play-state: ${playing ? 'running' : 'paused'};
        }
        @keyframes bahrawy-cassette-spin-${id} {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}

// ---------------------------------------------------------------------------
// One face of the cassette (A or B)
// ---------------------------------------------------------------------------

function CassetteFace({
  face,
  info,
  brand,
  shellColor,
  labelColor,
  playing,
  onTogglePlay,
  onFlip,
  instanceId,
}: {
  face: 'A' | 'B'
  info: CassetteSide
  brand: string
  shellColor: string
  labelColor: string
  playing: boolean
  onTogglePlay: () => void
  onFlip: () => void
  instanceId: string
}) {
  return (
    <div
      className="absolute inset-0 overflow-hidden rounded-[14px]"
      style={{
        background: `linear-gradient(180deg, ${shellColor} 0%, color-mix(in srgb, ${shellColor} 70%, black) 100%)`,
        boxShadow:
          '0 30px 60px -20px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.08), inset 0 -1px 0 rgba(0,0,0,0.4)',
        backfaceVisibility: 'hidden',
        WebkitBackfaceVisibility: 'hidden',
      }}
    >
      {/* Plastic-shell screws at each corner */}
      {[
        { left: '5%', top: '8%' },
        { right: '5%', top: '8%' },
        { left: '5%', bottom: '8%' },
        { right: '5%', bottom: '8%' },
      ].map((pos, i) => (
        <span
          key={i}
          aria-hidden
          className="absolute h-1.5 w-1.5 rounded-full bg-black/50"
          style={{ ...pos, boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.06)' }}
        />
      ))}

      {/* Side badge — A or B */}
      <span
        aria-hidden
        className="absolute left-3 top-3 rounded-md border border-picks-fg/15 bg-black/40 px-1.5 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-picks-fg/75 backdrop-blur"
      >
        Side {face}
      </span>

      {/* Flip button — sits in the opposite top corner */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation()
          onFlip()
        }}
        aria-label={`Flip to side ${face === 'A' ? 'B' : 'A'}`}
        className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-md border border-picks-fg/15 bg-black/40 px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-picks-fg/85 backdrop-blur transition-colors hover:bg-black/60"
      >
        flip → {face === 'A' ? 'B' : 'A'}
      </button>

      {/* The cream-coloured label area in the middle */}
      <div
        className="absolute inset-x-[10%] top-[16%] flex flex-col items-center justify-center rounded-[6px] px-4 py-3 text-center"
        style={{
          height: '42%',
          background: labelColor,
          color: '#1a1a1a',
          boxShadow:
            'inset 0 0 0 1px rgba(0,0,0,0.08), 0 4px 10px -4px rgba(0,0,0,0.3)',
          fontFamily:
            'ui-monospace, SFMono-Regular, Menlo, Monaco, "Courier New", monospace',
        }}
      >
        <p className="text-[9px] font-medium uppercase tracking-[0.32em] opacity-65">
          {brand}
        </p>
        <h3 className="mt-1 text-sm font-bold uppercase tracking-[0.08em] sm:text-base">
          {info.title}
        </h3>
        {info.artist && (
          <p className="mt-0.5 text-[10px] font-medium uppercase tracking-[0.22em] opacity-75 sm:text-xs">
            {info.artist}
          </p>
        )}
        {info.runtime && (
          <p className="mt-1 text-[10px] font-semibold tabular-nums opacity-65 sm:text-xs">
            {info.runtime}
          </p>
        )}
      </div>

      {/* The two reels — left + right.
          They sit BELOW the label, in the bottom "tape window". */}
      <div className="absolute inset-x-0 bottom-[8%] flex h-[36%] items-center justify-center gap-[18%]">
        <Reel instanceId={instanceId} />
        <Reel instanceId={instanceId} />
      </div>

      {/* The thin tape between the two reels — slight curve */}
      <svg
        className="pointer-events-none absolute inset-x-0"
        style={{ bottom: '8%', height: '36%' }}
        viewBox="0 0 100 36"
        preserveAspectRatio="none"
        aria-hidden
      >
        <path
          d="M 22 18 Q 50 26 78 18"
          fill="none"
          stroke="rgba(0,0,0,0.55)"
          strokeWidth="0.6"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
      </svg>

      {/* Play / pause button — bottom centre */}
      <button
        type="button"
        onClick={onTogglePlay}
        aria-label={playing ? 'Pause' : 'Play'}
        className="absolute bottom-2 left-1/2 inline-flex h-7 w-7 -translate-x-1/2 items-center justify-center rounded-full border border-picks-fg/15 bg-black/55 text-picks-fg/90 transition-colors hover:bg-black/70"
      >
        {playing ? (
          <span className="flex items-center gap-[2px]">
            <span className="block h-2.5 w-0.5 bg-picks-fg" />
            <span className="block h-2.5 w-0.5 bg-picks-fg" />
          </span>
        ) : (
          // Play triangle
          <span
            className="block h-0 w-0"
            style={{
              borderTop: '5px solid transparent',
              borderBottom: '5px solid transparent',
              borderLeft: '7px solid white',
              marginLeft: 2,
            }}
          />
        )}
      </button>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Reel — one rotating disc with five spoke holes
// ---------------------------------------------------------------------------

function Reel({ instanceId }: { instanceId: string }) {
  return (
    <div className="relative aspect-square h-full">
      {/* Outer hub — dark plastic */}
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background:
            'radial-gradient(circle at 30% 25%, #2a2733 0%, #14111c 80%)',
          boxShadow:
            'inset 0 0 0 1px rgba(255,255,255,0.06), inset 0 -4px 8px rgba(0,0,0,0.5)',
        }}
      />
      {/* Spinning disc with holes — this is what moves */}
      <div
        className={`bahrawy-cassette-reel-${instanceId} absolute inset-[14%] rounded-full`}
        style={{
          background:
            'radial-gradient(circle at 30% 28%, #4a4658 0%, #221e2b 78%)',
          boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.04)',
          willChange: 'transform',
        }}
      >
        {/* 5 spoke holes evenly around the centre */}
        {Array.from({ length: 5 }).map((_, i) => {
          const angle = (i / 5) * 360
          const rad = (angle * Math.PI) / 180
          // Place at radius 0.28 of the disc.
          const x = 50 + 28 * Math.sin(rad)
          const y = 50 - 28 * Math.cos(rad)
          return (
            <span
              key={i}
              aria-hidden
              className="absolute h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-black"
              style={{ left: `${x}%`, top: `${y}%` }}
            />
          )
        })}
        {/* Centre spindle hole */}
        <span
          aria-hidden
          className="absolute left-1/2 top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            background:
              'radial-gradient(circle, #1a1620 0%, #0a070d 80%)',
            boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.05)',
          }}
        />
      </div>
    </div>
  )
}
