import { Text } from 'react-native';
import { styles } from '@/components/training/TrainingStyles';
import { colors } from '@/styles/colors';
import Summary from '@/components/training/summary/Summary';
import TrainingList from '@/components/training/trainingList/TrainingList';
import { Button } from '@/components/common';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons/faPlus';
import { useCallback, useState } from 'react';
import { ArrowSet, Bow, Training } from '@/types';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import CreateTrainingForm from '@/components/training/trainingForm/CreateTrainingForm';
import { getLocalStorage } from '@/utils';
import SkeletonTrainingList from '@/components/training/trainingCard/SkeletonTrainingList';
import * as Sentry from '@sentry/react-native';
import { useFocusEffect } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function TrainingScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const [trainings, setTrainings] = useState<Training[]>([]);
  const [bows, setBows] = useState<Bow[]>([]);
  const [arrowSets, setArrowSets] = useState<ArrowSet[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingTraining, setEditingTraining] = useState<Training | null>(null);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [storedTrainings, storedBows, storedArrowSets] = await Promise.all([
        getLocalStorage<Training[]>('trainings'),
        getLocalStorage<Bow[]>('bows'),
        getLocalStorage<ArrowSet[]>('arrowSets'),
      ]);

      if (storedTrainings && Array.isArray(storedTrainings)) {
        const trainingsWithDates = storedTrainings.map((training) => ({
          ...training,
          date: new Date(training.date),
        }));
        setTrainings(trainingsWithDates);
      } else {
        setTrainings([]);
      }

      if (storedBows && Array.isArray(storedBows)) {
        setBows(storedBows);
      } else {
        setBows([]);
      }

      if (storedArrowSets && Array.isArray(storedArrowSets)) {
        setArrowSets(storedArrowSets);
      } else {
        setArrowSets([]);
      }
    } catch (error) {
      Sentry.captureException('Error loading training data', error);
      setTrainings([]);
      setBows([]);
      setArrowSets([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData]),
  );

  const handleOpenModal = () => {
    loadData(); // Refresh data when opening modal
    setModalVisible(true);
  };

  const handleTrainingSaved = () => {
    loadData();
  };

  const handleEditTraining = (training: Training) => {
    setEditingTraining(training);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setEditingTraining(null);
  };

  const renderTrainingContent = () => {
    if (isLoading) {
      return <SkeletonTrainingList />;
    }
    return <TrainingList trainings={trainings} onEditTraining={handleEditTraining} />;
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <GestureHandlerRootView style={styles.container}>
        <Text style={styles.title}>Treninger</Text>
        <Summary trainings={trainings} />
        {renderTrainingContent()}
        <Button onPress={handleOpenModal} icon={<FontAwesomeIcon icon={faPlus} size={20} color={colors.white} />} label={'Ny trening'} />
        <CreateTrainingForm
          visible={modalVisible}
          onClose={handleCloseModal}
          bows={bows}
          arrowSets={arrowSets}
          onTrainingSaved={handleTrainingSaved}
          editingTraining={editingTraining}
        />
      </GestureHandlerRootView>
    </SafeAreaView>
  );
}
