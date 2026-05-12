import { Text, TouchableOpacity, View } from 'react-native';
import { PracticeFilter } from '@/types';
import { useTranslation } from '@/contexts';
import { styles } from './AktivitetStyles';

interface FilterTabsProps {
  filter: PracticeFilter;
  onFilterChange: (filter: PracticeFilter) => void;
}

export default function FilterTabs({ filter, onFilterChange }: FilterTabsProps) {
  const { t } = useTranslation();
  const filters: { label: string; value: PracticeFilter }[] = [
    { label: t['aktivitet.filterAll'], value: 'all' },
    { label: t['aktivitet.filterPractices'], value: 'TRENING' },
    { label: t['aktivitet.filterCompetitions'], value: 'KONKURRANSE' },
  ];

  return (
    <View style={styles.filterRow}>
      {filters.map((f) => (
        <TouchableOpacity
          key={f.value}
          style={[styles.filterTab, filter === f.value && styles.filterTabActive]}
          onPress={() => onFilterChange(f.value)}
          accessibilityLabel={f.label}>
          <Text style={[styles.filterTabText, filter === f.value && styles.filterTabTextActive]}>{f.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}
