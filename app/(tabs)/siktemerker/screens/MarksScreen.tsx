import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button, Message } from '../../../../components/common';
import { CalculatedMarks } from '../../../../types';
import { getLocalStorage } from '../../../../utils';
import CalculateMarksModal from '../components/CalculateMarksModal';

interface MarksScreenProps {
  setScreen: (screen: string) => void;
}

export default function MarksScreen({ setScreen }: MarksScreenProps) {
  const [ballistics, setBallistics] = useState<CalculatedMarks | null>(null);
  const [calculatedMarks, setCalculatedMarks] = useState<CalculatedMarks | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    getLocalStorage<CalculatedMarks>('ballistics').then((data) => {
      if (data) {
        setBallistics(data);
      }
    });
  }, []);

  useEffect(() => {
    getLocalStorage<CalculatedMarks>('calculatedMarks').then((data) => {
      if (data) {
        setCalculatedMarks(data);
      }
    });
  }, []);

  function renderMessageTitle() {
    if (ballistics) {
      return ballistics.given_distances.length < 1 && 'For få siktemerker';
    }
    return 'Ingen siktemerker';
  }

  function renderMessageDescription() {
    if (ballistics) {
      return (
        ballistics.given_distances.length < 1 &&
        'For å beregne siktemerker må du legge til minst to merker i innskyting.'
      );
    }
    return 'For å beregne siktemerker må du gjøre innskytinger.';
  }

  return (
    <View style={styles.page}>
      {ballistics && ballistics.given_distances.length > 1 ? (
        <View style={{ flex: 1 }}>
          <View style={styles.header}>
            <Text style={styles.headerText}>Avstand</Text>
            <Text style={styles.headerText}>Merke</Text>
          </View>
          {ballistics.given_distances.map((distance, index) => (
            <View style={styles.row} key={index}>
              <Text>{distance.toFixed(1)} m</Text>
              <Text>{ballistics.given_marks[index]}</Text>
            </View>
          ))}
          <View style={{ marginTop: 'auto' }}>
            <Button disabled={modalVisible} label="Beregn siktemerker" onPress={() => setModalVisible(true)} />
          </View>
          <CalculateMarksModal
            modalVisible={modalVisible}
            closeModal={() => setModalVisible(false)}
            ballistics={ballistics}
            setCalculatedMarks={setCalculatedMarks}
          />
        </View>
      ) : (
        <Message
          title={renderMessageTitle()}
          description={renderMessageDescription()}
          onPress={() => setScreen('calculate')}
          buttonLabel="Gå til innskyting"
        />
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  page: {
    flex: 1,
    padding: 16,
  },
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
