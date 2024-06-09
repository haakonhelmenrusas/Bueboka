import { faMultiply } from '@fortawesome/free-solid-svg-icons/faMultiply';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { Modal, StyleSheet, Text, View } from 'react-native';
import { Button, Checkbox, Input } from '../../../../components/common';
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
  const [
    { distanceFrom, distanceFromError, distanceTo, distanceToError, interval, intervalError, anglesVisible, angles },
    dispatch,
  ] = useCalcMarksForm();
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

  function handleAngleChange(value: string, index: number) {
    const newAngles = [...angles];
    newAngles[index] = parseFloat(value);
    dispatch({ type: 'SET_ANGLES', payload: newAngles });
  }

  async function calculateMarksFunc(distanceFrom: number, distanceTo: number, interval: number) {
    if (ballistics) {
      const body = {
        ballistics_pars: ballistics.ballistics_pars,
        distances_def: [distanceFrom, interval, distanceTo],
        angles: angles.length > 0 ? angles : [-15, 0, 15],
      };

      const res = await calculateMarks(body);

      await storeLocalStorage(res, 'calculatedMarks').then(async () => {
        const marks = await getLocalStorage<MarksResult>('calculatedMarks');
        setCalculatedMarks(marks);
      });
      dispatch({ type: 'SET_DISTANCE_FROM', payload: '' });
      dispatch({ type: 'SET_DISTANCE_TO', payload: '' });
      dispatch({ type: 'SET_INTERVAL', payload: '' });
      dispatch({ type: 'SET_ANGLES', payload: [] });
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
          <Text style={{ fontSize: 20, fontWeight: '500' }}>Beregn siktemerker</Text>
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
        <View style={styles.checkBox}>
          <Checkbox
            label="Flere vinkler"
            checked={anglesVisible}
            onPress={() => dispatch({ type: 'SET_ANGLES_VISIBLE', payload: !anglesVisible })}
          />
        </View>
        {anglesVisible && (
          <View style={styles.angles}>
            <Input
              textAlign="center"
              maxLength={100}
              label="Vinkel"
              keyboardType="numeric"
              onChange={(event) => handleAngleChange(event.nativeEvent.text, 0)}
            />
            <Input
              textAlign="center"
              maxLength={100}
              label="Vinkel"
              keyboardType="numeric"
              onChange={(event) => handleAngleChange(event.nativeEvent.text, 1)}
            />
            <Input
              textAlign="center"
              maxLength={100}
              label="Vinkel"
              keyboardType="numeric"
              onChange={(event) => handleAngleChange(event.nativeEvent.text, 2)}
            />
          </View>
        )}
        <View style={styles.submit}>
          <Button loading={status === 'pending'} width={200} label="Beregn" onPress={handleSave} />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    margin: 'auto',
    height: 'auto',
    width: '90%',
    display: 'flex',
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
    marginTop: 16,
  },
  checkBox: {
    width: '100%',
    marginTop: 16,
  },
  angles: {
    width: '100%',
    flexDirection: 'row',
    marginBottom: 24,
  },
  button: {
    width: '100%',
  },
  submit: {
    display: 'flex',
    alignItems: 'center',
  },
});

export default CalculateMarksModal;
