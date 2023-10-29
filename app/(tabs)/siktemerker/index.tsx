import * as Sentry from '@sentry/react-native';
import { useState } from 'react';
import { Keyboard, StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native';

import MarksTable from './MarksTable';
import { useCalcForm } from './useCalcForm';
import { Button, Input } from '../../../components/common';
import { AimDistanceMark, CalculatedMarks, MarkValue, Status } from '../../../types';
import { Ballistics } from '../../../utils/Constants';
import useBallisticsParams from '../../../utils/hooks/useBallisticsParams';

export default function Calculate() {
  const [marks, setMarks] = useState<MarkValue[]>([]);
  const [calculatedMarks, setCalculatedMarks] = useState<CalculatedMarks>(null);
  const { status, error, calculateBallisticsParams } = useBallisticsParams();
  const [{ aimError, aimValue, distanceError, distanceValue }, dispatch] = useCalcForm();

  async function sendMarks(marks: MarkValue[]) {
    const body: AimDistanceMark = {
      ...Ballistics,
      marks: marks.map((mark) => mark.aim),
      given_distances: marks.map((mark) => mark.distance),
    };

    try {
      const aimMarkResponse = await calculateBallisticsParams(body);
      if (aimMarkResponse) {
        await setCalculatedMarks(aimMarkResponse);
        // TODO: Implement getBallistics
        //await getBallistics();
      }
    } catch (error) {
      Sentry.captureException(error);
    }
  }

  function markCalculation() {
    sendMarks(marks);
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
      setMarks((prevState) => (prevState ? [...prevState, newEntry] : [newEntry]));
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

  // Write a function that takes in the input 3,4 and returns 3.4
  function formatNumber(number: string) {
    return number.replace(',', '.');
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
            type="outline"
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
        <Button
          type="filled"
          loading={status === Status.Pending}
          disabled={status === Status.Pending || marks.length === 0}
          buttonStyle={{
            alignSelf: 'flex-end',
            position: 'absolute',
            bottom: 8,
            width: '100%',
          }}
          onPress={markCalculation}
          label="Beregn siktemerker"
        />
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
