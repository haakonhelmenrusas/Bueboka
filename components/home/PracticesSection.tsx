import { useCallback, useEffect, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons/faChevronRight';
import { PracticeCardItem } from '@/types';
import { practiceRepository } from '@/services/repositories';
import PracticeCard from '@/components/practice/practiceCard/PracticeCard';
import SkeletonTrainingCard from '@/components/practice/practiceCard/SkeletonTrainingCard';
import { styles } from './PracticesSectionStyles';
import { colors } from '@/styles/colors';

const RECENT_COUNT = 5;

interface Props {
  onSelectPractice: (id: string) => void;
  onSelectCompetition: (id: string) => void;
  /** Increment to trigger a data refresh from the parent */
  refreshKey?: number;
}

export function PracticesSection({ onSelectPractice, onSelectCompetition, refreshKey }: Props) {
  const router = useRouter();
  const [cards, setCards] = useState<PracticeCardItem[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchCards = useCallback(async () => {
    setLoading(true);
    try {
      const result = await practiceRepository.getCards({
        page: 1,
        pageSize: RECENT_COUNT,
        filter: 'all',
      });
      setCards(result.practices);
    } catch {
      // silently fail – network errors handled by offline layer
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCards();
  }, [refreshKey, fetchCards]);

  const handleCardPress = (card: PracticeCardItem) => {
    if (card.practiceType === 'KONKURRANSE') {
      onSelectCompetition(card.id);
    } else {
      onSelectPractice(card.id);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Siste aktivitet</Text>
        <TouchableOpacity
          style={styles.seeAllBtn}
          onPress={() => router.push('/(tabs)/aktivitet')}
          accessibilityLabel="Se alle aktiviteter">
          <Text style={styles.seeAllText}>Se alle</Text>
          <FontAwesomeIcon icon={faChevronRight} size={12} color={colors.warning} />
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.list}>
          {[0, 1, 2].map((i) => (
            <SkeletonTrainingCard key={i} />
          ))}
        </View>
      ) : cards.length === 0 ? (
        <View style={styles.placeholder}>
          <Text style={styles.placeholderText}>Ingen treninger eller konkurranser ennå</Text>
        </View>
      ) : (
        <View style={styles.list}>
          {cards.map((card) => (
            <PracticeCard key={`${card.practiceType}-${card.id}`} card={card} onPress={handleCardPress} />
          ))}
        </View>
      )}
    </View>
  );
}
