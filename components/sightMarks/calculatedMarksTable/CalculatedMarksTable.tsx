import { Text, View } from 'react-native';
import { MarksResult } from '@/types';
import { styles } from './CalculatedMarksTableStyles';

interface CalculatedMarksProps {
  marksData: MarksResult | null;
  showSpeed?: boolean;
}

export default function CalculatedMarksTable({ marksData, showSpeed }: Readonly<CalculatedMarksProps>) {
  const renderMarksResultTable = () => {
    if (marksData) {
      return marksData.distances.map((distance, index) => (
        <View style={styles.tr} key={index}>
          <Text style={styles.trData}>{distance.toFixed(1)} m</Text>
          {Object.keys(marksData.sight_marks_by_hill_angle)
            .sort((a, b) => a.localeCompare(b))
            .map((angle, key) => {
              const speed = Object.keys(marksData.arrow_speed_by_angle).sort((a, b) => a.localeCompare(b))[key];
              return (
                <View key={key} style={styles.trDataColumn}>
                  <Text style={[styles.trData, { fontWeight: '600', fontSize: 16 }]}>
                    {marksData.sight_marks_by_hill_angle[angle][index].toFixed(2)}
                  </Text>
                  {showSpeed && <Text style={styles.trData}>{marksData.arrow_speed_by_angle[speed][index].toFixed(1)} m/s</Text>}
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
          {Object.keys(marksData?.sight_marks_by_hill_angle ?? {})
            .sort((a, b) => a.localeCompare(b))
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
