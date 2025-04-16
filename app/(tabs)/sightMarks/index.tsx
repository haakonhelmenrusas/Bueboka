import { useState } from 'react';
import { Text, View } from 'react-native';
import CalculateScreen from '@/components/sightMarks/screens/CalculateScreen';
import MarksScreen from '@/components/sightMarks/screens/MarksScreen';
import { styles } from '@/components/sightMarks/SightMarksStyles';

export default function SightMarks() {
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
