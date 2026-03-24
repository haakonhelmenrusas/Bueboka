import { View, Text, ActivityIndicator } from 'react-native';
import { Practice } from '@/types';
import { colors } from '@/styles/colors';
import PracticeCard from '@/components/practice/practiceCard/PracticeCard';
import { styles } from './PracticesSectionStyles';

interface Props {
  practices: Practice[];
  loading: boolean;
  onSelectPractice: (id: string) => void;
}

export function PracticesSection({ practices, loading, onSelectPractice }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Treninger og konkurranser</Text>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : practices.length === 0 ? (
        <View style={styles.placeholder}>
          <Text style={styles.placeholderText}>Ingen treninger lagt til ennå</Text>
        </View>
      ) : (
        <View style={styles.list}>
          {practices.slice(0, 5).map((practice) => (
            <PracticeCard key={practice.id} practice={practice} onEdit={(p) => onSelectPractice(p.id)} />
          ))}
        </View>
      )}
    </View>
  );
}
