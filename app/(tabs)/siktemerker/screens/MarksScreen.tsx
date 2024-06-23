import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Button, Message } from '../../../../components/common';
import { CalculatedMarks, MarksResult } from '../../../../types';
import { getLocalStorage, storeLocalStorage } from '../../../../utils';
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
  }, []);

  function renderMessageTitle() {
    if (ballistics) {
      return ballistics.given_distances.length <= 1 && 'For få siktemerker';
    }
    return 'Ingen siktemerker';
  }

  function renderMessageDescription() {
    if (ballistics) {
      return (
        ballistics.given_distances.length <= 1 &&
        'For å beregne siktemerker må du legge til minst to merker i innskyting.'
      );
    }
    return 'For å beregne siktemerker må du gjøre innskytinger.';
  }

  function renderMarksResultTable() {
    if (calculatedMarks && calculatedMarks.distances.length > 1) {
      return <CalculatedMarksTable marksData={calculatedMarks} />;
    } else if (!calculatedMarks && ballistics && ballistics.given_distances.length > 1) {
      return (
        <View style={{ marginTop: 'auto' }}>
          <Message
            title="Ingen beregnede siktemerker"
            description="For å beregne siktemerker kan du trykke på knappen under."
            onPress={() => setModalVisible(true)}
            buttonLabel="Beregn siktemerker"
          />
        </View>
      );
    }
  }

  function handleRemoveMarks() {
    storeLocalStorage(null, 'calculatedMarks').then(() => {
      setCalculatedMarks(null);
    });
  }

  return (
    <View style={styles.page}>
      <ScrollView style={styles.scrollView}>{renderMarksResultTable()}</ScrollView>
      {ballistics && ballistics.given_distances.length > 1 ? (
        <View style={{ flex: 1 }}>
          <View style={{ marginTop: 'auto' }}>
            <View style={styles.buttons}>
              <Button type="outline" label="Fjern siktemerker" onPress={handleRemoveMarks} />
              <Button type="outline" label="Tilbake til innskyting" onPress={() => setScreen('calculate')} />
            </View>
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
    backgroundColor: '#F2F2F2',
    padding: 16,
    margin: -16,
  },
  scrollView: {
    flex: 1,
    minHeight: '60%',
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
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
