import { Pressable, Text, View } from 'react-native';
import { useTranslation } from '@/contexts';
import { getChipColorStyle, getChipTextColor } from '@/components/practice/shared/scoreUtils';
import { styles } from './CreatePracticeFormStyles';

interface ArrowChipsProps {
  arrowsInThisEnd: number;
  startIdx: number;
  scores: number[];
  editingIdx: number | null;
  onChipPress: (absoluteIndex: number) => void;
}

export function ArrowChips({ arrowsInThisEnd, startIdx, scores, editingIdx, onChipPress }: ArrowChipsProps) {
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
              scored ? [styles.arrowChipFilled, getChipColorStyle(scores[i])] : styles.arrowChipEmpty,
            ]}
            onPress={scored ? () => onChipPress(isThisChipEditing ? -1 : absIdx) : undefined}
            accessibilityLabel={scored ? `${t['scoring.editArrowAriaPrefix']} ${i + 1}: ${scores[i]} ${t['scoring.points']}` : undefined}>
            <Text
              style={[styles.arrowChipText, styles.arrowChipTextLarge, scored ? getChipTextColor(scores[i]) : styles.arrowChipTextEmpty]}>
              {scored ? String(scores[i]) : '–'}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
