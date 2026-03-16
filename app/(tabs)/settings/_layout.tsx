import { Platform, View } from 'react-native';
import { Slot } from 'expo-router';
import { styles } from '@/components/settings/SettingsLayoutStyles';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function SettingsLayout() {
  const insets = useSafeAreaInsets();
  const topPadding = Platform.OS === 'ios' ? Math.min(insets.top, 20) : insets.top;

  return (
    <View style={[styles.container, { paddingTop: topPadding }]}>
      <Slot />
    </View>
  );
}
