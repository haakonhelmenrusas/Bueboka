import * as Sentry from '@sentry/react-native';
import { useState } from 'react';
import { Keyboard, StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native';

import { Button, Input } from '../../../components/common';
import { AimDistanceMark, CalculatedMarks, MarkValue } from '../../../types';
import { Ballistics } from '../../../utils/Constants';
import { formatNumber } from '../../../utils/helpers/formatNumber';
import useBallisticsParams from '../../../utils/hooks/useBallisticsParams';
import MarksTable from './MarksTable';
import { useCalcForm } from './useCalcForm';

export default function Calculate() {
  const [calculatedMarks, setCalculatedMarks] = useState<CalculatedMarks>(null);
  const { error, calculateBallisticsParams } = useBallisticsParams();
  const [{ aimError, aimValue, distanceError, distanceValue }, dispatch] = useCalcForm();

  async function sendMarks(newMark: MarkValue) {
    const body: AimDistanceMark = {
      ...Ballistics,
      new_given_mark: newMark.aim,
      new_given_distances: newMark.distance,
    };

    try {
      const aimMarkResponse = await calculateBallisticsParams(body);
      if (aimMarkResponse) {
        setCalculatedMarks(aimMarkResponse);
        // TODO: Store in local storage
      }
    } catch (error) {
      Sentry.captureException(error);
    }
  }

  function handleDistanceChange(value: string) {
    dispatch({ type: 'SET_DISTANCE_VALUE', payload: value });
  }

  function handleAimChange(value: string) {
    dispatch({ type: 'SET_AIM_VALUE', payload: value });
  }

  function handleAddMark() {
    if (!aimValue) {
      dispatch({ type: 'SET_AIM_ERROR', payload: true });
    }
    if (!distanceValue) {
      dispatch({ type: 'SET_DISTANCE_ERROR', payload: true });
    }
    if (aimValue && distanceValue) {
      const newEntry: MarkValue = { aim: parseFloat(aimValue), distance: parseFloat(distanceValue) };

      sendMarks(newEntry);
      dispatch({ type: 'SET_AIM_VALUE', payload: '' });
      dispatch({ type: 'SET_DISTANCE_VALUE', payload: '' });
      Keyboard.dismiss();
    }
  }

  function handleRemoveMark(index: number) {
    if (calculatedMarks) {
      calculatedMarks.given_marks.splice(index, 1);
      calculatedMarks.given_distances.splice(index, 1);
    }
  }

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={{ flex: 1 }}>
        <Text style={styles.title}>Siktemerker</Text>
        <View style={styles.form}>
          <View>
            <Input
              textAlign="right"
              maxLength={100}
              label="Avstand"
              onBlur={() => dispatch({ type: 'SET_DISTANCE_ERROR', payload: false })}
              placeholderText="F.eks. 20"
              keyboardType="numeric"
              value={distanceValue}
              onChangeText={(value) => handleDistanceChange(formatNumber(value))}
            />
            {distanceError && <Text style={{ color: 'red' }}>Fyll inn avstand</Text>}
          </View>
          <View>
            <Input
              textAlign="right"
              maxLength={15}
              label="Merke"
              onBlur={() => dispatch({ type: 'SET_AIM_ERROR', payload: false })}
              placeholderText="F.eks. 2.35"
              keyboardType="numeric"
              value={aimValue}
              onChangeText={(value) => handleAimChange(formatNumber(value))}
            />
            {aimError && <Text style={{ color: 'red' }}>Fyll inn siktemerke</Text>}
          </View>
          <Button
            type="filled"
            buttonStyle={{ marginLeft: 'auto', marginTop: 16 }}
            onPress={handleAddMark}
            label="Legg til"
          />
        </View>
        {error && (
          <>
            <View style={{ marginBottom: 8, padding: 8 }}>Obs, noe gikk galt. Prøv igjen senere.</View>
          </>
        )}
        <MarksTable ballistics={calculatedMarks} removeMark={handleRemoveMark} />
      </View>
    </TouchableWithoutFeedback>
  );
}
const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    marginTop: 16,
  },
  form: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 16,
  },
});
