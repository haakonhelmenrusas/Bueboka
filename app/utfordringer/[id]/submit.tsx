import { useState, useEffect, useCallback } from 'react';
import { View, ScrollView, Text, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useChallenge } from '@/hooks/useChallenge';
import { useAuth } from '@/hooks';
import { Input, Button } from '@/components/common';
import { styles } from './submitStyles';
import { colors } from '@/styles/colors';
import { useTranslation } from '@/contexts';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faArrowLeft, faBullseye } from '@fortawesome/free-solid-svg-icons';

export default function SubmitChallengeResultPage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams();

  const { id } = params;

  const { currentChallenge, fetchChallengeById, submitChallengeResult } = useChallenge();

  const [score, setScore] = useState('');
  const [totalArrows, setTotalArrows] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const challengeId = typeof id === 'string' ? id : '';

  // Fetch challenge on mount
  useEffect(() => {
    if (challengeId) {
      fetchChallengeById(challengeId);
    }
  }, [challengeId, fetchChallengeById]);

  const handleBack = useCallback(() => {
    router.back();
  }, [router]);

  const handleSubmit = useCallback(async () => {
    if (!challengeId) return;

    setSubmitError(null);
    setSubmitting(true);

    try {
      const scoreValue = parseInt(score, 10);
      const arrowsValue = totalArrows ? parseInt(totalArrows, 10) : undefined;

      if (isNaN(scoreValue)) {
        setSubmitError(t['common.error']);
        return;
      }

      await submitChallengeResult(challengeId, {
        score: scoreValue,
        totalArrows: arrowsValue,
      });

      // Navigate back to challenge detail
      router.back();
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : t['common.error']);
    } finally {
      setSubmitting(false);
    }
  }, [challengeId, score, totalArrows, submitChallengeResult, router, t]);

  const isValid = score !== '' && !isNaN(parseInt(score, 10));

  if (!user) {
    return null;
  }

  if (!currentChallenge) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <LinearGradient colors={[colors.primary, colors.secondary, '#1a4f66']} style={styles.gradient}>
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={colors.white} />
              <Text style={styles.loadingText}>{t['common.loading']}...</Text>
            </View>
          </ScrollView>
        </LinearGradient>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <LinearGradient colors={[colors.primary, colors.secondary, '#1a4f66']} style={styles.gradient}>
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          <View style={styles.header}>
            <Button
              onPress={handleBack}
              label=""
              variant="tertiary"
              style={styles.backButton}
              icon={<FontAwesomeIcon icon={faArrowLeft} size={24} color={colors.white} />}
            />
            <View style={styles.headerContent}>
              <FontAwesomeIcon icon={faBullseye} size={20} color={colors.white} />
              <Text style={styles.title}>{t['challengeSubmit.title']}</Text>
            </View>
          </View>

          <View style={styles.form}>
            {/* Challenge info */}
            <View style={styles.info}>
              <Text style={styles.infoTitle}>{currentChallenge.name}</Text>
              <Text style={styles.infoOpponent}>
                {t['challenge.opponent']}:
                {currentChallenge.challengerId === user.id
                  ? currentChallenge.challenged?.name || t['challenge.unknownOpponent']
                  : currentChallenge.challenger?.name || t['challenge.unknownOpponent']}
              </Text>
            </View>

            {/* Form fields */}
            <Input
              label={t['challengeSubmit.yourScoreLabel']}
              value={score}
              onChangeText={setScore}
              placeholder="0"
              keyboardType="numeric"
              containerStyle={styles.field}
              inputStyle={styles.input}
              placeholderTextColor={'rgba(255, 255, 255, 0.5)'}
            />

            <Input
              label={t['challengeSubmit.totalArrowsLabel']}
              value={totalArrows}
              onChangeText={setTotalArrows}
              placeholder="0"
              keyboardType="numeric"
              containerStyle={styles.field}
              inputStyle={styles.input}
              placeholderTextColor={'rgba(255, 255, 255, 0.5)'}
            />

            {/* Error display */}
            {submitError && <Text style={styles.errorText}>{submitError}</Text>}

            {/* Submit button */}
            <Button
              label={submitting ? t['common.loading'] : t['challengeSubmit.submitButton']}
              onPress={handleSubmit}
              disabled={!isValid || submitting}
              style={styles.submitButton}
              loading={submitting}
            />
          </View>
        </ScrollView>
      </LinearGradient>
    </View>
  );
}
