import { faMultiply } from '@fortawesome/free-solid-svg-icons/faMultiply';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { useState } from 'react';
import { Modal, StyleSheet, Text, View } from 'react-native';
import { Button, Input } from '../../../../components/common';
import { CalculatedMarks } from '../../../../types';
import { formatNumber } from '../../../../utils';
import useCalculateMarks from '../../../../utils/hooks/useCalculateMarks';

interface Props {
  modalVisible: boolean;
  closeModal: () => void;
  ballistics: CalculatedMarks | null;
}

const CalculateMarksModal = ({ modalVisible, closeModal, ballistics }: Props) => {
  const [distanceFrom, setDistanceFrom] = useState<number | undefined>(undefined);
  const [distanceTo, setDistanceTo] = useState<number | undefined>(undefined);
  const [interval, setInterval] = useState<number | undefined>(undefined);
  const [nameError, setNameError] = useState('');
  const { calculateMarks, status, error } = useCalculateMarks();

  const handleDistanceFromChange = (value: string) => {
    setDistanceFrom(parseFloat(value));
  };

  function handleDistanceToChange(value: string) {
    setDistanceTo(parseFloat(value));
  }

  function handleIntervalChange(value: string) {
    setInterval(parseFloat(value));
  }

  async function calculateMarksFunc(distanceFrom: number, distanceTo: number, interval: number) {
    if (ballistics) {
      if (distanceFrom && interval && distanceTo) {
        const body = {
          ballistics_pars: ballistics.ballistics_pars,
          distances_def: [distanceFrom, interval, distanceTo],
          angles: [0, 15],
        };
        const res = await calculateMarks(body);
        console.log(res);
        closeModal();
      } else {
        setNameError('Fyll ut alle feltene');
      }
      setDistanceFrom(undefined);
      setDistanceTo(undefined);
      setNameError('');
      closeModal();
    }
  }

  const handleSave = async () => {
    await calculateMarksFunc(distanceFrom, distanceTo, interval);
  };

  return (
    <Modal transparent visible={modalVisible} animationType="fade">
      <View style={styles.modal}>
        <View style={styles.header}>
          <Text style={{ fontSize: 18, fontWeight: '500', marginBottom: 20 }}>Beregn siktemerker</Text>
          <Text onPress={closeModal}>
            <FontAwesomeIcon icon={faMultiply} size={24} />
          </Text>
        </View>
        <View style={styles.inputs}>
          <Input
            textAlign="center"
            maxLength={100}
            label="Fra avstand"
            keyboardType="numeric"
            error={nameError.length > 0}
            value={distanceFrom && distanceFrom.toString()}
            onChangeText={(value) => handleDistanceFromChange(formatNumber(value))}
          />
          <Input
            textAlign="center"
            maxLength={100}
            label="Til avstand"
            keyboardType="numeric"
            error={nameError.length > 0}
            value={distanceTo && distanceTo.toString()}
            onChangeText={(value) => handleDistanceToChange(formatNumber(value))}
          />
          <Input
            textAlign="center"
            maxLength={100}
            label="Intevall"
            keyboardType="numeric"
            error={nameError.length > 0}
            value={interval && interval.toString()}
            onChangeText={(value) => handleIntervalChange(formatNumber(value))}
          />
        </View>
        <Button loading={status === 'pending'} width={200} label="Beregn" onPress={handleSave} />
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
    height: 280,
    width: '90%',
    justifyContent: 'space-around',
    alignItems: 'center',
    shadowColor: 'black',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 5,
    padding: 16,
    borderRadius: 4,
    backgroundColor: 'white',
  },
  header: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  inputs: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    width: '100%',
  },
});

export default CalculateMarksModal;
