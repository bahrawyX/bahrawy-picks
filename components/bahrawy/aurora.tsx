'use client'

/**
 * <Aurora />
 *
 * A fullscreen OGL fragment shader that paints living aurora-style
 * color bands. We layer three octaves of value-noise, warp the
 * sampling coordinates with curl-ish offsets, then map the result
 * through a 3-color gradient. A vertical mask fades the bottom out so
 * the bands feel like they're hanging in the upper atmosphere.
 *
 * Drop in as a full-bleed background — the canvas auto-resizes to its
 * parent.
 */

import * as React from 'react'
import { Renderer, Program, Mesh, Triangle, Color } from 'ogl'
import { cn } from '@/lib/utils'
import { usePrefersReducedMotion } from '@/lib/use-prefers-reduced-motion'
import { useOnScreen } from '@/lib/use-on-screen'

export interface AuroraProps {
  /** Three hex colors blended across the bands. */
  colors?: [string, string, string]
  /** Animation speed. Default 0.6. */
  speed?: number
  /** Vertical scale of the bands. Default 1. */
  scale?: number
  /** Overall brightness. Default 1. */
  intensity?: number
  className?: string
}

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
uniform float uTime;
uniform vec2  uResolution;
uniform vec3  uColor1;
uniform vec3  uColor2;
uniform vec3  uColor3;
uniform float uSpeed;
uniform float uScale;
uniform float uIntensity;

// 2D value noise -----------------------------------------------------
vec2 hash22(vec2 p) {
  p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
  return fract(sin(p) * 43758.5453);
}
float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  float a = dot(hash22(i),                vec2(1.0)) - 1.0;
  float b = dot(hash22(i + vec2(1, 0)),   vec2(1.0)) - 1.0;
  float c = dot(hash22(i + vec2(0, 1)),   vec2(1.0)) - 1.0;
  float d = dot(hash22(i + vec2(1, 1)),   vec2(1.0)) - 1.0;
  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y) * 0.5 + 0.5;
}
float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 4; i++) {
    v += a * noise(p);
    p *= 2.07;
    a *= 0.5;
  }
  return v;
}

void main() {
  vec2 uv = vUv;
  float aspect = uResolution.x / uResolution.y;
  vec2 p = vec2(uv.x * aspect, uv.y) * uScale;

  float t = uTime * uSpeed;

  // Curl-ish warp — sample fbm twice with offsets to get a 2D vector
  // field, then drift the sampling coords with it.
  vec2 warp = vec2(
    fbm(p + vec2(0.0,  t * 0.5)),
    fbm(p + vec2(5.0, -t * 0.5))
  );
  p += (warp - 0.5) * 0.8;

  float n1 = fbm(p * 1.5 + vec2(0.0, t * 0.30));
  float n2 = fbm(p * 2.2 + vec2(3.0, t * 0.18));

  // Aurora bands — vertical ridges from sin() of n.
  float band = sin((p.y + n1 * 1.6) * 3.5 + t * 0.6) * 0.5 + 0.5;
  band = pow(band, 2.2) * smoothstep(0.0, 1.0, n2);

  // Color mix across three stops.
  vec3 cA = mix(uColor1, uColor2, smoothstep(0.0, 0.55, band));
  vec3 col = mix(cA,      uColor3, smoothstep(0.55, 1.0,  band));

  // Mask — fade out toward the bottom + edges.
  float vMask = smoothstep(0.0, 0.5, uv.y);
  float edge  = smoothstep(0.0, 0.15, uv.x) * smoothstep(0.0, 0.15, 1.0 - uv.x);
  col *= band * vMask * edge * uIntensity;

  // Soft top glow — push extra brightness toward the upper region.
  col += pow(uv.y, 3.0) * uColor3 * 0.12;

  gl_FragColor = vec4(col, 1.0);
}
`

export function Aurora({
  colors = ['#34D399', '#22D3EE', '#A78BFA'],
  speed = 0.6,
  scale = 1,
  intensity = 1,
  className,
}: AuroraProps) {
  const mountRef = React.useRef<HTMLDivElement>(null)
  const reduced = usePrefersReducedMotion()
  const active = useOnScreen(mountRef)
  // Refs let the offscreen gate start/stop the loop without re-running
  // the setup effect (which would rebuild the GL context).
  const activeRef = React.useRef(active)
  const loopRef = React.useRef<{ start: () => void; stop: () => void } | null>(null)

  React.useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    const renderer = new Renderer({
      dpr: Math.min(window.devicePixelRatio, 2),
      alpha: false,
    })
    const gl = renderer.gl
    gl.clearColor(0.02, 0.02, 0.04, 1)
    mount.appendChild(gl.canvas)
    gl.canvas.style.width = '100%'
    gl.canvas.style.height = '100%'
    gl.canvas.style.display = 'block'

    const c1 = new Color(colors[0])
    const c2 = new Color(colors[1])
    const c3 = new Color(colors[2])

    const geometry = new Triangle(gl)
    const program = new Program(gl, {
      vertex: VERT,
      fragment: FRAG,
      uniforms: {
        uTime: { value: 0 },
        uResolution: { value: [mount.clientWidth, mount.clientHeight] },
        uColor1: { value: [c1.r, c1.g, c1.b] },
        uColor2: { value: [c2.r, c2.g, c2.b] },
        uColor3: { value: [c3.r, c3.g, c3.b] },
        uSpeed: { value: speed },
        uScale: { value: scale },
        uIntensity: { value: intensity },
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
    let running = false
    const start = performance.now()
    const animate = (time: number) => {
      program.uniforms.uTime.value = (time - start) / 1000
      renderer.render({ scene: mesh })
      raf = requestAnimationFrame(animate)
    }
    loopRef.current = {
      start: () => {
        if (running || reduced) return
        running = true
        raf = requestAnimationFrame(animate)
      },
      stop: () => {
        running = false
        cancelAnimationFrame(raf)
      },
    }
    if (reduced) {
      // Reduced motion: draw a single static frame, skip the RAF loop.
      renderer.render({ scene: mesh })
    } else if (activeRef.current) {
      loopRef.current.start()
    }

    return () => {
      loopRef.current = null
      cancelAnimationFrame(raf)
      ro.disconnect()
      if (gl.canvas.parentElement === mount) mount.removeChild(gl.canvas)
      const ext = gl.getExtension('WEBGL_lose_context')
      ext?.loseContext()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [colors[0], colors[1], colors[2], speed, scale, intensity, reduced])

  // Pause the RAF while scrolled offscreen or the tab is hidden — the GL
  // context and last rendered frame stay intact; resume when visible.
  React.useEffect(() => {
    activeRef.current = active
    if (active) loopRef.current?.start()
    else loopRef.current?.stop()
  }, [active])

  return (
    <div
      ref={mountRef}
      className={cn('relative h-full w-full overflow-hidden', className)}
    />
  )
}
