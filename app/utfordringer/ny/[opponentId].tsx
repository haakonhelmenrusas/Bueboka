import { useState, useEffect, useCallback } from 'react';
import { View, ScrollView, Text, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useAuth } from '@/hooks';
import { publicProfilesApi } from '@/services';
import { useChallenge } from '@/hooks/useChallenge';
import type { PublicProfile, CreateChallengeData } from '@/types';
import { styles } from '@/components/challenges/NyChallengeScreenStyles';
import { colors } from '@/styles/colors';
import { useTranslation } from '@/contexts';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from '@/components/common';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faUser, faArrowLeft, faTrophy } from '@fortawesome/free-solid-svg-icons';
import { ChallengeForm } from '@/components/challenges';

export default function ChallengeFormPage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const router = useRouter();
  const params = useLocalSearchParams<{ opponentId: string }>();
  const insets = useSafeAreaInsets();
  const { createChallenge } = useChallenge();

  const [opponent, setOpponent] = useState<PublicProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Load opponent by ID from route params
  useEffect(() => {
    if (!params.opponentId) return;

    const load = async () => {
      setLoading(true);
      try {
        const data = await publicProfilesApi.getById(params.opponentId);
        if (data.id === user?.id) {
          router.back();
          return;
        }
        setOpponent(data);
      } catch (err) {
        console.error('Error loading opponent:', err);
        router.back();
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [params.opponentId, user?.id, router]);

  const handleBack = useCallback(() => {
    router.back();
  }, [router]);

  const handleCancelForm = useCallback(() => {
    router.back();
  }, [router]);

  const handleSubmitForm = useCallback(
    async (data: CreateChallengeData) => {
      setFormLoading(true);
      setFormError(null);
      try {
        await createChallenge(data, opponent?.name ?? undefined);
        router.replace('/utfordringer');
      } catch (err) {
        setFormError(err instanceof Error ? err.message : t['common.unknownError']);
      } finally {
        setFormLoading(false);
      }
    },
    [createChallenge, router, t, opponent?.name],
  );

  if (!user) {
    return null;
  }

  if (loading) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <LinearGradient colors={[colors.primary, colors.secondary, '#1a4f66']} style={styles.gradient}>
          <View style={[styles.scrollContent, { flex: 1, justifyContent: 'center' }]}>
            <ActivityIndicator size="large" color={colors.white} />
          </View>
        </LinearGradient>
      </View>
    );
  }

  if (!opponent) {
    return null;
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top, flex: 1 }]}>
      <LinearGradient colors={[colors.primary, colors.secondary, '#1a4f66']} style={styles.gradient}>
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          <View style={styles.header}>
            <Button
              onPress={handleBack}
              label=""
              variant="tertiary"
              buttonStyle={styles.backButton}
              icon={<FontAwesomeIcon icon={faArrowLeft} size={24} color={colors.white} />}
            />
            <View style={styles.headerContent}>
              <FontAwesomeIcon icon={faTrophy} size={24} color={colors.white} />
              <Text style={styles.title}>{t['challenge.createNew']}</Text>
            </View>
          </View>

          <View style={styles.content}>
            {/* Selected opponent info */}
            <View style={styles.selectedOpponentContainer}>
              <Text style={styles.selectedOpponentLabel}>{t['challenge.selectedOpponent']}</Text>
              <View style={styles.selectedOpponentInfo}>
                <FontAwesomeIcon icon={faUser} size={20} color={colors.white} />
                <View style={styles.opponentDetails}>
                  <Text style={styles.opponentName}>{opponent.name || t['challenge.unknownOpponent']}</Text>
                  {opponent.club && <Text style={styles.opponentClub}>{opponent.club}</Text>}
                </View>
              </View>
            </View>

            {/* Form container with light background */}
            <View style={styles.formContainer}>
              <ChallengeForm
                opponent={opponent}
                onSubmit={handleSubmitForm}
                onCancel={handleCancelForm}
                loading={formLoading}
                error={formError}
              />
            </View>
          </View>
        </ScrollView>
      </LinearGradient>
    </View>
  );
}
