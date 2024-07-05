import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Button, Message } from '../../../../components/common';
import { CalculatedMarks, MarksResult } from '../../../../types';
import { getLocalStorage } from '../../../../utils';
import CalculateMarksModal from '../components/CalculateMarksModal';
import CalculatedMarksTable from '../components/CalculatedMarksTable';
import { faTrash } from '@fortawesome/free-solid-svg-icons/faTrash';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';

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

  async function handleRemoveMarks() {
    try {
      await AsyncStorage.removeItem('calculatedMarks');
      setCalculatedMarks(null);
    } catch (error) {
      console.error('Error removing data', error);
    }
  }

  return (
    <View style={styles.page}>
      <ScrollView style={styles.scrollView}>{renderMarksResultTable()}</ScrollView>
      {(!calculatedMarks && !ballistics) ||
        (ballistics && ballistics.given_distances.length <= 1 && (
          <Message
            title={renderMessageTitle()}
            description={renderMessageDescription()}
            onPress={() => setScreen('calculate')}
            buttonLabel="Gå til innskyting"
          />
        ))}
      {ballistics && ballistics.given_distances.length >= 1 && calculatedMarks && (
        <View style={{ flex: 1 }}>
          <View style={{ marginTop: 'auto' }}>
            <View style={styles.buttons}>
              <FontAwesomeIcon icon={faTrash} color="#227B9A" />
              <Button type="outline" label="Fjern siktemerker" onPress={handleRemoveMarks} />
            </View>
          </View>
        </View>
      )}
      <CalculateMarksModal
        modalVisible={modalVisible}
        closeModal={() => setModalVisible(false)}
        ballistics={ballistics}
        setCalculatedMarks={setCalculatedMarks}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: '#F2F2F2',
  },
  scrollView: {
    flex: 1,
    minHeight: '60%',
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
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
