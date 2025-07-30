import { Linking, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { styles } from '@/components/training/TrainingStyles';
import { colors } from '@/styles/colors';
import Summary from '@/components/training/summary/Summary';
import TrainingList from '@/components/training/trainingList/TrainingList';
import { Button } from '@/components/common';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons/faPlus';
import { useState } from 'react';
import { Training } from '@/types';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const trainings: Training[] = [{date: new Date(), arrows: 83}, {date: new Date("2025-06-30"), arrows: 80}, {date: new Date("2025-07-03"), arrows: 67}, {date: new Date("2025-06-02"), arrows: 53}]


export default function TrainingScreen() {
    // Komponenter: tittel, statistikk/oppsummering, liste av treninger, ny trening
  const [modalVisible, setModalVisible] = useState(false);
  return (
    <GestureHandlerRootView style={styles.container}>
      <Text style={styles.title}>Treninger</Text>
  
      <Summary trainings={trainings} />
      <TrainingList trainings={trainings} />

      <Button 
        onPress={() => {
            setModalVisible(true)
        }}
        icon={<FontAwesomeIcon icon={faPlus} size={20} color={colors.white} />} 
        label={'Ny trening'}/>
    </GestureHandlerRootView>
  );
}
