import { Modal, Text, View } from 'react-native';
import { Button } from '@/components/common';
import { CalculatedMarks } from '@/types';
import { storeLocalStorage } from '@/utils';
import { styles } from './ConfirmRemoveMarksStyles';

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
    <Modal onRequestClose={closeModal} transparent visible={modalVisible} animationType="fade">
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

export default ConfirmRemoveMarks;
