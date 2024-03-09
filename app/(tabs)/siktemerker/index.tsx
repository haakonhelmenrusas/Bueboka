import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import CalculateScreen from './screens/CalculateScreen';
import MarksScreen from './screens/MarksScreen';

export default function Calculate() {
  const [screen, setScreen] = useState('calculate');

  return (
    <View style={{ flex: 1 }}>
      <Text style={styles.title}>Beregn siktemerker</Text>
      <View style={styles.header}>
        <Text
          style={[styles.headerText, screen === 'calculate' ? styles.underline : null]}
          onPress={() => setScreen('calculate')}>
          Innskyting
        </Text>
        <Text
          style={[styles.headerText, screen === 'marks' ? styles.underline : null]}
          onPress={() => setScreen('marks')}>
          Siktemerker
        </Text>
      </View>
      {screen === 'calculate' && <CalculateScreen />}
      {screen === 'marks' && <MarksScreen setScreen={setScreen} />}
    </View>
  );
}
const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    marginTop: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    textDecorationLine: 'none',
  },
  underline: {
    textDecorationLine: 'underline',
  },
});
