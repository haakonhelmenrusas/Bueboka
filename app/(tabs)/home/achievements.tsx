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
import { styles } from '@/components/achievements/AchievementsScreenStyles';

export default function AchievementsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

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
      setError('Kunne ikke hente prestasjoner');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

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
                <Text style={styles.title}>Mine prestasjoner</Text>
              </View>
              <Text style={styles.subtitle}>Lås opp prestasjoner ved å trene og delta i konkurranser</Text>
            </View>
          </View>

          {loading && (
            <View style={styles.centered}>
              <ActivityIndicator size="large" color={colors.white} />
              <Text style={styles.loadingText}>Laster prestasjoner...</Text>
            </View>
          )}

          {!loading && error && (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>❌ {error}</Text>
              <TouchableOpacity style={styles.retryButton} onPress={loadData}>
                <Text style={styles.retryText}>Prøv igjen</Text>
              </TouchableOpacity>
            </View>
          )}

          {!loading && !error && data && (
            <>
              <View style={styles.summaryGrid}>
                <SummaryCard label="Låst opp" value={data.summary.totalUnlocked} />
                <SummaryCard label="Totalt" value={data.summary.totalAchievements} />
                <SummaryCard label="Fullført" value={`${data.summary.completionPercentage}%`} />
                <SummaryCard label="Poeng" value={data.summary.totalPoints} />
              </View>

              <View style={styles.filtersContainer}>
                <FilterRow
                  label="Status"
                  options={[
                    { key: 'all', label: 'Alle' },
                    { key: 'unlocked', label: 'Låst opp' },
                    { key: 'locked', label: 'Låst' },
                  ]}
                  activeKey={filterStatus}
                  onSelect={(k) => setFilterStatus(k as FilterStatus)}
                />
                <FilterRow
                  label="Kategori"
                  options={[
                    { key: 'all', label: 'Alle' },
                    { key: 'MILESTONE', label: 'Milepæler' },
                    { key: 'STREAK', label: 'Rekker' },
                    { key: 'PERFORMANCE', label: 'Prestasjon' },
                    { key: 'COMPETITION', label: 'Konkurranse' },
                    { key: 'DEDICATION', label: 'Dedikasjon' },
                    { key: 'EXPLORATION', label: 'Utforskning' },
                    { key: 'SPECIAL', label: 'Spesial' },
                  ]}
                  activeKey={filterCategory}
                  onSelect={(k) => setFilterCategory(k as FilterCategory)}
                />
                <FilterRow
                  label="Sjeldenhet"
                  options={[
                    { key: 'all', label: 'Alle' },
                    { key: 'COMMON', label: 'Vanlig' },
                    { key: 'UNCOMMON', label: 'Uvanlig' },
                    { key: 'RARE', label: 'Sjelden' },
                    { key: 'EPIC', label: 'Episk' },
                    { key: 'LEGENDARY', label: 'Legendarisk' },
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
                  <Text style={styles.emptyTitle}>Ingen merker funnet</Text>
                  <Text style={styles.emptySubtitle}>Prøv å endre filtrene dine</Text>
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
