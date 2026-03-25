import { useCallback, useEffect, useState } from 'react';
import { ScrollView, View } from 'react-native';
import * as Sentry from '@sentry/react-native';
import { Button, Message } from '@/components/common';
import { CalculatedMarks, MarksResult, SightMark, SightMarkResult } from '@/types';
import { CalculateMarksModal } from '@/components/sightMarks/calculateMarksModal/CalculateMarksModal';
import CalculatedMarksTable from '@/components/sightMarks/calculatedMarksTable/CalculatedMarksTable';
// import { faChartLine } from '@fortawesome/free-solid-svg-icons/faChartLine';
import { faWind } from '@fortawesome/free-solid-svg-icons/faWind';
import { faRotateRight } from '@fortawesome/free-solid-svg-icons/faRotateRight';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
// import ChartScreen from './ChartScreen';
import { styles } from './MarksScreenStyles';
import { colors } from '@/styles/colors';
import { useFocusEffect } from 'expo-router';
import { sightMarksRepository } from '@/services/repositories';
import { offlineMutation } from '@/services/offline/mutationHelper';
import { useAuth } from '@/contexts/AuthContext';

interface MarksScreenProps {
  setScreen: (screen: string) => void;
}

export default function MarksScreen({ setScreen }: MarksScreenProps) {
  const { user } = useAuth();
  const [showSpeed, setShowSpeed] = useState(false);
  // const [showGraph, setShowGraph] = useState(false);
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
      setActiveSightMark(current);
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
      sight_marks_by_hill_angle: (result.sightMarksByAngle ?? {}) as Record<string, number[]>,
      arrow_speed_by_angle: (result.arrowSpeedByAngle ?? {}) as Record<string, number[]>,
    };
  }

  async function handleRemoveMarks() {
    try {
      if (activeSightMark) {
        const results = await sightMarksRepository.getResults(activeSightMark.id);
        if (results[0]) {
          await offlineMutation(
            { type: 'sightMarks/deleteResult', payload: { id: results[0].id } },
            () => sightMarksRepository.deleteResult(results[0].id),
            user?.id,
          );
        }
      }
    } catch (error) {
      Sentry.captureException(error, { tags: { type: 'sight_marks_delete_result_error' } });
    } finally {
      // Always clear local state and open the modal so the user can recalculate,
      // even if the server-side delete failed.
      setCalculatedMarks(null);
      setModalVisible(true);
    }
  }

  function renderContent() {
    if (isLoading) return null;

    if (calculatedMarks) {
      return <CalculatedMarksTable marksData={calculatedMarks} showSpeed={showSpeed} />;
    }

    if (ballistics) {
      if (ballistics.given_distances?.length > 1) {
        return (
          <View style={styles.emptyState}>
            <Message
              title="Ingen beregnede siktemerker"
              description="For å beregne siktemerker kan du trykke på knappen under."
              onPress={() => setModalVisible(true)}
              buttonLabel="Beregn siktemerker"
            />
          </View>
        );
      }
      return (
        <View style={styles.emptyState}>
          <Message
            title="For få tilgjengelige avstander"
            description="Du trenger flere avstander for å beregne siktemerker."
            onPress={() => setScreen('calculate')}
            buttonLabel="Gå til innskyting"
          />
        </View>
      );
    }

    return (
      <View style={styles.emptyState}>
        <Message
          title="Ingen data"
          description="Legg inn dine merker for å beregne siktemerker."
          onPress={() => setScreen('calculate')}
          buttonLabel="Gå til innskyting"
        />
      </View>
    );
  }

  const outlineWhite = {
    buttonStyle: { borderColor: colors.white },
    textStyle: { color: colors.white },
  };

  return (
    <View style={styles.page}>
      {/* Chart is temporarily disabled — will revisit */}
      {/* {showGraph ? (
        <ChartScreen calculatedMarks={calculatedMarks} marks={ballistics} setModalVisible={setModalVisible} />
      ) : ( */}
      <ScrollView style={styles.scrollView}>{renderContent()}</ScrollView>
      {/* )} */}

      {calculatedMarks && (
        <View style={styles.actionBar}>
          {(
            <Button
              type="outline"
              iconPosition="left"
              icon={<FontAwesomeIcon icon={faWind} size={20} color={colors.white} />}
              label="Vis hastigheter"
              onPress={() => setShowSpeed(!showSpeed)}
              {...outlineWhite}
            />
          )}
          <View style={styles.buttons}>
            <Button
              type="outline"
              iconPosition="left"
              icon={<FontAwesomeIcon icon={faRotateRight} color={colors.white} />}
              label="Beregn på nytt"
              onPress={handleRemoveMarks}
              {...outlineWhite}
            />
            {/* Chart toggle button — re-enable when chart is back
            <Button
              type="outline"
              iconPosition="left"
              icon={<FontAwesomeIcon icon={faChartLine} color={colors.white} />}
              label={showGraph ? 'Vis tabell' : 'Vis diagram'}
              onPress={() => setShowGraph((prev) => !prev)}
              {...outlineWhite}
            />
            */}
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
