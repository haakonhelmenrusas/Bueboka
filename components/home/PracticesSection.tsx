import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faPlus, faBullseye, faTrophy } from '@fortawesome/free-solid-svg-icons';
import { Practice } from '@/types';
import { colors } from '@/styles/colors';
import { format } from 'date-fns';
import { nb } from 'date-fns/locale';

interface Props {
  practices: Practice[];
  loading: boolean;
  onCreate: () => void;
  onCreateCompetition: () => void;
  onSelectPractice: (id: string) => void;
}

export function PracticesSection({ practices, loading, onCreate, onCreateCompetition, onSelectPractice }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Treninger</Text>
        <View style={styles.actions}>
          <TouchableOpacity style={styles.addButton} onPress={onCreate}>
            <FontAwesomeIcon icon={faPlus} size={14} color={colors.primary} />
            <Text style={styles.addButtonText}>Trening</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.addButton} onPress={onCreateCompetition}>
            <FontAwesomeIcon icon={faPlus} size={14} color={colors.primary} />
            <Text style={styles.addButtonText}>Konkurranse</Text>
          </TouchableOpacity>
        </View>
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
  const isCompetition = practice.practiceType === 'KONKURRANSE';
  const dateStr = format(new Date(practice.date), 'dd. MMM', { locale: nb });

  return (
    <TouchableOpacity style={styles.item} onPress={onPress}>
      <View style={styles.itemIcon}>
        <FontAwesomeIcon icon={isCompetition ? faTrophy : faBullseye} size={20} color="rgba(5, 53, 70, 0.9)" />
      </View>
      <View style={styles.itemContent}>
        <Text style={styles.itemName}>{practice.location || 'Ukjent lokasjon'}</Text>
        <Text style={styles.itemMeta}>
          {dateStr} • {practice.arrowsShot} piler
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
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(5, 53, 70, 0.06)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(5, 53, 70, 0.1)',
  },
  addButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
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
  itemIcon: {
    width: 42,
    height: 42,
    borderRadius: 10,
    backgroundColor: 'rgba(12, 130, 172, 0.10)',
    alignItems: 'center',
    justifyContent: 'center',
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
