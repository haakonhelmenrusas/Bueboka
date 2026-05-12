import { View, Text, StyleSheet } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCalendarDays } from '@fortawesome/free-solid-svg-icons/faCalendarDays';
import { faBullseye } from '@fortawesome/free-solid-svg-icons/faBullseye';
import { faCircleCheck } from '@fortawesome/free-solid-svg-icons/faCircleCheck';
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons/faCircleXmark';
import { faChartLine } from '@fortawesome/free-solid-svg-icons/faChartLine';
import { faStar } from '@fortawesome/free-solid-svg-icons/faStar';
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import type { Series } from '@/types';
import { colors } from '@/styles/colors';
import { useTranslation } from '@/contexts';
import type { TranslationKeys } from '@/lib/i18n';
import { SERIES_COLORS } from './constants';

export interface BreakdownItem {
  name: string;
  data: Series['data'];
  color: string;
}

function StatRow({ icon, label, value }: { icon: IconDefinition; label: string; value: string }) {
  return (
    <View style={styles.statRow}>
      <View style={styles.statLabel}>
        <FontAwesomeIcon icon={icon} size={12} color={colors.secondary} />
        <Text style={styles.statLabelText}>{label}</Text>
      </View>
      <Text style={styles.statValue}>{value}</Text>
    </View>
  );
}

function BreakdownCard({ item, t }: { item: BreakdownItem; t: TranslationKeys }) {
  const totalArrows = item.data.reduce((sum, d) => sum + d.arrows, 0);
  const totalScore = item.data.reduce((sum, d) => sum + d.score, 0);
  const scoredArrows = item.data.reduce((sum, d) => sum + d.scoredArrows, 0);
  const sessions = item.data.length;
  const percentScored = totalArrows > 0 ? Math.round((scoredArrows / totalArrows) * 100) : 0;
  const avgArrows = sessions > 0 ? Math.round(totalArrows / sessions) : 0;
  const avgScore = scoredArrows > 0 ? (totalScore / scoredArrows).toFixed(2).replace('.', ',') : '–';

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={[styles.colorDot, { backgroundColor: item.color }]} />
        <Text style={styles.cardTitle} numberOfLines={2}>
          {item.name}
        </Text>
      </View>
      <View style={styles.divider} />
      <StatRow icon={faCalendarDays} label={t['statistics.sessions']} value={String(sessions)} />
      <StatRow icon={faBullseye} label={t['statistics.totalArrows']} value={String(totalArrows)} />
      <StatRow icon={faCircleCheck} label={t['statistics.scoredArrows']} value={`${percentScored} %`} />
      <StatRow icon={faCircleXmark} label={t['statistics.unscored']} value={`${100 - percentScored} %`} />
      <StatRow icon={faChartLine} label={t['statistics.arrowsPerSession']} value={String(avgArrows)} />
      <StatRow icon={faStar} label={t['statistics.avgScorePerArrow']} value={avgScore} />
    </View>
  );
}

interface Props {
  series: Series[];
}

export function BreakdownSection({ series }: Props) {
  const { t } = useTranslation();
  const items: BreakdownItem[] = series.map((s, i) => ({
    name: s.name,
    data: s.data,
    color: SERIES_COLORS[i % SERIES_COLORS.length],
  }));

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>{t['statistics.breakdownTitle']}</Text>
      <View style={styles.grid}>
        {items.map((item) => (
          <BreakdownCard key={item.name} item={item} t={t} />
        ))}
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
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  card: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: colors.white,
    borderRadius: 14,
    padding: 14,
    gap: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 2,
  },
  colorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    flexShrink: 0,
  },
  cardTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.primary,
    flex: 1,
  },
  divider: {
    height: 1,
    backgroundColor: colors.bgGray100,
    marginVertical: 4,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flex: 1,
  },
  statLabelText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  statValue: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary,
  },
});
