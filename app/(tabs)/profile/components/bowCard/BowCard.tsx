import { View, Image, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Bow } from '@/types';
import { capitalizeFirstLetter } from '@/utils';
import { FC } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCog } from '@fortawesome/free-solid-svg-icons/faCog';

interface BowCardProps {
  bow: Bow;
  openFormWithData: () => void;
}

const BowCard: FC<BowCardProps> = ({ bow, openFormWithData }) => {
  const { bowName, bowType, placement, eyeToAim, eyeToNock, arrowWeight, arrowDiameter } = bow;
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
            <Text style={styles.text}>{eyeToNock ? eyeToNock + 'cm' : 'Ingen data'}</Text>
          </View>
        </View>
        <View style={styles.column}>
          <View>
            <Text style={styles.head}>Vekt pil</Text>
            <Text style={styles.text}>{arrowWeight ? arrowWeight + 'gram' : 'Ingen data'}</Text>
          </View>
          <View>
            <Text style={styles.head}>Fra øye til sikte</Text>
            <Text style={styles.text}>{eyeToAim ? eyeToAim + 'cm' : 'Ingen data'}</Text>
          </View>
          <View>
            <Text style={styles.head}>Diameter pil</Text>
            <Text style={styles.text}>{arrowDiameter ? arrowDiameter + 'mm' : 'Ingen data'}</Text>
          </View>
        </View>
      </View>
    </View>
  );
};
export default BowCard;

const styles = StyleSheet.create({
  container: {
    alignContent: 'center',
    width: '100%',
    marginHorizontal: 'auto',
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#053546',
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    padding: 12,
    alignItems: 'center',
    borderTopEndRadius: 10,
    borderTopStartRadius: 10,
    backgroundColor: '#053546',
  },
  image: {
    width: 28,
    height: 28,
    resizeMode: 'contain',
    marginRight: 16,
  },
  title: {
    fontSize: 24,
    color: '#D8F5FF',
    fontWeight: 'medium',
  },
  cogIcon: {
    marginLeft: 'auto',
    padding: 8,
  },
  body: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
  },
  column: {
    flex: 1,
    marginHorizontal: 8,
  },
  head: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  text: {
    fontSize: 14,
    marginBottom: 16,
  },
});
