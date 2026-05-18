'use client'

import {
  Sun,
  Moon,
  Maximize2,
  Minimize2,
  Play,
  Wand2,
  Loader2,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { CopyButton } from '@/components/bahrawy/copy-button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ToolbarProps {
  language: string
  onLanguageChange: (language: string) => void
  theme: 'dark' | 'light'
  onThemeToggle: () => void
  value: string
  onFormat: () => void
  onFullscreen: () => void
  isFullscreen: boolean
  onRun?: (code: string) => void
  isFormatting: boolean
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const LANGUAGES = [
  { value: 'typescript', label: 'TypeScript' },
  { value: 'javascript', label: 'JavaScript' },
  { value: 'tsx', label: 'TSX' },
  { value: 'jsx', label: 'JSX' },
  { value: 'python', label: 'Python' },
  { value: 'rust', label: 'Rust' },
  { value: 'go', label: 'Go' },
  { value: 'css', label: 'CSS' },
  { value: 'html', label: 'HTML' },
  { value: 'json', label: 'JSON' },
  { value: 'markdown', label: 'Markdown' },
  { value: 'sql', label: 'SQL' },
  { value: 'bash', label: 'Bash' },
  { value: 'yaml', label: 'YAML' },
] as const

const FORMATTABLE = new Set([
  'typescript',
  'javascript',
  'json',
  'html',
  'css',
  'tsx',
  'jsx',
])

// ---------------------------------------------------------------------------
// ToolbarButton (internal)
// ---------------------------------------------------------------------------

function ToolbarButton({
  onClick,
  tooltip,
  children,
  isDark,
  className,
  disabled,
}: {
  onClick: () => void
  tooltip: string
  children: React.ReactNode
  isDark: boolean
  className?: string
  disabled?: boolean
}) {
  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            onClick={onClick}
            disabled={disabled}
            className={cn(
              'inline-flex h-8 w-8 items-center justify-center rounded-lg transition-all active:scale-93',
              isDark
                ? 'text-white/50 hover:bg-white/[0.06] hover:text-white disabled:text-white/20'
                : 'text-black/50 hover:bg-black/[0.06] hover:text-black disabled:text-black/20',
              disabled && 'pointer-events-none',
              className,
            )}
            aria-label={tooltip}
          >
            {children}
          </button>
        </TooltipTrigger>
        <TooltipContent side="bottom">{tooltip}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function Toolbar({
  language,
  onLanguageChange,
  theme,
  onThemeToggle,
  value,
  onFormat,
  onFullscreen,
  isFullscreen,
  onRun,
  isFormatting,
}: ToolbarProps) {
  const isDark = theme === 'dark'
  const canFormat = FORMATTABLE.has(language)

  return (
    <div
      className={cn(
        'flex items-center justify-between border-b px-2 py-1.5',
        isDark
          ? 'border-white/[0.06] bg-white/[0.02]'
          : 'border-black/[0.06] bg-black/[0.02]',
      )}
    >
      {/* Left: language selector */}
      <div className="flex items-center gap-2">
        <Select value={language} onValueChange={onLanguageChange}>
          <SelectTrigger
            className={cn(
              'h-8 w-[140px] border-none text-xs font-medium shadow-none',
              isDark
                ? 'bg-white/[0.04] text-white/70 hover:bg-white/[0.08] focus:ring-0'
                : 'bg-black/[0.04] text-black/70 hover:bg-black/[0.08] focus:ring-0',
            )}
          >
            <SelectValue placeholder="Language" />
          </SelectTrigger>
          <SelectContent
            className={cn(
              isDark && 'border-white/[0.1] bg-zinc-900',
            )}
          >
            {LANGUAGES.map((lang) => (
              <SelectItem key={lang.value} value={lang.value}>
                {lang.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Right: action buttons */}
      <div className="flex items-center gap-0.5">
        {/* Theme toggle */}
        <ToolbarButton
          onClick={onThemeToggle}
          tooltip={isDark ? 'Light theme' : 'Dark theme'}
          isDark={isDark}
        >
          {isDark ? (
            <Sun className="h-4 w-4" />
          ) : (
            <Moon className="h-4 w-4" />
          )}
        </ToolbarButton>

        {/* Copy */}
        <CopyButton
          text={value}
          variant="ghost"
          size="sm"
          className={cn(
            isDark
              ? 'text-white/50 hover:text-white'
              : 'text-black/50 hover:text-black',
          )}
        />

        {/* Format */}
        {canFormat && (
          <ToolbarButton
            onClick={onFormat}
            tooltip="Format code"
            isDark={isDark}
            disabled={isFormatting}
          >
            {isFormatting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Wand2 className="h-4 w-4" />
            )}
          </ToolbarButton>
        )}

        {/* Fullscreen */}
        <ToolbarButton
          onClick={onFullscreen}
          tooltip={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
          isDark={isDark}
        >
          {isFullscreen ? (
            <Minimize2 className="h-4 w-4" />
          ) : (
            <Maximize2 className="h-4 w-4" />
          )}
        </ToolbarButton>

        {/* Run */}
        {onRun && (
          <ToolbarButton
            onClick={() => onRun(value)}
            tooltip="Run code"
            isDark={isDark}
            className={cn(
              isDark
                ? 'text-green-400/70 hover:text-green-400'
                : 'text-green-600/70 hover:text-green-600',
            )}
          >
            <Play className="h-4 w-4" />
          </ToolbarButton>
        )}
      </div>
    </div>
  )
}
