'use client'

import { useCallback, useSyncExternalStore } from 'react'

const STORAGE_KEY = 'bahrawy:favorites'
const EMPTY: readonly string[] = Object.freeze([])

// Module-level cache so all subscribers share one reference and React's
// useSyncExternalStore comparison is stable between renders.
let cache: readonly string[] | null = null
const listeners = new Set<() => void>()

function readFromStorage(): readonly string[] {
  if (typeof window === 'undefined') return EMPTY
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return EMPTY
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? Object.freeze(parsed.filter((s): s is string => typeof s === 'string')) : EMPTY
  } catch {
    return EMPTY
  }
}

function getSnapshot(): readonly string[] {
  if (cache === null) cache = readFromStorage()
  return cache
}

function getServerSnapshot(): readonly string[] {
  return EMPTY
}

function notify() {
  cache = readFromStorage()
  listeners.forEach((l) => l())
}

function subscribe(cb: () => void) {
  listeners.add(cb)
  return () => {
    listeners.delete(cb)
  }
}

// Cross-tab sync: when storage changes in another tab, refresh + notify.
if (typeof window !== 'undefined') {
  window.addEventListener('storage', (e) => {
    if (e.key === STORAGE_KEY) notify()
  })
}

export function useFavorites() {
  const favorites = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  )

  const toggle = useCallback((slug: string) => {
    const current = getSnapshot()
    const next = current.includes(slug)
      ? current.filter((s) => s !== slug)
      : [...current, slug]
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    } catch {
      // localStorage unavailable (private mode / quota) — soft-fail
    }
    notify()
  }, [])

  const isFavorited = useCallback(
    (slug: string) => favorites.includes(slug),
    [favorites]
  )

  return { favorites, toggle, isFavorited }
}
