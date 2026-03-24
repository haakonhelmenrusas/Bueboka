import { View, Text } from 'react-native';
import { Bow, Arrows } from '@/types';
import BowCard from '@/components/home/bowCard/BowCard';
import ArrowCard from '@/components/home/arrowCard/ArrowCard';
import { styles } from './EquipmentSectionStyles';

interface Props {
  bows: Bow[];
  arrows: Arrows[];
  onSelectBow?: (bow: Bow) => void;
  onSelectArrows?: (arrows: Arrows) => void;
}

export function EquipmentSection({ bows, arrows, onSelectBow, onSelectArrows }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <View style={styles.header}>
          <Text style={styles.title}>Buer</Text>
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
