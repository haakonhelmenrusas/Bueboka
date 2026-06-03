import { View, Text } from 'react-native';
import { Bow, Arrows } from '@/types';
import BowCard from '@/components/home/bowCard/BowCard';
import ArrowCard from '@/components/home/arrowCard/ArrowCard';
import { EquipmentListSkeleton } from '@/components/home/EquipmentSkeleton';
import { useTranslation } from '@/contexts';
import { styles } from './EquipmentSectionStyles';

interface Props {
  bows: Bow[];
  arrows: Arrows[];
  loading?: boolean;
  onSelectBow?: (bow: Bow) => void;
  onSelectArrows?: (arrows: Arrows) => void;
}

export function EquipmentSection({ bows, arrows, loading, onSelectBow, onSelectArrows }: Props) {
  const { t } = useTranslation();
  const isEmpty = bows.length === 0 && arrows.length === 0;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{t['equipment.title']}</Text>
      </View>

      {loading ? (
        <View style={styles.list}>
          <EquipmentListSkeleton count={3} />
        </View>
      ) : isEmpty ? (
        <View style={styles.placeholder}>
          <Text style={styles.placeholderText}>{t['equipment.noEquipment']}</Text>
        </View>
      ) : (
        <View style={styles.list}>
          {bows.map((bow) => (
            <BowCard key={bow.id} bow={bow} onPress={() => onSelectBow?.(bow)} />
          ))}
          {arrows.map((arrow) => (
            <ArrowCard key={arrow.id} arrowSet={arrow} onPress={() => onSelectArrows?.(arrow)} />
          ))}
        </View>
      )}
    </View>
  );
}
