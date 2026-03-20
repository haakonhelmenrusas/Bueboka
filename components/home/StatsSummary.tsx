import { View, Text, StyleSheet } from 'react-native';
import { colors } from '@/styles/colors';

interface StatsData {
  totalArrows: number;
  scoredArrows: number;
  unscoredArrows: number;
  avgScorePerArrow: number | null;
}

interface Props {
  last7Days: StatsData;
  last30Days: StatsData;
  overall: StatsData;
}

export function StatsSummary({ last7Days, last30Days, overall }: Props) {
  return (
    <View style={styles.container}>
      <StatCard label="Siste 7 dager" arrows={last7Days.totalArrows} scored={last7Days.scoredArrows} avg={last7Days.avgScorePerArrow} />
      <StatCard label="Siste 30 dager" arrows={last30Days.totalArrows} scored={last30Days.scoredArrows} avg={last30Days.avgScorePerArrow} />
      <StatCard label="Totalt" arrows={overall.totalArrows} scored={overall.scoredArrows} avg={overall.avgScorePerArrow} />
    </View>
  );
}

interface StatCardProps {
  label: string;
  arrows: number;
  scored: number;
  avg: number | null;
}

function StatCard({ label, arrows, scored, avg }: StatCardProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{arrows}</Text>
      <Text style={styles.subtext}>
        {scored} scoret {avg !== null && `• Ø ${avg.toFixed(1)}`}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 12,
    marginVertical: 16,
  },
  card: {
    flex: 1,
    backgroundColor: 'rgba(5, 53, 70, 0.06)',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(5, 53, 70, 0.1)',
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  value: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 4,
  },
  subtext: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.textSecondary,
  },
});
