/**
 * Timestamp formatting utilities.
 * Pure JS — no date library dependencies.
 */

const MINUTE = 60
const HOUR = 3600
const DAY = 86400
const WEEK = 604800

/**
 * Returns a human-readable relative time string.
 * "just now", "2 minutes ago", "3 hours ago", "yesterday", "2 days ago", "last week"
 */
export function formatRelative(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  const now = Date.now()
  const diff = Math.floor((now - d.getTime()) / 1000)

  if (diff < 0) return 'just now'
  if (diff < 10) return 'just now'
  if (diff < MINUTE) return `${diff}s ago`
  if (diff < HOUR) {
    const mins = Math.floor(diff / MINUTE)
    return mins === 1 ? '1 minute ago' : `${mins} minutes ago`
  }
  if (diff < DAY) {
    const hrs = Math.floor(diff / HOUR)
    return hrs === 1 ? '1 hour ago' : `${hrs} hours ago`
  }
  if (diff < DAY * 2) return 'yesterday'
  if (diff < WEEK) {
    const days = Math.floor(diff / DAY)
    return `${days} days ago`
  }
  if (diff < WEEK * 2) return 'last week'

  const weeks = Math.floor(diff / WEEK)
  if (weeks < 5) return `${weeks} weeks ago`

  const months = Math.floor(diff / (DAY * 30))
  if (months < 12) return months === 1 ? '1 month ago' : `${months} months ago`

  const years = Math.floor(diff / (DAY * 365))
  return years === 1 ? '1 year ago' : `${years} years ago`
}

/**
 * Returns an absolute formatted date string.
 * "Jan 15, 2025 at 3:42 PM"
 */
export function formatAbsolute(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(d)
}

/**
 * Returns a date-only string for grouping: "Today", "Yesterday", "Jan 15, 2025"
 */
export function formatDateGroup(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const target = new Date(d.getFullYear(), d.getMonth(), d.getDate())
  const diff = today.getTime() - target.getTime()

  if (diff === 0) return 'Today'
  if (diff === DAY * 1000) return 'Yesterday'

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(d)
}
