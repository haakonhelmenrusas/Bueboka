import { View, Text, Dimensions, StyleSheet } from 'react-native';
import { BarChart } from 'react-native-gifted-charts';
import type { Series } from '@/types';
import { colors } from '@/styles/colors';
import { useTranslation } from '@/contexts';
import { SERIES_COLORS, formatDate } from './constants';

const CHART_WIDTH = Dimensions.get('window').width - 96;

interface Props {
  series: Series[];
  selectedCategory: string;
}

function buildStackData(series: Series[], category: string, locale: 'no' | 'en') {
  const allDates = new Set<string>();
  series.forEach((s) =>
    s.data.forEach((d) => {
      if ((category === 'all' || d.practiceCategory === category) && d.arrows > 0) {
        allDates.add(d.date);
      }
    }),
  );

  return Array.from(allDates)
    .sort()
    .map((date) => ({
      label: formatDate(date, locale),
      stacks: series
        .map((s, i) => ({
          value: s.data
            .filter((d) => d.date === date && (category === 'all' || d.practiceCategory === category))
            .reduce((sum, d) => sum + d.arrows, 0),
          color: SERIES_COLORS[i % SERIES_COLORS.length],
        }))
        .filter((stack) => stack.value > 0),
    }))
    .filter((bar) => bar.stacks.length > 0);
}

export function ArrowsChart({ series, selectedCategory }: Props) {
  const { t, locale } = useTranslation();
  const stackData = buildStackData(series, selectedCategory, locale);

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>{t['statistics.arrowsChartTitle']}</Text>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>{t['statistics.arrowsChartCardTitle']}</Text>

        {stackData.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyText}>{t['statistics.noDataForPeriod']}</Text>
          </View>
        ) : (
          <>
            <BarChart
              stackData={stackData}
              width={CHART_WIDTH}
              height={200}
              barWidth={stackData.length > 20 ? 18 : 28}
              spacing={stackData.length > 20 ? 8 : 14}
              barBorderRadius={3}
              noOfSections={4}
              rulesColor={colors.bgGray200}
              rulesType="solid"
              yAxisTextStyle={styles.axisText}
              xAxisLabelTextStyle={styles.axisTextSmall}
              yAxisThickness={0}
              xAxisThickness={1}
              xAxisColor={colors.bgGray200}
            />

            {/* Legend */}
            <View style={styles.legend}>
              {series.map((s, i) => (
                <View key={s.name} style={styles.legendItem}>
                  <View style={[styles.legendDot, { backgroundColor: SERIES_COLORS[i % SERIES_COLORS.length] }]} />
                  <Text style={styles.legendText} numberOfLines={1}>
                    {s.name}
                  </Text>
                </View>
              ))}
            </View>
          </>
        )}
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
    width: 36,
  },
  legend: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 4,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendText: {
    fontSize: 12,
    color: colors.textSecondary,
    maxWidth: 120,
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
