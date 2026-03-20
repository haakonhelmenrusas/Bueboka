import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { faStar as faStarSolid } from '@fortawesome/free-solid-svg-icons/faStar';
import { Bow, Arrows } from '@/types';
import { colors } from '@/styles/colors';

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
              <TouchableOpacity key={bow.id} style={styles.item} onPress={() => onSelectBow?.(bow)}>
                <View style={styles.itemContent}>
                  <Text style={styles.itemName}>{bow.name}</Text>
                  <Text style={styles.itemMeta}>{bow.type}</Text>
                </View>
                {bow.isFavorite && <FontAwesomeIcon icon={faStarSolid} size={16} color="#FFA500" />}
              </TouchableOpacity>
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
              <TouchableOpacity key={arrow.id} style={styles.item} onPress={() => onSelectArrows?.(arrow)}>
                <View style={styles.itemContent}>
                  <Text style={styles.itemName}>{arrow.name}</Text>
                  <Text style={styles.itemMeta}>{arrow.material}</Text>
                </View>
                {arrow.isFavorite && <FontAwesomeIcon icon={faStarSolid} size={16} color="#FFA500" />}
              </TouchableOpacity>
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
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(12, 130, 172, 0.06)',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(12, 130, 172, 0.14)',
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
});
