import { View, Text, FlatList, ActivityIndicator } from 'react-native';
import { ChallengeListItem } from '@/types';
import ChallengeCard from './ChallengeCard';
import { styles } from './ChallengeListStyles';
import { colors } from '@/styles/colors';
import { useTranslation } from '@/contexts';

interface ChallengeListProps {
  challenges: ChallengeListItem[];
  loading: boolean;
  error: Error | null;
  onChallengePress: (challenge: ChallengeListItem) => void;
  onLoadMore?: () => void;
  hasMore?: boolean;
  refreshing?: boolean;
  onRefresh?: () => void;
}

export default function ChallengeList({
  challenges,
  loading,
  error,
  onChallengePress,
  onLoadMore,
  hasMore = false,
  refreshing = false,
  onRefresh,
}: ChallengeListProps) {
  const { t } = useTranslation();

  const renderFooter = () => {
    if (!loading && hasMore && onLoadMore) {
      return (
        <View style={styles.footer}>
          <ActivityIndicator size="small" color={colors.primary} />
        </View>
      );
    }
    return null;
  };

  if (loading && challenges.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>{t['challengeChallengeList.loading']}</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{t['challengeChallengeList.error']}</Text>
        <Text style={styles.errorDetails}>{error.message}</Text>
      </View>
    );
  }

  if (challenges.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyTitle}>{t['challengeChallengeList.empty']}</Text>
        <Text style={styles.emptyDescription}>{t['challengeChallengeList.emptyDesc']}</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={challenges}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <ChallengeCard challenge={item} onPress={onChallengePress} />}
      contentContainerStyle={styles.list}
      ListFooterComponent={renderFooter}
      onEndReached={hasMore && onLoadMore ? () => onLoadMore?.() : undefined}
      onEndReachedThreshold={0.5}
      refreshing={refreshing}
      onRefresh={onRefresh}
    />
  );
}
