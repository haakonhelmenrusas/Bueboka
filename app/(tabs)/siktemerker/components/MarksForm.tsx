import React, { FC } from 'react';
import { Keyboard, StyleSheet, View } from 'react-native';

import { Button, Input } from '@/components/common';
import { MarkValue } from '@/types';
import { formatNumber } from '@/utils';
import { useCalcForm } from './useCalcForm';
import { faRulerHorizontal } from '@fortawesome/free-solid-svg-icons/faRulerHorizontal';
import { faCrosshairs } from '@fortawesome/free-solid-svg-icons/faCrosshairs';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';

interface MarksFormProps {
  status: string;
  sendMarks: (newMark: MarkValue) => Promise<void>;
  onInputFocusChange: React.Dispatch<React.SetStateAction<boolean>>;
}

const MarksForm: FC<MarksFormProps> = ({ sendMarks, status, onInputFocusChange }) => {
  const [{ aimError, aimValue, distanceError, distanceValue }, dispatch] = useCalcForm();

  function handleDistanceChange(value: string) {
    dispatch({ type: 'SET_DISTANCE_VALUE', payload: value });
  }

  function handleAimChange(value: string) {
    dispatch({ type: 'SET_AIM_VALUE', payload: value });
  }

  async function handleAddMark() {
    if (!aimValue) {
      dispatch({ type: 'SET_AIM_ERROR', payload: true });
    }
    if (!distanceValue) {
      dispatch({ type: 'SET_DISTANCE_ERROR', payload: true });
    }
    if (aimValue && distanceValue) {
      const newEntry: MarkValue = { aim: parseFloat(aimValue), distance: parseFloat(distanceValue) };

      await sendMarks(newEntry);
      dispatch({ type: 'SET_AIM_VALUE', payload: '' });
      dispatch({ type: 'SET_DISTANCE_VALUE', payload: '' });
      Keyboard.dismiss();
    }
  }

  return (
    <View style={styles.form}>
      <View style={styles.inputs}>
        <Input
          textAlign="center"
          label="Avstand"
          onBlur={() => {
            dispatch({ type: 'SET_DISTANCE_ERROR', payload: false });
            onInputFocusChange(false);
          }}
          onFocus={() => onInputFocusChange(true)}
          placeholderText="F.eks. 20"
          maxLength={5}
          keyboardType="numeric"
          error={distanceError}
          errorMessage="Fyll inn"
          value={distanceValue}
          onChangeText={(value) => handleDistanceChange(formatNumber(value))}
          icon={<FontAwesomeIcon icon={faRulerHorizontal} color="#227B9A" />}
          inputStyle={{ width: 160 }}
        />
        <Input
          textAlign="center"
          label="Merke"
          onBlur={() => {
            dispatch({ type: 'SET_AIM_ERROR', payload: false });
            onInputFocusChange(false);
          }}
          onFocus={() => onInputFocusChange(true)}
          placeholderText="F.eks. 2.3"
          maxLength={5}
          keyboardType="numeric"
          value={aimValue}
          error={aimError}
          errorMessage="Fyll inn"
          onChangeText={(value) => handleAimChange(formatNumber(value))}
          icon={<FontAwesomeIcon icon={faCrosshairs} color="#227B9A" />}
          inputStyle={{ width: 160 }}
        />
      </View>
      <Button
        disabled={aimValue === '' || distanceValue === ''}
        loading={status === 'pending'}
        buttonStyle={styles.button}
        onPress={handleAddMark}
        label="Beregn"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  form: {
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#FFF',
    padding: 24,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  inputs: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  button: {
    marginTop: 24,
  },
});

export default MarksForm;
