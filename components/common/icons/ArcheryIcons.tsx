import Svg, { Line, Path, Polyline } from 'react-native-svg';
import { colors } from '@/styles/colors';

/**
 * Archery icons — 24px stroke style matching the rest of the app.
 *
 * Sources (inlined, no runtime dependency):
 * - BowIcon:   lucide "bow-arrow"  (ISC)  https://lucide.dev/icons/bow-arrow
 * - ArrowIcon: tabler "archery-arrow" (MIT) https://tabler.io/icons/icon/archery-arrow
 */

interface ArcheryIconProps {
  size?: number;
  color?: string;
}

const strokeProps = (color: string) =>
  ({
    stroke: color,
    strokeWidth: 2,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    fill: 'none',
  }) as const;

export function BowIcon({ size = 20, color = colors.white }: ArcheryIconProps) {
  const s = strokeProps(color);
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path d="M17 3h4v4" {...s} />
      <Path d="M18.575 11.082a13 13 0 0 1 1.048 9.027 1.17 1.17 0 0 1-1.914.597L14 17" {...s} />
      <Path d="M7 10 3.29 6.29a1.17 1.17 0 0 1 .6-1.91 13 13 0 0 1 9.03 1.05" {...s} />
      <Path
        d="M7 14a1.7 1.7 0 0 0-1.207.5l-2.646 2.646A.5.5 0 0 0 3.5 18H5a1 1 0 0 1 1 1v1.5a.5.5 0 0 0 .854.354L9.5 18.207A1.7 1.7 0 0 0 10 17v-2a1 1 0 0 0-1-1z"
        {...s}
      />
      <Path d="M9.707 14.293 21 3" {...s} />
    </Svg>
  );
}

export function ArrowIcon({ size = 20, color = colors.white }: ArcheryIconProps) {
  const s = strokeProps(color);
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path d="M14 7v3h3l3 -3h-3v-3l-3 3" {...s} />
      <Path d="M14 10l-9 9" {...s} />
      <Path d="M5 15v4h4" {...s} />
    </Svg>
  );
}

/**
 * Two crossed swords — same icon (lucide "swords") as the website's
 * utfordringer quick action.
 */
export function SwordsIcon({ size = 20, color = colors.white }: ArcheryIconProps) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round">
      <Polyline points="14.5 17.5 3 6 3 3 6 3 17.5 14.5" />
      <Line x1={13} y1={19} x2={19} y2={13} />
      <Line x1={16} y1={16} x2={20} y2={20} />
      <Line x1={19} y1={21} x2={21} y2={19} />
      <Polyline points="14.5 6.5 18 3 21 3 21 6 17.5 10" />
      <Line x1={5} y1={14} x2={9} y2={18} />
      <Line x1={7} y1={17} x2={4} y2={20} />
      <Line x1={3} y1={19} x2={5} y2={21} />
    </Svg>
  );
}
