import React, { useEffect, useState } from 'react';
import { Keyboard, KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import * as Sentry from '@sentry/react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faTrashCan } from '@fortawesome/free-regular-svg-icons/faTrashCan';
import { faPlus } from '@fortawesome/free-solid-svg-icons/faPlus';
import { faXmark } from '@fortawesome/free-solid-svg-icons/faXmark';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons/faChevronLeft';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons/faChevronRight';
import { faDeleteLeft } from '@fortawesome/free-solid-svg-icons/faDeleteLeft';

import { Button, DatePicker, Input, ModalHeader, ModalWrapper, Select, Textarea } from '@/components/common';
import ConfirmModal from '@/components/home/DeleteArrowSetModal/ConfirmModal';
import { practiceRepository, type CreateEndData } from '@/services/repositories';
import { Arrows, Bow, Environment, Practice, PracticeCategory, WeatherCondition } from '@/types';
import { TARGET_TYPE_OPTIONS } from '@/utils/Constants';
import { colors } from '@/styles/colors';
import { styles } from './CreatePracticeFormStyles';

// ─── Storage keys ────────────────────────────────────────────────────────────
const STORAGE_KEY_DISTANCE = 'bueboka_last_distance';
const STORAGE_KEY_TARGET = 'bueboka_last_target';

// ─── Step definitions ─────────────────────────────────────────────────────────
const TOTAL_STEPS = 4;
const STEP_LABELS = ['Info', 'Runder', 'Poeng', 'Refleksjon'];

// ─── Option lists ─────────────────────────────────────────────────────────────
const PRACTICE_CATEGORY_OPTIONS = [
  { label: 'Skive innendørs', value: PracticeCategory.SKIVE_INDOOR },
  { label: 'Skive utendørs', value: PracticeCategory.SKIVE_OUTDOOR },
  { label: 'Jakt 3D', value: PracticeCategory.JAKT_3D },
  { label: 'Felt', value: PracticeCategory.FELT },
];

const ENVIRONMENT_OPTIONS = [
  { label: 'Innendørs', value: Environment.INDOOR },
  { label: 'Utendørs', value: Environment.OUTDOOR },
];

const WEATHER_OPTIONS: { value: WeatherCondition; label: string }[] = [
  { value: WeatherCondition.SUN, label: '☀️ Sol' },
  { value: WeatherCondition.CLOUDED, label: '⛅ Skyet' },
  { value: WeatherCondition.CLEAR, label: '🌤 Klart' },
  { value: WeatherCondition.RAIN, label: '🌧 Regn' },
  { value: WeatherCondition.WIND, label: '💨 Vind' },
  { value: WeatherCondition.SNOW, label: '❄️ Snø' },
  { value: WeatherCondition.FOG, label: '🌫 Tåke' },
  { value: WeatherCondition.THUNDER, label: '⛈ Torden' },
  { value: WeatherCondition.CHANGING_CONDITIONS, label: '🔄 Skiftende' },
  { value: WeatherCondition.OTHER, label: '🌡 Annet' },
];

const ARROW_SCORE_OPTIONS = [
  { label: 'X', value: 10 },
  { label: '10', value: 10 },
  { label: '9', value: 9 },
  { label: '8', value: 8 },
  { label: '7', value: 7 },
  { label: '6', value: 6 },
  { label: '5', value: 5 },
  { label: '4', value: 4 },
  { label: '3', value: 3 },
  { label: '2', value: 2 },
  { label: '1', value: 1 },
  { label: 'M', value: 0 },
];

// ─── Types ────────────────────────────────────────────────────────────────────
export interface RoundInput {
  distanceMeters?: number;
  distanceFrom?: number;
  distanceTo?: number;
  targetType: string;
  numberArrows?: number;
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
function isRangeCategory(cat: PracticeCategory): boolean {
  return cat === PracticeCategory.JAKT_3D || cat === PracticeCategory.FELT;
}

function emptyRound(cat: PracticeCategory): RoundInput {
  return isRangeCategory(cat)
    ? {
        distanceFrom: undefined,
        distanceTo: undefined,
        targetType: '',
        numberArrows: undefined,
        arrowsWithoutScore: undefined,
        roundScore: 0,
        scores: [],
      }
    : { distanceMeters: undefined, targetType: '', numberArrows: undefined, arrowsWithoutScore: undefined, roundScore: 0, scores: [] };
}

function getRoundSummary(round: RoundInput): string {
  const parts: string[] = [];
  if (round.distanceMeters) parts.push(`${round.distanceMeters}m`);
  if (round.distanceFrom || round.distanceTo) parts.push(`${round.distanceFrom ?? '?'}–${round.distanceTo ?? '?'}m`);
  if (round.targetType) parts.push(round.targetType);
  return parts.length > 0 ? parts.join(' · ') : 'Ingen detaljer';
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

  // Step state
  const [step, setStep] = useState(0);

  // Form state
  const [date, setDate] = useState(new Date());
  const [practiceCategory, setPracticeCategory] = useState<PracticeCategory>(PracticeCategory.SKIVE_INDOOR);
  const [environment, setEnvironment] = useState<Environment>(Environment.INDOOR);
  const [weather, setWeather] = useState<WeatherCondition[]>([]);
  const [location, setLocation] = useState('');
  const [selectedBow, setSelectedBow] = useState('');
  const [selectedArrowSet, setSelectedArrowSet] = useState('');
  const [rounds, setRounds] = useState<RoundInput[]>([emptyRound(PracticeCategory.SKIVE_INDOOR)]);
  const [rating, setRating] = useState<number | null>(null);
  const [notes, setNotes] = useState('');

  // UI state
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmVisible, setConfirmVisible] = useState(false);
  // Tracks the ID of the practice being edited – set once at init time.
  // Using local state (not derived from prop) prevents create-vs-update
  // mismatches caused by prop timing / re-render race conditions.
  const [editingId, setEditingId] = useState<string | null>(null);

  // Derived
  const validBows = Array.isArray(bows) ? bows : [];
  const validArrowSets = Array.isArray(arrowSets) ? arrowSets : [];
  const bowOptions = validBows.map((b) => ({ label: b.name, value: b.id }));
  const arrowSetOptions = validArrowSets.map((a) => ({ label: a.name, value: a.id }));
  const isEditing = !!editingId;

  // ─── Init form ───────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!visible) {
      setEditingId(null);
      return;
    }

    setStep(0);
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

      const favBow = validBows.find((b) => b.isFavorite);
      setSelectedBow(favBow ? favBow.id : '');
      const favArrows = validArrowSets.find((a) => a.isFavorite);
      setSelectedArrowSet(favArrows ? favArrows.id : '');

      return () => {
        cancelled = true;
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, editingPractice?.id]);

  useEffect(() => {
    if (environment !== Environment.OUTDOOR) setWeather([]);
  }, [environment]);

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
    resetForm();
    onClose();
  };

  // ─── Navigation ──────────────────────────────────────────────────────────────
  const goNext = () => setStep((s) => Math.min(s + 1, TOTAL_STEPS - 1));
  const goPrev = () => setStep((s) => Math.max(s - 1, 0));

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

  const parseNum = (text: string): number | undefined => {
    const n = parseFloat(text);
    return isNaN(n) ? undefined : n;
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

  const removeLastArrowScore = (roundIndex: number) => {
    const current = rounds[roundIndex].scores ?? [];
    if (current.length === 0) return;
    const newScores = current.slice(0, -1);
    const newTotal = newScores.reduce((a, b) => a + b, 0);
    setRounds((prev) => {
      const next = [...prev];
      next[roundIndex] = { ...next[roundIndex], scores: newScores, roundScore: newTotal };
      return next;
    });
  };

  // ─── Weather ─────────────────────────────────────────────────────────────────
  const toggleWeather = (condition: WeatherCondition) => {
    setWeather((prev) => (prev.includes(condition) ? prev.filter((w) => w !== condition) : [...prev, condition]));
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

  // ─── Build ends ──────────────────────────────────────────────────────────────
  // Note: `scores` (per-arrow breakdown) is intentionally excluded from this
  // payload. roundScore is the aggregated sum computed from per-arrow scores.
  // Per-arrow scores (scores[]) ARE accepted by the backend and are included
  // so they can be restored when re-opening the practice for editing.
  const buildEnds = (validRounds: RoundInput[]): CreateEndData[] =>
    validRounds.map((r) => {
      const end: CreateEndData = {
        roundScore: r.roundScore ?? 0,
      };
      if (r.numberArrows !== undefined) end.arrows = r.numberArrows;
      if (r.arrowsWithoutScore !== undefined) end.arrowsWithoutScore = r.arrowsWithoutScore;
      if (r.distanceMeters !== undefined) end.distanceMeters = r.distanceMeters;
      if (r.distanceFrom !== undefined) end.distanceFrom = r.distanceFrom;
      if (r.distanceTo !== undefined) end.distanceTo = r.distanceTo;
      if (r.targetType) end.targetType = r.targetType;
      // Include per-arrow scores when present so they survive save/reload cycles.
      if (r.scores && r.scores.length > 0) end.scores = r.scores;
      return end;
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

      const payload = {
        date,
        environment,
        practiceCategory,
        weather,
        location: location || undefined,
        bowId: selectedBow || undefined,
        arrowsId: selectedArrowSet || undefined,
        notes: notes || undefined,
        rating: rating ?? undefined,
        ends: buildEnds(validRounds),
      };

      if (editingId) {
        await practiceRepository.update(editingId, payload);
      } else {
        await practiceRepository.create(payload);
      }

      onPracticeSaved?.();
      onClose();
    } catch (err) {
      Sentry.captureException(err);
      setError(err instanceof Error ? err.message : 'Kunne ikke lagre trening.');
    } finally {
      setSubmitting(false);
    }
  };

  // ─── Start shooting ───────────────────────────────────────────────────────────
  const handleStartShooting = async () => {
    setSubmitting(true);
    setError(null);
    try {
      const savedPractice = await practiceRepository.create({
        date,
        environment,
        practiceCategory,
        weather,
        location: location || undefined,
        bowId: selectedBow || undefined,
        arrowsId: selectedArrowSet || undefined,
        notes: notes || undefined,
        rating: rating ?? undefined,
      });

      onPracticeSaved?.();

      router.push({
        pathname: '/practice/shooting',
        params: {
          id: savedPractice.id,
          date: date.toISOString().split('T')[0],
          bowId: selectedBow || '',
          arrowSet: selectedArrowSet || '',
          notes: notes || '',
          environment,
          location: location || '',
        },
      });
      onClose();
    } catch (err) {
      Sentry.captureException(err);
      setError(err instanceof Error ? err.message : 'Kunne ikke starte skyteøkten.');
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
        <DatePicker label="Dato" value={date} onDateChange={setDate} containerStyle={styles.field} />
        <Select
          label="Kategori"
          options={PRACTICE_CATEGORY_OPTIONS}
          selectedValue={practiceCategory}
          onValueChange={(v) => handleCategoryChange(v as PracticeCategory)}
          containerStyle={styles.field}
        />
      </View>

      <View style={styles.row}>
        <Select
          label="Miljø"
          options={ENVIRONMENT_OPTIONS}
          selectedValue={environment}
          onValueChange={(v) => setEnvironment(v as Environment)}
          containerStyle={styles.field}
        />
        <Input
          label="Sted"
          value={location}
          onChangeText={setLocation}
          placeholder="F.eks. Oslo"
          maxLength={64}
          containerStyle={styles.field}
        />
      </View>

      {environment === Environment.OUTDOOR && (
        <View style={styles.weatherSection}>
          <Text style={styles.weatherLabel}>Vær (valgfritt)</Text>
          <View style={styles.weatherChips}>
            {WEATHER_OPTIONS.map((opt) => {
              const active = weather.includes(opt.value);
              return (
                <Pressable
                  key={opt.value}
                  style={[styles.weatherChip, active && styles.weatherChipActive]}
                  onPress={() => toggleWeather(opt.value)}>
                  <Text style={[styles.weatherChipText, active && styles.weatherChipTextActive]}>{opt.label}</Text>
                </Pressable>
              );
            })}
          </View>
        </View>
      )}

      {(bowOptions.length > 0 || arrowSetOptions.length > 0) && (
        <View>
          <Text style={styles.sectionTitle}>Utstyr</Text>
          <View style={styles.row}>
            {bowOptions.length > 0 && (
              <Select
                label="🏹 Bue"
                options={bowOptions}
                selectedValue={selectedBow}
                onValueChange={setSelectedBow}
                placeholder="Velg bue (valgfritt)"
                containerStyle={styles.field}
              />
            )}
            {arrowSetOptions.length > 0 && (
              <Select
                label="🎯 Piler"
                options={arrowSetOptions}
                selectedValue={selectedArrowSet}
                onValueChange={setSelectedArrowSet}
                placeholder="Velg piler (valgfritt)"
                containerStyle={styles.field}
              />
            )}
          </View>
        </View>
      )}
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
                <Text style={styles.roundNumber}>Runde {index + 1}</Text>
                {rounds.length > 1 && (
                  <TouchableOpacity style={styles.removeRoundBtn} onPress={() => removeRound(index)} accessibilityLabel="Fjern runde">
                    <FontAwesomeIcon icon={faXmark} size={16} color={colors.textSecondary} />
                  </TouchableOpacity>
                )}
              </View>

              <View style={styles.roundFields}>
                {rangeMode ? (
                  <>
                    <Input
                      label="Fra (m)"
                      value={round.distanceFrom !== undefined ? String(round.distanceFrom) : ''}
                      onChangeText={(t) => updateRound(index, 'distanceFrom', parseNum(t))}
                      keyboardType="numeric"
                      containerStyle={styles.roundField}
                    />
                    <Input
                      label="Til (m)"
                      value={round.distanceTo !== undefined ? String(round.distanceTo) : ''}
                      onChangeText={(t) => updateRound(index, 'distanceTo', parseNum(t))}
                      keyboardType="numeric"
                      containerStyle={styles.roundField}
                    />
                  </>
                ) : (
                  <>
                    <Input
                      label="Avstand (m)"
                      value={round.distanceMeters !== undefined ? String(round.distanceMeters) : ''}
                      onChangeText={(t) => updateRound(index, 'distanceMeters', parseNum(t))}
                      keyboardType="numeric"
                      containerStyle={styles.roundField}
                    />
                    <Select
                      label="Skive"
                      options={TARGET_TYPE_OPTIONS}
                      selectedValue={round.targetType}
                      onValueChange={(v) => updateRound(index, 'targetType', v as string)}
                      placeholder="Velg"
                      searchable
                      containerStyle={styles.roundField}
                    />
                  </>
                )}
              </View>

              <View style={styles.roundFields}>
                <Input
                  label="Piler m/score"
                  optional
                  value={round.numberArrows !== undefined ? String(round.numberArrows) : ''}
                  onChangeText={(t) => updateRound(index, 'numberArrows', parseNum(t))}
                  keyboardType="numeric"
                  containerStyle={styles.roundField}
                />
                <Input
                  label="Score"
                  optional
                  value={round.roundScore !== 0 ? String(round.roundScore) : ''}
                  onChangeText={(t) => updateRound(index, 'roundScore', parseNum(t) ?? 0)}
                  keyboardType="numeric"
                  containerStyle={styles.roundField}
                />
              </View>

              <Input
                label="Piler u/score"
                optional
                value={round.arrowsWithoutScore !== undefined ? String(round.arrowsWithoutScore) : ''}
                onChangeText={(t) => updateRound(index, 'arrowsWithoutScore', parseNum(t))}
                keyboardType="numeric"
                containerStyle={{ width: '48%' }}
              />
            </View>
          );
        })}

        <TouchableOpacity
          style={[styles.addRoundBtn, rounds.length >= 20 && { opacity: 0.4 }]}
          onPress={addRound}
          disabled={rounds.length >= 20}>
          <FontAwesomeIcon icon={faPlus} size={14} color={colors.primary} />
          <Text style={styles.addRoundBtnText}>Legg til runde</Text>
        </TouchableOpacity>
        {rounds.length >= 20 && <Text style={styles.limitMessage}>Maksimalt 20 runder er tillatt</Text>}
      </View>
    </View>
  );

  const renderScoringStep = () => {
    const roundsWithArrows = rounds.filter((r) => (r.numberArrows ?? 0) > 0);

    return (
      <View style={styles.stepContent}>
        <Text style={styles.stepDescription}>
          Legg inn poengsetting per pil (valgfritt). Poengsummen beregnes automatisk og oppdaterer rundescore.
        </Text>

        {roundsWithArrows.length === 0 && (
          <View style={styles.emptyScoring}>
            <Text style={styles.emptyScoringText}>
              Ingen runder med definert antall piler.{'\n'}Gå tilbake til «Runder» og fyll inn «Piler m/score».
            </Text>
          </View>
        )}

        {rounds.map((round, roundIndex) => {
          const maxArrows = round.numberArrows ?? 0;
          if (maxArrows === 0) return null;

          const currentScores = round.scores ?? [];
          const filledCount = currentScores.length;
          const total = currentScores.reduce((a, b) => a + b, 0);
          const isFull = filledCount >= maxArrows;

          return (
            <View key={roundIndex} style={styles.scoringCard}>
              <View style={styles.scoringCardHeader}>
                <Text style={styles.scoringRoundTitle}>Runde {roundIndex + 1}</Text>
                <Text style={styles.scoringRoundMeta}>{getRoundSummary(round)}</Text>
              </View>

              {/* Arrow score chips */}
              <View style={styles.arrowChipsRow}>
                {Array.from({ length: maxArrows }).map((_, i) => {
                  const scored = currentScores[i] !== undefined;
                  return (
                    <View key={i} style={[styles.arrowChip, scored ? styles.arrowChipFilled : styles.arrowChipEmpty]}>
                      <Text style={[styles.arrowChipText, scored ? styles.arrowChipTextFilled : styles.arrowChipTextEmpty]}>
                        {scored ? String(currentScores[i]) : '–'}
                      </Text>
                    </View>
                  );
                })}
              </View>

              <View style={styles.scoringProgress}>
                <Text style={styles.scoringProgressText}>
                  {filledCount} av {maxArrows} piler registrert
                </Text>
                {filledCount > 0 && <Text style={styles.scoringTotal}>Sum: {total}</Text>}
              </View>

              {/* Score buttons */}
              {!isFull ? (
                <View style={styles.scoreButtonsGrid}>
                  {ARROW_SCORE_OPTIONS.map((opt) => (
                    <Pressable
                      key={opt.label}
                      style={[styles.scoreButton, opt.label === 'X' && styles.scoreButtonX, opt.label === 'M' && styles.scoreButtonMiss]}
                      onPress={() => addArrowScore(roundIndex, opt.value)}>
                      <Text
                        style={[
                          styles.scoreButtonText,
                          opt.label === 'X' && styles.scoreButtonTextX,
                          opt.label === 'M' && styles.scoreButtonTextMiss,
                        ]}>
                        {opt.label}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              ) : (
                <View style={styles.scoringComplete}>
                  <Text style={styles.scoringCompleteText}>✓ Alle piler registrert – score: {total}</Text>
                </View>
              )}

              {filledCount > 0 && (
                <TouchableOpacity style={styles.backspaceBtn} onPress={() => removeLastArrowScore(roundIndex)}>
                  <FontAwesomeIcon icon={faDeleteLeft} size={16} color={colors.textSecondary} />
                  <Text style={styles.backspaceBtnText}>Fjern siste</Text>
                </TouchableOpacity>
              )}
            </View>
          );
        })}
      </View>
    );
  };

  const renderReflectionStep = () => (
    <View style={styles.stepContent}>
      <View style={styles.ratingSection}>
        <Text style={styles.ratingLabel}>Vurdering (valgfritt)</Text>
        <Text style={styles.ratingHelpText}>Hvordan vil du vurdere treningen?</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.ratingButtons}>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => {
              const active = rating === num;
              return (
                <Pressable
                  key={num}
                  style={[styles.ratingButton, active && styles.ratingButtonActive]}
                  onPress={() => setRating(active ? null : num)}
                  accessibilityLabel={`Vurdering ${num} av 10`}>
                  <Text style={[styles.ratingButtonText, active && styles.ratingButtonTextActive]}>{num}</Text>
                </Pressable>
              );
            })}
          </View>
        </ScrollView>
      </View>

      <Textarea
        label="Notater"
        optional
        value={notes}
        onChangeText={setNotes}
        placeholderText="Hvordan gikk treningen?&#10;&#10;Hva gikk bra? Hva kan forbedres?"
        maxLength={500}
        containerStyle={styles.inputContainer}
      />

      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );

  // ═══════════════════════════════════════════════════════════════════════════════
  // Step indicator
  // ═══════════════════════════════════════════════════════════════════════════════

  const renderStepIndicator = () => (
    <View style={styles.stepIndicator}>
      {STEP_LABELS.map((label, i) => {
        const isActive = i === step;
        const isCompleted = i < step;
        return (
          <React.Fragment key={i}>
            <TouchableOpacity style={styles.stepItem} onPress={() => setStep(i)} accessibilityLabel={`Gå til ${label}`}>
              <View style={[styles.stepDot, isActive && styles.stepDotActive, isCompleted && styles.stepDotCompleted]}>
                <Text style={[styles.stepDotText, (isActive || isCompleted) && styles.stepDotTextActive]}>{i + 1}</Text>
              </View>
              <Text style={[styles.stepLabel, isActive && styles.stepLabelActive, isCompleted && styles.stepLabelCompleted]}>{label}</Text>
            </TouchableOpacity>
            {i < TOTAL_STEPS - 1 && <View style={[styles.stepConnector, isCompleted && styles.stepConnectorCompleted]} />}
          </React.Fragment>
        );
      })}
    </View>
  );

  // ═══════════════════════════════════════════════════════════════════════════════
  // Navigation footer
  // ═══════════════════════════════════════════════════════════════════════════════

  const renderNavigation = () => {
    const isFirstStep = step === 0;
    const isLastStep = step === TOTAL_STEPS - 1;

    return (
      <View style={styles.navFooter}>
        <View style={styles.navRow}>
          {/* Left: cancel — always visible */}
          <TouchableOpacity style={styles.navCancelBtn} onPress={handleClose} accessibilityLabel="Avbryt">
            <FontAwesomeIcon icon={faXmark} size={14} color={colors.textSecondary} />
            <Text style={styles.navCancelText}>Avbryt</Text>
          </TouchableOpacity>

          {/* Center: prev / step name / next */}
          <View style={styles.navCenter}>
            <TouchableOpacity
              style={[styles.navArrow, isFirstStep && styles.navArrowDisabled]}
              onPress={goPrev}
              disabled={isFirstStep}
              accessibilityLabel="Forrige steg">
              <FontAwesomeIcon icon={faChevronLeft} size={18} color={isFirstStep ? colors.dimmed : colors.primary} />
            </TouchableOpacity>

            <Text style={styles.navStepName}>{STEP_LABELS[step]}</Text>

            {isLastStep ? (
              <View style={styles.navArrow} />
            ) : (
              <TouchableOpacity style={styles.navArrow} onPress={goNext} accessibilityLabel="Neste steg">
                <FontAwesomeIcon icon={faChevronRight} size={18} color={colors.primary} />
              </TouchableOpacity>
            )}
          </View>

          {/* Right: delete when editing, spacer otherwise */}
          {isEditing ? (
            <TouchableOpacity style={styles.navDeleteBtn} onPress={() => setConfirmVisible(true)} accessibilityLabel="Slett trening">
              <FontAwesomeIcon icon={faTrashCan} size={16} color={colors.error} />
            </TouchableOpacity>
          ) : (
            <View style={styles.navDeleteBtn} />
          )}
        </View>

        {isLastStep && (
          <View style={styles.navActions}>
            {!isEditing && (
              <Button label="Start skyting" onPress={handleStartShooting} disabled={submitting} loading={submitting} type="outline" />
            )}
            <Button
              label={submitting ? 'Lagrer...' : isEditing ? 'Lagre endringer' : 'Lagre trening'}
              onPress={handleSaveAndFinish}
              disabled={submitting}
              loading={submitting}
              buttonStyle={!isEditing ? styles.saveButton : undefined}
            />
          </View>
        )}
      </View>
    );
  };

  // ─── Render ───────────────────────────────────────────────────────────────────
  return (
    <ModalWrapper visible={visible} onClose={handleClose}>
      <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        {/* Fixed header */}
        <Pressable onPress={Keyboard.dismiss}>
          <ModalHeader title={isEditing ? 'Rediger trening' : 'Ny trening'} onPress={handleClose} />
        </Pressable>

        {renderStepIndicator()}

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
        {renderNavigation()}
      </KeyboardAvoidingView>

      <ConfirmModal
        visible={confirmVisible}
        title="Slett trening"
        message="Vil du slette treningen?"
        confirmLabel="Slett"
        cancelLabel="Avbryt"
        onCancel={() => setConfirmVisible(false)}
        onConfirm={() => {
          handleDelete();
          setConfirmVisible(false);
        }}
      />
    </ModalWrapper>
  );
}
