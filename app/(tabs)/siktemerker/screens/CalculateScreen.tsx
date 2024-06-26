import { useEffect, useState } from 'react';
import {
  Keyboard,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  View,
  StyleSheet,
  Text,
  Platform,
} from 'react-native';
import { AimDistanceMark, CalculatedMarks, MarkValue } from '../../../../types';
import { Ballistics, getLocalStorage, storeLocalStorage, useBallisticsParams } from '../../../../utils';
import { ConfirmRemoveMarks, MarksForm, MarksTable } from '../components';
import { faTrash } from '@fortawesome/free-solid-svg-icons/faTrash';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';

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
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <View style={styles.container}>
          {error && <View style={{ marginBottom: 8, padding: 8 }}>Oisann, noe gikk galt. Prøv igjen!</View>}
          <MarksTable ballistics={ballistics} removeMark={handleRemoveMark} />
          <View style={styles.centeredContainer}>
            {ballistics && ballistics.given_marks.length > 0 && (
              <Text onPress={() => setConformationModalVisible(true)} style={styles.remove}>
                <FontAwesomeIcon icon={faTrash} color="#227B9A" />
                Tøm liste
              </Text>
            )}
          </View>
          <View style={{ marginTop: 'auto' }}>
            <MarksForm sendMarks={sendMarks} status={status} />
          </View>
          <ConfirmRemoveMarks
            modalVisible={conformationModalVisible}
            setBallistics={setBallistics}
            closeModal={() => setConformationModalVisible(false)}
          />
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F2',
    margin: -16,
    padding: 8,
  },
  remove: {
    color: '#227B9A',
  },
  centeredContainer: {
    alignItems: 'center',
    marginVertical: 32,
  },
});
