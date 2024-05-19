import { faMultiply } from '@fortawesome/free-solid-svg-icons/faMultiply';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { Modal, StyleSheet, Text, View } from 'react-native';
import { Button, Input } from '../../../../components/common';
import { CalculatedMarks, MarksResult } from '../../../../types';
import { formatNumber, getLocalStorage, storeLocalStorage } from '../../../../utils';
import useCalculateMarks from '../../../../utils/hooks/useCalculateMarks';
import { useCalcMarksForm } from './useCalcMarksForm';

interface Props {
  modalVisible: boolean;
  closeModal: () => void;
  ballistics: CalculatedMarks | null;
  setCalculatedMarks: (calculatedMarks: MarksResult) => void;
}

const CalculateMarksModal = ({ modalVisible, closeModal, ballistics, setCalculatedMarks }: Props) => {
  const [{ distanceFrom, distanceFromError, distanceTo, distanceToError, interval, intervalError }, dispatch] =
    useCalcMarksForm();
  const { calculateMarks, status } = useCalculateMarks();

  const handleDistanceFromChange = (value: string) => {
    dispatch({ type: 'SET_DISTANCE_FROM', payload: value });
  };

  function handleDistanceToChange(value: string) {
    dispatch({ type: 'SET_DISTANCE_TO', payload: value });
  }

  function handleIntervalChange(value: string) {
    dispatch({ type: 'SET_INTERVAL', payload: value });
  }

  async function calculateMarksFunc(distanceFrom: number, distanceTo: number, interval: number) {
    if (ballistics) {
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
      dispatch({ type: 'SET_DISTANCE_FROM', payload: '' });
      dispatch({ type: 'SET_DISTANCE_TO', payload: '' });
      dispatch({ type: 'SET_INTERVAL', payload: '' });
      closeModal();
    }
  }

  const handleSave = async () => {
    if (!distanceFrom) {
      dispatch({ type: 'SET_DISTANCE_FROM_ERROR', payload: true });
    }
    if (!distanceTo) {
      dispatch({ type: 'SET_DISTANCE_TO_ERROR', payload: true });
    }
    if (!interval) {
      dispatch({ type: 'SET_INTERVAL_ERROR', payload: true });
    }
    await calculateMarksFunc(parseFloat(distanceFrom), parseFloat(distanceTo), parseFloat(interval));
  };

  return (
    <Modal transparent visible={modalVisible} animationType="fade">
      <View style={styles.modal}>
        <View style={styles.header}>
          <Text style={{ fontSize: 16, textAlign: 'center', fontWeight: '500', marginBottom: 1 }}>
            Beregn siktemerker
          </Text>
          <Text onPress={closeModal}>
            <FontAwesomeIcon icon={faMultiply} size={20} />
          </Text>
        </View>
        <View style={styles.inputs}>
          <Input
            textAlign="center"
            maxLength={100}
            label="Fra avstand"
            onBlur={() => dispatch({ type: 'SET_DISTANCE_FROM_ERROR', payload: false })}
            keyboardType="numeric"
            value={distanceFrom}
            error={distanceFromError}
            errorMessage="Verdi mangler"
            onChangeText={(value) => handleDistanceFromChange(formatNumber(value))}
          />
          <Input
            textAlign="center"
            maxLength={100}
            onBlur={() => dispatch({ type: 'SET_DISTANCE_TO_ERROR', payload: false })}
            label="Til avstand"
            keyboardType="numeric"
            value={distanceTo}
            error={distanceToError}
            onChangeText={(value) => handleDistanceToChange(formatNumber(value))}
            errorMessage="Verdi mangler"
          />
          <Input
            textAlign="center"
            maxLength={100}
            label="Intevall"
            onBlur={() => dispatch({ type: 'SET_INTERVAL_ERROR', payload: false })}
            keyboardType="numeric"
            value={interval}
            error={intervalError}
            onChangeText={(value) => handleIntervalChange(formatNumber(value))}
            errorMessage="Verdi mangler"
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
    marginBottom: '15%',
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
