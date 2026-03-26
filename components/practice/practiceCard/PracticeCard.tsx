import { Text, TouchableOpacity, View } from 'react-native';
import { Practice } from '@/types';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faHouse, faMapPin, faStar, faBullseye, faTree, faTrophy } from '@fortawesome/free-solid-svg-icons';
import { styles } from './PracticeCardStyles';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '@/styles/colors';

interface PracticeCardProps {
  practice: Practice;
  onEdit?: (practice: Practice) => void;
}

function formatEnvironment(env?: string | null) {
  if (!env) return null;
  const normalized = env.toLowerCase();
  if (normalized === 'inne' || normalized === 'indoor') return 'Inne';
  if (normalized === 'ute' || normalized === 'outdoor') return 'Ute';
  return env;
}

export default function PracticeCard({ practice, onEdit }: PracticeCardProps) {
  const handleEdit = () => {
    if (onEdit) {
      onEdit(practice);
    }
  };

  // Scored arrows only (end.arrows excludes arrowsWithoutScore)
  const totalScoredArrows = practice.ends?.reduce((sum, end) => sum + (end.arrows ?? 0), 0) ?? 0;
  const totalScore = practice.totalScore ?? 0;

  // Combined score label: "290 p / 30 piler" when both available, otherwise just one
  const scoreLabel = (() => {
    const hasScoredArrows = totalScoredArrows > 0;
    const hasScore = totalScore > 0;
    if (hasScore && hasScoredArrows) return `${totalScore} p / ${totalScoredArrows} piler`;
    if (hasScore) return `${totalScore} p`;
    if (hasScoredArrows) return `${totalScoredArrows} piler`;
    return null;
  })();

  // Format date - handle both Date objects and ISO strings from API
  const practiceDate = practice.date as Date | string;
  const dateObj = typeof practiceDate === 'string' ? new Date(practiceDate) : practiceDate;
  const formattedDate = dateObj.toLocaleDateString('nb-NO', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  // Format environment
  const envText = formatEnvironment(practice.environment);
  const envIcon = practice.environment === 'INDOOR' ? faHouse : faTree;

  // Determine if competition (when we add competition support)
  const isCompetition = false; // TODO: Add competition type field

  return (
    <TouchableOpacity style={styles.trainingCard} onPress={handleEdit} activeOpacity={0.7}>
      <LinearGradient
        colors={[colors.primary, colors.secondary, colors.tertiary]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradientAccent}
      />
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.date}>{formattedDate}</Text>
          <View style={styles.badge}>
            <FontAwesomeIcon icon={isCompetition ? faTrophy : faBullseye} size={12} color={colors.white} />
            <Text style={styles.badgeText}>{isCompetition ? 'Konkurranse' : 'Trening'}</Text>
          </View>
        </View>

        <View style={styles.detailsRow}>
          {scoreLabel && (
            <View style={styles.detailItem}>
              <FontAwesomeIcon icon={faStar} size={14} color={colors.secondary} />
              <Text style={styles.detailText}>{scoreLabel}</Text>
            </View>
          )}

          {practice.roundType?.name && (
            <View style={styles.detailItem}>
              <FontAwesomeIcon icon={faBullseye} size={14} color={colors.secondary} />
              <Text style={styles.detailText}>{practice.roundType.name}</Text>
            </View>
          )}
        </View>

        {(practice.location || envText) && (
          <View style={styles.detailsRow}>
            {practice.location && (
              <View style={styles.detailItem}>
                <FontAwesomeIcon icon={faMapPin} size={14} color={colors.secondary} />
                <Text style={styles.detailText}>{practice.location}</Text>
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
