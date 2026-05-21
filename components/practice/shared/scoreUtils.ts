import { colors } from '@/styles/colors';
import { styles } from '../practiceForm/CreatePracticeFormStyles';
import type { TranslationKeys } from '@/lib/i18n';
import type { RoundInput } from '../practiceForm/CreatePracticeForm';

export function getChipColorStyle(score: number): any {
  if (score >= 9) return styles.arrowChipGold;
  if (score >= 7) return styles.arrowChipRed;
  if (score >= 5) return styles.arrowChipBlue;
  if (score >= 3) return styles.arrowChipBlack;
  if (score >= 1) return styles.arrowChipWhite;
  return styles.arrowChipMiss;
}

export function getChipTextColor(score: number): any {
  if (score >= 9 || (score >= 1 && score <= 2)) {
    return { color: colors.text };
  }
  return { color: colors.white };
}

export function getScoreButtonColorStyle(label: string): any {
  switch (label) {
    case 'X':
    case '10':
    case '9':
      return { button: styles.scoreButtonGold, text: { color: colors.text } };
    case '8':
    case '7':
      return { button: styles.scoreButtonRed, text: { color: colors.white } };
    case '6':
    case '5':
      return { button: styles.scoreButtonBlue, text: { color: colors.white } };
    case '4':
    case '3':
      return { button: styles.scoreButtonBlack, text: { color: colors.white } };
    case '2':
    case '1':
      return { button: styles.scoreButtonWhite, text: { color: colors.text } };
    case 'M':
      return { button: styles.scoreButtonMiss, text: { color: colors.textSecondary } };
    default:
      return { button: null, text: { color: colors.text } };
  }
}

export function getRoundSummary(round: RoundInput, t: TranslationKeys): string {
  const parts: string[] = [];
  if (round.distanceMeters) parts.push(`${round.distanceMeters}m`);
  if (round.distanceFrom || round.distanceTo) parts.push(`${round.distanceFrom ?? '?'}–${round.distanceTo ?? '?'}m`);
  if (round.targetType) parts.push(round.targetType);
  return parts.length > 0 ? parts.join(' · ') : t['round.noDetails'];
}
