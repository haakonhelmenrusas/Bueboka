import React, { useCallback, useEffect, useState } from 'react';
import { Keyboard, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AimDistanceMark, Arrows, Bow, MarkValue, SightMark } from '@/types';
import { useSharedValue, withTiming } from 'react-native-reanimated';
import { Ballistics } from '@/utils';
import * as Sentry from '@sentry/react-native';
import { colors } from '@/styles/colors';
import SightMarkSetCard from '@/components/sightMarks/sightMarkSetCard/SightMarkSetCard';
import MarksForm from '@/components/sightMarks/marksForm/MarksForm';
import ConfirmRemoveMarks from '@/components/sightMarks/confirmRemoveMarks/ConfirmRemoveMarks';
import { Button, Message } from '@/components/common';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { faPlus } from '@fortawesome/free-solid-svg-icons/faPlus';
import { faSliders } from '@fortawesome/free-solid-svg-icons/faSliders';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { arrowsRepository, bowRepository, sightMarksRepository } from '@/services/repositories';
import { offlineMutation } from '@/services/offline/mutationHelper';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslation } from '@/contexts';
import { AppError } from '@/services';
import EquipmentModal from '@/components/sightMarks/equipmentModal/EquipmentModal';

export default function CalculateScreen() {
  const { user } = useAuth();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const translateY = useSharedValue(300);

  const [sightMarks, setSightMarks] = useState<SightMark[]>([]);
  const [activeSightMark, setActiveSightMark] = useState<SightMark | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [status, setStatus] = useState<'idle' | 'pending' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [equipmentVisible, setEquipmentVisible] = useState(false);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const all = await sightMarksRepository.getAll();
      setSightMarks(all.sort((a, b) => new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime()));
    } catch (err) {
      Sentry.captureException(err);
      setError(err instanceof AppError && err.code === 'NETWORK_ERROR' ? t['sightMarks.networkError'] : t['sightMarks.loadError']);
    } finally {
      setIsLoading(false);
    }
  }, [t]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // ─── Bow / arrow helpers ────────────────────────────────────────────────────

  const getEquipment = useCallback(async (): Promise<{ bow: Bow; arrows: Arrows | null }> => {
    const [bowsData, arrowsData] = await Promise.all([bowRepository.getAll(), arrowsRepository.getAll()]);
    const bows = Array.isArray(bowsData) ? bowsData : [];
    const arrows = Array.isArray(arrowsData) ? arrowsData : [];
    const bow = bows.find((b) => b.isFavorite) ?? bows[0];
    if (!bow) throw new Error(t['sightMarks.loadError']);
    const arrowSet = arrows.find((a) => a.isFavorite) ?? arrows[0] ?? null;
    return { bow, arrows: arrowSet };
  }, [t]);

  // ─── Form open helpers ──────────────────────────────────────────────────────

  function handleNewSet() {
    setActiveSightMark(null);
    setIsCreatingNew(true);
    setIsFormVisible(true);
    translateY.value = withTiming(0, { duration: 200 });
  }

  function handleAddToSet(sm: SightMark) {
    setActiveSightMark(sm);
    setIsCreatingNew(false);
    setIsFormVisible(true);
    translateY.value = withTiming(0, { duration: 200 });
  }

  // ─── sendMarks ──────────────────────────────────────────────────────────────

  const sendMarks = useCallback(
    async (newMark: MarkValue) => {
      try {
        setStatus('pending');
        setError(null);
        const { bow, arrows } = await getEquipment();
        const givenMarks = [...(activeSightMark?.givenMarks ?? []), newMark.aim];
        const givenDistances = [...(activeSightMark?.givenDistances ?? []), newMark.distance];

        const body: AimDistanceMark = {
          ...Ballistics,
          new_given_mark: newMark.aim,
          new_given_distance: newMark.distance,
          given_marks: givenMarks,
          given_distances: givenDistances,
          bow_category: bow.type,
          interval_sight_measured: bow.aimMeasure ?? Ballistics.interval_sight_measured,
          arrow_diameter_mm: arrows?.diameter ?? 5,
          arrow_mass_gram: arrows?.weight ?? 21.2,
          length_eye_sight_cm: bow.eyeToSight ?? 0,
          length_nock_eye_cm: bow.eyeToNock ?? 0,
        };

        const aimMarkResponse = await sightMarksRepository.calculateBallistics(body);

        if (activeSightMark) {
          await offlineMutation(
            {
              type: 'sightMarks/updateMark',
              payload: { id: activeSightMark.id, givenMarks, givenDistances, ballisticsParameters: aimMarkResponse },
            },
            () => sightMarksRepository.patch(activeSightMark.id, { givenMarks, givenDistances, ballisticsParameters: aimMarkResponse }),
            user?.id,
          );
        } else {
          await offlineMutation(
            {
              type: 'sightMarks/createMark',
              payload: {
                userId: user?.id,
                bowId: bow.id,
                name: newMark.name,
                givenMarks,
                givenDistances,
                ballisticsParameters: aimMarkResponse,
              },
            },
            () =>
              sightMarksRepository.create({
                userId: user?.id,
                bowId: bow.id,
                name: newMark.name,
                givenMarks,
                givenDistances,
                ballisticsParameters: aimMarkResponse,
              }),
            user?.id,
          );
        }

        await loadData();
      } catch (err) {
        Sentry.captureException(err);
        setError(t['sightMarks.calculateError']);
        setStatus('error');
        return;
      }
      setStatus('idle');
    },
    [getEquipment, activeSightMark, loadData, user?.id, t],
  );

  // ─── Delete single mark from a set ─────────────────────────────────────────

  async function handleRemoveMark(sightMarkId: string, index: number) {
    const sm = sightMarks.find((s) => s.id === sightMarkId);
    if (!sm) return;
    try {
      setStatus('pending');
      const givenMarks = sm.givenMarks.filter((_, i) => i !== index);
      const givenDistances = sm.givenDistances.filter((_, i) => i !== index);

      if (givenMarks.length === 0) {
        await offlineMutation(
          { type: 'sightMarks/deleteMark', payload: { id: sightMarkId } },
          () => sightMarksRepository.delete(sightMarkId),
          user?.id,
        );
      } else {
        const { bow, arrows } = await getEquipment();
        const lastIdx = givenMarks.length - 1;
        const body: AimDistanceMark = {
          ...Ballistics,
          new_given_mark: givenMarks[lastIdx],
          new_given_distance: givenDistances[lastIdx],
          given_marks: givenMarks,
          given_distances: givenDistances,
          bow_category: bow.type,
          interval_sight_measured: bow.aimMeasure ?? Ballistics.interval_sight_measured,
          arrow_diameter_mm: arrows?.diameter ?? 5,
          arrow_mass_gram: arrows?.weight ?? 21.2,
          length_eye_sight_cm: bow.eyeToSight ?? 0,
          length_nock_eye_cm: bow.eyeToNock ?? 0,
        };
        const newBallistics = await sightMarksRepository.calculateBallistics(body);
        await offlineMutation(
          { type: 'sightMarks/updateMark', payload: { id: sightMarkId, givenMarks, givenDistances, ballisticsParameters: newBallistics } },
          () => sightMarksRepository.patch(sightMarkId, { givenMarks, givenDistances, ballisticsParameters: newBallistics }),
          user?.id,
        );
      }
      await loadData();
    } catch (err) {
      Sentry.captureException(err);
      setError(t['sightMarks.removeError']);
      setStatus('error');
    } finally {
      setStatus('idle');
    }
  }

  // ─── Delete whole set ───────────────────────────────────────────────────────

  async function handleDeleteSet() {
    if (!confirmDeleteId) return;
    try {
      setStatus('pending');
      await offlineMutation(
        { type: 'sightMarks/deleteMark', payload: { id: confirmDeleteId } },
        () => sightMarksRepository.delete(confirmDeleteId),
        user?.id,
      );
      await loadData();
    } catch (err) {
      Sentry.captureException(err);
      setError(t['sightMarks.deleteSetError']);
      setStatus('error');
    } finally {
      setStatus('idle');
      setConfirmDeleteId(null);
    }
  }

  // ─── Render ─────────────────────────────────────────────────────────────────

  return (
    <GestureHandlerRootView style={styles.page}>
      <Pressable style={{ flex: 1 }} onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={styles.list}>
          <TouchableOpacity style={styles.equipmentButton} onPress={() => setEquipmentVisible(true)} activeOpacity={0.7}>
            <FontAwesomeIcon icon={faSliders} size={13} color={colors.white} />
            <Text style={styles.equipmentButtonText}>{t['sightMarks.equipmentButton']}</Text>
          </TouchableOpacity>

          {error && (
            <Message
              title={t['sightMarks.errorTitle']}
              description={error}
              onPress={() => setError(null)}
              buttonLabel={t['practiceDetails.close']}
            />
          )}

          {!isLoading && sightMarks.length === 0 && !error && (
            <Message title={t['sightMarks.emptyTitle']} description={t['sightMarks.emptyDescription']} />
          )}

          {sightMarks.map((sm) => (
            <SightMarkSetCard
              key={sm.id}
              sightMark={sm}
              onAddMark={() => handleAddToSet(sm)}
              onDeleteMark={(index) => handleRemoveMark(sm.id, index)}
              onDeleteSet={() => setConfirmDeleteId(sm.id)}
              status={status}
            />
          ))}
        </ScrollView>
      </Pressable>

      <View style={[styles.bottomBar, { bottom: insets.bottom + 80 }]}>
        <Button
          icon={<FontAwesomeIcon icon={faPlus} color={colors.tertiary} />}
          iconPosition="left"
          label={t['sightMarks.newSet']}
          onPress={handleNewSet}
          buttonStyle={styles.newSetButton}
        />
      </View>

      {isFormVisible && (
        <MarksForm
          sendMarks={sendMarks}
          status={status}
          setIsFormVisible={setIsFormVisible}
          translateY={translateY}
          isNewSet={isCreatingNew}
        />
      )}

      <ConfirmRemoveMarks modalVisible={confirmDeleteId !== null} onConfirm={handleDeleteSet} closeModal={() => setConfirmDeleteId(null)} />

      <EquipmentModal visible={equipmentVisible} onClose={() => setEquipmentVisible(false)} />
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1 },
  list: { paddingHorizontal: 12, paddingTop: 12, paddingBottom: 160 },
  bottomBar: { position: 'absolute', left: 0, right: 0, paddingHorizontal: 16, paddingTop: 8, paddingBottom: 12 },
  newSetButton: { width: '100%' },
  equipmentButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    backgroundColor: 'rgba(255,255,255,0.1)',
    marginBottom: 8,
  },
  equipmentButtonText: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.white,
  },
});
