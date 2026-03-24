import { useState, useCallback } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter, useFocusEffect } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons/faChevronLeft';
import { colors } from '@/styles/colors';
import { statsApi } from '@/services/api/statsApi';
import type { Series } from '@/types';
import { filterSeriesByDate, getUniqueCategories, type DateRange } from '@/components/home/statistics/constants';
import { FilterControls } from '@/components/home/statistics/FilterControls';
import { BreakdownSection } from '@/components/home/statistics/BreakdownSection';
import { ArrowsChart } from '@/components/home/statistics/ArrowsChart';
import { ScoreChart } from '@/components/home/statistics/ScoreChart';
import { EmptyState } from '@/components/home/statistics/EmptyState';

export default function StatisticsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [series, setSeries] = useState<Series[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<DateRange>('all');
  const [arrowsCategory, setArrowsCategory] = useState('all');
  const [scoreCategory, setScoreCategory] = useState('all');

  const loadData = useCallback(async () => {
    try {
      setError(null);
      const data = await statsApi.getDetailedStats();
      setSeries(data);
    } catch {
      setError('Kunne ikke hente statistikk');
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

  const filteredSeries = filterSeriesByDate(series, dateRange);
  const categories = getUniqueCategories(filteredSeries);

  return (
    <View style={styles.container}>
      <LinearGradient colors={[colors.primary, colors.secondary, '#1a4f66']} style={styles.gradient}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top + 8 }]}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor="#FFFFFF" />}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.backButton}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
              <FontAwesomeIcon icon={faChevronLeft} size={18} color={colors.white} />
            </TouchableOpacity>
            <View>
              <Text style={styles.title}>Statistikk</Text>
              <Text style={styles.subtitle}>Detaljert oversikt over din skyting</Text>
            </View>
          </View>

          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={colors.white} />
              <Text style={styles.loadingText}>Laster statistikk…</Text>
            </View>
          ) : error ? (
            <View style={styles.loadingContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : series.length === 0 ? (
            <EmptyState />
          ) : (
            <>
              <FilterControls
                dateRange={dateRange}
                onDateRangeChange={setDateRange}
                categories={categories}
                arrowsCategory={arrowsCategory}
                onArrowsCategoryChange={setArrowsCategory}
                scoreCategory={scoreCategory}
                onScoreCategoryChange={setScoreCategory}
              />

              <BreakdownSection series={filteredSeries} />

              <ArrowsChart series={filteredSeries} selectedCategory={arrowsCategory} />

              <ScoreChart series={filteredSeries} selectedCategory={scoreCategory} />
            </>
          )}
        </ScrollView>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 48,
    gap: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 4,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: colors.white,
  },
  subtitle: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 2,
  },
  loadingContainer: {
    paddingTop: 80,
    alignItems: 'center',
    gap: 16,
  },
  loadingText: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.7)',
  },
  errorText: {
    fontSize: 15,
    color: colors.errorLight,
  },
});
