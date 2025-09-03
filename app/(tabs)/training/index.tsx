import { Text } from 'react-native';
import { styles } from '@/components/training/TrainingStyles';
import { colors } from '@/styles/colors';
import Summary from '@/components/training/summary/Summary';
import TrainingList from '@/components/training/trainingList/TrainingList';
import { Button } from '@/components/common';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons/faPlus';
import { useCallback, useEffect, useState } from 'react';
import { Training } from '@/types';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import CreateTrainingForm from '@/components/training/trainingForm/CreateTrainingForm';
import { getLocalStorage } from '@/utils';
import SkeletonTrainingList from '@/components/training/trainingCard/SkeletonTrainingList';

export default function TrainingScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const [trainings, setTrainings] = useState<Training[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadTrainings = useCallback(async () => {
    setIsLoading(true);
    try {
      const storedTrainings = await getLocalStorage<Training[]>('trainings');
      if (storedTrainings && Array.isArray(storedTrainings)) {
        // Convert date strings back to Date objects if needed
        const trainingsWithDates = storedTrainings.map((training) => ({
          ...training,
          date: new Date(training.date),
        }));
        setTrainings(trainingsWithDates);
      } else {
        setTrainings([]);
      }
    } catch (error) {
      console.error('Error loading trainings:', error);
      setTrainings([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTrainings();
  }, [loadTrainings]);

  const handleTrainingSaved = () => {
    // Reload trainings when a new one is saved
    loadTrainings();
  };

  const renderTrainingContent = () => {
    if (isLoading) {
      return <SkeletonTrainingList />;
    }
    return <TrainingList trainings={trainings} />;
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <Text style={styles.title}>Treninger</Text>
      <Summary trainings={trainings} />
      {renderTrainingContent()}
      <Button
        onPress={() => {
          setModalVisible(true);
        }}
        icon={<FontAwesomeIcon icon={faPlus} size={20} color={colors.white} />}
        label={'Ny trening'}
      />
      <CreateTrainingForm
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        bows={[]}
        arrowSets={[]}
        onTrainingSaved={handleTrainingSaved}
      />
    </GestureHandlerRootView>
  );
}
