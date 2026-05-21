import { Pressable, Text, View } from 'react-native';
import { Textarea } from '@/components/common';
import { useTranslation } from '@/contexts';
import { styles } from './CreatePracticeFormStyles';

interface ReflectionStepProps {
  rating: number | null;
  onRatingChange: (rating: number | null) => void;
  notes: string;
  onNotesChange: (notes: string) => void;
  error: string | null;
}

export function ReflectionStep({ rating, onRatingChange, notes, onNotesChange, error }: ReflectionStepProps) {
  const { t } = useTranslation();

  return (
    <View style={styles.stepContent}>
      <View style={styles.ratingSection}>
        <Text style={styles.ratingLabel}>{t['reflection.ratingLabel']}</Text>
        <Text style={styles.ratingHelpText}>{t['reflection.ratingPromptPractice']}</Text>
        <View style={styles.ratingButtons}>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => {
            const active = rating === num;
            return (
              <Pressable
                key={num}
                style={[styles.ratingButton, active && styles.ratingButtonActive]}
                onPress={() => onRatingChange(active ? null : num)}
                accessibilityLabel={`${t['reflection.ratingAriaPrefix']} ${num} ${t['scoring.of']} 10`}>
                <Text style={[styles.ratingButtonText, active && styles.ratingButtonTextActive]}>{num}</Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <Textarea
        label={t['form.notes']}
        optional
        value={notes}
        onChangeText={onNotesChange}
        placeholderText={t['reflection.notesPlaceholder']}
        maxLength={500}
        containerStyle={styles.inputContainer}
      />

      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}
