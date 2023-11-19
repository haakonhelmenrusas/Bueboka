import * as Sentry from '@sentry/react-native';
import { useEffect, useState } from 'react';
import { Keyboard, StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native';

import { Button, Input } from '../../../components/common';
import { AimDistanceMark, CalculatedMarks, MarkValue } from '../../../types';
import { Ballistics, formatNumber, getLocalStorage, storeLocalStorage, useBallisticsParams } from '../../../utils/';
import MarksTable from './MarksTable';
import { useCalcForm } from './useCalcForm';

export default function Calculate() {
  const [ballistics, setBallistics] = useState<CalculatedMarks | null>(null);
  const { error, status, calculateBallisticsParams } = useBallisticsParams();
  const [{ aimError, aimValue, distanceError, distanceValue }, dispatch] = useCalcForm();

  useEffect(() => {
    getLocalStorage<CalculatedMarks>('ballistics').then((data) => {
      if (data) {
        setBallistics(data);
      }
    });
  }, []);

  async function sendMarks(newMark: MarkValue) {
    const body: AimDistanceMark = {
      ...Ballistics,
      new_given_mark: newMark.aim,
      new_given_distance: newMark.distance,
    };

    if (ballistics) {
      body.given_marks = ballistics.given_marks;
      body.given_distances = ballistics.given_distances;
    }

    try {
      const aimMarkResponse = await calculateBallisticsParams(body);
      if (aimMarkResponse) {
        storeLocalStorage(aimMarkResponse, 'ballistics').then(async () => {
          const ballisticsData = await getLocalStorage<CalculatedMarks>('ballistics');
          setBallistics(ballisticsData);
        });
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

  async function handleRemoveMark(index: number) {
    const newDistances = ballistics.given_distances.filter((_distance: any, i: number) => i === index);

    await sendMarks({ aim: 9999, distance: newDistances[0] });
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
              error={distanceError}
              errorMessage="Fyll inn avstand"
              value={distanceValue}
              onChangeText={(value) => handleDistanceChange(formatNumber(value))}
            />
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
              error={aimError}
              errorMessage="Fyll inn siktemerke"
              onChangeText={(value) => handleAimChange(formatNumber(value))}
            />
          </View>
          <Button
            type="filled"
            width={100}
            loading={status === 'pending'}
            buttonStyle={{ marginLeft: 'auto', marginTop: 16 }}
            onPress={handleAddMark}
            label="Beregn"
          />
        </View>
        {error && (
          <>
            <View style={{ marginBottom: 8, padding: 8 }}>Obs, noe gikk galt. Prøv igjen senere.</View>
          </>
        )}
        <MarksTable ballistics={ballistics} removeMark={handleRemoveMark} />
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
    alignItems: 'center',
    marginBottom: 16,
  },
});
