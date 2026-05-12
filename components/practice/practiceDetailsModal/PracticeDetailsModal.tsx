import React, { useState } from 'react';
import { View, Text, ScrollView, Alert, useWindowDimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faMapPin } from '@fortawesome/free-solid-svg-icons/faMapPin';
import { faCloud } from '@fortawesome/free-solid-svg-icons/faCloud';
import { faBullseye } from '@fortawesome/free-solid-svg-icons/faBullseye';
import { faTrash } from '@fortawesome/free-solid-svg-icons/faTrash';
import { faShare } from '@fortawesome/free-solid-svg-icons/faShare';
import { faNoteSticky } from '@fortawesome/free-solid-svg-icons/faNoteSticky';
import { Practice, Competition } from '@/types';
import { ModalWrapper, ModalHeader, Button } from '@/components/common';
import { colors } from '@/styles/colors';
import { PracticeTypeBadge, EnvironmentBadge } from './Badges';
import { StatCard } from './StatCard';
import { RoundCard } from './RoundCard';
import { styles } from './PracticeDetailsModalStyles';
import { PRACTICE_CATEGORY_ICONS } from './constants';
import { calculateTotalArrows, calculateTotalScore } from './helpers';
import { getBowTypeLabel, getArrowMaterialLabel, getPracticeCategoryLabel, formatWeatherConditions } from '@/utils/helpers/labelUtils';
import { practiceRepository, competitionRepository } from '@/services/repositories';
import { useTranslation } from '@/contexts';

interface PracticeDetailsModalProps {
  visible: boolean;
  practice: Practice | Competition | null;
  onClose: () => void;
  onEdit?: () => void;
  onDeleted?: (id: string) => void;
}

export function PracticeDetailsModal({ visible, practice, onClose, onEdit, onDeleted }: PracticeDetailsModalProps) {
  const [deleting, setDeleting] = useState(false);
  const { height } = useWindowDimensions();
  const { t, locale } = useTranslation();

  // Enhanced validation - check if practice has required fields
  if (!practice || !practice.id || !practice.date) {
    return null;
  }

  // Type guard functions
  const isCompetition = 'rounds' in practice;
  const isPractice = 'ends' in practice;
  const practiceType = isCompetition ? 'KONKURRANSE' : 'TRENING';

  const formattedDate = new Date(practice.date).toLocaleDateString(locale === 'en' ? 'en-GB' : 'nb-NO', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  const totalArrows = calculateTotalArrows(practice);
  const totalScore = calculateTotalScore(practice);

  // For competitions, show competition name in title
  const title = isCompetition && 'name' in practice ? practice.name : formattedDate;

  const handleDelete = async () => {
    Alert.alert(
      t['practiceDetails.confirmDeleteTitle'],
      isCompetition ? t['practiceDetails.deleteCompetitionConfirm'] : t['practiceDetails.deletePracticeConfirm'],
      [
        { text: t['common.cancel'], style: 'cancel' },
        {
          text: t['common.delete'],
          style: 'destructive',
          onPress: async () => {
            setDeleting(true);
            try {
              if (isCompetition) {
                await competitionRepository.delete(practice.id);
              } else {
                await practiceRepository.delete(practice.id);
              }
              onDeleted?.(practice.id);
              onClose();
            } catch {
              Alert.alert(t['common.error'], t['practiceDetails.deleteFailed']);
            } finally {
              setDeleting(false);
            }
          },
        },
      ],
    );
  };

  const handleShare = () => {
    // Placeholder for sharing functionality
    Alert.alert(t['practiceDetails.share'], t['practiceDetails.shareComingSoon']);
  };

  return (
    <ModalWrapper visible={visible} onClose={onClose}>
      <View style={[styles.modal, { height: height * 0.85 }]}>
        <ModalHeader title={title} onPress={onClose} />
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.content}>
            <View style={styles.badges}>
              <PracticeTypeBadge practiceType={practiceType} />
              <EnvironmentBadge environment={practice.environment} />
            </View>
            {totalScore > 0 && (
              <LinearGradient
                colors={[colors.primary, colors.primaryDark]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.scoreCard}>
                <Text style={styles.scoreLabel}>{t['practiceDetails.totalScore']}</Text>
                <Text style={styles.scoreValue}>{totalScore}</Text>
                <Text style={styles.scoreSubtext}>{`${totalArrows} ${t['practiceDetails.arrowsShot']}`}</Text>
              </LinearGradient>
            )}
            <View style={styles.statsGrid}>
              {practice.practiceCategory && (
                <StatCard
                  icon={PRACTICE_CATEGORY_ICONS[practice.practiceCategory]}
                  label={t['form.category']}
                  value={getPracticeCategoryLabel(practice.practiceCategory, t)}
                />
              )}
              {practice.location && (
                <StatCard
                  icon={<FontAwesomeIcon icon={faMapPin} size={20} color={colors.primary} />}
                  label={t['form.location']}
                  value={practice.location}
                />
              )}
              {practice.weather && practice.weather.length > 0 && (
                <StatCard
                  icon={<FontAwesomeIcon icon={faCloud} size={20} color={colors.primary} />}
                  label={t['form.weather']}
                  value={formatWeatherConditions(practice.weather, t)}
                />
              )}
              {practice.bow && (
                <StatCard
                  icon={<Text style={styles.customIcon}>🏹</Text>}
                  label={t['practiceDetails.bowLabel']}
                  value={`${practice.bow.name} • ${getBowTypeLabel(practice.bow.type, t)}`}
                />
              )}
              {practice.arrows && (
                <StatCard
                  icon={<Text style={styles.customIcon}>➳</Text>}
                  label={t['practiceDetails.arrowsLabel']}
                  value={`${practice.arrows.name} • ${getArrowMaterialLabel(practice.arrows.material, t)}`}
                />
              )}
            </View>
            {isCompetition &&
              (() => {
                const competitionData = practice as Competition;
                return competitionData.placement ? (
                  <View style={styles.statCardFull}>
                    <Text style={styles.customIcon}>🏆</Text>
                    <Text style={styles.statLabel}>{t['competitionForm.placement']}</Text>
                    <Text style={styles.statValue}>
                      {competitionData.placement}
                      {competitionData.numberOfParticipants
                        ? ` ${t['practiceDetails.placementOf']} ${competitionData.numberOfParticipants}`
                        : ''}
                    </Text>
                  </View>
                ) : null;
              })()}
            {isPractice &&
              (() => {
                const practiceData = practice as Practice;
                const arrowsWithoutScore = practiceData.ends?.reduce((sum, end) => sum + (end.arrowsWithoutScore || 0), 0) || 0;
                return arrowsWithoutScore > 0 ? (
                  <View style={styles.statCardFull}>
                    <Text style={styles.customIcon}>➳</Text>
                    <Text style={styles.statLabel}>{t['practiceDetails.unscoredTitle']}</Text>
                    <Text style={styles.statValue}>{`${arrowsWithoutScore} ${t['practiceDetails.unscoredCountSuffix']}`}</Text>
                  </View>
                ) : null;
              })()}
            {isCompetition &&
              (() => {
                const competitionData = practice as Competition;
                return competitionData.rounds && competitionData.rounds.length > 0 ? (
                  <View style={styles.roundsSection}>
                    <View style={styles.sectionTitle}>
                      <FontAwesomeIcon icon={faBullseye} size={20} color={colors.primary} />
                      <Text style={styles.sectionTitleText}>{t['practiceStep.rounds']}</Text>
                    </View>
                    <View style={styles.roundsList}>
                      {competitionData.rounds.map((round) => (
                        <RoundCard key={round.id} round={round} roundNumber={round.roundNumber} />
                      ))}
                    </View>
                  </View>
                ) : null;
              })()}
            {isPractice &&
              (() => {
                const practiceData = practice as Practice;
                return practiceData.ends && practiceData.ends.length > 0 ? (
                  <View style={styles.roundsSection}>
                    <View style={styles.sectionTitle}>
                      <FontAwesomeIcon icon={faBullseye} size={20} color={colors.primary} />
                      <Text style={styles.sectionTitleText}>{t['practiceStep.rounds']}</Text>
                    </View>
                    <View style={styles.roundsList}>
                      {practiceData.ends.map((end, idx) => (
                        <RoundCard key={end.id} end={end} roundNumber={idx + 1} />
                      ))}
                    </View>
                  </View>
                ) : null;
              })()}
            {practice.notes && (
              <View style={styles.notesSection}>
                <View style={styles.sectionTitle}>
                  <FontAwesomeIcon icon={faNoteSticky} size={20} color={colors.primary} />
                  <Text style={styles.sectionTitleText}>{t['form.notes']}</Text>
                </View>
                <View style={styles.notesContent}>
                  <Text style={styles.notesText}>{practice.notes}</Text>
                </View>
              </View>
            )}
          </View>
        </ScrollView>

        <View style={styles.actions}>
          {onEdit && <Button label={t['practiceDetails.edit']} onPress={onEdit} disabled={deleting} buttonStyle={styles.actionButton} />}
          <View style={styles.actionRow}>
            <Button
              size="small"
              label={t['practiceDetails.share']}
              onPress={handleShare}
              type="outline"
              disabled={deleting}
              icon={<FontAwesomeIcon icon={faShare} size={14} color={colors.primary} />}
              buttonStyle={styles.smallActionButton}
            />
            <Button
              size="small"
              label={t['practiceDetails.close']}
              onPress={onClose}
              type="outline"
              disabled={deleting}
              buttonStyle={styles.smallActionButton}
            />
          </View>
          <Button
            label={deleting ? t['practiceDetails.deleting'] : t['common.delete']}
            onPress={handleDelete}
            type="outline"
            size="small"
            variant="warning"
            disabled={deleting}
            icon={<FontAwesomeIcon icon={faTrash} size={16} color={colors.error} />}
            buttonStyle={styles.actionButton}
          />
        </View>
      </View>
    </ModalWrapper>
  );
}
