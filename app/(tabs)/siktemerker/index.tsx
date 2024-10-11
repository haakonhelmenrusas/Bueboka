import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import CalculateScreen from './screens/CalculateScreen';
import MarksScreen from './screens/MarksScreen';

export default function Calculate() {
  const [screen, setScreen] = useState('calculate');

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Beregn siktemerker</Text>
      <View style={styles.header}>
        <View style={styles.headerItem}>
          <Text
            style={[styles.headerText, screen === 'calculate' ? styles.activeText : null]}
            onPress={() => setScreen('calculate')}>
            Innskyting
          </Text>
          {screen === 'calculate' && <View style={styles.activeLine} />}
        </View>
        <View style={styles.headerItem}>
          <Text
            style={[styles.headerText, screen === 'marks' ? styles.activeText : null]}
            onPress={() => setScreen('marks')}>
            Siktemerker
          </Text>
          {screen === 'marks' && <View style={styles.activeLine} />}
        </View>
      </View>
      {screen === 'calculate' && <CalculateScreen />}
      {screen === 'marks' && <MarksScreen setScreen={setScreen} />}
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 24,
    marginTop: 24,
    textAlign: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  headerItem: {
    flexDirection: 'column',
    alignItems: 'center',
    width: '50%',
  },
  headerText: {
    fontSize: 18,
    paddingBottom: 8,
    fontWeight: '600',
    color: '#666',
  },
  activeText: {
    color: '#227B9A',
  },
  activeLine: {
    height: 2,
    width: '100%',
    backgroundColor: '#227B9A',
  },
});
