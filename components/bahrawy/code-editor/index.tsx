'use client'

import {
  useState,
  useRef,
  useCallback,
  useEffect,
  useMemo,
} from 'react'
import Editor, { type Monaco } from '@monaco-editor/react'
import { motion, AnimatePresence } from 'framer-motion'
import type { editor } from 'monaco-editor'
import { cn } from '@/lib/utils'
import {
  springGentle,
  springSnappy,
  tweenSmooth,
  fadeUp,
  scaleIn,
} from '@/lib/motion'
import { bahrawyDark, bahrawyLight } from '@/lib/monaco-theme'
import { Toolbar } from './toolbar'
import { StatusBar } from './status-bar'
import { OutputPanel } from './output-panel'
import { FileTabs, type EditorFile } from './file-tabs'
import { DiffEditorPanel } from './diff-editor'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type { EditorFile }

export interface CodeEditorProps {
  value?: string
  onChange?: (value: string) => void
  language?: string
  theme?: 'dark' | 'light'
  height?: number | string
  readOnly?: boolean
  showMinimap?: boolean
  showLineNumbers?: boolean
  wordWrap?: boolean
  fontSize?: number
  tabSize?: number
  files?: EditorFile[]
  onFilesChange?: (files: EditorFile[]) => void
  onRun?: (code: string) => void
  output?: string
  onOutputClear?: () => void
  diff?: { original: string; modified: string; language: string }
  diffMode?: 'split' | 'inline'
  className?: string
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function registerThemes(monaco: Monaco) {
  monaco.editor.defineTheme('bahrawyDark', bahrawyDark)
  monaco.editor.defineTheme('bahrawyLight', bahrawyLight)
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function CodeEditor({
  value: controlledValue,
  onChange,
  language: languageProp = 'typescript',
  theme: themeProp = 'dark',
  height = 400,
  readOnly = false,
  showMinimap = false,
  showLineNumbers = true,
  wordWrap = false,
  fontSize = 14,
  tabSize = 2,
  files: filesProp,
  onFilesChange,
  onRun,
  output: outputProp,
  onOutputClear,
  diff,
  diffMode = 'split',
  className,
}: CodeEditorProps) {
  // ---- State ----
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null)
  const [theme, setTheme] = useState(themeProp)
  const [language, setLanguage] = useState(languageProp)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isFormatting, setIsFormatting] = useState(false)
  const [cursorPosition, setCursorPosition] = useState({ line: 1, column: 1 })
  const [themeFlash, setThemeFlash] = useState(false)

  // Multi-file state
  const [activeFileIndex, setActiveFileIndex] = useState(0)
  const hasFiles = filesProp !== undefined && filesProp.length > 0

  // Derive the current value
  const currentValue = useMemo(() => {
    if (hasFiles && filesProp) {
      return filesProp[activeFileIndex]?.content ?? ''
    }
    return controlledValue ?? ''
  }, [hasFiles, filesProp, activeFileIndex, controlledValue])

  // Sync language from active file
  useEffect(() => {
    if (hasFiles && filesProp && filesProp[activeFileIndex]) {
      setLanguage(filesProp[activeFileIndex].language)
    }
  }, [hasFiles, filesProp, activeFileIndex])

  // Sync external theme prop
  useEffect(() => {
    setTheme(themeProp)
  }, [themeProp])

  // Sync external language prop (only when not in multi-file mode)
  useEffect(() => {
    if (!hasFiles) {
      setLanguage(languageProp)
    }
  }, [languageProp, hasFiles])

  // ---- Escape fullscreen ----
  useEffect(() => {
    if (!isFullscreen) return
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setIsFullscreen(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isFullscreen])

  // ---- Theme toggle with opacity flash ----
  const handleThemeToggle = useCallback(() => {
    setThemeFlash(true)
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))
    // Reset flash after the tween duration
    setTimeout(() => setThemeFlash(false), 300)
  }, [])

  // ---- Editor callbacks ----
  const handleBeforeMount = useCallback((monaco: Monaco) => {
    registerThemes(monaco)
  }, [])

  const handleMount = useCallback(
    (editorInstance: editor.IStandaloneCodeEditor) => {
      editorRef.current = editorInstance

      editorInstance.onDidChangeCursorPosition((e) => {
        setCursorPosition({
          line: e.position.lineNumber,
          column: e.position.column,
        })
      })
    },
    [],
  )

  const handleValueChange = useCallback(
    (newValue: string | undefined) => {
      const val = newValue ?? ''
      if (hasFiles && filesProp && onFilesChange) {
        const updatedFiles = filesProp.map((file, i) =>
          i === activeFileIndex ? { ...file, content: val } : file,
        )
        onFilesChange(updatedFiles)
      }
      onChange?.(val)
    },
    [hasFiles, filesProp, activeFileIndex, onFilesChange, onChange],
  )

  // ---- Format ----
  const handleFormat = useCallback(async () => {
    if (!editorRef.current) return
    setIsFormatting(true)
    try {
      await editorRef.current
        .getAction('editor.action.formatDocument')
        ?.run()
    } finally {
      setIsFormatting(false)
    }
  }, [])

  // ---- Fullscreen ----
  const handleFullscreen = useCallback(() => {
    setIsFullscreen((prev) => !prev)
  }, [])

  // ---- File tab actions ----
  const handleFileSelect = useCallback((index: number) => {
    setActiveFileIndex(index)
  }, [])

  const handleFileClose = useCallback(
    (index: number) => {
      if (!filesProp || !onFilesChange || filesProp.length <= 1) return
      const updated = filesProp.filter((_, i) => i !== index)
      onFilesChange(updated)
      if (activeFileIndex >= updated.length) {
        setActiveFileIndex(updated.length - 1)
      } else if (activeFileIndex > index) {
        setActiveFileIndex(activeFileIndex - 1)
      }
    },
    [filesProp, onFilesChange, activeFileIndex],
  )

  const handleFileAdd = useCallback(() => {
    if (!filesProp || !onFilesChange) return
    const newFile: EditorFile = {
      name: `untitled-${filesProp.length + 1}.ts`,
      language: 'typescript',
      content: '',
    }
    onFilesChange([...filesProp, newFile])
    setActiveFileIndex(filesProp.length)
  }, [filesProp, onFilesChange])

  // ---- Language change ----
  const handleLanguageChange = useCallback(
    (lang: string) => {
      setLanguage(lang)
      if (hasFiles && filesProp && onFilesChange) {
        const updated = filesProp.map((file, i) =>
          i === activeFileIndex ? { ...file, language: lang } : file,
        )
        onFilesChange(updated)
      }
    },
    [hasFiles, filesProp, activeFileIndex, onFilesChange],
  )

  // ---- Output ----
  const handleOutputClear = useCallback(() => {
    onOutputClear?.()
  }, [onOutputClear])

  // ---- Derived ----
  const isDark = theme === 'dark'
  const themeName = isDark ? 'bahrawyDark' : 'bahrawyLight'
  const isDiff = diff !== undefined

  // ---- Editor options ----
  const editorOptions: editor.IStandaloneEditorConstructionOptions = useMemo(
    () => ({
      readOnly,
      fontSize,
      tabSize,
      minimap: { enabled: showMinimap },
      lineNumbers: showLineNumbers ? 'on' as const : 'off' as const,
      wordWrap: wordWrap ? 'on' as const : 'off' as const,
      scrollBeyondLastLine: false,
      renderOverviewRuler: false,
      padding: { top: 12, bottom: 12 },
      scrollbar: {
        verticalScrollbarSize: 8,
        horizontalScrollbarSize: 8,
      },
      bracketPairColorization: { enabled: true },
      cursorBlinking: 'smooth' as const,
      cursorSmoothCaretAnimation: 'on' as const,
      smoothScrolling: true,
      automaticLayout: true,
    }),
    [readOnly, fontSize, tabSize, showMinimap, showLineNumbers, wordWrap],
  )

  // ---- Render ----

  const editorContent = (
    <motion.div
      {...fadeUp}
      transition={springGentle}
      className={cn(
        'overflow-hidden rounded-xl',
        isDark
          ? 'ring-1 ring-white/[0.08] bg-[#1e1e1e]'
          : 'border border-black/[0.12] bg-white',
        isFullscreen && 'rounded-none ring-0 border-none',
        className,
      )}
    >
      {/* Theme-switch flash overlay */}
      <motion.div
        animate={{ opacity: themeFlash ? 0.8 : 1 }}
        transition={tweenSmooth}
        className="flex flex-col"
      >
        {/* File tabs (multi-file mode) */}
        {hasFiles && filesProp && (
          <FileTabs
            files={filesProp}
            activeIndex={activeFileIndex}
            onSelect={handleFileSelect}
            onClose={handleFileClose}
            onAdd={handleFileAdd}
            theme={theme}
          />
        )}

        {/* Toolbar */}
        <Toolbar
          language={language}
          onLanguageChange={handleLanguageChange}
          theme={theme}
          onThemeToggle={handleThemeToggle}
          value={currentValue}
          onFormat={handleFormat}
          onFullscreen={handleFullscreen}
          isFullscreen={isFullscreen}
          onRun={onRun}
          isFormatting={isFormatting}
        />

        {/* Editor / Diff Editor */}
        {isDiff ? (
          <DiffEditorPanel
            original={diff.original}
            modified={diff.modified}
            language={diff.language}
            diffMode={diffMode}
            theme={theme}
            height={isFullscreen ? 'calc(100vh - 160px)' : height}
            options={{ fontSize, readOnly, wordWrap: wordWrap ? 'on' : 'off' }}
          />
        ) : (
          <div className={isDark ? 'bg-[#1e1e1e]' : 'bg-white'}>
            <Editor
              height={isFullscreen ? 'calc(100vh - 160px)' : height}
              language={language}
              theme={themeName}
              value={currentValue}
              onChange={handleValueChange}
              beforeMount={handleBeforeMount}
              onMount={handleMount}
              options={editorOptions}
              loading={
                <div
                  className={cn(
                    'flex items-center justify-center text-sm',
                    isDark ? 'text-white/30' : 'text-black/30',
                  )}
                  style={{
                    height: typeof height === 'number' ? `${height}px` : height,
                  }}
                >
                  Loading editor...
                </div>
              }
            />
          </div>
        )}

        {/* Status bar */}
        {!isDiff && (
          <StatusBar
            language={language}
            cursorPosition={cursorPosition}
            value={currentValue}
            theme={theme}
          />
        )}

        {/* Output panel */}
        {outputProp !== undefined && (
          <OutputPanel
            output={outputProp}
            onClear={handleOutputClear}
            theme={theme}
          />
        )}
      </motion.div>
    </motion.div>
  )

  // ---- Fullscreen wrapper ----
  return (
    <AnimatePresence mode="wait">
      {isFullscreen ? (
        <motion.div
          key="fullscreen"
          initial={scaleIn.initial}
          animate={scaleIn.animate}
          exit={scaleIn.exit}
          transition={springGentle}
          className={cn(
            'fixed inset-0 z-50 flex flex-col',
            isDark ? 'bg-[#1e1e1e]' : 'bg-white',
          )}
        >
          {editorContent}
        </motion.div>
      ) : (
        <motion.div key="normal" layout transition={springSnappy}>
          {editorContent}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
