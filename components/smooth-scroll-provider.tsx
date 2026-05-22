'use client'

/**
 * <SmoothScrollProvider />
 *
 * Wraps the entire app in Lenis-driven smooth scrolling. Configured to:
 *
 *  - Use a soft, natural easing curve (the Lenis defaults feel close to
 *    Apple's native trackpad inertia).
 *  - Tick GSAP's ScrollTrigger every animation frame so any scrubbed
 *    timeline stays perfectly in sync with the smoothed scroll position.
 *  - Bail out entirely when `prefers-reduced-motion: reduce` is on — we
 *    keep native scroll instead of forcing a smoothing curve nobody
 *    asked for.
 *  - Disable itself for touch devices (Lenis recommends letting iOS /
 *    Android do their own scroll physics for momentum + rubber-banding).
 */

import * as React from 'react'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

export function SmoothScrollProvider({
  children,
}: {
  children: React.ReactNode
}) {
  React.useEffect(() => {
    if (typeof window === 'undefined') return

    // Respect user preference.
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
      return
    }

    const lenis = new Lenis({
      // Smoother / softer curve than the default 0.1 — feels like a
      // light deceleration after the wheel stops.
      lerp: 0.085,
      // Wheel + keyboard + touchpad use the smoothing; raw touch is
      // disabled below.
      smoothWheel: true,
      // Apple-like touchpad inertia uses a slightly stronger pull at
      // the start, fading out fast — easeOutExpo gets close.
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      // Don't fight iOS / Android native scroll.
      syncTouch: false,
    })

    // Hand off the RAF loop to GSAP so we only have ONE animation
    // pump for the whole page — Lenis ticks, ScrollTrigger reads, and
    // any scrubbed timelines update in the same frame.
    const onTick = (time: number) => {
      // GSAP delivers time in seconds; Lenis wants milliseconds.
      lenis.raf(time * 1000)
    }
    gsap.ticker.add(onTick)
    gsap.ticker.lagSmoothing(0)

    // Tell ScrollTrigger that scroll position is being driven by Lenis,
    // not the native scrollbar. This keeps pinned sections snapping
    // correctly under smooth scroll.
    lenis.on('scroll', ScrollTrigger.update)

    return () => {
      gsap.ticker.remove(onTick)
      lenis.destroy()
    }
  }, [])

  return <>{children}</>
}
