import { Practice } from '@/types';
import { View } from 'react-native';
import { styles } from './PracticeListStyles';
import PracticeCard from '@/components/practice/practiceCard/PracticeCard';
import { Message } from '@/components/common';
import { ScrollView } from 'react-native-gesture-handler';
import { practiceToCardItem } from '@/utils/helpers/practiceHelpers';

interface PracticeListProps {
  practices: Practice[];
  onEditPractice?: (practice: Practice) => void;
}

export default function PracticeList({ practices, onEditPractice }: PracticeListProps) {
  const sortedPractices = [...practices].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const handleCardPress = (practiceId: string) => {
    const practice = practices.find((p) => p.id === practiceId);
    if (practice && onEditPractice) {
      onEditPractice(practice);
    }
  };

  const renderPracticeList = () => {
    if (!practices || practices.length === 0) {
      return <Message title="Ingen treninger" description="Legg til treninger ved å trykke på 'Ny trening'" />;
    }

    return (
      <>
        {sortedPractices.map((practice, index) => (
          <PracticeCard
            key={practice.id || `practice-${index}`}
            card={practiceToCardItem(practice)}
            onPress={() => handleCardPress(practice.id)}
          />
        ))}
      </>
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView>{renderPracticeList()}</ScrollView>
    </View>
  );
}
