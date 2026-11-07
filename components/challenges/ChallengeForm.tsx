import { useState, useEffect, useCallback } from 'react';
import { View, ScrollView, ActivityIndicator, Text } from 'react-native';
import { Input, Button, Checkbox } from '@/components/common';
import { styles } from './ChallengeFormStyles';
import { useTranslation } from '@/contexts';
import type { PublicProfile, ChallengeCustomRules, CreateChallengeData } from '@/types';
import { colors } from '@/styles/colors';

interface ChallengeFormProps {
  opponent: PublicProfile | null;
  onSubmit: (data: CreateChallengeData) => Promise<void>;
  onCancel: () => void;
  loading: boolean;
  error: string | null;
}

type NumericChallengeRuleField = keyof Omit<ChallengeCustomRules, 'targetType'>;

export default function ChallengeForm({ opponent, onSubmit, onCancel, loading, error }: ChallengeFormProps) {
  const { t } = useTranslation();

  // Form state
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [useCustomRules, setUseCustomRules] = useState(false);
  const [customRules, setCustomRules] = useState<ChallengeCustomRules>({
    distanceMeters: null,
    distanceFrom: null,
    distanceTo: null,
    targetType: null,
    targetSizeCm: null,
    numberArrows: null,
  });

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

    if (useCustomRules) {
      const rules: ChallengeCustomRules = {};
      if (customRules.distanceMeters !== null) rules.distanceMeters = customRules.distanceMeters;
      if (customRules.distanceFrom !== null) rules.distanceFrom = customRules.distanceFrom;
      if (customRules.distanceTo !== null) rules.distanceTo = customRules.distanceTo;
      if (customRules.targetType) rules.targetType = customRules.targetType;
      if (customRules.targetSizeCm !== null) rules.targetSizeCm = customRules.targetSizeCm;
      if (customRules.numberArrows !== null) rules.numberArrows = customRules.numberArrows;

      if (Object.keys(rules).length > 0) {
        data.customRules = rules;
      }
    }

    await onSubmit(data);
  }, [name, description, useCustomRules, customRules, opponent?.id, onSubmit]);

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
        {/* Header: only the opponent line — the modal header already shows the title */}
        {opponent && (
          <View style={styles.header}>
            <View style={styles.headerText}>
              <Text style={styles.subtitle}>
                {t['challenge.selectOpponent']}: {opponent.name || t['challenge.unknownOpponent']}
              </Text>
            </View>
          </View>
        )}

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
          optional
          value={description}
          onChangeText={setDescription}
          placeholder={t['challenge.descriptionPlaceholder']}
          multiline
          numberOfLines={3}
          containerStyle={styles.field}
          editable={!loading}
        />

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
            <View style={styles.rulesGrid}>
              <Input
                label={t['challenge.distanceMeters']}
                value={customRules.distanceMeters?.toString() || ''}
                onChangeText={(v) => handleNumberChange('distanceMeters', v)}
                keyboardType="numeric"
                placeholder=""
                containerStyle={styles.field}
                editable={!loading}
              />

              <View style={styles.rulesRow}>
                <Input
                  label={t['challenge.distanceFrom']}
                  value={customRules.distanceFrom?.toString() || ''}
                  onChangeText={(v) => handleNumberChange('distanceFrom', v)}
                  keyboardType="numeric"
                  placeholder=""
                  containerStyle={[styles.field, styles.halfField]}
                  editable={!loading}
                />

                <Input
                  label={t['challenge.distanceTo']}
                  value={customRules.distanceTo?.toString() || ''}
                  onChangeText={(v) => handleNumberChange('distanceTo', v)}
                  keyboardType="numeric"
                  placeholder=""
                  containerStyle={[styles.field, styles.halfField]}
                  editable={!loading}
                />
              </View>

              <Input
                label={t['challenge.targetSize']}
                value={customRules.targetSizeCm?.toString() || ''}
                onChangeText={(v) => handleNumberChange('targetSizeCm', v)}
                keyboardType="numeric"
                placeholder=""
                containerStyle={styles.field}
                editable={!loading}
              />

              <Input
                label={t['challenge.numberArrows']}
                value={customRules.numberArrows?.toString() || ''}
                onChangeText={(v) => handleNumberChange('numberArrows', v)}
                keyboardType="numeric"
                placeholder=""
                containerStyle={styles.field}
                editable={!loading}
              />

              <Input
                label={t['challenge.targetType']}
                value={customRules.targetType || ''}
                onChangeText={handleTargetTypeChange}
                placeholder="f.eks. FITA, 3D"
                containerStyle={styles.field}
                editable={!loading}
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
