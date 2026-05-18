import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock @monaco-editor/react since it requires a browser environment with web workers
vi.mock('@monaco-editor/react', () => {
  const MockEditor = ({
    value,
    onChange,
    language,
    onMount,
    loading,
    options,
  }: {
    value?: string
    onChange?: (val: string | undefined) => void
    language?: string
    onMount?: (editor: unknown, monaco: unknown) => void
    loading?: React.ReactNode
    options?: Record<string, unknown>
  }) => {
    return (
      <div data-testid="monaco-editor" data-language={language} data-readonly={options?.readOnly}>
        <textarea
          data-testid="monaco-textarea"
          value={value ?? ''}
          onChange={(e) => onChange?.(e.target.value)}
          readOnly={!!options?.readOnly}
          aria-label="Code editor"
        />
      </div>
    )
  }
  MockEditor.displayName = 'MockEditor'

  const MockDiffEditor = ({
    original,
    modified,
    language,
  }: {
    original?: string
    modified?: string
    language?: string
  }) => {
    return (
      <div data-testid="monaco-diff-editor" data-language={language}>
        <div data-testid="diff-original">{original}</div>
        <div data-testid="diff-modified">{modified}</div>
      </div>
    )
  }
  MockDiffEditor.displayName = 'MockDiffEditor'

  return {
    __esModule: true,
    default: MockEditor,
    DiffEditor: MockDiffEditor,
  }
})

import { CodeEditor } from '@/components/bahrawy/code-editor'

describe('CodeEditor', () => {
  it('renders without crashing', () => {
    render(<CodeEditor />)
    expect(screen.getByTestId('monaco-editor')).toBeInTheDocument()
  })

  it('renders toolbar with language selector', () => {
    render(<CodeEditor />)
    // Language label appears in both the Select trigger and StatusBar
    const matches = screen.getAllByText('TypeScript')
    expect(matches.length).toBeGreaterThanOrEqual(1)
  })

  it('onChange fires when editor content changes', async () => {
    const onChange = vi.fn()
    const user = userEvent.setup()
    render(<CodeEditor onChange={onChange} value="" />)
    const textarea = screen.getByTestId('monaco-textarea')
    await user.type(textarea, 'a')
    expect(onChange).toHaveBeenCalled()
  })

  it('readOnly=true disables editing', () => {
    render(<CodeEditor readOnly value="const x = 1" />)
    const textarea = screen.getByTestId('monaco-textarea')
    expect(textarea).toHaveAttribute('readonly')
  })

  it('copy button is present', () => {
    render(<CodeEditor value="hello" />)
    expect(screen.getByLabelText('Copy')).toBeInTheDocument()
  })

  it('fullscreen button toggles fullscreen state', async () => {
    const user = userEvent.setup()
    render(<CodeEditor />)
    const fsBtn = screen.getByLabelText('Fullscreen')
    await user.click(fsBtn)
    // After clicking, the button label changes (AnimatePresence may delay render)
    await waitFor(() => {
      expect(screen.getByLabelText('Exit fullscreen')).toBeInTheDocument()
    })
  })

  it('escape key closes fullscreen', async () => {
    const user = userEvent.setup()
    render(<CodeEditor />)
    await user.click(screen.getByLabelText('Fullscreen'))
    await waitFor(() => {
      expect(screen.getByLabelText('Exit fullscreen')).toBeInTheDocument()
    })

    // Press escape
    fireEvent.keyDown(window, { key: 'Escape' })
    await waitFor(() => {
      expect(screen.getByLabelText('Fullscreen')).toBeInTheDocument()
    })
  })

  it('output panel renders when output prop provided', () => {
    render(
      <CodeEditor
        output="Hello World"
        onOutputClear={() => {}}
      />,
    )
    expect(screen.getByText('Hello World')).toBeInTheDocument()
    expect(screen.getByText('Output')).toBeInTheDocument()
  })

  it('output clear button calls onOutputClear', async () => {
    const onClear = vi.fn()
    const user = userEvent.setup()
    render(
      <CodeEditor output="test output" onOutputClear={onClear} />,
    )
    await user.click(screen.getByLabelText('Clear output'))
    expect(onClear).toHaveBeenCalledOnce()
  })

  it('onRun fires with current code when run button clicked', async () => {
    const onRun = vi.fn()
    const user = userEvent.setup()
    render(<CodeEditor value="console.log(1)" onRun={onRun} />)
    await user.click(screen.getByLabelText('Run code'))
    expect(onRun).toHaveBeenCalledWith('console.log(1)')
  })

  it('multi-file tabs render when files prop provided', () => {
    render(
      <CodeEditor
        files={[
          { name: 'index.ts', language: 'typescript', content: 'const x = 1' },
          { name: 'style.css', language: 'css', content: 'body {}' },
        ]}
        onFilesChange={() => {}}
      />,
    )
    expect(screen.getByText('index.ts')).toBeInTheDocument()
    expect(screen.getByText('style.css')).toBeInTheDocument()
  })

  it('switching tabs changes displayed content', async () => {
    const user = userEvent.setup()
    render(
      <CodeEditor
        files={[
          { name: 'a.ts', language: 'typescript', content: 'const a = 1' },
          { name: 'b.ts', language: 'typescript', content: 'const b = 2' },
        ]}
        onFilesChange={() => {}}
      />,
    )
    // Click second tab
    await user.click(screen.getByText('b.ts'))
    const textarea = screen.getByTestId('monaco-textarea')
    expect(textarea).toHaveValue('const b = 2')
  })

  it('diff mode renders DiffEditor when diff prop provided', () => {
    render(
      <CodeEditor
        diff={{
          original: 'const x = 1',
          modified: 'const x = 2',
          language: 'typescript',
        }}
      />,
    )
    expect(screen.getByTestId('monaco-diff-editor')).toBeInTheDocument()
    expect(screen.getByTestId('diff-original')).toHaveTextContent('const x = 1')
    expect(screen.getByTestId('diff-modified')).toHaveTextContent('const x = 2')
  })

  it('status bar shows correct language', () => {
    render(<CodeEditor language="python" />)
    // "Python" appears in both the Select trigger and the StatusBar badge
    const matches = screen.getAllByText('Python')
    expect(matches.length).toBeGreaterThanOrEqual(1)
  })
})
