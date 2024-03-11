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
      <Button
        type="filled"
        width={100}
        loading={status === 'pending'}
        buttonStyle={{ marginLeft: 'auto', marginTop: 28 }}
        onPress={handleAddMark}
        label="Beregn"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  form: {
    display: 'flex',
    flexDirection: 'row',
    marginBottom: 32,
  },
});

export default MarksForm;
