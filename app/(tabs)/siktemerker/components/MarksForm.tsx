import React, { FC } from 'react';
import { Keyboard, StyleSheet, View } from 'react-native';

import { Button, Input } from '../../../../components/common';
import { MarkValue } from '../../../../types';
import { formatNumber } from '../../../../utils';
import { useCalcForm } from './useCalcForm';

interface MarksFormProps {
  status: string;
  sendMarks: (newMark: MarkValue) => Promise<void>;
}

const MarksForm: FC<MarksFormProps> = ({ sendMarks, status }) => {
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
          maxLength={100}
          label="Avstand"
          onBlur={() => dispatch({ type: 'SET_DISTANCE_ERROR', payload: false })}
          placeholderText="F.eks. 20"
          keyboardType="numeric"
          error={distanceError}
          errorMessage="Fyll inn"
          value={distanceValue}
          onChangeText={(value) => handleDistanceChange(formatNumber(value))}
        />
        <Input
          textAlign="center"
          maxLength={15}
          label="Merke"
          onBlur={() => dispatch({ type: 'SET_AIM_ERROR', payload: false })}
          placeholderText="F.eks. 2.3"
          keyboardType="numeric"
          value={aimValue}
          error={aimError}
          errorMessage="Fyll inn"
          onChangeText={(value) => handleAimChange(formatNumber(value))}
        />
      </View>
      <Button
        type={'filled'}
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
    justifyContent: 'center',
    backgroundColor: '#FFF',
    margin: -8,
    marginTop: 0,
    padding: 24,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    // shadow
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
    height: 48,
    marginTop: 24,
  },
});

export default MarksForm;
