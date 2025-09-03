import { useCallback, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import CalculateScreen from '@/components/sightMarks/screens/CalculateScreen';
import MarksScreen from '@/components/sightMarks/screens/MarksScreen';
import { styles } from '@/components/sightMarks/SightMarksStyles';
import { getLocalStorage } from '@/utils';
import { MarksResult } from '@/types';
import { useFocusEffect } from 'expo-router';

export default function SightMarks() {
  const [screen, setScreen] = useState('calculate');

  const loadData = useCallback(async () => {
    try {
      const calculatedMarksData = await getLocalStorage<MarksResult>('calculatedMarks');
      if (calculatedMarksData) {
        setScreen('marks');
      }
    } catch (error) {
      console.error('Error loading data:', error);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData]),
  );

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
