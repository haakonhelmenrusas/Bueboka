import { Text, TouchableOpacity, View } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons/faXmark';
import { Input, Select, Button } from '@/components/common';
import { useTranslation } from '@/contexts';
import { PracticeCategory } from '@/types';
import { getTargetTypeOptions } from '@/utils/Constants';
import { isRangeCategory, parseNum } from '@/components/practice/shared/formHelpers';
import { colors } from '@/styles/colors';
import { styles } from './CreatePracticeFormStyles';
import type { RoundInput } from './CreatePracticeForm';

interface RoundCardProps {
  round: RoundInput;
  roundIndex: number;
  roundCount: number;
  practiceCategory: PracticeCategory;
  onRemoveRound: () => void;
  onUpdateRound: <K extends keyof RoundInput>(field: K, value: RoundInput[K]) => void;
  onOpenScoring: () => void;
}

export function RoundCard({
  round,
  roundIndex,
  roundCount,
  practiceCategory,
  onRemoveRound,
  onUpdateRound,
  onOpenScoring,
}: RoundCardProps) {
  const { t } = useTranslation();
  const rangeMode = isRangeCategory(practiceCategory);
  const TARGET_TYPE_OPTIONS = getTargetTypeOptions(t);

  const maxArrows = round.numberArrows ?? 0;
  const currentScores = round.scores ?? [];
  const filledCount = currentScores.length;
  const isFull = maxArrows > 0 && filledCount >= maxArrows;
  const hasPartialScores = filledCount > 0 && !isFull;
  const hasManualScore = round.roundScore > 0 && filledCount === 0;
  const showScoreButton = maxArrows > 0 && !hasManualScore;

  const scoreButtonLabel = isFull ? t['scoring.editScores'] : hasPartialScores ? t['scoring.continueScoring'] : t['scoring.scoreNow'];

  const total = currentScores.reduce((a, b) => a + b, 0);

  return (
    <View style={styles.roundCard}>
      <View style={styles.roundHeader}>
        <Text style={styles.roundNumber}>{`${t['round.title']} ${roundIndex + 1}`}</Text>
        {roundCount > 1 && (
          <TouchableOpacity style={styles.removeRoundBtn} onPress={onRemoveRound} accessibilityLabel={t['round.remove']}>
            <FontAwesomeIcon icon={faXmark} size={16} color={colors.textSecondary} />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.roundFields}>
        {rangeMode ? (
          <>
            <Input
              label={t['form.distanceFrom']}
              value={round.distanceFrom !== undefined ? String(round.distanceFrom) : ''}
              onChangeText={(v) => onUpdateRound('distanceFrom', parseNum(v))}
              keyboardType="numeric"
              containerStyle={styles.roundField}
            />
            <Input
              label={t['form.distanceTo']}
              value={round.distanceTo !== undefined ? String(round.distanceTo) : ''}
              onChangeText={(v) => onUpdateRound('distanceTo', parseNum(v))}
              keyboardType="numeric"
              containerStyle={styles.roundField}
            />
          </>
        ) : (
          <>
            <Input
              label={t['form.distance']}
              value={round.distanceMeters !== undefined ? String(round.distanceMeters) : ''}
              onChangeText={(v) => onUpdateRound('distanceMeters', parseNum(v))}
              keyboardType="numeric"
              containerStyle={styles.roundField}
            />
            <Select
              label={t['form.target']}
              options={TARGET_TYPE_OPTIONS}
              selectedValue={round.targetType}
              onValueChange={(v) => onUpdateRound('targetType', v as string)}
              placeholder={t['form.choose']}
              searchable
              containerStyle={styles.roundField}
            />
          </>
        )}
      </View>

      <View style={styles.roundFields}>
        <Input
          label={t['form.arrowsWithScore']}
          optional
          value={round.numberArrows !== undefined ? String(round.numberArrows) : ''}
          onChangeText={(v) => onUpdateRound('numberArrows', parseNum(v))}
          keyboardType="numeric"
          containerStyle={styles.roundField}
        />
        <Input
          label={t['form.arrowsPerEnd']}
          optional
          value={round.arrowsPerEnd !== undefined ? String(round.arrowsPerEnd) : ''}
          onChangeText={(v) => onUpdateRound('arrowsPerEnd', parseNum(v))}
          keyboardType="numeric"
          containerStyle={styles.roundField}
        />
      </View>

      <View style={styles.roundFields}>
        <Input
          label={t['form.score']}
          optional
          value={round.roundScore !== 0 ? String(round.roundScore) : ''}
          onChangeText={(v) => onUpdateRound('roundScore', parseNum(v) ?? 0)}
          keyboardType="numeric"
          containerStyle={styles.roundField}
        />
        <Input
          label={t['form.arrowsWithoutScore']}
          optional
          value={round.arrowsWithoutScore !== undefined ? String(round.arrowsWithoutScore) : ''}
          onChangeText={(v) => onUpdateRound('arrowsWithoutScore', parseNum(v))}
          keyboardType="numeric"
          containerStyle={styles.roundField}
        />
      </View>

      {showScoreButton && (
        <View style={{ marginTop: 8 }}>
          {filledCount > 0 && (
            <Text style={styles.scoringProgressText}>
              {isFull
                ? `${t['scoring.allRegistered']} ${t['scoring.scoreSuffix']} ${total}`
                : `${filledCount}/${maxArrows} ${t['scoring.arrowsRecorded']} · ${t['scoring.sum']} ${total}`}
            </Text>
          )}
          <Button
            label={scoreButtonLabel}
            onPress={onOpenScoring}
            type={filledCount > 0 ? 'outline' : 'filled'}
            buttonStyle={{ marginTop: 6 }}
          />
        </View>
      )}
    </View>
  );
}
