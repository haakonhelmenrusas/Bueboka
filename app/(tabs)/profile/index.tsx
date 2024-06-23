import { StyleSheet, Text, Image, View, Modal, TouchableOpacity } from 'react-native';
import BowCard from './components/bowCard/BowCard';
import { useState } from 'react';
import { Button } from '../../../components/common';

export default function Profile() {
  const [modalVisible, setModalVisible] = useState(false);

  function handleModal() {
    setModalVisible(!modalVisible);
  }

  return (
    <View style={styles.container}>
      <BowCard name="Bue" description="Un arco muy bonito" onPress={handleModal} />
      <Modal
        animationType="slide"
        transparent={false}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}>
        <View style={{ margin: 24 }}>
          <View>
            <Text style={styles.title}>Din bue</Text>

            <TouchableOpacity
              onPress={() => {
                setModalVisible(!modalVisible);
              }}>
              <Button label="Hide modal" />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: 'medium',
  },
});
