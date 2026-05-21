import React, { useEffect, useState } from 'react';
import { Keyboard, KeyboardAvoidingView, Platform, Pressable, ScrollView, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Sentry from '@sentry/react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ModalHeader, ModalWrapper } from '@/components/common';
import ConfirmModal from '@/components/home/DeleteArrowSetModal/ConfirmModal';
import { practiceRepository, type CreateEndData } from '@/services/repositories';
import { Arrows, Bow, Environment, Practice, PracticeCategory } from '@/types';
import { useTranslation } from '@/contexts';
import type { TranslationKeys } from '@/lib/i18n';
import { styles } from './CreatePracticeFormStyles';
import { DEFAULT_ARROWS_PER_END } from '@/components/practice/shared/formConstants';
import { isRangeCategory } from '@/components/practice/shared/formHelpers';
import { useStepNavigation } from '@/components/practice/shared/useStepNavigation';
import { useWeatherSelection } from '@/components/practice/shared/useWeatherSelection';
import { useEquipmentSelection } from '@/components/practice/shared/useEquipmentSelection';
import { StepIndicator } from '@/components/practice/shared/StepIndicator';
import { NavigationFooter } from '@/components/practice/shared/NavigationFooter';
import { InfoStep } from './InfoStep';
import { RoundsStep } from './RoundsStep';
import { ReflectionStep } from './ReflectionStep';

// ─── Storage keys ────────────────────────────────────────────────────────────
const STORAGE_KEY_DISTANCE = 'bueboka_last_distance';
const STORAGE_KEY_TARGET = 'bueboka_last_target';

// ─── Step definitions ─────────────────────────────────────────────────────────
const TOTAL_STEPS = 3;
const getStepLabels = (t: TranslationKeys): string[] => [t['practiceStep.info'], t['practiceStep.rounds'], t['practiceStep.reflection']];

// ─── Types ────────────────────────────────────────────────────────────────────
export interface RoundInput {
  distanceMeters?: number;
  distanceFrom?: number;
  distanceTo?: number;
  targetType: string;
  numberArrows?: number;
  arrowsPerEnd?: number;
  arrowsWithoutScore?: number;
  roundScore: number;
  scores?: number[];
}

interface CreatePracticeFormProps {
  visible: boolean;
  onClose: () => void;
  bows?: Bow[];
  arrowSets?: Arrows[];
  onPracticeSaved?: () => void;
  editingPractice?: Practice | null;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function emptyRound(cat: PracticeCategory): RoundInput {
  return isRangeCategory(cat)
    ? {
        distanceFrom: undefined,
        distanceTo: undefined,
        targetType: '',
        numberArrows: undefined,
        arrowsPerEnd: undefined,
        arrowsWithoutScore: undefined,
        roundScore: 0,
        scores: [],
      }
    : {
        distanceMeters: undefined,
        targetType: '',
        numberArrows: undefined,
        arrowsPerEnd: undefined,
        arrowsWithoutScore: undefined,
        roundScore: 0,
        scores: [],
      };
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function CreatePracticeForm({
  visible,
  onClose,
  bows = [],
  arrowSets = [],
  onPracticeSaved,
  editingPractice = null,
}: CreatePracticeFormProps) {
  const router = useRouter();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const STEP_LABELS = getStepLabels(t);

  // Step navigation
  const { step, setStep, goNext, goPrev, resetStep } = useStepNavigation(TOTAL_STEPS);

  // Form state
  const [date, setDate] = useState(new Date());
  const [practiceCategory, setPracticeCategory] = useState<PracticeCategory>(PracticeCategory.SKIVE_INDOOR);
  const [environment, setEnvironment] = useState<Environment>(Environment.INDOOR);
  const [location, setLocation] = useState('');
  const [rounds, setRounds] = useState<RoundInput[]>([emptyRound(PracticeCategory.SKIVE_INDOOR)]);
  const [rating, setRating] = useState<number | null>(null);
  const [notes, setNotes] = useState('');
  const [scoringMethod, setScoringMethod] = useState<'buttons' | 'target'>('buttons');

  // Weather selection hook
  const { weather, setWeather, toggleWeather } = useWeatherSelection(environment);

  // Equipment selection hook
  const { selectedBow, setSelectedBow, selectedArrowSet, setSelectedArrowSet, bowOptions, arrowSetOptions, selectFavorites } =
    useEquipmentSelection(bows, arrowSets);

  // UI state
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [closeConfirmVisible, setCloseConfirmVisible] = useState(false);
  const [endPages, setEndPages] = useState<Record<number, number>>({});
  const [editingIndices, setEditingIndices] = useState<Record<number, number | null>>({});
  const [expandedScoring, setExpandedScoring] = useState<Record<number, boolean>>({});
  const [editingId, setEditingId] = useState<string | null>(null);

  // Derived
  const isEditing = !!editingId;

  const hasChanges = () => {
    if (isEditing) return true;
    return (
      location !== '' ||
      notes !== '' ||
      selectedBow !== '' ||
      selectedArrowSet !== '' ||
      weather.length > 0 ||
      rounds.some((r) => r.distanceMeters || r.distanceFrom || r.distanceTo || r.targetType || r.numberArrows || r.roundScore)
    );
  };

  // ─── Init form ───────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!visible) {
      setEditingId(null);
      return;
    }

    resetStep();
    setError(null);
    setExpandedScoring({});

    if (editingPractice) {
      setEditingId(editingPractice.id);

      setDate(new Date(editingPractice.date));
      setPracticeCategory(editingPractice.practiceCategory ?? PracticeCategory.SKIVE_INDOOR);
      setEnvironment(editingPractice.environment ?? Environment.INDOOR);
      setWeather(editingPractice.weather ?? []);
      setLocation(editingPractice.location ?? '');
      setSelectedBow(editingPractice.bowId ?? '');
      setSelectedArrowSet(editingPractice.arrowsId ?? '');
      setRating(editingPractice.rating ?? null);
      setNotes(editingPractice.notes ?? '');

      if (editingPractice.ends && editingPractice.ends.length > 0) {
        setRounds(
          editingPractice.ends.map((end) => {
            const savedScores = end.scores ?? [];
            const derivedArrowCount = end.arrows ?? (savedScores.length > 0 ? savedScores.length : undefined);
            return {
              distanceMeters: end.distanceMeters ?? undefined,
              distanceFrom: end.distanceFrom ?? undefined,
              distanceTo: end.distanceTo ?? undefined,
              targetType: end.targetType ?? (end.targetSizeCm ? `${end.targetSizeCm}cm` : ''),
              numberArrows: derivedArrowCount,
              arrowsPerEnd: end.arrowsPerEnd ?? undefined,
              arrowsWithoutScore: end.arrowsWithoutScore ?? undefined,
              roundScore: end.roundScore ?? 0,
              scores: savedScores,
            };
          }),
        );
      } else {
        setRounds([emptyRound(editingPractice.practiceCategory ?? PracticeCategory.SKIVE_INDOOR)]);
      }
    } else {
      setEditingId(null);
      resetForm();

      let cancelled = false;
      AsyncStorage.multiGet([STORAGE_KEY_DISTANCE, STORAGE_KEY_TARGET])
        .then(([distEntry, targetEntry]) => {
          if (cancelled) return;
          const lastDist = distEntry[1] ? parseFloat(distEntry[1]) : undefined;
          const lastTarget = targetEntry[1] ?? '';
          setRounds([
            {
              distanceMeters: lastDist,
              targetType: lastTarget,
              numberArrows: undefined,
              arrowsWithoutScore: undefined,
              roundScore: 0,
              scores: [],
            },
          ]);
        })
        .catch(() => {});

      selectFavorites();

      return () => {
        cancelled = true;
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, editingPractice?.id]);

  useEffect(() => {
    if (environment !== Environment.OUTDOOR) setWeather([]);
  }, [environment, setWeather]);

  // Clamp endPages whenever scores change
  useEffect(() => {
    setEndPages((prev) => {
      const next: Record<number, number> = {};
      rounds.forEach((round, idx) => {
        const maxArrows = round.numberArrows ?? 0;
        if (maxArrows === 0) return;
        const arrowsPerEnd = round.arrowsPerEnd ?? DEFAULT_ARROWS_PER_END;
        const filledCount = (round.scores ?? []).length;
        const totalEnds = Math.ceil(maxArrows / arrowsPerEnd);
        const activeEndPage = filledCount >= maxArrows ? totalEnds - 1 : Math.floor(filledCount / arrowsPerEnd);
        const currentPage = prev[idx] ?? activeEndPage;
        next[idx] = Math.max(0, Math.min(currentPage, activeEndPage));
      });
      return next;
    });
  }, [rounds]);

  // ─── End page navigation ─────────────────────────────────────────────────────
  const setEndPage = (roundIndex: number, page: number) => {
    setEditingIndices((prev) => ({ ...prev, [roundIndex]: null }));
    setEndPages((prev) => ({ ...prev, [roundIndex]: page }));
  };

  const setEditingIndex = (roundIndex: number, idx: number | null) => {
    setEditingIndices((prev) => ({ ...prev, [roundIndex]: idx }));
  };

  const toggleScoringExpanded = (roundIndex: number) => {
    setExpandedScoring((prev) => {
      const next: Record<number, boolean> = {};
      for (const key of Object.keys(prev)) {
        next[Number(key)] = false;
      }
      next[roundIndex] = !prev[roundIndex];
      return next;
    });
  };

  // ─── Reset ───────────────────────────────────────────────────────────────────
  const resetForm = () => {
    setDate(new Date());
    setPracticeCategory(PracticeCategory.SKIVE_INDOOR);
    setEnvironment(Environment.INDOOR);
    setWeather([]);
    setLocation('');
    setSelectedBow('');
    setSelectedArrowSet('');
    setRounds([emptyRound(PracticeCategory.SKIVE_INDOOR)]);
    setRating(null);
    setNotes('');
    setExpandedScoring({});
  };

  const handleClose = () => {
    if (hasChanges()) {
      setCloseConfirmVisible(true);
    } else {
      resetForm();
      onClose();
    }
  };

  const handleConfirmClose = () => {
    setCloseConfirmVisible(false);
    resetForm();
    onClose();
  };

  // ─── Category ────────────────────────────────────────────────────────────────
  const handleCategoryChange = (cat: PracticeCategory) => {
    setPracticeCategory(cat);
    setRounds([emptyRound(cat)]);
  };

  // ─── Rounds ──────────────────────────────────────────────────────────────────
  const addRound = () => {
    if (rounds.length < 20) setRounds((prev) => [...prev, emptyRound(practiceCategory)]);
  };

  const removeRound = (index: number) => {
    if (rounds.length > 1) setRounds((prev) => prev.filter((_, i) => i !== index));
  };

  const updateRound = <K extends keyof RoundInput>(index: number, field: K, value: RoundInput[K]) => {
    setRounds((prev) => {
      const next = [...prev];
      const updated: RoundInput = { ...next[index], [field]: value };
      if (field === 'numberArrows' && typeof value === 'number') {
        const max = value as number;
        if (updated.scores && updated.scores.length > max) {
          updated.scores = updated.scores.slice(0, max);
          updated.roundScore = updated.scores.reduce((a, b) => a + b, 0);
        }
      }
      // Auto-expand scoring when user sets numberArrows
      if (field === 'numberArrows' && typeof value === 'number' && value > 0) {
        setExpandedScoring((prev) => {
          const next: Record<number, boolean> = {};
          for (const key of Object.keys(prev)) {
            next[Number(key)] = false;
          }
          next[index] = true;
          return next;
        });
      }
      next[index] = updated;
      return next;
    });
  };

  // ─── Arrow scoring ───────────────────────────────────────────────────────────
  const addArrowScore = (roundIndex: number, score: number) => {
    const round = rounds[roundIndex];
    const maxArrows = round.numberArrows ?? 0;
    const current = round.scores ?? [];
    if (maxArrows > 0 && current.length >= maxArrows) return;
    const newScores = [...current, score];
    const newTotal = newScores.reduce((a, b) => a + b, 0);
    setRounds((prev) => {
      const next = [...prev];
      next[roundIndex] = { ...next[roundIndex], scores: newScores, roundScore: newTotal };
      return next;
    });
  };

  const updateArrowScore = (roundIndex: number, arrowIndex: number, score: number) => {
    const current = rounds[roundIndex].scores ?? [];
    const newScores = [...current];
    newScores[arrowIndex] = score;
    const newTotal = newScores.reduce((a, b) => a + b, 0);
    setRounds((prev) => {
      const next = [...prev];
      next[roundIndex] = { ...next[roundIndex], scores: newScores, roundScore: newTotal };
      return next;
    });
  };

  // ─── Persist last used ───────────────────────────────────────────────────────
  const persistLastUsed = async (validRounds: RoundInput[]) => {
    if (validRounds.length === 0) return;
    const first = validRounds[0];
    const pairs: [string, string][] = [];
    if (first.distanceMeters && first.distanceMeters > 0) pairs.push([STORAGE_KEY_DISTANCE, first.distanceMeters.toString()]);
    if (first.targetType) pairs.push([STORAGE_KEY_TARGET, first.targetType]);
    if (pairs.length > 0) await AsyncStorage.multiSet(pairs).catch(() => {});
  };

  // ─── Build rounds ────────────────────────────────────────────────────────────
  const buildRounds = (validRounds: RoundInput[]): CreateEndData[] =>
    validRounds.map((r) => {
      const round: CreateEndData = {
        roundScore: r.roundScore ?? 0,
      };
      if (r.numberArrows !== undefined) round.arrows = r.numberArrows;
      if (r.arrowsPerEnd !== undefined) round.arrowsPerEnd = r.arrowsPerEnd;
      if (r.arrowsWithoutScore !== undefined) round.arrowsWithoutScore = r.arrowsWithoutScore;
      if (r.distanceMeters !== undefined) round.distanceMeters = r.distanceMeters;
      if (r.distanceFrom !== undefined) round.distanceFrom = r.distanceFrom;
      if (r.distanceTo !== undefined) round.distanceTo = r.distanceTo;
      if (r.targetType) round.targetType = r.targetType;
      if (r.scores && r.scores.length > 0) round.scores = r.scores;
      return round;
    });

  const getValidRounds = () =>
    rounds.filter(
      (r) =>
        (r.distanceMeters && r.distanceMeters > 0) ||
        (r.distanceFrom && r.distanceFrom > 0) ||
        (r.distanceTo && r.distanceTo > 0) ||
        r.targetType ||
        (r.numberArrows ?? 0) > 0 ||
        r.roundScore > 0,
    );

  // ─── Save ────────────────────────────────────────────────────────────────────
  const handleSaveAndFinish = async () => {
    setSubmitting(true);
    setError(null);
    try {
      const validRounds = getValidRounds();

      await persistLastUsed(validRounds);

      const totalScore = validRounds.reduce((sum, r) => sum + (r.roundScore ?? 0), 0);

      if (editingId) {
        const updatePayload = {
          date,
          environment,
          practiceCategory,
          weather,
          location: location || undefined,
          bowId: selectedBow || undefined,
          arrowsId: selectedArrowSet || undefined,
          notes: notes || undefined,
          rating: rating ?? undefined,
          rounds: buildRounds(validRounds),
        };
        await practiceRepository.update(editingId, updatePayload);
      } else {
        const createPayload = {
          date,
          environment,
          practiceCategory,
          weather,
          location: location || undefined,
          bowId: selectedBow || undefined,
          arrowsId: selectedArrowSet || undefined,
          notes: notes || undefined,
          rating: rating ?? undefined,
          totalScore,
          ends: buildRounds(validRounds),
        };
        await practiceRepository.create(createPayload);
      }

      onPracticeSaved?.();
      onClose();
    } catch (err) {
      Sentry.captureException(err);
      setError(err instanceof Error ? err.message : t['practiceForm.saveError']);
    } finally {
      setSubmitting(false);
    }
  };

  // ─── Start shooting ───────────────────────────────────────────────────────────
  const handleStartShooting = async () => {
    setSubmitting(true);
    setError(null);
    try {
      const validRounds = getValidRounds();

      await persistLastUsed(validRounds);

      onClose();

      router.push({
        pathname: '/(tabs)/home/shooting',
        params: {
          date: date.toISOString().split('T')[0],
          bowId: selectedBow || '',
          arrowsId: selectedArrowSet || '',
          notes: notes || '',
          environment,
          practiceCategory,
          weather: JSON.stringify(weather),
          location: location || '',
          rating: rating?.toString() || '',
          distance: validRounds[0]?.distanceMeters?.toString() || '18',
          targetSize: validRounds[0]?.targetType?.replace('cm', '') || '80',
        },
      });
    } catch (err) {
      Sentry.captureException(err);
      setError(err instanceof Error ? err.message : t['practiceForm.startShootingError']);
    } finally {
      setSubmitting(false);
    }
  };

  // ─── Delete ───────────────────────────────────────────────────────────────────
  const handleDelete = async () => {
    if (!editingId) return;
    try {
      await practiceRepository.delete(editingId);
      onPracticeSaved?.();
      onClose();
    } catch (err) {
      Sentry.captureException(err);
    }
  };

  // ═══════════════════════════════════════════════════════════════════════════════
  // Render
  // ═══════════════════════════════════════════════════════════════════════════════

  return (
    <ModalWrapper visible={visible} onClose={handleClose} fullScreen>
      <View style={[styles.safeArea, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
        <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <Pressable onPress={Keyboard.dismiss}>
            <ModalHeader title={isEditing ? t['practiceForm.editTitle'] : t['practiceForm.newTitle']} onPress={handleClose} />
          </Pressable>

          <StepIndicator steps={STEP_LABELS} currentStep={step} onStepPress={setStep} />

          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContainer}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}>
            <Pressable onPress={Keyboard.dismiss}>
              {step === 0 && (
                <InfoStep
                  date={date}
                  onDateChange={setDate}
                  practiceCategory={practiceCategory}
                  onCategoryChange={handleCategoryChange}
                  environment={environment}
                  onEnvironmentChange={setEnvironment}
                  location={location}
                  onLocationChange={setLocation}
                  weather={weather}
                  onToggleWeather={toggleWeather}
                  bowOptions={bowOptions}
                  arrowSetOptions={arrowSetOptions}
                  selectedBow={selectedBow}
                  selectedArrowSet={selectedArrowSet}
                  onBowChange={setSelectedBow}
                  onArrowSetChange={setSelectedArrowSet}
                />
              )}
              {step === 1 && (
                <RoundsStep
                  rounds={rounds}
                  practiceCategory={practiceCategory}
                  environment={environment}
                  scoringMethod={scoringMethod}
                  isEditing={isEditing}
                  submitting={submitting}
                  endPages={endPages}
                  editingIndices={editingIndices}
                  expandedScoring={expandedScoring}
                  onScoringMethodChange={setScoringMethod}
                  onStartShooting={handleStartShooting}
                  onAddRound={addRound}
                  onRemoveRound={removeRound}
                  onUpdateRound={updateRound}
                  onSetEndPage={setEndPage}
                  onSetEditingIndex={setEditingIndex}
                  onAddArrowScore={addArrowScore}
                  onUpdateArrowScore={updateArrowScore}
                  onToggleScoringExpanded={toggleScoringExpanded}
                />
              )}
              {step === 2 && (
                <ReflectionStep rating={rating} onRatingChange={setRating} notes={notes} onNotesChange={setNotes} error={error} />
              )}
            </Pressable>
          </ScrollView>

          <NavigationFooter
            currentStep={step}
            totalSteps={TOTAL_STEPS}
            stepLabels={STEP_LABELS}
            isEditing={isEditing}
            submitting={submitting}
            saveLabel={t['form.save']}
            onPrev={goPrev}
            onNext={goNext}
            onSave={handleSaveAndFinish}
            onDelete={() => setConfirmVisible(true)}
          />
        </KeyboardAvoidingView>
      </View>

      <ConfirmModal
        visible={confirmVisible}
        title={t['practiceForm.deleteTitle']}
        message={t['practiceForm.deleteMessage']}
        onCancel={() => setConfirmVisible(false)}
        onConfirm={() => {
          handleDelete();
          setConfirmVisible(false);
        }}
      />

      <ConfirmModal
        visible={closeConfirmVisible}
        title={t['practiceForm.discardTitle']}
        message={t['practiceForm.discardMessage']}
        confirmLabel={t['practiceForm.discardConfirm']}
        cancelLabel={t['practiceForm.discardCancel']}
        onCancel={() => setCloseConfirmVisible(false)}
        onConfirm={handleConfirmClose}
      />
    </ModalWrapper>
  );
}
