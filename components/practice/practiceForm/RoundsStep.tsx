import { Text, TouchableOpacity, View } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons/faPlus';
import { useTranslation } from '@/contexts';
import { PracticeCategory } from '@/types';
import { colors } from '@/styles/colors';
import { styles } from './CreatePracticeFormStyles';
import { RoundCard } from './RoundCard';
import type { RoundInput } from './CreatePracticeForm';

interface RoundsStepProps {
  rounds: RoundInput[];
  practiceCategory: PracticeCategory;
  onAddRound: () => void;
  onRemoveRound: (index: number) => void;
  onUpdateRound: <K extends keyof RoundInput>(index: number, field: K, value: RoundInput[K]) => void;
  onOpenScoring: (roundIndex: number) => void;
}

export function RoundsStep({ rounds, practiceCategory, onAddRound, onRemoveRound, onUpdateRound, onOpenScoring }: RoundsStepProps) {
  const { t } = useTranslation();

  return (
    <View style={styles.stepContent}>
      <View style={styles.roundsSection}>
        {rounds.map((round, index) => (
          <RoundCard
            key={index}
            round={round}
            roundIndex={index}
            roundCount={rounds.length}
            practiceCategory={practiceCategory}
            onRemoveRound={() => onRemoveRound(index)}
            onUpdateRound={(field, value) => onUpdateRound(index, field, value)}
            onOpenScoring={() => onOpenScoring(index)}
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
