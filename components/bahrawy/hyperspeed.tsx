'use client'

/**
 * <Hyperspeed />
 *
 * A fullscreen OGL fragment shader that simulates warp-speed star
 * streaks. Each pixel computes a polar ray out from a slowly drifting
 * focal point; along that ray we step through "layers" of seeded
 * stars and accumulate light proportional to inverse distance from
 * the ray axis. The result is the classic radial-blur star trail.
 *
 * Drop in as a full-bleed background — the canvas auto-resizes to its
 * parent.
 */

import * as React from 'react'
import { Renderer, Program, Mesh, Triangle, Color } from 'ogl'
import { cn } from '@/lib/utils'
import { usePrefersReducedMotion } from '@/lib/use-prefers-reduced-motion'

export interface HyperspeedProps {
  /** Forward speed. Default 1. */
  speed?: number
  /** Streak density. Default 1. */
  density?: number
  /** Tint applied to the streaks. Default '#A78BFA'. */
  color?: string
  /** Overall brightness multiplier. Default 1. */
  intensity?: number
  className?: string
}

const VERT = /* glsl */ `
attribute vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`

const FRAG = /* glsl */ `
precision highp float;

uniform float uTime;
uniform vec2  uResolution;
uniform float uSpeed;
uniform float uDensity;
uniform vec3  uColor;
uniform float uIntensity;

// 2D hash — cheap & cheerful.
float hash21(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

void main() {
  vec2 fragCoord = gl_FragCoord.xy;
  vec2 res = uResolution;
  // Center the coords + correct for aspect.
  vec2 uv = (fragCoord - 0.5 * res) / res.y;

  // Polar coords around the warp focal point.
  float r = length(uv);
  float a = atan(uv.y, uv.x);

  // March along the ray from far → near in layers.
  vec3 col = vec3(0.0);
  const int LAYERS = 14;
  for (int i = 0; i < LAYERS; i++) {
    float fi = float(i);
    // Each layer is at a different "depth"; ride forward as time passes.
    float depth = fract(fi / float(LAYERS) - uTime * uSpeed * 0.6);
    // Closer layers → smaller r before they're behind us.
    float layerR = r * depth;
    // Bin angles into "streaks". Density controls how many spokes.
    float spokes = 60.0 * uDensity;
    float aBin = floor(a * spokes + fi * 17.0);
    float seed = hash21(vec2(aBin, fi));
    // Star sits at a random radial offset along the layer.
    float starR = mix(0.02, 0.7, seed);
    // Distance from this pixel to the streak's "center".
    float d = abs(layerR - starR) + abs(fract(a * spokes + fi * 17.0) - 0.5) * 0.04;
    // Brightness falls off sharply with distance; closer (smaller depth)
    // layers contribute more.
    float bright = 0.0008 / (d + 0.001);
    bright *= smoothstep(0.0, 0.15, depth) * (1.0 - depth);
    // Streaks fade out toward the centre of the screen — that's the
    // "vanishing point" of the warp.
    bright *= smoothstep(0.0, 0.4, r);
    col += vec3(bright);
  }

  col *= uColor * uIntensity;
  // Subtle vignette + a faint center glow.
  col += pow(1.0 - r * 1.2, 4.0) * uColor * 0.15;

  gl_FragColor = vec4(col, 1.0);
}
`

export function Hyperspeed({
  speed = 1,
  density = 1,
  color = '#A78BFA',
  intensity = 1,
  className,
}: HyperspeedProps) {
  const mountRef = React.useRef<HTMLDivElement>(null)
  const reduced = usePrefersReducedMotion()

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

    const geometry = new Triangle(gl)
    const c = new Color(color)
    const program = new Program(gl, {
      vertex: VERT,
      fragment: FRAG,
      uniforms: {
        uTime: { value: 0 },
        uResolution: { value: [mount.clientWidth, mount.clientHeight] },
        uSpeed: { value: speed },
        uDensity: { value: density },
        uColor: { value: [c.r, c.g, c.b] },
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
    const start = performance.now()
    const animate = (time: number) => {
      program.uniforms.uTime.value = (time - start) / 1000
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
      // OGL: dispose by losing context
      const ext = gl.getExtension('WEBGL_lose_context')
      ext?.loseContext()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [speed, density, color, intensity, reduced])

  return (
    <div
      ref={mountRef}
      className={cn('relative h-full w-full overflow-hidden', className)}
    />
  )
}
