import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { Bow, Arrows } from '@/types';
import { colors } from '@/styles/colors';
import BowCard from '@/components/home/bowCard/BowCard';
import ArrowCard from '@/components/home/arrowCard/ArrowCard';

interface Props {
  bows: Bow[];
  arrows: Arrows[];
  onCreateBow: () => void;
  onCreateArrows: () => void;
  onSelectBow?: (bow: Bow) => void;
  onSelectArrows?: (arrows: Arrows) => void;
}

export function EquipmentSection({ bows, arrows, onCreateBow, onCreateArrows, onSelectBow, onSelectArrows }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <View style={styles.header}>
          <Text style={styles.title}>Buer</Text>
          <TouchableOpacity style={styles.addButton} onPress={onCreateBow}>
            <FontAwesomeIcon icon={faPlus} size={14} color={colors.primary} />
            <Text style={styles.addButtonText}>Legg til</Text>
          </TouchableOpacity>
        </View>
        {bows.length === 0 ? (
          <View style={styles.placeholder}>
            <Text style={styles.placeholderText}>Ingen buer lagt til ennå</Text>
          </View>
        ) : (
          <View style={styles.list}>
            {bows.slice(0, 3).map((bow) => (
              <BowCard key={bow.id} bow={bow} onPress={() => onSelectBow?.(bow)} />
            ))}
          </View>
        )}
      </View>

      <View style={styles.section}>
        <View style={styles.header}>
          <Text style={styles.title}>Piler</Text>
          <TouchableOpacity style={styles.addButton} onPress={onCreateArrows}>
            <FontAwesomeIcon icon={faPlus} size={14} color={colors.primary} />
            <Text style={styles.addButtonText}>Legg til</Text>
          </TouchableOpacity>
        </View>
        {arrows.length === 0 ? (
          <View style={styles.placeholder}>
            <Text style={styles.placeholderText}>Ingen piler lagt til ennå</Text>
          </View>
        ) : (
          <View style={styles.list}>
            {arrows.slice(0, 3).map((arrow) => (
              <ArrowCard key={arrow.id} arrowSet={arrow} onPress={() => onSelectArrows?.(arrow)} />
            ))}
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 24,
  },
  section: {
    marginBottom: 16,
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
});
