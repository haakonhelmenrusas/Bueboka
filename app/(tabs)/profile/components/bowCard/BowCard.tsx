import { FC, useState } from 'react';
import { View, Image, Text, StyleSheet, TouchableNativeFeedback, TouchableOpacity, Modal } from 'react-native';

interface Bow {
  name: string;
  description?: string;
}

const BowCard: FC<Bow> = ({ name, description }) => {
  const [modalVisible, setModalVisible] = useState(false);
  return (
    <TouchableOpacity style={styles.container} onPress={() => setModalVisible(true)}>
      <>
        <Modal
          animationType="slide"
          transparent={false}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
          }}>
          <View style={{ marginTop: 22 }}>
            <View>
              <Text>Hello World!</Text>

              <TouchableOpacity
                onPress={() => {
                  setModalVisible(!modalVisible);
                }}>
                <Text>Hide Modal</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        <View style={styles.imageContainer}>
          <Image source={require('../../../../../assets/bow.png')} style={styles.image} />
          <Text style={styles.title}>{name}</Text>
        </View>
        <View>
          <Text style={styles.text}>{description}</Text>
        </View>
      </>
    </TouchableOpacity>
  );
};
export default BowCard;

const styles = StyleSheet.create({
  container: {
    alignContent: 'center',
    height: 200,
    width: '80%',
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
