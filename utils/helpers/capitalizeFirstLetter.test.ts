import { capitalizeFirstLetter } from '@/utils';

describe('capitalizeFirstLetter', () => {
  it('capitalizes the first letter of a lowercase word', async () => {
    expect(capitalizeFirstLetter('word')).toBe('Word');
  });

  it('capitalizes the first letter of an uppercase word', async () => {
    expect(capitalizeFirstLetter('Word')).toBe('Word');
  });

  it('returns an empty string when input is an empty string', async () => {
    expect(capitalizeFirstLetter('')).toBe('');
  });

  it('capitalizes the first letter of a single character', async () => {
    expect(capitalizeFirstLetter('a')).toBe('A');
  });

  it('capitalizes the first letter and keeps the rest of the string unchanged', async () => {
    expect(capitalizeFirstLetter('hello world')).toBe('Hello world');
  });

  it('handles strings with special characters correctly', async () => {
    expect(capitalizeFirstLetter('!hello')).toBe('!hello');
  });
});
