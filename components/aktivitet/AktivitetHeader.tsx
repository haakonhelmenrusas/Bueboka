import { Text, View } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faBullseye } from '@fortawesome/free-solid-svg-icons/faBullseye';
import { colors } from '@/styles/colors';
import { useTranslation } from '@/contexts';
import { styles } from './AktivitetStyles';
import { PracticeFilter } from '@/types';
import FilterTabs from './FilterTabs';

interface AktivitetHeaderProps {
  paddingTop: number;
  filter: PracticeFilter;
  onFilterChange: (filter: PracticeFilter) => void;
}

export default function AktivitetHeader({ paddingTop, filter, onFilterChange }: AktivitetHeaderProps) {
  const { t } = useTranslation();
  return (
    <View style={[styles.header, { paddingTop }]}>
      <View style={styles.headerRow}>
        <View style={styles.headerIcon}>
          <FontAwesomeIcon icon={faBullseye} size={20} color={colors.white} />
        </View>
        <Text style={styles.headerTitle}>{t['aktivitet.title']}</Text>
      </View>
      <FilterTabs filter={filter} onFilterChange={onFilterChange} />
    </View>
  );
}
