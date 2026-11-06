import { useCallback, useState } from 'react';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons/faArrowLeft';
import { colors } from '@/styles/colors';
import { useTranslation } from '@/contexts';
import { practiceRepository } from '@/services/repositories';
import { Environment, PracticeCategory } from '@/types';
import { buildQuickPracticeData, type QuickPracticeInfo } from '@/utils/helpers/practiceHelpers';
import { setPendingQuickPracticeResult } from '@/utils/quickPractice';
import { Button } from '@/components/common';
import { styles } from '@/components/practice/QuickPracticeScreenStyles';

/**
 * Quick practice (hurtigtrening): count arrows only, no scoring.
 * Opened from the practice form with the chosen round's setup as route params.
 */
export default function QuickPracticeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const params = useLocalSearchParams<Record<string, string>>();

  const [count, setCount] = useState(0);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const num = (v: string | undefined) => (v ? Number(v) : undefined);

  const info: QuickPracticeInfo = {
    distanceMeters: num(params.distanceMeters),
    distanceFrom: num(params.distanceFrom),
    distanceTo: num(params.distanceTo),
    targetType: params.targetType || undefined,
    targetSizeCm: num(params.targetSizeCm),
    environment: (params.environment as Environment) || Environment.INDOOR,
    practiceCategory: (params.practiceCategory as PracticeCategory) || PracticeCategory.SKIVE_INDOOR,
  };

  const roundInfoText = [info.distanceMeters ? `${info.distanceMeters}m` : null, info.targetType].filter(Boolean).join(' · ');

  const handleSave = useCallback(async () => {
    if (count <= 0 || saving) return;
    setSaving(true);
    setError(null);
    try {
      await practiceRepository.create(buildQuickPracticeData(count, info));
      const roundIndex = Number(params.roundIndex);
      if (Number.isInteger(roundIndex) && roundIndex >= 0) {
        setPendingQuickPracticeResult({ roundIndex, count });
      }
      router.back();
    } catch (err) {
      setError(err instanceof Error ? err.message : t['common.unknownError']);
      setSaving(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count, saving, router, t, params]);

  return (
    <View style={styles.container}>
      <LinearGradient colors={[colors.primary, colors.secondary, '#1a4f66']} style={styles.gradient}>
        <View style={[styles.content, { paddingTop: insets.top + 12, paddingBottom: insets.bottom + 16 }]}>
          <View style={styles.header}>
            <Button
              onPress={() => router.back()}
              label=""
              variant="tertiary"
              type="outline"
              buttonStyle={styles.backButton}
              icon={<FontAwesomeIcon icon={faArrowLeft} size={24} color={colors.white} />}
            />
            <Text style={styles.title}>{t['quickPractice.title']}</Text>
          </View>
          {roundInfoText ? <Text style={styles.roundInfo}>{roundInfoText}</Text> : null}

          <View style={styles.counterContainer}>
            <Text testID="quick-counter" style={styles.counter}>
              {count}
            </Text>
            <Text style={styles.counterLabel}>{t['practiceCard.arrowsSuffix']}</Text>
          </View>

          <View style={styles.buttonsRow}>
            <TouchableOpacity
              testID="quick-minus"
              style={styles.counterButton}
              onPress={() => setCount((c) => Math.max(0, c - 1))}
              accessibilityLabel="-">
              <Text style={styles.counterButtonText}>−</Text>
            </TouchableOpacity>
            <TouchableOpacity
              testID="quick-plus"
              style={styles.counterButton}
              onPress={() => setCount((c) => c + 1)}
              accessibilityLabel="+">
              <Text style={styles.counterButtonText}>+</Text>
            </TouchableOpacity>
          </View>

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <View style={[styles.footer, { marginTop: 'auto' }]}>
            <Button
              label={t['common.cancel']}
              onPress={() => router.back()}
              variant="standard"
              type="outline"
              disabled={saving}
              buttonStyle={{ flex: 1 }}
            />
            <Button
              testID="quick-save"
              label={saving ? t['challengeForm.saving'] : t['quickPractice.save']}
              onPress={handleSave}
              type="filled"
              disabled={saving || count <= 0}
              loading={saving}
              buttonStyle={{ flex: 1 }}
            />
          </View>
          {saving && <ActivityIndicator color={colors.white} style={{ marginTop: 8 }} />}
        </View>
      </LinearGradient>
    </View>
  );
}
