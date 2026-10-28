import { useState, useEffect, useCallback, useRef } from 'react';
import { View, ScrollView, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect, usePathname, useRouter } from 'expo-router';
import { ChallengeList } from '@/components/challenges';
import { useChallenge } from '@/hooks/useChallenge';
import { usePendingChallenges } from '@/hooks/usePendingChallenges';
import { ChallengeListItem, ChallengeStatus } from '@/types';
import { styles } from './utfordringerStyles.styles';
import { colors } from '@/styles/colors';
import { useAuth } from '@/hooks';
import { Button, Message, NotificationBadge } from '@/components/common';
import { useTranslation } from '@/contexts';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faTrophy, faPlus, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { RefreshControl } from 'react-native';

export default function ChallengesPage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const pathname = usePathname();
  const { pendingCount } = usePendingChallenges();

  const { challenges, loading, error, pagination, fetchChallenges } = useChallenge();

  const [filterStatus, setFilterStatus] = useState<string>('');
  const [refreshing, setRefreshing] = useState(false);

  // Track the previous pathname to detect navigation
  const previousPathname = useRef<string>(pathname);

  // Clear filter when returning to this screen
  useFocusEffect(
    useCallback(() => {
      const isReturningFromDetailScreen =
        previousPathname.current.startsWith('/utfordringer/') && previousPathname.current !== '/utfordringer';

      if (!isReturningFromDetailScreen && previousPathname.current !== pathname) {
        setFilterStatus('');
      }

      // Update previous pathname
      previousPathname.current = pathname;
    }, [pathname]),
  );

  // Load challenges on mount and when filter changes
  useEffect(() => {
    if (user) {
      fetchChallenges({ status: (filterStatus as ChallengeStatus) || undefined });
    }
  }, [filterStatus, user, fetchChallenges]);

  // Refresh on focus
  useFocusEffect(
    useCallback(() => {
      if (user) {
        fetchChallenges({
          status: (filterStatus as ChallengeStatus) || undefined,
          forceRefresh: true,
        });
      }
    }, [filterStatus, user, fetchChallenges]),
  );

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await fetchChallenges({
        status: (filterStatus as ChallengeStatus) || undefined,
        forceRefresh: true,
      });
    } finally {
      setRefreshing(false);
    }
  }, [filterStatus, fetchChallenges]);

  const handleChallengePress = useCallback(
    (challenge: ChallengeListItem) => {
      router.push(`/utfordringer/${challenge.id}`);
    },
    [router],
  );

  const handleCreateNew = useCallback(() => {
    router.push('/utfordringer/ny');
  }, [router]);

  const handleFilterChange = useCallback((status: string) => {
    setFilterStatus(status);
  }, []);

  if (!user) {
    return (
      <View style={styles.container}>
        <Message title={t['challenge.title']} description={t['skyttere.notLoggedInDesc']} />
      </View>
    );
  }

  // Status filter options
  const filterOptions = [
    { value: '', label: t['aktivitet.filterAll'] },
    { value: ChallengeStatus.PENDING, label: t['challenge.statusPending'] },
    { value: ChallengeStatus.ACCEPTED, label: t['challenge.statusAccepted'] },
    { value: ChallengeStatus.COMPLETED, label: t['challenge.statusCompleted'] },
  ];

  return (
    <View style={styles.container}>
      <LinearGradient colors={[colors.primary, colors.secondary, '#1a4f66']} style={styles.gradient}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top }]}
          keyboardShouldPersistTaps="always"
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor={colors.white} />}>
          {/* Header */}
          <View style={styles.header}>
            <Button
              onPress={() => router.back()}
              label=""
              variant="tertiary"
              style={styles.backButton}
              icon={<FontAwesomeIcon icon={faArrowLeft} size={24} color={colors.white} />}
            />
            <View style={styles.headerContent}>
              <FontAwesomeIcon icon={faTrophy} size={28} color={colors.white} />
              <View style={styles.headerText}>
                <Text style={styles.title}>{t['challenge.title']}</Text>
                <Text style={styles.subtitle}>{t['challenge.subtitle']}</Text>
              </View>
              {pendingCount > 0 && (
                <View style={styles.notificationContainer}>
                  <NotificationBadge count={pendingCount} />
                </View>
              )}
            </View>
          </View>

          {/* Filter */}
          <View style={styles.filterContainer}>
            <View style={styles.filterButtons}>
              {filterOptions.map((option) => (
                <View key={option.value} style={[styles.filterButton, filterStatus === option.value && styles.filterButtonActive]}>
                  <Text
                    style={[styles.filterButtonText, filterStatus === option.value && styles.filterButtonTextActive]}
                    onPress={() => handleFilterChange(option.value)}>
                    {option.label}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          {/* Create Button */}
          <View style={styles.createButtonContainer}>
            <Button
              label={t['challenge.createNew']}
              onPress={handleCreateNew}
              style={styles.createButton}
              icon={<FontAwesomeIcon icon={faPlus} size={18} color={colors.primary} />}
            />
          </View>

          {/* Challenges List */}
          <View style={styles.listContainer}>
            {error ? (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{t['challengeChallengeList.error']}</Text>
                <Button label={t['common.tryAgain']} onPress={handleRefresh} />
              </View>
            ) : (
              <ChallengeList
                challenges={challenges}
                loading={loading && challenges.length === 0}
                error={error}
                onChallengePress={handleChallengePress}
                hasMore={pagination.page * pagination.pageSize < pagination.total}
                onLoadMore={() => {
                  if (pagination.page * pagination.pageSize < pagination.total) {
                    fetchChallenges({
                      page: pagination.page + 1,
                      status: (filterStatus as ChallengeStatus) || undefined,
                    });
                  }
                }}
                refreshing={refreshing}
                onRefresh={handleRefresh}
              />
            )}
          </View>
        </ScrollView>
      </LinearGradient>
    </View>
  );
}
