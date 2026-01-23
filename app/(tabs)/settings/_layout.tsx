import { View } from 'react-native';
import { Slot } from 'expo-router';
import { styles } from '@/components/settings/SettingsLayoutStyles';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function SettingsLayout() {
  const { top: topPadding } = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: topPadding }]}>
      <Slot />
    </View>
  );
}
