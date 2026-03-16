import { useCallback, useEffect, useState } from 'react';
import { ScrollView, View } from 'react-native';
import * as Sentry from '@sentry/react-native';
import { Button, Message } from '@/components/common';
import { CalculatedMarks, MarksResult, SightMark, SightMarkResult } from '@/types';
import { CalculateMarksModal } from '@/components/sightMarks/calculateMarksModal/CalculateMarksModal';
import CalculatedMarksTable from '@/components/sightMarks/calculatedMarksTable/CalculatedMarksTable';
import { faChartLine } from '@fortawesome/free-solid-svg-icons/faChartLine';
import { faWind } from '@fortawesome/free-solid-svg-icons/faWind';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import ChartScreen from './ChartScreen';
import { styles } from './MarksScreenStyles';
import { colors } from '@/styles/colors';
import { useFocusEffect } from 'expo-router';
import { faRefresh } from '@fortawesome/free-solid-svg-icons';
import { sightMarksRepository } from '@/services/repositories';
import { offlineMutation } from '@/services/offline/mutationHelper';
import { useAuth } from '@/contexts/AuthContext';

interface MarksScreenProps {
  setScreen: (screen: string) => void;
}

export default function MarksScreen({ setScreen }: MarksScreenProps) {
  const { user } = useAuth();
  const [showSpeed, setShowSpeed] = useState(false);
  const [showGraph, setShowGraph] = useState(false);
  const [ballistics, setBallistics] = useState<CalculatedMarks | null>(null);
  const [calculatedMarks, setCalculatedMarks] = useState<MarksResult | null>(null);
  const [activeSightMark, setActiveSightMark] = useState<SightMark | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const marks = await sightMarksRepository.getAll();
      // Get newest sight mark (most recent)
      const current = marks.sort((a, b) => new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime())[0] ?? null;
      setActiveSightMark(current ?? null);
      setBallistics((current?.ballisticsParameters as CalculatedMarks) ?? null);

      if (current) {
        const results = await sightMarksRepository.getResults(current.id);
        // Get newest result (most recent)
        const latest = results.sort((a, b) => new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime())[0] ?? null;
        setCalculatedMarks(latest ? mapResult(latest) : null);
      } else {
        setCalculatedMarks(null);
      }
    } catch (error: any) {
      // 404 is not an error - it just means no data exists yet
      if (error?.response?.status === 404) {
        setActiveSightMark(null);
        setBallistics(null);
        setCalculatedMarks(null);
      } else {
        // Log actual errors to Sentry
        Sentry.captureException(error, {
          tags: { type: 'sight_marks_load_error' },
          extra: { message: error?.message, status: error?.response?.status },
        });
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData]),
  );

  function mapResult(result: SightMarkResult): MarksResult {
    return {
      distances: result.distances,
      sight_marks_by_hill_angle: (result.sightMarksByAngle ?? {}) as any,
      arrow_speed_by_angle: (result.arrowSpeedByAngle ?? {}) as any,
    };
  }

  async function handleRemoveMarks() {
    try {
      if (calculatedMarks && activeSightMark) {
        const results = await sightMarksRepository.getResults(activeSightMark.id);
        if (results[0]) {
          await offlineMutation(
            {
              type: 'sightMarks/deleteResult',
              payload: { id: results[0].id },
            },
            () => sightMarksRepository.deleteResult(results[0].id),
            user?.id,
          );
        }
      }
      setCalculatedMarks(null);
      setModalVisible(true);
    } catch (error) {
      Sentry.captureException('Error removing data', error);
    }
  }

  function renderContent() {
    if (isLoading) {
      return null;
    }

    if (calculatedMarks) {
      return <CalculatedMarksTable marksData={calculatedMarks} showSpeed={showSpeed} />;
    } else if (ballistics) {
      if (ballistics.given_distances?.length > 1) {
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
                icon={<FontAwesomeIcon icon={faWind} size={20} color={colors.primary} />}
                label="Vis hastigheter"
                onPress={() => setShowSpeed(!showSpeed)}
              />
            )}
            <View style={styles.buttons}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Button
                  iconPosition="left"
                  icon={<FontAwesomeIcon icon={faRefresh} color={colors.secondary} />}
                  type="outline"
                  label="Beregn på nytt"
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
        ballistics={ballistics}
        setCalculatedMarks={setCalculatedMarks}
        sightMarkId={activeSightMark?.id ?? null}
        onResultCreated={() => loadData()}
      />
    </View>
  );
}
