/**
 * Check if the number of decimals in a string is less than the maxDecimals
 * @param value
 * @param maxDecimals
 */
export function checkDecimalCount(value: string, maxDecimals: number): boolean {
  const decimalCount = (value.split('.')[1] || []).length;
  return decimalCount < maxDecimals;
}
