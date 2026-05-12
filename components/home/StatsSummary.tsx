import { useRef, useState } from 'react';
import { Animated, Dimensions, Easing, PanResponder, Text, View } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { faCalendarDays } from '@fortawesome/free-solid-svg-icons/faCalendarDays';
import { faArrowTrendUp } from '@fortawesome/free-solid-svg-icons/faArrowTrendUp';
import { faChartBar } from '@fortawesome/free-solid-svg-icons/faChartBar';
import { faBullseye } from '@fortawesome/free-solid-svg-icons/faBullseye';
import { faCircleCheck } from '@fortawesome/free-solid-svg-icons/faCircleCheck';
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons/faCircleXmark';
import { colors } from '@/styles/colors';
import { useTranslation } from '@/contexts';
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
const CARD_COUNT = 3;
const SLIDE = Dimensions.get('window').width;

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

function PeriodCard({
  title,
  icon,
  data,
  labels,
}: {
  title: string;
  icon: IconDefinition;
  data: StatsData;
  labels: { totalArrows: string; withScore: string; withoutScore: string };
}) {
  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.cardIconWrap}>
          <FontAwesomeIcon icon={icon} size={18} color={colors.white} />
        </View>
        <Text style={styles.cardTitle}>{title}</Text>
      </View>

      <View style={styles.cardStats}>
        <StatRow icon={faBullseye} label={labels.totalArrows} value={data.totalArrows} />
        <View style={styles.divider} />
        <StatRow icon={faCircleCheck} label={labels.withScore} value={data.scoredArrows} />
        <StatRow icon={faCircleXmark} label={labels.withoutScore} value={data.unscoredArrows} />
      </View>
    </View>
  );
}

export function StatsSummary({ last7Days, last30Days, overall }: Props) {
  const { t } = useTranslation();
  const [displayIndex, setDisplayIndex] = useState(0);
  // Use a ref so the PanResponder closure always reads the latest index
  const indexRef = useRef(0);
  const translateX = useRef(new Animated.Value(0)).current;
  // Animated value for the active dot's width (pill expand/contract)
  const dotWidth = useRef(new Animated.Value(18)).current;

  const cards = [
    { title: t['statsSummary.last7days'], icon: faCalendarDays, data: last7Days ?? EMPTY },
    { title: t['statsSummary.last30days'], icon: faArrowTrendUp, data: last30Days ?? EMPTY },
    { title: t['statsSummary.total'], icon: faChartBar, data: overall ?? EMPTY },
  ];

  const periodLabels = {
    totalArrows: t['statsSummary.totalArrows'],
    withScore: t['statsSummary.withScore'],
    withoutScore: t['statsSummary.withoutScore'],
  };

  // dir: +1 = next (swipe left), -1 = prev (swipe right)
  function navigate(dir: 1 | -1) {
    const next = Math.max(0, Math.min(indexRef.current + dir, CARD_COUNT - 1));
    if (next === indexRef.current) return;

    const easing = Easing.out(Easing.cubic);

    // Shrink the current active dot pill before the slide
    Animated.timing(dotWidth, { toValue: 6, duration: 120, useNativeDriver: false }).start();

    // Slide current card out
    Animated.timing(translateX, {
      toValue: -dir * SLIDE,
      duration: 230,
      easing,
      useNativeDriver: true,
    }).start(() => {
      // Snap to incoming side instantly, then slide in
      translateX.setValue(dir * SLIDE);
      indexRef.current = next;
      setDisplayIndex(next);

      Animated.timing(translateX, {
        toValue: 0,
        duration: 230,
        easing,
        useNativeDriver: true,
      }).start();

      // Expand the new active dot pill after the slide starts
      Animated.timing(dotWidth, { toValue: 18, duration: 180, useNativeDriver: false }).start();
    });
  }

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, { dx, dy }) => Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 10,
      onPanResponderRelease: (_, { dx }) => {
        if (dx < -40) navigate(1);
        else if (dx > 40) navigate(-1);
      },
    }),
  ).current;

  const current = cards[displayIndex];

  return (
    <View style={styles.carousel}>
      {/* Clip the sliding card so it doesn't bleed into surrounding UI */}
      <View style={styles.carouselTrack} {...panResponder.panHandlers}>
        <Animated.View style={{ transform: [{ translateX }] }}>
          <PeriodCard title={current.title} icon={current.icon} data={current.data} labels={periodLabels} />
        </Animated.View>
      </View>

      {/* Dot indicators */}
      <View style={styles.dots}>
        {cards.map((_, i) =>
          i === displayIndex ? (
            <Animated.View key={i} style={[styles.dot, styles.dotActive, { width: dotWidth }]} />
          ) : (
            <View key={i} style={styles.dot} />
          ),
        )}
      </View>
    </View>
  );
}
