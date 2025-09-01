import { useCallback, useEffect, useRef, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ScrollView, View } from 'react-native';
import * as Sentry from '@sentry/react-native';
import { Button, Message } from '@/components/common';
import { CalculatedMarks, MarksResult } from '@/types';
import { getLocalStorage } from '@/utils';
import { CalculateMarksModal } from '@/components/sightMarks/calculateMarksModal/CalculateMarksModal';
import CalculatedMarksTable from '@/components/sightMarks/calculatedMarksTable/CalculatedMarksTable';
import { faTrash } from '@fortawesome/free-solid-svg-icons/faTrash';
import { faChartLine } from '@fortawesome/free-solid-svg-icons/faChartLine';
import { faWind } from '@fortawesome/free-solid-svg-icons/faWind';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import ChartScreen from './ChartScreen';
import { styles } from './MarksScreenStyles';
import { colors } from '@/styles/colors';
import { useFocusEffect } from 'expo-router';

interface MarksScreenProps {
  setScreen: (screen: string) => void;
}

interface LoadedData {
  ballistics: CalculatedMarks | null;
  calculatedMarks: MarksResult | null;
  isLoading: boolean;
}

export default function MarksScreen({ setScreen }: MarksScreenProps) {
  const [showSpeed, setShowSpeed] = useState(false);
  const [showGraph, setShowGraph] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [data, setData] = useState<LoadedData>({
    ballistics: null,
    calculatedMarks: null,
    isLoading: true,
  });
  const modalCheckTimeoutRef = useRef<number | null>(null);

  const loadData = useCallback(async () => {
    setData((prev) => ({ ...prev, isLoading: true }));

    try {
      const [ballisticsData, calculatedMarksData] = await Promise.all([
        getLocalStorage<CalculatedMarks>('ballistics'),
        getLocalStorage<MarksResult>('calculatedMarks'),
      ]);

      setData({
        ballistics: ballisticsData,
        calculatedMarks: calculatedMarksData,
        isLoading: false,
      });
    } catch (error) {
      console.error('Error loading data:', error);
      setData((prev) => ({ ...prev, isLoading: false }));
    }
  }, []);

  const checkModalCondition = useCallback(() => {
    // Clear any existing timeout
    if (modalCheckTimeoutRef.current) {
      clearTimeout(modalCheckTimeoutRef.current);
    }

    // Use setTimeout to ensure this runs after all React state updates are complete
    modalCheckTimeoutRef.current = setTimeout(() => {
      setData((currentData) => {
        // Check conditions inside the state updater to get the most current data
        if (
          !currentData.isLoading &&
          currentData.ballistics &&
          currentData.ballistics.given_distances.length > 1 &&
          !currentData.calculatedMarks &&
          !modalVisible
        ) {
          setModalVisible(true);
        }
        return currentData;
      });
    }, 100); // Small delay to ensure all state updates are processed
  }, [modalVisible]);

  useEffect(() => {
    loadData();

    return () => {
      if (modalCheckTimeoutRef.current) {
        clearTimeout(modalCheckTimeoutRef.current);
      }
    };
  }, [loadData]);

  // Refresh data when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData]),
  );

  // Check modal condition whenever data changes
  useEffect(() => {
    if (!data.isLoading) {
      checkModalCondition();
    }
  }, [data, checkModalCondition]);

  function renderContent() {
    // Show nothing while loading to prevent flash
    if (data.isLoading) {
      return null;
    }

    if (data.calculatedMarks) {
      return <CalculatedMarksTable marksData={data.calculatedMarks} showSpeed={showSpeed} />;
    } else if (data.ballistics) {
      if (data.ballistics.given_distances.length > 1) {
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
              title="For få tilgjengelige avstander"
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
      setData((prev) => ({ ...prev, calculatedMarks: null }));
    } catch (error) {
      Sentry.captureException('Error removing data', error);
    }
  }

  return (
    <View style={styles.page}>
      {showGraph ? (
        <ChartScreen calculatedMarks={data.calculatedMarks} marks={data.ballistics} setModalVisible={setModalVisible} />
      ) : (
        <ScrollView style={styles.scrollView}>{renderContent()}</ScrollView>
      )}
      {data.calculatedMarks && (
        <View style={{ flex: 1 }}>
          <View style={{ marginTop: 'auto' }}>
            {!showGraph && (
              <Button
                iconPosition="left"
                type="outline"
                icon={<FontAwesomeIcon icon={faWind} size={20} color={colors.primary} />}
                label="Vis hastigheter"
                onPress={() => setShowSpeed(!showSpeed)}
              />
            )}
            <View style={styles.buttons}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Button
                  iconPosition="left"
                  icon={<FontAwesomeIcon icon={faTrash} color={colors.secondary} />}
                  type="outline"
                  label="Tøm liste"
                  onPress={handleRemoveMarks}
                />
              </View>
              {!showGraph ? (
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Button
                    iconPosition="left"
                    icon={<FontAwesomeIcon icon={faChartLine} color={colors.secondary} />}
                    type="outline"
                    label="Vis diagram"
                    onPress={() => setShowGraph(true)}
                  />
                </View>
              ) : (
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Button
                    iconPosition="left"
                    icon={<FontAwesomeIcon icon={faChartLine} color={colors.secondary} />}
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
        ballistics={data.ballistics}
        setCalculatedMarks={(calculatedMarks) => setData((prev) => ({ ...prev, calculatedMarks }))}
      />
    </View>
  );
}
