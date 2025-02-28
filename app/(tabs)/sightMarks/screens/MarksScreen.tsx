import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ScrollView, StyleSheet, View } from 'react-native';
import * as Sentry from '@sentry/react-native';
import { Button, Message } from '@/components/common';
import { CalculatedMarks, MarksResult } from '@/types';
import { getLocalStorage } from '@/utils';
import { CalculateMarksModal } from '../components/CalculateMarksModal';
import CalculatedMarksTable from '../components/calculatedMarksTable/CalculatedMarksTable';
import { faTrash } from '@fortawesome/free-solid-svg-icons/faTrash';
import { faChartLine } from '@fortawesome/free-solid-svg-icons/faChartLine';
import { faWind } from '@fortawesome/free-solid-svg-icons/faWind';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import ChartScreen from './ChartScreen';

interface MarksScreenProps {
  setScreen: (screen: string) => void;
}

export default function MarksScreen({ setScreen }: MarksScreenProps) {
  const [showSpeed, setShowSpeed] = useState(false);
  const [showGraph, setShowGraph] = useState(false);
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

  function renderContent() {
    if (calculatedMarks) {
      return <CalculatedMarksTable marksData={calculatedMarks} showSpeed={showSpeed} />;
    } else if (ballistics) {
      if (ballistics.given_distances.length > 1) {
        return (
          <View style={{ marginTop: 'auto', padding: 16 }}>
            <Message
              title="Ingen beregnede siktemerker"
              description="For å beregne siktemerker kan du trykke på knappen under."
              onPress={() => setModalVisible(true)}
              buttonLabel="Beregn siktemerker"
            />
          </View>
        );
      } else {
        return (
          <View style={{ marginTop: 'auto', padding: 16 }}>
            <Message
              title="Få tilgjengelige avstander"
              description="Du trenger flere avstander for å beregne siktemerker."
              onPress={() => setScreen('calculate')}
              buttonLabel="Gå til innskyting"
            />
          </View>
        );
      }
    } else {
      return (
        <View style={{ marginTop: 'auto', padding: 16 }}>
          <Message
            title="Ingen data"
            description="Legg inn dine merker for å beregne siktemerker."
            onPress={() => setScreen('calculate')}
            buttonLabel="Gå til innskyting"
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
      Sentry.captureException('Error removing data', error);
    }
  }

  return (
    <View style={styles.page}>
      {showGraph ? (
        <ChartScreen calculatedMarks={calculatedMarks} marks={ballistics} setModalVisible={setModalVisible} />
      ) : (
        <ScrollView style={styles.scrollView}>{renderContent()}</ScrollView>
      )}
      {calculatedMarks && (
        <View style={{ flex: 1 }}>
          <View style={{ marginTop: 'auto' }}>
            {!showGraph && (
              <Button
                iconPosition="left"
                type="outline"
                icon={<FontAwesomeIcon icon={faWind} size={20} color="#053546" />}
                label="Vis hastigheter"
                onPress={() => setShowSpeed(!showSpeed)}
              />
            )}
            <View style={styles.buttons}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Button
                  iconPosition="left"
                  icon={<FontAwesomeIcon icon={faTrash} color="#227B9A" />}
                  type="outline"
                  label="Tøm liste"
                  onPress={handleRemoveMarks}
                />
              </View>
              {!showGraph ? (
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Button
                    iconPosition="left"
                    icon={<FontAwesomeIcon icon={faChartLine} color="#227B9A" />}
                    type="outline"
                    label="Vis diagram"
                    onPress={() => setShowGraph(true)}
                  />
                </View>
              ) : (
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Button
                    iconPosition="left"
                    icon={<FontAwesomeIcon icon={faChartLine} color="#227B9A" />}
                    type="outline"
                    label="Vis tabell"
                    onPress={() => setShowGraph(false)}
                  />
                </View>
              )}
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
    minHeight: '50%',
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 0,
  },
});
