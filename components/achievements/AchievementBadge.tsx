import React from 'react';
import { View, Text } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { faBullseye } from '@fortawesome/free-solid-svg-icons/faBullseye';
import { faTrophy } from '@fortawesome/free-solid-svg-icons/faTrophy';
import { faCrown } from '@fortawesome/free-solid-svg-icons/faCrown';
import { faFire } from '@fortawesome/free-solid-svg-icons/faFire';
import { faBolt } from '@fortawesome/free-solid-svg-icons/faBolt';
import { faStar } from '@fortawesome/free-solid-svg-icons/faStar';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons/faArrowRight';
import { faCrosshairs } from '@fortawesome/free-solid-svg-icons/faCrosshairs';
import { faArrowTrendUp } from '@fortawesome/free-solid-svg-icons/faArrowTrendUp';
import { faMedal } from '@fortawesome/free-solid-svg-icons/faMedal';
import { faCompass } from '@fortawesome/free-solid-svg-icons/faCompass';
import { faHouse } from '@fortawesome/free-solid-svg-icons/faHouse';
import { faTree } from '@fortawesome/free-solid-svg-icons/faTree';
import { faMountain } from '@fortawesome/free-solid-svg-icons/faMountain';
import { faCloudRain } from '@fortawesome/free-solid-svg-icons/faCloudRain';
import { faSun } from '@fortawesome/free-solid-svg-icons/faSun';
import { faMoon } from '@fortawesome/free-solid-svg-icons/faMoon';
import { faWind } from '@fortawesome/free-solid-svg-icons/faWind';
import { faChartLine } from '@fortawesome/free-solid-svg-icons/faChartLine';
import { faBox } from '@fortawesome/free-solid-svg-icons/faBox';
import { faCircle } from '@fortawesome/free-solid-svg-icons/faCircle';
import { faPersonHiking } from '@fortawesome/free-solid-svg-icons/faPersonHiking';
import { faClockRotateLeft } from '@fortawesome/free-solid-svg-icons/faClockRotateLeft';
import { AchievementProgress, AchievementRarity, AchievementTier } from '@/types/Achievement';
import { colors } from '@/styles/colors';
import { useTranslation } from '@/contexts';
import { styles } from './AchievementBadgeStyles';

interface Props {
  progress: AchievementProgress;
  size?: 'small' | 'medium' | 'large';
  showProgress?: boolean;
}

const ICON_MAP: Record<string, IconDefinition> = {
  Target: faBullseye,
  Award: faTrophy,
  Trophy: faTrophy,
  Crown: faCrown,
  Flame: faFire,
  Zap: faBolt,
  Star: faStar,
  ArrowRight: faArrowRight,
  Crosshair: faCrosshairs,
  TrendingUp: faArrowTrendUp,
  Sparkles: faStar,
  Activity: faChartLine,
  Medal: faMedal,
  Compass: faCompass,
  Home: faHouse,
  Trees: faTree,
  Footprints: faPersonHiking,
  Mountain: faMountain,
  CloudRain: faCloudRain,
  Sunrise: faSun,
  Moon: faMoon,
  Package: faBox,
  History: faClockRotateLeft,
  Circle: faCircle,
  Wind: faWind,
};

const RARITY_COLORS: Record<AchievementRarity, { border: string; bg: string; iconColor: string }> = {
  COMMON: { border: '#9ca3af', bg: 'rgba(156, 163, 175, 0.12)', iconColor: '#6b7280' },
  UNCOMMON: { border: '#22c55e', bg: 'rgba(34, 197, 94, 0.1)', iconColor: '#16a34a' },
  RARE: { border: '#3b82f6', bg: 'rgba(59, 130, 246, 0.1)', iconColor: '#2563eb' },
  EPIC: { border: '#a855f7', bg: 'rgba(168, 85, 247, 0.1)', iconColor: '#9333ea' },
  LEGENDARY: { border: '#f59e0b', bg: 'rgba(245, 158, 11, 0.12)', iconColor: '#d97706' },
};

const TIER_COLORS: Record<AchievementTier, string> = {
  BRONZE: '#cd7f32',
  SILVER: '#94a3b8',
  GOLD: '#eab308',
  PLATINUM: '#06b6d4',
  DIAMOND: '#8b5cf6',
};

function getTierLabel(tier: AchievementTier): string {
  switch (tier) {
    case 'BRONZE':
      return 'Br';
    case 'SILVER':
      return 'Sø';
    case 'GOLD':
      return 'Gu';
    case 'PLATINUM':
      return 'Pl';
    case 'DIAMOND':
      return '💎';
  }
}

const SIZE_CONFIG = {
  small: { iconSize: 14, nameFontSize: 13, descFontSize: 11 },
  medium: { iconSize: 18, nameFontSize: 15, descFontSize: 12 },
  large: { iconSize: 22, nameFontSize: 17, descFontSize: 14 },
};

export function AchievementBadge({ progress, size = 'medium', showProgress = true }: Props) {
  const { t } = useTranslation();
  const { achievement, percentage, isUnlocked, current, required } = progress;
  const icon = ICON_MAP[achievement.icon] ?? faTrophy;
  const rarityStyle = RARITY_COLORS[achievement.rarity];
  const sizeConfig = SIZE_CONFIG[size];

  return (
    <View style={[styles.card, !isUnlocked && styles.cardLocked, { borderColor: isUnlocked ? rarityStyle.border : colors.border }]}>
      <View
        style={[
          styles.iconWrap,
          {
            backgroundColor: isUnlocked ? rarityStyle.bg : colors.bgGray100,
            borderColor: isUnlocked ? rarityStyle.border : colors.border,
          },
        ]}>
        <FontAwesomeIcon icon={icon} size={sizeConfig.iconSize} color={isUnlocked ? rarityStyle.iconColor : colors.inactive} />
        {achievement.tier && (
          <View style={[styles.tierBadge, { backgroundColor: TIER_COLORS[achievement.tier] }]}>
            <Text style={styles.tierLabel}>{getTierLabel(achievement.tier)}</Text>
          </View>
        )}
      </View>

      <View style={styles.content}>
        <Text
          style={[styles.name, { fontSize: sizeConfig.nameFontSize, color: isUnlocked ? colors.text : colors.textSecondary }]}
          numberOfLines={2}>
          {achievement.name}
        </Text>
        <Text style={[styles.description, { fontSize: sizeConfig.descFontSize }]} numberOfLines={3}>
          {achievement.description}
        </Text>

        {showProgress && !isUnlocked && (
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${percentage}%`, backgroundColor: rarityStyle.border }]} />
            </View>
            <Text style={styles.progressText}>
              {current} / {required}
            </Text>
          </View>
        )}

        {isUnlocked && (
          <View style={styles.unlockedBadge}>
            <FontAwesomeIcon icon={faStar} size={10} color={colors.warning} />
            <Text style={styles.unlockedText}>{t['achievements.unlockedBadge']}</Text>
          </View>
        )}
      </View>
    </View>
  );
}
