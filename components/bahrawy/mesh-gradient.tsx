'use client'

/**
 * <MeshGradient />
 *
 * A fullscreen OGL fragment shader that paints a Stripe-homepage-style
 * mesh gradient. Five colored "blobs" drift around the canvas — each
 * has a hand-tuned base position, a per-blob orbit speed, a phase
 * offset, and a soft `smoothstep` falloff. The result is mixed onto a
 * dark base via chained `mix()` calls so adjacent colors melt into
 * each other rather than blocking out.
 *
 * Drop in as a full-bleed hero background — the canvas auto-resizes
 * to its parent.
 */

import * as React from 'react'
import { Renderer, Program, Mesh, Triangle, Color } from 'ogl'
import { cn } from '@/lib/utils'
import { usePrefersReducedMotion } from '@/lib/use-prefers-reduced-motion'

export interface MeshGradientProps {
  /** Up to 5 hex colors blended across the canvas. Extras are ignored. */
  colors?: string[]
  /** Base background color. Default '#050507'. */
  background?: string
  /** Animation speed multiplier. Default 1. */
  speed?: number
  /** Blob radius (0..1). Default 0.55. */
  blobSize?: number
  /** Blend intensity 0..1 — higher = more saturated. Default 0.9. */
  intensity?: number
  className?: string
}

const DEFAULT_COLORS = ['#A78BFA', '#22D3EE', '#F472B6', '#FBBF24', '#34D399']

const VERT = /* glsl */ `
attribute vec2 position;
varying vec2 vUv;
void main() {
  vUv = position * 0.5 + 0.5;
  gl_Position = vec4(position, 0.0, 1.0);
}
`

const FRAG = /* glsl */ `
precision highp float;

varying vec2 vUv;
uniform vec2  uResolution;
uniform float uTime;
uniform float uBlobSize;
uniform float uIntensity;
uniform vec3  uBg;
uniform vec3  uC0;
uniform vec3  uC1;
uniform vec3  uC2;
uniform vec3  uC3;
uniform vec3  uC4;

// Soft circular falloff — 1.0 at center, 0.0 at radius.
float blob(vec2 uv, vec2 center, float radius) {
  float d = distance(uv, center);
  return smoothstep(radius, 0.0, d);
}

void main() {
  // Aspect-corrected uv (so blobs don't squash on wide screens).
  float aspect = uResolution.x / uResolution.y;
  vec2 uv = vec2(vUv.x * aspect, vUv.y);
  vec2 ar = vec2(aspect, 1.0);

  float t = uTime;

  // Five orbits — base position + a per-blob lissajous-ish drift.
  vec2 p0 = (vec2(0.25, 0.35) + vec2(cos(t * 0.31),       sin(t * 0.27 + 1.2)) * 0.20) * ar;
  vec2 p1 = (vec2(0.75, 0.30) + vec2(cos(t * 0.22 + 1.7), sin(t * 0.35 + 0.4)) * 0.22) * ar;
  vec2 p2 = (vec2(0.55, 0.70) + vec2(cos(t * 0.18 + 3.1), sin(t * 0.24 + 2.3)) * 0.24) * ar;
  vec2 p3 = (vec2(0.20, 0.80) + vec2(cos(t * 0.27 + 0.6), sin(t * 0.19 + 4.8)) * 0.20) * ar;
  vec2 p4 = (vec2(0.85, 0.65) + vec2(cos(t * 0.34 + 5.2), sin(t * 0.21 + 1.9)) * 0.18) * ar;

  float w0 = blob(uv, p0, uBlobSize);
  float w1 = blob(uv, p1, uBlobSize);
  float w2 = blob(uv, p2, uBlobSize);
  float w3 = blob(uv, p3, uBlobSize);
  float w4 = blob(uv, p4, uBlobSize);

  // Start from base bg, mix toward each blob's colour by its weight.
  vec3 col = uBg;
  col = mix(col, uC0, w0 * uIntensity);
  col = mix(col, uC1, w1 * uIntensity);
  col = mix(col, uC2, w2 * uIntensity);
  col = mix(col, uC3, w3 * uIntensity);
  col = mix(col, uC4, w4 * uIntensity);

  // Soft vignette so edges read.
  vec2 vc = vUv - 0.5;
  float v = 1.0 - smoothstep(0.55, 0.95, length(vc));
  col *= mix(0.85, 1.0, v);

  // Subtle grain so big flat blends don't band.
  float grain = fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233))) * 43758.5453);
  col += (grain - 0.5) * 0.012;

  gl_FragColor = vec4(col, 1.0);
}
`

export function MeshGradient({
  colors = DEFAULT_COLORS,
  background = '#050507',
  speed = 1,
  blobSize = 0.55,
  intensity = 0.9,
  className,
}: MeshGradientProps) {
  const mountRef = React.useRef<HTMLDivElement>(null)
  const reduced = usePrefersReducedMotion()
  // Re-init only when these change.
  const colorKey = colors.slice(0, 5).join('|')

  React.useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    const renderer = new Renderer({
      dpr: Math.min(window.devicePixelRatio, 2),
      alpha: false,
    })
    const gl = renderer.gl
    gl.clearColor(0, 0, 0, 1)
    mount.appendChild(gl.canvas)
    gl.canvas.style.width = '100%'
    gl.canvas.style.height = '100%'
    gl.canvas.style.display = 'block'

    const pick = (i: number) => {
      const hex = colors[i] ?? DEFAULT_COLORS[i]
      const c = new Color(hex)
      return [c.r, c.g, c.b] as [number, number, number]
    }
    const bg = new Color(background)

    const geometry = new Triangle(gl)
    const program = new Program(gl, {
      vertex: VERT,
      fragment: FRAG,
      uniforms: {
        uTime: { value: 0 },
        uResolution: { value: [mount.clientWidth, mount.clientHeight] },
        uBlobSize: { value: blobSize },
        uIntensity: { value: intensity },
        uBg: { value: [bg.r, bg.g, bg.b] },
        uC0: { value: pick(0) },
        uC1: { value: pick(1) },
        uC2: { value: pick(2) },
        uC3: { value: pick(3) },
        uC4: { value: pick(4) },
      },
    })
    const mesh = new Mesh(gl, { geometry, program })

    const resize = () => {
      const w = mount.clientWidth
      const h = mount.clientHeight
      if (w === 0 || h === 0) return
      renderer.setSize(w, h)
      program.uniforms.uResolution.value = [w, h]
      // Resizing clears the buffer — repaint the static frame.
      if (reduced) renderer.render({ scene: mesh })
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(mount)

    let raf = 0
    const start = performance.now()
    const animate = (time: number) => {
      program.uniforms.uTime.value = ((time - start) / 1000) * speed
      renderer.render({ scene: mesh })
      raf = requestAnimationFrame(animate)
    }
    if (reduced) {
      // Reduced motion: draw a single static frame, skip the RAF loop.
      renderer.render({ scene: mesh })
    } else {
      raf = requestAnimationFrame(animate)
    }

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      if (gl.canvas.parentElement === mount) mount.removeChild(gl.canvas)
      const ext = gl.getExtension('WEBGL_lose_context')
      ext?.loseContext()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [colorKey, background, speed, blobSize, intensity, reduced])

  return (
    <div
      ref={mountRef}
      className={cn('relative h-full w-full overflow-hidden', className)}
    />
  )
}
