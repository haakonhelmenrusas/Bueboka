import { View, Text, ActivityIndicator } from 'react-native';
import { colors } from '@/styles/colors';
import { styles } from './PublicProfileDetailStyles';
import { useTranslation } from '@/contexts';

interface LoadingStateProps {
  message?: string;
}

export default function LoadingState({ message }: LoadingStateProps) {
  const { t } = useTranslation();
  const displayMessage = message ?? t['skyttere.loadingProfile'];
  return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color={colors.white} />
      <Text style={styles.loadingText}>{displayMessage}</Text>
    </View>
  );
}
