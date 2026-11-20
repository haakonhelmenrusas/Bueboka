import { colors } from '@/styles/colors';
import { styles } from '../practiceForm/CreatePracticeFormStyles';
import type { ScoringZone } from '@/types';
import type { TranslationKeys } from '@/lib/i18n';
import type { RoundInput } from '../practiceForm/CreatePracticeForm';

/**
 * Zone-based styles so score buttons and arrow chips follow the scoring scheme
 * resolved for the chosen category + target (see utils/helpers/scoringHelpers).
 */
export function getScoreButtonStyleForZone(zone: ScoringZone): { button: any; text: any } {
  switch (zone) {
    case 'gold':
      return { button: styles.scoreButtonGold, text: { color: colors.text } };
    case 'red':
      return { button: styles.scoreButtonRed, text: { color: colors.white } };
    case 'blue':
      return { button: styles.scoreButtonBlue, text: { color: colors.white } };
    case 'black':
      return { button: styles.scoreButtonBlack, text: { color: colors.white } };
    case 'white':
      return { button: styles.scoreButtonWhite, text: { color: colors.text } };
    case 'miss':
      return { button: styles.scoreButtonMiss, text: { color: colors.textSecondary } };
  }
}

export function getChipStyleForZone(zone: ScoringZone): any {
  switch (zone) {
    case 'gold':
      return styles.arrowChipGold;
    case 'red':
      return styles.arrowChipRed;
    case 'blue':
      return styles.arrowChipBlue;
    case 'black':
      return styles.arrowChipBlack;
    case 'white':
      return styles.arrowChipWhite;
    case 'miss':
      return styles.arrowChipMiss;
  }
}

export function getChipTextColorForZone(zone: ScoringZone): any {
  // Light zones (gold, white) need dark text; miss uses the secondary color
  if (zone === 'gold' || zone === 'white') return { color: colors.text };
  if (zone === 'miss') return { color: colors.textSecondary };
  return { color: colors.white };
}

export function getRoundSummary(round: RoundInput, t: TranslationKeys): string {
  const parts: string[] = [];
  if (round.distanceMeters) parts.push(`${round.distanceMeters}m`);
  if (round.distanceFrom || round.distanceTo) parts.push(`${round.distanceFrom ?? '?'}–${round.distanceTo ?? '?'}m`);
  if (round.targetType) parts.push(round.targetType);
  return parts.length > 0 ? parts.join(' · ') : t['round.noDetails'];
}
