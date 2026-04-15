import { ActivityIndicator, Text, TouchableOpacity } from 'react-native';
import { colors } from '@/styles/colors';
import { styles } from './AktivitetStyles';

interface LoadMoreButtonProps {
  loading: boolean;
  remaining: number;
  onPress: () => void;
}

export default function LoadMoreButton({ loading, remaining, onPress }: LoadMoreButtonProps) {
  return (
    <TouchableOpacity style={styles.loadMoreBtn} onPress={onPress} disabled={loading} accessibilityLabel="Last mer">
      {loading ? (
        <ActivityIndicator size="small" color={colors.primary} />
      ) : (
        <Text style={styles.loadMoreText}>Last mer ({remaining} gjenstår)</Text>
      )}
    </TouchableOpacity>
  );
}
