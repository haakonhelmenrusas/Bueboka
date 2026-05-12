import { ActivityIndicator, Text, TouchableOpacity } from 'react-native';
import { colors } from '@/styles/colors';
import { useTranslation } from '@/contexts';
import { styles } from './AktivitetStyles';

interface LoadMoreButtonProps {
  loading: boolean;
  remaining: number;
  onPress: () => void;
}

export default function LoadMoreButton({ loading, remaining, onPress }: LoadMoreButtonProps) {
  const { t } = useTranslation();
  return (
    <TouchableOpacity style={styles.loadMoreBtn} onPress={onPress} disabled={loading} accessibilityLabel={t['aktivitet.loadMore']}>
      {loading ? (
        <ActivityIndicator size="small" color={colors.primary} />
      ) : (
        <Text style={styles.loadMoreText}>{`${t['aktivitet.loadMore']} (${remaining} ${t['aktivitet.remaining']})`}</Text>
      )}
    </TouchableOpacity>
  );
}
