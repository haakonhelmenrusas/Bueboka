import { formatNumber } from '@/utils/helpers/formatNumber';

describe('formatNumber', () => {
  it('replaces comma with dot in a number string', () => {
    expect(formatNumber('1,23')).toBe('1.23');
  });

  it('returns the same string if there is no comma', () => {
    expect(formatNumber('123')).toBe('123');
  });

  it('returns an empty string when input is an empty string', () => {
    expect(formatNumber('')).toBe('');
  });

  it('handles strings with no numeric characters', () => {
    expect(formatNumber('abc,def')).toBe('abc.def');
  });

  it('handles strings with special characters', () => {
    expect(formatNumber('1,23!')).toBe('1.23!');
  });
});
