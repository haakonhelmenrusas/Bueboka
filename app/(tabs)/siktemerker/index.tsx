import * as Sentry from '@sentry/react-native';
import { useEffect, useState } from 'react';
import { Keyboard, Modal, StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native';

import { Button, Input } from '../../../components/common';
import { AimDistanceMark, CalculatedMarks, MarkValue } from '../../../types';
import { Ballistics, getLocalStorage, storeLocalStorage, useBallisticsParams } from '../../../utils/';
import MarksForm from './components/MarksForm';
import MarksTable from './components/MarksTable';

export default function Calculate() {
  const [modalVisible, setModalVisible] = useState(false);
  const [name, setName] = useState('');
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

  const handleSave = () => {
    storeMarksWithName(name);
    closeModal();
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
      Sentry.captureException(error);
    }
  }

  async function handleRemoveMark(index: number) {
    const newDistances = ballistics.given_distances.filter((_distance: any, i: number) => i === index);

    await sendMarks({ aim: 9999, distance: newDistances[0] });
  }

  async function storeMarksWithName(name: string) {
    if (ballistics) {
      const marksSet = {
        name: name,
        marks: ballistics.given_marks,
        distances: ballistics.given_distances,
      };

      try {
        // Store marks set in local storage
        await storeLocalStorage(marksSet, name);
        setBallistics(null);
      } catch (error) {
        Sentry.captureException(error);
      }
    }
  }

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={{ flex: 1 }}>
        <Text style={styles.title}>Siktemerker</Text>
        <MarksForm sendMarks={sendMarks} status={status} />
        {error && (
          <>
            <View style={{ marginBottom: 8, padding: 8 }}>Oisann, noe gikk galt. Prøv igjen senere.</View>
          </>
        )}
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
          <Button label="Opprett sett" type="filled" onPress={() => openModal()} />
        </View>
        <Modal visible={modalVisible} animationType="fade">
          <View style={{ flex: 1, margin: 32, justifyContent: 'center', alignItems: 'center' }}>
            <Input
              label="Sett navn på settet"
              error={false}
              onChangeText={setName}
              value={name}
              placeholder="Enter name"
            />
            <View style={{ flexDirection: 'row', marginTop: 24, justifyContent: 'space-between' }}>
              <Button type="outline" label="Avbryt" onPress={closeModal} />
              <Button label="Lagre sett" onPress={handleSave} />
            </View>
          </View>
        </Modal>
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
