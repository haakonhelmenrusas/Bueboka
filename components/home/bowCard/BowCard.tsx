import { Text, TouchableOpacity, View } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { Bow } from '@/types';
import { BowTypeIcon } from '@/components/common/icons/ArcheryIcons';
import { styles } from './BowCardStyles';
import { colors } from '@/styles/colors';
import { capitalizeFirstLetter } from '@/utils';

interface Props {
  bow: Bow;
  onPress: () => void;
}

export default function BowCard({ bow, onPress }: Props) {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      {bow.isFavorite && (
        <View style={styles.starContainer}>
          <FontAwesomeIcon icon={faStar} size={16} color={colors.warning} />
        </View>
      )}
      <View style={styles.iconWrap}>
        <BowTypeIcon type={bow.type} size={40} color={colors.primary} />
      </View>
      <View style={styles.textWrap}>
        <Text style={styles.name} numberOfLines={1}>
          {bow.name}
        </Text>
        <Text style={styles.type} numberOfLines={1}>
          {capitalizeFirstLetter(bow.type)}
        </Text>
      </View>
    </TouchableOpacity>
  );
}
