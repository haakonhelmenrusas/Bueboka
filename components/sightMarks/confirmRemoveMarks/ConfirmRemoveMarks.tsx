import { Modal, Text, View } from 'react-native';
import { Button } from '@/components/common';
import { styles } from './ConfirmRemoveMarksStyles';

interface Props {
  modalVisible: boolean;
  onConfirm: () => Promise<void> | void;
  closeModal: () => void;
}

const ConfirmRemoveMarks = ({ modalVisible, onConfirm, closeModal }: Props) => {
  async function handleRemoveMarks() {
    await onConfirm();
    closeModal();
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
