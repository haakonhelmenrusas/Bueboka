import { Text, TouchableOpacity, View } from 'react-native';
import { ArrowSet } from '@/types';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCog } from '@fortawesome/free-solid-svg-icons/faCog';
import { styles } from './ArrowCardStyles';
import { colors } from '@/styles/colors';
import { faStar } from '@fortawesome/free-solid-svg-icons';

interface Props {
  arrowSet: ArrowSet;
  onEdit: () => void;
}

export default function ArrowCard({ arrowSet, onEdit }: Props) {
  const { name, spine, weight, length, material, diameter, numberOfArrows, isFavorite } = arrowSet;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        {isFavorite && <FontAwesomeIcon testID="favorite-icon" style={{ marginRight: 4 }} icon={faStar} size={18} color={colors.warning} />}
        <Text style={styles.title}>{name}</Text>
        <TouchableOpacity onPress={onEdit} style={styles.cogIcon}>
          <FontAwesomeIcon icon={faCog} size={16} color={colors.white} />
        </TouchableOpacity>
      </View>
      <View style={styles.body}>
        <View>
          <View>
            <Text style={styles.head}>Spine</Text>
            <Text style={styles.text}>{spine ? spine : 'Ingen data'}</Text>
          </View>
          <View>
            <Text style={styles.head}>Vekt</Text>
            <Text style={styles.text}>{weight ? weight + ' gram' : 'Ingen data'}</Text>
          </View>
        </View>
        <View>
          <View>
            <Text style={styles.head}>Diameter</Text>
            <Text style={styles.text}>{diameter ? diameter + ' mm' : 'Ingen data'}</Text>
          </View>
          <View>
            <Text style={styles.head}>Material</Text>
            <Text style={styles.text}>{material}</Text>
          </View>
        </View>
        <View>
          <View>
            <Text style={styles.head}>Lengde</Text>
            <Text style={styles.text}>{length ? length + ' cm' : 'Ingen data'}</Text>
          </View>
          <View>
            <Text style={styles.head}>Antall piler</Text>
            <Text style={styles.text}>{numberOfArrows ? numberOfArrows : 'Ingen data'}</Text>
          </View>
        </View>
      </View>
    </View>
  );
};
