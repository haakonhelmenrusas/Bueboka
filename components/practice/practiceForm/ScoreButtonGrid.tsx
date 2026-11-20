import { Pressable, Text, View } from 'react-native';
import type { ScoringOption } from '@/types';
import { getScoreButtonStyleForZone } from '@/components/practice/shared/scoreUtils';
import { styles } from './CreatePracticeFormStyles';

interface ScoreButtonGridProps {
  options: ScoringOption[];
  onScorePress: (score: number) => void;
}

export function ScoreButtonGrid({ options, onScorePress }: ScoreButtonGridProps) {
  return (
    <View style={styles.scoreButtonsGrid}>
      {options.map((opt) => {
        const { button: buttonStyle, text: textStyle } = getScoreButtonStyleForZone(opt.zone);
        return (
          <Pressable
            key={opt.label}
            testID={`score-button-${opt.label}`}
            style={[styles.scoreButton, buttonStyle]}
            onPress={() => onScorePress(opt.value)}>
            <Text style={[styles.scoreButtonText, textStyle]}>{opt.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}
