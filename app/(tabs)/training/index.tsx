import { Text } from 'react-native';
import { styles } from '@/components/training/TrainingStyles';
import { colors } from '@/styles/colors';
import Summary from '@/components/training/summary/Summary';
import TrainingList from '@/components/training/trainingList/TrainingList';
import { Button } from '@/components/common';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons/faPlus';
import { useCallback, useEffect, useState } from 'react';
import { ArrowSet, Bow, Training } from '@/types';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import CreateTrainingForm from '@/components/training/trainingForm/CreateTrainingForm';
import { getLocalStorage } from '@/utils';
import SkeletonTrainingList from '@/components/training/trainingCard/SkeletonTrainingList';
import * as Sentry from '@sentry/react-native';

export default function TrainingScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const [trainings, setTrainings] = useState<Training[]>([]);
  const [bows, setBows] = useState<Bow[]>([]);
  const [arrowSets, setArrowSets] = useState<ArrowSet[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleTrainingSaved = () => {
    loadData();
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
        bows={bows}
        arrowSets={arrowSets}
        onTrainingSaved={handleTrainingSaved}
      />
    </GestureHandlerRootView>
  );
}
