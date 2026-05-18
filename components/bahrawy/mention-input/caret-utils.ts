/**
 * Get the pixel coordinates of the text caret in a contentEditable element.
 */
export function getCaretCoordinates(): { top: number; left: number; height: number } | null {
  const sel = window.getSelection()
  if (!sel || sel.rangeCount === 0) return null

  const range = sel.getRangeAt(0).cloneRange()
  range.collapse(true)

  // Try using a temporary span
  const span = document.createElement('span')
  span.textContent = '​' // zero-width space
  range.insertNode(span)

  const rect = span.getBoundingClientRect()
  const result = {
    top: rect.top,
    left: rect.left,
    height: rect.height || 18,
  }

  // Clean up
  const parent = span.parentNode
  if (parent) {
    parent.removeChild(span)
    parent.normalize()
  }

  // Restore selection
  sel.removeAllRanges()
  sel.addRange(range)

  return result
}

/**
 * Get the word being typed at the current cursor position.
 * Returns the word and its start index within the text node.
 */
export function getCurrentWord(trigger: string): {
  word: string
  startOffset: number
  node: Node
} | null {
  const sel = window.getSelection()
  if (!sel || sel.rangeCount === 0) return null

  const range = sel.getRangeAt(0)
  const node = range.startContainer
  if (node.nodeType !== Node.TEXT_NODE) return null

  const text = node.textContent ?? ''
  const cursorPos = range.startOffset

  // Walk backwards from cursor to find the trigger
  let start = cursorPos - 1
  while (start >= 0) {
    if (text[start] === trigger) {
      // Check if trigger is at start or preceded by space
      if (start === 0 || text[start - 1] === ' ' || text[start - 1] === ' ') {
        const word = text.slice(start + 1, cursorPos)
        // Don't match if there's a space in the query
        if (!word.includes(' ')) {
          return { word, startOffset: start, node }
        }
      }
      return null
    }
    if (text[start] === ' ' || text[start] === ' ') {
      return null
    }
    start--
  }
  return null
}

/**
 * Replace text range with a mention element in a contentEditable.
 */
export function insertMention(
  node: Node,
  startOffset: number,
  endOffset: number,
  displayName: string,
  mentionId: string,
): void {
  const sel = window.getSelection()
  if (!sel) return

  const range = document.createRange()
  range.setStart(node, startOffset)
  range.setEnd(node, endOffset)
  range.deleteContents()

  // Create mention chip
  const chip = document.createElement('span')
  chip.className = 'mention-chip'
  chip.contentEditable = 'false'
  chip.dataset.mentionId = mentionId
  chip.dataset.mentionName = displayName
  chip.textContent = `@${displayName}`

  // Insert chip + space after
  const space = document.createTextNode(' ')
  range.insertNode(space)
  range.insertNode(chip)

  // Move cursor after space
  const newRange = document.createRange()
  newRange.setStartAfter(space)
  newRange.collapse(true)
  sel.removeAllRanges()
  sel.addRange(newRange)
}

/**
 * Extract all mentions from the contentEditable element.
 */
export interface MentionData {
  id: string
  name: string
  trigger: string
}

export function extractMentions(container: HTMLElement): MentionData[] {
  const mentions: MentionData[] = []
  const chips = container.querySelectorAll('.mention-chip')
  chips.forEach((chip) => {
    const id = (chip as HTMLElement).dataset.mentionId
    const name = (chip as HTMLElement).dataset.mentionName
    if (id && name) {
      mentions.push({ id, name, trigger: '@' })
    }
  })
  return mentions
}

/**
 * Get plain text content with mention placeholders.
 */
export function getTextWithMentions(container: HTMLElement): string {
  let text = ''
  container.childNodes.forEach((node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      text += node.textContent ?? ''
    } else if (node instanceof HTMLElement && node.classList.contains('mention-chip')) {
      const id = node.dataset.mentionId
      text += `@[${node.dataset.mentionName}](${id})`
    } else if (node instanceof HTMLElement) {
      text += node.textContent ?? ''
    }
  })
  return text
}
