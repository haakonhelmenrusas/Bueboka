import { faTrash } from '@fortawesome/free-solid-svg-icons/faTrash';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import { Message } from '@/components/common';
import { CalculatedMarks, Status } from '@/types';
import { styles } from './MarksTableStyles';
import { colors } from '@/styles/colors';

interface CalculationTableProps {
  ballistics: CalculatedMarks | null;
  removeMark: (index: number) => void;
  status?: Status;
}

export default function MarksTable({ ballistics, removeMark, status }: CalculationTableProps) {
  const renderBallisticTable = () => {
    if (ballistics) {
      return ballistics.given_distances.map((distance, index) => (
        <View style={styles.tr} key={index}>
          <View style={styles.section}>
            <Text style={styles.thead}>Avstand</Text>
            <Text style={styles.trData}>{distance.toFixed(1)}m</Text>
          </View>
          <View style={styles.section}>
            <Text style={styles.thead}>Merke</Text>
            <Text style={styles.trData}>{ballistics.given_marks[index].toFixed(2)}</Text>
          </View>
          <View style={styles.sectionCalc}>
            <Text style={styles.theadBlack}>Beregnet</Text>
            <Text style={styles.trData}>{ballistics.calculated_marks[index].toFixed(2)}</Text>
          </View>
          <Pressable
            style={[styles.deleteButton, { opacity: status === Status.Pending ? 0.6 : 1 }]}
            aria-label="Fjern siktemerke"
            onPress={() => removeMark(index)}
            disabled={status === Status.Pending}>
            {status === Status.Pending ? (
              <ActivityIndicator size="small" color={colors.secondary} />
            ) : (
              <FontAwesomeIcon icon={faTrash} color={colors.secondary} />
            )}
          </Pressable>
        </View>
      ));
    } else {
      return <Message title="Ingen siktemerker" description="Legg til siktemerker for å sende til beregning" />;
    }
  };

  return <View style={styles.container}>{renderBallisticTable()}</View>;
}
