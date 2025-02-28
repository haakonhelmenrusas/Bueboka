import { Image, Text, TouchableOpacity, View } from 'react-native';
import { Bow } from '@/types';
import { capitalizeFirstLetter } from '@/utils';
import { FC } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCog } from '@fortawesome/free-solid-svg-icons/faCog';
import { styles } from './BowCardStyles';

interface BowCardProps {
  bow: Bow;
  openFormWithData: () => void;
}

const BowCard: FC<BowCardProps> = ({ bow, openFormWithData }) => {
  const { bowName, bowType, placement, eyeToAim, eyeToNock, arrowWeight, arrowDiameter, interval_sight_real } = bow;
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image source={require('@/assets/bow.png')} style={[styles.image, { tintColor: '#D8F5FF' }]} />
        <Text style={styles.title}>{bowName}</Text>
        <TouchableOpacity onPress={openFormWithData} style={styles.cogIcon}>
          <FontAwesomeIcon icon={faCog} size={24} color="#FFF" />
        </TouchableOpacity>
      </View>
      <View style={styles.body}>
        <View style={styles.column}>
          <View>
            <Text style={styles.head}>Buetype</Text>
            <Text style={styles.text}>{capitalizeFirstLetter(bowType)}</Text>
          </View>
          <View>
            <Text style={styles.head}>Plassering fot</Text>
            <Text style={styles.text}>{placement === 'behind' ? 'Bak linja' : 'Over linja'}</Text>
          </View>
          <View>
            <Text style={styles.head}>Fra øye til nock</Text>
            <Text style={styles.text}>{eyeToNock ? eyeToNock + ' cm' : 'Ingen data'}</Text>
          </View>
          <View>
            <Text style={styles.head}>Målt sikte</Text>
            <Text style={styles.text}>{interval_sight_real ? interval_sight_real + ' cm' : 'Ingen data'}</Text>
          </View>
        </View>
        <View style={styles.column}>
          <View>
            <Text style={styles.head}>Vekt pil</Text>
            <Text style={styles.text}>{arrowWeight ? arrowWeight + ' gram' : 'Ingen data'}</Text>
          </View>
          <View>
            <Text style={styles.head}>Fra øye til sikte</Text>
            <Text style={styles.text}>{eyeToAim ? eyeToAim + ' cm' : 'Ingen data'}</Text>
          </View>
          <View>
            <Text style={styles.head}>Diameter pil</Text>
            <Text style={styles.text}>{arrowDiameter ? arrowDiameter + ' mm' : 'Ingen data'}</Text>
          </View>
        </View>
      </View>
    </View>
  );
};
export default BowCard;
