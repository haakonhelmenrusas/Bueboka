import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Message } from '../../../../components/common';
import { CalculatedMarks, MarksResult } from '../../../../types';
import { getLocalStorage } from '../../../../utils';
import CalculateMarksModal from '../components/CalculateMarksModal';
import CalculatedMarksTable from '../components/CalculatedMarksTable';

interface MarksScreenProps {
  setScreen: (screen: string) => void;
}

export default function MarksScreen({ setScreen }: MarksScreenProps) {
  const [ballistics, setBallistics] = useState<CalculatedMarks | null>(null);
  const [calculatedMarks, setCalculatedMarks] = useState<MarksResult | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    getLocalStorage<CalculatedMarks>('ballistics').then((data) => {
      if (data) {
        setBallistics(data);
      }
    });
  }, []);

  useEffect(() => {
    getLocalStorage<MarksResult>('calculatedMarks').then((data) => {
      if (data) {
        setCalculatedMarks(data);
      }
    });
  }, [modalVisible]);

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
      {calculatedMarks && calculatedMarks.distances.length > 1 ? (
        <View style={{ flex: 1 }}>
          <CalculatedMarksTable marksData={calculatedMarks} />
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
