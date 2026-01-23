import React, { useCallback, useEffect, useState } from 'react';
import { Keyboard, Pressable, Text, View } from 'react-native';
import { AimDistanceMark, Arrows, Bow, BowSpecification, CalculatedMarks, MarkValue, SightMark } from '@/types';
import { useSharedValue, withTiming } from 'react-native-reanimated';
import { Ballistics } from '@/utils';
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
import { faPlus } from '@fortawesome/free-solid-svg-icons/faPlus';
import { arrowsRepository, bowRepository, sightMarksRepository } from '@/services/repositories';
import { offlineMutation } from '@/services/offline/mutationHelper';
import { useAuth } from '@/contexts/AuthContext';

export default function CalculateScreen() {
  const { user } = useAuth();
  const [conformationModalVisible, setConformationModalVisible] = useState(false);
  const translateY = useSharedValue(300);
  const [ballistics, setBallistics] = useState<CalculatedMarks | null>(null);
  const [activeSightMark, setActiveSightMark] = useState<SightMark | null>(null);
  const [status, setStatus] = useState<'idle' | 'pending' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      // Pick favorite bow & arrows
      const bowsData = await bowRepository.getAll();
      await arrowsRepository.getAll();

      // Ensure bows are array
      const bows = Array.isArray(bowsData) ? bowsData : [];

      const favBow = bows.find((b) => b.isFavorite) ?? bows[0] ?? null;

      if (!favBow) {
        setIsLoading(false);
        return;
      }

      // Ensure bow specification exists
      let spec = await sightMarksRepository.getSpecification(favBow.id);
      if (!spec) {
        spec = await sightMarksRepository.createSpecification({
          bowId: favBow.id,
          intervalSightReal: favBow.aimMeasure ?? 5,
          intervalSightMeasured: favBow.aimMeasure ?? 5,
          placement: undefined,
        });
      }

      // Load existing sight mark for this spec
      const allMarks = await sightMarksRepository.getAll();
      const sightMark = allMarks.find((m) => m.bowSpecificationId === spec.id) ?? null;
      setActiveSightMark(sightMark);

      if (sightMark?.ballisticsParameters) {
        setBallistics(sightMark.ballisticsParameters as CalculatedMarks);
      } else {
        setBallistics(null);
      }
    } catch (err) {
      console.error('Error loading ballistics data:', err);
      setError('Kunne ikke laste siktemerker');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  async function ensureBowSpec(): Promise<{ bow: Bow; arrows: Arrows | null; spec: BowSpecification }> {
    const bowsData = await bowRepository.getAll();
    const arrowsData = await arrowsRepository.getAll();

    // Ensure arrays
    const bows = Array.isArray(bowsData) ? bowsData : [];
    const arrows = Array.isArray(arrowsData) ? arrowsData : [];

    const bow = bows.find((b) => b.isFavorite) ?? bows[0];
    if (!bow) throw new Error('Ingen bue funnet');

    const arrowSet = arrows.find((a) => a.isFavorite) ?? arrows[0] ?? null;

    let spec = await sightMarksRepository.getSpecification(bow.id);
    if (!spec) {
      spec = await sightMarksRepository.createSpecification({
        bowId: bow.id,
        intervalSightReal: bow.aimMeasure ?? 5,
        intervalSightMeasured: bow.aimMeasure ?? 5,
        placement: undefined,
      });
    }

    return { bow, arrows: arrowSet, spec };
  }

  async function sendMarks(newMark: MarkValue) {
    try {
      setStatus('pending');
      setError(null);

      const { bow, arrows, spec } = await ensureBowSpec();

      // Prepare accumulated marks
      const existingMarks = activeSightMark?.givenMarks ?? [];
      const existingDistances = activeSightMark?.givenDistances ?? [];
      const givenMarks = [...existingMarks, newMark.aim];
      const givenDistances = [...existingDistances, newMark.distance];

      const body: AimDistanceMark = {
        ...Ballistics,
        new_given_mark: newMark.aim,
        new_given_distance: newMark.distance,
        given_marks: givenMarks,
        given_distances: givenDistances,
        bow_category: bow.type,
        interval_sight_real: bow.aimMeasure ?? 5,
        interval_sight_measured: bow.aimMeasure ?? 5,
        arrow_diameter_mm: arrows?.diameter ?? 5,
        arrow_mass_gram: arrows?.weight ?? 21.2,
        length_eye_sight_cm: bow.eyeToSight ?? 0,
        length_nock_eye_cm: bow.eyeToNock ?? 0,
      };

      const aimMarkResponse = await sightMarksRepository.calculateBallistics(body);

      // Persist sight mark (upsert style) with offline queue support
      let updatedSightMark: SightMark;
      if (activeSightMark) {
        updatedSightMark = await offlineMutation(
          {
            type: 'sightMarks/updateMark',
            payload: {
              id: activeSightMark.id,
              givenMarks,
              givenDistances,
              ballisticsParameters: aimMarkResponse,
            },
          },
          () =>
            sightMarksRepository.update(activeSightMark.id, {
              givenMarks,
              givenDistances,
              ballisticsParameters: aimMarkResponse,
            }),
          user?.id,
        );
      } else {
        updatedSightMark = await offlineMutation(
          {
            type: 'sightMarks/createMark',
            payload: {
              bowSpecificationId: spec.id,
              givenMarks,
              givenDistances,
              ballisticsParameters: aimMarkResponse,
            },
          },
          () =>
            sightMarksRepository.create({
              bowSpecificationId: spec.id,
              givenMarks,
              givenDistances,
              ballisticsParameters: aimMarkResponse,
            }),
          user?.id,
        );
      }

      setActiveSightMark(updatedSightMark);
      setBallistics(aimMarkResponse);
    } catch (err) {
      console.error('Error during calculation', err);
      Sentry.captureException(err);
      setError('Kunne ikke beregne siktemerker');
      setStatus('error');
      return;
    }
    setStatus('idle');
  }

  function handleOpenForm() {
    setIsFormVisible(true);
    translateY.value = withTiming(0, { duration: 200 });
  }

  async function handleRemoveMark(index: number) {
    if (!activeSightMark) return;
    try {
      setStatus('pending');
      const givenMarks = activeSightMark.givenMarks.filter((_, i) => i !== index);
      const givenDistances = activeSightMark.givenDistances.filter((_, i) => i !== index);

      const updated = await sightMarksRepository.update(activeSightMark.id, {
        givenMarks,
        givenDistances,
        ballisticsParameters: ballistics ?? {},
      });
      setActiveSightMark(updated);
      setBallistics(updated.ballisticsParameters as CalculatedMarks);
    } catch (err) {
      console.error('Error removing mark', err);
      setError('Kunne ikke fjerne siktemerke');
      setStatus('error');
    } finally {
      setStatus('idle');
    }
  }

  async function handleRemoveAllMarks() {
    if (!activeSightMark) return;
    try {
      setStatus('pending');
      const updated = await sightMarksRepository.update(activeSightMark.id, {
        givenMarks: [],
        givenDistances: [],
        ballisticsParameters: {},
      });
      setActiveSightMark(updated);
      setBallistics(null);
    } catch (err) {
      console.error('Error clearing marks', err);
      setError('Kunne ikke tømme listen');
      setStatus('error');
    } finally {
      setStatus('idle');
    }
  }

  function renderContent() {
    if (isLoading) {
      return null;
    }

    return (
      <>
        {error && (
          <View style={{ marginBottom: 8, padding: 8 }}>
            <Text>Oisann, noe gikk galt. Prøv igjen!</Text>
          </View>
        )}
        <MarksTable ballistics={ballistics} removeMark={handleRemoveMark} status={status} />
        {ballistics && ballistics.given_marks.length > 0 && !isFormVisible && (
          <Button
            buttonStyle={{ marginTop: 8 }}
            label="Tøm liste"
            type="outline"
            icon={<FontAwesomeIcon icon={faTrash} color={colors.secondary} />}
            onPress={() => setConformationModalVisible(true)}
          />
        )}
      </>
    );
  }

  return (
    <GestureHandlerRootView style={styles.page}>
      <View style={{ flex: 1, marginHorizontal: 8 }}>
        <Pressable
          style={{ flex: 1 }}
          onPress={() => {
            Keyboard.dismiss();
            setIsFormVisible(false);
          }}>
          {renderContent()}
        </Pressable>
      </View>
      <View style={{ flex: 1, justifyContent: 'flex-end' }}>
        {!isFormVisible ? (
          <Button
            icon={<FontAwesomeIcon icon={faPlus} color={colors.tertiary} />}
            iconPosition={'left'}
            label="Nytt siktemerke"
            onPress={handleOpenForm}
            buttonStyle={{ marginHorizontal: 16, marginBottom: 16 }}
          />
        ) : (
          <MarksForm sendMarks={sendMarks} status={status} setIsFormVisible={setIsFormVisible} translateY={translateY} />
        )}
      </View>
      <ConfirmRemoveMarks
        modalVisible={conformationModalVisible}
        onConfirm={handleRemoveAllMarks}
        closeModal={() => setConformationModalVisible(false)}
      />
    </GestureHandlerRootView>
  );
}
