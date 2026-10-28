import { useState, useEffect, useCallback } from 'react';
import { View, ScrollView, ActivityIndicator, Text, RefreshControl } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ChallengeDetail } from '@/components/challenges';
import { useChallenge } from '@/hooks/useChallenge';
import { useAuth } from '@/hooks';
import { styles } from './detailStyles';
import { colors } from '@/styles/colors';
import { useTranslation } from '@/contexts';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button, Message } from '@/components/common';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faArrowLeft, faTrophy } from '@fortawesome/free-solid-svg-icons';

export default function ChallengeDetailPage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams();

  const { id } = params;

  const { currentChallenge, loading, error, fetchChallengeById, acceptChallenge, declineChallenge, cancelChallenge, deleteChallenge } =
    useChallenge();

  const [refreshing, setRefreshing] = useState(false);

  // Fetch challenge on mount
  useEffect(() => {
    if (id && typeof id === 'string') {
      fetchChallengeDetails(id);
    }
  }, [id, fetchChallengeDetails]);

  const fetchChallengeDetails = useCallback(
    async (challengeId: string) => {
      try {
        await fetchChallengeById(challengeId);
      } catch (err) {
        console.error('Error fetching challenge:', err);
      }
    },
    [fetchChallengeById],
  );

  const handleRefresh = useCallback(async () => {
    if (!id || typeof id !== 'string') return;
    setRefreshing(true);
    try {
      await fetchChallengeDetails(id);
    } finally {
      setRefreshing(false);
    }
  }, [id, fetchChallengeDetails]);

  const handleBack = useCallback(() => {
    router.back();
  }, [router]);

  const handleAccept = useCallback(async () => {
    if (!currentChallenge?.id) return;
    try {
      await acceptChallenge(currentChallenge.id);
      await fetchChallengeDetails(currentChallenge.id);
    } catch (err) {
      console.error('Error accepting challenge:', err);
    }
  }, [currentChallenge?.id, acceptChallenge, fetchChallengeDetails]);

  const handleDecline = useCallback(async () => {
    if (!currentChallenge?.id) return;
    try {
      await declineChallenge(currentChallenge.id);
      router.back();
    } catch (err) {
      console.error('Error declining challenge:', err);
    }
  }, [currentChallenge?.id, declineChallenge, router]);

  const handleCancel = useCallback(async () => {
    if (!currentChallenge?.id) return;
    try {
      await cancelChallenge(currentChallenge.id);
      router.back();
    } catch (err) {
      console.error('Error cancelling challenge:', err);
    }
  }, [currentChallenge?.id, cancelChallenge, router]);

  const handleDelete = useCallback(async () => {
    if (!currentChallenge?.id) return;
    try {
      await deleteChallenge(currentChallenge.id);
      router.back();
    } catch (err) {
      console.error('Error deleting challenge:', err);
    }
  }, [currentChallenge?.id, deleteChallenge, router]);

  const handleNavigateToSubmit = useCallback(() => {
    if (!currentChallenge?.id) return;
    router.push(`/utfordringer/${currentChallenge.id}/submit`);
  }, [currentChallenge?.id, router]);

  if (!user) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <LinearGradient colors={[colors.primary, colors.secondary, '#1a4f66']} style={styles.gradient}>
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <Message title={t['common.error']} description={t['skyttere.notLoggedInDesc']} />
          </ScrollView>
        </LinearGradient>
      </View>
    );
  }

  if (loading && !currentChallenge) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <LinearGradient colors={[colors.primary, colors.secondary, '#1a4f66']} style={styles.gradient}>
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor={colors.white} />}>
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={colors.white} />
            </View>
          </ScrollView>
        </LinearGradient>
      </View>
    );
  }

  if (error && !currentChallenge) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <LinearGradient colors={[colors.primary, colors.secondary, '#1a4f66']} style={styles.gradient}>
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <View style={styles.errorContainer}>
              <Text style={styles.errorTitle}>{t['common.error']}</Text>
              <Text style={styles.errorText}>{error.message}</Text>
              <Button label={t['common.tryAgain']} onPress={handleRefresh} />
            </View>
          </ScrollView>
        </LinearGradient>
      </View>
    );
  }

  if (!currentChallenge) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <LinearGradient colors={[colors.primary, colors.secondary, '#1a4f66']} style={styles.gradient}>
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <Message title={t['common.error']} description={t['challengeChallengeList.error']} />
          </ScrollView>
        </LinearGradient>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <LinearGradient colors={[colors.primary, colors.secondary, '#1a4f66']} style={styles.gradient}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor={colors.white} />}>
          <View style={styles.header}>
            <Button
              onPress={handleBack}
              label=""
              variant="tertiary"
              style={styles.backButton}
              icon={<FontAwesomeIcon icon={faArrowLeft} size={24} color={colors.white} />}
            />
            <View style={styles.headerContent}>
              <FontAwesomeIcon icon={faTrophy} size={24} color={colors.white} />
              <Text style={styles.title}>{currentChallenge.name}</Text>
            </View>
          </View>

          <ChallengeDetail
            challenge={currentChallenge}
            currentUserId={user.id}
            onAccept={handleAccept}
            onDecline={handleDecline}
            onCancel={handleCancel}
            onDelete={handleDelete}
            onSubmitResult={handleNavigateToSubmit}
            loading={loading || refreshing}
          />
        </ScrollView>
      </LinearGradient>
    </View>
  );
}
