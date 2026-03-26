import { Text, TouchableOpacity, View } from 'react-native';
import { PracticeCardItem } from '@/types';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faHouse, faMapPin, faStar, faBullseye, faTree, faTrophy, faMedal, faArrowUp } from '@fortawesome/free-solid-svg-icons';
import { styles } from './PracticeCardStyles';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '@/styles/colors';

interface PracticeCardProps {
  card: PracticeCardItem;
  onPress?: (card: PracticeCardItem) => void;
}

function formatEnvironment(env?: string | null) {
  if (!env) return null;
  const normalized = env.toLowerCase();
  if (normalized === 'inne' || normalized === 'indoor') return 'Inne';
  if (normalized === 'ute' || normalized === 'outdoor') return 'Ute';
  return env;
}

export default function PracticeCard({ card, onPress }: PracticeCardProps) {
  const isCompetition = card.practiceType === 'KONKURRANSE';

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
  const formattedDate = dateObj.toLocaleDateString('nb-NO', {
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
              {isCompetition ? 'Konkurranse' : 'Trening'}
            </Text>
          </View>
        </View>

        {isCompetition && card.competitionName && <Text style={styles.competitionName}>{card.competitionName}</Text>}

        <View style={styles.detailsRow}>
          {card.arrowsShot > 0 && (
            <View style={styles.detailItem}>
              <FontAwesomeIcon icon={faArrowUp} size={14} color={colors.secondary} />
              <Text style={styles.detailText}>{card.arrowsShot} piler</Text>
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
              <Text style={styles.detailText}>Plass: {card.placement}</Text>
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
