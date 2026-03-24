import { colors } from '@/styles/colors';
import type { Series } from '@/types';

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

export const DATE_RANGE_OPTIONS: { value: DateRange; label: string }[] = [
  { value: 'all', label: 'Alle' },
  { value: '7days', label: '7 dager' },
  { value: '30days', label: '30 dager' },
  { value: '90days', label: '90 dager' },
];

export const CATEGORY_LABELS: Record<string, string> = {
  all: 'Alle',
  SKIVE_INDOOR: 'Skive inne',
  SKIVE_OUTDOOR: 'Skive ute',
  JAKT_3D: '3D jakt',
  FELT: 'Felt',
};

export function getCategoryLabel(cat: string): string {
  return CATEGORY_LABELS[cat] ?? cat;
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('nb-NO', { day: 'numeric', month: 'short' });
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
