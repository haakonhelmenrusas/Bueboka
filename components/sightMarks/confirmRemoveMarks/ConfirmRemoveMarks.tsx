import { Modal, Text, View } from 'react-native';
import { Button } from '@/components/common';
import { useTranslation } from '@/contexts';
import { styles } from './ConfirmRemoveMarksStyles';

interface Props {
  modalVisible: boolean;
  onConfirm: () => Promise<void> | void;
  closeModal: () => void;
}

const ConfirmRemoveMarks = ({ modalVisible, onConfirm, closeModal }: Props) => {
  const { t } = useTranslation();

  async function handleRemoveMarks() {
    await onConfirm();
    closeModal();
  }

  return (
    <Modal onRequestClose={closeModal} transparent visible={modalVisible} animationType="fade">
      <View style={styles.modal}>
        <Text style={{ fontSize: 18 }}>{t['confirmRemove.message']}</Text>
        <View style={styles.buttons}>
          <Button type="outline" label={t['common.cancel']} onPress={closeModal} />
          <Button width={100} label={t['confirmRemove.yes']} onPress={handleRemoveMarks} />
        </View>
      </View>
    </Modal>
  );
};

export default ConfirmRemoveMarks;
