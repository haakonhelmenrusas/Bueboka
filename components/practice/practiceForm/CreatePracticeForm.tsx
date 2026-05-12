import React, { useEffect, useState } from 'react';
import { Keyboard, KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Sentry from '@sentry/react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons/faPlus';
import { faXmark } from '@fortawesome/free-solid-svg-icons/faXmark';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons/faChevronLeft';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons/faChevronRight';
import { faInfo } from '@fortawesome/free-solid-svg-icons/faInfo';

import { Button, DatePicker, Input, ModalHeader, ModalWrapper, Select, Textarea } from '@/components/common';
import ConfirmModal from '@/components/home/DeleteArrowSetModal/ConfirmModal';
import { practiceRepository, type CreateEndData } from '@/services/repositories';
import { Arrows, Bow, Environment, Practice, PracticeCategory } from '@/types';
import { getTargetTypeOptions } from '@/utils/Constants';
import { colors } from '@/styles/colors';
import { useTranslation } from '@/contexts';
import type { TranslationKeys } from '@/lib/i18n';
import { styles } from './CreatePracticeFormStyles';
import { getPracticeCategoryOptions, getEnvironmentOptions, ARROW_SCORE_OPTIONS } from '@/components/practice/shared/formConstants';
import { isRangeCategory, parseNum } from '@/components/practice/shared/formHelpers';
import { useStepNavigation } from '@/components/practice/shared/useStepNavigation';
import { useWeatherSelection } from '@/components/practice/shared/useWeatherSelection';
import { useEquipmentSelection } from '@/components/practice/shared/useEquipmentSelection';
import { StepIndicator } from '@/components/practice/shared/StepIndicator';
import { WeatherSelector } from '@/components/practice/shared/WeatherSelector';
import { EquipmentSelector } from '@/components/practice/shared/EquipmentSelector';
import { NavigationFooter } from '@/components/practice/shared/NavigationFooter';

// ─── Storage keys ────────────────────────────────────────────────────────────
const STORAGE_KEY_DISTANCE = 'bueboka_last_distance';
const STORAGE_KEY_TARGET = 'bueboka_last_target';

// ─── Constants ────────────────────────────────────────────────────────────────
const DEFAULT_ARROWS_PER_END = 3;

// ─── Step definitions ─────────────────────────────────────────────────────────
const TOTAL_STEPS = 4;
const getStepLabels = (t: TranslationKeys): string[] => [
  t['practiceStep.info'],
  t['practiceStep.rounds'],
  t['practiceStep.scoring'],
  t['practiceStep.reflection'],
];

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

function getRoundSummary(round: RoundInput, t: TranslationKeys): string {
  const parts: string[] = [];
  if (round.distanceMeters) parts.push(`${round.distanceMeters}m`);
  if (round.distanceFrom || round.distanceTo) parts.push(`${round.distanceFrom ?? '?'}–${round.distanceTo ?? '?'}m`);
  if (round.targetType) parts.push(round.targetType);
  return parts.length > 0 ? parts.join(' · ') : t['round.noDetails'];
}

function getChipColorStyle(score: number): any {
  if (score >= 9) return styles.arrowChipGold;
  if (score >= 7) return styles.arrowChipRed;
  if (score >= 5) return styles.arrowChipBlue;
  if (score >= 3) return styles.arrowChipBlack;
  if (score >= 1) return styles.arrowChipWhite;
  return styles.arrowChipMiss; // 0 = M
}

function getChipTextColor(score: number): any {
  // Yellow/gold and white backgrounds need dark text
  // Red, blue, black, and miss backgrounds need white text
  if (score >= 9 || (score >= 1 && score <= 2)) {
    return { color: colors.text };
  }
  return { color: colors.white };
}

function getScoreButtonColorStyle(label: string): any {
  switch (label) {
    case 'X':
    case '10':
    case '9':
      return { button: styles.scoreButtonGold, text: { color: colors.text } };
    case '8':
    case '7':
      return { button: styles.scoreButtonRed, text: { color: colors.white } };
    case '6':
    case '5':
      return { button: styles.scoreButtonBlue, text: { color: colors.white } };
    case '4':
    case '3':
      return { button: styles.scoreButtonBlack, text: { color: colors.white } };
    case '2':
    case '1':
      return { button: styles.scoreButtonWhite, text: { color: colors.text } };
    case 'M':
      return { button: styles.scoreButtonMiss, text: { color: colors.textSecondary } };
    default:
      return { button: null, text: { color: colors.text } };
  }
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
  const STEP_LABELS = getStepLabels(t);
  const PRACTICE_CATEGORY_OPTIONS = getPracticeCategoryOptions(t);
  const ENVIRONMENT_OPTIONS = getEnvironmentOptions(t);
  const TARGET_TYPE_OPTIONS = getTargetTypeOptions(t);

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
  // Track which end page is visible per round (for scoring step pagination)
  const [endPages, setEndPages] = useState<Record<number, number>>({});
  // Track which absolute arrow index is being edited per round (null = append mode)
  const [editingIndices, setEditingIndices] = useState<Record<number, number | null>>({});
  // Tracks the ID of the practice being edited – set once at init time.
  // Using local state (not derived from prop) prevents create-vs-update
  // mismatches caused by prop timing / re-render race conditions.
  const [editingId, setEditingId] = useState<string | null>(null);

  // Derived
  const isEditing = !!editingId;

  // Track if user has made any changes to show confirmation on close
  const hasChanges = () => {
    if (isEditing) return true; // Always confirm when editing
    // Check if any field has been modified from defaults
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

    if (editingPractice) {
      // ── Edit mode ──────────────────────────────────────────────────────────
      // Lock in the ID immediately so handleSaveAndFinish always calls update,
      // regardless of any prop changes that happen during the session.
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
            // Derive arrow count from end.arrows; fall back to scores.length
            // for ends that were saved without an explicit arrow count.
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
      // ── Create mode ────────────────────────────────────────────────────────
      setEditingId(null);
      resetForm();

      // `cancelled` prevents this async callback from overwriting rounds if
      // the effect re-runs (e.g. editingPractice arrives after visible=true).
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

  // Clamp endPages whenever scores change (e.g. after backspace)
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
    // Clear editing when navigating between ends
    setEditingIndices((prev) => ({ ...prev, [roundIndex]: null }));
    setEndPages((prev) => ({ ...prev, [roundIndex]: page }));
  };

  const setEditingIndex = (roundIndex: number, idx: number | null) => {
    setEditingIndices((prev) => ({ ...prev, [roundIndex]: idx }));
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
  // Builds round data matching API RoundInputSchema
  const buildRounds = (validRounds: RoundInput[]): CreateEndData[] =>
    validRounds.map((r) => {
      const round: CreateEndData = {
        roundScore: r.roundScore ?? 0,
      };
      if (r.numberArrows !== undefined) round.arrows = r.numberArrows; // API expects 'arrows'
      if (r.arrowsPerEnd !== undefined) round.arrowsPerEnd = r.arrowsPerEnd;
      if (r.arrowsWithoutScore !== undefined) round.arrowsWithoutScore = r.arrowsWithoutScore;
      if (r.distanceMeters !== undefined) round.distanceMeters = r.distanceMeters;
      if (r.distanceFrom !== undefined) round.distanceFrom = r.distanceFrom;
      if (r.distanceTo !== undefined) round.distanceTo = r.distanceTo;
      if (r.targetType) round.targetType = r.targetType;
      // Include per-arrow scores when present so they survive save/reload cycles.
      if (r.scores && r.scores.length > 0) round.scores = r.scores;
      return round;
    });

  // ─── Save ────────────────────────────────────────────────────────────────────
  const handleSaveAndFinish = async () => {
    setSubmitting(true);
    setError(null);
    try {
      const validRounds = rounds.filter(
        (r) =>
          (r.distanceMeters && r.distanceMeters > 0) ||
          (r.distanceFrom && r.distanceFrom > 0) ||
          (r.distanceTo && r.distanceTo > 0) ||
          r.targetType ||
          (r.numberArrows ?? 0) > 0 ||
          r.roundScore > 0,
      );

      await persistLastUsed(validRounds);

      // Calculate total score from all rounds
      const totalScore = validRounds.reduce((sum, r) => sum + (r.roundScore ?? 0), 0);

      if (editingId) {
        // Update uses 'rounds'
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
        // Create uses 'ends' and requires 'totalScore'
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
      const validRounds = rounds.filter(
        (r) =>
          (r.distanceMeters && r.distanceMeters > 0) ||
          (r.distanceFrom && r.distanceFrom > 0) ||
          (r.distanceTo && r.distanceTo > 0) ||
          r.targetType ||
          (r.numberArrows ?? 0) > 0 ||
          r.roundScore > 0,
      );

      await persistLastUsed(validRounds);

      onClose();

      // Navigate to shooting screen with form data - practice will be created when scores are saved
      router.push({
        pathname: '/(tabs)/home/shooting',
        params: {
          // Don't pass ID - practice doesn't exist yet
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
  // Step renderers
  // ═══════════════════════════════════════════════════════════════════════════════

  const renderInfoStep = () => (
    <View style={styles.stepContent}>
      <View style={styles.row}>
        <DatePicker label={t['form.date']} value={date} onDateChange={setDate} containerStyle={styles.field} />
        <Select
          label={t['form.category']}
          options={PRACTICE_CATEGORY_OPTIONS}
          selectedValue={practiceCategory}
          onValueChange={(v) => handleCategoryChange(v as PracticeCategory)}
          containerStyle={styles.field}
        />
      </View>

      <View style={styles.row}>
        <Select
          label={t['form.environment']}
          options={ENVIRONMENT_OPTIONS}
          selectedValue={environment}
          onValueChange={(v) => setEnvironment(v as Environment)}
          containerStyle={styles.field}
        />
        <Input
          label={t['form.location']}
          value={location}
          onChangeText={setLocation}
          placeholder={t['form.locationPlaceholder']}
          maxLength={64}
          containerStyle={styles.field}
        />
      </View>

      {environment === Environment.OUTDOOR && <WeatherSelector selectedWeather={weather} onToggleWeather={toggleWeather} />}

      <EquipmentSelector
        bowOptions={bowOptions}
        arrowSetOptions={arrowSetOptions}
        selectedBow={selectedBow}
        selectedArrowSet={selectedArrowSet}
        onBowChange={setSelectedBow}
        onArrowSetChange={setSelectedArrowSet}
      />
    </View>
  );

  const renderRoundsStep = () => (
    <View style={styles.stepContent}>
      <View style={styles.roundsSection}>
        {rounds.map((round, index) => {
          const rangeMode = isRangeCategory(practiceCategory);
          return (
            <View key={index} style={styles.roundCard}>
              <View style={styles.roundHeader}>
                <Text style={styles.roundNumber}>{`${t['round.title']} ${index + 1}`}</Text>
                {rounds.length > 1 && (
                  <TouchableOpacity style={styles.removeRoundBtn} onPress={() => removeRound(index)} accessibilityLabel={t['round.remove']}>
                    <FontAwesomeIcon icon={faXmark} size={16} color={colors.textSecondary} />
                  </TouchableOpacity>
                )}
              </View>

              <View style={styles.roundFields}>
                {rangeMode ? (
                  <>
                    <Input
                      label={t['form.distanceFrom']}
                      value={round.distanceFrom !== undefined ? String(round.distanceFrom) : ''}
                      onChangeText={(v) => updateRound(index, 'distanceFrom', parseNum(v))}
                      keyboardType="numeric"
                      containerStyle={styles.roundField}
                    />
                    <Input
                      label={t['form.distanceTo']}
                      value={round.distanceTo !== undefined ? String(round.distanceTo) : ''}
                      onChangeText={(v) => updateRound(index, 'distanceTo', parseNum(v))}
                      keyboardType="numeric"
                      containerStyle={styles.roundField}
                    />
                  </>
                ) : (
                  <>
                    <Input
                      label={t['form.distance']}
                      value={round.distanceMeters !== undefined ? String(round.distanceMeters) : ''}
                      onChangeText={(v) => updateRound(index, 'distanceMeters', parseNum(v))}
                      keyboardType="numeric"
                      containerStyle={styles.roundField}
                    />
                    <Select
                      label={t['form.target']}
                      options={TARGET_TYPE_OPTIONS}
                      selectedValue={round.targetType}
                      onValueChange={(v) => updateRound(index, 'targetType', v as string)}
                      placeholder={t['form.choose']}
                      searchable
                      containerStyle={styles.roundField}
                    />
                  </>
                )}
              </View>

              <View style={styles.roundFields}>
                <Input
                  label={t['form.arrowsWithScore']}
                  optional
                  value={round.numberArrows !== undefined ? String(round.numberArrows) : ''}
                  onChangeText={(v) => updateRound(index, 'numberArrows', parseNum(v))}
                  keyboardType="numeric"
                  containerStyle={styles.roundField}
                />
                <Input
                  label={t['form.arrowsPerEnd']}
                  optional
                  value={round.arrowsPerEnd !== undefined ? String(round.arrowsPerEnd) : ''}
                  onChangeText={(v) => updateRound(index, 'arrowsPerEnd', parseNum(v))}
                  keyboardType="numeric"
                  containerStyle={styles.roundField}
                />
              </View>

              <View style={styles.roundFields}>
                <Input
                  label={t['form.score']}
                  optional
                  value={round.roundScore !== 0 ? String(round.roundScore) : ''}
                  onChangeText={(v) => updateRound(index, 'roundScore', parseNum(v) ?? 0)}
                  keyboardType="numeric"
                  containerStyle={styles.roundField}
                />
                <Input
                  label={t['form.arrowsWithoutScore']}
                  optional
                  value={round.arrowsWithoutScore !== undefined ? String(round.arrowsWithoutScore) : ''}
                  onChangeText={(v) => updateRound(index, 'arrowsWithoutScore', parseNum(v))}
                  keyboardType="numeric"
                  containerStyle={styles.roundField}
                />
              </View>
            </View>
          );
        })}

        <TouchableOpacity
          style={[styles.addRoundBtn, rounds.length >= 20 && { opacity: 0.4 }]}
          onPress={addRound}
          disabled={rounds.length >= 20}>
          <FontAwesomeIcon icon={faPlus} size={14} color={colors.primary} />
          <Text style={styles.addRoundBtnText}>{t['round.add']}</Text>
        </TouchableOpacity>
        {rounds.length >= 20 && <Text style={styles.limitMessage}>{t['round.maxLimit']}</Text>}
      </View>
    </View>
  );

  const renderScoringStep = () => {
    const roundsWithArrows = rounds.filter((r) => (r.numberArrows ?? 0) > 0);

    return (
      <View style={styles.stepContent}>
        {/* Scoring method selection */}
        <View style={styles.scoringMethodSection}>
          <Text style={styles.sectionTitle}>{t['scoring.methodSection']}</Text>
          <View style={styles.scoringMethodButtons}>
            <Pressable
              style={[styles.scoringMethodButton, scoringMethod === 'buttons' && styles.scoringMethodButtonActive]}
              onPress={() => setScoringMethod('buttons')}>
              <Text style={[styles.scoringMethodButtonText, scoringMethod === 'buttons' && styles.scoringMethodButtonTextActive]}>
                {t['scoring.methodButtons']}
              </Text>
            </Pressable>
            <Pressable
              style={[styles.scoringMethodButton, scoringMethod === 'target' && styles.scoringMethodButtonActive]}
              onPress={() => setScoringMethod('target')}>
              <Text style={[styles.scoringMethodButtonText, scoringMethod === 'target' && styles.scoringMethodButtonTextActive]}>
                {t['scoring.methodTarget']}
              </Text>
            </Pressable>
          </View>
        </View>

        {/* Start shooting button */}
        {!isEditing && scoringMethod === 'target' && (
          <View style={styles.startShootingSection}>
            <Button label={t['scoring.startShooting']} onPress={handleStartShooting} disabled={submitting} loading={submitting} />
          </View>
        )}

        {scoringMethod === 'buttons' && (
          <>
            {roundsWithArrows.length === 0 && (
              <View style={styles.emptyScoring}>
                <Text style={styles.emptyScoringText}>{t['scoring.noArrowRounds']}</Text>
              </View>
            )}

            {rounds.map((round, roundIndex) => {
              const maxArrows = round.numberArrows ?? 0;
              const hasManualScore = round.roundScore > 0 && (round.scores ?? []).length === 0;

              // Nothing to show for this round
              if (maxArrows === 0 && !hasManualScore) return null;

              // Round has a manually entered total score – show informational notice
              if (hasManualScore) {
                return (
                  <View key={roundIndex} style={styles.scoringCard}>
                    <View style={styles.scoringCardHeader}>
                      <Text style={styles.scoringRoundTitle}>{`${t['round.title']} ${roundIndex + 1}`}</Text>
                      <Text style={styles.scoringRoundMeta}>{getRoundSummary(round, t)}</Text>
                    </View>
                    <View style={styles.manualScoreNotice}>
                      <FontAwesomeIcon icon={faInfo} size={16} color={colors.info} style={styles.manualScoreNoticeIcon} />
                      <View style={styles.manualScoreNoticeBody}>
                        <Text
                          style={
                            styles.manualScoreNoticeMain
                          }>{`${t['scoring.totalScoreLabel']} ${round.roundScore} ${t['scoring.points']}`}</Text>
                        <Text style={styles.manualScoreNoticeHint}>{t['scoring.manualScoreHint']}</Text>
                      </View>
                    </View>
                  </View>
                );
              }

              const currentScores = round.scores ?? [];
              const filledCount = currentScores.length;
              const total = currentScores.reduce((a, b) => a + b, 0);
              const isFull = filledCount >= maxArrows;

              const arrowsPerEnd = round.arrowsPerEnd ?? DEFAULT_ARROWS_PER_END;
              const totalEnds = Math.ceil(maxArrows / arrowsPerEnd);
              const activeEndPage = isFull ? totalEnds - 1 : Math.floor(filledCount / arrowsPerEnd);
              const currentEndPage = Math.min(endPages[roundIndex] ?? activeEndPage, activeEndPage);

              const startIdx = currentEndPage * arrowsPerEnd;
              const endIdx = Math.min(startIdx + arrowsPerEnd, maxArrows);
              const arrowsInThisEnd = endIdx - startIdx;
              const endScores = currentScores.slice(startIdx, endIdx);

              const isActiveEnd = !isFull && currentEndPage === activeEndPage;
              const isEndFilled = endScores.length >= arrowsInThisEnd;

              const canGoPrev = currentEndPage > 0;
              const canGoNext = currentEndPage < activeEndPage;

              const editingIdx = editingIndices[roundIndex] ?? null;
              const isEditing = editingIdx !== null;
              const showScoreButtons = (isActiveEnd && !isEndFilled) || isEditing;

              return (
                <View key={roundIndex} style={styles.scoringCard}>
                  <View style={styles.scoringCardHeader}>
                    <Text style={styles.scoringRoundTitle}>{`${t['round.title']} ${roundIndex + 1}`}</Text>
                    <Text style={styles.scoringRoundMeta}>{getRoundSummary(round, t)}</Text>
                  </View>

                  {/* End navigation */}
                  {totalEnds > 1 && (
                    <View style={styles.endNav}>
                      <TouchableOpacity
                        style={[styles.endNavBtn, !canGoPrev && styles.endNavBtnDisabled]}
                        onPress={() => setEndPage(roundIndex, currentEndPage - 1)}
                        disabled={!canGoPrev}
                        accessibilityLabel={t['scoring.previousEnd']}>
                        <FontAwesomeIcon icon={faChevronLeft} size={18} color={canGoPrev ? colors.primary : colors.textSecondary} />
                      </TouchableOpacity>
                      <Text style={styles.endNavLabel}>{`${t['scoring.endLabel']} ${currentEndPage + 1} / ${totalEnds}`}</Text>
                      <TouchableOpacity
                        style={[styles.endNavBtn, !canGoNext && styles.endNavBtnDisabled]}
                        onPress={() => setEndPage(roundIndex, currentEndPage + 1)}
                        disabled={!canGoNext}
                        accessibilityLabel={t['scoring.nextEnd']}>
                        <FontAwesomeIcon icon={faChevronRight} size={18} color={canGoNext ? colors.primary : colors.textSecondary} />
                      </TouchableOpacity>
                    </View>
                  )}

                  {/* Arrow score chips */}
                  <View style={[styles.arrowChipsRow, arrowsInThisEnd <= 6 && { flexWrap: 'nowrap' }]}>
                    {Array.from({ length: arrowsInThisEnd }).map((_, i) => {
                      const absIdx = startIdx + i;
                      const scored = endScores[i] !== undefined;
                      const isThisChipEditing = editingIdx === absIdx;

                      return (
                        <Pressable
                          key={i}
                          style={[
                            styles.arrowChip,
                            styles.arrowChipLarge,
                            isThisChipEditing && styles.arrowChipEditing,
                            scored ? [styles.arrowChipFilled, getChipColorStyle(endScores[i])] : styles.arrowChipEmpty,
                          ]}
                          onPress={scored ? () => setEditingIndex(roundIndex, isThisChipEditing ? null : absIdx) : undefined}
                          accessibilityLabel={
                            scored ? `${t['scoring.editArrowAriaPrefix']} ${i + 1}: ${endScores[i]} ${t['scoring.points']}` : undefined
                          }>
                          <Text
                            style={[
                              styles.arrowChipText,
                              styles.arrowChipTextLarge,
                              scored ? getChipTextColor(endScores[i]) : styles.arrowChipTextEmpty,
                            ]}>
                            {scored ? String(endScores[i]) : '–'}
                          </Text>
                        </Pressable>
                      );
                    })}
                  </View>

                  <View style={styles.scoringProgress}>
                    <Text
                      style={
                        styles.scoringProgressText
                      }>{`${filledCount} ${t['scoring.of']} ${maxArrows} ${t['scoring.arrowsRecorded']}`}</Text>
                    {filledCount > 0 && <Text style={styles.scoringTotal}>{`${t['scoring.sum']} ${total}`}</Text>}
                  </View>

                  {/* Score buttons */}
                  {showScoreButtons && (
                    <>
                      {isEditing && (
                        <Text style={styles.editingHint}>{`${t['scoring.editingArrowPrefix']} ${(editingIdx! % arrowsPerEnd) + 1}`}</Text>
                      )}
                      <View style={styles.scoreButtonsGrid}>
                        {ARROW_SCORE_OPTIONS.filter((opt) => opt.label !== 'X' || environment === Environment.OUTDOOR).map((opt) => {
                          const { button: buttonStyle, text: textStyle } = getScoreButtonColorStyle(opt.label);
                          return (
                            <Pressable
                              key={opt.label}
                              style={[styles.scoreButton, buttonStyle]}
                              onPress={() => {
                                if (isEditing) {
                                  updateArrowScore(roundIndex, editingIdx!, opt.value);
                                  setEditingIndex(roundIndex, null);
                                } else {
                                  addArrowScore(roundIndex, opt.value);
                                }
                              }}>
                              <Text style={[styles.scoreButtonText, textStyle]}>{opt.label}</Text>
                            </Pressable>
                          );
                        })}
                      </View>
                    </>
                  )}

                  {/* Complete banners */}
                  {isFull && !isEditing && currentEndPage === totalEnds - 1 && (
                    <View style={styles.scoringComplete}>
                      <Text style={styles.scoringCompleteText}>{`${t['scoring.allRegistered']} ${t['scoring.scoreSuffix']} ${total}`}</Text>
                    </View>
                  )}
                  {!isFull && isEndFilled && !isActiveEnd && !isEditing && canGoNext && (
                    <Button
                      label={t['scoring.nextEnd']}
                      onPress={() => setEndPage(roundIndex, currentEndPage + 1)}
                      buttonStyle={{ width: '100%' }}
                    />
                  )}
                </View>
              );
            })}
          </>
        )}
      </View>
    );
  };

  const renderReflectionStep = () => (
    <View style={styles.stepContent}>
      <View style={styles.ratingSection}>
        <Text style={styles.ratingLabel}>{t['reflection.ratingLabel']}</Text>
        <Text style={styles.ratingHelpText}>{t['reflection.ratingPromptPractice']}</Text>
        <View style={styles.ratingButtons}>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => {
            const active = rating === num;
            return (
              <Pressable
                key={num}
                style={[styles.ratingButton, active && styles.ratingButtonActive]}
                onPress={() => setRating(active ? null : num)}
                accessibilityLabel={`${t['reflection.ratingAriaPrefix']} ${num} ${t['scoring.of']} 10`}>
                <Text style={[styles.ratingButtonText, active && styles.ratingButtonTextActive]}>{num}</Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <Textarea
        label={t['form.notes']}
        optional
        value={notes}
        onChangeText={setNotes}
        placeholderText={t['reflection.notesPlaceholder']}
        maxLength={500}
        containerStyle={styles.inputContainer}
      />

      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );

  // ═══════════════════════════════════════════════════════════════════════════════
  // Render
  // ═══════════════════════════════════════════════════════════════════════════════

  return (
    <ModalWrapper visible={visible} onClose={handleClose} fullScreen>
      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
        <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          {/* Fixed header */}
          <Pressable onPress={Keyboard.dismiss}>
            <ModalHeader title={isEditing ? t['practiceForm.editTitle'] : t['practiceForm.newTitle']} onPress={handleClose} />
          </Pressable>

          <StepIndicator steps={STEP_LABELS} currentStep={step} onStepPress={setStep} />

          {/* Scrollable content */}
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContainer}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}>
            <Pressable onPress={Keyboard.dismiss}>
              {step === 0 && renderInfoStep()}
              {step === 1 && renderRoundsStep()}
              {step === 2 && renderScoringStep()}
              {step === 3 && renderReflectionStep()}
            </Pressable>
          </ScrollView>

          {/* Fixed navigation footer */}
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
      </SafeAreaView>

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
