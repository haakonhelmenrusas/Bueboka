export function checkDecimalCount(value: string, maxDecimals: number): boolean {
  const decimalCount = (value.split('.')[1] || []).length;
  return decimalCount < maxDecimals;
}

/**
 * Check decimal count in number input from the user
 * @param value
 * @param key
 * @param dispatch
 */
export function handleNumberChange(value: string, key: any, dispatch: any) {
  const cleanValue = value.replace(/[^0-9.]/g, '');
  const parsedValue = parseFloat(cleanValue);

  if (!checkDecimalCount(cleanValue, 3)) {
    return;
  }
  if (!isNaN(parsedValue)) {
    dispatch({ type: key, payload: value.replace(',', '.') });
  } else {
    dispatch({ type: key, payload: '' });
  }
}
