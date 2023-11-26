import { Modal, StyleSheet, Text, View } from 'react-native';
import { Button } from '../../../../components/common';
import { CalculatedMarks } from '../../../../types';
import { storeLocalStorage } from '../../../../utils';

interface Props {
  modalVisible: boolean;
  setBallistics: (ballistics: CalculatedMarks | null) => void;
  closeModal: () => void;
}

const ConfirmRemoveMarks = ({ modalVisible, setBallistics, closeModal }: Props) => {
  function handleRemoveMarks() {
    storeLocalStorage(null, 'ballistics').then(() => {
      setBallistics(null);
      closeModal();
    });
  }

  return (
    <Modal transparent visible={modalVisible} animationType="fade">
      <View style={styles.modal}>
        <Text style={{ fontSize: 18 }}>Bekreft fjerning av siktemerker</Text>
        <View style={styles.buttons}>
          <Button type="outline" label="Avbryt" onPress={closeModal} />
          <Button width={100} label="Ja" onPress={handleRemoveMarks} />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    marginTop: 'auto',
    marginBottom: '40%',
    marginLeft: 'auto',
    marginRight: 'auto',
    height: 160,
    width: '80%',
    justifyContent: 'space-around',
    alignItems: 'center',
    shadowColor: 'black',
    shadowOpacity: 0.25,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 5,
    borderRadius: 8,
    backgroundColor: 'white',
  },
  buttons: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
});

export default ConfirmRemoveMarks;
