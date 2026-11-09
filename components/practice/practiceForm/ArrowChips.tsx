import { Pressable, Text, View } from 'react-native';
import { useTranslation } from '@/contexts';
import type { ScoringScheme } from '@/types';
import { getZoneForScore } from '@/utils/helpers/scoringHelpers';
import { getChipStyleForZone, getChipTextColorForZone } from '@/components/practice/shared/scoreUtils';
import { styles } from './CreatePracticeFormStyles';

interface ArrowChipsProps {
  arrowsInThisEnd: number;
  startIdx: number;
  scores: number[];
  scheme: ScoringScheme;
  editingIdx: number | null;
  onChipPress: (absoluteIndex: number) => void;
}

export function ArrowChips({ arrowsInThisEnd, startIdx, scores, scheme, editingIdx, onChipPress }: ArrowChipsProps) {
  const { t } = useTranslation();

  return (
    <View style={[styles.arrowChipsRow, arrowsInThisEnd <= 6 && { flexWrap: 'nowrap' }]}>
      {Array.from({ length: arrowsInThisEnd }).map((_, i) => {
        const absIdx = startIdx + i;
        const scored = scores[i] !== undefined;
        const isThisChipEditing = editingIdx === absIdx;

        return (
          <Pressable
            key={i}
            style={[
              styles.arrowChip,
              styles.arrowChipLarge,
              isThisChipEditing && styles.arrowChipEditing,
              scored ? [styles.arrowChipFilled, getChipStyleForZone(getZoneForScore(scheme, scores[i]))] : styles.arrowChipEmpty,
            ]}
            onPress={scored ? () => onChipPress(isThisChipEditing ? -1 : absIdx) : undefined}
            accessibilityLabel={scored ? `${t['scoring.editArrowAriaPrefix']} ${i + 1}: ${scores[i]} ${t['scoring.points']}` : undefined}>
            <Text
              style={[
                styles.arrowChipText,
                styles.arrowChipTextLarge,
                scored ? getChipTextColorForZone(getZoneForScore(scheme, scores[i])) : styles.arrowChipTextEmpty,
              ]}>
              {scored ? String(scores[i]) : '–'}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
