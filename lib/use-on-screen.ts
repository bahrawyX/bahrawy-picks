'use client'

/**
 * useOnScreen(ref, options)
 *
 * True while the element is intersecting the viewport AND the tab is
 * visible. The gate animation loops should check before burning
 * frames: a WebGL background three screens up, or in a backgrounded
 * tab, has no business running RAF.
 *
 * Usage inside an existing render-loop effect:
 *   const active = useOnScreen(canvasRef)
 *   React.useEffect(() => {
 *     if (!active) return        // effect re-runs when it flips back
 *     ...start RAF...
 *     return () => ...stop RAF...
 *   }, [active, ...])
 */

import * as React from 'react'

export interface OnScreenOptions {
  /** IntersectionObserver rootMargin — default '100px' so loops resume just before entering. */
  rootMargin?: string
  /** Also require document visibility (tab focus). Default true. */
  trackPageVisibility?: boolean
}

export function useOnScreen(
  ref: React.RefObject<Element | null>,
  { rootMargin = '100px', trackPageVisibility = true }: OnScreenOptions = {},
): boolean {
  const [intersecting, setIntersecting] = React.useState(true)
  const [pageVisible, setPageVisible] = React.useState(true)

  React.useEffect(() => {
    const el = ref.current
    if (!el || typeof IntersectionObserver === 'undefined') return
    const observer = new IntersectionObserver(
      ([entry]) => setIntersecting(entry.isIntersecting),
      { rootMargin },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [ref, rootMargin])

  React.useEffect(() => {
    if (!trackPageVisibility) return
    const onChange = () => setPageVisible(document.visibilityState === 'visible')
    onChange()
    document.addEventListener('visibilitychange', onChange)
    return () => document.removeEventListener('visibilitychange', onChange)
  }, [trackPageVisibility])

  return intersecting && pageVisible
}
