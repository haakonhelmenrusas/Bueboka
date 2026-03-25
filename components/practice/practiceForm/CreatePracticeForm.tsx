import React, { useEffect, useState } from 'react';
import { Keyboard, KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import * as Sentry from '@sentry/react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faTrashCan } from '@fortawesome/free-regular-svg-icons/faTrashCan';
import { faPlus } from '@fortawesome/free-solid-svg-icons/faPlus';
import { faXmark } from '@fortawesome/free-solid-svg-icons/faXmark';

import { Button, DatePicker, Input, ModalHeader, ModalWrapper, Select, Textarea } from '@/components/common';
import ConfirmModal from '@/components/home/DeleteArrowSetModal/ConfirmModal';
import { practiceRepository } from '@/services/repositories';
import { Arrows, Bow, Environment, Practice, PracticeCategory, WeatherCondition } from '@/types';
import { TARGET_TYPE_OPTIONS } from '@/utils/Constants';
import { colors } from '@/styles/colors';
import { styles } from './CreatePracticeFormStyles';

// ─── Storage keys ───────────────────────────────────────────────────────────
const STORAGE_KEY_DISTANCE = 'bueboka_last_distance';
const STORAGE_KEY_TARGET = 'bueboka_last_target';

// ─── Option lists ────────────────────────────────────────────────────────────
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

// ─── Types ───────────────────────────────────────────────────────────────────
export interface RoundInput {
  distanceMeters?: number;
  distanceFrom?: number;
  distanceTo?: number;
  targetType: string;
  numberArrows?: number;
  arrowsWithoutScore?: number;
  roundScore: number;
}

interface CreatePracticeFormProps {
  visible: boolean;
  onClose: () => void;
  bows?: Bow[];
  arrowSets?: Arrows[];
  onPracticeSaved?: () => void;
  editingPractice?: Practice | null;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
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
      }
    : { distanceMeters: undefined, targetType: '', numberArrows: undefined, arrowsWithoutScore: undefined, roundScore: 0 };
}

// ─── Component ───────────────────────────────────────────────────────────────
export default function CreatePracticeForm({
  visible,
  onClose,
  bows = [],
  arrowSets = [],
  onPracticeSaved,
  editingPractice = null,
}: CreatePracticeFormProps) {
  const router = useRouter();

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

  // Derived
  const validBows = Array.isArray(bows) ? bows : [];
  const validArrowSets = Array.isArray(arrowSets) ? arrowSets : [];
  const bowOptions = validBows.map((b) => ({ label: b.name, value: b.id }));
  const arrowSetOptions = validArrowSets.map((a) => ({ label: a.name, value: a.id }));
  const isEditing = !!editingPractice;

  // ─── Init form ─────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!visible) return;

    if (isEditing && editingPractice) {
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
          editingPractice.ends.map((end) => ({
            distanceMeters: end.distanceMeters ?? undefined,
            distanceFrom: end.distanceFrom ?? undefined,
            distanceTo: end.distanceTo ?? undefined,
            targetType: end.targetType ?? (end.targetSizeCm ? `${end.targetSizeCm}cm` : ''),
            numberArrows: end.arrows ?? undefined,
            arrowsWithoutScore: end.arrowsWithoutScore ?? undefined,
            roundScore: end.roundScore ?? 0,
          })),
        );
      } else {
        setRounds([emptyRound(editingPractice.practiceCategory ?? PracticeCategory.SKIVE_INDOOR)]);
      }
    } else {
      // Create mode – restore last-used defaults from storage
      resetForm();
      AsyncStorage.multiGet([STORAGE_KEY_DISTANCE, STORAGE_KEY_TARGET])
        .then(([distEntry, targetEntry]) => {
          const lastDist = distEntry[1] ? parseFloat(distEntry[1]) : undefined;
          const lastTarget = targetEntry[1] ?? '';
          setRounds([
            { distanceMeters: lastDist, targetType: lastTarget, numberArrows: undefined, arrowsWithoutScore: undefined, roundScore: 0 },
          ]);
        })
        .catch(() => {});

      // Prefer favourite equipment
      const favBow = validBows.find((b) => b.isFavorite);
      setSelectedBow(favBow ? favBow.id : '');
      const favArrows = validArrowSets.find((a) => a.isFavorite);
      setSelectedArrowSet(favArrows ? favArrows.id : '');
    }

    setError(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, isEditing, editingPractice]);

  // Clear weather when switching to INDOOR
  useEffect(() => {
    if (environment !== Environment.OUTDOOR) setWeather([]);
  }, [environment]);

  // ─── Reset ─────────────────────────────────────────────────────────────────
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

  // ─── Practice category ────────────────────────────────────────────────────
  const handleCategoryChange = (cat: PracticeCategory) => {
    setPracticeCategory(cat);
    setRounds([emptyRound(cat)]);
  };

  // ─── Rounds ───────────────────────────────────────────────────────────────
  const addRound = () => {
    if (rounds.length < 20) setRounds((prev) => [...prev, emptyRound(practiceCategory)]);
  };

  const removeRound = (index: number) => {
    if (rounds.length > 1) setRounds((prev) => prev.filter((_, i) => i !== index));
  };

  const updateRound = <K extends keyof RoundInput>(index: number, field: K, value: RoundInput[K]) => {
    setRounds((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  };

  const parseNum = (text: string): number | undefined => {
    const n = parseFloat(text);
    return isNaN(n) ? undefined : n;
  };

  // ─── Weather chips ────────────────────────────────────────────────────────
  const toggleWeather = (condition: WeatherCondition) => {
    setWeather((prev) => (prev.includes(condition) ? prev.filter((w) => w !== condition) : [...prev, condition]));
  };

  // ─── Persist last used values ─────────────────────────────────────────────
  const persistLastUsed = async (validRounds: RoundInput[]) => {
    if (validRounds.length === 0) return;
    const first = validRounds[0];
    const pairs: [string, string][] = [];
    if (first.distanceMeters && first.distanceMeters > 0) {
      pairs.push([STORAGE_KEY_DISTANCE, first.distanceMeters.toString()]);
    }
    if (first.targetType) pairs.push([STORAGE_KEY_TARGET, first.targetType]);
    if (pairs.length > 0) await AsyncStorage.multiSet(pairs).catch(() => {});
  };

  // ─── Build ends payload ───────────────────────────────────────────────────
  const buildEnds = (validRounds: RoundInput[]) =>
    validRounds.map((r) => ({
      arrows: r.numberArrows,
      arrowsWithoutScore: r.arrowsWithoutScore,
      scores: [] as number[],
      roundScore: r.roundScore || 0,
      distanceMeters: r.distanceMeters,
      distanceFrom: r.distanceFrom,
      distanceTo: r.distanceTo,
      targetType: r.targetType || undefined,
    }));

  // ─── Save (finished practice) ─────────────────────────────────────────────
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

      if (isEditing && editingPractice) {
        await practiceRepository.update(editingPractice.id, payload);
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

  // ─── Start shooting (create + navigate to shooting screen) ───────────────
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

  // ─── Delete ───────────────────────────────────────────────────────────────
  const handleDelete = async () => {
    if (!editingPractice) return;
    try {
      await practiceRepository.delete(editingPractice.id);
      onPracticeSaved?.();
      onClose();
    } catch (err) {
      Sentry.captureException(err);
    }
  };

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <ModalWrapper visible={visible} onClose={handleClose}>
      <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <Pressable onPress={() => Keyboard.dismiss()}>
            <ModalHeader title={isEditing ? 'Rediger trening' : 'Ny trening'} onPress={handleClose} />

            <View style={styles.content}>
              {/* ── Date & Category row ────────────────────────────────────── */}
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

              {/* ── Environment & Location row ─────────────────────────────── */}
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

              {/* ── Weather chips (only outdoors) ──────────────────────────── */}
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

              {/* ── Bow & Arrows row ──────────────────────────────────────── */}
              {(bowOptions.length > 0 || arrowSetOptions.length > 0) && (
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
              )}

              {/* ── Rounds ────────────────────────────────────────────────── */}
              <View style={styles.roundsSection}>
                <Text style={styles.sectionTitle}>Runder</Text>

                {rounds.map((round, index) => {
                  const rangeMode = isRangeCategory(practiceCategory);
                  return (
                    <View key={index} style={styles.roundCard}>
                      {/* Header */}
                      <View style={styles.roundHeader}>
                        <Text style={styles.roundNumber}>Runde {index + 1}</Text>
                        {rounds.length > 1 && (
                          <TouchableOpacity
                            style={styles.removeRoundBtn}
                            onPress={() => removeRound(index)}
                            accessibilityLabel="Fjern runde">
                            <FontAwesomeIcon icon={faXmark} size={16} color={colors.textSecondary} />
                          </TouchableOpacity>
                        )}
                      </View>

                      {/* Distance inputs */}
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

                      {/* Score inputs */}
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

                      {/* Arrows without score */}
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

                {/* Add round */}
                <TouchableOpacity
                  style={[styles.addRoundBtn, rounds.length >= 20 && { opacity: 0.4 }]}
                  onPress={addRound}
                  disabled={rounds.length >= 20}>
                  <FontAwesomeIcon icon={faPlus} size={14} color={colors.primary} />
                  <Text style={styles.addRoundBtnText}>Legg til runde</Text>
                </TouchableOpacity>
                {rounds.length >= 20 && <Text style={styles.limitMessage}>Maksimalt 20 runder er tillatt</Text>}
              </View>

              {/* ── Rating ────────────────────────────────────────────────── */}
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

              {/* ── Notes ─────────────────────────────────────────────────── */}
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

            {/* ── Delete icon (edit mode) ────────────────────────────────── */}
            {isEditing && (
              <View style={styles.deleteRow}>
                <TouchableOpacity style={styles.deleteBtn} onPress={() => setConfirmVisible(true)} testID="delete-practice-button">
                  <FontAwesomeIcon icon={faTrashCan} size={20} color={colors.error} />
                </TouchableOpacity>
              </View>
            )}

            {/* ── Footer buttons ─────────────────────────────────────────── */}
            <View style={styles.footer}>
              {isEditing ? (
                <Button
                  label={submitting ? 'Lagrer...' : 'Lagre endringer'}
                  onPress={handleSaveAndFinish}
                  disabled={submitting}
                  loading={submitting}
                />
              ) : (
                <>
                  <View style={styles.actions}>
                    <Button label="Start skyting" onPress={handleStartShooting} disabled={submitting} loading={submitting} type="outline" />
                    <Button
                      label={submitting ? 'Lagrer...' : 'Lagre trening'}
                      onPress={handleSaveAndFinish}
                      disabled={submitting}
                      loading={submitting}
                      buttonStyle={styles.saveButton}
                    />
                  </View>
                </>
              )}
            </View>
          </Pressable>
        </ScrollView>
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
