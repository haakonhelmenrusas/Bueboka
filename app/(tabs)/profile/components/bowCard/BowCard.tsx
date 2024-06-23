import { FC } from 'react';
import { View, Image, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';

interface Bow {
  name: string;
  description?: string;
  onPress?: () => void;
}

const BowCard: FC<Bow> = ({ name, description, onPress }) => {
  return (
    <TouchableOpacity style={styles.container} onPress={() => onPress}>
      <View style={styles.imageContainer}>
        <Image source={require('../../../../../assets/bow.png')} style={styles.image} />
        <Text style={styles.title}>{name}</Text>
      </View>
      <View>
        <Text style={styles.text}>{description}</Text>
      </View>
    </TouchableOpacity>
  );
};
export default BowCard;

const styles = StyleSheet.create({
  container: {
    alignContent: 'center',
    height: 200,
    width: '100%',
    marginHorizontal: 'auto',
    shadowColor: '#000',
    backgroundColor: '#fff',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3,
    elevation: 5,
    borderRadius: 12,
    padding: 16,
  },
  imageContainer: {
    display: 'flex',
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'flex-end',
  },
  image: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
    marginRight: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'medium',
  },
  text: {
    fontSize: 16,
    marginBottom: 16,
  },
});
