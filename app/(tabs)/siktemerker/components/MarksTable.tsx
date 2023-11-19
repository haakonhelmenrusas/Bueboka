import { faTrash } from '@fortawesome/free-solid-svg-icons/faTrash';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { StyleSheet, Text, View } from 'react-native';
import Button from '../../../../components/common/Button';
import { CalculatedMarks } from '../../../../types';

interface CalculationTableProps {
  ballistics: CalculatedMarks | null;
  removeMark: (index: number) => void;
}

export default function MarksTable({ ballistics, removeMark }: CalculationTableProps) {
  const renderBallisticTable = () => {
    if (ballistics) {
      return ballistics.given_distances.map((distance, index) => (
        <View style={styles.tr} key={index}>
          <Text>{distance.toFixed(1)}m</Text>
          <Text>{ballistics.given_marks[index].toFixed(2)}</Text>
          <Text>{ballistics.calculated_marks[index].toFixed(2)}</Text>
          <Button
            icon={<FontAwesomeIcon icon={faTrash} color="red" />}
            label="Fjern"
            type="outline"
            onPress={() => removeMark(index)}
          />
        </View>
      ));
    } else {
      return <Text style={styles.info}>Legg inn siktemerker og send dem inn til beregning</Text>;
    }
  };

  return (
    <View>
      <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
        <Text style={styles.thead}>Avstand</Text>
        <Text style={styles.thead}>Merke</Text>
        <Text style={styles.thead}>Beregnet</Text>
        <Text style={styles.thead}></Text>
      </View>
      {renderBallisticTable()}
    </View>
  );
}

const styles = StyleSheet.create({
  tr: {
    display: 'flex',
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  thead: {
    fontWeight: 'bold',
    fontSize: 16,
    marginTop: 8,
  },
  info: {
    marginTop: 8,
    fontSize: 16,
  },
});
