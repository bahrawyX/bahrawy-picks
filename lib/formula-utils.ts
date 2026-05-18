// ---------------------------------------------------------------------------
// Formula evaluation for SpreadsheetInput
// Supports: =SUM(A1:A5), =AVG(B1:B10), =MAX(C1:C5), =MIN(C1:C5), =COUNT(A1:A5)
// ---------------------------------------------------------------------------

/** Parse a cell reference like "A1" into { col: 0, row: 0 } */
export function parseCellRef(ref: string): { col: number; row: number } | null {
  const match = ref.match(/^([A-Z]+)(\d+)$/)
  if (!match) return null

  let col = 0
  for (let i = 0; i < match[1].length; i++) {
    col = col * 26 + (match[1].charCodeAt(i) - 64)
  }
  col -= 1 // 0-indexed

  const row = parseInt(match[2], 10) - 1 // 0-indexed
  return { col, row }
}

/** Convert column index to letter (0 → A, 25 → Z, 26 → AA) */
export function colToLetter(col: number): string {
  let result = ''
  let n = col
  while (n >= 0) {
    result = String.fromCharCode((n % 26) + 65) + result
    n = Math.floor(n / 26) - 1
  }
  return result
}

/** Parse a range like "A1:B5" into an array of { col, row } */
export function parseRange(range: string): { col: number; row: number }[] {
  const [startRef, endRef] = range.split(':')
  const start = parseCellRef(startRef.trim())
  const end = parseCellRef(endRef.trim())
  if (!start || !end) return []

  const cells: { col: number; row: number }[] = []
  const minCol = Math.min(start.col, end.col)
  const maxCol = Math.max(start.col, end.col)
  const minRow = Math.min(start.row, end.row)
  const maxRow = Math.max(start.row, end.row)

  for (let r = minRow; r <= maxRow; r++) {
    for (let c = minCol; c <= maxCol; c++) {
      cells.push({ col: c, row: r })
    }
  }

  return cells
}

/** Get numeric values from a range of cells */
function getValues(
  range: string,
  data: Record<string, unknown>[],
  colKeys: string[],
): number[] {
  const cells = parseRange(range)
  const values: number[] = []

  for (const cell of cells) {
    if (cell.row >= 0 && cell.row < data.length && cell.col >= 0 && cell.col < colKeys.length) {
      const val = data[cell.row][colKeys[cell.col]]
      const num = Number(val)
      if (!isNaN(num) && val !== '' && val !== null && val !== undefined) {
        values.push(num)
      }
    }
  }

  return values
}

/** Evaluate a formula string and return the result or error */
export function evaluateFormula(
  formula: string,
  data: Record<string, unknown>[],
  colKeys: string[],
): { value: number | string; error: boolean } {
  const trimmed = formula.trim()
  if (!trimmed.startsWith('=')) {
    return { value: trimmed, error: false }
  }

  const expr = trimmed.slice(1).trim().toUpperCase()

  // Match function(range)
  const fnMatch = expr.match(/^(SUM|AVG|AVERAGE|MAX|MIN|COUNT)\((.+)\)$/)
  if (!fnMatch) {
    return { value: '#ERR', error: true }
  }

  const fn = fnMatch[1]
  const range = fnMatch[2]

  try {
    const values = getValues(range, data, colKeys)

    switch (fn) {
      case 'SUM':
        return { value: values.reduce((a, b) => a + b, 0), error: false }
      case 'AVG':
      case 'AVERAGE':
        if (values.length === 0) return { value: '#ERR', error: true }
        return { value: values.reduce((a, b) => a + b, 0) / values.length, error: false }
      case 'MAX':
        if (values.length === 0) return { value: '#ERR', error: true }
        return { value: Math.max(...values), error: false }
      case 'MIN':
        if (values.length === 0) return { value: '#ERR', error: true }
        return { value: Math.min(...values), error: false }
      case 'COUNT':
        return { value: values.length, error: false }
      default:
        return { value: '#ERR', error: true }
    }
  } catch {
    return { value: '#ERR', error: true }
  }
}
