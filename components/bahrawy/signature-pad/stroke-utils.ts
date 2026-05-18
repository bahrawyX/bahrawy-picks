export interface Point {
  x: number
  y: number
  pressure: number
  timestamp: number
}

export interface StrokeOptions {
  minWidth: number
  maxWidth: number
  smoothing: number
}

/**
 * Calculate distance between two points
 */
export function distance(p1: Point, p2: Point): number {
  return Math.sqrt((p2.x - p1.x) ** 2 + (p2.y - p1.y) ** 2)
}

/**
 * Calculate velocity between two points
 */
export function velocity(p1: Point, p2: Point): number {
  const dt = p2.timestamp - p1.timestamp
  if (dt <= 0) return 0
  return distance(p1, p2) / dt
}

/**
 * Get stroke width based on velocity (faster = thinner)
 */
export function getStrokeWidth(
  vel: number,
  pressure: number,
  opts: StrokeOptions,
): number {
  const { minWidth, maxWidth } = opts
  // Normalize velocity (0 = slow, 1 = fast)
  const normalizedVel = Math.min(vel / 2, 1)
  // Invert: faster = thinner
  const widthFactor = 1 - normalizedVel * 0.6
  // Apply pressure
  const pressureFactor = pressure > 0 ? pressure : 0.5
  return minWidth + (maxWidth - minWidth) * widthFactor * pressureFactor
}

/**
 * Smooth a point using exponential moving average
 */
export function smoothPoint(
  current: Point,
  previous: Point,
  factor: number,
): Point {
  return {
    x: previous.x + (current.x - previous.x) * factor,
    y: previous.y + (current.y - previous.y) * factor,
    pressure: current.pressure,
    timestamp: current.timestamp,
  }
}

/**
 * Get quadratic bezier midpoint for smooth curves
 */
export function getMidPoint(p1: Point, p2: Point): { x: number; y: number } {
  return {
    x: (p1.x + p2.x) / 2,
    y: (p1.y + p2.y) / 2,
  }
}

/**
 * Draw a smooth stroke segment using quadratic bezier curves
 */
export function drawStrokeSegment(
  ctx: CanvasRenderingContext2D,
  points: Point[],
  opts: StrokeOptions,
  color: string,
): void {
  if (points.length < 2) return

  ctx.strokeStyle = color
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'

  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1]
    const curr = points[i]
    const vel = velocity(prev, curr)
    const width = getStrokeWidth(vel, curr.pressure, opts)

    ctx.lineWidth = width

    if (i === 1) {
      ctx.beginPath()
      ctx.moveTo(prev.x, prev.y)
      ctx.lineTo(curr.x, curr.y)
      ctx.stroke()
    } else {
      const prevPrev = points[i - 2]
      const mid1 = getMidPoint(prevPrev, prev)
      const mid2 = getMidPoint(prev, curr)

      ctx.beginPath()
      ctx.moveTo(mid1.x, mid1.y)
      ctx.quadraticCurveTo(prev.x, prev.y, mid2.x, mid2.y)
      ctx.stroke()
    }
  }
}

/**
 * Convert canvas to SVG path data
 */
export function pointsToSVGPath(strokes: Point[][]): string {
  return strokes
    .map((points) => {
      if (points.length === 0) return ''
      if (points.length === 1) {
        return `M ${points[0].x} ${points[0].y} L ${points[0].x} ${points[0].y}`
      }

      let path = `M ${points[0].x} ${points[0].y}`
      for (let i = 1; i < points.length; i++) {
        const prev = points[i - 1]
        const curr = points[i]
        if (i === 1) {
          path += ` L ${curr.x} ${curr.y}`
        } else {
          const prevPrev = points[i - 2]
          const mid1 = getMidPoint(prevPrev, prev)
          const mid2 = getMidPoint(prev, curr)
          path += ` M ${mid1.x} ${mid1.y} Q ${prev.x} ${prev.y} ${mid2.x} ${mid2.y}`
        }
      }
      return path
    })
    .filter(Boolean)
    .join(' ')
}
