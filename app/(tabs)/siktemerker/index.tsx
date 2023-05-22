import { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

import { useCalcForm } from './useCalcForm';
import Button from '../../../components/common/Button';
import { AimDistanceMark, MarkValue, Status } from '../../../types';
import { Ballistics } from '../../../utils/Constants';
import useBallisticsParams from '../../../utils/hooks/useBallisticsParams';

export default function Calculate() {
  const [marks, setMarks] = useState<MarkValue[]>([]);
  const { status, error, calculateBallisticsParams } = useBallisticsParams();
  const [{ aimError, aimValue, distanceError, distanceValue }, dispatch] = useCalcForm();

  async function sendMarks(marks: MarkValue[]) {
    const body: AimDistanceMark = {
      ...Ballistics,
      marks: marks.map((mark) => mark.aim),
      given_distances: marks.map((mark) => mark.distance),
    };

    /*      if (ballistics) {
            body.marks.push(...ballistics.given_marks);
            body.given_distances.push(...ballistics.given_distances);
          }*/
    try {
      const aimMarkResponse = await calculateBallisticsParams(body);
      if (aimMarkResponse) {
        console.log('RESPONSE: ', aimMarkResponse);
        /*          await storeBallistics(aimMarkResponse);
                  await getBallistics();*/
      }
    } catch (error) {
      console.log('NOT WORKING: ', error);
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
      const newEntry: MarkValue = { aim: parseInt(aimValue, 10), distance: parseInt(distanceValue, 10) };
      setMarks([...marks, newEntry]);
      dispatch({ type: 'SET_AIM_VALUE', payload: '' });
      dispatch({ type: 'SET_DISTANCE_VALUE', payload: '' });
    }
  }

  /*  async function handleRemoveMark(index: number) {
      if (ballistics) {
        ballistics.given_marks.splice(index, 1);
        ballistics.given_distances.splice(index, 1);
      }
    }*/

  return (
    <View>
      <Text style={styles.title}>Beregn siktemerker</Text>
      <View style={styles.form}>
        <View style={{ marginRight: 8 }}>
          <Text style={styles.label}>Avstand</Text>
          <TextInput
            onBlur={() => dispatch({ type: 'SET_DISTANCE_ERROR', payload: false })}
            placeholder="F.eks. 20"
            keyboardType="numeric"
            style={styles.input}
            value={distanceValue}
            onChangeText={(value) => handleDistanceChange(value)}
          />
          {distanceError && <Text style={{ color: 'red' }}>Fyll inn avstand</Text>}
        </View>
        <View>
          <Text style={styles.label}>Merke</Text>
          <TextInput
            onBlur={() => dispatch({ type: 'SET_AIM_ERROR', payload: false })}
            placeholder="F.eks. 2.35"
            keyboardType="numeric"
            style={styles.input}
            value={aimValue}
            onChangeText={(value) => handleAimChange(value)}
          />
          {aimError && <Text style={{ color: 'red' }}>Fyll inn siktemerke</Text>}
        </View>
        <Button
          type="outlined"
          style={{ marginLeft: 'auto', marginTop: 16 }}
          onPress={handleAddMark}
          label="Legg til"
        />
      </View>
      {error && (
        <>
          <View style={{ marginBottom: 8, padding: 8 }}>Obs, noe gikk galt. Prøv igjen senere.</View>
        </>
      )}
      <Button
        type="filled"
        disabled={status === Status.Pending}
        style={{ marginTop: 16, width: '100%' }}
        onPress={markCalculation}
        label={status === Status.Pending ? 'Jobber' : 'Beregn siktemerker'}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  title: {
    color: '#000',
    fontSize: 20,
    marginBottom: 16,
  },
  form: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  label: {
    color: '#000',
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    height: 45,
    paddingLeft: 8,
    borderColor: 'gray',
    borderWidth: 1,
    width: 100,
    borderRadius: 4,
  },
});
