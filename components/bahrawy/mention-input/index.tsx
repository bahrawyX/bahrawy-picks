'use client'

import {
  type KeyboardEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import {
  getCaretCoordinates,
  getCurrentWord,
  insertMention,
  extractMentions,
  getTextWithMentions,
  type MentionData,
} from './caret-utils'
import { MentionDropdown } from './mention-dropdown'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface MentionSuggestion {
  id: string
  name: string
  avatar?: string
  description?: string
}

export interface MentionInputProps {
  value?: string
  onChange?: (text: string, mentions: MentionData[]) => void
  trigger?: string
  suggestions?: MentionSuggestion[]
  onSearch?: (query: string) => void | Promise<void>
  loading?: boolean
  placeholder?: string
  disabled?: boolean
  maxLength?: number
  multiline?: boolean
  error?: string
  className?: string
}

// ---------------------------------------------------------------------------
// Styles injected as CSS
// ---------------------------------------------------------------------------

const MENTION_STYLES = `
.mention-chip {
  display: inline-flex;
  align-items: center;
  padding: 1px 6px;
  margin: 0 1px;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.08);
  color: rgba(255, 255, 255, 0.9);
  font-weight: 500;
  font-size: 0.875em;
  user-select: all;
  cursor: default;
  vertical-align: baseline;
}
.mention-chip:hover {
  background: rgba(255, 255, 255, 0.12);
}
`

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function MentionInput({
  value,
  onChange,
  trigger = '@',
  suggestions: externalSuggestions,
  onSearch,
  loading = false,
  placeholder = 'Type @ to mention someone...',
  disabled = false,
  maxLength,
  multiline = false,
  error,
  className,
}: MentionInputProps) {
  const editorRef = useRef<HTMLDivElement>(null)
  const [showDropdown, setShowDropdown] = useState(false)
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0 })
  const [query, setQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [focused, setFocused] = useState(false)
  const lastEmittedRef = useRef('')
  const composingRef = useRef(false)

  // Controlled value: write external changes into the editor, but never
  // clobber what the user just typed (tracked via lastEmittedRef —
  // rewriting contentEditable content resets the caret).
  useEffect(() => {
    const editor = editorRef.current
    if (!editor || value === undefined) return
    if (value !== lastEmittedRef.current) {
      editor.textContent = value
      lastEmittedRef.current = value
    }
  }, [value])

  // Inject mention chip styles
  useEffect(() => {
    const id = 'mention-input-styles'
    if (document.getElementById(id)) return
    const style = document.createElement('style')
    style.id = id
    style.textContent = MENTION_STYLES
    document.head.appendChild(style)
    return () => {
      const el = document.getElementById(id)
      if (el) document.head.removeChild(el)
    }
  }, [])

  // Filter suggestions
  const suggestions = useMemo(() => {
    if (!externalSuggestions) return []
    if (!query) return externalSuggestions.slice(0, 8)
    const q = query.toLowerCase()
    return externalSuggestions
      .filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          (s.description && s.description.toLowerCase().includes(q)),
      )
      .slice(0, 8)
  }, [externalSuggestions, query])

  // ---- Input handling ----

  const handleInput = useCallback(() => {
    const editor = editorRef.current
    if (!editor) return

    // Check for trigger
    const wordInfo = getCurrentWord(trigger)
    if (wordInfo) {
      setQuery(wordInfo.word)
      setShowDropdown(true)
      setSelectedIndex(0)
      onSearch?.(wordInfo.word)

      // Position dropdown near caret
      const coords = getCaretCoordinates()
      if (coords) {
        setDropdownPos({
          top: coords.top + coords.height + 4,
          left: coords.left,
        })
      }
    } else {
      setShowDropdown(false)
      setQuery('')
    }

    // Notify onChange
    const text = getTextWithMentions(editor)
    const mentions = extractMentions(editor)
    lastEmittedRef.current = text
    onChange?.(text, mentions)
  }, [trigger, onChange, onSearch])

  // Enforce maxLength for typed insertions (deletions always pass).
  const handleBeforeInput = useCallback(
    (e: React.FormEvent<HTMLDivElement>) => {
      if (!maxLength || composingRef.current) return
      const editor = editorRef.current
      if (!editor) return
      const inserted = (e.nativeEvent as InputEvent).data?.length ?? 0
      if (inserted === 0) return
      const sel = window.getSelection()
      const replaced =
        sel && sel.rangeCount > 0 ? sel.getRangeAt(0).toString().length : 0
      const current = editor.textContent?.length ?? 0
      if (current - replaced + inserted > maxLength) e.preventDefault()
    },
    [maxLength],
  )

  // Paste as plain text (contentEditable takes raw HTML otherwise),
  // trimmed to whatever maxLength budget remains.
  const handlePaste = useCallback(
    (e: React.ClipboardEvent<HTMLDivElement>) => {
      e.preventDefault()
      const editor = editorRef.current
      if (!editor) return
      let text = e.clipboardData.getData('text/plain')
      if (maxLength) {
        const sel = window.getSelection()
        const replaced =
          sel && sel.rangeCount > 0 ? sel.getRangeAt(0).toString().length : 0
        const remaining =
          maxLength - ((editor.textContent?.length ?? 0) - replaced)
        text = text.slice(0, Math.max(0, remaining))
      }
      // execCommand keeps the caret in place and fires an input event,
      // so handleInput picks the change up from there.
      if (text) document.execCommand('insertText', false, text)
    },
    [maxLength],
  )

  const handleSelect = useCallback(
    (suggestion: MentionSuggestion) => {
      const wordInfo = getCurrentWord(trigger)
      if (!wordInfo) return

      const { node, startOffset } = wordInfo
      const sel = window.getSelection()
      const endOffset = sel?.getRangeAt(0).startOffset ?? startOffset + query.length + 1

      insertMention(node, startOffset, endOffset, suggestion.name, suggestion.id)
      setShowDropdown(false)
      setQuery('')

      // Notify onChange
      const editor = editorRef.current
      if (editor) {
        const text = getTextWithMentions(editor)
        const mentions = extractMentions(editor)
        onChange?.(text, mentions)
      }
    },
    [trigger, query, onChange],
  )

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLDivElement>) => {
      // Ignore keys while an IME composition session is active — Enter
      // there confirms the composition, not a mention selection.
      if (composingRef.current || e.nativeEvent.isComposing) return
      if (!showDropdown || suggestions.length === 0) {
        // Prevent Enter from creating new line in single-line mode
        if (e.key === 'Enter' && !multiline) {
          e.preventDefault()
        }
        return
      }

      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setSelectedIndex((i) => Math.min(i + 1, suggestions.length - 1))
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setSelectedIndex((i) => Math.max(i - 1, 0))
      } else if (e.key === 'Enter' || e.key === 'Tab') {
        e.preventDefault()
        handleSelect(suggestions[selectedIndex])
      } else if (e.key === 'Escape') {
        e.preventDefault()
        setShowDropdown(false)
      }
    },
    [showDropdown, suggestions, selectedIndex, handleSelect, multiline],
  )

  // Close dropdown on blur
  useEffect(() => {
    if (!focused) {
      const t = setTimeout(() => setShowDropdown(false), 150)
      return () => clearTimeout(t)
    }
  }, [focused])

  return (
    <div className={cn('relative w-full', className)}>
      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable={!disabled}
        suppressContentEditableWarning
        onInput={handleInput}
        onBeforeInput={handleBeforeInput}
        onPaste={handlePaste}
        onKeyDown={handleKeyDown}
        onCompositionStart={() => {
          composingRef.current = true
        }}
        onCompositionEnd={() => {
          composingRef.current = false
          handleInput()
        }}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        role="textbox"
        aria-multiline={multiline}
        aria-placeholder={placeholder}
        data-placeholder={placeholder}
        className={cn(
          'relative min-h-[42px] w-full rounded-lg border bg-white/[0.03] px-3 py-2.5 text-sm text-white outline-none transition-colors',
          'empty:before:pointer-events-none empty:before:text-white/25 empty:before:content-[attr(data-placeholder)]',
          focused && !error ? 'border-white/30' : 'border-white/[0.08]',
          error && 'border-red-500/60',
          disabled && 'cursor-not-allowed opacity-50',
          multiline && 'min-h-[100px]',
        )}
      />

      {/* Dropdown */}
      <AnimatePresence>
        {showDropdown && (
          <MentionDropdown
            suggestions={suggestions}
            loading={loading}
            position={dropdownPos}
            selectedIndex={selectedIndex}
            onSelect={handleSelect}
          />
        )}
      </AnimatePresence>

      {/* Error */}
      {error && (
        <p className="mt-1.5 text-sm text-red-400">{error}</p>
      )}
    </div>
  )
}
