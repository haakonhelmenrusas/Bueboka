import { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import CalculateScreen from '@/components/sightMarks/screens/CalculateScreen';
import MarksScreen from '@/components/sightMarks/screens/MarksScreen';
import { styles } from '@/components/sightMarks/SightMarksStyles';

export default function SightMarks() {
  const [screen, setScreen] = useState('calculate');

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Beregn siktemerker</Text>
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerItem} onPress={() => setScreen('calculate')} activeOpacity={0.7}>
          <Text style={[styles.headerText, screen === 'calculate' ? styles.activeText : null]}>Innskyting</Text>
          {screen === 'calculate' && <View style={styles.activeLine} />}
        </TouchableOpacity>
        <TouchableOpacity style={styles.headerItem} onPress={() => setScreen('marks')} activeOpacity={0.7}>
          <Text style={[styles.headerText, screen === 'marks' ? styles.activeText : null]}>Siktemerker</Text>
          {screen === 'marks' && <View style={styles.activeLine} />}
        </TouchableOpacity>
      </View>
      {screen === 'calculate' && <CalculateScreen />}
      {screen === 'marks' && <MarksScreen setScreen={setScreen} />}
    </View>
  );
}
