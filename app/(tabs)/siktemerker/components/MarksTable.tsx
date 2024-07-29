import { faTrash } from '@fortawesome/free-solid-svg-icons/faTrash';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { StyleSheet, Text, View } from 'react-native';

import { Message } from '@/components/common';
import Button from '@/components/common/Button/Button';
import { CalculatedMarks } from '@/types';

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
            <Text style={styles.thead}>Beregnet</Text>
            <Text style={styles.trData}>{ballistics.calculated_marks[index].toFixed(2)}</Text>
          </View>
          <Button
            buttonStyle={{ marginRight: -16 }}
            icon={<FontAwesomeIcon icon={faTrash} color="#227B9A" />}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 16,
    backgroundColor: '#F2F2F2',
  },
  tr: {
    display: 'flex',
    height: 72,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFF',
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  section: {
    flex: 1,
    paddingTop: 4,
    paddingBottom: 4,
    paddingLeft: 2,
    paddingRight: 2,
    margin: 8,
  },
  sectionCalc: {
    flex: 1,
    paddingTop: 4,
    paddingBottom: 4,
    paddingLeft: 2,
    paddingRight: 2,
    backgroundColor: '#D8F5FF',
    borderRadius: 12,
    margin: 8,
  },
  trData: {
    flex: 1,
    fontSize: 18,
    textAlign: 'center',
  },
  thead: {
    fontWeight: '400',
    color: '#227B9A',
    textAlign: 'center',
    fontSize: 14,
  },
  heading: {
    flex: 1,
    textAlign: 'center',
    marginBottom: 4,
  },
});
