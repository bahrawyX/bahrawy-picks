'use client'

import { useEffect } from 'react'
import { polyfillCountryFlagEmojis } from 'country-flag-emoji-polyfill'

export function FlagEmojiPolyfill() {
  useEffect(() => {
    polyfillCountryFlagEmojis()
  }, [])
  return null
}
