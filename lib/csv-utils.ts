// ---------------------------------------------------------------------------
// CSV import/export utilities — pure JS, no library
// ---------------------------------------------------------------------------

/**
 * Parse a CSV string into rows of string arrays.
 * Handles quoted fields, newlines inside quotes, and escaped quotes ("").
 */
export function parseCSV(csv: string): string[][] {
  const rows: string[][] = []
  let row: string[] = []
  let field = ''
  let inQuotes = false

  for (let i = 0; i < csv.length; i++) {
    const ch = csv[i]
    const next = csv[i + 1]

    if (inQuotes) {
      if (ch === '"') {
        if (next === '"') {
          field += '"'
          i++ // skip escaped quote
        } else {
          inQuotes = false
        }
      } else {
        field += ch
      }
    } else {
      if (ch === '"') {
        inQuotes = true
      } else if (ch === ',') {
        row.push(field)
        field = ''
      } else if (ch === '\r' && next === '\n') {
        row.push(field)
        field = ''
        rows.push(row)
        row = []
        i++ // skip \n
      } else if (ch === '\n') {
        row.push(field)
        field = ''
        rows.push(row)
        row = []
      } else {
        field += ch
      }
    }
  }

  // Push last field/row
  if (field || row.length > 0) {
    row.push(field)
    rows.push(row)
  }

  return rows
}

/**
 * Convert rows of data into a CSV string.
 */
export function toCSV(
  headers: string[],
  rows: Record<string, unknown>[],
  keys: string[],
): string {
  const escapeField = (val: unknown): string => {
    const str = val == null ? '' : String(val)
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
      return `"${str.replace(/"/g, '""')}"`
    }
    return str
  }

  const headerLine = headers.map(escapeField).join(',')
  const dataLines = rows.map((row) =>
    keys.map((key) => escapeField(row[key])).join(','),
  )

  return [headerLine, ...dataLines].join('\n')
}

/**
 * Parse a TSV string (from clipboard / Excel paste) into a 2D array.
 */
export function parseTSV(tsv: string): string[][] {
  return tsv
    .split('\n')
    .filter((line) => line.length > 0)
    .map((line) => line.split('\t'))
}

/**
 * Convert a 2D selection to TSV for clipboard copy.
 */
export function toTSV(data: string[][]): string {
  return data.map((row) => row.join('\t')).join('\n')
}

/**
 * Download a string as a file.
 */
export function downloadFile(content: string, filename: string, mimeType = 'text/csv'): void {
  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
