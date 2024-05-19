import { faTrash } from '@fortawesome/free-solid-svg-icons/faTrash';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { StyleSheet, Text, View } from 'react-native';

import { Message } from '../../../../components/common';
import Button from '../../../../components/common/Button/Button';
import { CalculatedMarks } from '../../../../types';

interface CalculationTableProps {
  ballistics: CalculatedMarks | null;
  removeMark: (index: number) => void;
}

export default function MarksTable({ ballistics, removeMark }: CalculationTableProps) {
  const renderBallisticTable = () => {
    if (ballistics) {
      return ballistics.given_distances.map((distance, index) => (
        <View style={[styles.tr, index % 2 === 0 ? styles.evenRow : styles.oddRow]} key={index}>
          <Text style={styles.trData}>{distance.toFixed(1)}m</Text>
          <Text style={styles.trData}>{ballistics.given_marks[index].toFixed(2)}</Text>
          <Text style={styles.trData}>{ballistics.calculated_marks[index].toFixed(2)}</Text>
          <Button
            icon={<FontAwesomeIcon icon={faTrash} color="red" />}
            label="Fjern"
            type="outline"
            onPress={() => removeMark(index)}
          />
        </View>
      ));
    } else {
      return <Message title="Ingen siktemerker" description="Legg til siktemerker å send til beregning" />;
    }
  };

  return (
    <View>
      <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
        <Text style={[styles.thead, styles.heading, { marginLeft: -8 }]}>Avstand</Text>
        <Text style={[styles.thead, styles.heading]}>Merke</Text>
        <Text style={[styles.thead, styles.heading]}>Beregnet</Text>
        <Text style={styles.theadEnd}></Text>
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
  trData: {
    flex: 1,
    textAlign: 'center',
  },
  evenRow: {
    backgroundColor: '#F8F8F8',
  },
  oddRow: {
    backgroundColor: '#FFF',
  },
  thead: {
    fontWeight: 'bold',
    fontSize: 16,
    marginTop: 8,
  },
  theadEnd: {
    width: '20%',
  },
  heading: {
    flex: 1,
    textAlign: 'center',
    marginBottom: 8,
  },
  info: {
    margin: 8,
    fontSize: 16,
  },
});
