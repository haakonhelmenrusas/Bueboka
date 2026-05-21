import { Pressable, Text, TouchableOpacity, View } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons/faPlus';
import { Button } from '@/components/common';
import { useTranslation } from '@/contexts';
import { Environment, PracticeCategory } from '@/types';
import { colors } from '@/styles/colors';
import { styles } from './CreatePracticeFormStyles';
import { RoundCard } from './RoundCard';
import type { RoundInput } from './CreatePracticeForm';

interface RoundsStepProps {
  rounds: RoundInput[];
  practiceCategory: PracticeCategory;
  environment: Environment;
  scoringMethod: 'buttons' | 'target';
  isEditing: boolean;
  submitting: boolean;
  endPages: Record<number, number>;
  editingIndices: Record<number, number | null>;
  expandedScoring: Record<number, boolean>;
  onScoringMethodChange: (method: 'buttons' | 'target') => void;
  onStartShooting: () => void;
  onAddRound: () => void;
  onRemoveRound: (index: number) => void;
  onUpdateRound: <K extends keyof RoundInput>(index: number, field: K, value: RoundInput[K]) => void;
  onSetEndPage: (roundIndex: number, page: number) => void;
  onSetEditingIndex: (roundIndex: number, idx: number | null) => void;
  onAddArrowScore: (roundIndex: number, score: number) => void;
  onUpdateArrowScore: (roundIndex: number, arrowIndex: number, score: number) => void;
  onToggleScoringExpanded: (roundIndex: number) => void;
}

export function RoundsStep({
  rounds,
  practiceCategory,
  environment,
  scoringMethod,
  isEditing,
  submitting,
  endPages,
  editingIndices,
  expandedScoring,
  onScoringMethodChange,
  onStartShooting,
  onAddRound,
  onRemoveRound,
  onUpdateRound,
  onSetEndPage,
  onSetEditingIndex,
  onAddArrowScore,
  onUpdateArrowScore,
  onToggleScoringExpanded,
}: RoundsStepProps) {
  const { t } = useTranslation();

  return (
    <View style={styles.stepContent}>
      {/* Scoring method selection */}
      <View style={styles.scoringMethodSection}>
        <Text style={styles.sectionTitle}>{t['scoring.methodSection']}</Text>
        <View style={styles.scoringMethodButtons}>
          <Pressable
            style={[styles.scoringMethodButton, scoringMethod === 'buttons' && styles.scoringMethodButtonActive]}
            onPress={() => onScoringMethodChange('buttons')}>
            <Text style={[styles.scoringMethodButtonText, scoringMethod === 'buttons' && styles.scoringMethodButtonTextActive]}>
              {t['scoring.methodButtons']}
            </Text>
          </Pressable>
          <Pressable
            style={[styles.scoringMethodButton, scoringMethod === 'target' && styles.scoringMethodButtonActive]}
            onPress={() => onScoringMethodChange('target')}>
            <Text style={[styles.scoringMethodButtonText, scoringMethod === 'target' && styles.scoringMethodButtonTextActive]}>
              {t['scoring.methodTarget']}
            </Text>
          </Pressable>
        </View>
      </View>

      {!isEditing && scoringMethod === 'target' && (
        <View style={styles.startShootingSection}>
          <Button label={t['scoring.startShooting']} onPress={onStartShooting} disabled={submitting} loading={submitting} />
        </View>
      )}

      <View style={styles.roundsSection}>
        {rounds.map((round, index) => (
          <RoundCard
            key={index}
            round={round}
            roundIndex={index}
            roundCount={rounds.length}
            practiceCategory={practiceCategory}
            environment={environment}
            endPage={endPages[index] ?? 0}
            editingIndex={editingIndices[index] ?? null}
            scoringExpanded={expandedScoring[index] ?? false}
            scoringMethod={scoringMethod}
            onToggleScoringExpanded={() => onToggleScoringExpanded(index)}
            onRemoveRound={() => onRemoveRound(index)}
            onUpdateRound={(field, value) => onUpdateRound(index, field, value)}
            onSetEndPage={(page) => onSetEndPage(index, page)}
            onSetEditingIndex={(idx) => onSetEditingIndex(index, idx)}
            onAddArrowScore={(score) => onAddArrowScore(index, score)}
            onUpdateArrowScore={(arrowIndex, score) => onUpdateArrowScore(index, arrowIndex, score)}
          />
        ))}

        <TouchableOpacity
          style={[styles.addRoundBtn, rounds.length >= 20 && { opacity: 0.4 }]}
          onPress={onAddRound}
          disabled={rounds.length >= 20}>
          <FontAwesomeIcon icon={faPlus} size={14} color={colors.primary} />
          <Text style={styles.addRoundBtnText}>{t['round.add']}</Text>
        </TouchableOpacity>
        {rounds.length >= 20 && <Text style={styles.limitMessage}>{t['round.maxLimit']}</Text>}
      </View>
    </View>
  );
}
