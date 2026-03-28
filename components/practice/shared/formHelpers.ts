import { PracticeCategory } from '@/types';

/**
 * Check if a practice category uses distance ranges instead of fixed distances
 */
export function isRangeCategory(cat: PracticeCategory): boolean {
  return cat === PracticeCategory.JAKT_3D || cat === PracticeCategory.FELT;
}

/**
 * Parse a numeric string to number or undefined
 */
export function parseNum(text: string): number | undefined {
  const n = parseFloat(text);
  return isNaN(n) ? undefined : n;
}

/**
 * Safely parse a date string from the API, falling back to today if invalid
 */
export function parseDate(value: string | Date | null | undefined): Date {
  if (!value) return new Date();
  if (value instanceof Date) return isNaN(value.getTime()) ? new Date() : value;

  // Date-only strings like "2025-12-01" are parsed as UTC midnight by JS,
  // which can shift the displayed date by ±1 day depending on timezone.
  // Treat them as local midnight instead.
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const [y, m, d] = value.split('-').map(Number);
    return new Date(y, m - 1, d);
  }

  const parsed = new Date(value);
  return isNaN(parsed.getTime()) ? new Date() : parsed;
}
