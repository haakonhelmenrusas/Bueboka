import { faMultiply } from '@fortawesome/free-solid-svg-icons/faMultiply';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { useState } from 'react';
import { Modal, StyleSheet, Text, View } from 'react-native';
import { Button, Input } from '../../../../components/common';
import { CalculatedMarks, MarksResult } from '../../../../types';
import { formatNumber, getLocalStorage, storeLocalStorage } from '../../../../utils';
import useCalculateMarks from '../../../../utils/hooks/useCalculateMarks';

interface Props {
  modalVisible: boolean;
  closeModal: () => void;
  ballistics: CalculatedMarks | null;
  setCalculatedMarks: (calculatedMarks: MarksResult) => void;
}

const CalculateMarksModal = ({ modalVisible, closeModal, ballistics, setCalculatedMarks }: Props) => {
  const [distanceFrom, setDistanceFrom] = useState<number | undefined>(undefined);
  const [distanceTo, setDistanceTo] = useState<number | undefined>(undefined);
  const [interval, setInterval] = useState<number | undefined>(undefined);
  const { calculateMarks, status } = useCalculateMarks();

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
          angles: [-15, 0, 15],
        };
        const res = await calculateMarks(body);
        await storeLocalStorage(res, 'calculatedMarks').then(async () => {
          const marks = await getLocalStorage<MarksResult>('calculatedMarks');
          setCalculatedMarks(marks);
        });
        setDistanceFrom(undefined);
        setDistanceTo(undefined);
        closeModal();
      } else {
        console.log('Missing values');
      }
    }
  }

  const handleSave = async () => {
    await calculateMarksFunc(distanceFrom, distanceTo, interval);
  };

  return (
    <Modal transparent visible={modalVisible} animationType="fade">
      <View style={styles.modal}>
        <View style={styles.header}>
          <Text style={{ fontSize: 16, fontWeight: '400', marginBottom: 16 }}>Beregn siktemerker</Text>
          <Text onPress={closeModal}>
            <FontAwesomeIcon icon={faMultiply} size={20} />
          </Text>
        </View>
        <View style={styles.inputs}>
          <Input
            textAlign="center"
            maxLength={100}
            label="Fra avstand"
            keyboardType="numeric"
            value={distanceFrom && distanceFrom.toString()}
            onChangeText={(value) => handleDistanceFromChange(formatNumber(value))}
          />
          <Input
            textAlign="center"
            maxLength={100}
            label="Til avstand"
            keyboardType="numeric"
            value={distanceTo && distanceTo.toString()}
            onChangeText={(value) => handleDistanceToChange(formatNumber(value))}
          />
          <Input
            textAlign="center"
            maxLength={100}
            label="Intevall"
            keyboardType="numeric"
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
    height: 264,
    width: '90%',
    justifyContent: 'space-around',
    alignItems: 'center',
    shadowColor: 'black',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 5,
    padding: 12,
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
