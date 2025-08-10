import { Image, Text, TouchableOpacity, View } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { Bow } from '@/types';
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
      <Image source={require('@/assets/bow.png')} style={styles.image} resizeMode="contain" />
      <Text style={styles.name}>{bow.bowName}</Text>
      <Text style={styles.type}>{capitalizeFirstLetter(bow.bowType)}</Text>
    </TouchableOpacity>
  );
}
