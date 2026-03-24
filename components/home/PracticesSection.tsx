import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { Practice } from '@/types';
import { colors } from '@/styles/colors';
import { format } from 'date-fns';
import { nb } from 'date-fns/locale';

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
            <PracticeItem key={practice.id} practice={practice} onPress={() => onSelectPractice(practice.id)} />
          ))}
        </View>
      )}
    </View>
  );
}

interface PracticeItemProps {
  practice: Practice;
  onPress: () => void;
}

function PracticeItem({ practice, onPress }: PracticeItemProps) {
  const dateStr = format(new Date(practice.date), 'dd. MMM', { locale: nb });

  const ends = practice.ends ?? [];
  const scoredArrows = ends.reduce((sum, end) => sum + (end.arrows ?? 0), 0);
  const totalArrows = scoredArrows + ends.reduce((sum, end) => sum + (end.arrowsWithoutScore ?? 0), 0);

  const meta =
    practice.totalScore > 0 && scoredArrows > 0 ? `${practice.totalScore} poeng / ${scoredArrows} piler` : `${totalArrows} piler`;

  return (
    <TouchableOpacity style={styles.item} onPress={onPress}>
      <View style={styles.itemContent}>
        <Text style={styles.itemName}>{practice.location || 'Ukjent lokasjon'}</Text>
        <Text style={styles.itemMeta}>
          {dateStr} • {meta}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.text,
  },
  list: {
    gap: 8,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(12, 130, 172, 0.06)',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(12, 130, 172, 0.14)',
    gap: 12,
  },
  itemContent: {
    flex: 1,
    gap: 4,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  itemMeta: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  placeholder: {
    backgroundColor: 'rgba(12, 130, 172, 0.05)',
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: 'rgba(12, 130, 172, 0.26)',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  loadingContainer: {
    padding: 40,
    alignItems: 'center',
  },
});
