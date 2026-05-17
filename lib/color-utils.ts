// Pure JS color conversion utilities — no library needed

export interface RGB { r: number; g: number; b: number }
export interface HSL { h: number; s: number; l: number }
export interface HSV { h: number; s: number; v: number }

export function hexToRgb(hex: string): RGB {
  const clean = hex.replace('#', '')
  const full = clean.length === 3
    ? clean.split('').map((c) => c + c).join('')
    : clean
  const n = parseInt(full, 16)
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 }
}

export function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map((v) => Math.round(v).toString(16).padStart(2, '0')).join('')
}

export function rgbToHsl(r: number, g: number, b: number): HSL {
  const r1 = r / 255, g1 = g / 255, b1 = b / 255
  const max = Math.max(r1, g1, b1), min = Math.min(r1, g1, b1)
  const l = (max + min) / 2
  if (max === min) return { h: 0, s: 0, l: Math.round(l * 100) }
  const d = max - min
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
  let h = 0
  if (max === r1) h = ((g1 - b1) / d + (g1 < b1 ? 6 : 0)) / 6
  else if (max === g1) h = ((b1 - r1) / d + 2) / 6
  else h = ((r1 - g1) / d + 4) / 6
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) }
}

export function hslToRgb(h: number, s: number, l: number): RGB {
  const s1 = s / 100, l1 = l / 100
  if (s1 === 0) { const v = Math.round(l1 * 255); return { r: v, g: v, b: v } }
  const hue2rgb = (p: number, q: number, t: number) => {
    let tt = t
    if (tt < 0) tt += 1
    if (tt > 1) tt -= 1
    if (tt < 1 / 6) return p + (q - p) * 6 * tt
    if (tt < 1 / 2) return q
    if (tt < 2 / 3) return p + (q - p) * (2 / 3 - tt) * 6
    return p
  }
  const q = l1 < 0.5 ? l1 * (1 + s1) : l1 + s1 - l1 * s1
  const p = 2 * l1 - q
  const h1 = h / 360
  return {
    r: Math.round(hue2rgb(p, q, h1 + 1 / 3) * 255),
    g: Math.round(hue2rgb(p, q, h1) * 255),
    b: Math.round(hue2rgb(p, q, h1 - 1 / 3) * 255),
  }
}

export function hsvToRgb(h: number, s: number, v: number): RGB {
  const s1 = s / 100, v1 = v / 100
  const c = v1 * s1
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1))
  const m = v1 - c
  let r1 = 0, g1 = 0, b1 = 0
  if (h < 60) { r1 = c; g1 = x }
  else if (h < 120) { r1 = x; g1 = c }
  else if (h < 180) { g1 = c; b1 = x }
  else if (h < 240) { g1 = x; b1 = c }
  else if (h < 300) { r1 = x; b1 = c }
  else { r1 = c; b1 = x }
  return {
    r: Math.round((r1 + m) * 255),
    g: Math.round((g1 + m) * 255),
    b: Math.round((b1 + m) * 255),
  }
}

export function rgbToHsv(r: number, g: number, b: number): HSV {
  const r1 = r / 255, g1 = g / 255, b1 = b / 255
  const max = Math.max(r1, g1, b1), min = Math.min(r1, g1, b1)
  const d = max - min
  const v = max
  const s = max === 0 ? 0 : d / max
  if (max === min) return { h: 0, s: Math.round(s * 100), v: Math.round(v * 100) }
  let h = 0
  if (max === r1) h = ((g1 - b1) / d + (g1 < b1 ? 6 : 0)) / 6
  else if (max === g1) h = ((b1 - r1) / d + 2) / 6
  else h = ((r1 - g1) / d + 4) / 6
  return { h: Math.round(h * 360), s: Math.round(s * 100), v: Math.round(v * 100) }
}

export function isValidHex(hex: string): boolean {
  return /^#?([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(hex)
}

export function formatColor(
  color: { r: number; g: number; b: number },
  format: 'hex' | 'rgb' | 'hsl',
): string {
  if (format === 'hex') return rgbToHex(color.r, color.g, color.b)
  if (format === 'rgb') return `rgb(${color.r}, ${color.g}, ${color.b})`
  const { h, s, l } = rgbToHsl(color.r, color.g, color.b)
  return `hsl(${h}, ${s}%, ${l}%)`
}

// Material Design 500 palette
export const MATERIAL_SWATCHES = [
  '#F44336', '#E91E63', '#9C27B0', '#673AB7', '#3F51B5', '#2196F3',
  '#03A9F4', '#00BCD4', '#009688', '#4CAF50', '#8BC34A', '#CDDC39',
  '#FFEB3B', '#FFC107', '#FF9800', '#FF5722', '#795548', '#607D8B',
]
