import { Text, TouchableOpacity, View } from 'react-native';
import { ChallengeListItem } from '@/types';
import { styles } from './ChallengeCardStyles';
import { colors } from '@/styles/colors';
import { useTranslation } from '@/contexts';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import {
  faUser,
  faCalendar,
  faClock,
  faCheckCircle,
  faTimesCircle,
  faExclamationCircle,
  faTrophy,
  faBan,
} from '@fortawesome/free-solid-svg-icons';

interface ChallengeCardProps {
  challenge: ChallengeListItem;
  onPress?: (challenge: ChallengeListItem) => void;
}

// Status colors for the badge
const statusColors: Record<string, string> = {
  PENDING: colors.warning,
  ACCEPTED: colors.success,
  DECLINED: colors.error,
  COMPLETED: colors.primary,
  CANCELLED: colors.textSecondary,
};

// Status icons
const statusIcons: Record<string, any> = {
  PENDING: faClock,
  ACCEPTED: faCheckCircle,
  DECLINED: faTimesCircle,
  COMPLETED: faTrophy,
  CANCELLED: faBan,
};

// Status labels in Norwegian
const getStatusLabel = (status: string, t: any): string => {
  switch (status) {
    case 'PENDING':
      return t['challenge.statusPending'] || 'Venter p\u00e5 svar';
    case 'ACCEPTED':
      return t['challenge.statusAccepted'] || 'Akseptert';
    case 'DECLINED':
      return t['challenge.statusDeclined'] || 'Avsl\u00e5tt';
    case 'COMPLETED':
      return t['challenge.statusCompleted'] || 'Fullf\u0018rt';
    case 'CANCELLED':
      return t['challenge.statusCancelled'] || 'Kansellert';
    default:
      return status;
  }
};

export default function ChallengeCard({ challenge, onPress }: ChallengeCardProps) {
  const { t, locale } = useTranslation();

  const getOpponentName = () => {
    // If we have names, use the opponent's name
    if (challenge.challengerName && challenge.challengedName) {
      // For simplicity, just show the name we have
      return challenge.challengerName || challenge.challengedName;
    }
    return t['challenge.unknownOpponent'] || 'Ukjent motstander';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(locale === 'en' ? 'en-GB' : 'nb-NO', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const StatusBadge = ({ status }: { status: string }) => (
    <View style={[styles.statusBadge, { backgroundColor: statusColors[status] || colors.textSecondary }]}>
      <FontAwesomeIcon icon={statusIcons[status] || faExclamationCircle} size={14} color={colors.white} />
      <Text style={styles.statusText}>{getStatusLabel(status, t)}</Text>
    </View>
  );

  const getScoreText = () => {
    if (challenge.status === 'COMPLETED') {
      if (challenge.challengerScore !== null && challenge.challengedScore !== null) {
        return `${challenge.challengerScore} - ${challenge.challengedScore}`;
      }
    }
    return null;
  };

  const scoreText = getScoreText();

  return (
    <TouchableOpacity style={styles.card} onPress={() => onPress?.(challenge)} activeOpacity={0.7}>
      <View style={styles.cardHeader}>
        <Text style={styles.challengeName} numberOfLines={1}>
          {challenge.name}
        </Text>
        <StatusBadge status={challenge.status} />
      </View>

      <View style={styles.cardBody}>
        <View style={styles.infoRow}>
          <FontAwesomeIcon icon={faUser} size={16} color={colors.textSecondary} />
          <Text style={styles.infoText}>
            {t['challenge.opponent']}: {getOpponentName()}
          </Text>
        </View>

        <View style={styles.infoRow}>
          <FontAwesomeIcon icon={faCalendar} size={16} color={colors.textSecondary} />
          <Text style={styles.infoText}>
            {t['challenge.created']}: {formatDate(challenge.createdAt)}
          </Text>
        </View>

        {scoreText && (
          <View style={styles.infoRow}>
            <FontAwesomeIcon icon={faTrophy} size={16} color={colors.textSecondary} />
            <Text style={styles.scoreText}>{scoreText}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}
