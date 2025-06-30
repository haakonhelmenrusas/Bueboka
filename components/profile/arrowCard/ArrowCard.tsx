import { Image, Text, TouchableOpacity, View } from 'react-native';
import { ArrowSet } from '@/types';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCog } from '@fortawesome/free-solid-svg-icons/faCog';
import { styles } from './ArrowCardStyles';
import { colors } from '@/styles/colors';

interface Props {
  arrowSet: ArrowSet;
  openFormWithData: () => void;
}

export default function ArrowCard({ arrowSet, openFormWithData }: Props) {
  const { name, spine, weight, length, material, diameter } = arrowSet;
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image source={require('@/assets/bow.png')} style={[styles.image, { tintColor: colors.tertiary }]} />
        <Text style={styles.title}>{name}</Text>
        <TouchableOpacity onPress={openFormWithData} style={styles.cogIcon}>
          <FontAwesomeIcon icon={faCog} size={16} color={colors.white} />
        </TouchableOpacity>
      </View>
      <View style={styles.body}>
        <View style={styles.column}>
          <View>
            <Text style={styles.head}>Spine</Text>
            <Text style={styles.text}>{spine ? spine : 'Ingen data'}</Text>
          </View>
          <View>
            <Text style={styles.head}>Vekt</Text>
            <Text style={styles.text}>{weight ? weight : 'Ingen data'}</Text>
          </View>
          <View>
            <Text style={styles.head}>Diameter</Text>
            <Text style={styles.text}>{diameter ? diameter + ' mm' : 'Ingen data'}</Text>
          </View>
        </View>
        <View style={styles.column}>
          <View>
            <Text style={styles.head}>Material</Text>
            <Text style={styles.text}>{material}</Text>
          </View>
          <View>
            <Text style={styles.head}>Lengde</Text>
            <Text style={styles.text}>{length ? length + ' cm' : 'Ingen data'}</Text>
          </View>
        </View>
      </View>
    </View>
  );
};
