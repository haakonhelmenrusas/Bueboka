import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button } from '../../../../components/common';
import { CalculatedMarks } from '../../../../types';
import { getLocalStorage } from '../../../../utils';

interface MarksScreenProps {
  setScreen: (screen: string) => void;
}

export default function MarksScreen({ setScreen }: MarksScreenProps) {
  const [ballistics, setBallistics] = useState<CalculatedMarks | null>(null);

  useEffect(() => {
    getLocalStorage<CalculatedMarks>('ballistics').then((data) => {
      if (data) {
        setBallistics(data);
      }
    });
  }, []);

  return (
    <View>
      {ballistics ? (
        <View>
          <View style={styles.header}>
            <Text style={styles.headerText}>Distance</Text>
            <Text style={styles.headerText}>Mark</Text>
          </View>
          {ballistics.given_distances.map((distance, index) => (
            <View style={styles.row} key={index}>
              <Text>{distance.toFixed(1)} m</Text>
              <Text>{ballistics.given_marks[index]}</Text>
            </View>
          ))}
        </View>
      ) : (
        <View style={styles.messageContainer}>
          <Text style={styles.messageTitle}>Her var det tomt</Text>
          <Text style={styles.messageText}>For å vise siktemerker gjør først Innskyting</Text>
          <Button onPress={() => setScreen('calculate')} label="Gå til Innskyting" />
        </View>
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 16,
  },
  row: {
    flexDirection: 'row',
  },
  messageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: '80%',
  },
  messageTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  messageText: {
    fontSize: 16,
    marginBottom: 16,
  },
});
