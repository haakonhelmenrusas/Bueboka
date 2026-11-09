import { PracticeCategory } from '@/types';
import { getZoneForScore, resolveScoringScheme } from './scoringHelpers';

describe('resolveScoringScheme', () => {
  describe('WA 10-ring targets (skive inne/ute)', () => {
    it('returns the 10-ring scheme with X for outdoor target shooting', () => {
      const scheme = resolveScoringScheme(PracticeCategory.SKIVE_OUTDOOR, '80cm');
      expect(scheme.id).toBe('WA_10_RING');
      expect(scheme.options.map((o) => o.label)).toEqual(['X', '10', '9', '8', '7', '6', '5', '4', '3', '2', '1', 'M']);
      expect(scheme.options.map((o) => o.value)).toEqual([10, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0]);
    });

    it('omits X for indoor target shooting (WA indoor has no X-ring in play)', () => {
      const scheme = resolveScoringScheme(PracticeCategory.SKIVE_INDOOR, '40cm');
      expect(scheme.id).toBe('WA_10_RING');
      expect(scheme.options.map((o) => o.label)).toEqual(['10', '9', '8', '7', '6', '5', '4', '3', '2', '1', 'M']);
    });

    it('defaults to the 10-ring scheme without X when no target is chosen indoors', () => {
      const scheme = resolveScoringScheme(PracticeCategory.SKIVE_INDOOR, '');
      expect(scheme.id).toBe('WA_10_RING');
      expect(scheme.options.some((o) => o.label === 'X')).toBe(false);
    });

    it('uses the 10-ring scheme for triple/Vegas faces outdoors', () => {
      const scheme = resolveScoringScheme(PracticeCategory.SKIVE_OUTDOOR, '40cm-trippel-vegas');
      expect(scheme.id).toBe('WA_10_RING');
      expect(scheme.options[0].label).toBe('X');
      expect(scheme.options).toHaveLength(12);
    });

    it('uses the 10-ring scheme for 60cm, 122cm, historical and "other" faces', () => {
      for (const targetType of ['60cm', '60cm-trippel', '122cm', 'historisk-nl-inne', 'other']) {
        const scheme = resolveScoringScheme(PracticeCategory.SKIVE_OUTDOOR, targetType);
        expect(scheme.id).toBe('WA_10_RING');
        expect(scheme.options).toHaveLength(12);
      }
    });
  });

  describe('6-ring centre (80cm-centre-6)', () => {
    it('returns only X, 10-6 and M', () => {
      const scheme = resolveScoringScheme(PracticeCategory.SKIVE_OUTDOOR, '80cm-centre-6');
      expect(scheme.id).toBe('WA_6_RING');
      expect(scheme.options.map((o) => o.label)).toEqual(['X', '10', '9', '8', '7', '6', 'M']);
      expect(scheme.options.map((o) => o.value)).toEqual([10, 10, 9, 8, 7, 6, 0]);
    });
  });

  describe('field (felt)', () => {
    it('returns the field scheme 6-1 + M for the FELT category without a target chosen', () => {
      const scheme = resolveScoringScheme(PracticeCategory.FELT, '');
      expect(scheme.id).toBe('FIELD');
      expect(scheme.options.map((o) => o.label)).toEqual(['6', '5', '4', '3', '2', '1', 'M']);
      expect(scheme.options.map((o) => o.value)).toEqual([6, 5, 4, 3, 2, 1, 0]);
    });

    it('returns the field scheme for felt-* targets even in a skive category', () => {
      const scheme = resolveScoringScheme(PracticeCategory.SKIVE_OUTDOOR, 'felt-40');
      expect(scheme.id).toBe('FIELD');
      expect(scheme.options.some((o) => o.label === 'X')).toBe(false);
      expect(scheme.options.some((o) => o.value > 6)).toBe(false);
    });
  });

  describe('3D (jakt)', () => {
    it('returns the 3D scheme 11/10/8/5 + M for the JAKT_3D category', () => {
      const scheme = resolveScoringScheme(PracticeCategory.JAKT_3D, '');
      expect(scheme.id).toBe('THREE_D');
      expect(scheme.options.map((o) => o.label)).toEqual(['11', '10', '8', '5', 'M']);
      expect(scheme.options.map((o) => o.value)).toEqual([11, 10, 8, 5, 0]);
    });
  });

  describe('bare mat without face', () => {
    it('returns the NONE scheme (no scoring) for the "bar" target', () => {
      const scheme = resolveScoringScheme(PracticeCategory.SKIVE_INDOOR, 'bar');
      expect(scheme.id).toBe('NONE');
      expect(scheme.options).toHaveLength(0);
    });
  });
});

describe('getZoneForScore', () => {
  const tenRing = resolveScoringScheme(PracticeCategory.SKIVE_OUTDOOR, '80cm');
  const field = resolveScoringScheme(PracticeCategory.FELT, '');
  const threeD = resolveScoringScheme(PracticeCategory.JAKT_3D, '');

  it('maps 10-ring values to face colors', () => {
    expect(getZoneForScore(tenRing, 10)).toBe('gold');
    expect(getZoneForScore(tenRing, 9)).toBe('gold');
    expect(getZoneForScore(tenRing, 8)).toBe('red');
    expect(getZoneForScore(tenRing, 6)).toBe('blue');
    expect(getZoneForScore(tenRing, 4)).toBe('black');
    expect(getZoneForScore(tenRing, 2)).toBe('white');
    expect(getZoneForScore(tenRing, 0)).toBe('miss');
  });

  it('maps field values: yellow 5-6, black 1-4', () => {
    expect(getZoneForScore(field, 6)).toBe('gold');
    expect(getZoneForScore(field, 5)).toBe('gold');
    expect(getZoneForScore(field, 4)).toBe('black');
    expect(getZoneForScore(field, 1)).toBe('black');
    expect(getZoneForScore(field, 0)).toBe('miss');
  });

  it('maps 3D values to zones', () => {
    expect(getZoneForScore(threeD, 11)).toBe('gold');
    expect(getZoneForScore(threeD, 10)).toBe('red');
    expect(getZoneForScore(threeD, 8)).toBe('blue');
    expect(getZoneForScore(threeD, 5)).toBe('black');
    expect(getZoneForScore(threeD, 0)).toBe('miss');
  });

  it('falls back to ring thresholds for scores not in the scheme (legacy data)', () => {
    // e.g. a stored 10 on a field target from before the scheme existed
    expect(getZoneForScore(field, 10)).toBe('gold');
    expect(getZoneForScore(field, 7)).toBe('red');
  });
});
