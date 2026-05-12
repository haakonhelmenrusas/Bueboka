import { View, Text, Dimensions, StyleSheet } from 'react-native';
import { LineChart } from 'react-native-gifted-charts';
import type { Series } from '@/types';
import { colors } from '@/styles/colors';
import { useTranslation } from '@/contexts';
import { formatDate } from './constants';

const CHART_WIDTH = Dimensions.get('window').width - 96;

interface ScorePoint {
  date: string;
  training: number | null;
  competition: number | null;
}

function buildScoreData(series: Series[], category: string): ScorePoint[] {
  const dateMap = new Map<
    string,
    { training: { score: number; scoredArrows: number }; competition: { score: number; scoredArrows: number } }
  >();

  series.forEach((s) => {
    s.data.forEach((d) => {
      if ((category === 'all' || d.practiceCategory === category) && d.scoredArrows > 0) {
        if (!dateMap.has(d.date)) {
          dateMap.set(d.date, {
            training: { score: 0, scoredArrows: 0 },
            competition: { score: 0, scoredArrows: 0 },
          });
        }
        const entry = dateMap.get(d.date)!;
        if (d.practiceType === 'KONKURRANSE') {
          entry.competition.score += d.score;
          entry.competition.scoredArrows += d.scoredArrows;
        } else {
          entry.training.score += d.score;
          entry.training.scoredArrows += d.scoredArrows;
        }
      }
    });
  });

  return Array.from(dateMap.entries())
    .map(([date, data]) => ({
      date,
      training: data.training.scoredArrows > 0 ? data.training.score / data.training.scoredArrows : null,
      competition: data.competition.scoredArrows > 0 ? data.competition.score / data.competition.scoredArrows : null,
    }))
    .filter((d) => d.training !== null || d.competition !== null)
    .sort((a, b) => a.date.localeCompare(b.date));
}

interface Props {
  series: Series[];
  selectedCategory: string;
}

export function ScoreChart({ series, selectedCategory }: Props) {
  const { t, locale } = useTranslation();
  const scoreData = buildScoreData(series, selectedCategory);

  if (scoreData.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.sectionTitle}>{t['statistics.scoreChartTitle']}</Text>
        <View style={styles.card}>
          <View style={styles.empty}>
            <Text style={styles.emptyText}>{t['statistics.noScoredForPeriod']}</Text>
          </View>
        </View>
      </View>
    );
  }

  const labelStep = Math.max(1, Math.ceil(scoreData.length / 6));
  const spacing = Math.max(40, Math.floor(CHART_WIDTH / scoreData.length));

  const trainingData = scoreData.map((d, i) => ({
    value: d.training ?? 0,
    hideDataPoint: d.training === null,
    label: i % labelStep === 0 ? formatDate(d.date, locale) : '',
  }));

  const competitionData = scoreData.map((d) => ({
    value: d.competition ?? 0,
    hideDataPoint: d.competition === null,
  }));

  const hasCompetition = scoreData.some((d) => d.competition !== null);

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>{t['statistics.scoreChartTitle']}</Text>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>{t['statistics.scoreChartCardTitle']}</Text>
        <LineChart
          data={trainingData}
          {...(hasCompetition ? { data2: competitionData } : {})}
          width={CHART_WIDTH}
          height={200}
          spacing={spacing}
          initialSpacing={16}
          color1={colors.primary}
          color2={colors.accentYellow}
          thickness1={2}
          thickness2={2}
          dataPointsRadius1={4}
          dataPointsRadius2={4}
          dataPointsColor1={colors.primary}
          dataPointsColor2={colors.accentYellow}
          areaChart
          startFillColor1={colors.primary}
          endFillColor1={colors.primary}
          startOpacity1={0.2}
          endOpacity1={0.02}
          startFillColor2={colors.accentYellow}
          endFillColor2={colors.accentYellow}
          startOpacity2={0.2}
          endOpacity2={0.02}
          noOfSections={4}
          rulesColor={colors.bgGray200}
          rulesType="solid"
          yAxisTextStyle={styles.axisText}
          xAxisLabelTextStyle={styles.axisTextSmall}
          yAxisThickness={0}
          xAxisThickness={1}
          xAxisColor={colors.bgGray200}
          curved
        />

        {/* Legend */}
        <View style={styles.legend}>
          <View style={styles.legendItem}>
            <View style={[styles.legendLine, { backgroundColor: colors.primary }]} />
            <Text style={styles.legendText}>{t['statistics.legendTraining']}</Text>
          </View>
          {hasCompetition && (
            <View style={styles.legendItem}>
              <View style={[styles.legendLine, { backgroundColor: colors.accentYellow }]} />
              <Text style={styles.legendText}>{t['statistics.legendCompetition']}</Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.white,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  axisText: {
    color: colors.textSecondary,
    fontSize: 10,
  },
  axisTextSmall: {
    color: colors.textSecondary,
    fontSize: 9,
  },
  legend: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 4,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendLine: {
    width: 20,
    height: 3,
    borderRadius: 2,
  },
  legendText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  empty: {
    height: 160,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 13,
    color: colors.inactive,
  },
});
