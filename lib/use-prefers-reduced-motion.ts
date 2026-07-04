'use client'

/**
 * usePrefersReducedMotion()
 *
 * Reactive `prefers-reduced-motion: reduce` media query. SSR-safe:
 * returns false on the server and during hydration, then tracks the
 * live media query — flipping the OS setting updates components
 * without a reload.
 *
 * Convention for library components: when this returns true, render
 * the animation's END state statically (not a frozen intermediate
 * frame), stop RAF loops, and drop `animate-*` / keyframe classes.
 * CSS-only components should pair this with an
 * `@media (prefers-reduced-motion: reduce)` block instead.
 */

import * as React from 'react'

const QUERY = '(prefers-reduced-motion: reduce)'

function subscribe(callback: () => void) {
  const mql = window.matchMedia(QUERY)
  mql.addEventListener('change', callback)
  return () => mql.removeEventListener('change', callback)
}

function getSnapshot() {
  return window.matchMedia(QUERY).matches
}

function getServerSnapshot() {
  return false
}

export function usePrefersReducedMotion(): boolean {
  return React.useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}
