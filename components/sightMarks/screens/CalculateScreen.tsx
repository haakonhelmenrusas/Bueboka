import React, { useEffect, useState } from 'react';
import { Keyboard, Pressable, View } from 'react-native';
import { AimDistanceMark, ArrowSet, Bow, CalculatedMarks, MarkValue } from '@/types';
import { useSharedValue, withTiming } from 'react-native-reanimated';
import { Ballistics, getLocalStorage, storeLocalStorage, useBallisticsParams } from '@/utils';
import { faTrash } from '@fortawesome/free-solid-svg-icons/faTrash';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import * as Sentry from '@sentry/react-native';
import { styles } from './CalculateScreenStyles';
import { colors } from '@/styles/colors';
import MarksTable from '@/components/sightMarks/marksTable/MarksTable';
import MarksForm from '@/components/sightMarks/marksForm/MarksForm';
import ConfirmRemoveMarks from '@/components/sightMarks/confirmRemoveMarks/ConfirmRemoveMarks';
import { Button } from '@/components/common';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function CalculateScreen() {
  const [conformationModalVisible, setConformationModalVisible] = useState(false);
  const { error, status, calculateBallisticsParams } = useBallisticsParams();
  const translateY = useSharedValue(300);
  const [ballistics, setBallistics] = useState<CalculatedMarks | null>(null);
  const [isFormVisible, setIsFormVisible] = useState(false);

  useEffect(() => {
    getLocalStorage<CalculatedMarks>('ballistics').then((data) => {
      if (data) {
        setBallistics(data);
      }
    });
  }, []);

  async function sendMarks(newMark: MarkValue) {
    const bow = await getLocalStorage<Bow>('bow');
    const arrowSets = await getLocalStorage<ArrowSet[]>('arrowSets');
    const arrowSet = Array.isArray(arrowSets)
      ? arrowSets.find((set) => set.isFavorite)
      : null;


    const body: AimDistanceMark = {
      ...Ballistics,
      new_given_mark: newMark.aim,
      new_given_distance: newMark.distance,
    };

    if (bow) {
      body.bow_category = bow.bowType;
      body.interval_sight_real = bow.interval_sight_real ?? 5;
      body.interval_sight_measured = bow.interval_sight_measured ?? 5;
      body.arrow_diameter_mm = arrowSet?.diameter ?? 0;
      body.arrow_mass_gram = arrowSet?.weight ?? 0;
      body.feet_behind_or_center = bow.placement;
      body.length_eye_sight_cm = bow.eyeToAim ?? 0;
      body.length_nock_eye_cm = bow.eyeToNock ?? 0;
    }

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
      Sentry.captureException('Error during calculation', error);
    }
  }

  function handleOpenForm() {
    setIsFormVisible(true);
    translateY.value = withTiming(0, { duration: 200 });
  }

  async function handleRemoveMark(index: number) {
    if (ballistics) {
      const newDistances = ballistics.given_distances.filter((_distance, i) => i === index);
      await sendMarks({ aim: 9999, distance: newDistances[0] });
    }
  }

  return (
    <GestureHandlerRootView style={styles.page}>
      <View style={{ flex: 1 }}>
        <Pressable style={{ flex: 1 }} onPress={() => Keyboard.dismiss()}>
          {error && <View style={{ marginBottom: 8, padding: 8 }}>Oisann, noe gikk galt. Prøv igjen!</View>}
          <MarksTable ballistics={ballistics} removeMark={handleRemoveMark} />
          {ballistics && ballistics.given_marks.length > 0 && !isFormVisible && (
            <Button
              label="Tøm liste"
              type="outline"
              icon={<FontAwesomeIcon icon={faTrash} color={colors.secondary} />}
              onPress={() => setConformationModalVisible(true)}
            />
          )}
        </Pressable>
      </View>
      <View style={{ flex: 1, justifyContent: 'flex-end' }}>
        {!isFormVisible ? (
          <Button
            label="Åpne skjema"
            onPress={handleOpenForm}
            buttonStyle={{ marginHorizontal: 16, marginBottom: 16 }}
          />
        ) : (
          <MarksForm
            sendMarks={sendMarks}
            status={status}
            setIsFormVisible={setIsFormVisible}
            translateY={translateY}
          />
        )}
      </View>
      <ConfirmRemoveMarks
        modalVisible={conformationModalVisible}
        setBallistics={setBallistics}
        closeModal={() => setConformationModalVisible(false)}
      />
    </GestureHandlerRootView>
  );
}
