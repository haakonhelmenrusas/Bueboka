import { Text, TouchableOpacity, View } from 'react-native';
import { PracticeFilter } from '@/types';
import { styles } from './AktivitetStyles';

const FILTERS: { label: string; value: PracticeFilter }[] = [
  { label: 'Alle', value: 'all' },
  { label: 'Treninger', value: 'TRENING' },
  { label: 'Konkurranser', value: 'KONKURRANSE' },
];

interface FilterTabsProps {
  filter: PracticeFilter;
  onFilterChange: (filter: PracticeFilter) => void;
}

export default function FilterTabs({ filter, onFilterChange }: FilterTabsProps) {
  return (
    <View style={styles.filterRow}>
      {FILTERS.map((f) => (
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
