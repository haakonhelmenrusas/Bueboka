import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';
import { PracticeCardItem, PracticeFilter } from '@/types';
import { practiceRepository } from '@/services/repositories';
import { colors } from '@/styles/colors';
import PracticeCard from '@/components/practice/practiceCard/PracticeCard';
import SkeletonTrainingCard from '@/components/practice/practiceCard/SkeletonTrainingCard';
import { styles } from './PracticesSectionStyles';

const PAGE_SIZE = 10;

const FILTERS: { label: string; value: PracticeFilter }[] = [
  { label: 'Alle', value: 'all' },
  { label: 'Treninger', value: 'TRENING' },
  { label: 'Konkurranser', value: 'KONKURRANSE' },
];

interface Props {
  onSelectPractice: (id: string) => void;
  onSelectCompetition: (id: string) => void;
  /** Increment to trigger a data refresh from the parent */
  refreshKey?: number;
}

export function PracticesSection({ onSelectPractice, onSelectCompetition, refreshKey }: Props) {
  const [filter, setFilter] = useState<PracticeFilter>('all');
  const [cards, setCards] = useState<PracticeCardItem[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  const fetchCards = useCallback(async (currentFilter: PracticeFilter, currentPage: number, append = false) => {
    if (currentPage === 1) setLoading(true);
    else setLoadingMore(true);
    try {
      const result = await practiceRepository.getCards({
        page: currentPage,
        pageSize: PAGE_SIZE,
        filter: currentFilter,
      });
      setTotal(result.total);
      setCards((prev) => (append ? [...prev, ...result.practices] : result.practices));
    } catch {
      // silently fail – network errors handled by offline layer
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);

  // Reload when filter changes or refreshKey changes
  useEffect(() => {
    setPage(1);
    fetchCards(filter, 1, false);
  }, [filter, refreshKey, fetchCards]);

  const handleFilterChange = (newFilter: PracticeFilter) => {
    if (newFilter === filter) return;
    setFilter(newFilter);
  };

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchCards(filter, nextPage, true);
  };

  const handleCardPress = (card: PracticeCardItem) => {
    if (card.practiceType === 'KONKURRANSE') {
      onSelectCompetition(card.id);
    } else {
      onSelectPractice(card.id);
    }
  };

  const hasMore = cards.length < total;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Treninger og konkurranser</Text>
      </View>

      {/* Filter tabs */}
      <View style={styles.filterRow}>
        {FILTERS.map((f) => (
          <TouchableOpacity
            key={f.value}
            style={[styles.filterTab, filter === f.value && styles.filterTabActive]}
            onPress={() => handleFilterChange(f.value)}
            accessibilityLabel={f.label}>
            <Text style={[styles.filterTabText, filter === f.value && styles.filterTabTextActive]}>{f.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {loading ? (
        <View style={styles.list}>
          {[0, 1, 2].map((i) => (
            <SkeletonTrainingCard key={i} />
          ))}
        </View>
      ) : cards.length === 0 ? (
        <View style={styles.placeholder}>
          <Text style={styles.placeholderText}>
            {filter === 'TRENING'
              ? 'Ingen treninger lagt til ennå'
              : filter === 'KONKURRANSE'
                ? 'Ingen konkurranser lagt til ennå'
                : 'Ingen treninger eller konkurranser ennå'}
          </Text>
        </View>
      ) : (
        <View style={styles.list}>
          {cards.map((card) => (
            <PracticeCard key={`${card.practiceType}-${card.id}`} card={card} onPress={handleCardPress} />
          ))}

          {hasMore && (
            <TouchableOpacity style={styles.loadMoreBtn} onPress={handleLoadMore} disabled={loadingMore} accessibilityLabel="Last mer">
              {loadingMore ? (
                <ActivityIndicator size="small" color={colors.primary} />
              ) : (
                <Text style={styles.loadMoreText}>Last mer ({total - cards.length} gjenstår)</Text>
              )}
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
}
