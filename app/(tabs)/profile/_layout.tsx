import { Slot } from 'expo-router';
import { Platform, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '@/styles/colors';

const Layout = () => {
  const insets = useSafeAreaInsets();

  const topPadding = Platform.OS === 'ios' ? Math.min(insets.top, 40) : Math.max(insets.top, 32);
  return (
    <View style={[styles.container, { paddingTop: topPadding }]}>
      <Slot />
    </View>
  );
};

export default Layout;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    flex: 1,
  },
});
