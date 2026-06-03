import React from 'react';
import { Text, View } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faTrophy } from '@fortawesome/free-solid-svg-icons/faTrophy';
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { faBullseye } from '@fortawesome/free-solid-svg-icons/faBullseye';
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
import { faPersonHiking } from '@fortawesome/free-solid-svg-icons/faPersonHiking';
import { faClockRotateLeft } from '@fortawesome/free-solid-svg-icons/faClockRotateLeft';
import { faCircle } from '@fortawesome/free-solid-svg-icons/faCircle';
import { Button, ModalWrapper } from '@/components/common';
import { useTranslation } from '@/contexts';
import { Achievement } from '@/types/Achievement';
import { getAchievementName, getAchievementDescription } from '@/utils/helpers/achievementLabels';
import { colors } from '@/styles/colors';
import { styles } from './AchievementUnlockModalStyles';

interface AchievementUnlockModalProps {
  achievements: Achievement[];
  onClose: () => void;
  onViewAll?: () => void;
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

export function AchievementUnlockModal({ achievements, onClose, onViewAll }: AchievementUnlockModalProps) {
  const { t } = useTranslation();
  const totalPoints = achievements.reduce((sum, a) => sum + a.points, 0);
  const isSingle = achievements.length === 1;

  return (
    <ModalWrapper visible onClose={onClose}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.celebration}>🎉</Text>
          <Text style={styles.title}>
            {isSingle ? t['achievementUnlock.titleSingle'] : `${achievements.length} ${t['achievementUnlock.titleMultiple']}`}
          </Text>
          <Text style={styles.subtitle}>{isSingle ? t['achievementUnlock.subtitleSingle'] : t['achievementUnlock.subtitleMultiple']}</Text>
        </View>

        <View style={styles.list}>
          {achievements.map((achievement) => {
            const icon = ICON_MAP[achievement.icon] ?? faTrophy;
            const name = getAchievementName(achievement.id, achievement.name, t);
            const description = getAchievementDescription(achievement.id, achievement.description, t);

            return (
              <View key={achievement.id} style={styles.item}>
                <View style={styles.iconWrap}>
                  <FontAwesomeIcon icon={icon} size={24} color={colors.white} />
                </View>
                <View style={styles.itemContent}>
                  <Text style={styles.itemName}>{name}</Text>
                  <Text style={styles.itemDesc}>{description}</Text>
                  <Text style={styles.itemPoints}>
                    +{achievement.points} {t['achievementUnlock.points']}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>

        {totalPoints > 0 && (
          <Text style={styles.totalPoints}>
            {t['achievementUnlock.totalPoints']} +{totalPoints} {t['achievementUnlock.points']}
          </Text>
        )}

        <View style={styles.footer}>
          {onViewAll && (
            <Button
              label={t['achievementUnlock.viewAll']}
              onPress={onViewAll}
              buttonStyle={styles.viewAllButton}
              icon={<FontAwesomeIcon icon={faTrophy} size={16} color={colors.white} />}
            />
          )}
          <Button label={t['common.close']} type="outline" onPress={onClose} buttonStyle={styles.closeButton} />
        </View>
      </View>
    </ModalWrapper>
  );
}
