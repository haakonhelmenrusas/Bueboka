import { hexToRgba } from './hexToRgba';

describe('hexToRgba', () => {
  it('converts white (#FFFFFF) at full opacity', () => {
    expect(hexToRgba('#FFFFFF', 1)).toBe('rgba(255, 255, 255, 1)');
  });

  it('converts black (#000000) at zero opacity', () => {
    expect(hexToRgba('#000000', 0)).toBe('rgba(0, 0, 0, 0)');
  });

  it('converts the primary project colour correctly', () => {
    // colors.primary = '#053546' → r=5, g=53, b=70
    expect(hexToRgba('#053546', 0.5)).toBe('rgba(5, 53, 70, 0.5)');
  });

  it('converts the secondary project colour correctly', () => {
    // colors.secondary = '#227B9A' → r=34, g=123, b=154
    expect(hexToRgba('#227B9A', 0.12)).toBe('rgba(34, 123, 154, 0.12)');
  });

  it('handles fractional alpha values', () => {
    expect(hexToRgba('#FFFFFF', 0.18)).toBe('rgba(255, 255, 255, 0.18)');
    expect(hexToRgba('#FFFFFF', 0.25)).toBe('rgba(255, 255, 255, 0.25)');
  });

  it('is case-insensitive for hex digits', () => {
    expect(hexToRgba('#ffffff', 1)).toBe('rgba(255, 255, 255, 1)');
    expect(hexToRgba('#FF0000', 1)).toBe('rgba(255, 0, 0, 1)');
  });
});
