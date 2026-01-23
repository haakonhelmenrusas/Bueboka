import { Practice } from '@/types';
import { Text, View } from 'react-native';
import { styles } from './PracticeListStyles';
import PracticeCard from '@/components/practice/practiceCard/PracticeCard';
import { Message } from '@/components/common';
import { isSameDay } from 'date-fns';
import { ScrollView } from 'react-native-gesture-handler';

interface PracticeListProps {
  practices: Practice[];
  onEditPractice?: (practice: Practice) => void;
}

export default function PracticeList({ practices, onEditPractice }: PracticeListProps) {
  const sortedPractices = [...practices].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const renderPracticeList = () => {
    if (!practices || practices.length === 0) {
      return <Message title="Ingen treninger" description="Legg til treninger ved å trykke på 'Ny trening'" />;
    }

    const today = new Date();

    const todayPractices = sortedPractices.filter((practice) => isSameDay(today, new Date(practice.date)));
    const olderPractices = sortedPractices.filter((practice) => !isSameDay(today, new Date(practice.date)));

    return (
      <>
        {todayPractices.length > 0 && (
          <>
            <Text style={styles.subtitleToday}>I dag</Text>
            {todayPractices.map((practice, index) => (
              <PracticeCard key={`today-${index}`} practice={practice} onEdit={onEditPractice} />
            ))}
          </>
        )}
        {olderPractices.length > 0 && (
          <>
            <Text style={styles.subtitlePast}>Eldre treninger</Text>
            {olderPractices.map((practice, index) => (
              <PracticeCard key={`older-${index}`} practice={practice} onEdit={onEditPractice} />
            ))}
          </>
        )}
      </>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Liste av treninger</Text>
      <ScrollView>{renderPracticeList()}</ScrollView>
    </View>
  );
}
