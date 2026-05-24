'use client'

/**
 * <CodeWindow />  —  Apple Design System polish
 *
 * Static syntax-highlighted code inside an Apple-styled window frame.
 * Different from CodeEditor (which is interactive Monaco) — this is a
 * read-only "screenshot in a window" for landing pages, docs, and
 * marketing content. Vibrancy traffic lights, generous 20px corner
 * radius, multi-layer shadow, glassy chrome with backdrop-blur,
 * pill copy button with 0.96 press feedback. Highlighting is a
 * lightweight hand-rolled tokeniser for common JS/TS/TSX/CSS/JSON
 * idioms — no Shiki, no Prism, no build-step dependency.
 *
 * Highlight specific line ranges with the `highlight` prop to draw a
 * Stripe-style ambient accent across selected rows.
 */

import * as React from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Check, Copy } from 'lucide-react'
import { cn } from '@/lib/utils'

export type CodeLanguage = 'tsx' | 'ts' | 'jsx' | 'js' | 'css' | 'json' | 'bash' | 'text'

export interface CodeWindowProps {
  /** The code body (string). */
  code: string
  /** Language for syntax highlighting. Default 'tsx'. */
  language?: CodeLanguage
  /** Filename shown in the chrome header. */
  filename?: string
  /** Show the copy button. Default true. */
  showCopy?: boolean
  /** Show line numbers. Default true. */
  showLineNumbers?: boolean
  /** Highlight specific line ranges (e.g. [[3, 5], 8] — both single + range). */
  highlight?: (number | [number, number])[]
  /** Accent for highlighted lines. Default '#5E5CE6' (SF indigo). */
  highlightAccent?: string
  /** Hide the mac chrome (just code in a card). Default false. */
  bare?: boolean
  className?: string
}

// Apple-style spring
const APPLE_SPRING = { type: 'spring' as const, stiffness: 420, damping: 32, mass: 0.6 }

// ---------------------------------------------------------------------------
// Tokeniser — small, fast, good enough for marketing snippets.
// ---------------------------------------------------------------------------

type TokenKind =
  | 'comment'
  | 'string'
  | 'number'
  | 'keyword'
  | 'builtin'
  | 'tag'
  | 'attr'
  | 'punct'
  | 'text'

// Xcode Dark inspired palette — tuned for SF Mono on dark
const COLORS: Record<TokenKind, string> = {
  comment: 'text-zinc-500',
  string: 'text-[#FF8170]',       // SF red-orange
  number: 'text-[#D9C97E]',       // muted yellow
  keyword: 'text-[#FC5FA3]',      // SF pink
  builtin: 'text-[#5DD8FF]',      // SF cyan
  tag: 'text-[#67B7A4]',          // SF teal
  attr: 'text-[#41A1C0]',         // SF blue-cyan
  punct: 'text-white/45',
  text: 'text-[#E5E5EA]',
}

const JS_KEYWORDS = new Set([
  'const', 'let', 'var', 'function', 'return', 'if', 'else', 'for', 'while',
  'do', 'switch', 'case', 'break', 'continue', 'class', 'extends', 'super',
  'this', 'new', 'try', 'catch', 'finally', 'throw', 'await', 'async',
  'import', 'from', 'export', 'default', 'as', 'in', 'of', 'typeof',
  'instanceof', 'void', 'delete', 'true', 'false', 'null', 'undefined',
  'interface', 'type', 'enum', 'readonly', 'public', 'private', 'protected',
])

const JS_BUILTINS = new Set([
  'console', 'window', 'document', 'Math', 'JSON', 'Array', 'Object', 'String',
  'Number', 'Boolean', 'Promise', 'Set', 'Map', 'Date', 'Error', 'RegExp',
  'React', 'useState', 'useEffect', 'useRef', 'useMemo', 'useCallback',
  'useContext', 'useReducer', 'fetch', 'setTimeout', 'setInterval',
])

interface Token {
  kind: TokenKind
  value: string
}

function tokenizeJsLine(line: string): Token[] {
  const out: Token[] = []
  let i = 0
  const n = line.length

  while (i < n) {
    const ch = line[i]
    const rest = line.slice(i)

    // Comments
    if (ch === '/' && line[i + 1] === '/') {
      out.push({ kind: 'comment', value: line.slice(i) })
      return out
    }

    // Strings — single/double/backtick
    if (ch === '"' || ch === "'" || ch === '`') {
      const q = ch
      let j = i + 1
      while (j < n) {
        if (line[j] === '\\') {
          j += 2
          continue
        }
        if (line[j] === q) {
          j++
          break
        }
        j++
      }
      out.push({ kind: 'string', value: line.slice(i, j) })
      i = j
      continue
    }

    // Numbers
    if (/[0-9]/.test(ch)) {
      const m = rest.match(/^[0-9][0-9_.]*/)
      if (m) {
        out.push({ kind: 'number', value: m[0] })
        i += m[0].length
        continue
      }
    }

    // Identifiers / keywords
    if (/[A-Za-z_$]/.test(ch)) {
      const m = rest.match(/^[A-Za-z_$][A-Za-z0-9_$]*/)
      if (m) {
        const word = m[0]
        if (JS_KEYWORDS.has(word)) out.push({ kind: 'keyword', value: word })
        else if (JS_BUILTINS.has(word)) out.push({ kind: 'builtin', value: word })
        else if (word[0] >= 'A' && word[0] <= 'Z')
          out.push({ kind: 'tag', value: word })
        else out.push({ kind: 'text', value: word })
        i += word.length
        continue
      }
    }

    // JSX-ish opening tag
    if (ch === '<' && /[A-Za-z]/.test(line[i + 1] ?? '')) {
      out.push({ kind: 'punct', value: '<' })
      i++
      continue
    }

    // Punctuation
    if (/[{}()\[\];,.<>=+\-*/?!&|^%~:]/.test(ch)) {
      out.push({ kind: 'punct', value: ch })
      i++
      continue
    }

    // Whitespace + everything else
    out.push({ kind: 'text', value: ch })
    i++
  }
  return out
}

function tokenizeCssLine(line: string): Token[] {
  if (line.trim().startsWith('/*') || line.trim().startsWith('//')) {
    return [{ kind: 'comment', value: line }]
  }
  const out: Token[] = []
  const re = /([\w-]+)\s*:|([\w-]+)|([{}:;,()])|("[^"]*"|'[^']*')|(\d+(?:\.\d+)?(?:px|rem|em|%|s|ms|deg|vh|vw)?)|(#[\dA-Fa-f]+)/g
  let lastIdx = 0
  let m: RegExpExecArray | null
  while ((m = re.exec(line)) !== null) {
    if (m.index > lastIdx) out.push({ kind: 'text', value: line.slice(lastIdx, m.index) })
    if (m[1]) out.push({ kind: 'attr', value: m[1] }), out.push({ kind: 'punct', value: ':' })
    else if (m[2]) out.push({ kind: 'text', value: m[2] })
    else if (m[3]) out.push({ kind: 'punct', value: m[3] })
    else if (m[4]) out.push({ kind: 'string', value: m[4] })
    else if (m[5]) out.push({ kind: 'number', value: m[5] })
    else if (m[6]) out.push({ kind: 'number', value: m[6] })
    lastIdx = re.lastIndex
  }
  if (lastIdx < line.length) out.push({ kind: 'text', value: line.slice(lastIdx) })
  return out
}

function tokenizeJsonLine(line: string): Token[] {
  const out: Token[] = []
  const re = /("(?:\\.|[^"\\])*")(\s*:)?|(-?\d+(?:\.\d+)?)|(true|false|null)|([{}\[\],])/g
  let lastIdx = 0
  let m: RegExpExecArray | null
  while ((m = re.exec(line)) !== null) {
    if (m.index > lastIdx) out.push({ kind: 'text', value: line.slice(lastIdx, m.index) })
    if (m[1]) {
      out.push({ kind: m[2] ? 'attr' : 'string', value: m[1] })
      if (m[2]) out.push({ kind: 'punct', value: m[2] })
    } else if (m[3]) out.push({ kind: 'number', value: m[3] })
    else if (m[4]) out.push({ kind: 'keyword', value: m[4] })
    else if (m[5]) out.push({ kind: 'punct', value: m[5] })
    lastIdx = re.lastIndex
  }
  if (lastIdx < line.length) out.push({ kind: 'text', value: line.slice(lastIdx) })
  return out
}

function tokenizeBashLine(line: string): Token[] {
  if (line.startsWith('#')) return [{ kind: 'comment', value: line }]
  const out: Token[] = []
  const promptMatch = line.match(/^[$#]\s/)
  if (promptMatch) {
    out.push({ kind: 'punct', value: promptMatch[0] })
    line = line.slice(promptMatch[0].length)
  }
  const parts = line.split(/(\s+)/)
  for (const p of parts) {
    if (/^['"]/.test(p)) out.push({ kind: 'string', value: p })
    else if (/^-{1,2}/.test(p)) out.push({ kind: 'attr', value: p })
    else if (out.length === (promptMatch ? 1 : 0) && /\S/.test(p))
      out.push({ kind: 'keyword', value: p })
    else out.push({ kind: 'text', value: p })
  }
  return out
}

function tokenizeLine(line: string, lang: CodeLanguage): Token[] {
  switch (lang) {
    case 'tsx':
    case 'ts':
    case 'jsx':
    case 'js':
      return tokenizeJsLine(line)
    case 'css':
      return tokenizeCssLine(line)
    case 'json':
      return tokenizeJsonLine(line)
    case 'bash':
      return tokenizeBashLine(line)
    default:
      return [{ kind: 'text', value: line }]
  }
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

function isHighlighted(
  lineNum: number,
  highlight: CodeWindowProps['highlight'],
) {
  if (!highlight) return false
  for (const h of highlight) {
    if (typeof h === 'number') {
      if (h === lineNum) return true
    } else if (lineNum >= h[0] && lineNum <= h[1]) return true
  }
  return false
}

export function CodeWindow({
  code,
  language = 'tsx',
  filename,
  showCopy = true,
  showLineNumbers = true,
  highlight,
  highlightAccent = '#5E5CE6',
  bare = false,
  className,
}: CodeWindowProps) {
  const [copied, setCopied] = React.useState(false)
  const [trafficHover, setTrafficHover] = React.useState(false)
  const lines = code.split('\n')

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 1100)
    } catch {
      /* clipboard blocked */
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.985 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={APPLE_SPRING}
      className={cn(
        'relative isolate overflow-hidden rounded-[20px] border border-white/[0.08]',
        // Layered vibrancy background
        'bg-[linear-gradient(180deg,rgba(28,28,30,0.97)_0%,rgba(18,18,20,0.99)_100%)]',
        className,
      )}
      style={{
        // Apple multi-layer shadow: hairline + close drop + ambient diffusion
        boxShadow: `
          0 1px 0 rgba(255,255,255,0.06) inset,
          0 0 0 0.5px rgba(255,255,255,0.05),
          0 10px 28px -10px rgba(0,0,0,0.55),
          0 28px 64px -18px rgba(0,0,0,0.45)
        `,
      }}
    >
      {/* Chrome — macOS Big Sur / Sequoia style */}
      {!bare && (
        <header
          className="flex items-center gap-3 border-b border-white/[0.06] px-3.5 py-2.5 backdrop-blur-xl"
          style={{
            background:
              'linear-gradient(180deg, rgba(46,46,50,0.5) 0%, rgba(32,32,36,0.5) 100%)',
          }}
        >
          {/* Traffic lights with vibrancy + hover glyphs */}
          <div
            className="flex shrink-0 items-center gap-2"
            onMouseEnter={() => setTrafficHover(true)}
            onMouseLeave={() => setTrafficHover(false)}
          >
            {[
              { bg: '#FF5F57', ring: '#E0443E', glyph: '×' },
              { bg: '#FEBC2E', ring: '#DEA123', glyph: '−' },
              { bg: '#28C840', ring: '#1AAB29', glyph: '+' },
            ].map((l, i) => (
              <span
                key={i}
                className="relative inline-flex h-3 w-3 items-center justify-center rounded-full"
                style={{
                  background: `radial-gradient(circle at 30% 30%, ${l.bg} 0%, ${l.ring} 100%)`,
                  boxShadow: `0 0 0 0.5px ${l.ring}, 0 1px 1px rgba(0,0,0,0.3)`,
                }}
              >
                {trafficHover && (
                  <span className="text-[8px] font-bold leading-none text-black/55">
                    {l.glyph}
                  </span>
                )}
              </span>
            ))}
          </div>
          {filename && (
            <code className="min-w-0 flex-1 truncate text-center font-mono text-[11.5px] font-medium tracking-tight text-white/55">
              {filename}
            </code>
          )}
          <div className="flex shrink-0 items-center gap-2">
            <span className="hidden rounded-md border border-white/[0.08] bg-white/[0.04] px-2 py-0.5 font-mono text-[9.5px] font-medium uppercase tracking-[0.12em] text-white/55 sm:inline">
              {language}
            </span>
            {showCopy && (
              <motion.button
                type="button"
                onClick={onCopy}
                whileTap={{ scale: 0.92 }}
                transition={APPLE_SPRING}
                aria-label="Copy code"
                className="inline-flex h-6 w-6 items-center justify-center rounded-md border border-white/[0.06] bg-white/[0.04] text-white/55 backdrop-blur transition-colors hover:bg-white/[0.08] hover:text-white"
              >
                <AnimatePresence mode="wait" initial={false}>
                  {copied ? (
                    <motion.span
                      key="check"
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.5, opacity: 0 }}
                      transition={APPLE_SPRING}
                      className="text-[#30D158]"
                    >
                      <Check className="h-3.5 w-3.5" strokeWidth={2.75} />
                    </motion.span>
                  ) : (
                    <motion.span
                      key="copy"
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.5, opacity: 0 }}
                      transition={APPLE_SPRING}
                    >
                      <Copy className="h-3.5 w-3.5" strokeWidth={2} />
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            )}
          </div>
        </header>
      )}

      {/* Body */}
      <div className="overflow-x-auto">
        <pre className="m-0 py-2 font-mono text-[12.5px] leading-[1.65]">
          {lines.map((line, i) => {
            const lineNum = i + 1
            const hit = isHighlighted(lineNum, highlight)
            const tokens = tokenizeLine(line, language)
            return (
              <div
                key={i}
                className="flex"
                style={
                  hit
                    ? {
                        background: `linear-gradient(90deg, ${highlightAccent}26 0%, ${highlightAccent}0c 60%, transparent 100%)`,
                        boxShadow: `inset 2px 0 0 ${highlightAccent}`,
                      }
                    : undefined
                }
              >
                {showLineNumbers && (
                  <span
                    aria-hidden
                    className={cn(
                      'sticky left-0 inline-block w-11 shrink-0 select-none px-2.5 text-right font-mono text-[11px] tabular-nums',
                      hit ? 'text-white/55' : 'text-white/25',
                    )}
                  >
                    {lineNum}
                  </span>
                )}
                <code className="block flex-1 whitespace-pre px-3 py-px">
                  {tokens.length === 0 ? (
                    <span> </span>
                  ) : (
                    tokens.map((t, j) => (
                      <span key={j} className={COLORS[t.kind]}>
                        {t.value}
                      </span>
                    ))
                  )}
                </code>
              </div>
            )
          })}
        </pre>
      </div>
    </motion.div>
  )
}
