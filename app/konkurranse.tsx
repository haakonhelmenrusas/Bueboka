import { useCallback, useState } from 'react';
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View, RefreshControl } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons/faChevronLeft';
import { colors } from '@/styles/colors';
import { useTranslation } from '@/contexts';
import { useCompetitions } from '@/hooks';
import { competitionRepository } from '@/services/repositories';
import type { Competition } from '@/types';
import { CompetitionCard, CompetitionStatsCard } from '@/components/competitions';
import { PracticeDetailsModal } from '@/components/practice/practiceDetailsModal';
import { styles } from '@/components/competitions/KonkurranseScreenStyles';

export default function KonkurranseScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();

  const { active, past, stats, loading, error, fetchCompetitions } = useCompetitions();
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCompetition, setSelectedCompetition] = useState<Competition | null>(null);

  useFocusEffect(
    useCallback(() => {
      fetchCompetitions();
    }, [fetchCompetitions]),
  );

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchCompetitions();
    setRefreshing(false);
  }, [fetchCompetitions]);

  const handleCardPress = useCallback(async (competition: Competition) => {
    try {
      const full = await competitionRepository.getById(competition.id);
      setSelectedCompetition(full);
    } catch (err) {
      console.error('[KonkurranseScreen] Error fetching competition:', err);
    }
  }, []);

  const hasCompetitions = active.length > 0 || past.length > 0;

  return (
    <View style={styles.container}>
      <LinearGradient colors={[colors.primary, colors.secondary, '#1a4f66']} style={styles.gradient}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top + 20 }]}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor="#FFFFFF" />}>
          <View style={styles.header}>
            <TouchableOpacity
              testID="konkurranse-back"
              style={styles.backButton}
              onPress={() => router.back()}
              accessibilityLabel={t['konkurranse.back']}>
              <FontAwesomeIcon icon={faChevronLeft} size={18} color={colors.white} />
            </TouchableOpacity>
            <Text style={styles.title}>{t['konkurranse.title']}</Text>
          </View>

          {loading && !hasCompetitions ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={colors.white} />
            </View>
          ) : null}

          {!loading && error ? (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>{t['konkurranse.fetchError']}</Text>
              <TouchableOpacity style={styles.retryButton} onPress={fetchCompetitions}>
                <Text style={styles.retryText}>{t['common.tryAgain']}</Text>
              </TouchableOpacity>
            </View>
          ) : null}

          {!loading && !error && !hasCompetitions ? (
            <View style={styles.emptyBox}>
              <Text style={styles.emptyTitle}>{t['konkurranse.empty']}</Text>
              <Text style={styles.emptyDesc}>{t['konkurranse.emptyDesc']}</Text>
            </View>
          ) : null}

          {hasCompetitions ? (
            <>
              <CompetitionStatsCard stats={stats} />

              {active.length > 0 ? (
                <>
                  <Text style={styles.sectionTitle}>{t['konkurranse.active']}</Text>
                  {active.map((competition) => (
                    <CompetitionCard key={competition.id} competition={competition} onPress={handleCardPress} />
                  ))}
                </>
              ) : null}

              {past.length > 0 ? (
                <>
                  <Text style={styles.sectionTitle}>{t['konkurranse.past']}</Text>
                  {past.map((competition) => (
                    <CompetitionCard key={competition.id} competition={competition} onPress={handleCardPress} />
                  ))}
                </>
              ) : null}
            </>
          ) : null}
        </ScrollView>
      </LinearGradient>

      <PracticeDetailsModal
        visible={!!selectedCompetition}
        practice={selectedCompetition}
        onClose={() => setSelectedCompetition(null)}
        onDeleted={() => {
          setSelectedCompetition(null);
          fetchCompetitions();
        }}
      />
    </View>
  );
}
