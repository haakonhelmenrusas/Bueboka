/**
 * Convert a project colour token (6-digit hex) and an opacity value into a
 * CSS-compatible `rgba(r, g, b, alpha)` string.
 *
 * @example
 * hexToRgba(colors.white, 0.5)  // "rgba(255, 255, 255, 0.5)"
 */
export function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
