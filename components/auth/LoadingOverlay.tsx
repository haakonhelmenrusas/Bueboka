import { View, ActivityIndicator } from 'react-native';
import { colors } from '@/styles/colors';
import { styles } from './AuthStyles';

export default function LoadingOverlay() {
  return (
    <View style={styles.loadingOverlay}>
      <ActivityIndicator size="large" color={colors.primary} />
    </View>
  );
}
