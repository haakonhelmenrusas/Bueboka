import { checkDecimalCount } from '@/utils/helpers/checkDecimalCount';

describe('checkDecimalCount', () => {
  it('returns true when the number of decimals is less than maxDecimals', () => {
    expect(checkDecimalCount('123.45', 3)).toBe(true);
  });

  it('returns false when the number of decimals is greater than maxDecimals', () => {
    expect(checkDecimalCount('123.4567', 3)).toBe(false);
  });

  it('returns true when there are no decimals', () => {
    expect(checkDecimalCount('123', 3)).toBe(true);
  });

  it('returns true when the input is an empty string', () => {
    expect(checkDecimalCount('', 3)).toBe(true);
  });

  it('returns true when the input is a string with only a dot', () => {
    expect(checkDecimalCount('.', 3)).toBe(true);
  });

  it('returns true when the input is a string with a dot and no decimals', () => {
    expect(checkDecimalCount('123.', 3)).toBe(true);
  });

  it('returns false when maxDecimals is zero and there are decimals', () => {
    expect(checkDecimalCount('123.4', 0)).toBe(false);
  });
});
