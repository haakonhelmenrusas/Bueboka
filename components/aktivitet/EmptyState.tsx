import { Text, View } from 'react-native';
import { PracticeFilter } from '@/types';
import { useTranslation } from '@/contexts';
import { styles } from './AktivitetStyles';

interface EmptyStateProps {
  filter: PracticeFilter;
}

export default function EmptyState({ filter }: EmptyStateProps) {
  const { t } = useTranslation();
  const getMessage = () => {
    if (filter === 'TRENING') return t['aktivitet.emptyPractices'];
    if (filter === 'KONKURRANSE') return t['aktivitet.emptyCompetitions'];
    return t['recentActivity.empty'];
  };

  return (
    <View style={styles.placeholder}>
      <Text style={styles.placeholderText}>{getMessage()}</Text>
    </View>
  );
}
