import { Slot } from 'expo-router';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const Layout = () => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <Slot />
    </SafeAreaView>
  );
};
export default Layout;

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#fff',
    flex: 1,
  },
});
