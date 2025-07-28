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

const trainings: Training[] = [{date: new Date("2025-06-29"), arrows: 83}, {date: new Date("2025-06-30"), arrows: 80}, {date: new Date("2025-07-03"), arrows: 67}, {date: new Date("2025-06-02"), arrows: 53}]


export default function TrainingScreen() {
    // Komponenter: tittel, statistikk/oppsummering, liste av treninger, ny trening
  const [modalVisible, setModalVisible] = useState(false);
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Treninger</Text>
      </View>
      
      <Summary trainings={trainings} />
      <TrainingList/>

      <Button 
        onPress={() => {
            setModalVisible(true)
        }}
        icon={<FontAwesomeIcon icon={faPlus} size={20} color={colors.white} />} 
        label={'Ny trening'}/>

    </View>
  );
}
