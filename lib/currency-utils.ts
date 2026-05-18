import { getCurrency } from './currency-data'

/**
 * Format a numeric value as currency using Intl.NumberFormat.
 */
export function formatCurrency(
  value: number,
  currencyCode: string,
  locale?: string,
): string {
  const currency = getCurrency(currencyCode)
  if (!currency) return String(value)

  try {
    return new Intl.NumberFormat(locale ?? 'en-US', {
      style: 'currency',
      currency: currencyCode,
      minimumFractionDigits: currency.decimals,
      maximumFractionDigits: currency.decimals,
    }).format(value)
  } catch {
    return String(value)
  }
}

/**
 * Parse a formatted currency string back to a numeric value.
 * Strips everything except digits, minus, and decimal separators.
 */
export function parseCurrencyString(input: string): number {
  // Remove all non-numeric except dots, commas, and minus
  const cleaned = input.replace(/[^\d.,-]/g, '')
  // Handle comma as decimal (European format): if comma comes after last dot, it's decimal
  // If there's no dot but there's a comma, treat comma as decimal
  let normalized = cleaned
  const lastComma = cleaned.lastIndexOf(',')
  const lastDot = cleaned.lastIndexOf('.')

  if (lastComma > lastDot) {
    // Comma is the decimal separator
    normalized = cleaned.replace(/\./g, '').replace(',', '.')
  } else {
    // Dot is the decimal separator
    normalized = cleaned.replace(/,/g, '')
  }

  const result = parseFloat(normalized)
  return isNaN(result) ? 0 : result
}

/**
 * Format a raw numeric string for display (adds grouping separators).
 */
export function formatDisplayValue(
  rawValue: string,
  currencyCode: string,
  locale?: string,
): string {
  const currency = getCurrency(currencyCode)
  if (!currency) return rawValue

  const num = parseFloat(rawValue)
  if (isNaN(num)) return ''

  try {
    return new Intl.NumberFormat(locale ?? 'en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: currency.decimals,
    }).format(num)
  } catch {
    return rawValue
  }
}
