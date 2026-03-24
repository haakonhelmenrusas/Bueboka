import { View, Text } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { faCalendarDays } from '@fortawesome/free-solid-svg-icons/faCalendarDays';
import { faArrowTrendUp } from '@fortawesome/free-solid-svg-icons/faArrowTrendUp';
import { faChartBar } from '@fortawesome/free-solid-svg-icons/faChartBar';
import { faBullseye } from '@fortawesome/free-solid-svg-icons/faBullseye';
import { faCircleCheck } from '@fortawesome/free-solid-svg-icons/faCircleCheck';
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons/faCircleXmark';
import { colors } from '@/styles/colors';
import { styles } from './StatsSummaryStyles';

interface StatsData {
  totalArrows: number;
  scoredArrows: number;
  unscoredArrows: number;
  avgScorePerArrow: number | null;
}

interface Props {
  last7Days?: StatsData;
  last30Days?: StatsData;
  overall?: StatsData;
}

const EMPTY: StatsData = { totalArrows: 0, scoredArrows: 0, unscoredArrows: 0, avgScorePerArrow: null };

function StatRow({ icon, label, value }: { icon: IconDefinition; label: string; value: number }) {
  return (
    <View style={styles.statRow}>
      <View style={styles.statLabel}>
        <FontAwesomeIcon icon={icon} size={14} color={colors.secondary} />
        <Text style={styles.statLabelText}>{label}</Text>
      </View>
      <Text style={styles.statValue}>{value}</Text>
    </View>
  );
}

function PeriodCard({ title, icon, data }: { title: string; icon: IconDefinition; data: StatsData }) {
  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.cardIconWrap}>
          <FontAwesomeIcon icon={icon} size={18} color={colors.white} />
        </View>
        <Text style={styles.cardTitle}>{title}</Text>
      </View>

      <View style={styles.cardStats}>
        <StatRow icon={faBullseye} label="Totalt antall piler" value={data.totalArrows} />
        <View style={styles.divider} />
        <StatRow icon={faCircleCheck} label="Med score" value={data.scoredArrows} />
        <StatRow icon={faCircleXmark} label="Uten score" value={data.unscoredArrows} />
      </View>
    </View>
  );
}

export function StatsSummary({ last7Days, last30Days, overall }: Props) {
  return (
    <View style={styles.grid}>
      <PeriodCard title="Siste 7 dager" icon={faCalendarDays} data={last7Days ?? EMPTY} />
      <PeriodCard title="Siste 30 dager" icon={faArrowTrendUp} data={last30Days ?? EMPTY} />
      <PeriodCard title="Totalt" icon={faChartBar} data={overall ?? EMPTY} />
    </View>
  );
}
