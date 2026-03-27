import React, { useEffect, useState } from 'react';
import { Keyboard, KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import * as Sentry from '@sentry/react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faTrashCan } from '@fortawesome/free-regular-svg-icons/faTrashCan';
import { faPlus } from '@fortawesome/free-solid-svg-icons/faPlus';
import { faXmark } from '@fortawesome/free-solid-svg-icons/faXmark';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons/faChevronLeft';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons/faChevronRight';
import { faStar } from '@fortawesome/free-solid-svg-icons/faStar';

import { Button, Checkbox, DatePicker, Input, ModalHeader, ModalWrapper, Select, Textarea } from '@/components/common';
import ConfirmModal from '@/components/home/DeleteArrowSetModal/ConfirmModal';
import { competitionRepository, type CreateCompetitionRoundData } from '@/services/repositories';
import type { Arrows, Bow, Competition } from '@/types';
import { Environment, PracticeCategory, WeatherCondition } from '@/types';
import { TARGET_TYPE_OPTIONS } from '@/utils/Constants';
import { colors } from '@/styles/colors';
import { styles } from './CreateCompetitionFormStyles';

// ─── Step definitions ─────────────────────────────────────────────────────────
const TOTAL_STEPS = 4;
const STEP_LABELS = ['Info', 'Detaljer', 'Runder', 'Refleksjon'];

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

// ─── Types ────────────────────────────────────────────────────────────────────
export interface CompetitionRoundInput {
  roundNumber: number;
  distanceMeters?: number;
  distanceFrom?: number;
  distanceTo?: number;
  targetType: string;
  numberArrows?: number;
  arrowsWithoutScore?: number;
  roundScore: number;
}

interface CreateCompetitionFormProps {
  visible: boolean;
  onClose: () => void;
  bows?: Bow[];
  arrowSets?: Arrows[];
  onSaved?: () => void;
  editingCompetition?: Competition | null;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function isRangeCategory(cat: PracticeCategory): boolean {
  return cat === PracticeCategory.JAKT_3D || cat === PracticeCategory.FELT;
}

function emptyRound(roundNumber: number, cat: PracticeCategory): CompetitionRoundInput {
  return isRangeCategory(cat)
    ? {
        roundNumber,
        distanceFrom: undefined,
        distanceTo: undefined,
        targetType: '',
        numberArrows: undefined,
        arrowsWithoutScore: undefined,
        roundScore: 0,
      }
    : { roundNumber, distanceMeters: undefined, targetType: '', numberArrows: undefined, arrowsWithoutScore: undefined, roundScore: 0 };
}

/** Safely parse a date string from the API, falling back to today if invalid. */
function parseDate(value: string | Date | null | undefined): Date {
  if (!value) return new Date();
  if (value instanceof Date) return isNaN(value.getTime()) ? new Date() : value;
  // Date-only strings like "2025-12-01" are parsed as UTC midnight by JS,
  // which can shift the displayed date by ±1 day depending on timezone.
  // Treat them as local midnight instead.
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const [y, m, d] = value.split('-').map(Number);
    return new Date(y, m - 1, d);
  }
  const parsed = new Date(value);
  return isNaN(parsed.getTime()) ? new Date() : parsed;
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function CreateCompetitionForm({
  visible,
  onClose,
  bows = [],
  arrowSets = [],
  onSaved,
  editingCompetition = null,
}: CreateCompetitionFormProps) {
  // Step
  const [step, setStep] = useState(0);

  // Form state — Step 1: Info
  const [name, setName] = useState('');
  const [date, setDate] = useState(new Date());
  const [practiceCategory, setPracticeCategory] = useState<PracticeCategory>(PracticeCategory.SKIVE_INDOOR);
  const [environment, setEnvironment] = useState<Environment>(Environment.INDOOR);
  const [location, setLocation] = useState('');
  const [selectedBow, setSelectedBow] = useState('');
  const [selectedArrowSet, setSelectedArrowSet] = useState('');

  // Form state — Step 2: Details
  const [organizerName, setOrganizerName] = useState('');
  const [placement, setPlacement] = useState('');
  const [numberOfParticipants, setNumberOfParticipants] = useState('');
  const [personalBest, setPersonalBest] = useState(false);
  const [weather, setWeather] = useState<WeatherCondition[]>([]);

  // Form state — Step 3: Rounds
  const [rounds, setRounds] = useState<CompetitionRoundInput[]>([emptyRound(1, PracticeCategory.SKIVE_INDOOR)]);

  // Form state — Step 4: Reflection
  const [notes, setNotes] = useState('');

  // UI state
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Derived
  const validBows = Array.isArray(bows) ? bows : [];
  const validArrowSets = Array.isArray(arrowSets) ? arrowSets : [];
  const bowOptions = validBows.map((b) => ({ label: b.name, value: b.id }));
  const arrowSetOptions = validArrowSets.map((a) => ({ label: a.name, value: a.id }));
  const isEditing = !!editingId;

  // ─── Init ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!visible) {
      setEditingId(null);
      return;
    }

    setStep(0);
    setError(null);

    if (editingCompetition) {
      setEditingId(editingCompetition.id);
      setName(editingCompetition.name);
      setDate(parseDate(editingCompetition.date));
      setPracticeCategory(editingCompetition.practiceCategory ?? PracticeCategory.SKIVE_INDOOR);
      setEnvironment(editingCompetition.environment ?? Environment.INDOOR);
      setLocation(editingCompetition.location ?? '');
      setSelectedBow(editingCompetition.bowId ?? '');
      setSelectedArrowSet(editingCompetition.arrowsId ?? '');
      setOrganizerName(editingCompetition.organizerName ?? '');
      setPlacement(editingCompetition.placement != null ? String(editingCompetition.placement) : '');
      setNumberOfParticipants(editingCompetition.numberOfParticipants != null ? String(editingCompetition.numberOfParticipants) : '');
      setPersonalBest(editingCompetition.personalBest ?? false);
      setWeather(editingCompetition.weather ?? []);
      setNotes(editingCompetition.notes ?? '');

      if (editingCompetition.rounds && editingCompetition.rounds.length > 0) {
        setRounds(
          editingCompetition.rounds.map((r) => ({
            roundNumber: r.roundNumber,
            distanceMeters: r.distanceMeters ?? undefined,
            distanceFrom: r.distanceFrom ?? undefined,
            distanceTo: r.distanceTo ?? undefined,
            targetType: r.targetType ?? '',
            numberArrows: r.arrows ?? undefined,
            arrowsWithoutScore: r.arrowsWithoutScore ?? undefined,
            roundScore: r.roundScore ?? 0,
          })),
        );
      } else {
        setRounds([emptyRound(1, editingCompetition.practiceCategory ?? PracticeCategory.SKIVE_INDOOR)]);
      }
    } else {
      setEditingId(null);
      resetForm();
      const favBow = validBows.find((b) => b.isFavorite);
      setSelectedBow(favBow?.id ?? '');
      const favArrows = validArrowSets.find((a) => a.isFavorite);
      setSelectedArrowSet(favArrows?.id ?? '');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, editingCompetition?.id]);

  useEffect(() => {
    if (environment !== Environment.OUTDOOR) setWeather([]);
  }, [environment]);

  // ─── Reset ─────────────────────────────────────────────────────────────────
  const resetForm = () => {
    setName('');
    setDate(new Date());
    setPracticeCategory(PracticeCategory.SKIVE_INDOOR);
    setEnvironment(Environment.INDOOR);
    setLocation('');
    setSelectedBow('');
    setSelectedArrowSet('');
    setOrganizerName('');
    setPlacement('');
    setNumberOfParticipants('');
    setPersonalBest(false);
    setWeather([]);
    setRounds([emptyRound(1, PracticeCategory.SKIVE_INDOOR)]);
    setNotes('');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  // ─── Navigation ────────────────────────────────────────────────────────────
  const goNext = () => setStep((s) => Math.min(s + 1, TOTAL_STEPS - 1));
  const goPrev = () => setStep((s) => Math.max(s - 1, 0));

  // ─── Category ──────────────────────────────────────────────────────────────
  const handleCategoryChange = (cat: PracticeCategory) => {
    setPracticeCategory(cat);
    setRounds([emptyRound(1, cat)]);
  };

  // ─── Rounds ────────────────────────────────────────────────────────────────
  const addRound = () => {
    if (rounds.length < 20) setRounds((prev) => [...prev, emptyRound(prev.length + 1, practiceCategory)]);
  };

  const removeRound = (index: number) => {
    if (rounds.length > 1) setRounds((prev) => prev.filter((_, i) => i !== index).map((r, i) => ({ ...r, roundNumber: i + 1 })));
  };

  const updateRound = <K extends keyof CompetitionRoundInput>(index: number, field: K, value: CompetitionRoundInput[K]) => {
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

  // ─── Weather ───────────────────────────────────────────────────────────────
  const toggleWeather = (condition: WeatherCondition) => {
    setWeather((prev) => (prev.includes(condition) ? prev.filter((w) => w !== condition) : [...prev, condition]));
  };

  // ─── Build rounds payload ──────────────────────────────────────────────────
  const buildRounds = (): CreateCompetitionRoundData[] =>
    rounds
      .filter((r) => (r.numberArrows ?? 0) > 0 || (r.arrowsWithoutScore ?? 0) > 0 || r.roundScore > 0 || r.targetType || r.distanceMeters)
      .map((r) => {
        const round: CreateCompetitionRoundData = { roundNumber: r.roundNumber, roundScore: r.roundScore || 0 };
        if (r.numberArrows !== undefined) round.arrows = r.numberArrows;
        if (r.arrowsWithoutScore !== undefined) round.arrowsWithoutScore = r.arrowsWithoutScore;
        if (r.distanceMeters !== undefined) round.distanceMeters = r.distanceMeters;
        if (r.distanceFrom !== undefined) round.distanceFrom = r.distanceFrom;
        if (r.distanceTo !== undefined) round.distanceTo = r.distanceTo;
        if (r.targetType) round.targetType = r.targetType;
        return round;
      });

  // ─── Save ──────────────────────────────────────────────────────────────────
  const handleSave = async () => {
    if (!name.trim()) {
      setError('Navn på konkurransen er påkrevd');
      setStep(0);
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      const payload = {
        date,
        name: name.trim(),
        location: location || undefined,
        organizerName: organizerName || undefined,
        environment,
        weather,
        practiceCategory,
        notes: notes || undefined,
        placement: placement ? parseInt(placement, 10) : undefined,
        numberOfParticipants: numberOfParticipants ? parseInt(numberOfParticipants, 10) : undefined,
        personalBest: personalBest || undefined,
        bowId: selectedBow || undefined,
        arrowsId: selectedArrowSet || undefined,
        rounds: buildRounds(),
      };

      if (editingId) {
        await competitionRepository.update(editingId, payload);
      } else {
        await competitionRepository.create(payload);
      }

      onSaved?.();
      onClose();
    } catch (err) {
      Sentry.captureException(err);
      setError(err instanceof Error ? err.message : 'Kunne ikke lagre konkurransen.');
    } finally {
      setSubmitting(false);
    }
  };

  // ─── Delete ────────────────────────────────────────────────────────────────
  const handleDelete = async () => {
    if (!editingId) return;
    try {
      await competitionRepository.delete(editingId);
      onSaved?.();
      onClose();
    } catch (err) {
      Sentry.captureException(err);
    }
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // Step renderers
  // ═══════════════════════════════════════════════════════════════════════════

  const renderInfoStep = () => (
    <View style={styles.stepContent}>
      <Input
        label="Navn på konkurransen"
        value={name}
        onChangeText={setName}
        placeholder="F.eks. NM Innendørs 2026"
        maxLength={120}
        containerStyle={styles.inputContainer}
      />

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
          placeholder="F.eks. Oslo Spektrum"
          maxLength={80}
          containerStyle={styles.field}
        />
      </View>

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
    </View>
  );

  const renderDetailsStep = () => (
    <View style={styles.stepContent}>
      <Input
        label="Arrangør"
        value={organizerName}
        onChangeText={setOrganizerName}
        placeholder="F.eks. Norges Skytterforbund"
        maxLength={100}
        containerStyle={styles.inputContainer}
      />

      <View style={styles.row}>
        <Input
          label="Plassering"
          value={placement}
          onChangeText={setPlacement}
          placeholder="F.eks. 3"
          keyboardType="numeric"
          containerStyle={styles.field}
        />
        <Input
          label="Antall deltakere"
          value={numberOfParticipants}
          onChangeText={setNumberOfParticipants}
          placeholder="F.eks. 120"
          keyboardType="numeric"
          containerStyle={styles.field}
        />
      </View>

      {/* Personal best toggle */}
      <Pressable style={styles.personalBestRow} onPress={() => setPersonalBest((v) => !v)}>
        <FontAwesomeIcon icon={faStar} size={18} color={personalBest ? colors.accentYellow : colors.dimmed} />
        <View style={{ flex: 1 }}>
          <Text style={styles.personalBestText}>Personlig rekord</Text>
          <Text style={styles.personalBestHint}>Marker om dette var en personlig rekord</Text>
        </View>
        <Checkbox value={personalBest} onChange={setPersonalBest} />
      </Pressable>
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
                <Text style={styles.roundNumber}>Runde {round.roundNumber}</Text>
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
                  value={round.numberArrows !== undefined && round.numberArrows !== null ? String(round.numberArrows) : ''}
                  onChangeText={(t) => updateRound(index, 'numberArrows', parseNum(t))}
                  keyboardType="numeric"
                  containerStyle={styles.roundField}
                />
                <Input
                  label="Score"
                  optional
                  value={round.roundScore !== undefined && round.roundScore !== null ? String(round.roundScore) : ''}
                  onChangeText={(t) => updateRound(index, 'roundScore', parseNum(t) ?? 0)}
                  keyboardType="numeric"
                  containerStyle={styles.roundField}
                />
              </View>

              <Input
                label="Piler u/score"
                optional
                value={round.arrowsWithoutScore !== undefined && round.arrowsWithoutScore !== null ? String(round.arrowsWithoutScore) : ''}
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

  const renderReflectionStep = () => (
    <View style={styles.stepContent}>
      <Textarea
        label="Notater"
        optional
        value={notes}
        onChangeText={setNotes}
        placeholderText={'Hvordan gikk konkurransen?\n\nHva gikk bra? Hva kan forbedres?'}
        maxLength={500}
        containerStyle={styles.inputContainer}
      />

      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );

  // ═══════════════════════════════════════════════════════════════════════════
  // Step indicator
  // ═══════════════════════════════════════════════════════════════════════════
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

  // ═══════════════════════════════════════════════════════════════════════════
  // Navigation footer
  // ═══════════════════════════════════════════════════════════════════════════
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
            <TouchableOpacity style={styles.navDeleteBtn} onPress={() => setConfirmVisible(true)} accessibilityLabel="Slett konkurranse">
              <FontAwesomeIcon icon={faTrashCan} size={16} color={colors.error} />
            </TouchableOpacity>
          ) : (
            <View style={styles.navDeleteBtn} />
          )}
        </View>

        {isLastStep && (
          <View style={styles.navActions}>
            <Button
              label={submitting ? 'Lagrer...' : isEditing ? 'Lagre endringer' : 'Lagre konkurranse'}
              onPress={handleSave}
              disabled={submitting}
              loading={submitting}
              buttonStyle={!isEditing ? styles.saveButton : undefined}
            />
          </View>
        )}
      </View>
    );
  };

  // ─── Render ────────────────────────────────────────────────────────────────
  return (
    <ModalWrapper visible={visible} onClose={handleClose}>
      <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <Pressable onPress={Keyboard.dismiss}>
          <ModalHeader title={isEditing ? 'Rediger konkurranse' : 'Ny konkurranse'} onPress={handleClose} />
        </Pressable>

        {renderStepIndicator()}

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          <Pressable onPress={Keyboard.dismiss}>
            {step === 0 && renderInfoStep()}
            {step === 1 && renderDetailsStep()}
            {step === 2 && renderRoundsStep()}
            {step === 3 && renderReflectionStep()}
          </Pressable>
        </ScrollView>

        {renderNavigation()}
      </KeyboardAvoidingView>

      <ConfirmModal
        visible={confirmVisible}
        title="Slett konkurranse"
        message="Vil du slette konkurransen?"
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
