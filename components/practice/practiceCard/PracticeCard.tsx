import { Text, TouchableOpacity, View } from 'react-native';
import { PracticeCardItem, PracticeCategory } from '@/types';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faHouse, faMapPin, faStar, faBullseye, faTree, faTrophy, faMedal, faArrowUp } from '@fortawesome/free-solid-svg-icons';
import { styles } from './PracticeCardStyles';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '@/styles/colors';
import { getPracticeCategoryIcon } from '@/components/practice/practiceDetailsModal/constants';
import { getPracticeCategoryLabel } from '@/utils/helpers/labelUtils';
import { useTranslation } from '@/contexts';

interface PracticeCardProps {
  card: PracticeCardItem;
  onPress?: (card: PracticeCardItem) => void;
}

export default function PracticeCard({ card, onPress }: PracticeCardProps) {
  const { t, locale } = useTranslation();
  const isCompetition = card.practiceType === 'KONKURRANSE';

  function formatEnvironment(env?: string | null) {
    if (!env) return null;
    const normalized = env.toLowerCase();
    if (normalized === 'inne' || normalized === 'indoor') return t['practiceCard.envIndoor'];
    if (normalized === 'ute' || normalized === 'outdoor') return t['practiceCard.envOutdoor'];
    return env;
  }

  // Score label: "totalScore / arrowsWithScore"
  const scoreLabel = (() => {
    const hasScore = (card.totalScore ?? 0) > 0;
    const hasArrowsWithScore = (card.arrowsWithScore ?? 0) > 0;
    if (hasScore && hasArrowsWithScore) return `${card.totalScore} / ${card.arrowsWithScore}`;
    if (hasScore) return `${card.totalScore}`;
    return null;
  })();

  // Format date
  const dateObj = new Date(card.date);
  const formattedDate = dateObj.toLocaleDateString(locale === 'en' ? 'en-GB' : 'nb-NO', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  const envText = formatEnvironment(card.environment);
  const envIcon = card.environment === 'INDOOR' ? faHouse : faTree;

  return (
    <TouchableOpacity style={styles.trainingCard} onPress={() => onPress?.(card)} activeOpacity={0.7}>
      <LinearGradient
        colors={[colors.primary, colors.secondary, colors.tertiary]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradientAccent}
      />
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.date}>{formattedDate}</Text>
          <View style={[styles.badge, isCompetition && styles.badgeCompetition]}>
            <FontAwesomeIcon
              icon={isCompetition ? faTrophy : faBullseye}
              size={12}
              color={isCompetition ? colors.primaryDark : colors.white}
            />
            <Text style={[styles.badgeText, isCompetition && styles.badgeTextCompetition]}>
              {isCompetition ? t['practiceCard.badgeCompetition'] : t['practiceCard.badgePractice']}
            </Text>
          </View>
        </View>

        {isCompetition && card.competitionName && <Text style={styles.competitionName}>{card.competitionName}</Text>}

        <View style={styles.detailsRow}>
          {card.practiceCategory && (
            <View style={styles.detailItem}>
              {getPracticeCategoryIcon(card.practiceCategory as PracticeCategory, 14, colors.secondary)}
              <Text style={styles.detailText}>{getPracticeCategoryLabel(card.practiceCategory as PracticeCategory, t)}</Text>
            </View>
          )}

          {card.arrowsShot > 0 && (
            <View style={styles.detailItem}>
              <FontAwesomeIcon icon={faArrowUp} size={14} color={colors.secondary} />
              <Text style={styles.detailText}>{`${card.arrowsShot} ${t['practiceCard.arrowsSuffix']}`}</Text>
            </View>
          )}

          {scoreLabel && (
            <View style={styles.detailItem}>
              <FontAwesomeIcon icon={faStar} size={14} color={colors.secondary} />
              <Text style={styles.detailText}>{scoreLabel}</Text>
            </View>
          )}

          {card.roundTypeName && (
            <View style={styles.detailItem}>
              <FontAwesomeIcon icon={faBullseye} size={14} color={colors.secondary} />
              <Text style={styles.detailText}>{card.roundTypeName}</Text>
            </View>
          )}

          {isCompetition && card.placement != null && (
            <View style={styles.detailItem}>
              <FontAwesomeIcon icon={faMedal} size={14} color={colors.secondary} />
              <Text style={styles.detailText}>{`${t['practiceCard.placementLabel']} ${card.placement}`}</Text>
            </View>
          )}
        </View>

        {(card.location || envText) && (
          <View style={styles.detailsRow}>
            {card.location && (
              <View style={styles.detailItem}>
                <FontAwesomeIcon icon={faMapPin} size={14} color={colors.secondary} />
                <Text style={styles.detailText}>{card.location}</Text>
              </View>
            )}
            {envText && (
              <View style={styles.detailItem}>
                <FontAwesomeIcon icon={envIcon} size={14} color={colors.secondary} />
                <Text style={styles.detailText}>{envText}</Text>
              </View>
            )}
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}
