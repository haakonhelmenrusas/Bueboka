import { faMultiply } from '@fortawesome/free-solid-svg-icons/faMultiply';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { Keyboard, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Button, Input } from '@/components/common';
import { CalculatedMarks, MarksResult } from '@/types';
import { useCalculateMarks, formatNumber, getLocalStorage, storeLocalStorage } from '@/utils';
import { useCalcMarksForm } from './useCalcMarksForm';
import { faRulerHorizontal } from '@fortawesome/free-solid-svg-icons/faRulerHorizontal';
import { faCrosshairs } from '@fortawesome/free-solid-svg-icons/faCrosshairs';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons/faChevronDown';
import { faChevronUp } from '@fortawesome/free-solid-svg-icons/faChevronUp';

interface CalculateMarksModalProps {
  modalVisible: boolean;
  closeModal: () => void;
  ballistics: CalculatedMarks | null;
  setCalculatedMarks: (calculatedMarks: MarksResult) => void;
}

const CalculateMarksModal = ({
  modalVisible,
  closeModal,
  ballistics,
  setCalculatedMarks,
}: CalculateMarksModalProps) => {
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

  function clearForm() {
    dispatch({ type: 'SET_DISTANCE_FROM', payload: '' });
    dispatch({ type: 'SET_DISTANCE_TO', payload: '' });
    dispatch({ type: 'SET_INTERVAL', payload: '' });
    dispatch({ type: 'SET_ANGLES', payload: [] });
  }

  async function calculateMarksFunc(distanceFrom: number, distanceTo: number, interval: number) {
    if (ballistics) {
      const body = {
        ballistics_pars: ballistics.ballistics_pars,
        distances_def: [distanceFrom, interval, distanceTo],
        angles: angles.length > 0 ? angles : [0],
      };

      const res = await calculateMarks(body);

      await storeLocalStorage(res, 'calculatedMarks').then(async () => {
        const marks = await getLocalStorage<MarksResult>('calculatedMarks');
        setCalculatedMarks(marks);
      });
      clearForm();
      Keyboard.dismiss();
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
    if (distanceFrom && distanceTo && interval) {
      await calculateMarksFunc(parseFloat(distanceFrom), parseFloat(distanceTo), parseFloat(interval));
    }
  };

  return (
    <Modal onRequestClose={closeModal} visible={modalVisible} animationType="slide">
      <View style={styles.modal}>
        <View style={styles.header}>
          <Text style={{ fontSize: 20, fontWeight: '500' }}>Beregn siktemerker</Text>
          <TouchableOpacity
            style={{ padding: 16, margin: -8 }}
            onPress={() => {
              Keyboard.dismiss();
              clearForm();
              closeModal();
            }}>
            <Text>
              <FontAwesomeIcon icon={faMultiply} size={20} />
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.inputs}>
          <Input
            inputStyle={{ width: 100 }}
            labelStyle={{ textAlign: 'center' }}
            label="Fra avstand"
            onBlur={() => dispatch({ type: 'SET_DISTANCE_FROM_ERROR', payload: false })}
            keyboardType="numeric"
            maxLength={5}
            value={distanceFrom}
            error={distanceFromError}
            errorMessage="Verdi mangler"
            onChangeText={(value) => handleDistanceFromChange(formatNumber(value))}
            icon={<FontAwesomeIcon icon={faRulerHorizontal} color="#227B9A" />}
          />
          <Input
            inputStyle={{ width: 100 }}
            labelStyle={{ textAlign: 'center' }}
            onBlur={() => dispatch({ type: 'SET_DISTANCE_TO_ERROR', payload: false })}
            label="Til avstand"
            keyboardType="numeric"
            maxLength={6}
            value={distanceTo}
            error={distanceToError}
            onChangeText={(value) => handleDistanceToChange(formatNumber(value))}
            errorMessage="Verdi mangler"
            icon={<FontAwesomeIcon icon={faRulerHorizontal} color="#227B9A" />}
          />
          <Input
            inputStyle={{ width: 100 }}
            labelStyle={{ textAlign: 'center' }}
            label="Intevall"
            onBlur={() => dispatch({ type: 'SET_INTERVAL_ERROR', payload: false })}
            keyboardType="numeric"
            maxLength={5}
            value={interval}
            error={intervalError}
            onChangeText={(value) => handleIntervalChange(formatNumber(value))}
            errorMessage="Verdi mangler"
            icon={<FontAwesomeIcon icon={faCrosshairs} color="#227B9A" />}
          />
        </View>
        <TouchableOpacity
          style={styles.checkBox}
          onPress={() => dispatch({ type: 'SET_ANGLES_VISIBLE', payload: !anglesVisible })}>
          <FontAwesomeIcon icon={anglesVisible ? faChevronUp : faChevronDown} color="#227B9A" />
          <Text> Flere vinkler</Text>
        </TouchableOpacity>
        {anglesVisible && (
          <View style={styles.angles}>
            <Input
              textAlign="center"
              inputStyle={{ width: 80 }}
              labelStyle={{ textAlign: 'center' }}
              label="Vinkel"
              keyboardType="numbers-and-punctuation"
              onChange={(event) => handleAngleChange(event.nativeEvent.text, 0)}
            />
            <Input
              textAlign="center"
              inputStyle={{ width: 80 }}
              labelStyle={{ textAlign: 'center' }}
              label="Vinkel"
              keyboardType="numbers-and-punctuation"
              onChange={(event) => handleAngleChange(event.nativeEvent.text, 1)}
            />
            <Input
              textAlign="center"
              inputStyle={{ width: 80 }}
              labelStyle={{ textAlign: 'center' }}
              label="Vinkel"
              keyboardType="numbers-and-punctuation"
              onChange={(event) => handleAngleChange(event.nativeEvent.text, 2)}
            />
          </View>
        )}
        <View style={styles.bottons}>
          <Button loading={status === 'pending'} width="auto" label="Beregn" onPress={handleSave} />
          <Button
            type="outline"
            width="auto"
            label="Lukk"
            onPress={() => {
              clearForm();
              closeModal();
            }}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    display: 'flex',
    flex: 1,
    alignItems: 'center',
    padding: 24,
    marginTop: 64,
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
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginTop: 32,
  },
  angles: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
    marginTop: 16,
  },
  bottons: {
    width: '100%',
    flexDirection: 'column',
    marginTop: 32,
    gap: 16,
  },
});

export default CalculateMarksModal;
