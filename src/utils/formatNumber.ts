/**
 * Форматирует число, разделяя группы по 3 цифры пробелами.
 * @example
 * formatNumber(1442)    // "1 442"
 * formatNumber(1000000) // "1 000 000"
 * formatNumber(0)       // "0"
 */
export function formatNumber(value: number): string {
  if (!Number.isFinite(value)) return ''
  return Math.trunc(value).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
}

/**
 * Превращает строку (возможно с пробелами и мусором) в число.
 * Оставляет только цифры.
 * @example
 * parseNumber("1 442")    // 1442
 * parseNumber("abc 123")  // 123
 * parseNumber("")         // 0
 */
export function parseNumber(value: string): number {
  const digitsOnly = value.replace(/\D/g, '')
  if (digitsOnly === '') return 0
  return Number(digitsOnly)
}
