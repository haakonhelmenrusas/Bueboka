import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { Keyboard, KeyboardAvoidingView, Platform, Text, TouchableOpacity, View } from 'react-native';
import { Button, Input, ModalHeader, ModalWrapper } from '@/components/common';
import { CalculatedMarks, MarksResult } from '@/types';
import { getLocalStorage, handleNumberChange, storeLocalStorage, useCalculateMarks } from '@/utils';
import { useCalcMarksForm } from '@/components/sightMarks/hooks/useCalcMarksForm';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons/faChevronDown';
import { faChevronUp } from '@fortawesome/free-solid-svg-icons/faChevronUp';
import { colors } from '@/styles/colors';
import { styles } from './CalculateMarksModalStyles';

interface CalculateMarksModalProps {
  modalVisible: boolean;
  closeModal: () => void;
  ballistics: CalculatedMarks | null;
  setCalculatedMarks: (calculatedMarks: MarksResult) => void;
}

export const CalculateMarksModal = ({ modalVisible, closeModal, ballistics, setCalculatedMarks }: CalculateMarksModalProps) => {
  const [{ distanceFrom, distanceFromError, distanceTo, distanceToError, interval, intervalError, anglesVisible, angles }, dispatch] =
    useCalcMarksForm();
  const { calculateMarks, status } = useCalculateMarks();

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
    dispatch({ type: 'SET_DISTANCE_FROM_ERROR', payload: false });
    dispatch({ type: 'SET_DISTANCE_TO_ERROR', payload: false });
    dispatch({ type: 'SET_INTERVAL_ERROR', payload: false });
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
        if (marks) {
          setCalculatedMarks(marks);
        }
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

  function handleCloseModal() {
    Keyboard.dismiss();
    clearForm();
    closeModal();
  }

  return (
    <ModalWrapper
      onClose={() => {
        clearForm();
        closeModal();
      }}
      visible={modalVisible}>
      <KeyboardAvoidingView
        keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : undefined}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.modal}>
        <ModalHeader onPress={handleCloseModal} title="Beregn siktemerker" />
        <View style={styles.inputs}>
          <Input
            inputStyle={{ width: 90 }}
            label="Fra avstand"
            placeholder="F.eks. 10"
            onBlur={() => dispatch({ type: 'SET_DISTANCE_FROM_ERROR', payload: false })}
            keyboardType="numeric"
            value={distanceFrom}
            error={distanceFromError}
            errorMessage="Verdi mangler"
            onChangeText={(value) => handleNumberChange(value, 'SET_DISTANCE_FROM', dispatch)}
          />
          <Input
            inputStyle={{ width: 90 }}
            onBlur={() => dispatch({ type: 'SET_DISTANCE_TO_ERROR', payload: false })}
            label="Til avstand"
            placeholder="F.eks. 90"
            keyboardType="numeric"
            value={distanceTo}
            error={distanceToError}
            onChangeText={(value) => handleNumberChange(value, 'SET_DISTANCE_TO', dispatch)}
            errorMessage="Verdi mangler"
          />
          <Input
            inputStyle={{ width: 90 }}
            label="Intevall"
            placeholder="F.eks. 10"
            onBlur={() => dispatch({ type: 'SET_INTERVAL_ERROR', payload: false })}
            keyboardType="numeric"
            value={interval}
            error={intervalError}
            onChangeText={(value) => handleNumberChange(value, 'SET_INTERVAL', dispatch)}
            errorMessage="Verdi mangler"
          />
        </View>
        <TouchableOpacity style={styles.checkBox} onPress={() => dispatch({ type: 'SET_ANGLES_VISIBLE', payload: !anglesVisible })}>
          <FontAwesomeIcon icon={anglesVisible ? faChevronUp : faChevronDown} color={colors.secondary} />
          <Text> Flere vinkler</Text>
        </TouchableOpacity>
        {anglesVisible && (
          <View style={styles.angles}>
            <Input
              textAlign="center"
              inputStyle={{ width: 90 }}
              label="Vinkel"
              placeholder="F.eks. -30"
              keyboardType="numbers-and-punctuation"
              onChange={(event) => handleAngleChange(event.nativeEvent.text, 0)}
            />
            <Input
              textAlign="center"
              inputStyle={{ width: 90 }}
              label="Vinkel"
              placeholder="F.eks. 0"
              keyboardType="numbers-and-punctuation"
              onChange={(event) => handleAngleChange(event.nativeEvent.text, 1)}
            />
            <Input
              textAlign="center"
              inputStyle={{ width: 90 }}
              label="Vinkel"
              placeholder="F.eks. 30"
              keyboardType="numbers-and-punctuation"
              onChange={(event) => handleAngleChange(event.nativeEvent.text, 2)}
            />
          </View>
        )}
        <View style={styles.buttons}>
          <Button loading={status === 'pending'} width="auto" label="Beregn" onPress={handleSave} />
          <Button
            type="outline"
            label="Lukk"
            onPress={() => {
              clearForm();
              closeModal();
            }}
          />
        </View>
      </KeyboardAvoidingView>
    </ModalWrapper>
  );
};
