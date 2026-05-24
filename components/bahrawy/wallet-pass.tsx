'use client'

/**
 * <WalletPass />
 *
 * Apple Wallet–style pass card. Metallic linear-gradient surface,
 * the iconic perforated top edge (done with a CSS `mask-image` of
 * tiny circles repeated across the top — the cutouts blend with
 * whatever sits behind the card), an organisation header, a big
 * title, optional detail rows, and a CSS-drawn barcode at the bottom
 * whose stripe widths are deterministic from the barcode string.
 *
 * Variants ship with hand-tuned palettes: `event`, `transit`,
 * `coupon`, `boarding`. Pass `gradient` to fully customise.
 */

import * as React from 'react'
import { cn } from '@/lib/utils'

export type WalletPassVariant =
  | 'event'
  | 'transit'
  | 'coupon'
  | 'boarding'
  | 'custom'

export interface WalletPassDetail {
  label: string
  value: React.ReactNode
}

export interface WalletPassProps {
  /** Visual preset. Use 'custom' + `gradient` for full control. */
  variant?: WalletPassVariant
  /** Override the variant's gradient: 2 or 3 hex stops. */
  gradient?: [string, string] | [string, string, string]
  /** Logo / icon at the top-left of the pass. */
  logo?: React.ReactNode
  /** Organisation name (top header). */
  organization: string
  /** Optional pill at top-right (e.g. price, type chip). */
  badge?: React.ReactNode
  /** Big primary text — event name / route / etc. */
  title: React.ReactNode
  /** Subtitle under the title. */
  subtitle?: React.ReactNode
  /** Detail rows shown above the barcode (label / value). */
  details?: WalletPassDetail[]
  /** Barcode string (used as seed for the visual + as the readable text). */
  barcode?: string
  /** Hide the barcode strip entirely. Default false. */
  hideBarcode?: boolean
  /** Card width in px. Default 320. */
  width?: number
  className?: string
}

const VARIANT_GRADIENTS: Record<
  Exclude<WalletPassVariant, 'custom'>,
  [string, string, string]
> = {
  event: ['#7C3AED', '#DB2777', '#F97316'],     // violet → pink → orange
  transit: ['#0EA5E9', '#22D3EE', '#06B6D4'],   // blue → cyan
  coupon: ['#10B981', '#84CC16', '#FACC15'],    // emerald → lime → yellow
  boarding: ['#27272A', '#3F3F46', '#52525B'],  // graphite
}

export function WalletPass({
  variant = 'event',
  gradient,
  logo,
  organization,
  badge,
  title,
  subtitle,
  details = [],
  barcode = 'A1B2-C3D4-E5F6',
  hideBarcode = false,
  width = 320,
  className,
}: WalletPassProps) {
  const stops =
    gradient ??
    (variant === 'custom' ? VARIANT_GRADIENTS.event : VARIANT_GRADIENTS[variant])
  const grad =
    stops.length === 3
      ? `linear-gradient(155deg, ${stops[0]} 0%, ${stops[1]} 55%, ${stops[2]} 100%)`
      : `linear-gradient(155deg, ${stops[0]} 0%, ${stops[1]} 100%)`

  // Perforated-top mask — tiny circles cut from the top edge.
  // The mask is solid black (visible) everywhere EXCEPT a horizontal
  // strip of small circles at y=0, which become transparent (cut out).
  const perforationMask = `
    radial-gradient(circle 5px at 10px 0px, transparent 99%, black 100%)
    0 0 / 20px 6px repeat-x,
    linear-gradient(black, black) 0 6px / 100% calc(100% - 6px) no-repeat
  `

  return (
    <div className={cn('inline-block', className)} style={{ width }}>
      {/* The card itself */}
      <div
        className="relative overflow-hidden rounded-2xl shadow-2xl shadow-black/40"
        style={{
          background: grad,
          maskImage: perforationMask,
          WebkitMaskImage: perforationMask,
          paddingTop: 22, // leave room below the perforations
        }}
      >
        {/* Highlight sheen — subtle diagonal gloss */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-50"
          style={{
            background:
              'linear-gradient(115deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0) 30%, rgba(255,255,255,0) 70%, rgba(255,255,255,0.06) 100%)',
            mixBlendMode: 'overlay',
          }}
        />

        {/* Header */}
        <div className="relative flex items-start justify-between gap-3 px-5 pt-3">
          <div className="flex min-w-0 items-center gap-2">
            {logo && (
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-white/15 text-white">
                {logo}
              </span>
            )}
            <span className="truncate text-[10px] font-semibold uppercase tracking-[0.22em] text-white/85">
              {organization}
            </span>
          </div>
          {badge && (
            <span className="shrink-0 rounded-md bg-white/15 px-2 py-0.5 text-[10px] font-semibold tracking-tight text-white/90 backdrop-blur">
              {badge}
            </span>
          )}
        </div>

        {/* Title */}
        <div className="relative px-5 pt-5">
          <h3 className="text-[22px] font-bold leading-tight tracking-tight text-white drop-shadow-sm">
            {title}
          </h3>
          {subtitle && (
            <p className="mt-0.5 text-[12px] text-white/70">{subtitle}</p>
          )}
        </div>

        {/* Detail rows */}
        {details.length > 0 && (
          <div className="relative grid grid-cols-3 gap-2 px-5 pt-5">
            {details.slice(0, 3).map((d, i) => (
              <div key={i} className="min-w-0">
                <p className="truncate text-[9.5px] font-semibold uppercase tracking-[0.18em] text-white/55">
                  {d.label}
                </p>
                <p className="mt-0.5 truncate text-[13px] font-semibold tracking-tight text-white">
                  {d.value}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Hairline divider above the barcode */}
        {!hideBarcode && (
          <div
            aria-hidden
            className="relative mx-5 mt-5 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"
          />
        )}

        {/* Barcode */}
        {!hideBarcode && (
          <div className="relative px-5 pt-3 pb-4">
            <div className="rounded-md bg-white px-3 py-2.5">
              <Barcode value={barcode} />
              <p className="mt-1.5 text-center font-mono text-[10px] tracking-[0.18em] text-zinc-800">
                {barcode}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------

function Barcode({ value }: { value: string }) {
  // Deterministic-but-randomish stripe widths from the value.
  const stripes = React.useMemo(() => {
    let h = 0
    for (let i = 0; i < value.length; i++) h = (h * 31 + value.charCodeAt(i)) | 0
    let s = (h ^ 0x9e3779b9) >>> 0
    const rand = () => {
      s = (s * 1664525 + 1013904223) >>> 0
      return s / 0x100000000
    }
    const N = 48
    const out: { width: number; black: boolean }[] = []
    for (let i = 0; i < N; i++) {
      const w = 1 + Math.floor(rand() * 3) // 1..3
      out.push({ width: w, black: rand() > 0.32 })
    }
    return out
  }, [value])

  return (
    <div className="flex h-9 items-stretch gap-[1.5px]">
      {stripes.map((s, i) => (
        <span
          key={i}
          aria-hidden
          className="block"
          style={{
            width: s.width,
            background: s.black ? '#0a0a0a' : 'transparent',
          }}
        />
      ))}
    </div>
  )
}
