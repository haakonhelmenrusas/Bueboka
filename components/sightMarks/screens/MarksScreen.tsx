import { useCallback, useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Sentry from '@sentry/react-native';
import { Button, Message, Select } from '@/components/common';
import { CalculatedMarks, MarksResult, SightMark, SightMarkResult } from '@/types';
import { CalculateMarksModal } from '@/components/sightMarks/calculateMarksModal/CalculateMarksModal';
import CalculatedMarksTable from '@/components/sightMarks/calculatedMarksTable/CalculatedMarksTable';
// import { faChartLine } from '@fortawesome/free-solid-svg-icons/faChartLine';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons/faChevronDown';
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
import { useTranslation } from '@/contexts';
interface MarksScreenProps {
  setScreen: (screen: string) => void;
}

export default function MarksScreen({ setScreen }: MarksScreenProps) {
  const { user } = useAuth();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const [showSpeed, setShowSpeed] = useState(false);
  // const [showGraph, setShowGraph] = useState(false);
  const [sightMarks, setSightMarks] = useState<SightMark[]>([]);
  const [ballistics, setBallistics] = useState<CalculatedMarks | null>(null);
  const [calculatedMarks, setCalculatedMarks] = useState<MarksResult | null>(null);
  const [activeSightMark, setActiveSightMark] = useState<SightMark | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [cardExpanded, setCardExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const sightMarkOptions = useMemo(
    () =>
      sightMarks.map((sm) => ({
        label: sm.name ?? sm.bow?.name ?? t['sightMarkCard.fallbackName'],
        value: sm.id,
      })),
    [sightMarks, t],
  );

  const loadResultsForMark = useCallback(async (mark: SightMark) => {
    setActiveSightMark(mark);
    setBallistics((mark.ballisticsParameters as CalculatedMarks) ?? null);
    try {
      const results = await sightMarksRepository.getResults(mark.id);
      const latest = results.sort((a, b) => new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime())[0] ?? null;
      setCalculatedMarks(latest ? mapResult(latest) : null);
    } catch {
      setCalculatedMarks(null);
    }
  }, []);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const marks = await sightMarksRepository.getAll();
      const sorted = marks.sort((a, b) => new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime());
      setSightMarks(sorted);
      const current = sorted.find((m) => (m.givenDistances?.length ?? 0) >= 2) ?? sorted[0] ?? null;

      if (current) {
        await loadResultsForMark(current);
      } else {
        setActiveSightMark(null);
        setBallistics(null);
        setCalculatedMarks(null);
      }
    } catch (error: any) {
      if (error?.response?.status === 404) {
        setSightMarks([]);
        setActiveSightMark(null);
        setBallistics(null);
        setCalculatedMarks(null);
      } else {
        Sentry.captureException(error, {
          tags: { type: 'sight_marks_load_error' },
          extra: { message: error?.message, status: error?.response?.status },
        });
      }
    } finally {
      setIsLoading(false);
    }
  }, [loadResultsForMark]);

  const handleSetChange = useCallback(
    (sightMarkId: string) => {
      const selected = sightMarks.find((sm) => sm.id === sightMarkId);
      if (selected) loadResultsForMark(selected);
    },
    [sightMarks, loadResultsForMark],
  );

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
      if ((activeSightMark?.givenDistances?.length ?? 0) >= 2) {
        return (
          <View style={styles.emptyState}>
            <Message
              title={t['sightMarks.noCalculatedTitle']}
              description={t['sightMarks.noCalculatedDescription']}
              onPress={() => setModalVisible(true)}
              buttonLabel={t['sightMarks.calculateButton']}
            />
          </View>
        );
      }
      return (
        <View style={styles.emptyState}>
          <Message
            title={t['sightMarks.tooFewDistancesTitle']}
            description={t['sightMarks.tooFewDistancesDescription']}
            onPress={() => setScreen('calculate')}
            buttonLabel={t['sightMarks.goToCalibration']}
          />
        </View>
      );
    }

    return (
      <View style={styles.emptyState}>
        <Message
          title={t['sightMarks.noDataTitle']}
          description={t['sightMarks.noDataDescription']}
          onPress={() => setScreen('calculate')}
          buttonLabel={t['sightMarks.goToCalibration']}
        />
      </View>
    );
  }

  const outlineWhite = {
    buttonStyle: { borderColor: colors.white, flex: 1 } as const,
    textStyle: { color: colors.white },
  };

  return (
    <View style={styles.page}>
      {/* Chart is temporarily disabled — will revisit */}
      {/* {showGraph ? (
        <ChartScreen calculatedMarks={calculatedMarks} marks={ballistics} setModalVisible={setModalVisible} />
      ) : ( */}
      <ScrollView style={styles.scrollView}>
        {sightMarkOptions.length > 0 && (
          <View style={styles.selectorCard}>
            <Pressable style={styles.selectorHeader} onPress={() => setCardExpanded(!cardExpanded)}>
              <View style={styles.selectorHeaderText}>
                <Text style={styles.selectorTitle}>{t['sightMarks.selectSet']}</Text>
                {!cardExpanded && activeSightMark && (
                  <Text style={styles.selectorMetaText}>
                    {activeSightMark.bow?.name ?? t['sightMarks.unknownBow']}
                    {' · '}
                    {activeSightMark.givenDistances.length} {t['sightMarks.markCount']}
                  </Text>
                )}
              </View>
              <FontAwesomeIcon
                icon={faChevronDown}
                size={12}
                color={colors.textSecondary}
                style={{ transform: [{ rotate: cardExpanded ? '180deg' : '0deg' }] }}
              />
            </Pressable>
            {cardExpanded && (
              <>
                <Text style={styles.selectorHint}>{t['sightMarks.selectSetHint']}</Text>
                {sightMarkOptions.length > 1 && (
                  <Select
                    label=""
                    options={sightMarkOptions}
                    selectedValue={activeSightMark?.id}
                    onValueChange={handleSetChange}
                    zIndex={2000}
                  />
                )}
                {activeSightMark && (
                  <View style={styles.selectorMeta}>
                    <Text style={styles.selectorMetaText}>
                      {activeSightMark.bow?.name ?? t['sightMarks.unknownBow']}
                      {' · '}
                      {activeSightMark.givenDistances.length} {t['sightMarks.markCount']}
                    </Text>
                  </View>
                )}
              </>
            )}
          </View>
        )}
        {renderContent()}
      </ScrollView>
      {/* )} */}

      {calculatedMarks && (
        <View style={[styles.actionBar, { paddingBottom: insets.bottom + 100 }]}>
          <View style={styles.buttons}>
            <Button
              type="outline"
              size="small"
              iconPosition="left"
              icon={<FontAwesomeIcon icon={faWind} size={16} color={colors.white} />}
              label={t['sightMarks.showSpeed']}
              onPress={() => setShowSpeed(!showSpeed)}
              {...outlineWhite}
            />
            <Button
              type="outline"
              size="small"
              iconPosition="left"
              icon={<FontAwesomeIcon icon={faRotateRight} size={16} color={colors.white} />}
              label={t['sightMarks.recalculate']}
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
