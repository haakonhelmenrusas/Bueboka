import { View, Text } from 'react-native';
import { Challenge, ChallengeStatus } from '@/types';
import { styles } from './ChallengeDetailStyles';
import { useTranslation } from '@/contexts';
import { colors } from '@/styles/colors';
import { Button } from '@/components/common';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import {
  faUser,
  faCalendar,
  faTrophy,
  faClock,
  faCheckCircle,
  faTimesCircle,
  faBan,
  faExclamationCircle,
} from '@fortawesome/free-solid-svg-icons';

interface ChallengeDetailProps {
  challenge: Challenge;
  currentUserId: string;
  onAccept?: () => void;
  onDecline?: () => void;
  onCancel?: () => void;
  onSubmitResult?: () => void;
  onDelete?: () => void;
  loading?: boolean;
}

// Status icons for display
const statusIcons: Record<ChallengeStatus, any> = {
  [ChallengeStatus.PENDING]: faClock,
  [ChallengeStatus.ACCEPTED]: faCheckCircle,
  [ChallengeStatus.DECLINED]: faTimesCircle,
  [ChallengeStatus.COMPLETED]: faTrophy,
  [ChallengeStatus.CANCELLED]: faBan,
};

// Status colors
const statusColors: Record<ChallengeStatus, string> = {
  [ChallengeStatus.PENDING]: colors.warning,
  [ChallengeStatus.ACCEPTED]: colors.success,
  [ChallengeStatus.DECLINED]: colors.error,
  [ChallengeStatus.COMPLETED]: colors.primary,
  [ChallengeStatus.CANCELLED]: colors.textSecondary,
};

const statusLabels: Record<ChallengeStatus, string> = {
  [ChallengeStatus.PENDING]: 'Venter på svar',
  [ChallengeStatus.ACCEPTED]: 'Akseptert',
  [ChallengeStatus.DECLINED]: 'Avslått',
  [ChallengeStatus.COMPLETED]: 'Fullført',
  [ChallengeStatus.CANCELLED]: 'Kansellert',
};

export default function ChallengeDetail({
  challenge,
  currentUserId,
  onAccept,
  onDecline,
  onCancel,
  onSubmitResult,
  onDelete,
  loading = false,
}: ChallengeDetailProps) {
  const { t, locale } = useTranslation();

  const isOwner = challenge.challengerId === currentUserId;
  const opponentName = isOwner ? challenge.challenged?.name : challenge.challenger?.name;
  const userScore = isOwner ? challenge.challengerScore : challenge.challengedScore;
  const userTotalArrows = isOwner ? challenge.challengerTotalArrows : challenge.challengedTotalArrows;
  const opponentScore = isOwner ? challenge.challengedScore : challenge.challengerScore;
  const opponentTotalArrows = isOwner ? challenge.challengedTotalArrows : challenge.challengerTotalArrows;

  // Check if current user has submitted their result
  const userHasSubmitted = isOwner ? challenge.challengerSubmittedAt : challenge.challengedSubmittedAt;

  // Check if opponent has submitted
  const opponentHasSubmitted = isOwner ? challenge.challengedSubmittedAt : challenge.challengerSubmittedAt;

  // Check what actions are available
  const canAccept = challenge.challengedId === currentUserId && challenge.status === ChallengeStatus.PENDING;
  const canDecline = challenge.challengedId === currentUserId && challenge.status === ChallengeStatus.PENDING;
  const canCancel = challenge.challengerId === currentUserId && challenge.status === ChallengeStatus.PENDING;
  const canSubmit =
    challenge.status === ChallengeStatus.ACCEPTED && !userHasSubmitted && (isOwner || challenge.challengedId === currentUserId);
  const canDelete = challenge.challengerId === currentUserId && challenge.status === ChallengeStatus.PENDING;
  const isCompleted = challenge.status === ChallengeStatus.COMPLETED;

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return t['form.choose'];
    const date = new Date(dateString);
    return date.toLocaleDateString(locale === 'en' ? 'en-GB' : 'nb-NO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatScore = (score: number | null | undefined) => {
    if (score === null || score === undefined) return t['challenge.waitingForOpponent'];
    return score.toString();
  };

  const getStatusLabel = (status: ChallengeStatus): string => {
    return statusLabels[status] || status;
  };

  const StatusBadge = ({ status }: { status: ChallengeStatus }) => (
    <View style={[styles.statusBadge, { backgroundColor: statusColors[status] || colors.textSecondary }]}>
      <FontAwesomeIcon icon={statusIcons[status] || faExclamationCircle} size={14} color={colors.white} />
      <Text style={styles.statusText}>{getStatusLabel(status)}</Text>
    </View>
  );

  return (
    <View style={[styles.container, styles.content]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title} numberOfLines={2}>
          {challenge.name}
        </Text>
        <StatusBadge status={challenge.status} />
      </View>

      {/* Metadata */}
      <View style={styles.meta}>
        <View style={styles.metaRow}>
          <FontAwesomeIcon icon={faCalendar} size={16} color={colors.textSecondary} />
          <Text style={styles.metaText}>
            {t['challenge.created']}: {formatDate(challenge.createdAt)}
          </Text>
        </View>

        {challenge.startDate && (
          <View style={styles.metaRow}>
            <FontAwesomeIcon icon={faCalendar} size={16} color={colors.textSecondary} />
            <Text style={styles.metaText}>
              {t['challenge.startDateLabel']}: {formatDate(challenge.startDate)}
            </Text>
          </View>
        )}

        {challenge.endDate && (
          <View style={styles.metaRow}>
            <FontAwesomeIcon icon={faCalendar} size={16} color={colors.textSecondary} />
            <Text style={styles.metaText}>
              {t['challenge.endDateLabel']}: {formatDate(challenge.endDate)}
            </Text>
          </View>
        )}

        <View style={styles.metaRow}>
          <FontAwesomeIcon icon={faUser} size={16} color={colors.textSecondary} />
          <Text style={styles.metaText}>
            {t['challenge.opponent']}: {opponentName || t['challenge.unknownOpponent']}
          </Text>
        </View>
      </View>

      {/* Description */}
      {challenge.description && (
        <View style={styles.description}>
          <Text style={styles.sectionTitle}>{t['challengeDetail.rules']}</Text>
          <Text style={styles.descriptionText}>{challenge.description}</Text>
        </View>
      )}

      {/* Custom Rules */}
      {challenge.customRules && (
        <View style={styles.rules}>
          <Text style={styles.sectionTitle}>{t['challenge.customRulesTitle']}</Text>
          <View style={styles.rulesGrid}>
            {challenge.customRules.distanceMeters !== null && (
              <View style={styles.ruleRow}>
                <Text style={styles.ruleLabel}>{t['challenge.distanceMeters']}:</Text>
                <Text style={styles.ruleValue}>{challenge.customRules.distanceMeters} m</Text>
              </View>
            )}
            {challenge.customRules.distanceFrom !== null && challenge.customRules.distanceTo !== null && (
              <View style={styles.ruleRow}>
                <Text style={styles.ruleLabel}>
                  {t['challenge.distanceFrom']} - {t['challenge.distanceTo']}:
                </Text>
                <Text style={styles.ruleValue}>
                  {challenge.customRules.distanceFrom} - {challenge.customRules.distanceTo} m
                </Text>
              </View>
            )}
            {challenge.customRules.targetSizeCm !== null && (
              <View style={styles.ruleRow}>
                <Text style={styles.ruleLabel}>{t['challenge.targetSize']}:</Text>
                <Text style={styles.ruleValue}>{challenge.customRules.targetSizeCm} cm</Text>
              </View>
            )}
            {challenge.customRules.numberArrows !== null && (
              <View style={styles.ruleRow}>
                <Text style={styles.ruleLabel}>{t['challenge.numberArrows']}:</Text>
                <Text style={styles.ruleValue}>{challenge.customRules.numberArrows}</Text>
              </View>
            )}
            {challenge.customRules.arrowsWithoutScore !== null && (
              <View style={styles.ruleRow}>
                <Text style={styles.ruleLabel}>{t['challenge.arrowsWithoutScore']}:</Text>
                <Text style={styles.ruleValue}>{challenge.customRules.arrowsWithoutScore}</Text>
              </View>
            )}
            {challenge.customRules.targetType && (
              <View style={styles.ruleRow}>
                <Text style={styles.ruleLabel}>{t['challenge.targetType']}:</Text>
                <Text style={styles.ruleValue}>{challenge.customRules.targetType}</Text>
              </View>
            )}
          </View>
        </View>
      )}

      {/* Participants and Scores */}
      <View style={styles.participants}>
        <Text style={styles.sectionTitle}>{t['challenge.score']}</Text>

        <View style={styles.participantRow}>
          <View style={[styles.participant, { flex: 1 }]}>
            <Text style={styles.participantName}>{t['challenge.you']}</Text>
            <View style={styles.scoreRow}>
              <Text style={styles.participantScore}>{formatScore(userScore)}</Text>
              {userTotalArrows !== null && userTotalArrows !== undefined && (
                <Text style={styles.arrowsText}>
                  ({userTotalArrows} {t['practiceCard.arrowsSuffix']})
                </Text>
              )}
            </View>
            {userHasSubmitted && (
              <View style={styles.submittedBadge}>
                <FontAwesomeIcon icon={faCheckCircle} size={12} color={colors.white} />
                <Text style={styles.submittedText}>{t['challenge.resultSubmitted']}</Text>
              </View>
            )}
          </View>

          <View style={[styles.participant, { flex: 1 }]}>
            <Text style={styles.participantName}>{opponentName || t['challenge.unknownOpponent']}</Text>
            <View style={styles.scoreRow}>
              <Text style={styles.participantScore}>{formatScore(opponentScore)}</Text>
              {opponentTotalArrows !== null && opponentTotalArrows !== undefined && (
                <Text style={styles.arrowsText}>
                  ({opponentTotalArrows} {t['practiceCard.arrowsSuffix']})
                </Text>
              )}
            </View>
            {opponentHasSubmitted && (
              <View style={[styles.submittedBadge, { backgroundColor: colors.success }]}>
                <FontAwesomeIcon icon={faCheckCircle} size={12} color={colors.white} />
                <Text style={styles.submittedText}>{t['challenge.resultSubmitted']}</Text>
              </View>
            )}
            {!opponentHasSubmitted && isCompleted === false && (
              <View style={[styles.submittedBadge, { backgroundColor: colors.warning }]}>
                <FontAwesomeIcon icon={faClock} size={12} color={colors.white} />
                <Text style={styles.submittedText}>{t['challenge.waitingForOpponent']}</Text>
              </View>
            )}
          </View>
        </View>
      </View>

      {/* Result */}
      {isCompleted && challenge.winnerId && (
        <View style={styles.result}>
          <Text style={styles.sectionTitle}>{t['challengeResult.title']}</Text>
          <View style={styles.winnerContainer}>
            <FontAwesomeIcon icon={faTrophy} size={20} color={colors.primary} />
            <Text style={styles.winnerText}>
              {t['challenge.winner']}:{' '}
              {challenge.winnerId === currentUserId ? t['challenge.you'] : opponentName || t['challenge.unknownOpponent']}
            </Text>
          </View>
          <View style={styles.scoresContainer}>
            <Text style={styles.scoreComparison}>
              {formatScore(userScore)} - {formatScore(opponentScore)}
            </Text>
          </View>
        </View>
      )}

      {/* Actions */}
      <View style={styles.actions}>
        {canAccept && onAccept && (
          <Button label={t['challenge.accept']} onPress={onAccept} buttonStyle={styles.buttonAccept} disabled={loading} />
        )}

        {canDecline && onDecline && (
          <Button
            label={t['challenge.decline']}
            onPress={onDecline}
            variant="warning"
            buttonStyle={styles.buttonDecline}
            type="outline"
            disabled={loading}
          />
        )}

        {canCancel && onCancel && (
          <Button
            label={t['challenge.cancel']}
            onPress={onCancel}
            variant="warning"
            buttonStyle={styles.buttonCancel}
            type="outline"
            disabled={loading}
          />
        )}

        {canSubmit && onSubmitResult && (
          <Button label={t['challenge.submitResult']} onPress={onSubmitResult} buttonStyle={styles.buttonSubmit} disabled={loading} />
        )}

        {canDelete && onDelete && (
          <Button
            label={t['common.delete']}
            onPress={onDelete}
            variant="warning"
            buttonStyle={styles.buttonDelete}
            type="outline"
            disabled={loading}
          />
        )}
      </View>
    </View>
  );
}

// Import Text from react-native
import { Text as RNText } from 'react-native';
