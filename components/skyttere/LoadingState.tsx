import { View, Text, ActivityIndicator } from 'react-native';
import { colors } from '@/styles/colors';
import { styles } from './PublicProfileDetailStyles';

interface LoadingStateProps {
  message?: string;
}

export default function LoadingState({ message = 'Laster profil...' }: LoadingStateProps) {
  return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color={colors.white} />
      <Text style={styles.loadingText}>{message}</Text>
    </View>
  );
}
