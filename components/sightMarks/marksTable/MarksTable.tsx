import { faTrash } from '@fortawesome/free-solid-svg-icons/faTrash';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import { Message } from '@/components/common';
import { CalculatedMarks } from '@/types';
import { styles } from './MarksTableStyles';
import { colors } from '@/styles/colors';

interface CalculationTableProps {
  ballistics: CalculatedMarks | null;
  removeMark: (index: number) => void;
  status?: 'idle' | 'pending' | 'error';
}

export default function MarksTable({ ballistics, removeMark, status }: CalculationTableProps) {
  const renderBallisticTable = () => {
    if (ballistics && ballistics.given_distances?.length > 0) {
      return ballistics.given_distances.map((distance, index) => (
        <View style={styles.tr} key={index}>
          <View style={styles.section}>
            <Text style={styles.thead}>Avstand</Text>
            <Text style={styles.trData}>{distance.toFixed(1)}m</Text>
          </View>
          <View style={styles.section}>
            <Text style={styles.thead}>Merke</Text>
            <Text style={styles.trData}>{ballistics.given_marks?.[index]?.toFixed(2) ?? '-'}</Text>
          </View>
          <View style={styles.sectionCalc}>
            <Text style={styles.theadBlack}>Beregnet</Text>
            <Text style={styles.trData}>{ballistics.calculated_marks?.[index]?.toFixed(2) ?? '-'}</Text>
          </View>
          <Pressable
            style={[styles.deleteButton, { opacity: status === 'pending' ? 0.6 : 1 }]}
            aria-label="Fjern siktemerke"
            onPress={() => removeMark(index)}
            disabled={status === 'pending'}>
            {status === 'pending' ? (
              <ActivityIndicator size="small" color={colors.white} />
            ) : (
              <FontAwesomeIcon icon={faTrash} color="rgba(255,255,255,0.7)" />
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
