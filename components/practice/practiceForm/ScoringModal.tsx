import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons/faChevronLeft';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons/faChevronRight';
import { faXmark } from '@fortawesome/free-solid-svg-icons/faXmark';
import { faInfo } from '@fortawesome/free-solid-svg-icons/faInfo';
import { Button, ModalWrapper } from '@/components/common';
import { useTranslation } from '@/contexts';
import { Environment } from '@/types';
import { DEFAULT_ARROWS_PER_END } from '@/components/practice/shared/formConstants';
import { colors } from '@/styles/colors';
import { styles } from './CreatePracticeFormStyles';
import { ArrowChips } from './ArrowChips';
import { ScoreButtonGrid } from './ScoreButtonGrid';
import type { RoundInput } from './CreatePracticeForm';

interface ScoringModalProps {
  visible: boolean;
  round: RoundInput;
  roundIndex: number;
  environment: Environment;
  endPage: number;
  editingIndex: number | null;
  onClose: () => void;
  onSetEndPage: (page: number) => void;
  onSetEditingIndex: (idx: number | null) => void;
  onAddArrowScore: (score: number) => void;
  onUpdateArrowScore: (arrowIndex: number, score: number) => void;
}

export function ScoringModal({
  visible,
  round,
  roundIndex,
  environment,
  endPage,
  editingIndex,
  onClose,
  onSetEndPage,
  onSetEditingIndex,
  onAddArrowScore,
  onUpdateArrowScore,
}: ScoringModalProps) {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();

  const maxArrows = round.numberArrows ?? 0;
  const hasManualScore = round.roundScore > 0 && (round.scores ?? []).length === 0;

  if (maxArrows === 0 && !hasManualScore) return null;

  const currentScores = round.scores ?? [];
  const filledCount = currentScores.length;
  const total = currentScores.reduce((a, b) => a + b, 0);
  const isFull = filledCount >= maxArrows;

  const arrowsPerEnd = round.arrowsPerEnd ?? DEFAULT_ARROWS_PER_END;
  const totalEnds = Math.ceil(maxArrows / arrowsPerEnd);
  const activeEndPage = isFull ? totalEnds - 1 : Math.floor(filledCount / arrowsPerEnd);
  const currentEndPage = Math.min(endPage ?? activeEndPage, activeEndPage);

  const startIdx = currentEndPage * arrowsPerEnd;
  const endIdx = Math.min(startIdx + arrowsPerEnd, maxArrows);
  const arrowsInThisEnd = endIdx - startIdx;
  const endScores = currentScores.slice(startIdx, endIdx);

  const isActiveEnd = !isFull && currentEndPage === activeEndPage;
  const isEndFilled = endScores.length >= arrowsInThisEnd;

  const canGoPrev = currentEndPage > 0;
  const canGoNext = currentEndPage < activeEndPage;

  const editingIdx = editingIndex ?? null;
  const isEditingArrow = editingIdx !== null;
  const showScoreButtons = (isActiveEnd && !isEndFilled) || isEditingArrow;

  return (
    <ModalWrapper visible={visible} onClose={onClose} fullScreen>
      <View style={[styles.safeArea, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
        <View style={scoringModalStyles.header}>
          <Text style={scoringModalStyles.headerTitle}>{`${t['scoring.arrowScoring']} — ${t['round.title']} ${roundIndex + 1}`}</Text>
          <TouchableOpacity style={scoringModalStyles.closeBtn} onPress={onClose}>
            <FontAwesomeIcon icon={faXmark} size={20} color={colors.text} />
          </TouchableOpacity>
        </View>

        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={scoringModalStyles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          {hasManualScore ? (
            <View style={styles.manualScoreNotice}>
              <FontAwesomeIcon icon={faInfo} size={16} color={colors.info} style={styles.manualScoreNoticeIcon} />
              <View style={styles.manualScoreNoticeBody}>
                <Text style={styles.manualScoreNoticeMain}>
                  {`${t['scoring.totalScoreLabel']} ${round.roundScore} ${t['scoring.points']}`}
                </Text>
                <Text style={styles.manualScoreNoticeHint}>{t['scoring.manualScoreHint']}</Text>
              </View>
            </View>
          ) : (
            <View style={{ gap: 16 }}>
              {totalEnds > 1 && (
                <View style={styles.endNav}>
                  <TouchableOpacity
                    style={[styles.endNavBtn, !canGoPrev && styles.endNavBtnDisabled]}
                    onPress={() => onSetEndPage(currentEndPage - 1)}
                    disabled={!canGoPrev}
                    accessibilityLabel={t['scoring.previousEnd']}>
                    <FontAwesomeIcon icon={faChevronLeft} size={18} color={canGoPrev ? colors.primary : colors.textSecondary} />
                  </TouchableOpacity>
                  <Text style={styles.endNavLabel}>{`${t['scoring.endLabel']} ${currentEndPage + 1} / ${totalEnds}`}</Text>
                  <TouchableOpacity
                    style={[styles.endNavBtn, !canGoNext && styles.endNavBtnDisabled]}
                    onPress={() => onSetEndPage(currentEndPage + 1)}
                    disabled={!canGoNext}
                    accessibilityLabel={t['scoring.nextEnd']}>
                    <FontAwesomeIcon icon={faChevronRight} size={18} color={canGoNext ? colors.primary : colors.textSecondary} />
                  </TouchableOpacity>
                </View>
              )}

              <ArrowChips
                arrowsInThisEnd={arrowsInThisEnd}
                startIdx={startIdx}
                scores={endScores}
                editingIdx={editingIdx}
                onChipPress={(absIdx) => onSetEditingIndex(absIdx === -1 ? null : absIdx)}
              />

              <View style={styles.scoringProgress}>
                <Text style={styles.scoringProgressText}>
                  {`${filledCount} ${t['scoring.of']} ${maxArrows} ${t['scoring.arrowsRecorded']}`}
                </Text>
                {filledCount > 0 && <Text style={styles.scoringTotal}>{`${t['scoring.sum']} ${total}`}</Text>}
              </View>

              {showScoreButtons && (
                <>
                  {isEditingArrow && (
                    <Text style={styles.editingHint}>{`${t['scoring.editingArrowPrefix']} ${(editingIdx! % arrowsPerEnd) + 1}`}</Text>
                  )}
                  <ScoreButtonGrid
                    environment={environment}
                    onScorePress={(score) => {
                      if (isEditingArrow) {
                        onUpdateArrowScore(editingIdx!, score);
                        onSetEditingIndex(null);
                      } else {
                        onAddArrowScore(score);
                      }
                    }}
                  />
                </>
              )}

              {isFull && !isEditingArrow && currentEndPage === totalEnds - 1 && (
                <View style={styles.scoringComplete}>
                  <Text style={styles.scoringCompleteText}>{`${t['scoring.allRegistered']} ${t['scoring.scoreSuffix']} ${total}`}</Text>
                </View>
              )}

              {!isFull && isEndFilled && !isActiveEnd && !isEditingArrow && canGoNext && (
                <Button label={t['scoring.nextEnd']} onPress={() => onSetEndPage(currentEndPage + 1)} buttonStyle={{ width: '100%' }} />
              )}
            </View>
          )}
        </ScrollView>

        <View style={scoringModalStyles.footer}>
          <Button label={t['scoring.done']} onPress={onClose} />
        </View>
      </View>
    </ModalWrapper>
  );
}

const scoringModalStyles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: colors.primary,
  },
  closeBtn: {
    padding: 8,
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  footer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.white,
  },
});
