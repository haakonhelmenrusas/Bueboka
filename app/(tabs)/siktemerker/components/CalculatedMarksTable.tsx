import { StyleSheet, Text, View } from 'react-native';
import { MarksResult } from '../../../../types';

interface CalculatedMarksProps {
  marksData: MarksResult | null;
}

export default function CalculatedMarksTable({ marksData }: CalculatedMarksProps) {
  const renderMarksResultTable = () => {
    if (marksData) {
      return marksData.distances.map((distance, index) => (
        <View style={[styles.tr, index % 2 === 0 ? styles.evenRow : styles.oddRow]} key={index}>
          <Text style={styles.trData}>{distance.toFixed(1)}m</Text>
          {Object.keys(marksData.sight_marks_by_hill_angle)
            .sort()
            .map((angle) => {
              return <Text style={styles.trData}>{marksData.sight_marks_by_hill_angle[angle][index].toFixed(1)}</Text>;
            })}
        </View>
      ));
    }
  };

  return (
    <View>
      <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
        <Text style={[styles.thead, styles.heading, { marginLeft: -8 }]}>Avstand</Text>
        {Object.keys(marksData?.sight_marks_by_hill_angle)
          .sort()
          .map((angle) => {
            return (
              <Text key={angle} style={[styles.thead, styles.heading]}>
                {angle}°
              </Text>
            );
          })}
      </View>
      {renderMarksResultTable()}
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
  heading: {
    flex: 1,
    textAlign: 'center',
    marginBottom: 8,
  },
});
