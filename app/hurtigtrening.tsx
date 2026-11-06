import { useCallback, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons/faArrowLeft';
import { colors } from '@/styles/colors';
import { useTranslation } from '@/contexts';
import { Environment, PracticeCategory } from '@/types';
import type { QuickPracticeInfo } from '@/utils/helpers/practiceHelpers';
import { setPendingQuickPracticeResult } from '@/utils/quickPractice';
import { Button } from '@/components/common';
import { styles } from '@/components/practice/QuickPracticeScreenStyles';

/**
 * Quick practice (hurtigtrening): warm-up within the same practice session —
 * count arrows only, no scoring. Opened from the practice form with the chosen
 * round's setup as route params; the count is handed back to the form's
 * "Piler u/score" field when saving, no separate session is created.
 */
export default function QuickPracticeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const params = useLocalSearchParams<Record<string, string>>();

  const [count, setCount] = useState(0);

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

  const handleSave = useCallback(() => {
    if (count <= 0) return;
    const roundIndex = Number(params.roundIndex);
    if (Number.isInteger(roundIndex) && roundIndex >= 0) {
      setPendingQuickPracticeResult({ roundIndex, count });
    }
    router.back();
  }, [count, params, router]);

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

          <View style={[styles.footer, { marginTop: 'auto' }]}>
            <Button label={t['common.cancel']} onPress={() => router.back()} variant="standard" type="outline" buttonStyle={{ flex: 1 }} />
            <Button
              testID="quick-save"
              label={t['quickPractice.save']}
              onPress={handleSave}
              type="filled"
              disabled={count <= 0}
              buttonStyle={{ flex: 1 }}
            />
          </View>
        </View>
      </LinearGradient>
    </View>
  );
}
