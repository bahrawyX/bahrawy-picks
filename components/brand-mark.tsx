import { cn } from '@/lib/utils'

/**
 * <BrandMark />
 *
 * The Bahrawy "tilted stack" — three rounded bars rotated -12°.
 * Two upper bars use currentColor at varying alpha (so they adapt to
 * the surrounding text colour), the bottom bar is fixed lime to keep
 * the brand accent recognisable on any background.
 *
 * Size via Tailwind: pass an `h-X w-X` className.
 */
export interface BrandMarkProps extends React.SVGProps<SVGSVGElement> {
  /** Override the accent (bottom) bar colour. Default '#E6FF5C'. */
  accent?: string
}

export function BrandMark({
  accent = '#E6FF5C',
  className,
  ...rest
}: BrandMarkProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 72 72"
      aria-hidden="true"
      className={cn('h-5 w-5', className)}
      {...rest}
    >
      <g transform="rotate(-12 36 36)">
        <rect
          x="10"
          y="14"
          width="38"
          height="12"
          rx="6"
          fill="currentColor"
          fillOpacity="0.45"
        />
        <rect
          x="10"
          y="30"
          width="50"
          height="12"
          rx="6"
          fill="currentColor"
          fillOpacity="0.75"
        />
        <rect x="10" y="46" width="42" height="12" rx="6" fill={accent} />
      </g>
    </svg>
  )
}
