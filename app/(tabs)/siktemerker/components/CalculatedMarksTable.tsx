import { StyleSheet, Text, View } from 'react-native';
import { MarksResult } from '@/types';

interface CalculatedMarksProps {
  marksData: MarksResult | null;
  showSpeed?: boolean;
}

export default function CalculatedMarksTable({ marksData, showSpeed }: CalculatedMarksProps) {
  const renderMarksResultTable = () => {
    if (marksData) {
      return marksData.distances.map((distance, index) => (
        <View style={styles.tr} key={index}>
          <Text style={styles.trData}>{distance.toFixed(1)} m</Text>
          {Object.keys(marksData.sight_marks_by_hill_angle)
            .sort()
            .map((angle, key) => {
              const speed = Object.keys(marksData.arrow_speed_by_angle).sort()[key];
              return (
                <View key={key} style={styles.trDataColumn}>
                  <Text style={[styles.trData, { fontWeight: '600', fontSize: 16 }]}>
                    {marksData.sight_marks_by_hill_angle[angle][index].toFixed(2)}
                  </Text>
                  {showSpeed && (
                    <Text style={styles.trData}>{marksData.arrow_speed_by_angle[speed][index].toFixed(1)} m/s</Text>
                  )}
                </View>
              );
            })}
        </View>
      ));
    }
  };

  return (
    <View style={styles.page}>
      <View style={styles.container}>
        <View style={styles.angles}>
          <View />
          {Object.keys(marksData?.sight_marks_by_hill_angle)
            .sort()
            .map((angle) => {
              return (
                <Text key={angle} style={styles.angle}>
                  {angle}°
                </Text>
              );
            })}
        </View>
      </View>
      {renderMarksResultTable()}
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    padding: 16,
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
  },
  tr: {
    display: 'flex',
    height: 72,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 8,
    marginBottom: 12,
  },
  trDataColumn: {
    display: 'flex',
    height: '100%',
    width: 80,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-around',
    borderRadius: 12,
    backgroundColor: '#D8F5FF',
  },
  trData: {
    fontSize: 16,
    textAlign: 'center',
  },
  angles: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 8,
  },
  angle: {
    fontWeight: 'bold',
    fontSize: 18,
    marginTop: 8,
  },
  heading: {
    flex: 1,
    textAlign: 'center',
    marginBottom: 8,
  },
});
