import { Text, View } from 'react-native';
import { PracticeFilter } from '@/types';
import { styles } from './AktivitetStyles';

interface EmptyStateProps {
  filter: PracticeFilter;
}

export default function EmptyState({ filter }: EmptyStateProps) {
  const getMessage = () => {
    if (filter === 'TRENING') return 'Ingen treninger lagt til ennå';
    if (filter === 'KONKURRANSE') return 'Ingen konkurranser lagt til ennå';
    return 'Ingen treninger eller konkurranser ennå';
  };

  return (
    <View style={styles.placeholder}>
      <Text style={styles.placeholderText}>{getMessage()}</Text>
    </View>
  );
}
