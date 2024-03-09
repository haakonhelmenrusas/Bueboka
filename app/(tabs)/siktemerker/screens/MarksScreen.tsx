import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Message } from '../../../../components/common';
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
        <Message
          title="Ingen siktemerker lagt til"
          description="For å beregne siktemerker må du legge til minst én innskyting."
          onPress={() => setScreen('calculate')}
          buttonLabel="Gå til innskyting"
        />
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
});
