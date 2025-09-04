import { Training } from '@/types';
import { Text, View } from 'react-native';
import { styles } from './TrainingListStyles';
import TrainingCard from '@/components/training/trainingCard/TrainingCard';
import { Message } from '@/components/common';
import { isSameDay } from 'date-fns';
import { ScrollView } from 'react-native-gesture-handler';

interface TrainingListProps {
  trainings: Training[];
  onEditTraining?: (training: Training) => void;
}

export default function TrainingList({ trainings, onEditTraining }: TrainingListProps) {
  const sortedTrainings = [...trainings].sort((a, b) => b.date.getTime() - a.date.getTime());

  const renderTrainingList = () => {
    if (!trainings || trainings.length === 0) {
      return <Message title="Ingen treninger" description="Legg til treninger ved å trykke på 'Ny trening'" />;
    }

    const today = new Date();

    const todayTrainings = sortedTrainings.filter((training) => isSameDay(today, training.date));
    const olderTrainings = sortedTrainings.filter((training) => !isSameDay(today, training.date));

    return (
      <>
        {todayTrainings.length > 0 && (
          <>
            <Text style={styles.subtitleToday}>I dag</Text>
            {todayTrainings.map((training, index) => (
              <TrainingCard key={`today-${index}`} training={training} onEdit={onEditTraining} />
            ))}
          </>
        )}
        {olderTrainings.length > 0 && (
          <>
            <Text style={styles.subtitlePast}>Eldre treninger</Text>
            {olderTrainings.map((training, index) => (
              <TrainingCard key={`older-${index}`} training={training} onEdit={onEditTraining} />
            ))}
          </>
        )}
      </>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Liste av treninger</Text>
      <ScrollView>{renderTrainingList()}</ScrollView>
    </View>
  );
}
