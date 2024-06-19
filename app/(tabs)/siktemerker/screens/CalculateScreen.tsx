import { useEffect, useState } from 'react';
import { Keyboard, TouchableWithoutFeedback, View } from 'react-native';
import { Button } from '../../../../components/common';
import { AimDistanceMark, CalculatedMarks, MarkValue } from '../../../../types';
import { Ballistics, getLocalStorage, storeLocalStorage, useBallisticsParams } from '../../../../utils';
import { ConfirmRemoveMarks, MarksForm, MarksTable } from '../components';

export default function CalculateScreen() {
  const [conformationModalVisible, setConformationModalVisible] = useState(false);
  const { error, status, calculateBallisticsParams } = useBallisticsParams();
  const [ballistics, setBallistics] = useState<CalculatedMarks | null>(null);

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
      console.log('Error', error);
    }
  }

  async function handleRemoveMark(index: number) {
    const newDistances = ballistics.given_distances.filter((_distance: any, i: number) => i === index);

    await sendMarks({ aim: 9999, distance: newDistances[0] });
  }

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={{ flex: 1 }}>
        <MarksForm sendMarks={sendMarks} status={status} />
        {error && <View style={{ marginBottom: 8, padding: 8 }}>Oisann, noe gikk galt. Prøv igjen!</View>}
        <MarksTable ballistics={ballistics} removeMark={handleRemoveMark} />
        {ballistics && ballistics.given_marks.length > 0 && (
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 'auto' }}>
            <Button label="Fjern merker" type="outline" onPress={() => setConformationModalVisible(true)} />
          </View>
        )}
        <ConfirmRemoveMarks
          modalVisible={conformationModalVisible}
          setBallistics={setBallistics}
          closeModal={() => setConformationModalVisible(false)}
        />
      </View>
    </TouchableWithoutFeedback>
  );
}
