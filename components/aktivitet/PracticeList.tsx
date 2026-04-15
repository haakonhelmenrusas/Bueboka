import { View } from 'react-native';
import { PracticeCardItem, PracticeFilter } from '@/types';
import PracticeCard from '@/components/practice/practiceCard/PracticeCard';
import SkeletonTrainingCard from '@/components/practice/practiceCard/SkeletonTrainingCard';
import EmptyState from './EmptyState';
import LoadMoreButton from './LoadMoreButton';
import { styles } from './AktivitetStyles';

interface PracticeListProps {
  cards: PracticeCardItem[];
  loading: boolean;
  loadingMore: boolean;
  filter: PracticeFilter;
  hasMore: boolean;
  total: number;
  onCardPress: (card: PracticeCardItem) => void;
  onLoadMore: () => void;
}

export default function PracticeList({ cards, loading, loadingMore, filter, hasMore, total, onCardPress, onLoadMore }: PracticeListProps) {
  if (loading) {
    return (
      <View style={styles.list}>
        {[0, 1, 2, 3].map((i) => (
          <SkeletonTrainingCard key={i} />
        ))}
      </View>
    );
  }

  if (cards.length === 0) {
    return <EmptyState filter={filter} />;
  }

  return (
    <View style={styles.list}>
      {cards.map((card) => (
        <PracticeCard key={`${card.practiceType}-${card.id}`} card={card} onPress={onCardPress} />
      ))}
      {hasMore && <LoadMoreButton loading={loadingMore} remaining={total - cards.length} onPress={onLoadMore} />}
    </View>
  );
}
