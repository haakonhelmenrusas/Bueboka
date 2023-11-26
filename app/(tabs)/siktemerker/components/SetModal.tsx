import { useState } from 'react';
import { Modal, View } from 'react-native';
import { Button, Input } from '../../../../components/common';
import { CalculatedMarks, MarkSet } from '../../../../types';
import { getLocalStorage, storeLocalStorage } from '../../../../utils';

interface Props {
  modalVisible: boolean;
  closeModal: () => void;
  setBallistics: (ballistics: CalculatedMarks | null) => void;
  ballistics: CalculatedMarks | null;
}

const SetModal = ({ modalVisible, closeModal, setBallistics, ballistics }: Props) => {
  const [name, setName] = useState('');
  const [nameError, setNameError] = useState('');

  async function storeMarksWithName(name: string) {
    if (ballistics) {
      const setList = await getLocalStorage<Array<MarkSet>>('marksSets');

      const marksSet = {
        name: name,
        marks: ballistics.given_marks,
        distances: ballistics.given_distances,
      };

      if (setList) {
        const nameExists = setList.some((set) => set.name === name);
        if (nameExists) {
          setNameError('Name is already taken');
        } else {
          setList.push(marksSet);
          storeLocalStorage(setList, 'marksSets');
          setBallistics(null);
          setNameError('');
          setName('');
          closeModal();
        }
      } else {
        const marksSets = Array<MarkSet>();
        marksSets.push(marksSet);
        storeLocalStorage(marksSets, 'marksSets');
        setBallistics(null);
        setName('');
        setNameError('');
        closeModal();
      }
    }
  }

  const handleSave = async () => {
    await storeMarksWithName(name);
  };

  return (
    <Modal visible={modalVisible} animationType="fade">
      <View style={{ flex: 1, margin: 32, justifyContent: 'center', alignItems: 'center' }}>
        <Input
          label="Sett navn på settet"
          error={nameError.length > 0}
          errorMessage={nameError}
          onChangeText={setName}
          value={name}
        />
        <View style={{ flexDirection: 'row', marginTop: 24, justifyContent: 'space-between' }}>
          <Button type="outline" label="Avbryt" onPress={closeModal} />
          <Button label="Lagre sett" onPress={handleSave} />
        </View>
      </View>
    </Modal>
  );
};

export default SetModal;
