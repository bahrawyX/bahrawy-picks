export interface CurrencyInfo {
  code: string
  name: string
  symbol: string
  flag: string
  decimals: number
}

export const currencies: CurrencyInfo[] = [
  { code: 'USD', name: 'US Dollar', symbol: '$', flag: '🇺🇸', decimals: 2 },
  { code: 'EUR', name: 'Euro', symbol: '€', flag: '🇪🇺', decimals: 2 },
  { code: 'GBP', name: 'British Pound', symbol: '£', flag: '🇬🇧', decimals: 2 },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥', flag: '🇯🇵', decimals: 0 },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'CA$', flag: '🇨🇦', decimals: 2 },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', flag: '🇦🇺', decimals: 2 },
  { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF', flag: '🇨🇭', decimals: 2 },
  { code: 'CNY', name: 'Chinese Yuan', symbol: '¥', flag: '🇨🇳', decimals: 2 },
  { code: 'INR', name: 'Indian Rupee', symbol: '₹', flag: '🇮🇳', decimals: 2 },
  { code: 'MXN', name: 'Mexican Peso', symbol: 'MX$', flag: '🇲🇽', decimals: 2 },
  { code: 'BRL', name: 'Brazilian Real', symbol: 'R$', flag: '🇧🇷', decimals: 2 },
  { code: 'KRW', name: 'South Korean Won', symbol: '₩', flag: '🇰🇷', decimals: 0 },
  { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$', flag: '🇸🇬', decimals: 2 },
  { code: 'HKD', name: 'Hong Kong Dollar', symbol: 'HK$', flag: '🇭🇰', decimals: 2 },
  { code: 'SEK', name: 'Swedish Krona', symbol: 'kr', flag: '🇸🇪', decimals: 2 },
  { code: 'NOK', name: 'Norwegian Krone', symbol: 'kr', flag: '🇳🇴', decimals: 2 },
  { code: 'DKK', name: 'Danish Krone', symbol: 'kr', flag: '🇩🇰', decimals: 2 },
  { code: 'NZD', name: 'New Zealand Dollar', symbol: 'NZ$', flag: '🇳🇿', decimals: 2 },
  { code: 'ZAR', name: 'South African Rand', symbol: 'R', flag: '🇿🇦', decimals: 2 },
  { code: 'TRY', name: 'Turkish Lira', symbol: '₺', flag: '🇹🇷', decimals: 2 },
  { code: 'RUB', name: 'Russian Ruble', symbol: '₽', flag: '🇷🇺', decimals: 2 },
  { code: 'PLN', name: 'Polish Zloty', symbol: 'zł', flag: '🇵🇱', decimals: 2 },
  { code: 'THB', name: 'Thai Baht', symbol: '฿', flag: '🇹🇭', decimals: 2 },
  { code: 'IDR', name: 'Indonesian Rupiah', symbol: 'Rp', flag: '🇮🇩', decimals: 0 },
  { code: 'TWD', name: 'New Taiwan Dollar', symbol: 'NT$', flag: '🇹🇼', decimals: 2 },
  { code: 'SAR', name: 'Saudi Riyal', symbol: '﷼', flag: '🇸🇦', decimals: 2 },
  { code: 'AED', name: 'UAE Dirham', symbol: 'د.إ', flag: '🇦🇪', decimals: 2 },
  { code: 'CZK', name: 'Czech Koruna', symbol: 'Kč', flag: '🇨🇿', decimals: 2 },
  { code: 'ILS', name: 'Israeli Shekel', symbol: '₪', flag: '🇮🇱', decimals: 2 },
  { code: 'EGP', name: 'Egyptian Pound', symbol: 'E£', flag: '🇪🇬', decimals: 2 },
]

export function getCurrency(code: string): CurrencyInfo | undefined {
  return currencies.find((c) => c.code === code)
}
