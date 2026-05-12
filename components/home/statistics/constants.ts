import { colors } from '@/styles/colors';
import type { Series } from '@/types';
import type { Locale, TranslationKeys } from '@/lib/i18n';

export type DateRange = 'all' | '7days' | '30days' | '90days';

export const SERIES_COLORS = [
  colors.primary,
  colors.primaryLight,
  colors.secondary,
  '#9333ea',
  '#0891b2',
  colors.accentYellow,
  colors.success,
  '#d97706',
  '#059669',
  colors.error,
];

export const getDateRangeOptions = (t: TranslationKeys): { value: DateRange; label: string }[] => [
  { value: 'all', label: t['aktivitet.filterAll'] },
  { value: '7days', label: t['statistics.date7days'] },
  { value: '30days', label: t['statistics.date30days'] },
  { value: '90days', label: t['statistics.date90days'] },
];

export function getCategoryLabel(cat: string, t: TranslationKeys): string {
  switch (cat) {
    case 'all':
      return t['aktivitet.filterAll'];
    case 'SKIVE_INDOOR':
      return t['statistics.categorySkiveIndoor'];
    case 'SKIVE_OUTDOOR':
      return t['statistics.categorySkiveOutdoor'];
    case 'JAKT_3D':
      return t['statistics.categoryJakt3D'];
    case 'FELT':
      return t['statistics.categoryFelt'];
    default:
      return cat;
  }
}

export function formatDate(dateString: string, locale: Locale = 'no'): string {
  return new Date(dateString).toLocaleDateString(locale === 'en' ? 'en-GB' : 'nb-NO', { day: 'numeric', month: 'short' });
}

export function filterSeriesByDate(series: Series[], dateRange: DateRange): Series[] {
  if (dateRange === 'all') return series;
  const daysMap: Record<string, number> = { '7days': 7, '30days': 30, '90days': 90 };
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - daysMap[dateRange]);
  const cutoffStr = cutoff.toISOString().split('T')[0];
  return series.map((s) => ({ ...s, data: s.data.filter((d) => d.date >= cutoffStr) })).filter((s) => s.data.length > 0);
}

export function getUniqueCategories(series: Series[]): string[] {
  const cats = new Set<string>();
  series.forEach((s) =>
    s.data.forEach((d) => {
      if (d.practiceCategory) cats.add(d.practiceCategory);
    }),
  );
  return Array.from(cats);
}
