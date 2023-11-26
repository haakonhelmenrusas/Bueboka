import { captureException } from '@sentry/react-native';
import { useEffect, useState } from 'react';
import { Keyboard, StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native';

import { Button } from '../../../components/common';
import { AimDistanceMark, CalculatedMarks, MarkValue } from '../../../types';
import { Ballistics, getLocalStorage, storeLocalStorage, useBallisticsParams } from '../../../utils/';
import { MarksForm, MarksTable, SetModal } from './components';

export default function Calculate() {
  const [modalVisible, setModalVisible] = useState(false);
  const [ballistics, setBallistics] = useState<CalculatedMarks | null>(null);
  const { error, status, calculateBallisticsParams } = useBallisticsParams();

  useEffect(() => {
    getLocalStorage<CalculatedMarks>('ballistics').then((data) => {
      if (data) {
        setBallistics(data);
      }
    });
  }, []);

  const openModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

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
      captureException(error);
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
        <MarksForm sendMarks={sendMarks} status={status} />
        {error && <View style={{ marginBottom: 8, padding: 8 }}>Oisann, noe gikk galt. Prøv igjen!</View>}
        <MarksTable ballistics={ballistics} removeMark={handleRemoveMark} />
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 'auto' }}>
          <Button
            label="Fjern merker"
            type="outline"
            onPress={() => {
              storeLocalStorage(null, 'ballistics').then(() => {
                setBallistics(null);
              });
            }}
          />
          <Button label="Lagre sett" type="filled" onPress={() => openModal()} />
        </View>
        <SetModal
          modalVisible={modalVisible}
          closeModal={closeModal}
          setBallistics={setBallistics}
          ballistics={ballistics}
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
});
