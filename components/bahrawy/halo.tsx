'use client'

/**
 * <Halo />
 *
 * A cursor-reactive WebGL background built on a single OGL
 * fragment shader (no Three.js — same approach as <LineWaves />).
 *
 * The screen is filled with a dense grid of soft iridescent dots
 * that pulse on their own time. As the cursor moves over the
 * canvas:
 *
 *  - The UV coordinates are warped around the cursor with a
 *    Gaussian-falloff swirl, so the grid visibly bends + spirals
 *    where you point.
 *  - Cursor velocity adds a directional smear that drags the
 *    pattern behind the pointer.
 *  - A bright halo (additive accent glow) brightens the dots
 *    around the cursor.
 *
 * Mouse position is smoothed with a per-frame lerp so the effect
 * glides instead of snapping, and a slow ambient drift keeps the
 * field alive when the cursor is idle.
 */

import * as React from 'react'
import { Renderer, Program, Mesh, Triangle } from 'ogl'
import { cn } from '@/lib/utils'
import { usePrefersReducedMotion } from '@/lib/use-prefers-reduced-motion'
import { useOnScreen } from '@/lib/use-on-screen'

export interface HaloProps {
  /** Number of dots across the short axis. Default 28. */
  density?: number
  /** Dot radius relative to cell size (0..0.5). Default 0.12. */
  dotSize?: number
  /** Animation speed multiplier. Default 0.4. */
  speed?: number
  /** Strength of the cursor warp. Default 0.45. */
  mouseInfluence?: number
  /** Three iridescent colors mixed across the field. */
  color1?: string
  color2?: string
  color3?: string
  /** Overall brightness multiplier. Default 1.0. */
  brightness?: number
  /** Disable cursor interaction (still drifts). Default false. */
  paused?: boolean
  className?: string
}

const VERT = /* glsl */ `
attribute vec2 uv;
attribute vec2 position;
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 0.0, 1.0);
}
`

const FRAG = /* glsl */ `
precision highp float;

uniform float uTime;
uniform vec3  uResolution;     // x, y, x/y
uniform vec2  uMouse;          // 0..1 in screen space
uniform vec2  uMouseVel;       // velocity, normalised per second
uniform bool  uEnableMouse;
uniform float uMouseInfluence;
uniform float uDensity;
uniform float uDotSize;
uniform float uSpeed;
uniform float uBrightness;
uniform vec3  uColor1;
uniform vec3  uColor2;
uniform vec3  uColor3;

float hash11(float n) {
  return fract(sin(n * 127.1) * 43758.5453123);
}
float hash12(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

void main() {
  vec2 uv = gl_FragCoord.xy / uResolution.xy;
  float aspect = uResolution.x / max(uResolution.y, 1.0);

  // Work in aspect-corrected space so the dot grid stays square.
  vec2 p  = vec2(uv.x * aspect, uv.y);
  vec2 mp = vec2(uMouse.x * aspect, uMouse.y);

  float t = uTime * uSpeed;

  vec2 warped = p;

  if (uEnableMouse) {
    vec2 toC  = p - mp;
    float dst = length(toC);

    // Gaussian falloff — strong near the cursor, decays fast.
    float k    = exp(-dst * dst * 4.5);
    float bend = uMouseInfluence * k;

    // Pull pixels toward the cursor + add a tangential swirl so the
    // grid visibly *bends* (instead of just collapsing).
    vec2 dir = toC / max(dst, 1e-4);
    vec2 tan = vec2(-dir.y, dir.x);
    warped -= dir * bend * 0.18;
    warped += tan * bend * 0.10;

    // Velocity-driven smear behind the cursor.
    warped -= uMouseVel * exp(-dst * dst * 2.5) * 0.45;
  }

  // Slow ambient drift so the field is alive when the cursor is idle.
  warped.x += sin(t * 0.45 + warped.y * 3.7) * 0.012;
  warped.y += cos(t * 0.55 + warped.x * 4.1) * 0.012;

  // Dot grid.
  vec2 grid = warped * uDensity;
  vec2 gi   = floor(grid);
  vec2 gf   = fract(grid) - 0.5;
  float d   = length(gf);

  // Per-dot deterministic randomness.
  float r = hash12(gi);

  // Per-dot pulse on its own phase.
  float pulse = sin(t * 1.6 + r * 6.2832) * 0.35 + 0.65;

  // Soft circular dot mask.
  float mask = smoothstep(uDotSize * 1.5, uDotSize * 0.45, d) * pulse;

  // Iridescent color shift — phase varies by cell + cursor distance.
  vec2 toMouse = p - mp;
  float dMouse = length(toMouse);
  float phase  = t * 0.6 + r * 2.4 + dMouse * 1.2;
  vec3 a = uColor1 * (sin(phase)             * 0.5 + 0.5);
  vec3 b = uColor2 * (sin(phase + 2.0944)    * 0.5 + 0.5);
  vec3 c = uColor3 * (sin(phase + 4.1888)    * 0.5 + 0.5);
  vec3 col = (a + b + c) * 0.55;

  col *= mask;

  // Bright cursor halo (additive glow).
  if (uEnableMouse) {
    float halo = exp(-dMouse * dMouse * 3.2) * 0.85;
    col += uColor2 * halo * 0.55;
    col += uColor3 * halo * 0.35;
  }

  col *= uBrightness;

  // Edge fade so it doesn't crop hard against the container.
  float fade = smoothstep(0.0, 0.08, uv.x)
             * smoothstep(0.0, 0.08, 1.0 - uv.x)
             * smoothstep(0.0, 0.08, uv.y)
             * smoothstep(0.0, 0.08, 1.0 - uv.y);
  col *= fade;

  // Use luminance as alpha so the canvas blends nicely on any
  // background colour the consumer wants behind it.
  float a2 = clamp(length(col), 0.0, 1.0);
  gl_FragColor = vec4(col, a2);
}
`

function hexToVec3(hex: string): [number, number, number] {
  const h = hex.replace('#', '')
  return [
    parseInt(h.slice(0, 2), 16) / 255,
    parseInt(h.slice(2, 4), 16) / 255,
    parseInt(h.slice(4, 6), 16) / 255,
  ]
}

export function Halo({
  density = 28,
  dotSize = 0.12,
  speed = 0.4,
  mouseInfluence = 0.45,
  color1 = '#FF6FA8',
  color2 = '#5E5CE6',
  color3 = '#22D3EE',
  brightness = 1.0,
  paused = false,
  className,
}: HaloProps) {
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

    // Static when paused or the user prefers reduced motion — render a
    // single frame instead of running the RAF loop.
    const frozen = paused || reduced

    const renderer = new Renderer({
      dpr: Math.min(window.devicePixelRatio, 2),
      alpha: true,
      premultipliedAlpha: false,
    })
    const gl = renderer.gl
    gl.clearColor(0, 0, 0, 0)
    mount.appendChild(gl.canvas)
    gl.canvas.style.width = '100%'
    gl.canvas.style.height = '100%'
    gl.canvas.style.display = 'block'

    const geometry = new Triangle(gl)
    const program = new Program(gl, {
      vertex: VERT,
      fragment: FRAG,
      uniforms: {
        uTime: { value: 0 },
        uResolution: {
          value: [
            mount.clientWidth || 1,
            mount.clientHeight || 1,
            (mount.clientWidth || 1) / Math.max(mount.clientHeight || 1, 1),
          ],
        },
        uMouse: { value: new Float32Array([0.5, 0.5]) },
        uMouseVel: { value: new Float32Array([0, 0]) },
        uEnableMouse: { value: !paused },
        uMouseInfluence: { value: mouseInfluence },
        uDensity: { value: density },
        uDotSize: { value: dotSize },
        uSpeed: { value: speed },
        uBrightness: { value: brightness },
        uColor1: { value: hexToVec3(color1) },
        uColor2: { value: hexToVec3(color2) },
        uColor3: { value: hexToVec3(color3) },
      },
    })
    const mesh = new Mesh(gl, { geometry, program })

    // ---- cursor tracking ----
    const target = [0.5, 0.5]
    const current = [0.5, 0.5]
    const prev = [0.5, 0.5]
    let hovering = false

    const onMove = (e: PointerEvent) => {
      const rect = gl.canvas.getBoundingClientRect()
      target[0] = (e.clientX - rect.left) / rect.width
      target[1] = 1.0 - (e.clientY - rect.top) / rect.height
      hovering = true
    }
    const onEnter = () => {
      hovering = true
    }
    const onLeave = () => {
      hovering = false
      // ease the target back toward center when the pointer leaves
      target[0] = 0.5
      target[1] = 0.5
    }
    gl.canvas.addEventListener('pointermove', onMove, { passive: true })
    gl.canvas.addEventListener('pointerenter', onEnter)
    gl.canvas.addEventListener('pointerleave', onLeave)

    // ---- resize ----
    const resize = () => {
      const w = mount.clientWidth
      const h = mount.clientHeight
      if (w === 0 || h === 0) return
      renderer.setSize(w, h)
      program.uniforms.uResolution.value = [
        gl.canvas.width,
        gl.canvas.height,
        gl.canvas.width / Math.max(gl.canvas.height, 1),
      ]
      // Resizing clears the buffer — repaint the static frame.
      if (frozen) renderer.render({ scene: mesh })
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(mount)

    // ---- animation loop ----
    let raf = 0
    let running = false
    let last = performance.now()

    const animate = (time: number) => {
      const dt = Math.min(0.05, (time - last) / 1000)
      last = time
      program.uniforms.uTime.value = time * 0.001

      if (!paused) {
        // Ease mouse position toward target.
        const ease = 1 - Math.pow(0.001, dt) // frame-rate independent
        current[0] += (target[0] - current[0]) * ease * 0.6
        current[1] += (target[1] - current[1]) * ease * 0.6

        // Velocity from per-frame delta (clamped so flicks don't break).
        const inv = dt > 0 ? 1 / dt : 0
        const vx = (current[0] - prev[0]) * inv
        const vy = (current[1] - prev[1]) * inv
        program.uniforms.uMouseVel.value[0] +=
          (vx - program.uniforms.uMouseVel.value[0]) * 0.2
        program.uniforms.uMouseVel.value[1] +=
          (vy - program.uniforms.uMouseVel.value[1]) * 0.2
        prev[0] = current[0]
        prev[1] = current[1]

        program.uniforms.uMouse.value[0] = current[0]
        program.uniforms.uMouse.value[1] = current[1]

        // Soft fade of influence when not hovering.
        const targetInfluence = hovering ? mouseInfluence : mouseInfluence * 0.35
        program.uniforms.uMouseInfluence.value +=
          (targetInfluence - program.uniforms.uMouseInfluence.value) *
          Math.min(1, dt * 3)
      }

      renderer.render({ scene: mesh })
      raf = requestAnimationFrame(animate)
    }
    loopRef.current = {
      start: () => {
        if (running || frozen) return
        running = true
        last = performance.now()
        raf = requestAnimationFrame(animate)
      },
      stop: () => {
        running = false
        cancelAnimationFrame(raf)
      },
    }
    if (frozen) {
      renderer.render({ scene: mesh })
    } else if (activeRef.current) {
      loopRef.current.start()
    }

    return () => {
      loopRef.current = null
      cancelAnimationFrame(raf)
      ro.disconnect()
      gl.canvas.removeEventListener('pointermove', onMove)
      gl.canvas.removeEventListener('pointerenter', onEnter)
      gl.canvas.removeEventListener('pointerleave', onLeave)
      if (gl.canvas.parentElement === mount) {
        mount.removeChild(gl.canvas)
      }
      gl.getExtension('WEBGL_lose_context')?.loseContext()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    density,
    dotSize,
    speed,
    mouseInfluence,
    color1,
    color2,
    color3,
    brightness,
    paused,
    reduced,
  ])

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
