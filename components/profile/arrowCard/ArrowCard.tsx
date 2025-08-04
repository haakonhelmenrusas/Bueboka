import { Image, Text, TouchableOpacity, View } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { ArrowSet } from '@/types';
import { styles } from './ArrowCardStyles';
import { colors } from '@/styles/colors';

interface Props {
  arrowSet: ArrowSet;
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
      <Image
        source={require('@/assets/bow.png')}
        style={styles.image}
        resizeMode="contain"
      />
      <Text style={styles.name}>{arrowSet.name}</Text>
      <Text style={styles.type}>{arrowSet.material}</Text>
    </TouchableOpacity>
  );
}