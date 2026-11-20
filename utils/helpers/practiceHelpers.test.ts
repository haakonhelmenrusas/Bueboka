import { buildEndData } from './practiceHelpers';

describe('buildEndData', () => {
  it('derives numberArrows from the scores array when the field is empty (warm-up + scored arrows in one round)', () => {
    const scores = Array(72).fill(9);
    const [end] = buildEndData([{ roundScore: 648, scores, arrowsWithoutScore: 14 }]);

    expect(end.numberArrows).toBe(72);
    expect(end.arrowsWithoutScore).toBe(14);
    expect(end.scores).toHaveLength(72);
  });

  it('prefers the score count over a mismatched manual numberArrows', () => {
    const [end] = buildEndData([{ roundScore: 90, numberArrows: 86, scores: Array(72).fill(1), arrowsWithoutScore: 14 }]);
    expect(end.numberArrows).toBe(72);
  });

  it('keeps a manual numberArrows when no scores were entered', () => {
    const [end] = buildEndData([{ roundScore: 0, numberArrows: 6 }]);
    expect(end.numberArrows).toBe(6);
    expect(end.scores).toBeUndefined();
  });

  it('omits numberArrows when neither field nor scores are set', () => {
    const [end] = buildEndData([{ roundScore: 0, arrowsWithoutScore: 14 }]);
    expect(end.numberArrows).toBeUndefined();
    expect(end.arrowsWithoutScore).toBe(14);
  });
});
