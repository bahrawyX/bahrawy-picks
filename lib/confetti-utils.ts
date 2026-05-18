// ---------------------------------------------------------------------------
// Confetti particle physics utilities
// ---------------------------------------------------------------------------

export interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  rotation: number
  rotationSpeed: number
  size: number
  color: string
  opacity: number
  shape: 'square' | 'circle' | 'strip'
  life: number
  maxLife: number
}

export interface ConfettiConfig {
  count: number
  colors: string[]
  gravity: number
  drag: number
  spread: number
  velocity: number
  origin: { x: number; y: number }
}

const defaultColors = [
  '#ff6b6b',
  '#ffd93d',
  '#6bcb77',
  '#4d96ff',
  '#c084fc',
  '#fb7185',
  '#38bdf8',
  '#facc15',
]

export const defaultConfig: ConfettiConfig = {
  count: 80,
  colors: defaultColors,
  gravity: 0.15,
  drag: 0.02,
  spread: 60,
  velocity: 18,
  origin: { x: 0.5, y: 0.5 },
}

const shapes: Particle['shape'][] = ['square', 'circle', 'strip']

export function createParticles(
  canvas: HTMLCanvasElement,
  config: ConfettiConfig,
): Particle[] {
  const particles: Particle[] = []
  const originX = canvas.width * config.origin.x
  const originY = canvas.height * config.origin.y

  for (let i = 0; i < config.count; i++) {
    const angle =
      (-Math.PI / 2) +
      ((Math.random() - 0.5) * config.spread * Math.PI) / 180
    const speed = config.velocity * (0.5 + Math.random() * 0.5)
    const maxLife = 120 + Math.random() * 80

    particles.push({
      x: originX,
      y: originY,
      vx: Math.cos(angle) * speed * (Math.random() > 0.5 ? 1 : -1),
      vy: Math.sin(angle) * speed,
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 10,
      size: 4 + Math.random() * 6,
      color: config.colors[Math.floor(Math.random() * config.colors.length)],
      opacity: 1,
      shape: shapes[Math.floor(Math.random() * shapes.length)],
      life: 0,
      maxLife,
    })
  }

  return particles
}

export function updateParticle(p: Particle, gravity: number, drag: number): boolean {
  p.life++
  if (p.life >= p.maxLife) return false

  p.vy += gravity
  p.vx *= 1 - drag
  p.vy *= 1 - drag
  p.x += p.vx
  p.y += p.vy
  p.rotation += p.rotationSpeed

  // Fade out in last 25% of life
  const fadeStart = p.maxLife * 0.75
  if (p.life > fadeStart) {
    p.opacity = 1 - (p.life - fadeStart) / (p.maxLife - fadeStart)
  }

  return true
}

export function drawParticle(
  ctx: CanvasRenderingContext2D,
  p: Particle,
): void {
  ctx.save()
  ctx.translate(p.x, p.y)
  ctx.rotate((p.rotation * Math.PI) / 180)
  ctx.globalAlpha = p.opacity

  ctx.fillStyle = p.color

  switch (p.shape) {
    case 'circle':
      ctx.beginPath()
      ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2)
      ctx.fill()
      break
    case 'strip':
      ctx.fillRect(-p.size / 6, -p.size, p.size / 3, p.size * 2)
      break
    case 'square':
    default:
      ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size)
      break
  }

  ctx.restore()
}
