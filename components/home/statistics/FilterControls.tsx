import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { colors } from '@/styles/colors';
import { DATE_RANGE_OPTIONS, getCategoryLabel, type DateRange } from './constants';

interface Props {
  dateRange: DateRange;
  onDateRangeChange: (range: DateRange) => void;
  categories: string[];
  arrowsCategory: string;
  onArrowsCategoryChange: (cat: string) => void;
  scoreCategory: string;
  onScoreCategoryChange: (cat: string) => void;
}

export function FilterControls({
  dateRange,
  onDateRangeChange,
  categories,
  arrowsCategory,
  onArrowsCategoryChange,
  scoreCategory,
  onScoreCategoryChange,
}: Props) {
  const allCategories = ['all', ...categories];

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Periode</Text>
      <View style={styles.chipRow}>
        {DATE_RANGE_OPTIONS.map((opt) => {
          const active = dateRange === opt.value;
          return (
            <TouchableOpacity
              key={opt.value}
              style={[styles.chip, active && styles.chipActive]}
              onPress={() => onDateRangeChange(opt.value)}
              activeOpacity={0.7}>
              <Text style={[styles.chipText, active && styles.chipTextActive]}>{opt.label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Category for arrows chart */}
      {categories.length > 1 && (
        <>
          <Text style={styles.label}>Kategori – Piler</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipRow}>
            {allCategories.map((cat) => {
              const active = arrowsCategory === cat;
              return (
                <TouchableOpacity
                  key={cat}
                  style={[styles.chip, active && styles.chipActive]}
                  onPress={() => onArrowsCategoryChange(cat)}
                  activeOpacity={0.7}>
                  <Text style={[styles.chipText, active && styles.chipTextActive]}>{getCategoryLabel(cat)}</Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          <Text style={styles.label}>Kategori – Score</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipRow}>
            {allCategories.map((cat) => {
              const active = scoreCategory === cat;
              return (
                <TouchableOpacity
                  key={cat}
                  style={[styles.chip, active && styles.chipActive]}
                  onPress={() => onScoreCategoryChange(cat)}
                  activeOpacity={0.7}>
                  <Text style={[styles.chipText, active && styles.chipTextActive]}>{getCategoryLabel(cat)}</Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.7)',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  chipRow: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  chipActive: {
    backgroundColor: colors.white,
    borderColor: colors.white,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.8)',
  },
  chipTextActive: {
    color: colors.primary,
  },
});
