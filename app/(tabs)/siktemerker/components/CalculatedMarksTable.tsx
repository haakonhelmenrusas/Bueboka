import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { MarksResult } from '@/types';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons/faArrowRight';
import { useState } from 'react';

interface CalculatedMarksProps {
  marksData: MarksResult | null;
}

export default function CalculatedMarksTable({ marksData }: CalculatedMarksProps) {
  const [showSpeed, setShowSpeed] = useState(false);

  const renderMarksResultTable = () => {
    if (marksData) {
      return marksData.distances.map((distance, index) => (
        <View style={[styles.tr, index % 2 === 0 ? styles.evenRow : styles.oddRow]} key={index}>
          <Text style={styles.trData}>{distance.toFixed(1)}m</Text>
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
                    <>
                      <View style={{ height: 1, margin: 2, backgroundColor: '#053546' }} />
                      <Text style={styles.trData}>{marksData.arrow_speed_by_angle[speed][index].toFixed(1)} m/s</Text>
                    </>
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
        <Text style={[styles.thead, styles.heading]}>Avstand</Text>
        {Object.keys(marksData?.sight_marks_by_hill_angle)
          .sort()
          .map((angle) => {
            return (
              <Text key={angle} style={[styles.thead, styles.heading]}>
                {angle}°
              </Text>
            );
          })}
        <TouchableOpacity style={styles.icon} onPress={() => setShowSpeed(!showSpeed)}>
          <FontAwesomeIcon icon={faArrowRight} size={20} color="#053546" />
          <Text style={{ color: '#053546', fontSize: 14, fontWeight: '600' }}>m/s</Text>
        </TouchableOpacity>
      </View>
      {renderMarksResultTable()}
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    margin: 16,
    backgroundColor: '#FFF',
    padding: 8,
    borderRadius: 12,
  },
  container: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  trDataColumn: {
    display: 'flex',
    flexDirection: 'column',
  },
  tr: {
    display: 'flex',
    height: 64,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    borderRadius: 12,
    padding: 12,
  },
  trData: {
    fontSize: 16,
    textAlign: 'center',
  },
  evenRow: {
    backgroundColor: '#D8F5FF',
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
  icon: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    color: '#053546',
  },
});
