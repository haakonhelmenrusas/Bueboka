import { useState, useCallback } from 'react';
import { View, Text, ScrollView, FlatList, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter, useFocusEffect } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons/faChevronLeft';
import { faTrophy } from '@fortawesome/free-solid-svg-icons/faTrophy';
import { faStar } from '@fortawesome/free-solid-svg-icons/faStar';
import { colors } from '@/styles/colors';
import { achievementRepository } from '@/services/repositories';
import { AchievementBadge } from '@/components/achievements/AchievementBadge';
import { AchievementData, AchievementProgress, FilterCategory, FilterRarity, FilterStatus } from '@/types/Achievement';
import { useTranslation } from '@/contexts';
import { styles } from '@/components/achievements/AchievementsScreenStyles';

export default function AchievementsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();

  const [data, setData] = useState<AchievementData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [filterCategory, setFilterCategory] = useState<FilterCategory>('all');
  const [filterRarity, setFilterRarity] = useState<FilterRarity>('all');

  const loadData = useCallback(async () => {
    try {
      setError(null);
      const result = await achievementRepository.getAll();
      setData(result);
    } catch {
      setError(t['achievements.fetchError']);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [t]);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData]),
  );

  const handleRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  const filteredAchievements: AchievementProgress[] =
    data?.achievements.filter((a) => {
      if (filterStatus === 'unlocked' && !a.isUnlocked) return false;
      if (filterStatus === 'locked' && a.isUnlocked) return false;
      if (filterCategory !== 'all' && a.achievement.category !== filterCategory) return false;
      if (filterRarity !== 'all' && a.achievement.rarity !== filterRarity) return false;
      return true;
    }) ?? [];

  return (
    <View style={styles.container}>
      <LinearGradient colors={[colors.primary, colors.secondary, '#1a4f66']} style={styles.gradient}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top + 12 }]}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor={colors.white} />}>
          <View style={styles.headerRow}>
            <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
              <FontAwesomeIcon icon={faChevronLeft} size={18} color={colors.white} />
            </TouchableOpacity>
            <View style={styles.headerTextWrap}>
              <View style={styles.titleRow}>
                <FontAwesomeIcon icon={faTrophy} size={22} color={colors.warning} />
                <Text style={styles.title}>{t['home.myAchievements']}</Text>
              </View>
              <Text style={styles.subtitle}>{t['achievements.subtitle']}</Text>
            </View>
          </View>

          {loading && (
            <View style={styles.centered}>
              <ActivityIndicator size="large" color={colors.white} />
              <Text style={styles.loadingText}>{t['achievements.loading']}</Text>
            </View>
          )}

          {!loading && error && (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>❌ {error}</Text>
              <TouchableOpacity style={styles.retryButton} onPress={loadData}>
                <Text style={styles.retryText}>{t['achievements.retry']}</Text>
              </TouchableOpacity>
            </View>
          )}

          {!loading && !error && data && (
            <>
              <View style={styles.summaryGrid}>
                <SummaryCard label={t['achievements.summaryUnlocked']} value={data.summary.totalUnlocked} />
                <SummaryCard label={t['statsSummary.total']} value={data.summary.totalAchievements} />
                <SummaryCard label={t['achievements.summaryCompletion']} value={`${data.summary.completionPercentage}%`} />
                <SummaryCard label={t['achievements.summaryPoints']} value={data.summary.totalPoints} />
              </View>

              <View style={styles.filtersContainer}>
                <FilterRow
                  label={t['achievements.filterStatus']}
                  options={[
                    { key: 'all', label: t['aktivitet.filterAll'] },
                    { key: 'unlocked', label: t['achievements.filterStatusUnlocked'] },
                    { key: 'locked', label: t['achievements.filterStatusLocked'] },
                  ]}
                  activeKey={filterStatus}
                  onSelect={(k) => setFilterStatus(k as FilterStatus)}
                />
                <FilterRow
                  label={t['form.category']}
                  options={[
                    { key: 'all', label: t['aktivitet.filterAll'] },
                    { key: 'MILESTONE', label: t['achievements.filterMilestone'] },
                    { key: 'STREAK', label: t['achievements.filterStreak'] },
                    { key: 'PERFORMANCE', label: t['achievements.filterPerformance'] },
                    { key: 'COMPETITION', label: t['achievements.filterCompetition'] },
                    { key: 'DEDICATION', label: t['achievements.filterDedication'] },
                    { key: 'EXPLORATION', label: t['achievements.filterExploration'] },
                    { key: 'SPECIAL', label: t['achievements.filterSpecial'] },
                  ]}
                  activeKey={filterCategory}
                  onSelect={(k) => setFilterCategory(k as FilterCategory)}
                />
                <FilterRow
                  label={t['achievements.filterRarity']}
                  options={[
                    { key: 'all', label: t['aktivitet.filterAll'] },
                    { key: 'COMMON', label: t['achievements.rarityCommon'] },
                    { key: 'UNCOMMON', label: t['achievements.rarityUncommon'] },
                    { key: 'RARE', label: t['achievements.rarityRare'] },
                    { key: 'EPIC', label: t['achievements.rarityEpic'] },
                    { key: 'LEGENDARY', label: t['achievements.rarityLegendary'] },
                  ]}
                  activeKey={filterRarity}
                  onSelect={(k) => setFilterRarity(k as FilterRarity)}
                />
              </View>

              {filteredAchievements.length > 0 ? (
                <FlatList
                  data={filteredAchievements}
                  keyExtractor={(item) => item.achievement.id}
                  renderItem={({ item }) => <AchievementBadge progress={item} size="medium" showProgress />}
                  scrollEnabled={false}
                  ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
                />
              ) : (
                <View style={styles.emptyState}>
                  <FontAwesomeIcon icon={faStar} size={40} color={colors.white30} />
                  <Text style={styles.emptyTitle}>{t['achievements.emptyTitle']}</Text>
                  <Text style={styles.emptySubtitle}>{t['achievements.emptySubtitle']}</Text>
                </View>
              )}
            </>
          )}
        </ScrollView>
      </LinearGradient>
    </View>
  );
}

function SummaryCard({ label, value }: { label: string; value: number | string }) {
  return (
    <View style={styles.summaryCard}>
      <Text style={styles.summaryLabel}>{label}</Text>
      <Text style={styles.summaryValue}>{value}</Text>
    </View>
  );
}

interface FilterOption {
  key: string;
  label: string;
}

interface FilterRowProps {
  label: string;
  options: FilterOption[];
  activeKey: string;
  onSelect: (key: string) => void;
}

function FilterRow({ label, options, activeKey, onSelect }: FilterRowProps) {
  return (
    <View style={styles.filterGroup}>
      <Text style={styles.filterLabel}>{label}:</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterButtons}>
        {options.map((opt) => (
          <TouchableOpacity
            key={opt.key}
            style={[styles.filterButton, activeKey === opt.key && styles.filterButtonActive]}
            onPress={() => onSelect(opt.key)}>
            <Text style={[styles.filterButtonText, activeKey === opt.key && styles.filterButtonTextActive]}>{opt.label}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}
