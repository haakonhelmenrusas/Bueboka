import { Keyboard, KeyboardAvoidingView, Platform, View } from 'react-native';
import { Button, Input, ModalHeader, ModalWrapper } from '@/components/common';
import { CalculatedMarks, MarksResult } from '@/types';
import { getLocalStorage, handleNumberChange, storeLocalStorage, useCalculateMarks } from '@/utils';
import { useCalcMarksForm } from '@/components/sightMarks/hooks/useCalcMarksForm';
import { styles } from './CalculateMarksModalStyles';

interface CalculateMarksModalProps {
  modalVisible: boolean;
  closeModal: () => void;
  ballistics: CalculatedMarks | null;
  setCalculatedMarks: (calculatedMarks: MarksResult) => void;
}

export const CalculateMarksModal = ({ modalVisible, closeModal, ballistics, setCalculatedMarks }: CalculateMarksModalProps) => {
  const [{ distanceFrom, distanceFromError, distanceTo, distanceToError, interval, intervalError, angles }, dispatch] = useCalcMarksForm();
  const { calculateMarks, status } = useCalculateMarks();

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
        angles: angles.length > 0 ? angles : [0],
      };

      const res = await calculateMarks(body);

      await storeLocalStorage(res, 'calculatedMarks').then(async () => {
        const marks = await getLocalStorage<MarksResult>('calculatedMarks');
        if (marks) {
          setCalculatedMarks(marks);
        }
      });
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
    closeModal();
  }

  return (
    <ModalWrapper
      onClose={() => {
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
            keyboardType="numeric"
            value={distanceTo}
            error={distanceToError}
            onChangeText={(value) => handleNumberChange(value, 'SET_DISTANCE_TO', dispatch)}
            errorMessage="Verdi mangler"
          />
          <Input
            inputStyle={{ width: 90 }}
            label="Intevall"
            onBlur={() => dispatch({ type: 'SET_INTERVAL_ERROR', payload: false })}
            keyboardType="numeric"
            value={interval}
            error={intervalError}
            onChangeText={(value) => handleNumberChange(value, 'SET_INTERVAL', dispatch)}
            errorMessage="Verdi mangler"
          />
        </View>
        <View style={styles.angles}>
          <Input
            textAlign="center"
            inputStyle={{ width: 90 }}
            label="Vinkel"
            keyboardType="numbers-and-punctuation"
            value={angles[0]?.toString() || ''}
            onChange={(event) => handleAngleChange(event.nativeEvent.text, 0)}
          />
          <Input
            textAlign="center"
            inputStyle={{ width: 90 }}
            label="Vinkel"
            keyboardType="numbers-and-punctuation"
            value={angles[1]?.toString() || ''}
            onChange={(event) => handleAngleChange(event.nativeEvent.text, 1)}
          />
          <Input
            textAlign="center"
            inputStyle={{ width: 90 }}
            label="Vinkel"
            keyboardType="numbers-and-punctuation"
            value={angles[2]?.toString() || ''}
            onChange={(event) => handleAngleChange(event.nativeEvent.text, 2)}
          />
        </View>
        <View style={styles.buttons}>
          <Button loading={status === 'pending'} width="auto" label="Beregn" onPress={handleSave} />
          <Button
            type="outline"
            label="Lukk"
            onPress={() => {
              closeModal();
            }}
          />
        </View>
      </KeyboardAvoidingView>
    </ModalWrapper>
  );
};
