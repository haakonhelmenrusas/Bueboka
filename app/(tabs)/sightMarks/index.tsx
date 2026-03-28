import { useCallback, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import CalculateScreen from '@/components/sightMarks/screens/CalculateScreen';
import MarksScreen from '@/components/sightMarks/screens/MarksScreen';
import { styles } from '@/components/sightMarks/SightMarksStyles';
import { useFocusEffect } from 'expo-router';
import { sightMarksRepository } from '@/services/repositories/sightMarksRepository';
import { colors } from '@/styles/colors';

export default function SightMarks() {
  const [screen, setScreen] = useState('calculate');
  const insets = useSafeAreaInsets();

  const loadData = useCallback(async () => {
    try {
      // Use API to check if user has any sight marks/results
      if (sightMarksRepository && typeof sightMarksRepository.getAll === 'function') {
        const sightMarks = await sightMarksRepository.getAll();
        if (sightMarks && Array.isArray(sightMarks) && sightMarks.length > 0) {
          setScreen('marks');
        }
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
      <LinearGradient colors={[colors.primary, colors.secondary, '#1a4f66']} style={styles.gradient}>
        <View style={{ paddingTop: insets.top + 16 }}>
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
        </View>
        {screen === 'calculate' && <CalculateScreen />}
        {screen === 'marks' && <MarksScreen setScreen={setScreen} />}
      </LinearGradient>
    </View>
  );
}
