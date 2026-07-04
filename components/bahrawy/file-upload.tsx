'use client'

/**
 * <FileUpload />
 *
 * Drag-and-drop file upload component built on shadcn primitives with
 * Framer Motion animations. Supports single/multi file mode, MIME type
 * filtering, max file size, per-file upload progress, and React Hook Form
 * integration via `onChange`.
 *
 * @param accept     — MIME filter string (e.g. "image/*", "application/pdf")
 * @param maxSize    — Maximum file size in bytes
 * @param maxFiles   — Maximum number of files allowed
 * @param multiple   — Allow multiple file selection
 * @param onUpload   — Async handler called per file. Call the provided
 *                     `report(pct)` callback to drive the progress bar with
 *                     real numbers (e.g. from XHR/fetch progress events);
 *                     until the first report the bar is indeterminate.
 *                     A rejected promise marks the file as failed.
 * @param onChange    — Called whenever the file list changes (for RHF integration)
 * @param onRemove   — Called when a file card is dismissed
 * @param disabled   — Disables all interaction
 * @param className  — Additional classes for the outer wrapper
 */

import * as React from 'react'
import { motion, AnimatePresence, useAnimation } from 'framer-motion'
import {
  Upload,
  X,
  Check,
  AlertCircle,
  FileImage,
  FileText,
  FileVideo,
  File as FileIcon,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  springSnappy,
  springGentle,
  tweenExit,
  fadeUp,
  scaleIn,
  staggerContainer,
} from '@/lib/motion'

/* -------------------------------------------------------------------------- */
/*  Types                                                                     */
/* -------------------------------------------------------------------------- */

type FileStatus = 'uploading' | 'done' | 'error'

interface TrackedFile {
  id: string
  file: File
  /** 0–100, or `null` while progress is unknown (indeterminate bar). */
  progress: number | null
  status: FileStatus
  error?: string
}

export interface FileUploadProps {
  accept?: string
  maxSize?: number
  maxFiles?: number
  multiple?: boolean
  onUpload?: (file: File, report: (pct: number) => void) => Promise<void>
  onChange?: (files: File[]) => void
  onRemove?: (file: File) => void
  disabled?: boolean
  className?: string
}

/* -------------------------------------------------------------------------- */
/*  Helpers                                                                   */
/* -------------------------------------------------------------------------- */

let _uid = 0
function uid(): string {
  return `fu_${++_uid}_${Date.now()}`
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function mimeIcon(type: string) {
  if (type.startsWith('image/')) return FileImage
  if (type.startsWith('video/')) return FileVideo
  if (type.startsWith('text/') || type.includes('pdf') || type.includes('document'))
    return FileText
  return FileIcon
}

/** Check if a file's MIME type matches the `accept` string. */
function matchesAccept(file: File, accept: string | undefined): boolean {
  if (!accept) return true
  const types = accept.split(',').map((t) => t.trim())
  return types.some((t) => {
    if (t.endsWith('/*')) {
      return file.type.startsWith(t.replace('/*', '/'))
    }
    if (t.startsWith('.')) {
      return file.name.toLowerCase().endsWith(t.toLowerCase())
    }
    return file.type === t
  })
}

/* -------------------------------------------------------------------------- */
/*  Component                                                                 */
/* -------------------------------------------------------------------------- */

export function FileUpload({
  accept,
  maxSize,
  maxFiles,
  multiple = true,
  onUpload,
  onChange,
  onRemove,
  disabled = false,
  className,
}: FileUploadProps) {
  const [files, setFiles] = React.useState<TrackedFile[]>([])
  const [dragOver, setDragOver] = React.useState(false)
  const [zoneError, setZoneError] = React.useState(false)
  const inputRef = React.useRef<HTMLInputElement>(null)
  const shakeControls = useAnimation()

  /* Keep parent in sync via onChange */
  const notifyChange = React.useCallback(
    (next: TrackedFile[]) => {
      onChange?.(next.map((t) => t.file))
    },
    [onChange],
  )

  /* ------- Process incoming files ------- */
  const processFiles = React.useCallback(
    async (incoming: File[]) => {
      if (disabled) return

      // Validate MIME types — reject only the invalid files, keep the rest
      const invalid = incoming.filter((f) => !matchesAccept(f, accept))
      if (invalid.length > 0) {
        setZoneError(true)
        shakeControls.start({
          x: [0, -6, 6, -6, 6, 0],
          transition: { duration: 0.35 },
        })
        setTimeout(() => setZoneError(false), 1200)
      }
      const valid = incoming.filter((f) => matchesAccept(f, accept))
      if (valid.length === 0) return

      // Determine how many files we can accept
      let toAdd = valid
      if (!multiple) {
        toAdd = [valid[0]]
      } else if (maxFiles) {
        const remaining = maxFiles - files.length
        toAdd = valid.slice(0, Math.max(0, remaining))
      }
      if (toAdd.length === 0) return

      // Build tracked entries. With an onUpload handler, progress starts
      // indeterminate (null) until the handler reports a real number.
      // Without one there is nothing to upload to — complete instantly
      // rather than animating a fake progress bar.
      const entries: TrackedFile[] = toAdd.map((file) => {
        const overSize = maxSize !== undefined && file.size > maxSize
        if (overSize) {
          return {
            id: uid(),
            file,
            progress: 100,
            status: 'error' as const,
            error: `File exceeds ${formatSize(maxSize)} limit`,
          }
        }
        return {
          id: uid(),
          file,
          progress: onUpload ? null : 100,
          status: onUpload ? ('uploading' as const) : ('done' as const),
        }
      })

      const next = multiple ? [...files, ...entries] : entries
      setFiles(next)
      notifyChange(next)

      if (!onUpload) return

      // Kick off uploads for valid files
      for (const entry of entries) {
        if (entry.status !== 'uploading') continue

        // Real progress — driven by the handler's report() calls
        const report = (pct: number) => {
          const clamped = Math.max(0, Math.min(100, pct))
          setFiles((prev) =>
            prev.map((f) =>
              f.id === entry.id && f.status === 'uploading'
                ? { ...f, progress: clamped }
                : f,
            ),
          )
        }

        try {
          await onUpload(entry.file, report)
          setFiles((prev) =>
            prev.map((f) =>
              f.id === entry.id
                ? { ...f, progress: 100, status: 'done' }
                : f,
            ),
          )
        } catch (err) {
          setFiles((prev) =>
            prev.map((f) =>
              f.id === entry.id
                ? {
                    ...f,
                    progress: 100,
                    status: 'error',
                    error:
                      err instanceof Error && err.message
                        ? err.message
                        : 'Upload failed',
                  }
                : f,
            ),
          )
        }
      }
    },
    [
      accept,
      disabled,
      files,
      maxFiles,
      maxSize,
      multiple,
      notifyChange,
      onUpload,
      shakeControls,
    ],
  )

  /* ------- Remove a file ------- */
  const removeFile = React.useCallback(
    (id: string) => {
      setFiles((prev) => {
        const target = prev.find((f) => f.id === id)
        if (target) onRemove?.(target.file)
        const next = prev.filter((f) => f.id !== id)
        onChange?.(next.map((t) => t.file))
        return next
      })
    },
    [onChange, onRemove],
  )

  /* ------- Drag handlers ------- */
  const handleDragOver = React.useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      if (!disabled) setDragOver(true)
    },
    [disabled],
  )

  const handleDragLeave = React.useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setDragOver(false)
    },
    [],
  )

  const handleDrop = React.useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setDragOver(false)
      if (disabled) return

      const droppedFiles = Array.from(e.dataTransfer.files)
      if (droppedFiles.length > 0) processFiles(droppedFiles)
    },
    [disabled, processFiles],
  )

  /* ------- Input change ------- */
  const handleInputChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const selected = Array.from(e.target.files ?? [])
      if (selected.length > 0) processFiles(selected)
      // Reset so the same file can be re-selected
      e.target.value = ''
    },
    [processFiles],
  )

  /* ------- Keyboard ------- */
  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent) => {
      if (disabled) return
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        inputRef.current?.click()
      }
    },
    [disabled],
  )

  return (
    <div className={cn('flex flex-col gap-3', className)}>
      {/* ---- Drop zone ---- */}
      <motion.div
        animate={shakeControls}
        className="relative"
      >
        <motion.div
          role="button"
          tabIndex={disabled ? -1 : 0}
          aria-label="Upload files"
          aria-disabled={disabled}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onKeyDown={handleKeyDown}
          onClick={() => !disabled && inputRef.current?.click()}
          animate={{
            scale: dragOver ? 1.02 : 1,
            borderColor: zoneError
              ? 'rgb(244 63 94)'
              : dragOver
                ? 'rgb(161 161 170)'
                : 'rgb(63 63 70)',
            backgroundColor: zoneError
              ? 'rgba(244, 63, 94, 0.06)'
              : dragOver
                ? 'rgba(255, 255, 255, 0.04)'
                : 'rgba(0, 0, 0, 0)',
          }}
          transition={springSnappy}
          className={cn(
            'flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border border-dashed px-6 py-10',
            'outline-none focus-visible:ring-1 focus-visible:ring-zinc-600',
            'transition-colors',
            disabled && 'pointer-events-none cursor-not-allowed opacity-50',
          )}
        >
          <motion.div
            animate={{
              y: dragOver ? -2 : 0,
              scale: dragOver ? 1.1 : 1,
            }}
            transition={springSnappy}
          >
            <Upload
              className={cn(
                'h-8 w-8',
                zoneError ? 'text-rose-400' : 'text-zinc-500',
              )}
              strokeWidth={1.5}
            />
          </motion.div>

          <div className="text-center">
            <p className={cn(
              'text-sm font-medium',
              zoneError ? 'text-rose-400' : 'text-white/80',
            )}>
              {zoneError
                ? 'File type not accepted'
                : dragOver
                  ? 'Drop to upload'
                  : 'Drag & drop files here'}
            </p>
            <p className="mt-1 text-xs text-zinc-500">
              or click to browse
              {accept && ` · ${accept}`}
              {maxSize && ` · max ${formatSize(maxSize)}`}
            </p>
          </div>
        </motion.div>
      </motion.div>

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={handleInputChange}
        className="hidden"
        tabIndex={-1}
        aria-hidden
      />

      {/* ---- File list ---- */}
      <AnimatePresence mode="popLayout">
        {files.length > 0 && (
          <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="flex flex-col gap-2"
          >
            <AnimatePresence mode="popLayout">
              {files.map((tracked) => (
                <FileCard
                  key={tracked.id}
                  tracked={tracked}
                  onRemove={() => removeFile(tracked.id)}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*  FileCard                                                                  */
/* -------------------------------------------------------------------------- */

function FileCard({
  tracked,
  onRemove,
}: {
  tracked: TrackedFile
  onRemove: () => void
}) {
  const Icon = mimeIcon(tracked.file.type)
  const isError = tracked.status === 'error'
  const isDone = tracked.status === 'done'

  return (
    <motion.div
      layout
      variants={fadeUp}
      initial="initial"
      animate="animate"
      exit={scaleIn.exit}
      transition={springGentle}
      className={cn(
        'flex items-center gap-3 rounded-lg border px-3 py-2.5',
        isError
          ? 'border-rose-500/30 bg-rose-500/[0.06]'
          : 'border-zinc-800 bg-zinc-900/50',
      )}
    >
      {/* File icon */}
      <div
        className={cn(
          'flex h-9 w-9 shrink-0 items-center justify-center rounded-md',
          isError ? 'bg-rose-500/10 text-rose-400' : 'bg-white/[0.06] text-zinc-400',
        )}
      >
        <Icon className="h-4 w-4" strokeWidth={1.75} />
      </div>

      {/* Name + size + progress */}
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-white">
          {tracked.file.name}
        </p>
        <p className={cn(
          'mt-0.5 text-xs',
          isError ? 'text-rose-400' : 'text-zinc-500',
        )}>
          {isError && tracked.error
            ? tracked.error
            : formatSize(tracked.file.size)}
        </p>

        {/* Progress bar (only while uploading) */}
        {tracked.status === 'uploading' && (
          <div className="mt-1.5 h-1 w-full overflow-hidden rounded-full bg-white/10">
            {tracked.progress === null ? (
              /* Indeterminate — no real progress reported (yet) */
              <motion.div
                className="h-full w-1/3 rounded-full bg-emerald-500"
                initial={{ x: '-100%' }}
                animate={{ x: '300%' }}
                transition={{
                  duration: 1.2,
                  ease: 'easeInOut',
                  repeat: Infinity,
                }}
              />
            ) : (
              <motion.div
                className="h-full rounded-full bg-emerald-500"
                initial={{ width: '0%' }}
                animate={{ width: `${tracked.progress}%` }}
                transition={springGentle}
              />
            )}
          </div>
        )}
      </div>

      {/* Status indicator */}
      <div className="flex shrink-0 items-center gap-2">
        <AnimatePresence mode="wait">
          {isDone && (
            <motion.div
              key="check"
              {...scaleIn}
              transition={springSnappy}
              className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/15"
            >
              <Check className="h-3 w-3 text-emerald-400" strokeWidth={2.5} />
            </motion.div>
          )}
          {isError && (
            <motion.div
              key="error"
              initial={{ opacity: 0, x: 0 }}
              animate={{
                opacity: 1,
                x: [0, -3, 3, -3, 0],
              }}
              transition={springSnappy}
              className="flex h-5 w-5 items-center justify-center rounded-full bg-rose-500/15"
            >
              <AlertCircle className="h-3 w-3 text-rose-400" strokeWidth={2.5} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Remove button */}
        <motion.div whileTap={{ scale: 0.85 }} transition={springSnappy}>
          <Button
            type="button"
            variant="ghost"
            aria-label={`Remove ${tracked.file.name}`}
            onClick={(e) => {
              e.stopPropagation()
              onRemove()
            }}
            className="h-6 w-6 rounded-md p-0 text-zinc-500 hover:text-white"
          >
            <X className="h-3.5 w-3.5" />
          </Button>
        </motion.div>
      </div>
    </motion.div>
  )
}
