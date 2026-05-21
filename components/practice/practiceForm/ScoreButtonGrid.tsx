import { Pressable, Text, View } from 'react-native';
import { Environment } from '@/types';
import { ARROW_SCORE_OPTIONS } from '@/components/practice/shared/formConstants';
import { getScoreButtonColorStyle } from '@/components/practice/shared/scoreUtils';
import { styles } from './CreatePracticeFormStyles';

interface ScoreButtonGridProps {
  environment: Environment;
  onScorePress: (score: number) => void;
}

export function ScoreButtonGrid({ environment, onScorePress }: ScoreButtonGridProps) {
  return (
    <View style={styles.scoreButtonsGrid}>
      {ARROW_SCORE_OPTIONS.filter((opt) => opt.label !== 'X' || environment === Environment.OUTDOOR).map((opt) => {
        const { button: buttonStyle, text: textStyle } = getScoreButtonColorStyle(opt.label);
        return (
          <Pressable key={opt.label} style={[styles.scoreButton, buttonStyle]} onPress={() => onScorePress(opt.value)}>
            <Text style={[styles.scoreButtonText, textStyle]}>{opt.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}
