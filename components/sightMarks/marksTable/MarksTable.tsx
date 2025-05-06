import { faTrash } from '@fortawesome/free-solid-svg-icons/faTrash';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { Text, View } from 'react-native';
import { Message } from '@/components/common';
import Button from '@/components/common/Button/Button';
import { CalculatedMarks } from '@/types';
import { styles } from './MarksTableStyles';
import { colors } from '@/styles/colors';

interface CalculationTableProps {
  ballistics: CalculatedMarks | null;
  removeMark: (index: number) => void;
}

export default function MarksTable({ ballistics, removeMark }: CalculationTableProps) {
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
          <Button
            buttonStyle={{ marginRight: -16 }}
            icon={<FontAwesomeIcon icon={faTrash} color={colors.secondary} />}
            label=""
            type="outline"
            onPress={() => removeMark(index)}
          />
        </View>
      ));
    } else {
      return <Message title="Ingen siktemerker" description="Legg til siktemerker å send til beregning" />;
    }
  };

  return <View style={styles.container}>{renderBallisticTable()}</View>;
}
