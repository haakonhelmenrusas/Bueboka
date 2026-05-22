import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCalendar } from '@fortawesome/free-solid-svg-icons/faCalendar';
import { faBullseye } from '@fortawesome/free-solid-svg-icons/faBullseye';
import { faArrowUp } from '@fortawesome/free-solid-svg-icons/faArrowUp';
import { faMapPin } from '@fortawesome/free-solid-svg-icons/faMapPin';
import { colors } from '@/styles/colors';
import { useTranslation } from '@/contexts';

export interface SessionShareData {
  date: string;
  practiceType: 'TRENING' | 'KONKURRANSE';
  totalScore: number;
  arrowsShot: number;
  arrowsWithoutScore: number;
  bowName: string | null;
  bowType: string | null;
  distanceMeters: number | null;
  category: string | null;
  environment: string | null;
  location: string | null;
}

interface SessionShareCardProps {
  data: SessionShareData;
}

export function SessionShareCard({ data }: SessionShareCardProps) {
  const { t, locale } = useTranslation();

  const formattedDate = new Date(data.date).toLocaleDateString(locale === 'en' ? 'en-GB' : 'nb-NO', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const typeLabel = data.practiceType === 'KONKURRANSE' ? t['practiceCard.badgeCompetition'] : t['practiceCard.badgePractice'];
  const unscoredArrows = data.arrowsWithoutScore ?? 0;
  const scoredArrows = Math.max(0, data.arrowsShot - unscoredArrows);

  const statItems: { icon: React.ReactNode; label: string; value: string }[] = [];

  statItems.push({
    icon: <FontAwesomeIcon icon={faCalendar} size={16} color={colors.primaryLight} />,
    label: t['share.date'],
    value: formattedDate,
  });

  if (data.category) {
    statItems.push({
      icon: <FontAwesomeIcon icon={faBullseye} size={16} color={colors.primaryLight} />,
      label: t['share.category'],
      value: data.category,
    });
  }

  if (data.bowName) {
    statItems.push({
      icon: <Text style={s.statIconEmoji}>🏹</Text>,
      label: t['share.bow'],
      value: data.bowType ? `${data.bowName} (${data.bowType})` : data.bowName,
    });
  }

  if (data.distanceMeters) {
    statItems.push({
      icon: <FontAwesomeIcon icon={faArrowUp} size={16} color={colors.primaryLight} />,
      label: t['share.distance'],
      value: `${data.distanceMeters} m`,
    });
  }

  if (data.environment) {
    statItems.push({
      icon: <FontAwesomeIcon icon={faMapPin} size={16} color={colors.primaryLight} />,
      label: t['share.environment'],
      value: data.environment,
    });
  }

  if (data.location) {
    statItems.push({
      icon: <FontAwesomeIcon icon={faMapPin} size={16} color={colors.primaryLight} />,
      label: t['share.location'],
      value: data.location,
    });
  }

  return (
    <View style={s.card} collapsable={false}>
      <View style={s.header}>
        <View style={s.brand}>
          <View style={s.brandLogoCircle}>
            <Image source={require('@/assets/images/logo512.png')} style={s.brandLogo} />
          </View>
          <Text style={s.brandName}>Bueboka</Text>
        </View>
        <View style={s.typeBadge}>
          <Text style={s.typeBadgeText}>{typeLabel.toUpperCase()}</Text>
        </View>
      </View>

      <View style={s.scoreHero}>
        {data.totalScore > 0 ? (
          <>
            <Text style={s.scoreLabel}>{t['share.totalScore'].toUpperCase()}</Text>
            <Text style={s.scoreValue}>{data.totalScore}</Text>
            <View style={s.chipsRow}>
              <View style={s.chip}>
                <Text style={s.chipText}>
                  {scoredArrows} {t['share.withScoring']}
                </Text>
              </View>
              {unscoredArrows > 0 && (
                <View style={s.chipDim}>
                  <Text style={s.chipDimText}>
                    {unscoredArrows} {t['share.withoutScoring']}
                  </Text>
                </View>
              )}
            </View>
          </>
        ) : (
          <>
            <Text style={s.scoreLabel}>{t['share.arrowsShot'].toUpperCase()}</Text>
            <Text style={s.scoreValue}>{data.arrowsShot}</Text>
            <View style={s.chipsRow}>
              {unscoredArrows > 0 ? (
                <>
                  <View style={s.chip}>
                    <Text style={s.chipText}>
                      {scoredArrows} {t['share.withScoring']}
                    </Text>
                  </View>
                  <View style={s.chipDim}>
                    <Text style={s.chipDimText}>
                      {unscoredArrows} {t['share.withoutScoring']}
                    </Text>
                  </View>
                </>
              ) : (
                <View style={s.chip}>
                  <Text style={s.chipText}>{t['share.trainingSession']}</Text>
                </View>
              )}
            </View>
          </>
        )}
      </View>

      <View style={s.statsGrid}>
        {statItems.map((item, i) => (
          <View key={i} style={[s.statItem, i % 2 === 0 && i < statItems.length - 1 && s.statItemBorderRight]}>
            <View style={s.statIconWrap}>{item.icon}</View>
            <View style={s.statContent}>
              <Text style={s.statLabel}>{item.label.toUpperCase()}</Text>
              <Text style={s.statValue} numberOfLines={2}>
                {item.value}
              </Text>
            </View>
          </View>
        ))}
      </View>

      <View style={s.footer}>
        <Text style={s.footerText}>bueboka.no</Text>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  card: {
    width: 340,
    backgroundColor: colors.white,
    borderRadius: 20,
    overflow: 'hidden',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.primaryDark,
  },
  brand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  brandLogoCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.tertiary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandLogo: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
  },
  brandName: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  typeBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: colors.white25,
  },
  typeBadgeText: {
    color: colors.white80,
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 0.8,
  },
  scoreHero: {
    paddingVertical: 24,
    paddingHorizontal: 20,
    alignItems: 'center',
    backgroundColor: colors.primaryLight,
  },
  scoreLabel: {
    color: colors.white85,
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 0.8,
    marginBottom: 6,
  },
  scoreValue: {
    color: colors.white,
    fontSize: 56,
    fontWeight: '800',
    lineHeight: 60,
    marginBottom: 8,
    letterSpacing: -2,
  },
  chipsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  chip: {
    backgroundColor: colors.white20,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: colors.white30,
  },
  chipText: {
    color: colors.white,
    fontSize: 11,
    fontWeight: '600',
  },
  chipDim: {
    backgroundColor: colors.white08,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: colors.white15,
  },
  chipDimText: {
    color: colors.white80,
    fontSize: 11,
    fontWeight: '500',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    borderTopWidth: 1,
    borderTopColor: colors.bgGray200,
  },
  statItem: {
    width: '50%',
    padding: 14,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.bgGray200,
  },
  statItemBorderRight: {
    borderRightWidth: 1,
    borderRightColor: colors.bgGray200,
  },
  statIconWrap: {
    marginTop: 2,
  },
  statIconEmoji: {
    fontSize: 16,
  },
  statContent: {
    flex: 1,
    gap: 2,
  },
  statLabel: {
    color: colors.inactive,
    fontSize: 9,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  statValue: {
    color: colors.text,
    fontSize: 12,
    fontWeight: '600',
  },
  footer: {
    backgroundColor: colors.bgGray50,
    paddingVertical: 8,
    paddingHorizontal: 20,
    alignItems: 'flex-end',
  },
  footerText: {
    color: colors.inactive,
    fontSize: 10,
    fontWeight: '500',
    letterSpacing: 0.3,
  },
});
