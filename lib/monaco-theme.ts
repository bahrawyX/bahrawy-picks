// ---------------------------------------------------------------------------
// Bahrawy Monaco Editor Themes
// ---------------------------------------------------------------------------

export const bahrawyDark = {
  base: 'vs-dark' as const,
  inherit: true,
  rules: [
    { token: 'comment', foreground: '6B7280', fontStyle: 'italic' },
    { token: 'keyword', foreground: 'A78BFA' },
    { token: 'string', foreground: '86EFAC' },
    { token: 'number', foreground: 'FCA5A5' },
    { token: 'function', foreground: '93C5FD' },
    { token: 'type', foreground: 'FCD34D' },
    { token: 'variable', foreground: 'E5E7EB' },
  ],
  colors: {
    'editor.background': '#000000',
    'editor.foreground': '#E5E7EB',
    'editor.lineHighlightBackground': '#111111',
    'editor.selectionBackground': '#1D4ED8',
    'editorLineNumber.foreground': '#374151',
    'editorLineNumber.activeForeground': '#9CA3AF',
    'editor.inactiveSelectionBackground': '#1E3A5F',
    'editorIndentGuide.background': '#1F2937',
    'editorIndentGuide.activeBackground': '#374151',
    'scrollbarSlider.background': '#1F2937',
    'scrollbarSlider.hoverBackground': '#374151',
  },
}

export const bahrawyLight = {
  base: 'vs' as const,
  inherit: true,
  rules: [
    { token: 'comment', foreground: '6B7280', fontStyle: 'italic' },
    { token: 'keyword', foreground: '7C3AED' },
    { token: 'string', foreground: '059669' },
    { token: 'number', foreground: 'DC2626' },
    { token: 'function', foreground: '2563EB' },
    { token: 'type', foreground: 'D97706' },
  ],
  colors: {
    'editor.background': '#FFFFFF',
    'editor.foreground': '#111827',
    'editor.lineHighlightBackground': '#F9FAFB',
    'editorLineNumber.foreground': '#D1D5DB',
    'editorLineNumber.activeForeground': '#6B7280',
  },
}
