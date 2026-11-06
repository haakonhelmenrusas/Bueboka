import { Text, TouchableOpacity, View } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { Arrows } from '@/types';
import { ArrowIcon } from '@/components/common/icons/ArcheryIcons';
import { styles } from './ArrowCardStyles';
import { colors } from '@/styles/colors';

interface Props {
  arrowSet: Arrows;
  onPress: () => void;
}

export default function ArrowCard({ arrowSet, onPress }: Props) {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      {arrowSet.isFavorite && (
        <View style={styles.starContainer}>
          <FontAwesomeIcon icon={faStar} size={16} color={colors.warning} />
        </View>
      )}
      <View style={styles.iconWrap}>
        <ArrowIcon size={40} color={colors.primary} />
      </View>
      <View style={styles.textWrap}>
        <Text style={styles.name} numberOfLines={1}>
          {arrowSet.name}
        </Text>
        <Text style={styles.type} numberOfLines={1}>
          {arrowSet.material}
        </Text>
      </View>
    </TouchableOpacity>
  );
}
