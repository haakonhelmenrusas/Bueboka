import { checkDecimalCount, formatNumber } from '@/utils';

/**
 * Check decimal count in number input from user
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
    dispatch({ type: key, payload: formatNumber(value) });
  } else {
    dispatch({ type: key, payload: '' });
  }
}
