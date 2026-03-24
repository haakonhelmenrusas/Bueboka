import { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { faCalendarDays } from '@fortawesome/free-solid-svg-icons/faCalendarDays';
import { faArrowTrendUp } from '@fortawesome/free-solid-svg-icons/faArrowTrendUp';
import { faChartBar } from '@fortawesome/free-solid-svg-icons/faChartBar';
import { faBullseye } from '@fortawesome/free-solid-svg-icons/faBullseye';
import { faCircleCheck } from '@fortawesome/free-solid-svg-icons/faCircleCheck';
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons/faCircleXmark';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons/faChevronLeft';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons/faChevronRight';
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
  const [index, setIndex] = useState(0);

  const cards = [
    { title: 'Siste 7 dager', icon: faCalendarDays, data: last7Days ?? EMPTY },
    { title: 'Siste 30 dager', icon: faArrowTrendUp, data: last30Days ?? EMPTY },
    { title: 'Totalt', icon: faChartBar, data: overall ?? EMPTY },
  ];

  const current = cards[index];

  return (
    <View style={styles.carousel}>
      <View style={styles.carouselRow}>
        <TouchableOpacity
          onPress={() => setIndex((i) => i - 1)}
          disabled={index === 0}
          style={styles.chevron}
          hitSlop={{ top: 12, bottom: 12, left: 8, right: 8 }}>
          <FontAwesomeIcon icon={faChevronLeft} size={16} color={index === 0 ? colors.dimmed : colors.primary} />
        </TouchableOpacity>

        <View style={styles.cardWrap}>
          <PeriodCard title={current.title} icon={current.icon} data={current.data} />
        </View>

        <TouchableOpacity
          onPress={() => setIndex((i) => i + 1)}
          disabled={index === cards.length - 1}
          style={styles.chevron}
          hitSlop={{ top: 12, bottom: 12, left: 8, right: 8 }}>
          <FontAwesomeIcon icon={faChevronRight} size={16} color={index === cards.length - 1 ? colors.dimmed : colors.primary} />
        </TouchableOpacity>
      </View>

      <View style={styles.dots}>
        {cards.map((_, i) => (
          <View key={i} style={[styles.dot, i === index && styles.dotActive]} />
        ))}
      </View>
    </View>
  );
}
