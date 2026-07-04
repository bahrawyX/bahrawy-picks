'use client'

import { useId, useRef } from 'react'
import { motion, useScroll, useTransform, type MotionValue } from 'framer-motion'
import { cn } from '@/lib/utils'

/* ------------------------------------------------------------------ */
/*  Paths                                                              */
/* ------------------------------------------------------------------ */

/**
 * Bahrawy signature path — a calligraphic flourish that descends from the top
 * with a triple-spiral knot at its heart, then sweeps out into a final curl.
 * ViewBox: 0 0 1000 2400.
 */
export const BAHRAWY_PATH =
  'M 500 -20 C 680 100 780 280 640 400 C 500 520 380 440 420 320 C 460 200 580 220 540 360 C 500 500 320 540 320 700 C 320 860 540 900 660 800 C 780 700 700 520 540 600 C 380 680 480 880 640 880 C 800 880 880 700 760 580 C 640 460 460 580 360 760 C 260 940 380 1180 580 1180 C 780 1180 920 980 880 1220 C 840 1460 480 1380 360 1560 C 240 1740 320 1980 540 2000 C 760 2020 840 1820 720 1740 C 600 1660 480 1860 620 1980 C 760 2100 920 2280 760 2400'

export const BAHRAWY_VIEWBOX = '0 0 1000 2400'

/** Original skiper19 path, kept for reference / opt-in. */
export const SKIPER19_PATH =
  'M876.605 394.131C788.982 335.917 696.198 358.139 691.836 416.303C685.453 501.424 853.722 498.43 941.95 409.714C1016.1 335.156 1008.64 186.907 906.167 142.846C807.014 100.212 712.699 198.494 789.049 245.127C889.053 306.207 986.062 116.979 840.548 43.3233C743.932 -5.58141 678.027 57.1682 672.279 112.188C666.53 167.208 712.538 172.943 736.353 163.088C760.167 153.234 764.14 120.924 746.651 93.3868C717.461 47.4252 638.894 77.8642 601.018 116.979C568.164 150.908 557 201.079 576.467 246.924C593.342 286.664 630.24 310.55 671.68 302.614C756.114 286.446 729.747 206.546 681.86 186.442C630.54 164.898 492 209.318 495.026 287.644C496.837 334.494 518.402 366.466 582.455 367.287C680.013 368.538 771.538 299.456 898.634 292.434C1007.02 286.446 1192.67 309.384 1242.36 382.258C1266.99 418.39 1273.65 443.108 1247.75 474.477C1217.32 511.33 1149.4 511.259 1096.84 466.093C1044.29 420.928 1029.14 380.576 1033.97 324.172C1038.31 273.428 1069.55 228.986 1117.2 216.384C1152.2 207.128 1188.29 213.629 1194.45 245.127C1201.49 281.062 1132.22 280.104 1100.44 272.673C1065.32 264.464 1044.22 234.837 1032.77 201.413C1019.29 162.061 1029.71 131.126 1056.44 100.965C1086.19 67.4032 1143.96 54.5526 1175.78 86.1513C1207.02 117.17 1186.81 143.379 1156.22 166.691C1112.57 199.959 1052.57 186.238 999.784 155.164C957.312 130.164 899.171 63.7054 931.284 26.3214C952.068 2.12513 996.288 3.87363 1007.22 43.58C1018.15 83.2749 1003.56 122.644 975.969 163.376C948.377 204.107 907.272 255.122 913.558 321.045C919.727 385.734 990.968 497.068 1063.84 503.35C1111.46 507.456 1166.79 511.984 1175.68 464.527C1191.52 379.956 1101.26 334.985 1030.29 377.017C971.109 412.064 956.297 483.647 953.797 561.655C947.587 755.413 1197.56 941.828 936.039 1140.66C745.771 1285.32 321.926 950.737 134.536 1202.19C-6.68295 1391.68 -53.4837 1655.38 131.935 1760.5C478.381 1956.91 1124.19 1515 1201.28 1997.83C1273.66 2451.23 100.805 1864.7 303.794 2668.89'

export const SKIPER19_VIEWBOX = '0 0 1278 2319'

/* ------------------------------------------------------------------ */
/*  Variants (monochromatic, site-matching)                            */
/* ------------------------------------------------------------------ */

export type ScrollPathRevealVariant = 'primary' | 'muted' | 'warm' | 'gradient'

const VARIANT_STROKE: Record<
  Exclude<ScrollPathRevealVariant, 'gradient'>,
  string
> = {
  primary: '#FFFFFF',
  muted: 'rgba(255, 255, 255, 0.55)',
  warm: '#FCD34D', // amber-300 — matches favorite-button accent
}

const GRADIENT_STOPS: Array<[string, string]> = [
  ['0%', '#FFFFFF'],
  ['50%', '#FCD34D'],
  ['100%', '#FFFFFF'],
]

const DEFAULT_CAPTIONS = ['The Stroke', 'That follows the', 'Scroll Progress']

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export interface ScrollPathRevealProps {
  variant?: ScrollPathRevealVariant
  strokeColor?: string
  strokeWidth?: number
  pathD?: string
  viewBox?: string
  heightVh?: number
  backgroundClassName?: string
  className?: string
  /** Three short lines revealed in sequence as scroll progresses. Pass an empty array to hide. */
  captions?: string[]
  /** Classes on each caption line — override to restyle the text color/size. */
  captionClassName?: string
}

export function ScrollPathReveal({
  variant = 'primary',
  strokeColor,
  strokeWidth = 8,
  pathD = BAHRAWY_PATH,
  viewBox = BAHRAWY_VIEWBOX,
  heightVh = 350,
  backgroundClassName = 'bg-black',
  className,
  captions = DEFAULT_CAPTIONS,
  captionClassName,
}: ScrollPathRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  })

  return (
    <div
      ref={containerRef}
      className={cn('relative w-full', backgroundClassName, className)}
      style={{ height: `${heightVh}vh` }}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <LinePath
          pathD={pathD}
          viewBox={viewBox}
          variant={variant}
          strokeColor={strokeColor}
          strokeWidth={strokeWidth}
          scrollYProgress={scrollYProgress}
        />
        {captions.length > 0 && (
          <Captions
            captions={captions}
            captionClassName={captionClassName}
            scrollYProgress={scrollYProgress}
          />
        )}
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Path renderer                                                      */
/* ------------------------------------------------------------------ */

interface LinePathProps {
  pathD: string
  viewBox: string
  variant: ScrollPathRevealVariant
  strokeColor?: string
  strokeWidth: number
  scrollYProgress: MotionValue<number>
}

function LinePath({
  pathD,
  viewBox,
  variant,
  strokeColor,
  strokeWidth,
  scrollYProgress,
}: LinePathProps) {
  const gradientId = useId()

  const resolvedStroke =
    strokeColor ??
    (variant === 'gradient'
      ? `url(#${gradientId})`
      : VARIANT_STROKE[variant as Exclude<ScrollPathRevealVariant, 'gradient'>])

  return (
    <svg
      aria-hidden="true"
      viewBox={viewBox}
      fill="none"
      overflow="visible"
      preserveAspectRatio="xMidYMid meet"
      xmlns="http://www.w3.org/2000/svg"
      className="absolute inset-0 h-full w-full"
    >
      {variant === 'gradient' && !strokeColor && (
        <defs>
          <linearGradient
            id={gradientId}
            x1="0%"
            y1="0%"
            x2="0%"
            y2="100%"
          >
            {GRADIENT_STOPS.map(([offset, color]) => (
              <stop key={offset} offset={offset} stopColor={color} />
            ))}
          </linearGradient>
        </defs>
      )}
      <motion.path
        d={pathD}
        stroke={resolvedStroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ pathLength: scrollYProgress }}
      />
    </svg>
  )
}

/* ------------------------------------------------------------------ */
/*  Captions — text that fades in line-by-line with scroll             */
/* ------------------------------------------------------------------ */

interface CaptionsProps {
  captions: string[]
  captionClassName?: string
  scrollYProgress: MotionValue<number>
}

function Captions({ captions, captionClassName, scrollYProgress }: CaptionsProps) {
  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center px-6 md:px-10">
      <div className="flex max-w-2xl flex-col items-center gap-2 text-center sm:gap-3">
        {captions.map((line, i) => (
          <CaptionLine
            key={`${i}-${line}`}
            line={line}
            index={i}
            total={captions.length}
            captionClassName={captionClassName}
            scrollYProgress={scrollYProgress}
          />
        ))}
      </div>
    </div>
  )
}

interface CaptionLineProps {
  line: string
  index: number
  total: number
  captionClassName?: string
  scrollYProgress: MotionValue<number>
}

function CaptionLine({
  line,
  index,
  total,
  captionClassName,
  scrollYProgress,
}: CaptionLineProps) {
  // Stagger each line over the scroll range. Each line reveals over a 20% window
  // and then stays visible.
  // Line 0 reveals roughly 0.00 → 0.20, line 1: 0.25 → 0.45, line 2: 0.50 → 0.70.
  const span = 0.20
  const gap = total > 1 ? (1 - span - 0.10) / (total - 1) : 0
  const start = index * gap
  const end = start + span

  const opacity = useTransform(scrollYProgress, [start, end], [0, 1])
  const y = useTransform(scrollYProgress, [start, end], [24, 0])
  const blur = useTransform(scrollYProgress, [start, end], [12, 0])
  const filter = useTransform(blur, (b) => `blur(${b}px)`)

  return (
    <motion.h2
      style={{ opacity, y, filter }}
      className={cn(
        'text-balance text-4xl font-semibold tracking-[-0.04em] text-white sm:text-5xl md:text-6xl lg:text-7xl',
        captionClassName,
      )}
    >
      {line}
    </motion.h2>
  )
}
