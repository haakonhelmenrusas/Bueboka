import { useState, useEffect, useCallback } from 'react';
import { View, ScrollView, ActivityIndicator, Text } from 'react-native';
import { Input, Button, Checkbox, DatePicker, Select } from '@/components/common';
import { styles } from './ChallengeFormStyles';
import { useTranslation } from '@/contexts';
import type { PublicProfile, ChallengeCustomRules, CreateChallengeData } from '@/types';
import { colors } from '@/styles/colors';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCalendar } from '@fortawesome/free-solid-svg-icons';

interface ChallengeFormProps {
  opponent: PublicProfile | null;
  onSubmit: (data: CreateChallengeData) => Promise<void>;
  onCancel: () => void;
  loading: boolean;
  error: string | null;
}

// Options for target type selection
const getTargetTypeOptions = (t: any) => [
  { label: t['form.choose'], value: '' },
  { label: 'FITA', value: 'FITA' },
  { label: 'WA', value: 'WA' },
  { label: '3D', value: '3D' },
  { label: 'Felt', value: 'Felt' },
  { label: t['target.other'], value: 'Other' },
];

type NumericChallengeRuleField = keyof Omit<ChallengeCustomRules, 'targetType'>;

export default function ChallengeForm({ opponent, onSubmit, onCancel, loading, error }: ChallengeFormProps) {
  const { t } = useTranslation();

  // Form state
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [useCustomRules, setUseCustomRules] = useState(false);
  const [customRules, setCustomRules] = useState<ChallengeCustomRules>({
    distanceMeters: null,
    distanceFrom: null,
    distanceTo: null,
    targetType: null,
    targetSizeCm: null,
    numberArrows: null,
    arrowsWithoutScore: null,
  });

  const targetTypeOptions = getTargetTypeOptions(t);

  // Set default name when opponent changes
  useEffect(() => {
    if (opponent?.name) {
      setName(`Utfordring mot ${opponent.name}`);
    } else {
      setName('');
    }
  }, [opponent?.name]);

  const handleSubmit = useCallback(async () => {
    if (!name.trim()) {
      return;
    }

    if (!opponent?.id) {
      return;
    }

    const data: CreateChallengeData = {
      challengedId: opponent.id,
      name: name.trim(),
      description: description.trim() || undefined,
    };

    if (startDate) data.startDate = startDate;
    if (endDate) data.endDate = endDate;

    if (useCustomRules) {
      const rules: ChallengeCustomRules = {};
      if (customRules.distanceMeters !== null) rules.distanceMeters = customRules.distanceMeters;
      if (customRules.distanceFrom !== null) rules.distanceFrom = customRules.distanceFrom;
      if (customRules.distanceTo !== null) rules.distanceTo = customRules.distanceTo;
      if (customRules.targetType) rules.targetType = customRules.targetType;
      if (customRules.targetSizeCm !== null) rules.targetSizeCm = customRules.targetSizeCm;
      if (customRules.numberArrows !== null) rules.numberArrows = customRules.numberArrows;
      if (customRules.arrowsWithoutScore !== null) rules.arrowsWithoutScore = customRules.arrowsWithoutScore;

      if (Object.keys(rules).length > 0) {
        data.customRules = rules;
      }
    }

    await onSubmit(data);
  }, [name, description, startDate, endDate, useCustomRules, customRules, opponent?.id]);

  const handleNumberChange = useCallback((field: NumericChallengeRuleField, value: string) => {
    const num: number | null = value === '' ? null : Number(value);
    setCustomRules((prev) => ({
      ...prev,
      [field]: !isNaN(num!) ? num : null,
    }));
  }, []);

  const handleTargetTypeChange = useCallback((value: string) => {
    setCustomRules((prev) => ({
      ...prev,
      targetType: value || null,
    }));
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <View style={styles.form}>
        {/* Header */}
        <View style={styles.header}>
          <FontAwesomeIcon icon={faCalendar} size={24} color={colors.primary} />
          <View style={styles.headerText}>
            <View style={styles.titleRow}>
              <View style={styles.titleContainer}>
                <View style={styles.titleTextWrapper}>
                  <Text style={styles.title}>{t['challenge.createNew']}</Text>
                </View>
              </View>
            </View>
            {opponent && (
              <Text style={styles.subtitle}>
                {t['challenge.selectOpponent']}: {opponent.name || t['challenge.unknownOpponent']}
              </Text>
            )}
          </View>
        </View>

        {/* Error display */}
        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        {/* Name field */}
        <Input
          label={t['challenge.nameLabel']}
          value={name}
          onChangeText={setName}
          placeholder={`${t['challenge.nameLabel']}...`}
          containerStyle={styles.field}
          editable={!loading}
        />

        {/* Description field */}
        <Input
          label={t['challenge.descriptionLabel']}
          value={description}
          onChangeText={setDescription}
          placeholder={t['challenge.descriptionPlaceholder']}
          multiline
          numberOfLines={3}
          containerStyle={styles.field}
          editable={!loading}
        />

        {/* Date fields */}
        <View style={styles.dateFields}>
          <DatePicker
            label={t['challenge.startDateLabel']}
            value={startDate || new Date()}
            onDateChange={(date) => setStartDate(date || null)}
            placeholder={t['form.choose']}
            containerStyle={[styles.field, styles.halfField]}
          />

          <DatePicker
            label={t['challenge.endDateLabel']}
            value={endDate || new Date()}
            onDateChange={(date) => setEndDate(date || null)}
            placeholder={t['form.choose']}
            containerStyle={[styles.field, styles.halfField]}
          />
        </View>

        {/* Custom rules toggle */}
        <Checkbox
          label={t['challenge.useCustomRules']}
          value={useCustomRules}
          onChange={(value) => setUseCustomRules(value)}
          disabled={loading}
        />

        {/* Custom rules section */}
        {useCustomRules && (
          <View style={styles.customRulesContainer}>
            <Text style={styles.sectionTitle}>{t['challenge.customRulesTitle']}</Text>

            <View style={styles.rulesGrid}>
              <Input
                label={t['challenge.distanceMeters']}
                value={customRules.distanceMeters?.toString() || ''}
                onChangeText={(v) => handleNumberChange('distanceMeters', v)}
                keyboardType="numeric"
                placeholder="0"
                containerStyle={styles.field}
                editable={!loading}
              />

              <Input
                label={t['challenge.distanceFrom']}
                value={customRules.distanceFrom?.toString() || ''}
                onChangeText={(v) => handleNumberChange('distanceFrom', v)}
                keyboardType="numeric"
                placeholder="0"
                containerStyle={styles.field}
                editable={!loading}
              />

              <Input
                label={t['challenge.distanceTo']}
                value={customRules.distanceTo?.toString() || ''}
                onChangeText={(v) => handleNumberChange('distanceTo', v)}
                keyboardType="numeric"
                placeholder="0"
                containerStyle={styles.field}
                editable={!loading}
              />

              <Input
                label={t['challenge.targetSize']}
                value={customRules.targetSizeCm?.toString() || ''}
                onChangeText={(v) => handleNumberChange('targetSizeCm', v)}
                keyboardType="numeric"
                placeholder="0"
                containerStyle={styles.field}
                editable={!loading}
              />

              <Input
                label={t['challenge.numberArrows']}
                value={customRules.numberArrows?.toString() || ''}
                onChangeText={(v) => handleNumberChange('numberArrows', v)}
                keyboardType="numeric"
                placeholder="0"
                containerStyle={styles.field}
                editable={!loading}
              />

              <Input
                label={t['challenge.arrowsWithoutScore']}
                value={customRules.arrowsWithoutScore?.toString() || ''}
                onChangeText={(v) => handleNumberChange('arrowsWithoutScore', v)}
                keyboardType="numeric"
                placeholder="0"
                containerStyle={styles.field}
                editable={!loading}
              />

              <Select
                label={t['challenge.targetType']}
                options={targetTypeOptions}
                selectedValue={customRules.targetType || ''}
                onValueChange={handleTargetTypeChange}
                containerStyle={styles.field}
              />
            </View>
          </View>
        )}

        {/* Action buttons */}
        <View style={styles.actions}>
          <Button
            label={t['challengeForm.cancelButton']}
            onPress={onCancel}
            variant="standard"
            type="outline"
            disabled={loading}
            buttonStyle={styles.cancelButton}
          />
          <Button
            label={loading ? t['challengeForm.saving'] : t['challengeForm.submitButton']}
            onPress={handleSubmit}
            disabled={loading || !name.trim() || !opponent?.id}
            buttonStyle={styles.submitButton}
            loading={loading}
          />
        </View>

        {loading && <ActivityIndicator size="large" color={colors.primary} style={styles.loading} />}
      </View>
    </ScrollView>
  );
}
